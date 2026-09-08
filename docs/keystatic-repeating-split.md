# Pressing Enter twice inside a repeating component splits it

Picked up from the image drop zones branch. Not caused by that work — it is reproducible on published
content — but that branch made it easy to hit, which is how it was found.

## What happens

Put the caret in an inline-editable child of a `repeating` component, press <kbd>Enter</kbd> twice to leave
the block, and the parent is cut in two at that point: the children before the caret stay in the original
node, the children after it end up in a new one. Every ancestor that cannot hold a paragraph is split the
same way, so a nested widget can come apart at several levels at once.

Leaving from the **last** child looks fine, because the split happens after everything and the second node is
discarded. Leaving from any earlier child is where content is visibly rearranged.

## Evidence

`/keystatic/collection/en%3Aresources-hosted/item/git-collaboration` — untouched published content. Click into
the first question of the multiple choice quiz, `End`, `Enter`, `Enter`. Counting the block labels the editor
renders:

```
BEFORE {"Quiz":1,"Multiple choice":2,"Question":4}
AFTER  {"Quiz":2,"Multiple choice":3,"Question":4}
```

Both the `Multiple choice` container and the `Quiz` around it were split.

## Why

`getCustomNodeSpecs` builds a `repeating` component's ProseMirror content expression as a flat alternation of
its allowed children — `node_modules/@keystatic/core/dist/index-4767f7d9.js`, the
`component.kind === 'repeating'` branch:

```js
content: `(${component.children.map(x => componentNames.get(x)).join(' | ')}){${min},${max}}`,
```

So `QuizChoice` is `(QuizChoiceQuestion | QuizChoiceAnswer | QuizSuccessMessage | QuizErrorMessage){1,}` — a
paragraph is not a legal child of it. When the second <kbd>Enter</kbd> lifts the empty paragraph out of the
question, ProseMirror keeps walking up until it finds a node that will accept a paragraph (the document), and
splits each node on the way that will not. The expression cannot express "a question, then answers", so every
arrangement of the allowed children is equally valid and splitting anywhere is legal.

## Which components are affected

Every `repeating` component whose children include an **inline-editable wrapper that is not the last child**.
A wrapper with `editChildrenIn: "modal"` is not affected, because its content is hidden in the document and
there is nowhere to press Enter.

Heterogeneous children, so ordering is meaningful — these are the ones to fix:

| component            | children                                                                                | confirmed                        |
| -------------------- | --------------------------------------------------------------------------------------- | -------------------------------- |
| `Quiz`               | QuizChoice, QuizImageHotspots, QuizFillInTheBlank, QuizDragTheWords, QuizImageDropZones | yes, splits as an ancestor       |
| `QuizChoice`         | QuizChoiceQuestion, QuizChoiceAnswer, QuizSuccessMessage, QuizErrorMessage              | yes                              |
| `QuizChoiceAnswer`   | QuizChoiceAnswerLabel, QuizChoiceAnswerErrorMessage                                     | label is a leading wrapper       |
| `QuizImageHotspots`  | QuizQuestion, QuizImageHotspot                                                          | question is a leading wrapper    |
| `QuizImageDropZones` | QuizQuestion, QuizImageDropZone                                                         | yes, as originally reported      |
| `Diagram`            | DiagramCodeBlock, DiagramCaption                                                        | code block is a leading wrapper  |
| `Worksheet`          | WorksheetDescription, WorksheetSection                                                  | description is a leading wrapper |
| `WorksheetSection`   | WorksheetSectionDescription, WorksheetQuestion                                          | description is a leading wrapper |

"Leading wrapper" means the child is a `wrapper` without `editChildrenIn: "modal"` and is not last, so the
caret can sit in it with siblings after it. Only `Quiz`, `QuizChoice` and `QuizImageDropZones` were actually
reproduced; the rest match the same shape and should be confirmed one by one.

Single child type, so a split rearranges nothing but still produces two containers where there was one —
lower priority, decide whether to cover them: `Carousel`, `Grid`, `ImageLayers`, `Tabs`.

## The fix

Let a component declare an **ordered** children pattern, and build the content expression from it, so that the
fragments a split would produce are invalid and ProseMirror refuses to split.

`QuizChoice` would become `QuizChoiceQuestion? (QuizChoiceAnswer | QuizSuccessMessage | QuizErrorMessage)+`.
Splitting after the question would leave a first node holding only `QuizChoiceQuestion`, which the expression
does not allow, so `canSplit` returns false and the command does not run.

The node names in the expression are mangled, so a raw string cannot be passed from our config — the pattern
has to be structured and mapped through `componentNames`, roughly:

```ts
childrenPattern: [
	{ name: "QuizChoiceQuestion", quantifier: "?" },
	{ name: ["QuizChoiceAnswer", "QuizSuccessMessage", "QuizErrorMessage"], quantifier: "+" },
];
```

Where to change it, in `patches/@keystatic__core.patch`:

- the `getCustomNodeSpecs` hunk (`@@ -20430,26 +20411,11 @@`) — read `component.childrenPattern` and fall back
  to the current expression when it is absent, so untouched components keep working
- the `.d.ts` hunks at the top of the patch — the patch already adds `editChildrenIn`, `onEditChildren`,
  `onSelect`, `contentLabel` and `layout` to the component config types, so declare the new field there too and
  pass it straight to `wrapper()`/`repeating()`, rather than casting at the call site

Regenerate with `pnpm patch @keystatic/core`, edit the printed directory, then
`pnpm patch-commit <dir>`. That rewrites the patch hash in `pnpm-lock.yaml`, which has to be committed.

## Decisions to make first

- **What happens instead.** Refusing the split may leave <kbd>Enter</kbd> doing nothing, which is a dead end
  for an author who is trying to get out of the block. Check what the keymap falls through to; it may need a
  command that puts the caret after the whole container instead. Verify this before settling on the approach —
  it is the part most likely to change the shape of the fix.
- **`QuizChoice` is used by published content** — 282 `QuizChoiceQuestion` tags across 14 entries under
  `content/` at the time of writing. Every one has to satisfy the new expression or the document will fail to
  parse. Audit for questions that are not first, or more than one per quiz, before tightening that component.
  The new widgets (`QuizImageDropZones`, `QuizImageHotspots`) have no published content yet, so they can be
  tightened freely and are the safest place to start.
- **Whether `validation.children.min/max` still applies.** It currently feeds the `{min,max}` quantifier; an
  ordered pattern supersedes it, so decide whether to keep honouring it or drop it for patterned components.

## How to verify

Reproduction, as a throwaway spec under `e2e/` (the config's `testDir` is `../e2e`, so it will not be picked
up from anywhere else). Needs a dev server on the port in `playwright.config.ts`:

```ts
const count = () =>
	page.evaluate(() =>
		[...document.querySelectorAll("div")]
			.map((node) => node.textContent)
			.filter((text) => text === "Quiz" || text === "Multiple choice" || text === "Question")
			.reduce<Record<string, number>>((acc, label) => ({ ...acc, [label]: (acc[label] ?? 0) + 1 }), {}),
	);
```

`data-component` attributes only exist when a node is serialized, not in the live editor, so counting the block
labels the chrome renders is the way to see containers. Fixed means the counts are unchanged after two
<kbd>Enter</kbd>s, for a caret in the first child and in a middle child, on each component in the table.

Keystatic's editor reads entries from git blobs, so a resource has to be committed before it shows up in the
CMS — an untracked file will not appear in the collection list.

## Notes

- Nothing needs to change in the widgets' runtime components. This is entirely an authoring-time problem.
- `QuizQuestion` (`components/content/quiz-question.tsx`) is the shared question block used by
  `QuizImageDropZones` and `QuizImageHotspots`. `QuizChoiceQuestion` is the older, choice-only equivalent; it
  was left alone because renaming it would mean migrating all the published content that uses it.

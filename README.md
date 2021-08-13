<!--lint disable first-heading-level-->

# DARIAH-Campus

DARIAH-Campus (D-C) is a combined discovery layer and hosting platform for all
learning resources associated with DARIAH-EU. As a discovery layer, D-C links to
existing, externally hosted, resources (such as #dariahTeach, PARTHENOS etc.);
and as a hosting platform, D-C offers a flexible framework for developing and
sharing web-based training materials, as well as capturing face-to-face events.

D-C materials are hosted and version-controlled in this GitHub repository and
will be delivered to the user as a Gatsby-based overlay website.

Authors and contributors will be provided with comprehensive author guidelines
on how to port existing or create new content for D-C in Markdown, a lightweight
markup language with plain text formatting syntax. The overarching aim of D-C is
to improve the openness, discoverability, usability, and long-term
sustainability of training resources, and to achieve best practice in the
production and management of open educational resources in the DARIAH ecosystem.

_Co-funded by the Horizon 2020 innovation and research programme of the European
Union under grant no. 731081._

## View content

Visit the website at [https://campus.dariah.eu](https://campus.dariah.eu).

## Contribute content

### Contribute or edit content via CMS

Sign-in to the CMS with your GitHub account at [https://campus.dariah.eu/admin].

For edits to articles you can also directly click the "Suggest changes to this
resource" links at the bottom of each post.

### Run a local CMS backend

You can run a local CMS backend which writes directly to the filesystem, and
does not require authentication, with `yarn cms:dev`. Then run either a
production build of the website with
`NEXT_PUBLIC_USE_LOCAL_CMS='true' yarn build && yarn start` or a development
build with `yarn dev` and visit
[http://localhost:3000/cms](http://localhost:3000/admin). Don't forget to commit
and push changes via `git`.

### Use your favorite text editor

Since content is saved to `.mdx` files in the `content/posts` folder, you can
use your favourite text editor to make changes and commit via git. When using VS
Code you can install the recommended extensions to get linting aud
auto-formatting for markdown.

### Edit directly on GitHub

It is also possible to use
[GitHub Codespaces](https://github.com/features/codespaces) to edit content
directly in the browser.

### Contributing guidelines

When contributing content directly via git, please use feature branches and
don't push to `main`, to allow for review.

### Note on writing Markdown

Content is saved in MDX format, which is markdown with custom JavaScript
components. Most markdown syntax is supported, however there are
[subtle parsing differences](https://github.com/micromark/mdx-state-machine#72-deviations-from-markdown)
to be aware of. Most notably: the "lesser than" sign `<` needs to be
HTML-escaped to `&lt;` (because it signifies the start of a custom component),
and similarly "autolinks" (`<https://example.com>` instead of
`[https://example.com](https://example.com)`) are not allowed.

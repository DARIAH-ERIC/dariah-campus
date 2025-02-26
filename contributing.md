# Contributing to DARIAH-Campus

DARIAH-Campus is a combined discovery layer and hosting platform for DARIAH learning resources. This
guide will help you understand the project architecture and how to contribute.

## Technology stack

### Core technologies

- **Next.js 15**: The main framework for building the application
- **TypeScript 5**: For type-safety
- **Node.js 22**: Required runtime environment
- **pnpm 10**: Package manager

### Key Components

#### Keystatic CMS

- Used for content management
- Provides a user-friendly interface for content editing
- Content is stored in MDX format
- Authentication is handled via GitHub OAuth, which is configured via
  [this GitHub App](https://github.com/organizations/DARIAH-ERIC/settings/apps/dariah-campus-keystatic-cms)
- Sign-in is available at `/admin`
- Configuration can be found in [`keystatic.config.tsx`](./keystatic.config.tsx)
- When developing locally, and no configuration for GitHub OAuth has been provided via environment
  variables, the CMS will save changes to the local filesystem and _not_ commit to GitHub
- Official docs: <https://keystatic.com/docs>

#### Typesense search

- Powers the search functionality
- Schema is defined in [`lib/typesense/schema.ts`](./lib/typesense/schema.ts)
- Search index is automatically built during deployment via
  [scripts/typesense/create-search-index.ts](./scripts/typesense/create-search-index.ts), which is
  triggered by the `build:search-index` npm script
- Uses off-the-shelf
  [InstantSearch components](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)
  for search UI
- Docker compose config available for local development
- Official docs: <https://typesense.org/docs/>

## Project structure

```
.
├── app/                  # Next.js app router components
│   ├── (app)/            # Main application routes
│   └── (cms)/            # Keystatic CMS routes
├── config/               # Configuration
├── components/           # Shared components
├── content/              # Content files in MDX format
│   ├── en/               # English content
├── lib/                  # Shared utilities
│   ├── content/          # Content-related utilities
│   ├── i18n/             # Internationalization
│   ├── keystatic/        # Keystatic configuration and helpers
│   └── typesense/        # Typesense configuration and helpers
├── public/               # Static assets
└── scripts/              # Build and utility scripts
```

Components and utilities which are needed in more than one route should be saved in the top-level
`components` and `lib` folders. Components and utilities which are only needed in a single route
should instead be co-located with that route in a `_components` or `_lib` folder. For example:

```
.
└── app/
    └── (app)/
		    └── search/
				    ├── _components/    # Components for search UI
				    └── _lib/           # Utilities for search
```

## Naming conventions

The project follows Next.js app router conventions and uses kebab-case for file and folder naming
These conventions are enforced with a [lint rule](./eslint.config.ts):

```ts
"check-file/filename-naming-convention": [
  "error",
  {
    "**/*": "KEBAB_CASE",
  },
  { ignoreMiddleExtensions: true },
],
"check-file/folder-naming-convention": [
  "error",
  {
    "**/": "NEXT_JS_APP_ROUTER_CASE",
  },
],
```

## Environment variables

All environment variables should be listed in [`.env.local.example`](`.env.local.example`), and
validated at runtime with the schema defined in [`config/env.config.ts`](./config/env.config.ts).

- `NEXT_PUBLIC_APP_BASE_URL`: base url of deployment domain
- `NEXT_PUBLIC_REDMINE_ID`: Redmine id needed for the acdh-ch imprint service
- `NEXT_PUBLIC_BOTS`: whether web crawler are allowed to index the site. allowed values are
  "disabled" and "enabled". defaults to "disabled", but is set to "enabled" for production
  deployments on Vercel
- `ENV_VALIDATION`: whether environment variable validation is enabled. allowed values are
  "disabled", "public" (which will only validate build-args prefixed with `NEXT_PUBLIC_`) and
  "enabled". defaults to "enabled"
- `NEXT_PUBLIC_MATOMO_BASE_URL` and `NEXT_PUBLIC_MATOMO_ID`: configuration for Matomo analytics
  service
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Google Search Console property verification token

### Typesense

- `NEXT_PUBLIC_TYPESENSE_COLLECTION`: Typesense collection name
- `NEXT_PUBLIC_TYPESENSE_HOST`: Typesense server host
- `NEXT_PUBLIC_TYPESENSE_PORT`: Typesense server port
- `NEXT_PUBLIC_TYPESENSE_PROTOCOL`: Typesense server protocol
- `NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY`: Typesense search-only api key, scoped to specific
  collection
- `TYPESENSE_ADMIN_API_KEY`: Typesense admin secret

### Keystatic

- `KEYSTATIC_GITHUB_CLIENT_ID`: GitHub client id, necessary for GitHub OAuth
- `KEYSTATIC_GITHUB_CLIENT_SECRET`: GitHub client secret, necessary for GitHub OAuth
- `KEYSTATIC_SECRET`: Keystatic secret
- `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`: Identifier of the GitHub App used for authentication
- `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME`: GitHub repository
- `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER`: GitHub organisation
- `NEXT_PUBLIC_KEYSTATIC_MODE`: whether to store changes to the local filesystem, or commit changes
  to GitHub. defaults to "local", should be set to "github" in production

## Content management

Content is managed using Keystatic CMS. The content structure includes:

- Resources (events, external, hosted, pathfinders)
- Curricula
- Tags (Topics)
- People
- Sources
- Documentation pages

Each content type is defined with a Keystatic collection schema in
[lib/keystatic/collections.ts](./lib/keystatic/collections.ts).

Custom components, which can be used as rich-text editor widgets, are defined in
[lib/keystatic/collections.ts](./lib/keystatic/components.ts). To correctly render these custom
components in the app, a React component must also be provided to the component mapping in
[mdx-components.tsx](./mdx-components.tsx).

In production, GitHub
[branch protection rules](https://github.com/DARIAH-ERIC/dariah-campus/settings/branches) enforce,
that nobody (except repository administrators) are allowed to push changes directly to the `main`
branch, but are required to create a new branch and open a pull request. The Keystatic UI helps
doing that.

## Search

The search functionality is powered by Typesense. The search schema is defined in
[lib/typesense/schema.ts](./lib/typesense/schema.ts).

### Development setup for Typesense

1. Start a local Typesense server

Create an api key and provide it as the `TYPESENSE_ADMIN_API_KEY` environment variable in
`.env.local`. Then run:

```bash
pnpm run dev:typesense:up
```

2. Create a search-only api key:

```bash
pnpm run typesense:api-key:create
```

This will print the api key to the console, which you then need to set as
`NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY` in `.env.local`:

3. Create and seed the collection:

```bash
pnpm run typesense:collection:create
pnpm run typesense:collection:seed
```

## Development Workflow

1. Install dependencies:

```bash
pnpm install
```

2. Copy the .env file template and set required environment variables:

```bash
cp .env.local.example .env.local
```

3. Start development server

```bash
pnpm run dev
```

4. Formatting, linting, and type-checking

```bash
pnpm run format:check
pnpm run lint:check
pnpm run types:check
```

Auto-fixable formatting and lint errors can be fixed with:

```bash
pnpm run format:fix
pnpm run lint:fix
```

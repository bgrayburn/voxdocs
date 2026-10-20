# Voxdocs

![animation of voxdocs being used to create and use a grocery list](./docs/voxdocs.gif)

[Try it out here!](https://voxdocs.brianrayburn.tech)

## Summary

This app was created as a simple example of building a UI utlizing OpenAI's APIs for data transforms.

## Setup

To use nix, make sure you have nix and devenv installed (and optionally direnv)

### Install dependencies

#### w/ Nix

This project is setup to use [`devenv`](https://devenv.sh) to manage a development environment, including dependencies and process management.
Assuming you have nix, devenv, and direnv installed, you need to `cd` into the root of the repo, then run `direnv allow` to install all of the dependencies used in the repo (or `devenv shell` if you aren't using direnv).

For the moment you need to `cd server && npm install` to install the server dependencies. This will be automated in a future release.

#### w/o Nix

#### Install Dependencies

**Base dependencies:**

- javascript/npm

**Libraries:**

- `npm install`
- `cd server && npm install`

### Create .env file

Please add a `.env` file to the root of the repo based on the `.env.example` file.

## Usage

### w/ Nix

In the root of the repo run `devenv up` to start the server.

### w/o Nix

#### 1. Start everything up

`npx concurrently "npm run dev" "cd server && npm run dev"` to run everything in one terminal.

## Testing

Use Node.js 22 and install both packages (`npm ci` and `npm ci --prefix server`). Run test commands from the repository root:

| Command                 | Purpose                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `npm test`              | Run Vitest unit, React rendering, and API integration tests once  |
| `npm run test:watch`    | Re-run affected tests while developing                            |
| `npm run test:coverage` | Report coverage and write an HTML report to `coverage/index.html` |
| `npm run test:e2e`      | Run the Chromium browser smoke test                               |

Before the first browser run, install Chromium with `npx playwright install chromium` (on Linux CI, use `npx playwright install --with-deps chromium`). Playwright starts Vite automatically.

On NixOS, use a system Chromium with its runtime dependencies: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="$(command -v chromium)" npm run test:e2e`.

### Strategy

- **Unit tests:** protect Markdown task-marker changes and AI request/response handling, including malformed responses and provider failures.
- **React tests:** render the actual Markdown pipeline in jsdom to check checkbox interaction for nested, ordered, quoted, and loose lists.
- **API integration tests:** exercise Express through Supertest, mocking only the AI utility. The app is exported separately from the listening server so tests do not start the production listener.
- **Browser smoke test:** exercises instruction submission, rendered output, checkbox editing, persistence after reload, and a follow-up instruction containing the current document.

Tests use mocked AI responses and need no API key, running backend, or paid API calls. They check application behavior, not live model quality. Add regression cases alongside affected code (`*.test.ts` / `*.test.tsx`); browser scenarios live under `tests/e2e/`.

GitHub Actions runs coverage, both builds, and the browser test on pushes and pull requests. Coverage reports and failure traces are uploaded as artifacts. Coverage is initially informational, with no percentage gate. Existing linting remains available through `npm run lint` and the devenv pre-commit hooks.

## Deployment

### Build the app

#### w/Nix

Run `build` in the root of the repo to build the app.

#### w/o Nix

Run `npm run build` in the root of the repo to build the client app.
Run `cd server && npm run build` to build the server app.

### Build and deploy the container

Login:

```
flyctl auth login
```

Make sure Dockers logged in:

```
flyctl auth docker
```

Create an app (only the first time):

```
flyctl apps create voxdocs
```

Allocate ipv4 (only the first time):

```
flyctl ips allocate-v4
```

Copy the container to fly.io registry:

```
devenv container copy voxdocs
```

Create a volume for `devenv` state (only the first time):

```
flyctl volumes create devenv_state --region ams --size 1
```

Deploy your app:

```
flyctl deploy
```

## Todo

- [ ] tighten up cors
- [x] use `response_format` set to `json_schema` instead of function to assure response object schema
- [ ] use `prediction` openai field to speed up generation
- [ ] ability to see diffs across updates
- [ ] look into eslint changes in original vite output `README.md`
- [x] add tests (https://vitest.dev/)
- [x] automate `npm i` for server
- [x] add CI (GitHub Actions tests and builds)
- [x] responsive for mobile usage
- [x] interactive checkboxes
- [ ] settings panel
- [ ] voice output (messages only)
- [ ] voice input
- [ ] user ability to store api key in local session and make requests from client avoiding the need for a deployed backend (?)
- [ ] mobile app version (?)
- [ ] history (?)
- [ ] document storage (?)
  - [x] localstorage
  - in url (?)
  - server side (?)

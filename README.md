# Voxdocs

![animation of voxdocs being used to create and use a grocery list](./docs/voxdocs.gif)

[Try it out here!](https://voxdocs.brianrayburn.tech)

## Summary

This app was created as a simple example of building a UI utlizing OpenAI's APIs for data transforms.

## Setup

To use nix, make sure you have nix and devenv installed (and optionally direnv)

### Install dependencies

#### w/ Nix

This project is setup to use [`devenv`](https://devenv.sh) to manage a development environment, including dependencies, process management, and in the future testing.
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
- [ ] ability to see diffs across updates
- [ ] look into eslint changes in original vite output `README.md`
- [ ] add tests (https://vitest.dev/)
- [x] automate `npm i` for server
- [ ] add CI/CD (github actions?)
- [ ] responsive for mobile usage
- [ ] interactive checkboxes
- [ ] settings panel
- [ ] voice output (messages only)
- [ ] voice input
- [ ] user ability to store api key in local session and make requests from client avoiding the need for a deployed backend (?)
- [ ] mobile app version (?)
- [ ] history (?)

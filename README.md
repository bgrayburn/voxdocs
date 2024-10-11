# Voxdocs

![animation of voxdocs being used to create and use a grocery list](./docs/voxdocs.gif)

## Summary

This app was created as a simple example of building a UI utlizing OpenAI's APIs for data transforms.

## Setup

To use nix, make sure you have nix and devenv installed (and optionally direnv)

### Install dependencies

#### w/ Nix

This project is setup to use [`devenv`](https://devenv.sh) to manage a development environment, including dependencies, process management, and in the future testing.
Assuming you have nix, devenv, and direnv installed, you need to `cd` into the root of the repo, then run `direnv allow` to install all of the dependencies used in the repo (or `devenv shell` if you aren't using direnv).

#### w/o Nix

#### Install Dependencies

**Base dependencies:**

- javascript/npm
  **Libraries:**
- `npm install`

### Create OpenAI assistant

Note the `assistant_id` from the output of doing this next step. You will need it when creating the `.env` file.

Use `https://platform.openai.com/assistants` to create a new assistant with the prompt found in `assistant/prompt.txt` file.

### Create .env file

Please add a `.env` file to the root of the repo based on the `.env.example` file.

## Usage

### w/ Nix

In the root of the repo run `devenv up` to start the server.

### w/o Nix

#### 1. Start everything up

Run `npm run dev`

## Todo

- [ ] remove dead config from src (left over from move from CRA)
- [ ] look into eslint changes in original vite output `README.md`
- [ ] create assistant using js script

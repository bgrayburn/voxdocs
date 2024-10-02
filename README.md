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

_coming..._

### Create OpenAI assistant

Note the `assistant_id` from the output of doing this. You will need it when creating the `.env` file.

#### w/ Nix

Run `create-assistant`

#### w/o Nix

Run `python scripts/create_assistant.py`

### Create .env file

Please add a `.env` file to the root of the repo based on the `.env.example` file.

## Usage

### w/ Nix

In the root of the repo run `devenv up` to start the server.

### w/o Nix

#### 1. Start the server

In the `backend` folder:
Run `cd voxdocs-server && uvicorn main:app --reload`

#### 2. Start the client

In the `ui` folder:
Run `npm run start`

## TODO

- [ ] responsive for mobile usage
- [ ] better documentation on setup (including non-nix instructions)
- [ ] custom checkbox rendering (use html checkbox)
- [ ] reduce dependency on assistants api
- [ ] user ability to store api key in local session and make requests from client avoiding the need for a deployed backend
- [ ] history
- [x] visual indication of pending instructions
- [ ] production deployment
- [ ] settings panel
- [ ] voice output (messages only)
- [ ] voice input
- [ ] mobile app version?

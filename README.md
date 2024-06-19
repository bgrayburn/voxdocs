# Voxdocs
__WARNING!:__ This software currently uses a single OpenAI thread for communications from all sessions meaning it's ripe for leaking data. For this and many other reasons, this software is a POC and not ready for production.
## Summary
This app was created as a simple example of building a UI utlizing OpenAI's APIs for data transforms. 

## Assistant Creation
_coming..._

## Install
Please add a `.env` file to the root of the repo based on the `.env.example` file. 

### w/ Nix
This project is setup to use [`devenv`](https://devenv.sh) to manage a development environment, including dependencies, process management, and in the future testing.
Assuming you have nix, devenv, and direnv installed, you need to `cd` into the root of the repo, then run `direnv allow` to fully install the repo.

### w/o Nix
_coming..._

## Usage
### w/ Nix
In the root of the repo

## TODO
- [ ] thread per session to avoid leaking data
- [ ] reduce dependency on assistants api
- [ ] user ability to store api key in local session and make requests from client avoiding the need for a deployed backend
- [ ] history
- [ ] visual indication of pending instructions

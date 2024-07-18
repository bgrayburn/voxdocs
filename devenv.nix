{ pkgs, lib, config, inputs, ... }:

{
  processes.ui.exec = "cd $DEVENV_ROOT/ui && npm run start";
  processes.backend.exec = "cd $DEVENV_ROOT/backend/voxdocs-server && uvicorn main:app --reload";

  pre-commit.hooks = {
    prettier.enable = true;
    shellcheck.enable = true;
    nixpkgs-fmt.enable = true;
    statix.enable = true;
    black.enable = true;
    ruff.enable = true;
  };

  difftastic.enable = true;
  dotenv.enable = true;
}

{ pkgs, lib, config, inputs, ... }:

rec {
  processes.ui.exec = "cd $DEVENV_ROOT/ui && npm run start";
  processes.backend.exec = ''
    cd $DEVENV_ROOT/backend/voxdocs-server && \
       uvicorn main:app --reload --host 0.0.0.0
  '';

  # useful for debugging
  scripts.run-backend.exec = config.processes.backend.exec;

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

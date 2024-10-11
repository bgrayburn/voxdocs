{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/languages/
  languages.typescript.enable = true;
  languages.javascript = {
    enable = true;
    npm.install.enable = true;
  };

  packages = with pkgs; [] ++ lib.optionals (!config.container.isBuilding) [
    gh
    flyctl
  ];

  scripts.github.exec = "gh repo view -w";

  # https://devenv.sh/pre-commit-hooks/
  pre-commit.hooks.prettier.enable = true;

  containers.processes.name = "voxdocs";
  containers.processes.registry = "docker://registry.fly.io/";
  containers.processes.defaultCopyArgs = [
    "--dest-creds"
    "x:\"$(${pkgs.flyctl}/bin/flyctl auth token)\""
  ];

  dotenv.enable = true;
  difftastic.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}

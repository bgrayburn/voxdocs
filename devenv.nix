{ pkgs, lib, config, inputs, ... }:

let
  isBuilding = config.container.isBuilding;
in 
{
  name = "voxdocs";

  processes.client.exec = "npm run dev -- --host";
  processes.server.exec = "cd server && npm run dev";

  # process.managers.overmind.enable = true;
  # process.managers.process-compose.enable = false;

  scripts.build.exec = "build-server && build-client";
  scripts.build-server.exec = "cd server && npm run build";
  scripts.build-client.exec = "npm run build";
  scripts.prod-serve.exec = "ENV=prod node ./dist/server.js";

  # https://devenv.sh/languages/
  languages.typescript.enable = !isBuilding;
  languages.javascript = {
    enable = true;
    npm.install.enable = !isBuilding;
  };

  packages = with pkgs; [] ++ lib.optionals (!isBuilding) [
    gh
    flyctl
  ];

  scripts.github.exec = "gh repo view -w";

  # https://devenv.sh/pre-commit-hooks/
  pre-commit.hooks.prettier.enable = !isBuilding;

  containers."voxdocs".name = "voxdocs";
  containers."voxdocs".registry = "docker://registry.fly.io/";
  containers."voxdocs".copyToRoot = ./dist;
  containers."voxdocs".startupCommand = "node server.js";
  containers."voxdocs".defaultCopyArgs = [
    "--dest-creds"
    "x:\"$(${pkgs.flyctl}/bin/flyctl auth token)\""
  ];


  dotenv.enable = true;
  difftastic.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}

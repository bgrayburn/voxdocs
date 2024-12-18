{ pkgs, lib, config, inputs, ... }:

let
  isBuilding = config.container.isBuilding;
in 
{
  process.manager.implementation = "overmind";
  processes.client.exec = "npm run dev -- --host";
  processes.server.exec = "cd server && npm run dev";

  scripts.build.exec = "rm -rf $DEVENV_ROOT/dist && build-server && build-client";
  scripts.build-server.exec = "cd server && npm run build";
  scripts.build-client.exec = "npm run build";
  scripts.prod-serve.exec = "ENV=prod node ./dist/server.mjs";
  scripts.deploy.exec = "devenv container copy voxdocs && flyctl deploy";

  # https://devenv.sh/languages/
  languages.typescript.enable = !isBuilding;
  languages.javascript = {
    enable = true;
    npm.install.enable = !isBuilding;
  };

  enterShell = if !isBuilding then ''
    [ ! -d $DEVENV_ROOT/server/node_modules ] && cd $DEVENV_ROOT/server && npm i
  '' else "";

  packages = with pkgs; [] ++ lib.optionals (!isBuilding) [
    gh
    flyctl
  ] ++ lib.optionals (isBuilding) [
    cacert
  ];

  scripts.github.exec = "gh repo view -w";

  # https://devenv.sh/pre-commit-hooks/
  pre-commit.hooks.prettier.enable = !isBuilding;
  pre-commit.hooks.eslint.enable = !isBuilding;

  containers."voxdocs".name = "voxdocs";
  containers."voxdocs".registry = "docker://registry.fly.io/";
  containers."voxdocs".copyToRoot = ./dist;
  containers."voxdocs".startupCommand = "node server.mjs";
  containers."voxdocs".defaultCopyArgs = [
    "--dest-creds"
    "x:\"$(${pkgs.flyctl}/bin/flyctl auth token)\""
  ];


  dotenv.enable = !isBuilding;
  difftastic.enable = !isBuilding;

  # See full reference at https://devenv.sh/reference/options/
}

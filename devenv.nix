{ pkgs, lib, config, inputs, ... }:

let
  isBuilding = config.container.isBuilding;
in 
{
  processes.client.exec = "pnpm dev --host";
  processes.server.exec = "pnpm --dir server dev";

  scripts.build.exec = "rm -rf $DEVENV_ROOT/dist && build-server && build-client";
  scripts.build-server.exec = "pnpm --dir server build";
  scripts.build-client.exec = "pnpm build";
  scripts.prod-serve.exec = "ENV=prod node ./dist/server.mjs";
  scripts.deploy.exec = "devenv container copy voxdocs && flyctl deploy";

  # https://devenv.sh/languages/
  languages.typescript.enable = !isBuilding;
  languages.javascript = {
    enable = true;
    # Corepack uses the pnpm version pinned in package.json.
    corepack.enable = true;
  };

  enterShell = if !isBuilding then ''
    pnpm --dir "$DEVENV_ROOT" install --frozen-lockfile
    pnpm --dir "$DEVENV_ROOT/server" install --frozen-lockfile
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
  delta.enable = !isBuilding;

  # See full reference at https://devenv.sh/reference/options/
}

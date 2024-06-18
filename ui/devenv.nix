{ pkgs, ... }:

{
  # https://devenv.sh/languages/
  languages.typescript.enable = true;
  languages.javascript = {
    enable = true;
    npm.install.enable = true;
  };

  # https://devenv.sh/processes/
  processes.voxdocs-web.exec = "npm run start";

  difftastic.enable = true;
  # See full reference at https://devenv.sh/reference/options/
}

{ pkgs, ... }:

{
  languages.typescript.enable = true;
  languages.javascript = {
    enable = true;
    npm.install.enable = true;
    directory = "./ui";
  };

  difftastic.enable = true;
}

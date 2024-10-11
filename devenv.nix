{ pkgs, lib, config, inputs, ... }:

{
  packages = with pkgs; [
    gh
  ];

  scripts.github.exec = 'gh repo view -w';

  # https://devenv.sh/languages/
  languages.typescript.enable = true;
  languages.javascript = {
    enable = true;
    npm.install.enable = true;
  };

  # https://devenv.sh/pre-commit-hooks/
  pre-commit.hooks.prettier.enable = true;

  dotenv.enable = true;
  difftastic.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}

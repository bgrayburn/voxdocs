{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  pre-commit.hooks = {
    biome.enable = true;
    shellcheck.enable = true;
    nixpkgs-fmt.enable = true;
    statix.enable = true;
    black.enable = true;
    ruff.enable = true;
  };
}

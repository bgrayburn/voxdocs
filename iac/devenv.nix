{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/packages/
  packages = with pkgs; [ git opentofu doctl ];

  # https://devenv.sh/scripts/
  scripts.plan.exec = ''
    cd $DEVENV_ROOT/iac && tofu plan -out plan
  '';
  scripts.deploy.exec = ''
    cd $DEVENV_ROOT/iac && tofu apply plan
  '';
  # scripts.destroy.exec = ''
  #   cd $DEVENV_ROOT/iac && tofu destroy -auto-approve
  # '';
}

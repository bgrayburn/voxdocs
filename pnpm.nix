{ lib, stdenv, stdenvNoCC, fetchurl, autoPatchelfHook }:

let
  # Keep in sync with packageManager in both package.json files.
  version = "12.14.0";
  targets = {
    x86_64-linux = {
      name = "linux-x64";
      hash = "sha512-F6K8e/jWxiuEYJaQtRRUG9ynBSTEHa+t7Lf86MKuOO5UA7WVVMbi+oB8nY6iKW++ncWS2yG6T9faXZGxqNsfoQ==";
    };
    aarch64-linux = {
      name = "linux-arm64";
      hash = "sha512-7joGShZ44Nk3WpNU+60JoOPjCXlgxhJAq11S2UiVtwCUDgTer1yTPPfxGW8pxaD6046actYLIYDbZNlubHWs0A==";
    };
    x86_64-darwin = {
      name = "darwin-x64";
      hash = "sha512-vlBfGkruqQRsEHTW43cPwpYd7QlbIJ//cvpAdb3bVXkI8SgTPoXhCnc05m+ZNiPrrEkBsX/t7KHw9aXpkzPm3Q==";
    };
    aarch64-darwin = {
      name = "darwin-arm64";
      hash = "sha512-tnrdUB8ecJoehuKKqi1YHCBVl61xtJ9XVGcx5EviC6fWO4DeGI8GtXrjvJxDBM3nuVjJeWistgsUp/N142x4sw==";
    };
  };
  target = targets.${stdenv.hostPlatform.system};
in
stdenvNoCC.mkDerivation {
  pname = "pnpm";
  inherit version;

  src = fetchurl {
    url = "https://registry.npmjs.org/@pnpm/exe.${target.name}/-/exe.${target.name}-${version}.tgz";
    inherit (target) hash;
  };

  nativeBuildInputs = lib.optionals stdenv.hostPlatform.isLinux [ autoPatchelfHook ];
  buildInputs = lib.optionals stdenv.hostPlatform.isLinux [ stdenv.cc.cc.lib ];
  dontConfigure = true;
  dontBuild = true;

  installPhase = ''
    runHook preInstall
    install -Dm755 pnpm "$out/bin/pnpm"
    ln -s pnpm "$out/bin/pn"
    runHook postInstall
  '';

  meta = {
    description = "Fast, disk space efficient package manager for JavaScript";
    homepage = "https://pnpm.io/";
    license = lib.licenses.mit;
    mainProgram = "pnpm";
    platforms = builtins.attrNames targets;
  };
}

{ config, lib, pkgs, ... }:

let
  cfg = config.services.recipiz;

  frontend = pkgs.buildNpmPackage {
    pname = "recipiz-frontend";
    version = "0.1.0";

    src = ../frontend;

    npmDepsHash =
      "sha256-6J2TN4wfxZPzXZf+Dds0Q/dXgxijwIHDAJS6KVjmYoI=";

    buildPhase = ''
      VITE_API_URL=http://localhost:3000 npm run build
    '';

    installPhase = ''
      mkdir -p $out
      cp -r dist/* $out/
    '';
  };
in
{
  systemd.services.recipiz-frontend = lib.mkIf cfg.enable {
    description = "Recipiz frontend";

    after = [
      "network-online.target"
    ];

    wants = [
      "network-online.target"
    ];

    wantedBy = [
      "multi-user.target"
    ];

    serviceConfig = {
      ExecStart =
        "${pkgs.nodePackages.serve}/bin/serve " +
        "-s ${frontend} " +
        "-l tcp://0.0.0.0:${toString cfg.frontendPort}";

      Restart = "always";
      RestartSec = 2;
    };
  };
}

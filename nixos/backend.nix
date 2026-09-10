{ config, lib, pkgs, ... }:

let
  cfg = config.services.recipiz;
  backend = pkgs.buildNpmPackage {
    pname = "recipiz-backend";
    version = "0.1.0";

    src = ../backend;

    npmDepsHash = lib.fakeSha256;
    # npmDepsHash = "";

    dontNpmBuild = true;

    installPhase = ''
      mkdir -p $out
      cp -r . $out/
    '';
  };
in
{
  users.groups.recipiz = {};

  users.users.recipiz = {
    isSystemUser = true;
    group = "recipiz";
  };

  systemd.services.recipiz-backend = lib.mkIf cfg.enable {
    description = "Recipiz backend";

    after = [
      "network-online.target"
      "postgresql.service"
    ];

    wants = [
      "network-online.target"
    ];

    requires = [
      "postgresql.service"
    ];

    wantedBy = [
      "multi-user.target"
    ];

    environment = {
      RECIPIZ_BACKEND_PORT =
        toString cfg.backendPort;

      RECIPIZ_CORS_ORIGIN =
        cfg.corsOrigin;

      RECIPIZ_DB_USER =
        cfg.database.user;

      RECIPIZ_DB_HOST =
        cfg.database.host;

      RECIPIZ_DB_NAME =
        cfg.database.name;
    };

    serviceConfig = {
      User = "recipiz";
      Group = "recipiz";

      WorkingDirectory = backend;

      ExecStart =
        "${pkgs.nodejs}/bin/node ${backend}/index.js";

      Restart = "always";
      RestartSec = 2;
    };
  };
}

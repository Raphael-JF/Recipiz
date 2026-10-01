{ config, lib, pkgs, ... }:

let
  cfg = config.services.recipiz;
  backendDir = "/var/lib/recipiz/backend";
  src = ../backend;
in
{
  users.groups.recipiz = {};

  users.users.recipiz = {
    isSystemUser = true;
    group = "recipiz";
  };

  systemd.services.recipiz-backend-install = {
    description = "Install Recipiz backend";

    postStop = ''
      ${pkgs.systemd}/bin/systemctl restart recipiz-backend.service
    '';

    serviceConfig = {
      Type = "oneshot";
      User = "recipiz";
    };

    script = ''
      rm -rf ${backendDir}
      mkdir -p ${backendDir}

      cp -r ${src}/* ${backendDir}/

      cd ${backendDir}
      ${pkgs.nodejs}/bin/npm install --omit=dev
    '';
  };


  systemd.services.recipiz-backend = lib.mkIf cfg.enable {
    description = "Recipiz backend";

    after = [
      "network-online.target"
      "postgresql.service"
    ];

    requires = [
      "postgresql.service"
    ];

    wantedBy = [
      "multi-user.target"
    ];

    environment = {
      RECIPIZ_BACKEND_PORT = toString cfg.backendPort;
      RECIPIZ_CORS_ORIGIN = cfg.corsOrigin;

      RECIPIZ_DB_USER = cfg.database.user;
      RECIPIZ_DB_HOST = cfg.database.host;
      RECIPIZ_DB_NAME = cfg.database.name;
    };

    serviceConfig = {
      User = "recipiz";
      Group = "recipiz";

      WorkingDirectory = backendDir;

      ExecStart =
        "${pkgs.nodejs}/bin/node ${backendDir}/index.js";

      Restart = "always";
      RestartSec = 2;
    };
  };
}

{ config, lib, pkgs, ... }:

let
  cfg = config.services.recipiz;
  backendDir = "${cfg.packageDirectory}/backend";
  backendSrc = ../backend;
in
{
  systemd.services.recipiz-backend-install = {
    description = "Install Recipiz backend";

    wantedBy = [ "multi-user.target" ];
    before = [ "recipiz-backend.service" ];
    wants = [ "network-online.target" ];
    after = [ "network-online.target" ];

    restartTriggers = [ backendSrc ];

    serviceConfig = {
      Type = "oneshot";
      RemainAfterExit = true;
      User = "recipiz";
    };

    script = ''
      stamp=${backendDir}/.installed-from
      if [ -f "$stamp" ] && [ "$(cat "$stamp")" = "${backendSrc}" ]; then
        echo "Backend already installed from ${backendSrc}, skipping"
        exit 0
      fi

      rm -rf ${backendDir}
      mkdir -p ${backendDir}
      cp -r ${backendSrc}/* ${backendDir}/
      cd ${backendDir}
      ${pkgs.nodejs}/bin/npm install --omit=dev

      chown -R recipiz:recipiz /var/lib/recipiz/backend
      chmod -R u=rwX,g=rX,o= /var/lib/recipiz/backend
      echo "${backendSrc}" > "$stamp"
    '';
  };

  systemd.services.recipiz-backend = lib.mkIf cfg.enable {
    description = "Recipiz backend";

    after = [
      "recipiz-backend-install.service"
      "network-online.target"
      "postgresql.service"
    ];

    requires = [
      "network-online.target"
      "recipiz-backend-install.service"
      "postgresql.service"
    ];

    wantedBy = [
      "multi-user.target"
    ];

    restartTriggers = [ backendSrc ];

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

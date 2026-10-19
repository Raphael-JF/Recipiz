{ config, lib, pkgs, ... }:

let
  cfg = config.services.recipiz;
  sql = ../sql;
in
{
  services.postgresql = {
    ensureDatabases = [ "recipiz" ];

    ensureUsers = [
      {
        name = "recipiz";
        ensureDBOwnership = true;
      }
    ];
  };

  systemd.services.recipiz-init-database = lib.mkIf cfg.enable {
    description = "Initialize Recipiz database";

    after = [
      "postgresql.service"
    ];
    requires = [
      "postgresql.service"
    ];
    before = [
      "recipiz-backend.service"
    ];
    wantedBy = [
      "multi-user.target"
    ];

    serviceConfig = {
      Type = "oneshot";
      User = "recipiz";
      Group = "recipiz";
    };

    script = ''
      set -e

      "${pkgs.postgresql_18}/bin/psql" \
      -d "recipiz" \
      -v ON_ERROR_STOP=1 \
      -f "${sql}/init_prod.sql"
    '';
  };

  # Backup PostgreSQL database
  systemd.tmpfiles.rules = [
    "d /data/backupPostgresql/recipiz 0700 recipiz recipiz -"
  ];
  systemd.services.recipiz-backup-database = {
    description = "Backup Recipiz PostgreSQL database";

    after = [ "postgresql.service" ];
    requires = [ "postgresql.service" ];

    serviceConfig = {
      Type = "oneshot";
      User = "recipiz";
      Group = "recipiz";
    };

    script = ''
      ${pkgs.postgresql_18}/bin/pg_dump -U recipiz -d recipiz \
        --file=/data/backupPostgresql/recipiz/dump.sql
    '';
  };

  systemd.timers.recipiz-backup-database = {
    description = "Daily backup of Recipiz PostgreSQL database";

    wantedBy = [ "timers.target" ];

    timerConfig = {
      OnCalendar = "*-*-* 04:00:00";
      Persistent = true;
    };
  };
}

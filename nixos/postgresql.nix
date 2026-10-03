{ config, lib, pkgs, ... }:

let
  cfg = config.services.recipiz;
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

      PSQL="${pkgs.postgresql_18}/bin/psql"
           "$PSQL" \
        -d "recipiz" \
        -v ON_ERROR_STOP=1 \
        -f "${../sql/init_prod.sql}"
    '';
  };
}

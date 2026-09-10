{ config, lib, pkgs, ... }:

let
  cfg = config.services.recipiz;
in
{
  services.postgresql = lib.mkIf cfg.enable {
    enable = true;
    package = pkgs.postgresql_18;

    ensureDatabases = [
      cfg.database.name
    ];

    ensureUsers = [
      {
        name = cfg.database.user;
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

    wantedBy = [
      "multi-user.target"
    ];

    serviceConfig = {
      Type = "oneshot";
      User = "postgres";
      RemainAfterExit = true;
    };

    script = ''
      ${pkgs.postgresql_18}/bin/psql \
        -d ${cfg.database.name} \
        -v ON_ERROR_STOP=1 \
        -f ${./init_prod.sql}
    '';
  };
}

{ pkgs, ... }:

{
  services.postgresql = {
    ensureDatabases = [
      "recipiz"
    ];

    ensureUsers = [
      {
        name = "recipiz";
        ensureDBOwnership = true;
      }
    ];
  };
  systemd.services.recipizInitDatabase = {
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
      User = "recipiz";
    };

    script = ''
      ${pkgs.postgresql_18}/bin/psql \
        -d recipiz \
        -f ${./init_prod.sql}
    '';
  };
}

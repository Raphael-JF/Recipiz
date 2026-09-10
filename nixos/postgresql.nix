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
    initialScript = ./init_prod.sql;
  };
}

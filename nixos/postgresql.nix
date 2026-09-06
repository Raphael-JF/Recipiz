{ pkgs, ... }:

{
  services.postgresql = {
    enable = true;
    package = pkgs.postgresql_18;

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
}

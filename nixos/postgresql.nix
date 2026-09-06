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
}

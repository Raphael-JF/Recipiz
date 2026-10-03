{ lib, ... }:

{
  options.services.recipiz = {
    enable = lib.mkEnableOption "Recipiz";

    packageDirectory = lib.mkOption {
      type = lib.types.path;
      description = "Working directory for the Recipiz backend.";
    };

    backendPort = lib.mkOption {
      type = lib.types.port;
      description = "Port used by the Recipiz backend.";
    };

    frontendUrl = lib.mkOption {
      type = lib.types.str;
      description = "CORS origin allowed by the backend.";
    };
  };
}

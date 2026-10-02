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

    frontendPort = lib.mkOption {
      type = lib.types.port;
      description = "Port used by the Recipiz frontend.";
    };

    corsOrigin = lib.mkOption {
      type = lib.types.str;
      description = "CORS origin allowed by the backend.";
    };

    database = {
      host = lib.mkOption {
        type = lib.types.str;
        description = "PostgreSQL Unix socket directory.";
      };

      name = lib.mkOption {
        type = lib.types.str;
        description = "PostgreSQL database name.";
      };

      user = lib.mkOption {
        type = lib.types.str;
        description = "PostgreSQL user.";
      };
    };
  };
}

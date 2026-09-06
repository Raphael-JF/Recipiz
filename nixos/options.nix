{ lib, ... }:

{
  options.services.recipiz = {
    enable = lib.mkEnableOption "Recipiz";

    backendPort = lib.mkOption {
      type = lib.types.port;
      default = 3000;
      description = "Port used by the Recipiz backend.";
    };

    frontendPort = lib.mkOption {
      type = lib.types.port;
      default = 5173;
      description = "Port used by the Recipiz frontend.";
    };

    corsOrigin = lib.mkOption {
      type = lib.types.str;
      default = "http://localhost:5173";
      description = "CORS origin allowed by the backend.";
    };

    database = {
      host = lib.mkOption {
        type = lib.types.str;
        default = "/run/postgresql";
        description = "PostgreSQL Unix socket directory.";
      };

      name = lib.mkOption {
        type = lib.types.str;
        default = "recipiz";
        description = "PostgreSQL database name.";
      };

      user = lib.mkOption {
        type = lib.types.str;
        default = "recipiz";
        description = "PostgreSQL user.";
      };
    };
  };
}

{
  description = "Recipiz with reusable NixOS module";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];

      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = import nixpkgs {
            inherit system;
          };
        in
        {
          backend = pkgs.buildNpmPackage {
            pname = "recipiz-backend";
            version = "0.1.0";

            src = ./backend;

            npmDepsHash = "sha256-UP6nPJOib8rLnlwkmCdpEgo9Eb7xuPLcYRoFdzYmw2Y=";

            dontNpmBuild = true;

            installPhase = ''
              mkdir -p $out
              cp -r . $out/
            '';
          };
          frontend = pkgs.buildNpmPackage {
            pname = "recipiz-frontend";
            version = "0.1.0";

            src = ./frontend;

            npmDepsHash = "sha256-6J2TN4wfxZPzXZf+Dds0Q/dXgxijwIHDAJS6KVjmYoI=";

            buildPhase = ''
              VITE_API_URL=${builtins.toString "http://localhost:3000"} npm run build
            '';

            installPhase = ''
              mkdir -p $out
              cp -r dist/* $out/
            '';
          };

          default = self.packages.${system}.frontend;
        }
      );

      nixosModules.Recipiz = { config, lib, pkgs, ... }:
        let
          cfg = config.services.recipiz;

          backend = self.packages.${pkgs.system}.backend;
          frontend = self.packages.${pkgs.system}.frontend;
        in
        {
          options.services.recipiz = {
            enable = lib.mkEnableOption "Recipiz stack";

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

            apiUrl = lib.mkOption {
              type = lib.types.str;
              default = "http://localhost:3000";
              description = "API URL baked into the frontend build.";
            };

            corsOrigin = lib.mkOption {
              type = lib.types.str;
              default = "http://localhost:5173";
              description = "CORS origin allowed by the backend.";
            };

            database = {
              host = lib.mkOption {
                type = lib.types.str;
                default = "localhost";
                description = "PostgreSQL host.";
              };

              port = lib.mkOption {
                type = lib.types.port;
                default = 5432;
                description = "PostgreSQL port.";
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

              password = lib.mkOption {
                type = lib.types.str;
                default = "recipiz";
                description = "PostgreSQL password.";
              };
            };
          };

          config = lib.mkIf cfg.enable {
            services.postgresql = {
              enable = true;

              initialScript = pkgs.writeText "recipiz-init.sql"
                (builtins.readFile ./backend/init.sql);
            };

            systemd.services.recipiz-backend = {
              description = "Recipiz backend";

              after = [
                "network-online.target"
                "postgresql.service"
              ];

              wants = [
                "network-online.target"
              ];

              requires = [
                "postgresql.service"
              ];

              wantedBy = [
                "multi-user.target"
              ];

              environment = {
                RECIPIZ_BACKEND_PORT = toString cfg.backendPort;
                RECIPIZ_CORS_ORIGIN = cfg.corsOrigin;

                RECIPIZ_DB_USER = cfg.database.user;
                RECIPIZ_DB_HOST = cfg.database.host;
                RECIPIZ_DB_NAME = cfg.database.name;
                RECIPIZ_DB_PASSWORD = cfg.database.password;
                RECIPIZ_DB_PORT = toString cfg.database.port;
              };

              serviceConfig = {
                WorkingDirectory = backend;

                ExecStart =
                  "${pkgs.nodejs}/bin/node ${backend}/index.js";

                Restart = "always";
                RestartSec = 2;
              };
            };

            systemd.services.recipiz-frontend = {
              description = "Recipiz frontend";

              after = [
                "network-online.target"
              ];

              wants = [
                "network-online.target"
              ];

              wantedBy = [
                "multi-user.target"
              ];

              serviceConfig = {
                ExecStart =
                  "${pkgs.nodePackages.serve}/bin/serve " +
                  "-s ${frontend} " +
                  "-l tcp://0.0.0.0:${toString cfg.frontendPort}";

                Restart = "always";
                RestartSec = 2;
              };
            };
          };
        };

      nixosModules.default = self.nixosModules.Recipiz;
    };
}

{
  description = "Recipiz with reusable NixOS module";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];

      mkBackendPackage = pkgs:
        pkgs.buildNpmPackage {
          pname = "recipiz-backend";
          version = "0.1.0";
          src = ./backend;
          npmDepsHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
          npmBuild = "true";

          installPhase = ''
            runHook preInstall
            mkdir -p $out/lib/recipiz-backend
            cp -r . $out/lib/recipiz-backend
            cp -r node_modules $out/lib/recipiz-backend/node_modules
            mkdir -p $out/bin
            cat > $out/bin/recipiz-backend <<EOF
            #!${pkgs.runtimeShell}
            exec ${pkgs.nodejs}/bin/node $out/lib/recipiz-backend/index.js
            EOF
            chmod +x $out/bin/recipiz-backend
            runHook postInstall
          '';
        };

      mkFrontendPackage = pkgs: apiUrl:
        pkgs.buildNpmPackage {
          pname = "recipiz-frontend";
          version = "0.1.0";
          src = ./frontend;
          npmDepsHash = "sha256-BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=";
          VITE_API_URL = apiUrl;

          installPhase = ''
            runHook preInstall
            mkdir -p $out/share/recipiz-frontend
            cp -r dist/* $out/share/recipiz-frontend/
            runHook postInstall
          '';
        };

      mkModule = { config, pkgs, lib, ... }:
        let
          cfg = config.services.recipiz;
        in
        {
          config = lib.mkIf cfg.enable {
            services.postgresql = {
              enable = true;
              initialScript = pkgs.writeText "recipiz-init.sql" (builtins.readFile ./backend/init.sql);
            };

            systemd.services.recipiz-backend = {
              description = "Recipiz backend";
              after = [ "postgresql.service" ];
              wantedBy = [ "multi-user.target" ];
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
                ExecStart = "${cfg.backendPackage}/bin/recipiz-backend";
                Restart = "always";
                DynamicUser = true;
              };
            };

            systemd.services.recipiz-frontend = {
              description = "Recipiz frontend";
              after = [ "network-online.target" ];
              wantedBy = [ "multi-user.target" ];
              serviceConfig = {
                ExecStart = "${pkgs.nodePackages.serve}/bin/serve -s ${cfg.frontendPackage}/share/recipiz-frontend -l tcp://0.0.0.0:${toString cfg.frontendPort}";
                Restart = "always";
                DynamicUser = true;
              };
            };
          };

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

            backendPackage = lib.mkOption {
              type = lib.types.package;
              default = self.packages.${pkgs.system}.recipiz-backend;
              description = "Backend package for Recipiz.";
            };

            frontendPackage = lib.mkOption {
              type = lib.types.package;
              default = mkFrontendPackage pkgs cfg.apiUrl;
              description = "Frontend package for Recipiz.";
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
        };
    in
    (flake-utils.lib.eachSystem systems (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        packages = {
          recipiz-backend = mkBackendPackage pkgs;
          recipiz-frontend = mkFrontendPackage pkgs "http://localhost:3000";
          default = mkBackendPackage pkgs;
        };
      })) // {
      nixosModules = {
        Recipiz = mkModule;
        default = mkModule;
      };
    };
}

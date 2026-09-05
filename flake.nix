{
  description = "Recipiz with reusable NixOS module";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      forAllSystems = nixpkgs.lib.genAttrs [ "x86_64-linux" "aarch64-linux" ];
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.writeText "recipiz" "Use nixosModules.Recipiz from this flake.";
        });

      nixosModules.Recipiz = { config, lib, pkgs, ... }:
        let
          cfg = config.services.recipiz;
          backendSrc = "${self}/backend";
          frontendSrc = "${self}/frontend";
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
              description = "Port used by the Recipiz frontend static server.";
            };

            apiUrl = lib.mkOption {
              type = lib.types.str;
              default = "http://localhost:3000";
              description = "API URL baked into frontend build.";
            };

            corsOrigin = lib.mkOption {
              type = lib.types.str;
              default = "http://localhost:5173";
              description = "CORS origin allowed by backend.";
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
              initialScript = pkgs.writeText "recipiz-init.sql" (builtins.readFile ./backend/init.sql);
            };

            systemd.tmpfiles.rules = [
              "d /var/lib/recipiz 0755 root root -"
              "d /var/lib/recipiz/backend 0755 root root -"
              "d /var/lib/recipiz/frontend 0755 root root -"
              "d /var/lib/recipiz/frontend-dist 0755 root root -"
            ];

            systemd.services.recipiz-prepare = {
              description = "Prepare Recipiz runtime files";
              after = [ "network-online.target" "postgresql.service" ];
              wants = [ "network-online.target" "postgresql.service" ];
              before = [ "recipiz-backend.service" "recipiz-frontend.service" ];
              wantedBy = [ "multi-user.target" ];
              path = [ pkgs.nodejs pkgs.rsync ];
              serviceConfig.Type = "oneshot";
              script = ''
                rsync -a --delete ${backendSrc}/ /var/lib/recipiz/backend/
                rsync -a --delete ${frontendSrc}/ /var/lib/recipiz/frontend/

                cd /var/lib/recipiz/backend
                npm ci --omit=dev

                cd /var/lib/recipiz/frontend
                npm ci
                VITE_API_URL=${lib.escapeShellArg cfg.apiUrl} npm run build
                rm -rf /var/lib/recipiz/frontend-dist/*
                cp -r dist/* /var/lib/recipiz/frontend-dist/
              '';
            };

            systemd.services.recipiz-backend = {
              description = "Recipiz backend";
              after = [ "postgresql.service" "recipiz-prepare.service" ];
              requires = [ "postgresql.service" "recipiz-prepare.service" ];
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
                WorkingDirectory = "/var/lib/recipiz/backend";
                ExecStart = "${pkgs.nodejs}/bin/node /var/lib/recipiz/backend/index.js";
                Restart = "always";
              };
            };

            systemd.services.recipiz-frontend = {
              description = "Recipiz frontend";
              after = [ "network-online.target" "recipiz-prepare.service" ];
              requires = [ "recipiz-prepare.service" ];
              wantedBy = [ "multi-user.target" ];
              serviceConfig = {
                ExecStart = "${pkgs.nodePackages.serve}/bin/serve -s /var/lib/recipiz/frontend-dist -l tcp://0.0.0.0:${toString cfg.frontendPort}";
                Restart = "always";
              };
            };
          };
        };

      nixosModules.default = self.nixosModules.Recipiz;
    };
}

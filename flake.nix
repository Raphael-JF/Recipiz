{
  description = "Recipiz";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
      };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs
          postgresql_18
        ];

        shellHook = ''
          set -e

          export PGDATA="$PWD/.postgres"
          export PGPORT=5433
          export PGDATABASE=recipiz
          export PGHOST="$PGDATA"

          # ─────────────────────────────────────
          # PostgreSQL
          # ─────────────────────────────────────

          if [ ! -f "$PGDATA/PG_VERSION" ]; then
            echo "Initializing PostgreSQL..."

            initdb \
              --no-locale \
              --encoding=UTF8 \
              "$PGDATA"
          fi

          if ! pg_ctl status -D "$PGDATA" >/dev/null 2>&1; then
            echo "Starting PostgreSQL..."

            pg_ctl \
              -D "$PGDATA" \
              -o "-p $PGPORT -k $PGHOST" \
              -l "$PGDATA/postgres.log" \
              -w \
              start
          fi

          # Vérification réelle du serveur
          if ! pg_isready \
              -h "$PGHOST" \
              -p "$PGPORT" \
              >/dev/null 2>&1; then

            echo
            echo "ERROR: PostgreSQL failed to start."
            echo
            echo "PostgreSQL log:"
            echo "────────────────────────────────────────"

            cat "$PGDATA/postgres.log"

            echo "────────────────────────────────────────"
            exit 1
          fi

          # Création de la DB si nécessaire
          if ! psql -d postgres -tAc \
              "SELECT 1 FROM pg_database WHERE datname = '$PGDATABASE'" |
              grep -q 1; then

            echo "Creating database '$PGDATABASE'..."
            createdb "$PGDATABASE"
          fi

          export DATABASE_URL="postgresql:///$PGDATABASE?host=$PGHOST&port=$PGPORT"

          echo "PostgreSQL ready on $PGHOST:$PGPORT"


          # ─────────────────────────────────────
          # Backend
          # ─────────────────────────────────────

          (
            echo "Installing backend dependencies..."
            cd backend
            npm install

            echo "Starting backend..."
            node --watch index.js
          ) &
          BACKEND_PID=$!


          # ─────────────────────────────────────
          # Frontend
          # ─────────────────────────────────────

          (
            echo "Installing frontend dependencies..."
            cd frontend
            npm install

            echo "Starting frontend..."
            npm run dev
          ) &
          FRONTEND_PID=$!


          # ─────────────────────────────────────
          # Cleanup
          # ─────────────────────────────────────

          cleanup() {
          echo
          echo "Stopping Recipiz..."

          kill "$FRONTEND_PID" "$BACKEND_PID" 2>/dev/null || true

          if pg_ctl status -D "$PGDATA" >/dev/null 2>&1; then
            pg_ctl -D "$PGDATA" stop -m fast
          fi

          rm -rf "$PGDATA"

          echo "Development database removed."
        }

          trap cleanup EXIT INT TERM


          echo
          echo "Recipiz development environment"
          echo "  PostgreSQL: localhost:$PGPORT"
          echo "  Database:   $PGDATABASE"
          echo "  Frontend:   http://localhost:5173"
          echo "  Backend:    http://localhost:3000"
          echo

          wait
        '';
      };

      nixosModules = {
        Recipiz = {
          imports = [
            ./nixos/options.nix
            ./nixos/backend.nix
            ./nixos/frontend.nix
            ./nixos/postgresql.nix
          ];
        };

        default = self.nixosModules.Recipiz;
      };
    };
}

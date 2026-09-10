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
          tmux
        ];

        shellHook = ''
          set -e

          # ─────────────────────────────────────
          # PostgreSQL environment
          # ─────────────────────────────────────

          export PGDATA="$PWD/.postgres"
          export PGPORT=5432
          export PGDATABASE=recipiz
          export PGHOST="$PGDATA"



          # ─────────────────────────────────────
          # PostgreSQL initialization
          # ─────────────────────────────────────

          if [ ! -f "$PGDATA/PG_VERSION" ]; then
            echo "Initializing PostgreSQL..."

            initdb \
              --no-locale \
              --encoding=UTF8 \
              "$PGDATA"
          fi

          # ─────────────────────────────────────
          # PostgreSQL server
          # ─────────────────────────────────────

          if ! pg_ctl status -D "$PGDATA" >/dev/null 2>&1; then
            echo "Starting PostgreSQL..."
            pg_ctl \
              -D "$PGDATA" \
              -o "-p $PGPORT -k $PGHOST" \
              -l "$PGDATA/postgres.log" \
              -w \
              start
          fi

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

          # ─────────────────────────────────────
          # Role
          # ─────────────────────────────────────

          if ! psql -U "$USER" -d postgres -tAc \
              "SELECT 1 FROM pg_roles WHERE rolname = 'recipiz'" |
              grep -q 1; then

            echo "Creating role 'recipiz'..."
            createuser -U "$USER" recipiz
          fi

          # ─────────────────────────────────────
          # Database
          # ─────────────────────────────────────

          if ! psql -U "$USER" -d postgres -tAc \
              "SELECT 1 FROM pg_database WHERE datname = '$PGDATABASE'" |
              grep -q 1; then

            echo "Creating database '$PGDATABASE'..."
            createdb -U "$USER" -O recipiz "$PGDATABASE"
          fi

          # ─────────────────────────────────────
          # Database schema
          # ─────────────────────────────────────

          echo "Initializing database '$PGDATABASE'..."

          psql \
            -U recipiz \
            -d "$PGDATABASE" \
            -v ON_ERROR_STOP=1 \
            -f "$PWD/nixos/init_dev.sql"

          export DATABASE_URL="postgresql://recipiz@/$PGDATABASE?host=$PGHOST&port=$PGPORT"

          echo
          echo "PostgreSQL ready on $PGHOST:$PGPORT"
          echo "Database:   $PGDATABASE"
          echo "User:       recipiz"
          echo

          # ─────────────────────────────────────
          # Cleanup
          # ─────────────────────────────────────

          cleanup() {
            echo
            echo "Stopping Recipiz..."

            if tmux has-session -t recipiz 2>/dev/null; then
              tmux kill-session -t recipiz
            fi

            if pg_ctl status -D "$PGDATA" >/dev/null 2>&1; then
              pg_ctl -D "$PGDATA" stop -m fast
            fi

            rm -rf "$PGDATA"

            echo "Development database removed."
          }

          trap cleanup EXIT INT TERM

          # ─────────────────────────────────────
          # tmux
          # ─────────────────────────────────────

          if tmux has-session -t recipiz 2>/dev/null; then
            echo "Attaching to existing Recipiz tmux session..."
            tmux attach-session -t recipiz
            exit
          fi

          tmux new-session -d \
            -s recipiz \
            -n dev \
            "cd '$PWD/backend' && echo '=== BACKEND ===' && npm install && node --watch index.js"

          tmux split-window -h \
            -t recipiz:dev \
            "cd '$PWD/frontend' && echo '=== FRONTEND ===' && npm install && npm run dev"

          tmux split-window -v \
            -t recipiz:dev.0 \
            "echo '=== PSQL ===' && psql -U recipiz '$PGDATABASE'"

          tmux split-window -v \
            -t recipiz:dev.1 \
            "echo '=== POSTGRESQL LOG ===' && tail -F '$PGDATA/postgres.log'"

          tmux select-layout -t recipiz:dev tiled

          tmux select-pane -t recipiz:dev.0

          echo
          echo "Recipiz development environment"
          echo "  PostgreSQL: $PGHOST:$PGPORT"
          echo "  Database:   $PGDATABASE"
          echo "  Frontend:   http://localhost:5173"
          echo "  Backend:    http://localhost:3000"
          echo

          tmux attach-session -t recipiz
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

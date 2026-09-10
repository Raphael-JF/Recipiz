{ config, lib, pkgs, ... }:

let
  cfg = config.services.recipiz;
in
{
  systemd.services.recipiz-init-database = lib.mkIf cfg.enable {
    description = "Initialize Recipiz database";

    after = [
      "postgresql.service"
    ];

    requires = [
      "postgresql.service"
    ];

    before = [
      "recipiz-backend.service"
    ];

    wantedBy = [
      "multi-user.target"
    ];

    serviceConfig = {
      Type = "oneshot";
      User = "postgres";
    };

    script = ''
      set -e

      PSQL="${pkgs.postgresql_18}/bin/psql"
      CREATEDB="${pkgs.postgresql_18}/bin/createdb"

      # ─────────────────────────────────────
      # Role
      # ─────────────────────────────────────

      if ! "$PSQL" -d postgres -tAc \
          "SELECT 1 FROM pg_roles WHERE rolname = '${cfg.database.user}'" |
          grep -q 1; then

        echo "Creating role '${cfg.database.user}'..."

        "$PSQL" -d postgres -c \
          "CREATE ROLE ${cfg.database.user} LOGIN;"
      fi

      # ─────────────────────────────────────
      # Database
      # ─────────────────────────────────────

      if ! "$PSQL" -d postgres -tAc \
          "SELECT 1 FROM pg_database WHERE datname = '${cfg.database.name}'" |
          grep -q 1; then

        echo "Creating database '${cfg.database.name}'..."

        "$CREATEDB" \
          -O "${cfg.database.user}" \
          "${cfg.database.name}"
      fi

      # ─────────────────────────────────────
      # Schema
      # ─────────────────────────────────────

      echo "Initializing database '${cfg.database.name}'..."

      "$PSQL" \
        -d "${cfg.database.name}" \
        -v ON_ERROR_STOP=1 \
        -f "${./init_prod.sql}"
    '';
  };
}

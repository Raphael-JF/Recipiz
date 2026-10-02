{ lib, pkgs, config, ... }:

let
  cfg = config.services.recipiz;
  frontendDir = "${cfg.packageDirectory}/frontend";
  frontendSrc = ../frontend;
in
{
  systemd.services.recipiz-frontend-build = {
    description = "Build Recipiz frontend";

    wantedBy = [ "multi-user.target" ];
    before = [ "recipiz-backend.service" ];
    wants = [ "network-online.target" ];
    after = [ "network-online.target" ];

    restartTriggers = [ frontendSrc ];

    serviceConfig = {
      Type = "oneshot";
      User = "recipiz";
      Group = "nginx";
      RemainAfterExit = true;

      Environment = [
        "HOME=/var/lib/recipiz"
        "PATH=${lib.makeBinPath [ pkgs.nodejs pkgs.bash pkgs.coreutils ]}"
      ];
    };

    script = ''
      stamp=${frontendDir}/.installed-from

      if [ -f "$stamp" ] && [ "$(cat "$stamp")" = "${frontendSrc}" ]; then
        echo "Frontend already installed from ${frontendSrc}, skipping"
        exit 0
      fi

      rm -rf ${frontendDir}
      mkdir -p ${frontendDir}

      tmp=$(mktemp -d)
      trap 'rm -rf "$tmp"' EXIT

      cp -r ${frontendSrc}/. "$tmp"/
      chmod -R u+rwX "$tmp"

      cd "$tmp"

      ${pkgs.nodejs}/bin/npm install
      ${pkgs.nodejs}/bin/npm run build

      cp -r dist/. ${frontendDir}/

      chmod -R u=rwX,g=rX,o= ${frontendDir}

      echo "${frontendSrc}" > "$stamp"
    '';
  };

  services.nginx.virtualHosts."recipiz.82.126.172.121.nip.io" = {
    enableACME = true;
    forceSSL = true;

    root = frontendDir;

    locations."/" = {
      tryFiles = "$uri $uri/ /index.html";
    };

    locations."/api/" = {
      proxyPass = "http://127.0.0.1:${toString cfg.backendPort}/";
    };
  };
}

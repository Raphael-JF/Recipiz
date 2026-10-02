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
      RemainAfterExit = true;
      Environment = [
        "PATH=${lib.makeBinPath [ pkgs.nodejs pkgs.bash pkgs.coreutils ]}"
      ];
    };

    script = ''
      stamp=${frontendDir}/.installed-from
      if [ -f "$stamp" ] && [ "$(cat "$stamp")" = "${frontendSrc}" ]; then
        echo "Backend already installed from ${frontendSrc}, skipping"
        exit 0
      fi

      rm -rf ${frontendDir}
      mkdir -p ${frontendDir}

      tmp=$(mktemp -d)

      cp -r ${frontendSrc}/* $tmp/

      cd $tmp

      ${pkgs.nodejs}/bin/npm install
      ${pkgs.nodejs}/bin/npm run build

      cp -r dist/* ${frontendDir}/

      rm -rf $tmp

      chown -R recipiz:nginx /var/lib/recipiz/frontend
      chmod -R u=rwX,g=rX,o= /var/lib/recipiz/frontend
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

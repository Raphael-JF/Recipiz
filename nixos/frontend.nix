{ config, lib, pkgs, ... }:

let
  cfg = config.services.recipiz;

  frontend = pkgs.buildNpmPackage {
    pname = "recipiz-frontend";
    version = "0.1.0";

    src = ../frontend;

    npmDepsHash = "sha256-+0Z1k5g6J8F3x9G5y5z5y5z5y5z5y5z5y5z5y5z5y5z=";
    # npmDepsHash = "";

    buildPhase = ''
      npm run build
    '';

    installPhase = ''
      mkdir -p $out
      cp -r dist/* $out/
    '';
  };
in
{
  services.nginx.virtualHosts."recipiz.82.126.172.121.nip.io" = {
    enableACME = true;
    forceSSL = true;

    root = frontend;

    locations."/" = {
      tryFiles = "$uri $uri/ /index.html";
    };

    locations."/api/" = {
      proxyPass = "http://127.0.0.1:3000/";
    };
  };
}

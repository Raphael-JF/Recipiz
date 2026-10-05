{ config, ... }:
{
  systemd.tmpfiles.rules = [
    "d ${config.services.recipiz.packageDirectory} 0750 recipiz nginx -"
  ];
  users.groups.recipiz = {};

  users.users.recipiz = {
    isSystemUser = true;
    home = config.services.recipiz.packageDirectory ;
    group = "recipiz";
    extraGroups = [ "nginx" ];
  };

}


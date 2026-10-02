{ config, ... }:
{
  systemd.tmpfiles.rules = [
    "d /var/lib/recipiz 0750 recipiz nginx -"
  ];
  users.groups.recipiz = {};

  users.users.recipiz = {
    isSystemUser = true;
    home = config.services.recipiz.packageDirectory ;
    group = "recipiz";
    extraGroups = [ "nginx" ];
  };

}


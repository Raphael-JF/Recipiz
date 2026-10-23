{ pkgs, config, ... }:
{
  sops.templates."recipiz-env" = {
    content = ''
      SESSION_SECRET=${config.sops.placeholder.recipiz_session_secret}
    '';
    owner = "recipiz";
    group = "recipiz";
    mode = "0400";
  };
}

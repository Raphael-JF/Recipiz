{ pkgs, config, ... }:
{
  sops.secrets."recipiz-session-secret" = {
    owner = "recipiz";
    group = "recipiz";
    mode = "0400";
  };
  sops.templates."recipiz-env" = {
    content = ''
      SESSION_SECRET=${config.sops.placeholder."recipiz-session-secret"}
    '';
    owner = "recipiz";
    group = "recipiz";
    mode = "0400";
  };
}

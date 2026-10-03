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

        shellHook = builtins.readFile ./shell-hook.sh;
      };

      nixosModules = {
        Recipiz = {
          imports = [
            ./nixos/options.nix
            ./nixos/backend.nix
            ./nixos/frontend.nix
            ./nixos/postgresql.nix
            ./nixos/users.nix
          ];
        };

        default = self.nixosModules.Recipiz;
      };
    };
}

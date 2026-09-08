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
    devShells.x86_64-linux.default = pkgs.mkShell {
      packages = with pkgs; [
        nodejs
        postgresql_18
      ];
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

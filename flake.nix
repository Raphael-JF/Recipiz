{
  description = "Recipiz";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }: {
    nixosModules = {
      Recipiz = {
        imports = [
          ./nixos/recipiz.nix
          ./nixos/backend.nix
          ./nixos/frontend.nix
          ./nixos/postgresql.nix
        ];
      };

      default = self.nixosModules.Recipiz;
    };
  };
}

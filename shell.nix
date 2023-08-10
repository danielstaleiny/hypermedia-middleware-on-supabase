{ pkgs ? import <nixpkgs> {} }:
let
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    postgresql_15
    supabase-cli
  ];
  shellHook = ''
      export PGPASSFILE=.pgpass
      alias e="exit"
      alias cc="clear"
    '';
}

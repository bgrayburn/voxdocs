{ pkgs, ... }:

{
  # https://devenv.sh/packages/
  packages = with pkgs; [ git nodejs ];

  # https://devenv.sh/scripts/
  scripts.test-root.exec = ''
        curl -X POST http://127.0.0.1:8000/ \
             -H "Content-Type: application/json" \ 
    	 -d "{\"text\":\"Test Message\"}"
  '';

  enterShell = ''
    echo "Welcome to voxdocs-server"
  '';

  # https://devenv.sh/languages/
  languages.python.enable = true;
  languages.python.venv = {
    enable = true;
    quiet = true;
    requirements = ./requirements.txt;
  };

  # https://devenv.sh/processes/
  processes.voxdocs.exec =
    "cd $DEVENV_ROOT/voxdocs-server && uvicorn main:app --reload";

  difftastic.enable = true;
  dotenv.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}

{ pkgs, ... }:

{
  packages = with pkgs; [ git nodejs ];

  scripts.test-root.exec = ''
    curl -v \
         -X POST http://127.0.0.1:8000/ \
         -H "Content-Type: application/json" \
         -d "{\"instruction\":\"title Grocery List\", \"document\": \"\"}"
  '';
  scripts.create-assistant.exec = ''
    python $DEVENV_ROOT/backend/scripts/create_assistant.py
  '';

  languages.python.enable = true;
  languages.python.venv = {
    enable = true;
    quiet = true;
    requirements = ./requirements.txt;
  };
}

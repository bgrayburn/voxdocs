{ pkgs, ... }:

{
  packages = with pkgs; [ git nodejs ];

  scripts.test-root.exec = ''
        curl -X POST http://127.0.0.1:8000/ \
             -H "Content-Type: application/json" \ 
    	 -d "{\"text\":\"Test Message\"}"
  '';

  languages.python.enable = true;
  languages.python.venv = {
    enable = true;
    quiet = true;
    requirements = "./backend/requirements.txt";
  };
}

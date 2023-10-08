# Steps to run the server

- Create a virtal environment
```shell
python -m venv .venv
```

- Source the venv file 
```shell
# if you use bash shell
source .venv/bin/activate

# if you use fish shell
source .venv/bin/activate.fish
```

- Install dependencies and start the server
```shell
pip install uvicorn fastapi docker dropbox_sign supabase openai
uvicorn server:app --reload
```
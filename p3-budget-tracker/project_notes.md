## Helpful Commands ##

Activating venv:
source .venv/bin/activate


Adding new python libraries to backend:
uv add <libraries>

Running FastAPI:
(starts venv & starts app) uv run uvicorn main:app --reload
(if venv is already running) uvicorn main:app --reload



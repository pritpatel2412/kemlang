from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sys
import io

# KemLang core
from kemlang.lexer import tokenize
from kemlang.parser import parse
from kemlang.evaluator import evaluate

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeInput(BaseModel):
    code: str


@app.get("/")
def root():
    return {"message": "KemLang backend is live 🎉"}

@app.post("/run")
async def run_code(request: CodeInput):
    try:
        old_stdout = sys.stdout
        buffer = io.StringIO()
        sys.stdout = buffer

        tokens = tokenize(request.code)
        ast = parse(tokens)
        evaluate(ast)

        sys.stdout = old_stdout
        output = buffer.getvalue().strip()
        return {"success": True, "output": output}

    except Exception as e:
        sys.stdout = old_stdout
        return {"success": False, "error": str(e)}

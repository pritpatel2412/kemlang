from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sys
import io
import os

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

def serialize_ast(node, current_line=1):
    if isinstance(node, list):
        res = []
        for i, n in enumerate(node):
            res.append(serialize_ast(n, current_line + i))
        return res
    elif isinstance(node, tuple):
        import uuid
        node_id = str(uuid.uuid4())[:8]
        node_type = node[0]
        if node_type == "ASSIGN":
            return {
                "type": "ASSIGN",
                "id": node_id,
                "varName": node[1],
                "value": serialize_ast(node[2], current_line),
                "line": current_line
            }
        elif node_type == "PRINT":
            return {
                "type": "PRINT",
                "id": node_id,
                "value": serialize_ast(node[1], current_line),
                "line": current_line
            }
        elif node_type == "INPUT":
            return {
                "type": "INPUT",
                "id": node_id,
                "varName": node[1],
                "line": current_line
            }
        elif node_type == "IF":
            if_len = len(node[2]) if isinstance(node[2], list) else 1
            return {
                "type": "IF",
                "id": node_id,
                "condition": serialize_ast(node[1], current_line),
                "ifBlock": serialize_ast(node[2], current_line + 1),
                "elseBlock": serialize_ast(node[3], current_line + if_len + 2),
                "line": current_line
            }
        elif node_type == "WHILE":
            return {
                "type": "WHILE",
                "id": node_id,
                "condition": serialize_ast(node[1], current_line),
                "block": serialize_ast(node[2], current_line + 1),
                "line": current_line
            }
        elif node_type == "BIN_OP":
            return {
                "type": "BIN_OP",
                "id": node_id,
                "op": node[1],
                "left": serialize_ast(node[2], current_line),
                "right": serialize_ast(node[3], current_line),
                "line": current_line
            }
        elif node_type == "VAR":
            return {
                "type": "VAR",
                "id": node_id,
                "varName": node[1],
                "line": current_line
            }
    else:
        import uuid
        node_id = str(uuid.uuid4())[:8]
        return {
            "type": "LITERAL",
            "id": node_id,
            "value": node,
            "line": current_line
        }

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
        serialized_ast = serialize_ast(ast)
        return {"success": True, "output": output, "ast": serialized_ast}

    except Exception as e:
        sys.stdout = old_stdout
        return {"success": False, "error": str(e)}

# ✅ This ensures the backend runs correctly on Render or any server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("cli:app", host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))

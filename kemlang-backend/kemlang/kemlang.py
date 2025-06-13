import sys
from lexer import Lexer
from parser import Parser
from evaluator import Evaluator

def run_kemlang(code):
    lexer = Lexer(code)
    tokens = lexer.tokenize()
    parser = Parser(tokens)
    ast = parser.parse()
    evaluator = Evaluator()
    for node in ast:
        evaluator.evaluate(node)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python kemlang.py <file.kem>")
        sys.exit(1)
    
    with open(sys.argv[1], "r", encoding="utf-8") as f:
        code = f.read()
    
    run_kemlang(code)
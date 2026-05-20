/**
 * KemLang Compiler Engine
 * -----------------------
 * An offline-first, pure JavaScript implementation of the KemLang tokenizer, parser, and interpreter.
 * Built with full Gujarati-keyword support and generator-based evaluation to enable:
 *   1. Zero-latency client-side execution.
 *   2. Step-by-step debugging.
 *   3. Real-time scope inspection.
 *   4. AST visualization.
 */

// Unique ID helper for AST Visualizer highlight tracking
let idCounter = 0;
function uniqueId(prefix = "node") {
  return `${prefix}_${++idCounter}_${Math.random().toString(36).substr(2, 5)}`;
}

// ----------------------------------------------------
// 1. TOKENIZER (LEXER)
// ----------------------------------------------------

export class Token {
  constructor(type, value, line) {
    this.type = type;
    this.value = value;
    this.line = line;
  }
}

export class Lexer {
  constructor(code) {
    this.code = code;
    this.pos = 0;
    this.line = 1;
    this.current_char = code.length > 0 ? code[0] : null;
    this.keywords = {
      "sharu": "BLOCK_START",
      "samaapt": "BLOCK_END",
      "jo": "IF",
      "nahitar": "ELSE",
      "jyaare": "WHILE",
      "do": "VAR_DECLARE",
      "aap": "RETURN",
      "kharu": "BOOLEAN",
      "khotu": "BOOLEAN",
      "lakho": "PRINT",
      "jaano": "INPUT"
    };
  }

  advance() {
    if (this.current_char === '\n') {
      this.line += 1;
    }
    this.pos += 1;
    this.current_char = this.pos < this.code.length ? this.code[this.pos] : null;
  }

  skipWhitespace() {
    while (this.current_char !== null && /\s/.test(this.current_char)) {
      this.advance();
    }
  }

  skipComment() {
    if (this.current_char === '/') {
      while (this.current_char !== null && this.current_char !== '\n') {
        this.advance();
      }
      if (this.current_char === '\n') {
        this.advance();
      }
    }
  }

  readNumber() {
    let result = "";
    const startLine = this.line;
    while (this.current_char !== null && /\d/.test(this.current_char)) {
      result += this.current_char;
      this.advance();
    }
    return new Token("NUMBER", parseInt(result, 10), startLine);
  }

  readString() {
    let result = "";
    const startLine = this.line;
    this.advance(); // Skip opening quote
    while (this.current_char !== null && this.current_char !== '"') {
      result += this.current_char;
      this.advance();
    }
    if (this.current_char !== '"') {
      throw new Error(`❌ Error: Unterminated string literal (Line ${startLine})`);
    }
    this.advance(); // Skip closing quote
    return new Token("STRING", result, startLine);
  }

  readIdentifier() {
    let result = "";
    const startLine = this.line;
    while (this.current_char !== null && (/[a-zA-Z0-9_]/.test(this.current_char))) {
      result += this.current_char;
      this.advance();
    }
    const tokenType = this.keywords[result] || "IDENTIFIER";
    return new Token(tokenType, result, startLine);
  }

  tokenize() {
    const tokens = [];
    while (this.current_char !== null) {
      if (/\s/.test(this.current_char)) {
        this.skipWhitespace();
      } else if (this.current_char === '/' && this.pos + 1 < this.code.length && this.code[this.pos + 1] === '/') {
        this.skipComment();
      } else if (this.current_char === '"') {
        tokens.push(this.readString());
      } else if (/\d/.test(this.current_char)) {
        tokens.push(this.readNumber());
      } else if (/[a-zA-Z_]/.test(this.current_char)) {
        tokens.push(this.readIdentifier());
      } else if ("=<>!".includes(this.current_char)) {
        const startLine = this.line;
        let op = this.current_char;
        this.advance();
        if (this.current_char === '=') {
          op += '=';
          this.advance();
        }
        tokens.push(new Token("OPERATOR", op, startLine));
      } else if ("+-*/".includes(this.current_char)) {
        tokens.push(new Token("OPERATOR", this.current_char, this.line));
        this.advance();
      } else if ("{}();".includes(this.current_char)) {
        tokens.push(new Token("SYMBOL", this.current_char, this.line));
        this.advance();
      } else {
        const char = this.current_char;
        const pos = this.pos;
        const line = this.line;
        this.advance();
        throw new Error(`❌ Error: Unknown character '${char}' at position ${pos} (Line ${line})`);
      }
    }
    return tokens;
  }
}

// ----------------------------------------------------
// 2. PARSER
// ----------------------------------------------------

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.currentToken = null;
    this.tokenIndex = -1;
    this.advance();
  }

  advance() {
    this.tokenIndex += 1;
    this.currentToken = this.tokenIndex < this.tokens.length ? this.tokens[this.tokenIndex] : null;
  }

  raiseError(message) {
    const funnyPrefixes = [
      "❌ Arre Bhai Bhai Bhai !!!",
      "😵‍💫 Arey re re re! Su thai gayu??",
      "🙄 Kem Bhool Thai Gayi Bhai?",
      "🚨 Kod ma Tufan!",
      "😬 Ee to bug nikdi gaya re!",
      "🤦‍♂️ Aavo Re Bug Maharaj!",
      "😂 Hasva nu man thay chhe... pan code run nathi thato!",
      "🫣 Code jova layak nathi re bhai!",
      "🤖 KemLang no Compiler pan confuse thai gayo!"
    ];
    const prefix = funnyPrefixes[Math.floor(Math.random() * funnyPrefixes.length)];
    const lineInfo = this.currentToken ? ` (Line ${this.currentToken.line})` : "";
    throw new Error(`${prefix}\n> ${message}${lineInfo}`);
  }

  expectSemicolon() {
    if (this.currentToken === null || this.currentToken.value !== ";") {
      this.raiseError("Statement pachi ';' mukto kharo bhai!");
    }
    this.advance();
  }

  parse() {
    if (this.currentToken === null || this.currentToken.value !== "sharu") {
      this.raiseError("Code ni sharuaat 'sharu' thi thay chhe bhai!");
    }
    this.advance();
    if (this.currentToken === null || this.currentToken.value !== "{") {
      this.raiseError("'sharu' pachi '{' mukvanu bhooli gayo bhai!");
    }
    this.advance();

    const statements = this.parseBlock();

    if (this.currentToken === null || this.currentToken.value !== "}") {
      this.raiseError("'samaapt' pehla closing '}' mukvano rehi gayu chhe!");
    }
    this.advance();
    if (this.currentToken === null || this.currentToken.value !== "samaapt") {
      this.raiseError("Code ni antim line 'samaapt' hovi joie!");
    }
    return statements;
  }

  parseBlock() {
    const statements = [];
    while (
      this.currentToken !== null &&
      this.currentToken.value !== "samaapt" &&
      this.currentToken.value !== "}"
    ) {
      if (this.currentToken.type === "VAR_DECLARE") {
        statements.push(this.parseAssignment());
      } else if (this.currentToken.type === "PRINT") {
        statements.push(this.parsePrint());
      } else if (this.currentToken.type === "IF") {
        statements.push(this.parseIf());
      } else if (this.currentToken.type === "WHILE") {
        statements.push(this.parseWhile());
      } else if (this.currentToken.type === "INPUT") {
        statements.push(this.parseInput());
      } else if (this.currentToken.type === "IDENTIFIER") {
        statements.push(this.parseReassignment());
      } else {
        // Skip unknown token inside block
        this.advance();
      }
    }
    return statements;
  }

  parseAssignment() {
    const line = this.currentToken.line;
    this.advance(); // Skip 'do'
    if (this.currentToken === null || this.currentToken.type !== "IDENTIFIER") {
      this.raiseError("'do' pachi variable naam aavvu joie bro!");
    }
    const varName = this.currentToken.value;
    this.advance();
    if (this.currentToken === null || this.currentToken.value !== "=") {
      this.raiseError(`Variable '${varName}' pachi '=' mukvanu bhooli gaya!`);
    }
    this.advance();
    const value = this.parseExpression();
    this.expectSemicolon();
    return {
      id: uniqueId("assign"),
      type: "ASSIGN",
      varName,
      value,
      line
    };
  }

  parseReassignment() {
    const line = this.currentToken.line;
    const varName = this.currentToken.value;
    this.advance();
    if (this.currentToken === null || this.currentToken.value !== "=") {
      this.raiseError(`'${varName}' pachi '=' aavvo joie!`);
    }
    this.advance();
    const value = this.parseExpression();
    this.expectSemicolon();
    return {
      id: uniqueId("reassign"),
      type: "ASSIGN",
      varName,
      value,
      line
    };
  }

  parsePrint() {
    const line = this.currentToken.line;
    this.advance(); // Skip 'lakho'
    const value = this.parseExpression();
    this.expectSemicolon();
    return {
      id: uniqueId("print"),
      type: "PRINT",
      value,
      line
    };
  }

  parseInput() {
    const line = this.currentToken.line;
    this.advance(); // Skip 'jaano'
    if (this.currentToken === null || this.currentToken.type !== "IDENTIFIER") {
      this.raiseError("'jaano' pachi variable naam mukvanu bhai!");
    }
    const varName = this.currentToken.value;
    this.advance();
    this.expectSemicolon();
    return {
      id: uniqueId("input"),
      type: "INPUT",
      varName,
      line
    };
  }

  parseIf() {
    const line = this.currentToken.line;
    this.advance(); // Skip 'jo'
    const condition = this.parseExpression();
    
    if (this.currentToken && this.currentToken.value === "{") {
      this.advance();
      const ifBlock = this.parseBlock();
      if (this.currentToken && this.currentToken.value === "}") {
        this.advance();
      } else {
        this.raiseError("'jo' block pachi closing '}' mukvanu reh gayu!");
      }

      let elseBlock = null;
      if (this.currentToken && this.currentToken.value === "nahitar") {
        this.advance();
        if (this.currentToken && this.currentToken.value === "{") {
          this.advance();
          elseBlock = this.parseBlock();
          if (this.currentToken && this.currentToken.value === "}") {
            this.advance();
          } else {
            this.raiseError("'nahitar' block pachi '}' muk!");
          }
        } else {
          this.raiseError("'nahitar' pachi '{' aavvu joie!");
        }
      }

      return {
        id: uniqueId("if"),
        type: "IF",
        condition,
        ifBlock,
        elseBlock,
        line
      };
    } else {
      this.raiseError("'jo' pachi '{' mukvanu joie!");
    }
  }

  parseWhile() {
    const line = this.currentToken.line;
    this.advance(); // Skip 'jyaare'
    const condition = this.parseExpression();

    if (this.currentToken && this.currentToken.value === "{") {
      this.advance();
      const block = this.parseBlock();
      if (this.currentToken && this.currentToken.value === "}") {
        this.advance();
      } else {
        this.raiseError("'while' block bandh karvani bhool na kar!");
      }

      return {
        id: uniqueId("while"),
        type: "WHILE",
        condition,
        conditionNode: {
          id: uniqueId("cond"),
          type: "CONDITION",
          condition,
          line
        },
        block,
        line
      };
    } else {
      this.raiseError("'jyaare' pachi '{' mukvanu joie!");
    }
  }

  parseExpression() {
    return this.parseComparison();
  }

  parseComparison() {
    let left = this.parseAddSub();
    while (
      this.currentToken &&
      this.currentToken.type === "OPERATOR" &&
      ["==", "!=", "<", ">", "<=", ">="].includes(this.currentToken.value)
    ) {
      const op = this.currentToken.value;
      const line = this.currentToken.line;
      this.advance();
      const right = this.parseAddSub();
      left = {
        id: uniqueId("binop"),
        type: "BIN_OP",
        op,
        left,
        right,
        line
      };
    }
    return left;
  }

  parseAddSub() {
    let left = this.parseMulDiv();
    while (
      this.currentToken &&
      this.currentToken.type === "OPERATOR" &&
      ["+", "-"].includes(this.currentToken.value)
    ) {
      const op = this.currentToken.value;
      const line = this.currentToken.line;
      this.advance();
      const right = this.parseMulDiv();
      left = {
        id: uniqueId("binop"),
        type: "BIN_OP",
        op,
        left,
        right,
        line
      };
    }
    return left;
  }

  parseMulDiv() {
    let left = this.parsePrimary();
    while (
      this.currentToken &&
      this.currentToken.type === "OPERATOR" &&
      ["*", "/"].includes(this.currentToken.value)
    ) {
      const op = this.currentToken.value;
      const line = this.currentToken.line;
      this.advance();
      const right = this.parsePrimary();
      left = {
        id: uniqueId("binop"),
        type: "BIN_OP",
        op,
        left,
        right,
        line
      };
    }
    return left;
  }

  parsePrimary() {
    if (this.currentToken === null) {
      this.raiseError("Expression adho chhe! Kai to lakh bhai.");
    }
    const tok = this.currentToken;

    if (tok.type === "NUMBER") {
      this.advance();
      return {
        id: uniqueId("literal"),
        type: "LITERAL",
        value: tok.value,
        line: tok.line
      };
    } else if (tok.type === "STRING") {
      this.advance();
      return {
        id: uniqueId("literal"),
        type: "LITERAL",
        value: tok.value,
        line: tok.line
      };
    } else if (tok.type === "BOOLEAN") {
      this.advance();
      return {
        id: uniqueId("literal"),
        type: "LITERAL",
        value: tok.value === "kharu",
        line: tok.line
      };
    } else if (tok.type === "IDENTIFIER") {
      this.advance();
      return {
        id: uniqueId("var"),
        type: "VAR",
        varName: tok.value,
        line: tok.line
      };
    } else if (tok.type === "SYMBOL" && tok.value === "(") {
      this.advance();
      const expr = this.parseExpression();
      if (this.currentToken === null || this.currentToken.value !== ")") {
        this.raiseError("Expression pachi ')' mukvanu bhooli gaya!");
      }
      this.advance();
      return expr;
    } else {
      this.raiseError(`Unexpected token in expression: ${tok.type} (${tok.value})`);
    }
  }
}

// ----------------------------------------------------
// 3. STEPPED EVALUATOR (GENERATOR BASED)
// ----------------------------------------------------

export class Evaluator {
  constructor() {
    this.variables = {};
  }

  // Evaluates plain expressions synchronously (arithmetic/variables/etc.)
  evaluateExpr(node) {
    if (node === null || typeof node !== "object") {
      return node;
    }

    if (node.type === "LITERAL") {
      return node.value;
    }

    if (node.type === "VAR") {
      const varName = node.varName;
      if (varName in this.variables) {
        return this.variables[varName];
      }
      throw new Error(`Undefined variable: ${varName} (Line ${node.line})`);
    }

    if (node.type === "BIN_OP") {
      const left = this.evaluateExpr(node.left);
      const right = this.evaluateExpr(node.right);
      const op = node.op;

      if (op === "+") {
        if (typeof left === "string" || typeof right === "string") {
          return String(left) + String(right);
        }
        return left + right;
      }
      if (op === "-") return left - right;
      if (op === "*") return left * right;
      if (op === "/") {
        if (right === 0) throw new Error(`ZeroDivisionError: Can't divide by zero! (Line ${node.line})`);
        return left / right;
      }
      if (op === ">") return left > right;
      if (op === "<") return left < right;
      if (op === "==") return left === right;
      if (op === "!=") return left !== right;
      if (op === ">=") return left >= right;
      if (op === "<=") return left <= right;
      
      throw new Error(`Unknown operator: ${op} (Line ${node.line})`);
    }

    throw new Error(`Unknown expression node: ${node.type} (Line ${node.line})`);
  }

  /**
   * Generator-based statement evaluator.
   * Yields at each statement pause. The yielder returns:
   *   { node: ASTNode, variables: Object, type: "STATEMENT" | "INPUT" }
   * 
   * If type is "INPUT", the environment must prompt the user and send
   * the result back to the generator via iterator.next(value).
   */
  *evaluate(node) {
    if (!node) return;

    // Array of statements (a block)
    if (Array.isArray(node)) {
      for (const stmt of node) {
        yield* this.evaluate(stmt);
      }
      return;
    }

    // Yield statement before execution for debugging highlights
    if (node.type === "ASSIGN" || node.type === "PRINT" || node.type === "INPUT" || node.type === "IF" || node.type === "WHILE") {
      yield {
        node,
        variables: { ...this.variables },
        type: "STATEMENT"
      };
    }

    // 1. ASSIGNMENT
    if (node.type === "ASSIGN") {
      const val = this.evaluateExpr(node.value);
      this.variables[node.varName] = val;
    }

    // 2. PRINT
    else if (node.type === "PRINT") {
      const val = this.evaluateExpr(node.value);
      return val; // Handled by continuous execution runner or debugger stepper to console log
    }

    // 3. INPUT
    else if (node.type === "INPUT") {
      // Yield an INPUT request. The external stepper must prompt the user
      // and resume the generator with the input string.
      const rawInput = yield {
        node,
        variables: { ...this.variables },
        type: "INPUT",
        varName: node.varName
      };

      // Try casting to a number if it looks like one, matching Python interpreter
      let processedInput = rawInput;
      if (rawInput !== undefined && rawInput !== null) {
        if (!isNaN(rawInput) && rawInput.trim() !== "") {
          processedInput = rawInput.includes(".") ? parseFloat(rawInput) : parseInt(rawInput, 10);
        } else if (rawInput === "kharu" || rawInput === "true") {
          processedInput = true;
        } else if (rawInput === "khotu" || rawInput === "false") {
          processedInput = false;
        }
      }
      this.variables[node.varName] = processedInput;
    }

    // 4. IF CONDITIONAL
    else if (node.type === "IF") {
      const condVal = this.evaluateExpr(node.condition);
      if (condVal) {
        yield* this.evaluate(node.ifBlock);
      } else if (node.elseBlock) {
        yield* this.evaluate(node.elseBlock);
      }
    }

    // 5. WHILE LOOP
    else if (node.type === "WHILE") {
      while (true) {
        // Yield loop condition checks to show condition evaluates
        yield {
          node: node.conditionNode,
          variables: { ...this.variables },
          type: "STATEMENT"
        };

        const condVal = this.evaluateExpr(node.condition);
        if (!condVal) break;

        yield* this.evaluate(node.block);
      }
    }
  }
}

// ----------------------------------------------------
// 4. HELPER RUNNERS
// ----------------------------------------------------

/**
 * Standard synchronous run-to-completion runner.
 * Used when user clicks the standard "Run" button (full offline compilation).
 */
export function runOffline(code) {
  try {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const evaluator = new Evaluator();
    const iterator = evaluator.evaluate(ast);
    const outputs = [];

    let next = iterator.next();
    while (!next.done) {
      const step = next.value;

      if (step.type === "STATEMENT") {
        if (step.node.type === "PRINT") {
          const val = evaluator.evaluateExpr(step.node.value);
          outputs.push(String(val));
        }
        next = iterator.next();
      } else if (step.type === "INPUT") {
        // Offline run-to-completion doesn't support interactive pauses,
        // so we default to standard defaults (0 or empty string)
        next = iterator.next("");
      }
    }

    return {
      success: true,
      output: outputs.join("\n"),
      ast
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

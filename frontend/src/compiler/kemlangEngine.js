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
// 0. SCOPED ENVIRONMENT TREE
// ----------------------------------------------------

export class Environment {
  constructor(parent = null) {
    this.records = {};
    this.parent = parent;
    this.safeVars = new Set();
    this.ownership = {};
  }

  define(name, value) {
    this.records[name] = value;
  }

  lookup(name) {
    if (name in this.records) {
      return this.records[name];
    }
    if (this.parent) {
      return this.parent.lookup(name);
    }
    throw new Error(`Undefined variable: ${name}`);
  }

  assign(name, value) {
    if (name in this.records) {
      this.records[name] = value;
      return value;
    }
    if (this.parent) {
      return this.parent.assign(name, value);
    }
    throw new Error(`Undefined variable: ${name}`);
  }

  makeSafe(name) {
    this.safeVars.add(name);
  }

  isSafe(name) {
    if (this.safeVars.has(name)) {
      return true;
    }
    if (this.parent) {
      return this.parent.isSafe(name);
    }
    return false;
  }

  checkOwnership(name) {
    if (name in this.records) {
      if (this.ownership[name] === "moved") {
        throw new Error(`❌ Sharafat Safety Error: Variable '${name}' no ownership (already moved/transferred)!`);
      }
      return;
    }
    if (this.parent) {
      this.parent.checkOwnership(name);
      return;
    }
  }

  moveOwnership(name) {
    if (name in this.records) {
      this.ownership[name] = "moved";
      return;
    }
    if (this.parent) {
      this.parent.moveOwnership(name);
    }
  }
}

// ----------------------------------------------------
// Ledger, Khaali, Pedhi and Sauda classes
// ----------------------------------------------------

export class Ledger {
  constructor(initialValue) {
    this.history = [initialValue];
  }

  jama(val) {
    const newVal = this.history[this.history.length - 1] + val;
    this.history.push(newVal);
    return newVal;
  }

  udhaar(val) {
    const newVal = this.history[this.history.length - 1] - val;
    this.history.push(newVal);
    return newVal;
  }

  itihas(idx) {
    if (idx < 0 || idx >= this.history.length) {
      throw new Error("Ledger itihas index out of bounds!");
    }
    return this.history[idx];
  }

  current() {
    return this.history[this.history.length - 1];
  }

  toString() {
    return `Ledger([${this.history.join(", ")}])`;
  }
}

export class KhaaliClass {
  toString() {
    return "khaali";
  }
}
export const khaali = new KhaaliClass();

export class PedhiInstance {
  constructor(pedhiName, methods, evaluator) {
    this.pedhiName = pedhiName;
    this.methods = methods;
    this.evaluator = evaluator;
    this.actorEnv = new Environment(evaluator.globalEnv);
  }

  sauda(methodName, args) {
    if (!(methodName in this.methods)) {
      throw new Error(`kaam '${methodName}' not defined in pedhi '${this.pedhiName}'!`);
    }
    const func = this.methods[methodName];
    const params = func.params;
    
    const resVal = this.evaluator.evaluateFunctionSync({
      params,
      body: func.body,
      closure: this.actorEnv
    }, args);
    
    return new SaudaContract(resVal);
  }

  toString() {
    return `PedhiInstance(${this.pedhiName})`;
  }
}

export class SaudaContract {
  constructor(val) {
    this.val = val;
  }

  melvo() {
    return this.val;
  }

  toString() {
    return `SaudaContract(${this.val})`;
  }
}

export function unwrapVal(val) {
  if (val instanceof Ledger) {
    return val.current();
  }
  return val;
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
      "jaano": "INPUT",
      "kaam": "FUNCTION",
      "ane": "AND",
      "athva": "OR",
      "hisaab": "HISAAB_DECLARE",
      "khaali": "KHAALI",
      "has": "HAS",
      "value": "VALUE",
      "pedhi": "PEDHI",
      "bhadu": "BORROW"
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
      } else if ("+-*/%".includes(this.current_char)) {
        tokens.push(new Token("OPERATOR", this.current_char, this.line));
        this.advance();
      } else if ("{}();[],.".includes(this.current_char)) {
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
      } else if (this.currentToken.type === "HISAAB_DECLARE") {
        statements.push(this.parseHisaabDeclare());
      } else if (this.currentToken.type === "PEDHI") {
        statements.push(this.parsePedhiDef());
      } else if (this.currentToken.type === "PRINT") {
        statements.push(this.parsePrint());
      } else if (this.currentToken.type === "IF") {
        statements.push(this.parseIf());
      } else if (this.currentToken.type === "WHILE") {
        statements.push(this.parseWhile());
      } else if (this.currentToken.type === "INPUT") {
        statements.push(this.parseInput());
      } else if (this.currentToken.type === "FUNCTION") {
        statements.push(this.parseFunctionDef());
      } else if (this.currentToken.type === "RETURN") {
        statements.push(this.parseReturn());
      } else if (this.currentToken.type === "IDENTIFIER") {
        statements.push(this.parseReassignment());
      } else {
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

  parseHisaabDeclare() {
    const line = this.currentToken.line;
    this.advance(); // Skip 'hisaab'
    if (this.currentToken === null || this.currentToken.type !== "IDENTIFIER") {
      this.raiseError("'hisaab' pachi variable naam aavvu joie bro!");
    }
    const varName = this.currentToken.value;
    this.advance();
    if (this.currentToken === null || this.currentToken.value !== "=") {
      this.raiseError(`Ledger variable '${varName}' pachi '=' mukvanu bhooli gaya!`);
    }
    this.advance();
    const value = this.parseExpression();
    this.expectSemicolon();
    return {
      id: uniqueId("hisaab_assign"),
      type: "HISAAB_ASSIGN",
      varName,
      value,
      line
    };
  }

  parsePedhiDef() {
    const line = this.currentToken.line;
    this.advance(); // Skip 'pedhi'
    if (this.currentToken === null || this.currentToken.type !== "IDENTIFIER") {
      this.raiseError("'pedhi' pachi organization/actor nu naam aavvu joie!");
    }
    const pedhiName = this.currentToken.value;
    this.advance();
    if (this.currentToken === null || this.currentToken.value !== "{") {
      this.raiseError("'pedhi' name pachi '{' aavvu joie!");
    }
    this.advance();

    const methods = {};
    while (this.currentToken && this.currentToken.value !== "}") {
      if (this.currentToken.type === "FUNCTION") {
        const func = this.parseFunctionDef();
        methods[func.funcName] = func;
      } else {
        this.raiseError("pedhi ni andar khali functions ('kaam') ja lakhi shakay!");
      }
    }

    if (this.currentToken === null || this.currentToken.value !== "}") {
      this.raiseError("'pedhi' body bandh karva '}' mukvanu bhooli gaya!");
    }
    this.advance();

    return {
      id: uniqueId("pedhi_def"),
      type: "PEDHI_DEF",
      pedhiName,
      methods,
      line
    };
  }

  parseCallArg() {
    if (this.currentToken && this.currentToken.type === "BORROW") {
      const line = this.currentToken.line;
      this.advance(); // skip 'bhadu'
      if (this.currentToken === null || this.currentToken.type !== "IDENTIFIER") {
        this.raiseError("'bhadu' pachi variable nu naam aavvu joie!");
      }
      const varName = this.currentToken.value;
      this.advance();
      return {
        id: uniqueId("borrow_arg"),
        type: "BORROW_ARG",
        varName,
        line
      };
    } else {
      return this.parseExpression();
    }
  }

  parseReassignment() {
    const line = this.currentToken.line;
    const lhs = this.parseExpression();
    if (this.currentToken && this.currentToken.value === "=") {
      this.advance();
      const rhs = this.parseExpression();
      this.expectSemicolon();
      if (lhs.type === "VAR") {
        return {
          id: uniqueId("assign"),
          type: "ASSIGN",
          varName: lhs.varName,
          value: rhs,
          line
        };
      } else if (lhs.type === "INDEX") {
        return {
          id: uniqueId("index_assign"),
          type: "INDEX_ASSIGN",
          target: lhs,
          value: rhs,
          line
        };
      }
      this.raiseError("Invalid assignment target!");
    } else {
      this.expectSemicolon();
      return lhs;
    }
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

  parseFunctionDef() {
    const line = this.currentToken.line;
    this.advance(); // Skip 'kaam'
    if (this.currentToken === null || this.currentToken.type !== "IDENTIFIER") {
      this.raiseError("Function nu naam aavvu joie bro!");
    }
    const funcName = this.currentToken.value;
    this.advance();
    if (this.currentToken === null || this.currentToken.value !== "(") {
      this.raiseError("Function name pachi '(' aavvo joie!");
    }
    this.advance();
    const params = [];
    if (this.currentToken && this.currentToken.value !== ")") {
      if (this.currentToken.type !== "IDENTIFIER") {
        this.raiseError("Function parameters ma variable naamo hova joie!");
      }
      params.push(this.currentToken.value);
      this.advance();
      while (this.currentToken && this.currentToken.value === ",") {
        this.advance();
        if (this.currentToken === null || this.currentToken.type !== "IDENTIFIER") {
          this.raiseError("Function parameters ma variable naamo hova joie!");
        }
        params.push(this.currentToken.value);
        this.advance();
      }
    }
    if (this.currentToken === null || this.currentToken.value !== ")") {
      this.raiseError("Function parameters pachi ')' aavvo joie!");
    }
    this.advance();
    if (this.currentToken === null || this.currentToken.value !== "{") {
      this.raiseError("Function body ni sharuaat '{' thi hovi joie!");
    }
    this.advance();
    const body = this.parseBlock();
    if (this.currentToken === null || this.currentToken.value !== "}") {
      this.raiseError("Function body bandh karva '}' mukvanu bhooli gaya!");
    }
    this.advance();
    return {
      id: uniqueId("func_def"),
      type: "FUNCTION_DEF",
      funcName,
      params,
      body,
      line
    };
  }

  parseReturn() {
    const line = this.currentToken.line;
    this.advance(); // Skip 'aap'
    let value = null;
    if (this.currentToken && this.currentToken.value !== ";") {
      value = this.parseExpression();
    }
    this.expectSemicolon();
    return {
      id: uniqueId("return"),
      type: "RETURN",
      value,
      line
    };
  }

  parseExpression() {
    return this.parseLogicalOr();
  }

  parseLogicalOr() {
    let left = this.parseLogicalAnd();
    while (
      this.currentToken &&
      this.currentToken.type === "OR"
    ) {
      const op = this.currentToken.value;
      const line = this.currentToken.line;
      this.advance();
      const right = this.parseLogicalAnd();
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

  parseLogicalAnd() {
    let left = this.parseComparison();
    while (
      this.currentToken &&
      this.currentToken.type === "AND"
    ) {
      const op = this.currentToken.value;
      const line = this.currentToken.line;
      this.advance();
      const right = this.parseComparison();
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

  parseComparison() {
    let left = this.parseAddSub();
    while (true) {
      if (
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
      } else if (this.currentToken && this.currentToken.type === "HAS") {
        const line = this.currentToken.line;
        this.advance(); // Skip 'has'
        if (this.currentToken === null || this.currentToken.type !== "VALUE") {
          this.raiseError("'has' pachi 'value' keyword mukvanu bhooli gaya bro!");
        }
        this.advance(); // Skip 'value'
        left = {
          id: uniqueId("has_value"),
          type: "HAS_VALUE",
          expr: left,
          line
        };
      } else {
        break;
      }
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
      ["*", "/", "%"].includes(this.currentToken.value)
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
    let base;

    if (tok.type === "NUMBER") {
      this.advance();
      base = {
        id: uniqueId("literal"),
        type: "LITERAL",
        value: tok.value,
        line: tok.line
      };
    } else if (tok.type === "STRING") {
      this.advance();
      base = {
        id: uniqueId("literal"),
        type: "LITERAL",
        value: tok.value,
        line: tok.line
      };
    } else if (tok.type === "BOOLEAN") {
      this.advance();
      base = {
        id: uniqueId("literal"),
        type: "LITERAL",
        value: tok.value === "kharu",
        line: tok.line
      };
    } else if (tok.type === "KHAALI") {
      this.advance();
      base = {
        id: uniqueId("literal"),
        type: "KHAALI",
        line: tok.line
      };
    } else if (tok.type === "IDENTIFIER") {
      this.advance();
      base = {
        id: uniqueId("var"),
        type: "VAR",
        varName: tok.value,
        line: tok.line
      };
    } else if (tok.type === "SYMBOL" && tok.value === "[") {
      this.advance(); // Skip '['
      const elements = [];
      if (this.currentToken && this.currentToken.value !== "]") {
        elements.push(this.parseExpression());
        while (this.currentToken && this.currentToken.value === ",") {
          this.advance();
          elements.push(this.parseExpression());
        }
      }
      if (this.currentToken === null || this.currentToken.value !== "]") {
        this.raiseError("Array list bandh karva ']' mukvanu bhooli gaya!");
      }
      this.advance(); // Skip ']'
      base = {
        id: uniqueId("list"),
        type: "LIST",
        elements,
        line: tok.line
      };
    } else if (tok.type === "SYMBOL" && tok.value === "(") {
      this.advance();
      const expr = this.parseExpression();
      if (this.currentToken === null || this.currentToken.value !== ")") {
        this.raiseError("Expression pachi ')' mukvanu bhooli gaya!");
      }
      this.advance();
      base = expr;
    } else {
      this.raiseError(`Unexpected token in expression: ${tok.type} (${tok.value})`);
    }

    // Now handle trailing function calls or index access or dot operator
    while (this.currentToken && (this.currentToken.value === "(" || this.currentToken.value === "[" || this.currentToken.value === ".")) {
      if (this.currentToken.value === "(") {
        const callLine = this.currentToken.line;
        this.advance(); // skip '('
        const args = [];
        if (this.currentToken && this.currentToken.value !== ")") {
          args.push(this.parseCallArg());
          while (this.currentToken && this.currentToken.value === ",") {
            this.advance();
            args.push(this.parseCallArg());
          }
        }
        if (this.currentToken === null || this.currentToken.value !== ")") {
          this.raiseError("Function call bandh karva ')' mukvanu bhooli gaya!");
        }
        this.advance(); // skip ')'
        base = {
          id: uniqueId("call"),
          type: "CALL",
          callee: base,
          args,
          line: callLine
        };
      } else if (this.currentToken.value === "[") {
        const indexLine = this.currentToken.line;
        this.advance(); // skip '['
        const indexExpr = this.parseExpression();
        if (this.currentToken === null || this.currentToken.value !== "]") {
          this.raiseError("Index bracket bandh karva ']' mukvanu bhooli gaya!");
        }
        this.advance(); // skip ']'
        base = {
          id: uniqueId("index"),
          type: "INDEX",
          base,
          indexExpr,
          line: indexLine
        };
      } else if (this.currentToken.value === ".") {
        const line = this.currentToken.line;
        this.advance(); // skip '.'
        if (this.currentToken === null || this.currentToken.type !== "IDENTIFIER") {
          this.raiseError("'.' pachi method/member nu naam aavvu joie bro!");
        }
        const memberName = this.currentToken.value;
        this.advance();
        if (this.currentToken && this.currentToken.value === "(") {
          this.advance(); // skip '('
          const args = [];
          if (this.currentToken && this.currentToken.value !== ")") {
            args.push(this.parseCallArg());
            while (this.currentToken && this.currentToken.value === ",") {
              this.advance();
              args.push(this.parseCallArg());
            }
          }
          if (this.currentToken === null || this.currentToken.value !== ")") {
            this.raiseError("Method call bandh karva ')' mukvanu bhooli gaya!");
          }
          this.advance(); // skip ')'
          base = {
            id: uniqueId("method_call"),
            type: "METHOD_CALL",
            base,
            memberName,
            args,
            line
          };
        } else {
          base = {
            id: uniqueId("member_access"),
            type: "MEMBER_ACCESS",
            base,
            memberName,
            line
          };
        }
      }
    }

    return base;
  }
}

// ----------------------------------------------------
// 3. STEPPED EVALUATOR (GENERATOR BASED)
// ----------------------------------------------------

export class Evaluator {
  constructor() {
    this.globalEnv = new Environment();
    this.variables = this.globalEnv.records;
  }

  // Evaluates recursive calls synchronously inside expressions
  evaluateFunctionSync(func, args) {
    const params = func.params;
    const body = func.body;
    if (args.length !== params.length) {
      throw new Error(`Function expects ${params.length} arguments, got ${args.length}!`);
    }
    const funcEnv = new Environment(func.closure || this.globalEnv);
    for (let i = 0; i < params.length; i++) {
      funcEnv.define(params[i], args[i]);
    }

    // Custom return catcher
    class ReturnException extends Error {
      constructor(value) {
        super("RETURN");
        this.value = value;
      }
    }

    const evalStatement = (stmt, env) => {
      if (stmt.type === "ASSIGN") {
        const val = this.evaluateExpr(stmt.value, env);
        try {
          env.assign(stmt.varName, val);
        } catch {
          env.define(stmt.varName, val);
        }
      } else if (stmt.type === "HISAAB_ASSIGN") {
        const val = this.evaluateExpr(stmt.value, env);
        const ledger = new Ledger(val);
        env.define(stmt.varName, ledger);
      } else if (stmt.type === "PEDHI_DEF") {
        env.define(stmt.pedhiName, {
          type: "PEDHI_CLASS",
          pedhiName: stmt.pedhiName,
          methods: stmt.methods
        });
      } else if (stmt.type === "INDEX_ASSIGN") {
        const arr = this.evaluateExpr(stmt.target.base, env);
        const idx = this.evaluateExpr(stmt.target.indexExpr, env);
        const val = this.evaluateExpr(stmt.value, env);
        if (!Array.isArray(arr)) {
          throw new Error(`Index assignment is only supported on array lists!`);
        }
        if (!Number.isInteger(idx)) {
          throw new Error(`Array list index must be an integer!`);
        }
        arr[idx] = val;
      } else if (stmt.type === "PRINT") {
        this.evaluateExpr(stmt.value, env);
      } else if (stmt.type === "RETURN") {
        const val = this.evaluateExpr(stmt.value, env);
        throw new ReturnException(val);
      } else if (stmt.type === "IF") {
        const cond = this.evaluateExpr(stmt.condition, env);
        const blockEnv = new Environment(env);
        if (cond && stmt.condition.type === "HAS_VALUE" && stmt.condition.expr.type === "VAR") {
          blockEnv.makeSafe(stmt.condition.expr.varName);
        }
        const block = cond ? stmt.ifBlock : stmt.elseBlock;
        if (block) {
          for (const s of block) {
            evalStatement(s, blockEnv);
          }
        }
      } else if (stmt.type === "WHILE") {
        while (true) {
          const cond = this.evaluateExpr(stmt.condition, env);
          if (!cond) break;
          const blockEnv = new Environment(env);
          for (const s of stmt.block) {
            evalStatement(s, blockEnv);
          }
        }
      } else {
        // standalone expression call
        this.evaluateExpr(stmt, env);
      }
    };

    try {
      for (const stmt of body) {
        evalStatement(stmt, funcEnv);
      }
    } catch (err) {
      if (err instanceof ReturnException) {
        return err.value;
      }
      throw err;
    }
    return null;
  }

  // Evaluates plain expressions synchronously (raw)
  evaluateExprRaw(node, env = null) {
    if (env === null) {
      env = this.globalEnv;
    }
    if (node === null || typeof node !== "object") {
      return node;
    }

    if (node.type === "KHAALI") {
      return khaali;
    }

    if (node.type === "LITERAL") {
      return node.value;
    }

    if (node.type === "VAR") {
      const varName = node.varName;
      try {
        env.checkOwnership(varName);
        const val = env.lookup(varName);
        if (val === khaali) {
          if (!env.isSafe(varName)) {
            throw new Error(`❌ Bina-Bhul Safety Exception: Attempted to operate on unchecked 'khaali' variable '${varName}'!`);
          }
        }
        return val;
      } catch (err) {
        throw new Error(`${err.message} (Line ${node.line})`);
      }
    }

    if (node.type === "LIST") {
      return node.elements.map(elem => this.evaluateExpr(elem, env));
    }

    if (node.type === "INDEX") {
      const base = this.evaluateExpr(node.base, env);
      const idx = this.evaluateExpr(node.indexExpr, env);
      if (!Array.isArray(base)) {
        throw new Error(`Indexing is only supported on array lists! (Line ${node.line})`);
      }
      if (!Number.isInteger(idx)) {
        throw new Error(`Array list index must be an integer! (Line ${node.line})`);
      }
      return base[idx];
    }

    if (node.type === "HAS_VALUE") {
      let val;
      if (node.expr && node.expr.type === "VAR") {
        const varName = node.expr.varName;
        env.checkOwnership(varName);
        val = env.lookup(varName);
      } else {
        val = this.evaluateExprRaw(node.expr, env);
      }
      return val !== khaali;
    }

    if (node.type === "CALL") {
      const calleeName = node.callee.type === "VAR" ? node.callee.varName : "";
      const args = this.evaluateCallArgs(node.args, env);

      if (calleeName === "lambai") {
        if (args.length !== 1) {
          throw new Error(`lambai function expects exactly 1 argument! (Line ${node.line})`);
        }
        if (!Array.isArray(args[0])) {
          throw new Error(`lambai function expects an array list! (Line ${node.line})`);
        }
        return args[0].length;
      }
      if (calleeName === "umedo") {
        if (args.length !== 2) {
          throw new Error(`umedo function expects exactly 2 arguments! (Line ${node.line})`);
        }
        if (!Array.isArray(args[0])) {
          throw new Error(`First argument to umedo must be an array list! (Line ${node.line})`);
        }
        args[0].push(args[1]);
        return null;
      }

      if (!calleeName) {
        throw new Error(`Invalid function call! (Line ${node.line})`);
      }
      const func = env.lookup(calleeName);
      if (!func || func.type !== "FUNCTION") {
        throw new Error(`'${calleeName}' is not a callable function! (Line ${node.line})`);
      }

      return this.evaluateFunctionSync(func, args);
    }

    if (node.type === "METHOD_CALL") {
      const baseVal = this.evaluateExprRaw(node.base, env);
      const methodName = node.memberName;
      const args = this.evaluateCallArgs(node.args, env);

      if (baseVal && baseVal.type === "PEDHI_CLASS") {
        if (methodName === "chalu") {
          return new PedhiInstance(baseVal.pedhiName, baseVal.methods, this);
        } else {
          throw new Error(`Unknown static pedhi method: ${methodName} (Line ${node.line})`);
        }
      }

      if (baseVal instanceof PedhiInstance) {
        if (methodName === "sauda") {
          if (args.length < 1) {
            throw new Error(`sauda method expects at least the method name argument! (Line ${node.line})`);
          }
          return baseVal.sauda(args[0], args.slice(1));
        } else {
          throw new Error(`Unknown pedhi instance method: ${methodName} (Line ${node.line})`);
        }
      }

      if (baseVal instanceof SaudaContract) {
        if (methodName === "melvo") {
          return baseVal.melvo();
        } else {
          throw new Error(`Unknown sauda contract method: ${methodName} (Line ${node.line})`);
        }
      }

      if (baseVal instanceof Ledger) {
        if (methodName === "jama") {
          if (args.length !== 1) throw new Error(`jama expects 1 argument! (Line ${node.line})`);
          return baseVal.jama(args[0]);
        } else if (methodName === "udhaar") {
          if (args.length !== 1) throw new Error(`udhaar expects 1 argument! (Line ${node.line})`);
          return baseVal.udhaar(args[0]);
        } else if (methodName === "itihas") {
          if (args.length !== 1) throw new Error(`itihas expects 1 argument! (Line ${node.line})`);
          return baseVal.itihas(args[0]);
        } else {
          throw new Error(`Unknown ledger method: ${methodName} (Line ${node.line})`);
        }
      }

      throw new Error(`Method calls are not supported on this type! (Line ${node.line})`);
    }

    if (node.type === "MEMBER_ACCESS") {
      const baseVal = this.evaluateExpr(node.base, env);
      throw new Error(`Member access '${node.memberName}' is not supported on this object! (Line ${node.line})`);
    }

    if (node.type === "BIN_OP") {
      const left = this.evaluateExpr(node.left, env);
      const right = this.evaluateExpr(node.right, env);
      const op = node.op;

      if (op === "ane" || op === "AND") {
        return Boolean(left) && Boolean(right);
      }
      if (op === "athva" || op === "OR") {
        return Boolean(left) || Boolean(right);
      }
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
      if (op === "%") {
        return left % right;
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

  evaluateExpr(node, env = null) {
    const res = this.evaluateExprRaw(node, env);
    return unwrapVal(res);
  }

  evaluateCallArgs(argNodes, env) {
    const evaluatedArgs = [];
    for (const arg of argNodes) {
      if (arg && arg.type === "BORROW_ARG") {
        const varName = arg.varName;
        env.checkOwnership(varName);
        const val = env.lookup(varName);
        if (val === khaali && !env.isSafe(varName)) {
          throw new Error(`❌ Bina-Bhul Safety Exception: Attempted to operate on unchecked 'khaali' variable '${varName}'! (Line ${arg.line})`);
        }
        evaluatedArgs.push(val);
      } else if (arg && arg.type === "VAR") {
        const varName = arg.varName;
        env.checkOwnership(varName);
        const val = env.lookup(varName);
        if (val === khaali && !env.isSafe(varName)) {
          throw new Error(`❌ Bina-Bhul Safety Exception: Attempted to operate on unchecked 'khaali' variable '${varName}'! (Line ${arg.line})`);
        }
        evaluatedArgs.push(val);
        env.moveOwnership(varName);
      } else {
        evaluatedArgs.push(this.evaluateExpr(arg, env));
      }
    }
    return evaluatedArgs;
  }

  /**
   * Generator-based statement evaluator.
   * Yields at each statement pause. The yielder returns:
   *   { node: ASTNode, variables: Object, type: "STATEMENT" | "INPUT", env: Environment }
   */
  *evaluate(node, env = null) {
    if (env === null) {
      env = this.globalEnv;
    }
    if (!node) return;

    // Array of statements (a block)
    if (Array.isArray(node)) {
      const blockEnv = new Environment(env);
      for (const stmt of node) {
        yield* this.evaluate(stmt, blockEnv);
      }
      return;
    }

    // Yield statement before execution for debugging highlights
    if (
      node.type === "ASSIGN" ||
      node.type === "HISAAB_ASSIGN" ||
      node.type === "PEDHI_DEF" ||
      node.type === "INDEX_ASSIGN" ||
      node.type === "PRINT" ||
      node.type === "INPUT" ||
      node.type === "IF" ||
      node.type === "WHILE" ||
      node.type === "FUNCTION_DEF" ||
      node.type === "RETURN" ||
      node.type === "CALL" ||
      node.type === "METHOD_CALL"
    ) {
      yield {
        node,
        variables: { ...env.records },
        type: "STATEMENT",
        env
      };
    }

    // 1. ASSIGNMENT
    if (node.type === "ASSIGN") {
      const val = this.evaluateExpr(node.value, env);
      try {
        env.assign(node.varName, val);
      } catch {
        env.define(node.varName, val);
      }
      this.variables = this.globalEnv.records;
    }

    // HISAAB ASSIGNMENT
    else if (node.type === "HISAAB_ASSIGN") {
      const val = this.evaluateExpr(node.value, env);
      const ledger = new Ledger(val);
      env.define(node.varName, ledger);
      this.variables = this.globalEnv.records;
    }

    // PEDHI DEFINITION
    else if (node.type === "PEDHI_DEF") {
      env.define(node.pedhiName, {
        type: "PEDHI_CLASS",
        pedhiName: node.pedhiName,
        methods: node.methods
      });
      this.variables = this.globalEnv.records;
    }

    // 1b. INDEX ASSIGNMENT
    else if (node.type === "INDEX_ASSIGN") {
      const arr = this.evaluateExpr(node.target.base, env);
      const idx = this.evaluateExpr(node.target.indexExpr, env);
      const val = this.evaluateExpr(node.value, env);
      if (!Array.isArray(arr)) {
        throw new Error(`Index assignment is only supported on array lists! (Line ${node.line})`);
      }
      if (!Number.isInteger(idx)) {
        throw new Error(`Array list index must be an integer! (Line ${node.line})`);
      }
      arr[idx] = val;
    }

    // 2. PRINT
    else if (node.type === "PRINT") {
      const val = this.evaluateExpr(node.value, env);
      return val;
    }

    // 3. INPUT
    else if (node.type === "INPUT") {
      const rawInput = yield {
        node,
        variables: { ...env.records },
        type: "INPUT",
        varName: node.varName,
        env
      };

      let processedInput = rawInput;
      if (rawInput !== undefined && rawInput !== null) {
        if (!isNaN(rawInput) && rawInput.trim() !== "") {
          processedInput = rawInput.includes(".") ? parseFloat(rawInput) : parseInt(rawInput, 10);
        } else if (rawInput === "kharu" || rawInput === "true") {
          processedInput = true;
        } else if (rawInput === "khotu" || rawInput === "false") {
          processedInput = false;
        } else if (rawInput === "khaali") {
          processedInput = khaali;
        }
      }
      try {
        env.assign(node.varName, processedInput);
      } catch {
        env.define(node.varName, processedInput);
      }
      this.variables = this.globalEnv.records;
    }

    // 4. IF CONDITIONAL
    else if (node.type === "IF") {
      const condVal = this.evaluateExpr(node.condition, env);
      const blockEnv = new Environment(env);
      if (condVal && node.condition.type === "HAS_VALUE" && node.condition.expr.type === "VAR") {
        blockEnv.makeSafe(node.condition.expr.varName);
      }
      if (condVal) {
        yield* this.evaluate(node.ifBlock, blockEnv);
      } else if (node.elseBlock) {
        yield* this.evaluate(node.elseBlock, blockEnv);
      }
    }

    // 5. WHILE LOOP
    else if (node.type === "WHILE") {
      while (true) {
        yield {
          node: node.conditionNode,
          variables: { ...env.records },
          type: "STATEMENT",
          env
        };

        const condVal = this.evaluateExpr(node.condition, env);
        if (!condVal) break;

        yield* this.evaluate(node.block, env);
      }
    }

    // 6. FUNCTION DEFINITION
    else if (node.type === "FUNCTION_DEF") {
      env.define(node.funcName, {
        type: "FUNCTION",
        params: node.params,
        body: node.body,
        closure: env
      });
      this.variables = this.globalEnv.records;
    }

    // 7. RETURN
    else if (node.type === "RETURN") {
      const val = this.evaluateExpr(node.value, env);
      return val;
    }

    // 8. STANDALONE EXPRESSION STATEMENT
    else {
      this.evaluateExpr(node, env);
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
          const val = evaluator.evaluateExpr(step.node.value, step.env);
          outputs.push(String(val));
        }
        next = iterator.next();
      } else if (step.type === "INPUT") {
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

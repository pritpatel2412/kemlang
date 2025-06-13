class Token:
    def __init__(self, type, value, line):
        self.type = type
        self.value = value
        self.line = line

    def __repr__(self):
        return f"Token({self.type}, {self.value}, line={self.line})"

class Lexer:
    def __init__(self, code):
        self.code = code
        self.pos = 0
        self.line = 1
        self.current_char = self.code[self.pos] if self.code else None
        self.keywords = {
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
        }

    def advance(self):
        if self.current_char == '\n':
            self.line += 1
        self.pos += 1
        self.current_char = self.code[self.pos] if self.pos < len(self.code) else None

    def skip_whitespace(self):
        while self.current_char is not None and self.current_char.isspace():
            self.advance()

    def skip_comment(self):
        if self.current_char == '/':
            while self.current_char is not None and self.current_char != '\n':
                self.advance()
            if self.current_char == '\n':
                self.advance()

    def read_number(self):
        result = ""
        start_line = self.line
        while self.current_char is not None and self.current_char.isdigit():
            result += self.current_char
            self.advance()
        return Token("NUMBER", int(result), start_line)

    def read_string(self):
        result = ""
        start_line = self.line
        self.advance()  # Skip opening quote
        while self.current_char is not None and self.current_char != '"':
            result += self.current_char
            self.advance()
        if self.current_char != '"':
            raise Exception(f"❌ Error: Unterminated string literal (Line {start_line})")
        self.advance()  # Skip closing quote
        return Token("STRING", result, start_line)

    def read_identifier(self):
        result = ""
        start_line = self.line
        while self.current_char is not None and (self.current_char.isalnum() or self.current_char == '_'):
            result += self.current_char
            self.advance()
        token_type = self.keywords.get(result, "IDENTIFIER")
        return Token(token_type, result, start_line)

    def tokenize(self):
        tokens = []
        while self.current_char is not None:
            if self.current_char.isspace():
                self.skip_whitespace()
            elif self.current_char == '/':
                self.skip_comment()
            elif self.current_char == '"':
                tokens.append(self.read_string())
            elif self.current_char.isdigit():
                tokens.append(self.read_number())
            elif self.current_char.isalpha():
                tokens.append(self.read_identifier())
            elif self.current_char in "=<>!":
                start_line = self.line
                op = self.current_char
                self.advance()
                if self.current_char == '=':
                    op += '='
                    self.advance()
                tokens.append(Token("OPERATOR", op, start_line))
            elif self.current_char in "+-*/":
                tokens.append(Token("OPERATOR", self.current_char, self.line))
                self.advance()
            elif self.current_char in "{}();":
                tokens.append(Token("SYMBOL", self.current_char, self.line))
                self.advance()
            else:
                char = self.current_char
                pos = self.pos
                line = self.line
                self.advance()
                raise Exception(f"❌ Error: Unknown character '{char}' at position {pos} (Line {line})")
        return tokens

def tokenize(code):
    return Lexer(code).tokenize()

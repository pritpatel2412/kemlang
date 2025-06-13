import random

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.current_token = None
        self.token_index = -1
        self.advance()

    def advance(self):
        self.token_index += 1
        self.current_token = self.tokens[self.token_index] if self.token_index < len(self.tokens) else None

    def parse(self):
        if self.current_token is None or self.current_token.value != "sharu":
            self.raise_error("Code ni sharuaat 'sharu' thi thay chhe bhai!")
        self.advance()
        if self.current_token is None or self.current_token.value != "{":
            self.raise_error("'sharu' pachi '{' mukvanu bhooli gayo bhai!")
        self.advance()

        statements = self.parse_block()

        if self.current_token is None or self.current_token.value != "}":
            self.raise_error("'samaapt' pehla closing '}' mukvano rehi gayu chhe!")
        self.advance()
        if self.current_token is None or self.current_token.value != "samaapt":
            self.raise_error("Code ni antim line 'samaapt' hovi joie!")
        return statements

    def parse_block(self):
        statements = []
        while (
            self.current_token is not None
            and self.current_token.value != "samaapt"
            and self.current_token.value != "}"
        ):
            if self.current_token.type == "VAR_DECLARE":
                statements.append(self.parse_assignment())
            elif self.current_token.type == "PRINT":
                statements.append(self.parse_print())
            elif self.current_token.type == "IF":
                statements.append(self.parse_if())
            elif self.current_token.type == "WHILE":
                statements.append(self.parse_while())
            elif self.current_token.type == "INPUT":
                statements.append(self.parse_input())
            elif self.current_token.type == "IDENTIFIER":
                statements.append(self.parse_reassignment())
            else:
                self.advance()
        return statements

    def expect_semicolon(self):
        if self.current_token is None or self.current_token.value != ";":
            self.raise_error("Statement pachi ';' mukto kharo bhai!")
        self.advance()

    def parse_assignment(self):
        self.advance()  # Skip 'do'
        if self.current_token is None or self.current_token.type != "IDENTIFIER":
            self.raise_error("'do' pachi variable naam aavvu joie bro!")
        var_name = self.current_token.value
        self.advance()
        if self.current_token is None or self.current_token.value != "=":
            self.raise_error(f"Variable '{var_name}' pachi '=' mukvanu bhooli gaya!")
        self.advance()
        value = self.parse_expression()
        self.expect_semicolon()
        return ("ASSIGN", var_name, value)

    def parse_reassignment(self):
        var_name = self.current_token.value
        self.advance()
        if self.current_token is None or self.current_token.value != "=":
            self.raise_error(f"'{var_name}' pachi '=' aavvo joie!")
        self.advance()
        value = self.parse_expression()
        self.expect_semicolon()
        return ("ASSIGN", var_name, value)

    def parse_print(self):
        self.advance()  # Skip 'lakho'
        value = self.parse_expression()
        self.expect_semicolon()
        return ("PRINT", value)

    def parse_input(self):
        self.advance()  # Skip 'jaano'
        if self.current_token is None or self.current_token.type != "IDENTIFIER":
            self.raise_error("'jaano' pachi variable naam mukvanu bhai!")
        var_name = self.current_token.value
        self.advance()
        self.expect_semicolon()
        return ("INPUT", var_name)

    def parse_if(self):
        self.advance()  # Skip 'jo'
        condition = self.parse_expression()
        if self.current_token and self.current_token.value == "{":
            self.advance()
            if_block = self.parse_block()
            if self.current_token and self.current_token.value == "}":
                self.advance()
            else:
                self.raise_error("'if' block pachi closing '}' mukvanu reh gayu!")
        else:
            self.raise_error("'jo' pachi '{' mukvanu joie!")

        else_block = []
        if self.current_token and self.current_token.value == "nahitar":
            self.advance()
            if self.current_token and self.current_token.value == "{":
                self.advance()
                else_block = self.parse_block()
                if self.current_token and self.current_token.value == "}":
                    self.advance()
                else:
                    self.raise_error("'nahitar' block pachi '}' muk!")
            else:
                self.raise_error("'nahitar' pachi '{' aavvu joie!")
        return ("IF", condition, if_block, else_block)

    def parse_while(self):
        self.advance()  # Skip 'jyaare'
        condition = self.parse_expression()
        if self.current_token and self.current_token.value == "{":
            self.advance()
            block = self.parse_block()
            if self.current_token and self.current_token.value == "}":
                self.advance()
            else:
                self.raise_error("'while' block bandh karvani bhool na kar!")
        else:
            self.raise_error("'jyaare' pachi '{' mukvanu joie!")
        return ("WHILE", condition, block)

    def parse_expression(self):
        return self.parse_comparison()

    def parse_comparison(self):
        left = self.parse_add_sub()
        while self.current_token and self.current_token.type == "OPERATOR" and self.current_token.value in ("==", "!=", "<", ">", "<=", ">="):
            op = self.current_token.value
            self.advance()
            right = self.parse_add_sub()
            left = ("BIN_OP", op, left, right)
        return left

    def parse_add_sub(self):
        left = self.parse_mul_div()
        while self.current_token and self.current_token.type == "OPERATOR" and self.current_token.value in ("+", "-"):
            op = self.current_token.value
            self.advance()
            right = self.parse_mul_div()
            left = ("BIN_OP", op, left, right)
        return left

    def parse_mul_div(self):
        left = self.parse_primary()
        while self.current_token and self.current_token.type == "OPERATOR" and self.current_token.value in ("*", "/"):
            op = self.current_token.value
            self.advance()
            right = self.parse_primary()
            left = ("BIN_OP", op, left, right)
        return left

    def parse_primary(self):
        if self.current_token is None:
            self.raise_error("Expression adho chhe! Kai to lakh bhai.")
        tok = self.current_token
        if tok.type in ("NUMBER", "STRING", "BOOLEAN"):
            self.advance()
            return tok.value
        elif tok.type == "IDENTIFIER":
            self.advance()
            return ("VAR", tok.value)
        elif tok.type == "SYMBOL" and tok.value == "(":
            self.advance()
            expr = self.parse_expression()
            if self.current_token is None or self.current_token.value != ")":
                self.raise_error("Expression pachi ')' mukvanu bhooli gaya!")
            self.advance()
            return expr
        else:
            self.raise_error(f"Unexpected token in expression: {tok.type} ({tok.value})")

    def raise_error(self, message):
        funny_prefixes = [
            "❌ Arre Bhai Bhai Bhai !!!",
            "😵‍💫 Arey re re re! Su thai gayu??",
            "🙄 Kem Bhool Thai Gayi Bhai?",
            "🚨 Kod ma Tufan!",
            "😬 Ee to bug nikdi gaya re!",
            "🤦‍♂️ Aavo Re Bug Maharaj!",
            "😂 Hasva nu man thay chhe... pan code run nathi thato!",
            "🫣 Code jova layak nathi re bhai!",
            "🤖 KemLang no Compiler pan confuse thai gayo!"
        ]
        prefix = random.choice(funny_prefixes)
        line_info = f" (Line {self.current_token.line})" if self.current_token and hasattr(self.current_token, "line") else ""
        raise Exception(f"{prefix}\n> {message}{line_info}")

# ✅ Wrapper
def parse(tokens):
    return Parser(tokens).parse()

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
            elif self.current_token.type == "HISAAB_DECLARE":
                statements.append(self.parse_hisaab_declare())
            elif self.current_token.type == "PEDHI":
                statements.append(self.parse_pedhi_def())
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
            elif self.current_token.type == "FUNCTION":
                statements.append(self.parse_function_def())
            elif self.current_token.type == "RETURN":
                statements.append(self.parse_return())
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

    def parse_hisaab_declare(self):
        self.advance()  # Skip 'hisaab'
        if self.current_token is None or self.current_token.type != "IDENTIFIER":
            self.raise_error("'hisaab' pachi variable naam aavvu joie bro!")
        var_name = self.current_token.value
        self.advance()
        if self.current_token is None or self.current_token.value != "=":
            self.raise_error(f"Ledger variable '{var_name}' pachi '=' mukvanu bhooli gaya!")
        self.advance()
        value = self.parse_expression()
        self.expect_semicolon()
        return ("HISAAB_ASSIGN", var_name, value)

    def parse_pedhi_def(self):
        self.advance()  # Skip 'pedhi'
        if self.current_token is None or self.current_token.type != "IDENTIFIER":
            self.raise_error("'pedhi' pachi organization/actor nu naam aavvu joie!")
        pedhi_name = self.current_token.value
        self.advance()
        if self.current_token is None or self.current_token.value != "{":
            self.raise_error("'pedhi' name pachi '{' aavvu joie!")
        self.advance()
        
        methods = {}
        while self.current_token and self.current_token.value != "}":
            if self.current_token.type == "FUNCTION":
                func = self.parse_function_def()
                methods[func[1]] = func
            else:
                self.raise_error("pedhi ni andar khali functions ('kaam') ja lakhi shakay!")
                
        if self.current_token is None or self.current_token.value != "}":
            self.raise_error("'pedhi' body bandh karva '}' mukvanu bhooli gaya!")
        self.advance()
        return ("PEDHI_DEF", pedhi_name, methods)

    def parse_call_arg(self):
        if self.current_token and self.current_token.type == "BORROW":
            self.advance()  # skip 'bhadu'
            if self.current_token is None or self.current_token.type != "IDENTIFIER":
                self.raise_error("'bhadu' pachi variable nu naam aavvu joie!")
            var_name = self.current_token.value
            self.advance()
            return ("BORROW_ARG", var_name)
        else:
            return self.parse_expression()

    def parse_reassignment(self):
        lhs = self.parse_expression()
        if self.current_token and self.current_token.value == "=":
            self.advance()
            rhs = self.parse_expression()
            self.expect_semicolon()
            if isinstance(lhs, tuple):
                if lhs[0] == "VAR":
                    return ("ASSIGN", lhs[1], rhs)
                elif lhs[0] == "INDEX":
                    return ("INDEX_ASSIGN", lhs, rhs)
            self.raise_error("Invalid assignment target!")
        else:
            self.expect_semicolon()
            return lhs

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

    def parse_function_def(self):
        self.advance()  # Skip 'kaam'
        if self.current_token is None or self.current_token.type != "IDENTIFIER":
            self.raise_error("'kaam' pachi function nu naam aavvu joie!")
        func_name = self.current_token.value
        self.advance()
        if self.current_token is None or self.current_token.value != "(":
            self.raise_error("Function name pachi '(' aavvo joie!")
        self.advance()
        params = []
        if self.current_token and self.current_token.value != ")":
            if self.current_token.type != "IDENTIFIER":
                self.raise_error("Function parameters ma variable naamo hova joie!")
            params.append(self.current_token.value)
            self.advance()
            while self.current_token and self.current_token.value == ",":
                self.advance()
                if self.current_token is None or self.current_token.type != "IDENTIFIER":
                    self.raise_error("Function parameters ma variable naamo hova joie!")
                params.append(self.current_token.value)
                self.advance()
        if self.current_token is None or self.current_token.value != ")":
            self.raise_error("Function parameters pachi ')' aavvo joie!")
        self.advance()
        if self.current_token is None or self.current_token.value != "{":
            self.raise_error("Function body ni sharuaat '{' thi hovi joie!")
        self.advance()
        body = self.parse_block()
        if self.current_token is None or self.current_token.value != "}":
            self.raise_error("Function body bandh karva '}' mukvanu bhooli gaya!")
        self.advance()
        return ("FUNCTION_DEF", func_name, params, body)

    def parse_return(self):
        self.advance()  # Skip 'aap'
        value = None
        if self.current_token and self.current_token.value != ";":
            value = self.parse_expression()
        self.expect_semicolon()
        return ("RETURN", value)

    def parse_expression(self):
        return self.parse_logical_or()

    def parse_logical_or(self):
        left = self.parse_logical_and()
        while self.current_token and self.current_token.type == "OR":
            op = self.current_token.value
            self.advance()
            right = self.parse_logical_and()
            left = ("BIN_OP", op, left, right)
        return left

    def parse_logical_and(self):
        left = self.parse_comparison()
        while self.current_token and self.current_token.type == "AND":
            op = self.current_token.value
            self.advance()
            right = self.parse_comparison()
            left = ("BIN_OP", op, left, right)
        return left

    def parse_comparison(self):
        left = self.parse_add_sub()
        while True:
            if self.current_token and self.current_token.type == "OPERATOR" and self.current_token.value in ("==", "!=", "<", ">", "<=", ">="):
                op = self.current_token.value
                self.advance()
                right = self.parse_add_sub()
                left = ("BIN_OP", op, left, right)
            elif self.current_token and self.current_token.type == "HAS":
                self.advance()  # Skip 'has'
                if self.current_token is None or self.current_token.type != "VALUE":
                    self.raise_error("'has' pachi 'value' keyword mukvanu bhooli gaya bro!")
                self.advance()  # Skip 'value'
                left = ("HAS_VALUE", left)
            else:
                break
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
        while self.current_token and self.current_token.type == "OPERATOR" and self.current_token.value in ("*", "/", "%"):
            op = self.current_token.value
            self.advance()
            right = self.parse_primary()
            left = ("BIN_OP", op, left, right)
        return left

    def parse_primary(self):
        if self.current_token is None:
            self.raise_error("Expression adho chhe! Kai to lakh bhai.")
        tok = self.current_token
        
        if tok.type in ("NUMBER", "STRING"):
            self.advance()
            base = tok.value
        elif tok.type == "BOOLEAN":
            self.advance()
            base = True if tok.value == "kharu" else False
        elif tok.type == "KHAALI":
            self.advance()
            base = ("KHAALI",)
        elif tok.type == "IDENTIFIER":
            self.advance()
            base = ("VAR", tok.value)
        elif tok.type == "SYMBOL" and tok.value == "[":
            self.advance()
            elements = []
            if self.current_token and self.current_token.value != "]":
                elements.append(self.parse_expression())
                while self.current_token and self.current_token.value == ",":
                    self.advance()
                    elements.append(self.parse_expression())
            if self.current_token is None or self.current_token.value != "]":
                self.raise_error("Array list bandh karva ']' mukvanu bhooli gaya!")
            self.advance()
            base = ("LIST", elements)
        elif tok.type == "SYMBOL" and tok.value == "(":
            self.advance()
            expr = self.parse_expression()
            if self.current_token is None or self.current_token.value != ")":
                self.raise_error("Expression pachi ')' mukvanu bhooli gaya!")
            self.advance()
            base = expr
        else:
            self.raise_error(f"Unexpected token in expression: {tok.type} ({tok.value})")

        # Now handle index access or function calls trailing the base
        while self.current_token and self.current_token.value in ("(", "[", "."):
            if self.current_token.value == "(":
                self.advance()  # skip '('
                args = []
                if self.current_token and self.current_token.value != ")":
                    args.append(self.parse_call_arg())
                    while self.current_token and self.current_token.value == ",":
                        self.advance()
                        args.append(self.parse_call_arg())
                if self.current_token is None or self.current_token.value != ")":
                    self.raise_error("Function call bandh karva ')' mukvanu bhooli gaya!")
                self.advance()
                if isinstance(base, tuple) and base[0] == "VAR":
                    base = ("CALL", base[1], args)
                else:
                    base = ("CALL_EXPR", base, args)
            elif self.current_token.value == "[":
                self.advance()  # skip '['
                index_expr = self.parse_expression()
                if self.current_token is None or self.current_token.value != "]":
                    self.raise_error("Index bracket bandh karva ']' mukvanu bhooli gaya!")
                self.advance()
                base = ("INDEX", base, index_expr)
            elif self.current_token.value == ".":
                self.advance()  # skip '.'
                if self.current_token is None or self.current_token.type != "IDENTIFIER":
                    self.raise_error("'.' pachi method/member nu naam aavvu joie bro!")
                member_name = self.current_token.value
                self.advance()
                # Check if it's a method call
                if self.current_token and self.current_token.value == "(":
                    self.advance()  # skip '('
                    args = []
                    if self.current_token and self.current_token.value != ")":
                        args.append(self.parse_call_arg())
                        while self.current_token and self.current_token.value == ",":
                            self.advance()
                            args.append(self.parse_call_arg())
                    if self.current_token is None or self.current_token.value != ")":
                        self.raise_error("Method call bandh karva ')' mukvanu bhooli gaya!")
                    self.advance()
                    base = ("METHOD_CALL", base, member_name, args)
                else:
                    base = ("MEMBER_ACCESS", base, member_name)

        return base

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

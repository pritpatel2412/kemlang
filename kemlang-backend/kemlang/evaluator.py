class Evaluator:
    def __init__(self):
        self.variables = {}

    def evaluate(self, node):
        if isinstance(node, (int, float, str, bool)) or node is None:
            return node

        if not isinstance(node, (list, tuple)):
            raise Exception(f"Invalid node type: {type(node)}")

        node_type = node[0]

        if node_type == "ASSIGN":
            var_name = node[1]
            value = self.evaluate(node[2])
            self.variables[var_name] = value
            return value

        elif node_type == "PRINT":
            value = self.evaluate(node[1])
            print(value)
            return value

        elif node_type == "INPUT":
            var_name = node[1]
            user_input = input(f"{var_name}: ")
            try:
                # Try to convert to int or float if possible
                if '.' in user_input:
                    user_input = float(user_input)
                else:
                    user_input = int(user_input)
            except ValueError:
                pass  # Leave as string if not a number
            self.variables[var_name] = user_input
            return user_input

        elif node_type == "IF":
            condition = self.evaluate(node[1])
            block = node[2] if condition else node[3]
            for stmt in block:
                self.evaluate(stmt)
            return None

        elif node_type == "WHILE":
            while self.evaluate(node[1]):
                for stmt in node[2]:
                    self.evaluate(stmt)
            return None

        elif node_type == "BIN_OP":
            op = node[1]
            left = self.evaluate(node[2])
            right = self.evaluate(node[3])

            if op == "+":
                if isinstance(left, str) or isinstance(right, str):
                    return str(left) + str(right)
                return left + right
            elif op == "-":
                return left - right
            elif op == "*":
                return left * right
            elif op == "/":
                return left / right
            elif op == ">":
                return left > right
            elif op == "<":
                return left < right
            elif op == "==":
                return left == right
            elif op == "!=":
                return left != right
            elif op == ">=":
                return left >= right
            elif op == "<=":
                return left <= right
            else:
                raise Exception(f"Unknown operator: {op}")

        elif node_type == "VAR":
            var_name = node[1]
            if var_name in self.variables:
                return self.variables[var_name]
            raise Exception(f"Undefined variable: {var_name}")

        else:
            raise Exception(f"Unknown AST node type: {node_type}")


# ✅ Exportable evaluate function
def evaluate(ast):
    evaluator = Evaluator()
    for node in ast:
        evaluator.evaluate(node)

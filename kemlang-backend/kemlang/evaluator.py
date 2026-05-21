class Environment:
    def __init__(self, parent=None):
        self.records = {}
        self.parent = parent

    def define(self, name, value):
        self.records[name] = value

    def lookup(self, name):
        if name in self.records:
            return self.records[name]
        if self.parent:
            return self.parent.lookup(name)
        raise Exception(f"Undefined variable: {name}")

    def assign(self, name, value):
        if name in self.records:
            self.records[name] = value
            return value
        if self.parent:
            return self.parent.assign(name, value)
        raise Exception(f"Undefined variable: {name}")


class ReturnException(Exception):
    def __init__(self, value):
        self.value = value


class Evaluator:
    def __init__(self):
        self.global_env = Environment()

    def evaluate(self, node, env=None):
        if env is None:
            env = self.global_env

        if isinstance(node, (int, float, str, bool)) or node is None:
            return node

        if not isinstance(node, (list, tuple)):
            raise Exception(f"Invalid node type: {type(node)}")

        node_type = node[0]

        if node_type == "ASSIGN":
            var_name = node[1]
            value = self.evaluate(node[2], env)
            try:
                env.assign(var_name, value)
            except Exception:
                env.define(var_name, value)
            return value

        elif node_type == "PRINT":
            value = self.evaluate(node[1], env)
            if isinstance(value, bool):
                print("kharu" if value else "khotu")
            else:
                print(value)
            return value

        elif node_type == "INPUT":
            var_name = node[1]
            user_input = input(f"{var_name}: ")
            try:
                if '.' in user_input:
                    user_input = float(user_input)
                else:
                    user_input = int(user_input)
            except ValueError:
                if user_input.strip() == "kharu":
                    user_input = True
                elif user_input.strip() == "khotu":
                    user_input = False
            
            try:
                env.assign(var_name, user_input)
            except Exception:
                env.define(var_name, user_input)
            return user_input

        elif node_type == "IF":
            condition = self.evaluate(node[1], env)
            block = node[2] if condition else node[3]
            block_env = Environment(env)
            for stmt in block:
                self.evaluate(stmt, block_env)
            return None

        elif node_type == "WHILE":
            while self.evaluate(node[1], env):
                block_env = Environment(env)
                for stmt in node[2]:
                    self.evaluate(stmt, block_env)
            return None

        elif node_type == "FUNCTION_DEF":
            func_name = node[1]
            params = node[2]
            body = node[3]
            env.define(func_name, ("FUNCTION", params, body))
            return None

        elif node_type == "RETURN":
            value = self.evaluate(node[1], env)
            raise ReturnException(value)

        elif node_type == "LIST":
            return [self.evaluate(elem, env) for elem in node[1]]

        elif node_type == "INDEX":
            base = self.evaluate(node[1], env)
            idx = self.evaluate(node[2], env)
            if not isinstance(base, list):
                raise Exception("Indexing is only supported on array lists!")
            if not isinstance(idx, int):
                raise Exception("Array list index must be an integer!")
            return base[idx]

        elif node_type == "INDEX_ASSIGN":
            index_node = node[1]
            if index_node[0] != "INDEX":
                raise Exception("Invalid index assignment target!")
            arr = self.evaluate(index_node[1], env)
            idx = self.evaluate(index_node[2], env)
            val = self.evaluate(node[2], env)
            if not isinstance(arr, list):
                raise Exception("Index assignment is only supported on array lists!")
            if not isinstance(idx, int):
                raise Exception("Array list index must be an integer!")
            arr[idx] = val
            return val

        elif node_type == "CALL":
            func_name = node[1]
            args = [self.evaluate(arg, env) for arg in node[2]]

            if func_name == "lambai":
                if len(args) != 1:
                    raise Exception("lambai function expects exactly 1 argument!")
                return len(args[0])
            elif func_name == "umedo":
                if len(args) != 2:
                    raise Exception("umedo function expects exactly 2 arguments!")
                if not isinstance(args[0], list):
                    raise Exception("First argument to umedo must be an array list!")
                args[0].append(args[1])
                return None

            func = env.lookup(func_name)
            if not isinstance(func, tuple) or func[0] != "FUNCTION":
                raise Exception(f"'{func_name}' is not a callable function!")
            
            params, body = func[1], func[2]
            if len(args) != len(params):
                raise Exception(f"Function '{func_name}' expects {len(params)} arguments, got {len(args)}!")
            
            func_env = Environment(self.global_env)
            for param, arg in zip(params, args):
                func_env.define(param, arg)

            try:
                for stmt in body:
                    self.evaluate(stmt, func_env)
            except ReturnException as ret:
                return ret.value
            return None

        elif node_type == "BIN_OP":
            op = node[1]
            left = self.evaluate(node[2], env)
            right = self.evaluate(node[3], env)

            if op in ("ane", "AND"):
                return bool(left) and bool(right)
            elif op in ("athva", "OR"):
                return bool(left) or bool(right)
            elif op == "+":
                if isinstance(left, str) or isinstance(right, str):
                    return str(left) + str(right)
                return left + right
            elif op == "-":
                return left - right
            elif op == "*":
                return left * right
            elif op == "/":
                return left / right
            elif op == "%":
                return left % right
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
            return env.lookup(var_name)

        else:
            raise Exception(f"Unknown AST node type: {node_type}")


def evaluate(ast):
    evaluator = Evaluator()
    for node in ast:
        evaluator.evaluate(node)

import queue
import threading

class Environment:
    def __init__(self, parent=None):
        self.records = {}
        self.parent = parent
        self.safe_vars = set()
        self.ownership = {}

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

    def make_safe(self, name):
        self.safe_vars.add(name)

    def is_safe(self, name):
        if name in self.safe_vars:
            return True
        if self.parent:
            return self.parent.is_safe(name)
        return False

    def check_ownership(self, name):
        if name in self.records:
            if self.ownership.get(name) == "moved":
                raise Exception(f"❌ Sharafat Safety Error: Variable '{name}' no ownership (already moved/transferred)!")
            return
        if self.parent:
            self.parent.check_ownership(name)
            return

    def move_ownership(self, name):
        if name in self.records:
            self.ownership[name] = "moved"
            return
        if self.parent:
            self.parent.move_ownership(name)


class Ledger:
    def __init__(self, initial_value):
        self.history = [initial_value]

    def jama(self, val):
        new_val = self.history[-1] + val
        self.history.append(new_val)
        return new_val

    def udhaar(self, val):
        new_val = self.history[-1] - val
        self.history.append(new_val)
        return new_val

    def itihas(self, idx):
        if idx < 0 or idx >= len(self.history):
            raise Exception("Ledger itihas index out of bounds!")
        return self.history[idx]

    def current(self):
        return self.history[-1]

    def __repr__(self):
        return f"Ledger({self.history})"


class KhaaliClass:
    def __repr__(self):
        return "khaali"
    def __str__(self):
        return "khaali"

khaali = KhaaliClass()


class PedhiInstance:
    def __init__(self, pedhi_name, methods, evaluator):
        self.pedhi_name = pedhi_name
        self.methods = methods
        self.evaluator = evaluator
        self.queue = queue.Queue()
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()

    def _run(self):
        self.actor_env = Environment(self.evaluator.global_env)
        while True:
            task = self.queue.get()
            if task is None:
                break
            method_name, args, result_queue = task
            try:
                if method_name not in self.methods:
                    raise Exception(f"kaam '{method_name}' not defined in pedhi '{self.pedhi_name}'!")
                func = self.methods[method_name]
                params, body = func[2], func[3]
                func_env = Environment(self.actor_env)
                for param, arg in zip(params, args):
                    func_env.define(param, arg)
                
                ret_val = None
                try:
                    for stmt in body:
                        self.evaluator.evaluate(stmt, func_env)
                except ReturnException as ret:
                    ret_val = ret.value
                result_queue.put(("SUCCESS", ret_val))
            except Exception as e:
                result_queue.put(("ERROR", str(e)))

    def sauda(self, method_name, args):
        result_queue = queue.Queue()
        self.queue.put((method_name, args, result_queue))
        return SaudaContract(result_queue)


class SaudaContract:
    def __init__(self, result_queue):
        self.result_queue = result_queue
        self.resolved = False
        self.val = None

    def melvo(self):
        if not self.resolved:
            status, val = self.result_queue.get()
            self.resolved = True
            if status == "ERROR":
                raise Exception(f"Sauda execution error: {val}")
            self.val = val
        return self.val


def unwrap_val(val):
    if isinstance(val, Ledger):
        return val.current()
    return val


class ReturnException(Exception):
    def __init__(self, value):
        self.value = value


class Evaluator:
    def __init__(self):
        self.global_env = Environment()

    def evaluate_raw(self, node, env):
        if isinstance(node, (int, float, str, bool)) or node is None:
            return node

        if not isinstance(node, (list, tuple)):
            raise Exception(f"Invalid node type: {type(node)}")

        node_type = node[0]

        if node_type == "KHAALI":
            return khaali

        elif node_type == "ASSIGN":
            var_name = node[1]
            value = self.evaluate(node[2], env)
            try:
                env.assign(var_name, value)
            except Exception:
                env.define(var_name, value)
            return value

        elif node_type == "HISAAB_ASSIGN":
            var_name = node[1]
            initial_value = self.evaluate(node[2], env)
            ledger = Ledger(initial_value)
            env.define(var_name, ledger)
            return ledger

        elif node_type == "PEDHI_DEF":
            pedhi_name = node[1]
            methods = node[2]
            env.define(pedhi_name, ("PEDHI_CLASS", pedhi_name, methods))
            return None

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
                elif user_input.strip() == "khaali":
                    user_input = khaali
            
            try:
                env.assign(var_name, user_input)
            except Exception:
                env.define(var_name, user_input)
            return user_input

        elif node_type == "IF":
            condition_node = node[1]
            condition = self.evaluate(condition_node, env)
            block = node[2] if condition else node[3]
            block_env = Environment(env)
            if condition and condition_node[0] == "HAS_VALUE" and condition_node[1][0] == "VAR":
                var_name = condition_node[1][1]
                block_env.make_safe(var_name)
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

        elif node_type == "HAS_VALUE":
            if isinstance(node[1], tuple) and node[1][0] == "VAR":
                var_name = node[1][1]
                env.check_ownership(var_name)
                val = env.lookup(var_name)
            else:
                val = self.evaluate_raw(node[1], env)
            return val is not khaali

        elif node_type == "CALL":
            func_name = node[1]
            args = self.evaluate_call_args(node[2], env)

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

        elif node_type == "METHOD_CALL":
            base_val = self.evaluate_raw(node[1], env)
            method_name = node[2]
            args = self.evaluate_call_args(node[3], env)

            if isinstance(base_val, tuple) and base_val[0] == "PEDHI_CLASS":
                pedhi_name = base_val[1]
                methods = base_val[2]
                if method_name == "chalu":
                    return PedhiInstance(pedhi_name, methods, self)
                else:
                    raise Exception(f"Unknown static pedhi method: {method_name}")

            elif isinstance(base_val, PedhiInstance):
                if method_name == "sauda":
                    if len(args) < 1:
                        raise Exception("sauda method expects at least the method name argument!")
                    return base_val.sauda(args[0], args[1:])
                else:
                    raise Exception(f"Unknown pedhi instance method: {method_name}")

            elif isinstance(base_val, SaudaContract):
                if method_name == "melvo":
                    return base_val.melvo()
                else:
                    raise Exception(f"Unknown sauda contract method: {method_name}")

            elif isinstance(base_val, Ledger):
                if method_name == "jama":
                    if len(args) != 1: raise Exception("jama expects 1 argument!")
                    return base_val.jama(args[0])
                elif method_name == "udhaar":
                    if len(args) != 1: raise Exception("udhaar expects 1 argument!")
                    return base_val.udhaar(args[0])
                elif method_name == "itihas":
                    if len(args) != 1: raise Exception("itihas expects 1 argument!")
                    return base_val.itihas(args[0])
                else:
                    raise Exception(f"Unknown ledger method: {method_name}")
            else:
                raise Exception(f"Method calls are not supported on {type(base_val)}")

        elif node_type == "MEMBER_ACCESS":
            base_val = self.evaluate(node[1], env)
            member_name = node[2]
            raise Exception(f"Member access '{member_name}' is not supported on this object!")

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
            env.check_ownership(var_name)
            val = env.lookup(var_name)
            if val is khaali:
                if not env.is_safe(var_name):
                    raise Exception(f"❌ Bina-Bhul Safety Exception: Attempted to operate on unchecked 'khaali' variable '{var_name}'!")
            return val

        else:
            raise Exception(f"Unknown AST node type: {node_type}")

    def evaluate_call_args(self, arg_nodes, env):
        evaluated_args = []
        for arg in arg_nodes:
            if isinstance(arg, tuple):
                if arg[0] == "BORROW_ARG":
                    var_name = arg[1]
                    env.check_ownership(var_name)
                    val = env.lookup(var_name)
                    if val is khaali and not env.is_safe(var_name):
                        raise Exception(f"❌ Bina-Bhul Safety Exception: Attempted to operate on unchecked 'khaali' variable '{var_name}'!")
                    evaluated_args.append(val)
                elif arg[0] == "VAR":
                    var_name = arg[1]
                    env.check_ownership(var_name)
                    val = env.lookup(var_name)
                    if val is khaali and not env.is_safe(var_name):
                        raise Exception(f"❌ Bina-Bhul Safety Exception: Attempted to operate on unchecked 'khaali' variable '{var_name}'!")
                    evaluated_args.append(val)
                    env.move_ownership(var_name)
                else:
                    evaluated_args.append(self.evaluate(arg, env))
            else:
                evaluated_args.append(self.evaluate(arg, env))
        return evaluated_args

    def evaluate(self, node, env=None):
        if env is None:
            env = self.global_env
        res = self.evaluate_raw(node, env)
        return unwrap_val(res)


def evaluate(ast):
    evaluator = Evaluator()
    for node in ast:
        evaluator.evaluate(node)

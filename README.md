# KemLang

<p align="center">
  <a href="https://kemlang.vercel.app">
    <img src="https://img.shields.io/badge/Website-Live-brightgreen?style=flat-square&logo=vercel&logoColor=white" alt="Website">
  </a>
  <a href="https://www.npmjs.com/package/kemlang">
    <img src="https://img.shields.io/npm/v/kemlang?style=flat-square&color=orange" alt="NPM Version">
  </a>
  <a href="https://www.npmjs.com/package/kemlang">
    <img src="https://img.shields.io/npm/dt/kemlang?style=flat-square&color=purple" alt="NPM Downloads">
  </a>
  <a href="https://github.com/pritpatel2412/kemlang/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License">
  </a>
</p>

KemLang is an educational, tree-walking interpreted programming language that uses Gujarati as its keyword vocabulary. It is designed to lower the barrier of entry for Gujarati-speaking students and developers who are learning the foundational concepts of computer science — variables, conditionals, loops, and I/O — without requiring fluency in English syntax.

The project ships as a CLI executable, an NPM package, a browser-based sandbox playground, and a FastAPI-powered remote execution backend.

---

## Overview

Most introductory programming environments assume proficiency in English. This assumption creates a double cognitive burden for learners whose primary language is not English: they must simultaneously acquire programming logic and translate that logic through an unfamiliar linguistic lens.

KemLang addresses this directly. It maps core programming constructs to familiar Gujarati words, allowing learners to focus exclusively on the logical structure of their programs. The interpreter is not a transpiler or a text-substitution layer — it is a full-fledged compiler pipeline composed of a lexical scanner, a recursive-descent parser, and an AST tree-walking evaluator.

---

## Features

- Gujarati keyword syntax (`sharu`, `samaapt`, `lakho`, `jo`, `nahitar`, `jyaare`, `do`, `jaano`, `kaam`, `aap`, `ane`, `athva`, `hisaab`, `khaali`, `has`, `value`, `pedhi`, `bhadu`)
- Perfect parser/interpreter parity across Python CLI and Javascript engine
- **Chokha Hisaab (Immutable Ledgers)**: Secure append-only transactional ledgers with permanent audit trails (`hisaab`, `.jama()`, `.udhaar()`, `.itihas()`)
- **Bina-Bhul (Failure-Proof Null Safety)**: Zero runtime null pointer exceptions via `khaali` literals and safe unboxing under `jo (x has value)` blocks
- **Vyaapaari Concurrency (Pedhi Actors)**: Async message passing, non-blocking contracts (`sauda`), and blocking awaiters (`melvo`) on isolated concurrent thread instances (`pedhi`)
- **Sharafat (Memory Ownership & Borrow Safety)**: Zero-copy safe memory allocations with default move-semantics and temporary borrows via the `bhadu` keyword
- First-class function declarations (`kaam`) with nested lexical scopes and closures
- Tail-call ready recursion support (e.g., Factorial sequences)
- Dynamic array lists (`[...]`) with mutable index access (`list[idx] = val`)
- Modulo operator (`%`) and precedence-aware logical operators (`ane`, `athva`)
- CLI support for executing `.kem` source files
- Browser-based interactive sandbox with Monaco Editor integration and live AST trees
- FastAPI backend for remote code execution
- KemGPT: an integrated AI assistant for language guidance and error explanation
- VS Code extension support with TextMate highlights and autocomplete snippets

---

## Installation

**Install globally via NPM:**

```bash
npm install -g kemlang
```

**Run without installing via npx:**

```bash
npx kemlang yourfile.kem
```

---

## Quick Start

Create a file named `hello.kem`:

```
sharu {
  do naam = "KemLang";
  lakho("Kem cho " + naam);
} samaapt
```

Execute it:

```bash
kemlang hello.kem
```

Expected output:

```
Kem cho KemLang
```

### Advanced Usage (Recursive Factorial & Arrays)

Here is a more advanced example showing custom recursive functions, boolean operators, lists, and modulo checks:

```gcode
kaam fact(n) {
  jo (n <= 1) {
    aap 1;
  }
  aap n * fact(n - 1);
}

sharu {
  // Test modulo remainder
  do rem = 10 % 3;
  jo (rem == 1 ane kharu) {
    lakho("Modulo check passes!");
  }

  // Create an array and mutate it
  do list = [10, 20];
  umedo(list, fact(4)); // Appends 24 to the list
  list[0] = 50;         // Overwrites first index
  
  lakho("First element: " + list[0]);     // Output: 50
  lakho("Total elements: " + lambai(list)); // Output: 3
} samaapt
```

---

## Language Reference

| Concept          | KemLang Syntax              | Description                                      |
|------------------|-----------------------------|--------------------------------------------------|
| Program Start    | `sharu {`                   | Opens the top-level program block                |
| Program End      | `} samaapt`                 | Closes and terminates the program block          |
| Variable         | `do x = 10;`                | Declares or mutates a variable in the heap       |
| Print            | `lakho("Hello");`           | Writes a value to standard output                |
| Input            | `jaano(varName);`           | Reads a value from standard input into a variable|
| Conditional      | `jo (x > 5) { } nahitar { }`| If / else conditional branching                  |
| Loop             | `jyaare (x < 5) { }`        | While loop — executes while the condition holds  |
| Boolean True     | `kharu`                     | Literal true                                     |
| Boolean False    | `khotu`                     | Literal false                                    |
| Logical AND      | `ane`                       | Boolean AND operator                             |
| Logical OR       | `athva`                     | Boolean OR operator                              |
| Modulo Remainder | `x % y`                     | Calculates division remainder                    |
| Array Definition | `do arr = [10, 20];`        | Declares a dynamic sequence list (yadi)          |
| Index Access     | `arr[0] = 5;`               | Assigns or retrieves list elements by 0-index    |
| List Append      | `umedo(arr, 30);`           | Appends a value to the end of the array          |
| List Length      | `lambai(arr)`               | Returns total element count of the array         |
| Function Declare | `kaam name(args) { }`       | Declares a reusable logic routine                |
| Function Return  | `aap expr;`                 | Exits a function and returns an evaluated value  |
| Ledger Declare   | `hisaab ledger = 1000;`     | Declares an append-only transaction ledger       |
| Credit Ledger    | `ledger.jama(amount);`      | Credits ledger balance and logs in history       |
| Debit Ledger     | `ledger.udhaar(amount);`     | Debits ledger balance and logs in history        |
| Ledger History   | `ledger.itihas(index);`     | Retrieves historic ledger value at index         |
| Null Literal     | `khaali`                    | Literal empty / null value                       |
| Option Check     | `jo (x has value) { }`      | Safe unboxing check for Null-Safety (Bina-Bhul)  |
| Actor Pedhi Def  | `pedhi Dukaan { ... }`      | Declares an isolated concurrent Actor structure  |
| Spawn Actor      | `do partner = Dukaan.chalu();`| Spawns independent Actor thread state          |
| Asynchronous Call| `partner.sauda("kaam", arg);`| Dispatches async call returning Sauda contract |
| Await Actor Call | `deal.melvo();`             | Blocks and retrieves Sauda contract response     |
| Memory Borrow    | `func(bhadu variable);`     | Borrows value ownership (Sharafat safety)        |

---

## Advanced System Paradigms (v3.0.0)

KemLang v3.0.0 introduces four robust paradigms built into the core tokenization and evaluation layers:

### 1. Chokha Hisaab (Immutable Ledgers)
A ledger represents an append-only account balance. Once instantiated, its active balance can only change through explicit transactional increments or decrements. The interpreter maintains a strict history buffer tracking every ledger state change.
```gcode
sharu {
  hisaab khata = 1000;
  khata.jama(500);    // credit 500
  khata.udhaar(200);  // debit 200
  
  do opening = khata.itihas(0); // 1000
  do current = khata;           // 1300
} samaapt
```

### 2. Bina-Bhul (Failure-Proof Null Safety)
To prevent devastating runtime null reference exceptions, variables assigned to `khaali` are encapsulated in an unsafe wrapper. Any direct arithmetic or logic operation on unsafe `khaali` variables instantly raises a compile/eval error. Variables must be explicitly unboxed inside a safe `jo (x has value)` branch:
```gcode
sharu {
  do status = khaali;
  jo (status has value) {
    do safe_access = status;
    lakho("Value: " + safe_access);
  } nahitar {
    lakho("Variable is empty!");
  }
} samaapt
```

### 3. Vyaapaari Concurrency (Pedhi Actors)
Actor-based message passing models concurrent systems cleanly without locks. Classes declared via `pedhi` are instantiated with `.chalu()`. They communicate through non-blocking transaction contracts called `sauda`, which are then awaited using blocking `.melvo()` routines:
```gcode
pedhi Dukaan {
  kaam tolo(n) {
    aap n * 2;
  }
}

sharu {
  do partner = Dukaan.chalu();
  do deal = partner.sauda("tolo", 150);
  do total = deal.melvo(); // blocks and retrieves 300
} samaapt
```

### 4. Sharafat (Memory Ownership & Borrow Safety)
Variables in KemLang enforce strict single-ownership semantics by default. Passing a variable as a function argument transfers its heap ownership ("move"), making the variable illegal to access in subsequent lines of the parent scope. To maintain parent-scope ownership, variables can be temporarily lent using the `bhadu` keyword:
```gcode
kaam be_gunu(n) {
  aap n * 2;
}

sharu {
  do mudal = 500;
  do doubled = be_gunu(bhadu mudal); // Borrowed: mudal remains valid!
  do final_val = be_gunu(mudal);      // Moved: mudal is now unusable!
} samaapt
```

---

## Compiler Architecture

KemLang processes source code through three sequential phases:

**Phase 1 — Lexical Analysis**

The scanner reads the source file character by character, classifying sequences into discrete tokens: keywords (`sharu`, `do`, `jo`, etc.), identifiers, numeric literals, string literals, boolean literals, operators, and punctuation. Each token carries its type, value, and source position.

**Phase 2 — Syntactic Parsing**

An LL(1) recursive-descent parser consumes the token stream and constructs an Abstract Syntax Tree (AST). Grammar rules are modelled after Backus-Naur Form (BNF) specifications. The parser enforces structural correctness and emits descriptive error messages when the grammar is violated.

**Phase 3 — AST Evaluation**

The tree-walking evaluator traverses the AST depth-first. It maintains a scoped variable heap, evaluates expressions, resolves identifiers, executes control flow branches, and routes output to stdout. All operations run within a sandboxed execution context.

---

## Project Structure

```
kemlang/
  bin/                  CLI entry point
  frontend/             Vite + React browser playground
    src/
      components/       UI components (LandingPage, KemGPT, Sandbox, etc.)
      compiler/         Client-side interpreter modules
  kemlang-backend/      FastAPI Python backend for remote execution
  kemlang-vscode/       VS Code language extension
  package.json          Root NPM workspace configuration
```

---

## Local Development

**Clone the repository:**

```bash
git clone https://github.com/pritpatel2412/kemlang.git
cd kemlang
```

**Install root dependencies:**

```bash
npm install
```

**Start the frontend development server:**

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`.

**Start the backend execution server:**

```bash
cd kemlang-backend
pip install fastapi uvicorn
uvicorn cli:app --reload
```

The API will be available at `http://localhost:8000`.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request. All submissions are expected to follow the project's code style and pass the existing test suite.

```bash
npm test
```

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for full terms.

---

## Acknowledgements

KemLang draws conceptual inspiration from the vernacular programming movement and projects such as BhaiLang. The Gujarati language, with its rich literary tradition and global speaker community of over 60 million people, provided both the vocabulary and the cultural motivation for this project.

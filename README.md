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

- Gujarati keyword syntax (`sharu`, `samaapt`, `lakho`, `jo`, `nahitar`, `jyaare`, `do`, `jaano`)
- Full interpreter pipeline: Lexical Analyzer, Recursive-Descent Parser, AST Evaluator
- CLI support for executing `.kem` source files
- Browser-based interactive sandbox with Monaco Editor integration
- FastAPI backend for remote code execution
- KemGPT: an integrated AI assistant for language guidance and error explanation
- Gujarati-localized runtime error messages
- VS Code extension support

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

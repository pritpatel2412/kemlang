# 🇮🇳 KemLang ✨

<p align="center">
  <a href="https://kemlang.vercel.app">
    <img src="https://img.shields.io/badge/Website-Live-green?style=for-the-badge&logo=vercel&logoColor=white">
  </a>
  <a href="https://kemlang.vercel.app">
    <img src="https://img.shields.io/badge/Docs-Available-blue?style=for-the-badge&logo=readthedocs&logoColor=white">
  </a>
  <a href="https://github.com/pritpatel2412/kemlang">
    <img src="https://img.shields.io/badge/GitHub-Source-black?style=for-the-badge&logo=github&logoColor=white">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/kemlang">
    <img src="https://img.shields.io/badge/NPM-KemLang-red?style=for-the-badge&logo=npm&logoColor=white">
  </a>
  <a href="https://www.npmjs.com/package/kemlang">
    <img src="https://img.shields.io/npm/v/kemlang?style=for-the-badge&color=orange">
  </a>
  <a href="https://www.npmjs.com/package/kemlang">
    <img src="https://img.shields.io/npm/dt/kemlang?style=for-the-badge&color=purple">
  </a>
</p>



*A Gujarati-Inspired Toy Programming Language with a Smile 😄*

KemLang makes programming fun, cultural, and beginner-friendly.
Blending playful Gujarati syntax with modern tools, it's perfect for learners who want to code in a language that feels close to home.

---

## 🌟 Features You’ll Love

* ✅ **Gujarati-style syntax** (`sharu`, `samaapt`, `lakho`, `jo`, `nahitar`, `jyaare`, `do`, `jaano`, `kaam`, `aap`, `ane`, `athva`, `hisaab`, `khaali`, `has`, `value`, `pedhi`, `bhadu`)
* 💰 **Chokha Hisaab (Immutable Ledgers)**: Secure append-only transactional ledgers with audit history (`hisaab`, `.jama()`, `.udhaar()`, `.itihas()`)
* 🛡️ **Bina-Bhul (Failure-Proof Null Safety)**: Zero runtime null pointer exceptions via `khaali` literals and safe unboxing under `jo (x has value)` blocks
* 🏢 **Vyaapaari Concurrency (Pedhi Actors)**: Async message passing and non-blocking contracts (`sauda` and `.melvo()`)
* 🔑 **Sharafat (Memory Ownership & Borrow Safety)**: Zero-copy safe memory allocations with move-semantics and borrows (`bhadu`)
* 🚀 **Complete interpreter pipeline** (Lexer → Parser → Evaluator)
* 💻 **CLI support** for executing `.kem` files effortlessly
* 🌐 **Web API powered by FastAPI** for remote execution
* 🤪 **Playful Gujarati error messages** for a cultural twist

> 💬 “Kem cho, developer? Let’s make code feel like garba!”

---

## 📦 Installation

Get started in seconds with either of these:

### 🧰 Option 1: Install globally

```bash
npm install -g kemlang
```

### ⚡ Option 2: Run instantly with `npx`

```bash
npx kemlang yourfile.kem
```

---

## 🎯 Quick Example

👩‍💻 Let’s write your first KemLang program!

### 1. Create `hello.kem`

```kemlang
sharu {
  do naam = "KemLang";
  lakho("Kem cho " + naam);
} samaapt
```

### 2. Run it

```bash
kemlang hello.kem
```

### 3. Output

```
Kem cho KemLang
```

👏 That’s it! You just coded in KemLang!

---

## 📜 Language Reference

| 💬 English      | 💻 KemLang Syntax   |
| --------------- | ------------------- |
| Start Block     | `sharu {`           |
| End Block       | `} samaapt`         |
| Print Statement | `lakho()`           |
| Print Example   | `lakho("Hello");`   |
| Variable        | `do`                |
| Variable Ex.    | `do x = 10;`        |
| If / Else       | `jo / nahitar`      |
| If Example      | `jo (x > 5) {}`     |
| While Loop      | `jyaare`            |
| While Example   | `jyaare (x < 5) {}` |
| Ledger Declare  | `hisaab ledger = 1000;` |
| Credit Ledger   | `ledger.jama(amount);` |
| Debit Ledger    | `ledger.udhaar(amount);` |
| Ledger History  | `ledger.itihas(index);` |
| Null Literal    | `khaali`            |
| Option Check    | `jo (x has value) {}` |
| Actor Pedhi Def | `pedhi Dukaan {}`   |
| Spawn Actor     | `do partner = Dukaan.chalu();` |
| Async Call      | `partner.sauda("kaam", arg);` |
| Await Call      | `deal.melvo();`     |
| Memory Borrow   | `func(bhadu variable);` |

> 📖 **Pro Tip**: It’s not just code. It’s a *varta* (story) your computer understands!

---

## 🛠 Development

Want to contribute or hack around? Here’s how:

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/kemlang.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the test suite

```bash
npm test
```

### 4. Run locally in VS Code

**Frontend**

* Open the terminal in VS Code (`Ctrl + ~` or `Cmd + ~`).
* Navigate to the frontend directory (e.g., `cd frontend` if applicable).
* Run the frontend development server:

```bash
npm run dev
```

* Open your browser and go to the URL displayed in the terminal (usually `http://localhost:3000`).

**Backend**

* Open a new terminal in VS Code.
* Navigate to the backend directory (e.g., `cd backend` if applicable).
* Ensure you have Python and FastAPI installed. If not, install dependencies:

```bash
pip install fastapi uvicorn
```

* Run the backend server with auto-reload:

```bash
uvicorn cli:app --reload
```

* The API will be available at `http://localhost:8000` (or the port specified in your configuration).

---

## 📄 License

This project is licensed under the **MIT License**. See `LICENSE` for full details.

---

## 🙏 Credits

KemLang is lovingly inspired by:

* 🧑‍🤝‍🧑 BhaiLang
* 🌍 The Vernacular Programming Movement
* ⚓️ Gujarati Culture & Language

---

## 💫 Kem cho? Happy Coding! 🙌

**Let your code speak your culture** 🧡

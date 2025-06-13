KemLang ✨
A Gujarati-Inspired Toy Programming Language with a Smile 😄
KemLang makes programming fun, cultural, and beginner-friendly. Blending playful Gujarati syntax with modern tools, it's perfect for learners who want to code in a language that feels close to home.

🌟 Features You’ll Love

✅ Gujarati-style syntax (sharu, samaapt, lakho, etc.)
🧠 Simple, English-like constructs to help beginners get started fast
🚀 Complete interpreter pipeline (Lexer → Parser → Evaluator)
💻 CLI support for executing .kem files effortlessly
🌐 Web API powered by FastAPI for remote execution
🤪 Playful Gujarati error messages for a cultural twist


💬 “Kem cho, developer? Let’s make code feel like garba!”


📦 Installation
Get started in seconds with either of these:
🧰 Option 1: Install globally
npm install -g kemlang

⚡ Option 2: Run instantly with npx
npx kemlang yourfile.kem


🎯 Quick Example
👩‍💻 Let’s write your first KemLang program!
1. Create hello.kem
sharu {
  do naam = "KemLang";
  lakho("Kem cho " + naam);
} samaapt

2. Run it
kemlang hello.kem

3. Output
Kem cho KemLang

👏 That’s it! You just coded in KemLang!

📜 Language Reference



📘 English
💻 KemLang
🧪 Example



Start Block
sharu {
sharu { code }


Print Statement
lakho()
lakho("Hello");


Variable
do
do x = 10;


If / Else
jo / nahitar
jo (x > 5) {}


While Loop
jyaare
jyaare (x < 5) {}



📖 Pro Tip: It’s not just code. It’s a varta (story) your computer understands!


🛠 Development
Want to contribute or hack around? Here’s how:
1. Clone the repo
git clone https://github.com/yourusername/kemlang.git

2. Install dependencies
npm install

3. Run the test suite
npm test

4. Run locally in VS Code
To run KemLang locally in Visual Studio Code, follow these steps:
Frontend

Open the terminal in VS Code (Ctrl + ~ or Cmd + ~ on Mac).
Navigate to the project’s frontend directory (if applicable, e.g., ./frontend).
Run the following command to start the frontend development server:npm run dev


This will typically start a local server (e.g., at http://localhost:5173) for the web interface.

Backend

Open a new terminal in VS Code for the backend.
Navigate to the project’s backend directory (if applicable, e.g., ./backend).
Ensure you have Python and FastAPI installed (pip install fastapi uvicorn).
Run the following command to start the backend server with auto-reload:uvicorn cli:app --reload


The backend API will be available at http://localhost:8000 by default.

Notes

Ensure you have Node.js and Python installed on your system.
If the project uses a monorepo structure, check the package.json or project documentation for specific frontend/backend directories.
Use separate terminal windows in VS Code for frontend and backend to keep both running simultaneously.


📄 License
This project is licensed under the MIT License. See LICENSE for full details.

🙏 Credits
KemLang is lovingly inspired by:

🧑‍🤝‍🧑 BhaiLang
🌍 The Vernacular Programming Movement
🕉️ Gujarati Culture & Language


💫 Kem cho? Happy Coding! 🙌
Let your code speak your culture 🧡

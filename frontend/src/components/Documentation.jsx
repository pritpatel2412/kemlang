import { useState } from "react";
import { Copy } from "lucide-react";

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded shadow-sm transition-all group-hover:opacity-100 opacity-0"
      >
        {copied ? "Copied!" : <Copy size={14} />}
      </button>
      <pre className="bg-gradient-to-br from-[#1E1E3A] to-[#15152b] p-5 rounded-lg font-['JetBrains_Mono','Fira_Code','monospace'] text-sm text-white whitespace-pre-wrap border border-gray-700 shadow-md">
        {code}
      </pre>
    </div>
  );
}

export default function Documentation() {
  return (
    <div className="text-white bg-gradient-to-b from-[#0F0F1A] to-[#0A0A14] px-8 py-16 space-y-20">
      <header className="max-w-5xl mx-auto text-center">
        <h1 className="text-6xl font-extrabold mb-4 tracking-tight">KemLang</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          A Gujarati-flavored programming language that makes coding fun, simple, and culturally connected.
        </p>
      </header>

      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-semibold mb-3">General</h2>
          <p className="text-gray-400 mb-4">
            Every KemLang program kicks off with <code className="bg-gray-800 px-1 py-0.5 rounded">sharu</code> and wraps up with <code className="bg-gray-800 px-1 py-0.5 rounded">samaapt</code> — like saying “Kem Cho” at the start and “Aavjo” at the end!
          </p>
          <CodeBlock
            code={`sharu {\n  lakho("Kem cho duniya!");\n} samaapt`}
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Variables</h2>
          <p className="text-gray-400 mb-4">
            In KemLang, variables are declared with <code className="bg-gray-800 px-1 py-0.5 rounded">do</code> — name bolo, value dedo! Supports both numbers and strings, full Bollywood style!
          </p>
          <CodeBlock
            code={`sharu {\n  do a = 10;\n  do b = "kem";\n  a = a + 1;\n} samaapt`}
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Types</h2>
          <p className="text-gray-400 mb-4">
            Strings, numbers, floats, ya booleans — KemLang sambhale badha type, ekdum desi swag ma!
          </p>
          <CodeBlock
            code={`do name = "KemLang";\ndo age = 20;\ndo rating = 4.5;`}
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Booleans</h2>
          <p className="text-gray-400 mb-4">
            In KemLang, <code className="bg-gray-800 px-1 py-0.5 rounded">kharu</code> means true and <code className="bg-gray-800 px-1 py-0.5 rounded">khotu</code> means false — simple and desi!
          </p>
          <CodeBlock
            code={`do isHappy = kharu;\njo (isHappy) {\n  lakho("Smile!");\n}`}
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Conditionals</h2>
          <p className="text-gray-400 mb-4">
            Use <code className="bg-gray-800 px-1 py-0.5 rounded">jo</code> for if and <code className="bg-gray-800 px-1 py-0.5 rounded">nahitar</code> for else — KemLang’s way of handling decisions!
          </p>
          <CodeBlock
            code={`do age = 18;\n\njo (age >= 18) {\n  lakho("Adult");\n} nahitar {\n  lakho("Minor");\n}`}
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Loops</h2>
          <p className="text-gray-400 mb-4">
            Use <code className="bg-gray-800 px-1 py-0.5 rounded">jyaare</code> to repeat actions — KemLang’s take on while loops!
          </p>
          <CodeBlock
            code={`do i = 0;\n\njyaare (i < 3) {\n  lakho(i);\n  do i = i + 1;\n}`}
          />
        </div>
      </section>

      
    </div>
  );
}

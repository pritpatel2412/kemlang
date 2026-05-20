import React, { useState, useEffect, useMemo } from "react";
import { Zap, Code, Copy, Check, Play, Terminal, HelpCircle, AlertTriangle } from "lucide-react";

export default function Transpiler({ ast }) {
  const [copied, setCopied] = useState(false);
  const [jsConsoleOutput, setJsConsoleOutput] = useState("");
  const [jsConsoleError, setJsConsoleError] = useState(false);
  const [jsExecutionProfile, setJsExecutionProfile] = useState(null);

  // Dynamic AST to JavaScript Transpiler Function
  const transpiledJSCode = useMemo(() => {
    if (!ast || ast.length === 0) return "";

    const declaredVars = new Set();

    function transpileExpr(expr) {
      if (!expr) return "";
      if (expr.type === "LITERAL") {
        if (typeof expr.value === "string") {
          return `"${expr.value.replace(/"/g, '\\"')}"`;
        }
        return String(expr.value);
      }
      if (expr.type === "VAR") {
        return expr.varName;
      }
      if (expr.type === "BIN_OP") {
        return `(${transpileExpr(expr.left)} ${expr.op} ${transpileExpr(expr.right)})`;
      }
      return "";
    }

    function transpileAST(node, indent = 0) {
      const pad = "  ".repeat(indent);
      if (!node) return "";

      if (Array.isArray(node)) {
        return node
          .map((n) => transpileAST(n, indent))
          .filter((line) => line !== "")
          .join("\n");
      }

      if (node.type === "ASSIGN") {
        const isNew = !declaredVars.has(node.varName);
        declaredVars.add(node.varName);
        const prefix = isNew ? "let " : "";
        return `${pad}${prefix}${node.varName} = ${transpileExpr(node.value)};`;
      }

      if (node.type === "PRINT") {
        return `${pad}console.log(${transpileExpr(node.value)});`;
      }

      if (node.type === "INPUT") {
        const isNew = !declaredVars.has(node.varName);
        declaredVars.add(node.varName);
        const prefix = isNew ? "let " : "";
        return `${pad}${prefix}${node.varName} = prompt("💬 Input required for variable '${node.varName}':");`;
      }

      if (node.type === "IF") {
        let result = `${pad}if (${transpileExpr(node.condition)}) {\n`;
        result += transpileAST(node.ifBlock, indent + 1);
        result += `\n${pad}}`;
        if (node.elseBlock) {
          result += ` else {\n`;
          result += transpileAST(node.elseBlock, indent + 1);
          result += `\n${pad}}`;
        }
        return result;
      }

      if (node.type === "WHILE") {
        // Safe unique loop guard variable to protect the client's browser thread
        const randId = Math.random().toString(36).substr(2, 4);
        const guardName = `__guard_${randId}`;
        let result = `${pad}let ${guardName} = 0;\n`;
        result += `${pad}while (${transpileExpr(node.condition)}) {\n`;
        result += `${pad}  if (${guardName}++ > 2500) {\n`;
        result += `${pad}    throw new Error("⚠️ safety_guard_crash: Loop run count exceeded 2500 iterations to prevent infinite freeze!");\n`;
        result += `${pad}  }\n`;
        result += transpileAST(node.block, indent + 1);
        result += `\n${pad}}`;
        return result;
      }

      return "";
    }

    // Generate boilerplate header and transpile AST
    const header = `/**\n * Transpiled JavaScript Output\n * Generated automatically from KemLang AST\n */\n\n`;
    return header + transpileAST(ast);
  }, [ast]);

  // Handle Copy Code
  const handleCopy = () => {
    if (!transpiledJSCode) return;
    navigator.clipboard.writeText(transpiledJSCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run Transpiled JavaScript in a secure browser sandbox
  const runTranspiledJS = () => {
    setJsConsoleOutput("Compiling JS execution environment...");
    setJsConsoleError(false);
    setJsExecutionProfile(null);

    const startTime = performance.now();

    setTimeout(() => {
      const logs = [];
      const customConsole = {
        log: (...args) => {
          logs.push(args.map((a) => String(a)).join(" "));
        },
      };

      const customPrompt = (message) => {
        const val = window.prompt(message);
        return val || "";
      };

      try {
        // Execute the transpiled code inside a sandboxed Function
        const sandboxFunction = new Function("console", "prompt", transpiledJSCode);
        sandboxFunction(customConsole, customPrompt);

        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);

        setJsConsoleOutput(
          logs.length > 0 ? logs.join("\n") : "JavaScript executed successfully but printed zero logs."
        );
        setJsConsoleError(false);
        setJsExecutionProfile({
          duration,
          success: true,
        });
      } catch (err) {
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);

        setJsConsoleOutput(`❌ JavaScript Execution Error:\n${err.message}`);
        setJsConsoleError(true);
        setJsExecutionProfile({
          duration,
          success: false,
        });
      }
    }, 120);
  };

  if (!ast || ast.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-dark-elevated/40 border border-hairline/10 rounded-lg h-full select-none">
        <Code className="w-10 h-10 text-muted-soft mb-3 stroke-[1.5]" />
        <h4 className="font-serif-editorial font-medium text-[#faf9f5] text-sm">Transpiler Idle</h4>
        <p className="text-[11px] text-muted-soft mt-1 max-w-[220px] leading-relaxed font-body">
          Run or compile a KemLang program in the playground editor to instantly transpile it to industry-standard JavaScript.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-5">
      
      {/* Transpiler Title Bar */}
      <div className="flex items-center justify-between border-b border-hairline/10 pb-3">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#faf9f5]">JS Transpiler Hub</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-dark border border-hairline/10 hover:bg-surface-dark-soft rounded text-[10px] text-muted hover:text-[#faf9f5] transition-all cursor-pointer select-none font-semibold font-body"
        >
          {copied ? (
            <>
              <Check size={12} className="text-accent-teal" />
              <span className="text-accent-teal">JS Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy JS Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display Area with Line Numbers */}
      <div className="rounded-lg overflow-hidden border border-hairline/10 flex bg-[#121210] max-h-[220px] overflow-y-auto custom-scrollbar font-mono text-[11.5px] leading-relaxed relative">
        {/* line numbers bar */}
        <div className="px-3.5 py-4 bg-[#0c0c0b] text-[#55534c] select-none text-right border-r border-hairline/5 flex flex-col min-w-[36px] flex-shrink-0">
          {transpiledJSCode.split("\n").map((_, i) => (
            <span key={i} className="block">{i + 1}</span>
          ))}
        </div>
        {/* code block */}
        <pre className="p-4 text-[#faf9f5] flex-1 overflow-x-auto selection:bg-[#cc785c]/30">
          {transpiledJSCode}
        </pre>
      </div>

      {/* Action row to launch JS inside the browser */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-dark/30 p-3 rounded-lg border border-hairline/15">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-accent-teal" />
          <span className="text-[10px] text-muted-soft font-bold uppercase tracking-wider">Browser Sandbox Engine</span>
        </div>
        <button
          onClick={runTranspiledJS}
          className="px-3.5 py-1.5 bg-accent-teal hover:bg-accent-teal/90 text-[#faf9f5] text-[10px] font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-accent-teal/10"
        >
          <Play size={11} />
          <span>Execute JS Code Live</span>
        </button>
      </div>

      {/* Terminal logs for transpiled JavaScript run */}
      <div className="flex flex-col rounded-lg border border-hairline/10 bg-[#121210] overflow-hidden flex-1 min-h-[140px] font-mono text-[11px]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#0c0c0b] border-b border-hairline/5 text-muted-soft select-none">
          <span className="font-bold text-[9px] uppercase tracking-wider">transpiled_js_output</span>
          {jsExecutionProfile && (
            <span className="text-[9px] text-accent-teal">
              Time taken: <strong>{jsExecutionProfile.duration}ms</strong>
            </span>
          )}
        </div>
        {/* Terminal Console output */}
        <div className="p-4 flex-1 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text min-h-[100px] max-h-[140px] custom-scrollbar text-[#faf9f5]/90">
          {jsConsoleOutput ? (
            <div className={jsConsoleError ? "text-error font-medium" : "text-accent-teal/90"}>
              <span className="text-muted-soft select-none mr-2 font-mono">❯</span>
              {jsConsoleOutput}
            </div>
          ) : (
            <span className="text-muted-soft select-none italic font-body text-[10.5px]">
              Ready. Click "Execute JS Code Live" to run the compiled standard JavaScript inside your local browser engine.
            </span>
          )}
        </div>
      </div>

      {/* Pedagogical comparison info callout */}
      <div className="flex gap-3 items-start p-3 bg-surface-dark-soft rounded-lg border border-hairline/10 text-[10.5px] leading-relaxed text-muted-soft select-none font-body">
        <HelpCircle size={15} className="text-primary mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-semibold text-[#faf9f5]">Pedagogical Translation:</span> Comparing KemLang variables, whiles, and print syntax to industry standard JavaScript teaches users core, language-independent logical structures.
        </div>
      </div>

    </div>
  );
}

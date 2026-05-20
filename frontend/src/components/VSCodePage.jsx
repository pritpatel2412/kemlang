import { Terminal, Download, Sparkles, Code, Settings } from "lucide-react";

export default function VSCodePage() {
  const extensionFeatures = [
    {
      title: "Syntax Highlighting",
      desc: "Declarative TextMate grammar supporting every single KemLang keyword (sharu, do, lakho, jo, jyaare). Perfect syntax separation for readability.",
      icon: Sparkles
    },
    {
      title: "Boilerplate Snippets",
      desc: "Instant autocomplete templates for loops, declarations, and general block setups. Type 'sharu' and hit tab to generate context in milliseconds.",
      icon: Code
    },
    {
      title: "Unique Icon Theme",
      desc: "A stylized icon set mapping the custom KemLang 'K' icon directly onto `.kem` files in your sidebar, keeping your workspace clean.",
      icon: Settings
    }
  ];

  return (
    <div className="bg-canvas max-w-7xl mx-auto space-y-16 py-8">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline text-primary text-xs font-semibold uppercase tracking-wider font-body">
          IDE Integrations
        </div>
        <h1 className="text-5xl md:text-6xl font-serif-editorial font-medium text-ink tracking-display-tight">
          KemLang VS Code Extension
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto font-body">
          Elevate your developer workflow with high-fidelity editor support in Visual Studio Code. 
          Desi coding now carries actual professional autocomplete power.
        </p>
        <div className="w-16 h-0.5 bg-primary/30 mx-auto rounded-full" />
      </div>

      {/* Main Grid: Info + Mockup */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Mockup */}
        <div className="lg:col-span-7 bg-surface-dark border border-hairline/10 rounded-lg overflow-hidden shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-surface-dark-elevated border-b border-hairline/10 select-none">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error/70" />
              <div className="w-3 h-3 rounded-full bg-accent-amber/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
              <span className="text-xs text-muted-soft font-mono ml-2">fibonacci.kem — VS Code</span>
            </div>
            <div className="text-[10px] text-muted-soft tracking-wider font-semibold">
              KEMLANG LANGUAGE SERVER
            </div>
          </div>
          {/* Editor Area */}
          <div className="p-6 font-mono text-sm leading-relaxed space-y-1.5 select-none overflow-x-auto">
            <div><span className="text-muted-soft select-none mr-4">1</span><span className="text-primary font-bold">sharu</span> <span className="text-[#faf9f5]">{`{`}</span></div>
            <div><span className="text-muted-soft select-none mr-4">2</span>  <span className="text-muted-soft select-none">  // Calculate terms</span></div>
            <div><span className="text-muted-soft select-none mr-4">3</span>  <span className="text-primary font-bold">do</span> <span className="text-[#faf9f5]">count = 5;</span></div>
            <div><span className="text-muted-soft select-none mr-4">4</span>  <span className="text-primary font-bold">do</span> <span className="text-[#faf9f5]">t1 = 0;</span></div>
            <div><span className="text-muted-soft select-none mr-4">5</span>  <span className="text-primary font-bold">do</span> <span className="text-[#faf9f5]">t2 = 1;</span></div>
            <div><span className="text-muted-soft select-none mr-4">6</span>  <span className="text-primary font-bold">do</span> <span className="text-[#faf9f5]">i = 1;</span></div>
            <div><span className="text-muted-soft select-none mr-4">7</span></div>
            <div><span className="text-muted-soft select-none mr-4">8</span>  <span className="text-primary font-bold">jyaare</span> <span className="text-[#faf9f5]">(i &lt;= count) {`{`}</span></div>
            <div><span className="text-muted-soft select-none mr-4">9</span>    <span className="text-primary font-bold">lakho</span><span className="text-[#faf9f5]">(t1);</span></div>
            <div><span className="text-muted-soft select-none mr-4">10</span>    <span className="text-primary font-bold">do</span> <span className="text-[#faf9f5]">nextTerm = t1 + t2;</span></div>
            <div><span className="text-muted-soft select-none mr-4">11</span>    <span className="text-[#faf9f5]">t1 = t2;</span></div>
            <div><span className="text-muted-soft select-none mr-4">12</span>    <span className="text-[#faf9f5]">t2 = nextTerm;</span></div>
            <div><span className="text-muted-soft select-none mr-4">13</span>    <span className="text-[#faf9f5]">i = i + 1;</span></div>
            <div><span className="text-muted-soft select-none mr-4">14</span>  <span className="text-[#faf9f5]">{`}`}</span></div>
            <div><span className="text-muted-soft select-none mr-4">15</span><span className="text-[#faf9f5]">{`}`}</span> <span className="text-primary font-bold">samaapt</span></div>
          </div>
          {/* Footer Bar */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-[#121210] border-t border-hairline/10 select-none text-[11px] text-muted-soft">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-teal inline-block" /> Ln 8, Col 12</span>
              <span>UTF-8</span>
            </div>
            <div>KemLang Syntax Engine</div>
          </div>
        </div>

        {/* Right Side: Description */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-3xl font-serif-editorial font-medium text-ink tracking-display-tight">
            Designed for cultural coders
          </h3>
          <p className="text-sm text-body leading-relaxed font-body">
            Writing toy languages shouldn't feel like typing in notepad. 
            The KemLang extension brings real IDE quality of life enhancements so you can build loops, calculate arithmetic, and evaluate conditions with maximum visibility.
          </p>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-muted font-body">
              How to Install
            </h4>
            <div className="p-5 rounded-lg border border-hairline bg-surface-card space-y-3 font-body">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mt-0.5 select-none">
                  1
                </div>
                <div>
                  <h5 className="font-semibold text-ink text-sm">Download VSIX Binary</h5>
                  <p className="text-xs text-muted">Locate the prepackaged extension file inside the <code>kemlang-vscode/</code> folder of our source code repository.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mt-0.5 select-none">
                  2
                </div>
                <div>
                  <h5 className="font-semibold text-ink text-sm">Run Manual Install</h5>
                  <p className="text-xs text-muted">Open VS Code, press <code>Ctrl+Shift+P</code>, search for <i>"Install from VSIX..."</i>, and select our compiled bundle.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="grid md:grid-cols-3 gap-6 pt-4">
        {extensionFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="bg-canvas border border-hairline p-6 rounded-lg space-y-4 hover:border-primary/40 transition-colors"
            >
              <div className="p-2 w-fit rounded-lg bg-surface-card text-primary border border-hairline select-none">
                <Icon size={18} />
              </div>
              <h4 className="text-xl font-serif-editorial font-semibold text-ink tracking-display-tight">
                {feat.title}
              </h4>
              <p className="text-xs text-body leading-relaxed font-body">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pre-footer installation invite */}
      <div className="p-8 rounded-lg bg-surface-card border border-hairline flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <h4 className="text-2xl font-serif-editorial font-medium text-ink tracking-display-tight">
            Contribute to the extension
          </h4>
          <p className="text-sm text-body font-body max-w-xl">
            Want to add language server autocompletes or diagnostic errors? Explore our open source repository in the <code>kemlang-vscode/</code> workspace.
          </p>
        </div>
        <a
          href="https://github.com/pritpatel2412/kemlang"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-active text-[#faf9f5] text-sm font-semibold rounded-md transition-colors font-body shadow-sm select-none"
        >
          <Download size={16} />
          <span>View VSIX Repository</span>
        </a>
      </div>
    </div>
  );
}

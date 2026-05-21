import { useState } from "react";
import { Clock, Calendar, Sparkles, Milestone, ArrowUpRight, CheckCircle2, ChevronRight, Play, Terminal, HelpCircle, Layers, Code } from "lucide-react";

export default function TimelinePage({ onLaunchSandbox }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const timelineEvents = [
    {
      title: "v1.0.0 - The Genesis & Gujarati Lexicon",
      date: "Initial Conception",
      status: "completed",
      icon: Terminal,
      color: "border-primary text-primary bg-primary/5",
      badgeColor: "bg-primary/10 text-primary border-primary/20",
      description: "KemLang was conceived as a Gujarati-inspired educational toy programming language designed to make coding accessible to regional language speakers.",
      achievements: [
        "Structured block boundaries using 'sharu' and 'samaapt'",
        "Dynamic variable definitions prefixed with 'do'",
        "Developer console print statement via 'lakho'",
        "Standard keyboard input capture via 'jaano'",
        "Basic control flow logic with 'jo' (if) and 'nahitar' (else)",
        "Iterative execution loops using 'jyaare' (while)",
        "Initial CLI compiler and basic VS Code highlighter support"
      ]
    },
    {
      title: "v2.0.0 - Advanced Functional & Array Paradigms",
      date: "Current Release (Active)",
      status: "active",
      icon: Sparkles,
      color: "border-accent-teal text-accent-teal bg-accent-teal/5",
      badgeColor: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
      description: "A monumental leap that turns KemLang into a feature-rich, robust programming language supporting standard data structures, boolean logic, and advanced recursive execution scopes.",
      achievements: [
        "First-Class Function definitions using the 'kaam' keyword",
        "Function value return bubbles via 'aap' statements",
        "Lexical scopes and environment closures for nested sub-routines",
        "Full support for recursion (e.g. Factorial and Fibonacci sequences)",
        "Array Lists ('yadi') with bracket declarations: '[10, 20, 30]'",
        "Dynamic index access and element reassignments: 'list[1] = 50'",
        "Built-in list methods: 'lambai(list)' (length) and 'umedo(list, val)' (append)",
        "Remainder calculations via arithmetic modulo operator (%)",
        "Boolean operators 'ane' (AND) and 'athva' (OR) with mathematical precedence",
        "Enhanced VS Code extension with rich TextMate grammars and snippets"
      ],
      sampleCode: `sharu {
  // Test our recursion and array updates in v2.0.0!
  kaam fact(n) {
    jo (n <= 1) {
      aap 1;
    }
    aap n * fact(n - 1);
  }

  do list = [10, 20];
  umedo(list, fact(4)); // appends 24
  
  lakho("List len: " + lambai(list)); // Output: 3
  lakho("Last element: " + list[2]);   // Output: 24
} samaapt`
    },
    {
      title: "v3.0.0 - Standard Libraries & Native Modules",
      date: "Q3 2026",
      status: "future",
      icon: Layers,
      color: "border-accent-amber text-accent-amber bg-accent-amber/5",
      badgeColor: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
      description: "Expanding the programming ecosystem with robust built-in libraries, module importing, and mathematical toolkits.",
      achievements: [
        "Mathematical module ('ganit') containing trigonometric, absolute, and root functions",
        "String utilities ('shabda') for splits, replaces, upper/lowercase, and regex searching",
        "File Operations ('nondh') for reading, writing, and appending localized text logs",
        "Import statement ('upayog') to share code blocks across multiple .kem script files"
      ]
    },
    {
      title: "v4.0.0 - Object-Oriented Structures (vastu)",
      date: "Q4 2026",
      status: "future",
      icon: Milestone,
      color: "border-purple-500 text-purple-500 bg-purple-500/5",
      badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      description: "Introducing object-oriented programming paradigms to support structure modeling, clean classes, inheritance, and instances.",
      achievements: [
        "Class blueprint declarations using Gujarati word 'varg'",
        "Instance allocation and attributes mapping ('vastu')",
        "Method declarations ('paddhati') with localized 'pote' (this/self) contexts",
        "Single inheritance mechanisms and base class overrides"
      ]
    },
    {
      title: "v5.0.0 - Native Compilers & VM (kem-vm)",
      date: "2027 Roadmap",
      status: "future",
      icon: Clock,
      color: "border-muted text-muted bg-muted/5",
      badgeColor: "bg-muted/10 text-muted border-muted/20",
      description: "Moving from an interpreted execution model to a high-speed compiled VM or WebAssembly compilation layer to achieve production-grade execution speeds.",
      achievements: [
        "Custom byte-code compiler that builds .kem files into optimized binary streams",
        "A highly-tuned stack-based virtual machine ('kem-vm') built in Rust/C++",
        "WebAssembly ('wasm') compiler target to run KemLang code inside the browser at native speeds",
        "Robust error tracing with descriptive compiler warning visual indicators"
      ]
    }
  ];

  return (
    <div className="bg-canvas max-w-7xl mx-auto space-y-16 py-8">
      {/* Header banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline text-accent-teal text-xs font-semibold uppercase tracking-wider font-body">
          Project Timeline & Roadmap
        </div>
        <h1 className="text-5xl md:text-6xl font-serif-editorial text-ink tracking-display-tight">
          The Journey of KemLang
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto font-body">
          Explore the milestones that shaped KemLang from an educational concept into a high-powered functional programming language—and see what lies ahead in our roadmap.
        </p>
        <div className="w-16 h-0.5 bg-accent-teal/30 mx-auto rounded-full" />
      </div>

      {/* Main interactive grid and timeline visual */}
      <div className="grid lg:grid-cols-12 gap-12 pt-8">
        
        {/* Timeline Path line (Left 8 cols on lg) */}
        <div className="lg:col-span-8 space-y-12 relative text-left">
          {/* Vertical central stem line */}
          <div className="absolute left-6 md:left-8 top-2 bottom-2 w-0.5 bg-hairline" />

          {timelineEvents.map((event, idx) => {
            const Icon = event.icon;
            const isCompleted = event.status === "completed";
            const isActive = event.status === "active";
            const isHovered = hoveredIndex === idx;

            return (
              <div 
                key={idx} 
                className={`relative flex gap-6 md:gap-10 transition-all duration-300 ${
                  idx === 1 ? "z-10" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Visual marker pin on vertical stem */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border flex items-center justify-between transition-all duration-300 shadow-md ${
                    isActive 
                      ? "border-accent-teal ring-4 ring-accent-teal/10 bg-surface-card text-accent-teal" 
                      : isCompleted 
                        ? "border-primary bg-primary text-white" 
                        : "border-hairline bg-surface-card text-muted"
                  }`}>
                    <div className="mx-auto select-none">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                      ) : (
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline Card */}
                <div className={`flex-1 bg-surface-soft border p-6 md:p-8 rounded-lg shadow-sm transition-all duration-300 ${
                  isActive 
                    ? "border-accent-teal/30 bg-surface-cream-soft shadow-md ring-1 ring-accent-teal/10" 
                    : "border-hairline hover:border-hairline-strong hover:shadow-md"
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${event.badgeColor}`}>
                      {event.date}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1.5 text-xs text-accent-teal font-semibold animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-accent-teal" />
                        Current Major Milestone
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl font-serif-editorial font-bold text-ink mb-3">
                    {event.title}
                  </h3>

                  <p className="text-sm text-muted leading-relaxed font-body mb-6">
                    {event.description}
                  </p>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-3 select-none">
                    Key Implementations:
                  </h4>
                  <ul className="grid sm:grid-cols-2 gap-2 text-xs text-body font-body">
                    {event.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2 leading-relaxed">
                        <span className={`text-sm select-none ${isActive ? "text-accent-teal" : isCompleted ? "text-primary" : "text-muted"}`}>
                          •
                        </span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Specific Action or Playground Inject for current version */}
                  {isActive && event.sampleCode && (
                    <div className="mt-8 pt-6 border-t border-hairline/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-soft font-mono">
                          v2.0.0 Feature Demo Code
                        </span>
                        <button
                          onClick={() => onLaunchSandbox(event.sampleCode)}
                          className="flex items-center gap-1.5 bg-accent-teal hover:bg-accent-teal-active text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors shadow-sm cursor-pointer select-none"
                        >
                          <Play size={11} />
                          Inject and Run
                        </button>
                      </div>
                      <pre className="p-4 bg-surface-dark border border-surface-dark-elevated text-[#faf9f5]/90 rounded-md text-xs font-mono text-left overflow-x-auto leading-relaxed custom-scrollbar max-h-[160px]">
                        {event.sampleCode}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative Side Panel (Right 4 cols on lg) */}
        <div className="lg:col-span-4 space-y-8 text-left">
          
          {/* Quick Stats Premium Card */}
          <div className="bg-surface-card border border-hairline rounded-lg p-6 space-y-6 shadow-sm">
            <h3 className="text-lg font-serif-editorial font-bold text-ink border-b border-hairline pb-3">
              KemLang Stats
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-2xl font-serif-editorial font-medium text-primary">v2.0.0</span>
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold font-body">Current Version</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-serif-editorial font-medium text-accent-teal">16+</span>
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold font-body">Core Keywords</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-serif-editorial font-medium text-accent-amber">100%</span>
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold font-body">Engine Parity</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-serif-editorial font-medium text-purple-500">Gujarati</span>
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold font-body">Lexical Root</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-hairline space-y-3">
              <p className="text-xs text-muted leading-relaxed font-body">
                KemLang leverages <strong>Vite + React</strong> on the frontend and <strong>Python</strong> on the back-end interpreter. Node wrappers enable a fast, clean developer environment.
              </p>
            </div>
          </div>

          {/* Educational Target Group Card */}
          <div className="bg-surface-card border border-hairline rounded-lg p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-serif-editorial font-bold text-ink border-b border-hairline pb-3">
              Why regional coding?
            </h3>
            <p className="text-xs text-muted leading-relaxed font-body">
              For native speakers of Gujarati, coding syntax in standard English forms a dual learning curve: understanding software logic patterns alongside vocabulary barriers.
            </p>
            <p className="text-xs text-muted leading-relaxed font-body">
              By mapping classical structural concepts (like recursive math, logical gates, loops, and lists) directly to familiar terms like <strong>kaam</strong>, <strong>aap</strong>, <strong>ane</strong>, and <strong>yadi</strong>, KemLang decouples logical computational thinking from English linguistic dependencies.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

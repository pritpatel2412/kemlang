"use client"

import { useRef, useEffect, useMemo } from "react"

export default function ConsoleOutput({ output, error }) {
  const consoleRef = useRef(null)

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [output])

  const successMessages = [
    "🎯 ઝકાસ! Even the compiler is happy!",
    "🧠 સરસ કામ ભાઈ, Debugger  પણ ઊંઘી ગયો! Peace mode ON!",
    "⚡ Code એટલો fast કે CPUs react — 'Bro, slow down!'",
    "🚀 Compilation complete — Launch mode activated!",
    "🌈 This isn't just code, it's pure અદ્ભુત creativity!",
    "🎬 What a script! Bollywood-level execution confirmed!",
    "🎉 Console literally clapped — Standing ovation deserved!",
    "📦 Functions delivered successfully — Prime speed, zero delay!",
    "🥁 Logic એવું dangerous કે mind blown 💥!",
    "📈 KemLang પણ ખુશ — કે વાપરનાર એવો next-level!",
    "🧩 Bug? What’s that? Perfect fit achieved!",
    "💡 Idea એટલું solid કે AI પણ pooche: 'kem no banavyo?'",
    "🎖️ KemLang Army welcomes its new Captain! 🫡",
    "📣 Don’t stop now, greatness is literally calling your name!",
    "🚩 Bro, you’re not a copy — you’re the original source code!",
    "⚙️ Code એટલે artwork — આ તો masterpiece છે!",
    "✨ Tera logic chal gaya — straight into the hall of fame!",
    "📢 Console बोले: 'આવા coder ના તો fan બણી જઈએ!'",
    "💫 Big brain energy detected. Keep flexing that logic!"
  ]

  const celebratoryMessage = useMemo(() => {
    if (!error && output) {
      const i = Math.floor(Math.random() * successMessages.length)
      return successMessages[i]
    }
    return null
  }, [output, error])

  return (
    <div
      ref={consoleRef}
      className="font-mono text-sm p-4 bg-surface-dark-soft text-on-dark h-[300px] overflow-y-auto whitespace-pre-wrap rounded-md shadow-inner select-text"
    >
      {error ? (
        <div className="text-error font-semibold">{output || "⚠️ Error occurred."}</div>
      ) : (
        <>
          {celebratoryMessage && (
            <div className="text-accent-amber font-bold mb-2">
              {celebratoryMessage}
            </div>
          )}
          <div className="text-success">{output || "✅ Run your code to see output here."}</div>
        </>
      )}
    </div>
  )
}

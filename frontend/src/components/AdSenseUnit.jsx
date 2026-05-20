import React, { useEffect } from "react";

export default function AdSenseUnit({ slot = "8074288228358823", style = { display: "block" }, format = "auto", responsive = "true" }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn("AdSense push warning:", e);
    }
  }, []);

  return (
    <div className="w-full my-4 flex flex-col items-center justify-center overflow-hidden rounded-lg border border-hairline/10 bg-surface-dark-elevated p-3 min-h-[90px] relative select-none">
      <div className="w-full flex items-center justify-between text-[8px] uppercase tracking-widest text-muted-soft pb-1.5 border-b border-hairline/5 mb-2 select-none">
        <span>Sponsored</span>
        <span className="px-1 py-0.5 rounded bg-primary/10 text-primary font-bold">Ad</span>
      </div>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-8074288228358823"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

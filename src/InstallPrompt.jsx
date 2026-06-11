import { useState, useEffect } from "react";
import { useApp } from "./App";

export default function InstallPrompt() {
  const { C, t } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(isStandaloneMode);

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (isIOSDevice && !isStandaloneMode) {
      setShowPrompt(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div style={{
      position: "fixed", bottom: 90, left: 20, right: 20, zIndex: 50,
      maxWidth: 500, margin: "0 auto",
      animation: "fadeUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
    }}>
      <div style={{
        background: C.glass, backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)",
        border: `1px solid ${C.glassBorder}`, borderRadius: 20, padding: "16px 20px",
        boxShadow: C.glassShadow, display: "flex", alignItems: "center", gap: 16
      }}>
        <div style={{ fontSize: 32, lineHeight: 1 }}>🍞</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 2 }}>
            Install Levain
          </div>
          <div style={{ fontFamily: "sans-serif", fontSize: 13, color: C.textSub, lineHeight: 1.4 }}>
            {isIOS ? (
              <>Tap <span style={{ display: "inline-block", transform: "translateY(2px)" }}>⬆️</span> then <strong>"Add to Home Screen"</strong></>
            ) : (
              <>Add to your home screen for offline access.</>
            )}
          </div>
        </div>
        
        {isIOS ? (
          <button onClick={() => setShowPrompt(false)} style={{
            background: C.accentSoft, color: C.accent, border: "none", borderRadius: 999,
            padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>Got it</button>
        ) : (
          <button onClick={handleInstall} style={{
            background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep || C.accent})`, 
            color: "#FFF", border: "none", borderRadius: 999,
            padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            boxShadow: `0 4px 12px ${C.accent}44`
          }}>Install</button>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
import Glossary from "./Glossary";

export default function GlossaryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón flotante esquina inferior izquierda */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 82,
          left: 16,
          zIndex: 35,
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: open ? "rgba(129,140,248,.2)" : "rgba(13,16,23,.92)",
          border: `1.5px solid ${open ? "#818cf8" : "rgba(255,255,255,.12)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 18,
          backdropFilter: "blur(10px)",
          boxShadow: open
            ? "0 0 20px rgba(129,140,248,.3)"
            : "0 4px 16px rgba(0,0,0,.4)",
          transition: "all .25s",
        }}
        title="Glosario de términos"
      >
        📖
      </button>

      {/* Modal del glosario */}
      {open && (
        <>
          {/* Fondo */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 55,
              background: "rgba(0,0,0,.5)",
              backdropFilter: "blur(3px)",
            }}
          />
          {/* Panel */}
          <div
            style={{
              position: "fixed",
              bottom: 110,
              left: 16,
              zIndex: 65,
              width: 340,
              maxHeight: "60vh",
              background: "var(--bg2)",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 16px 48px rgba(0,0,0,.6)",
              display: "flex",
              flexDirection: "column",
              animation: "slideUp .25s ease",
            }}
          >
            <style>{`
              @keyframes slideUp {
                from { opacity:0; transform:translateY(10px) }
                to   { opacity:1; transform:translateY(0) }
              }
            `}</style>
            {/* Header */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid rgba(255,255,255,.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div
                style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}
              >
                📖 Glosario de términos
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  fontSize: 18,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            {/* Contenido */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              <Glossary />
            </div>
          </div>
        </>
      )}
    </>
  );
}

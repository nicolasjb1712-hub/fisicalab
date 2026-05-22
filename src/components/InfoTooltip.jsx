import { useState, useRef } from "react";

export default function InfoTooltip({ text }) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef(null);
  const [above, setAbove] = useState(true);

  const visible = hovered || pinned;

  const calcDir = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setAbove(rect.top > 160);
    }
  };

  return (
    <span
      ref={ref}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <button
        onMouseEnter={() => {
          calcDir();
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          calcDir();
          setPinned((p) => !p);
        }}
        style={{
          width: 15,
          height: 15,
          borderRadius: "50%",
          background: pinned ? "rgba(59,130,246,.25)" : "rgba(255,255,255,.08)",
          border: `1px solid ${pinned ? "#3b82f6" : "rgba(255,255,255,.15)"}`,
          color: pinned ? "#3b82f6" : "#9ca3af",
          fontSize: 9,
          fontWeight: 700,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-main)",
          lineHeight: 1,
          flexShrink: 0,
          transition: "all .2s",
        }}
      >
        {pinned ? "×" : "?"}
      </button>

      {visible && (
        <div
          style={{
            position: "absolute",
            ...(above
              ? { bottom: "130%", top: "auto" }
              : { top: "130%", bottom: "auto" }),
            left: "50%",
            transform: "translateX(-50%)",
            background: "#0d1117",
            border: `1px solid ${pinned ? "#3b82f6" : "rgba(59,130,246,.3)"}`,
            borderRadius: 8,
            padding: "8px 10px",
            width: 220,
            zIndex: 9999,
            boxShadow: "0 8px 24px rgba(0,0,0,.6)",
            pointerEvents: pinned ? "auto" : "none",
          }}
        >
          {/* Indicador de fijado */}
          {pinned && (
            <div
              style={{
                fontSize: 9,
                color: "#3b82f6",
                fontWeight: 600,
                marginBottom: 5,
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "var(--font-main)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "inline-block",
                }}
              />
              Fijado — toca × para cerrar
            </div>
          )}
          <div
            style={{
              fontSize: 11,
              color: "#cbd5e1",
              lineHeight: 1.6,
              fontFamily: "var(--font-main)",
            }}
          >
            {text}
          </div>
          {/* Triángulo */}
          <div
            style={{
              position: "absolute",
              ...(above
                ? {
                    top: "100%",
                    borderTop: "5px solid rgba(59,130,246,.3)",
                    borderBottom: "none",
                  }
                : {
                    bottom: "100%",
                    borderBottom: "5px solid rgba(59,130,246,.3)",
                    borderTop: "none",
                  }),
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
            }}
          />
        </div>
      )}
    </span>
  );
}

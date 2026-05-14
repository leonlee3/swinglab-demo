import { useState } from "react";

const PROFILE = {
  exitVelo: 78, launchAngle: 14, batSpeed: 62, swingTime: 148,
  grades: { plane: "B+", contact: "A-", power: "B" },
  archetype: { icon: "⚡", name: "Contact hitter", desc: "Line drive profile · High contact rate", match: "94%" },
  tips: [
    "Stay through the ball — slight early extension detected at contact.",
    "Hip rotation is strong at 82°. Work on sequencing hips before hands.",
    "Hand path is efficient (7.2 in deviation). Maintain this through fatigue."
  ],
  drill: "Tee work focusing on staying through the ball at contact. 3 sets of 10 reps."
};

const STEPS = [
  "Reading video frames",
  "Detecting batter pose",
  "Tracking bat path",
  "Measuring swing plane",
  "Analyzing contact zone",
  "Comparing to archetypes",
  "Generating report"
];

const s = {
  wrap: { maxWidth: 520, margin: "0 auto", padding: "24px 16px", fontFamily: "inherit" },
  card: { background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "20px" },
  label: { fontSize: 13, color: "#6b7280", marginBottom: 4 },
  input: { width: "100%", border: "0.5px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 14, marginBottom: 10, outline: "none", fontFamily: "inherit" },
  btnPrimary: { background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer", width: "100%", marginTop: 12 },
  btnSecondary: { background: "transparent", color: "#111", border: "0.5px solid #d1d5db", borderRadius: 8, padding: "10px 20px", fontSize: 14, cursor: "pointer", width: "100%", marginTop: 8, fontFamily: "inherit" },
  metricCard: { background: "#f9fafb", borderRadius: 8, padding: "14px" },
  metricVal: { fontSize: 26, fontWeight: 500, lineHeight: 1 },
  metricUnit: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  gradeCard: { background: "#f9fafb", borderRadius: 8, padding: "12px", textAlign: "center" },
  swingCard: { background: "#0C1B2E", borderRadius: 12, padding: "20px", color: "#fff" },
  tab: (active) => ({ padding: "8px 14px", fontSize: 14, cursor: "pointer", color: active ? "#185FA5" : "#6b7280", borderBottom: active ? "2px solid #185FA5" : "2px solid transparent", fontWeight: active ? 500 : 400, background: "transparent", border: "none", borderBottom: active ? "2px solid #185FA5" : "2px solid transparent", fontFamily: "inherit" }),
};

export default function App() {
  const [screen, setScreen] = useState(1);
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("Jake Martinez");
  const [age, setAge] = useState("12");
  const [fileName, setFileName] = useState(null);
  const [angle, setAngle] = useState("rear");
  const [stepsDone, setStepsDone] = useState([]);
  const [progress, setProgress] = useState(0);

  function handleFile(e) {
    const f = e.target.files[0];
    if (f) setFileName(f.name);
  }

  function handleDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("video/")) setFileName(f.name);
  }

  function startAnalysis() {
    setScreen(2);
    setStepsDone([]);
    setProgress(0);
    let i = 0;
    function advance() {
      if (i >= STEPS.length) { setTimeout(() => setScreen(3), 400); return; }
      setStepsDone(prev => [...prev, i]);
      setProgress(Math.round(((i + 1) / STEPS.length) * 100));
      i++;
      setTimeout(advance, 520);
    }
    setTimeout(advance, 300);
  }

  function reset() { setScreen(1); setFileName(null); setTab(0); setStepsDone([]); setProgress(0); }

  const gradeColor = (g) => g.startsWith("A") ? "#1D9E75" : g.startsWith("B") ? "#185FA5" : "#BA7517";

  const dots = [1,2,3].map(n => (
    <span key={n} style={{ width: 8, height: 8, borderRadius: "50%", background: screen >= n ? "#185FA5" : "#e5e7eb", display: "inline-block", margin: "0 3px" }} />
  ));

  return (
    <div style={{ background: "#f4f5f7", minHeight: "100vh" }}>
      <div style={s.wrap}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>SwingLab</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>AI swing analysis</div>
          </div>
          <div>{dots}</div>
        </div>

        {/* SCREEN 1: UPLOAD */}
        {screen === 1 && (
          <div style={s.card}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>New session</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Upload a swing video to get your analysis</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={s.label}>Player name</div>
                <input style={s.input} value={name} onChange={e => setName(e.target.value)} placeholder="First Last" />
              </div>
              <div>
                <div style={s.label}>Age</div>
                <input style={s.input} type="number" value={age} onChange={e => setAge(e.target.value)} min={8} max={18} />
              </div>
            </div>

            <div style={s.label}>Swing video</div>
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
              style={{ border: "1.5px dashed #d1d5db", borderRadius: 12, padding: "28px 16px", textAlign: "center", cursor: "pointer", marginBottom: 16, marginTop: 4, background: fileName ? "#f0fdf4" : "transparent" }}
            >
              <div style={{ fontSize: 28, color: "#9ca3af" }}>↑</div>
              <div style={{ fontSize: 14, color: "#6b7280", marginTop: 6 }}>{fileName || "Drag and drop or click to select"}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>MP4, MOV — up to 2 min</div>
            </div>
            <input id="fileInput" type="file" accept="video/*" style={{ display: "none" }} onChange={handleFile} />

            <div style={s.label}>Camera angle</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
              {["rear", "side"].map(a => (
                <div key={a} onClick={() => setAngle(a)} style={{ ...s.card, cursor: "pointer", textAlign: "center", padding: "12px", border: angle === a ? "2px solid #185FA5" : "0.5px solid #e5e7eb" }}>
                  <div style={{ fontSize: 20, color: angle === a ? "#185FA5" : "#9ca3af" }}>{a === "rear" ? "⟳" : "→"}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>{a === "rear" ? "Rear view" : "Side view"}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{a === "rear" ? "Behind batter" : "Parallel to plate"}</div>
                </div>
              ))}
            </div>

            <button
              style={{ ...s.btnPrimary, opacity: fileName ? 1 : 0.5 }}
              disabled={!fileName}
              onClick={startAnalysis}
            >⚡ Analyze swing</button>
          </div>
        )}

        {/* SCREEN 2: ANALYZING */}
        {screen === 2 && (
          <div style={s.card}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Analyzing swing</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Processing video...</div>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", fontSize: 14, color: stepsDone.includes(i) ? "#111" : "#9ca3af", opacity: stepsDone.includes(i) || stepsDone.length === i ? 1 : 0.4 }}>
                <span style={{ fontSize: 16 }}>{stepsDone.includes(i) ? "✓" : stepsDone.length === i ? "◌" : "·"}</span>
                {step}
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>Overall progress</div>
              <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: progress + "%", background: "#185FA5", borderRadius: 99, transition: "width 0.3s" }} />
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: RESULTS */}
        {screen === 3 && (
          <div>
            <div style={{ display: "flex", borderBottom: "0.5px solid #e5e7eb", marginBottom: 20, background: "#fff", borderRadius: "12px 12px 0 0", padding: "0 4px" }}>
              {["Metrics", "Swing card", "Tips"].map((t, i) => (
                <button key={i} style={s.tab(tab === i)} onClick={() => setTab(i)}>{t}</button>
              ))}
            </div>

            {tab === 0 && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "Exit velocity", val: PROFILE.exitVelo, unit: "mph", color: "#185FA5" },
                    { label: "Launch angle", val: PROFILE.launchAngle, unit: "°", color: "#1D9E75" },
                    { label: "Bat speed", val: PROFILE.batSpeed, unit: "mph", color: "#534AB7" },
                    { label: "Swing time", val: PROFILE.swingTime, unit: "ms", color: "#BA7517" }
                  ].map((m, i) => (
                    <div key={i} style={s.metricCard}>
                      <div style={s.label}>{m.label}</div>
                      <div style={{ ...s.metricVal, color: m.color }}>{m.val}</div>
                      <div style={s.metricUnit}>{m.unit}</div>
                    </div>
                  ))}
                </div>

                <div style={{ ...s.card, marginBottom: 16 }}>
                  <div style={s.label}>Archetype match</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <span style={{ fontSize: 28 }}>{PROFILE.archetype.icon}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{PROFILE.archetype.name}</div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>{PROFILE.archetype.desc}</div>
                    </div>
                    <span style={{ marginLeft: "auto", background: "#E1F5EE", color: "#0F6E56", fontSize: 12, padding: "3px 10px", borderRadius: 6, fontWeight: 500 }}>{PROFILE.archetype.match}</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {Object.entries(PROFILE.grades).map(([k, v]) => (
                    <div key={k} style={s.gradeCard}>
                      <div style={{ fontSize: 26, fontWeight: 500, color: gradeColor(v) }}>{v}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{k === "plane" ? "Swing plane" : k === "contact" ? "Contact" : "Power index"}</div>
                    </div>
                  ))}
                </div>

                <button style={s.btnSecondary} onClick={() => setTab(1)}>View swing card</button>
                <button style={s.btnSecondary} onClick={reset}>New session</button>
              </div>
            )}

            {tab === 1 && (
              <div>
                <div style={s.swingCard}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#5DCAA5", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>SwingLab · AI Analysis</div>
                  <div style={{ fontSize: 20, fontWeight: 500, color: "#fff" }}>{name || "Player"}</div>
                  <div style={{ fontSize: 13, color: "#9FE1CB", marginBottom: 16 }}>Age {age} · May 14, 2026</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                      { label: "Exit velocity", val: PROFILE.exitVelo, unit: "mph" },
                      { label: "Launch angle", val: PROFILE.launchAngle, unit: "°" },
                      { label: "Bat speed", val: PROFILE.batSpeed, unit: "mph" },
                      { label: "Swing time", val: PROFILE.swingTime, unit: "ms" }
                    ].map((m, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: 10 }}>
                        <div style={{ fontSize: 22, fontWeight: 500, color: "#fff" }}>{m.val}<span style={{ fontSize: 13 }}>{m.unit}</span></div>
                        <div style={{ fontSize: 11, color: "#9FE1CB" }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, borderTop: "0.5px solid rgba(255,255,255,0.12)", paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#5DCAA5" }}>
                    <span>{PROFILE.archetype.name}</span>
                    <span>swinglab.ai</span>
                  </div>
                </div>
                <button style={{ ...s.btnPrimary, marginTop: 14 }} onClick={() => alert("In production: generates a unique swinglab.ai/card/[id] share link with image preview")}>Share swing card</button>
                <button style={s.btnSecondary} onClick={() => setTab(0)}>← Back to metrics</button>
              </div>
            )}

            {tab === 2 && (
              <div>
                <div style={{ ...s.card, marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Coaching notes for {name}</div>
                  {PROFILE.tips.map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 13, color: "#374151" }}>
                      <span style={{ color: "#185FA5", flexShrink: 0 }}>›</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={s.card}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Next drill</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{PROFILE.drill}</div>
                </div>
                <button style={s.btnSecondary} onClick={() => setTab(0)}>← Back to metrics</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

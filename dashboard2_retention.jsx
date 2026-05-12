import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

const PODS = [
  { id: "p1", name: "Pod 1", full: "Revenue Drivers", active: 90, lost: 106, buyout: 9, total: 205, lossRate: 51.7, avgTenure: 3.0, buckets: { "0–3mo": 82, "3–6mo": 14, "6–12mo": 7, "12mo+": 3 }, color: "#7C3AED" },
  { id: "p2", name: "Pod 2", full: "Growth & Brand",  active: 125, lost: 160, buyout: 33, total: 318, lossRate: 50.3, avgTenure: 6.4, buckets: { "0–3mo": 75, "3–6mo": 30, "6–12mo": 33, "12mo+": 22 }, color: "#0891B2" },
  { id: "p3", name: "Pod 3", full: "Product Builders",active: 46,  lost: 47,  buyout: 8,  total: 101, lossRate: 46.5, avgTenure: 4.5, buckets: { "0–3mo": 25, "3–6mo": 14, "6–12mo": 4,  "12mo+": 4  }, color: "#059669" },
  { id: "p4", name: "Pod 4", full: "Bulk Hiring",     active: 10,  lost: 142, buyout: 0,  total: 152, lossRate: 93.4, avgTenure: 1.5, buckets: { "0–3mo": 130,"3–6mo": 8,  "6–12mo": 3,  "12mo+": 0  }, color: "#DC2626" },
];

const ROLES = [
  { role: "Cold Caller",          exits: 142, active: 10, lossRate: 93.4 },
  { role: "Social Media Mgr",     exits: 16,  active: 7,  lossRate: 69.6 },
  { role: "Paid Media Specialist",exits: 11,  active: 5,  lossRate: 68.8 },
  { role: "Appointment Setter",   exits: 9,   active: 0,  lossRate: 100  },
  { role: "SDR",                  exits: 9,   active: 14, lossRate: 39.1 },
  { role: "BDR",                  exits: 7,   active: 1,  lossRate: 87.5 },
  { role: "Executive Assistant",  exits: 7,   active: 2,  lossRate: 77.8 },
  { role: "Amazon Assistant",     exits: 7,   active: 0,  lossRate: 100  },
  { role: "Graphic Designer",     exits: 7,   active: 10, lossRate: 41.2 },
  { role: "Social Media Specialist",exits:6,  active: 0,  lossRate: 100  },
];

const RECRUITERS = [
  { name: "Ridge Espinoza",  total: 126, active: 9,  lost: 114, buyout: 3,  lossRate: 90.5 },
  { name: "Bay Nguyen",      total: 45,  active: 2,  lost: 36,  buyout: 7,  lossRate: 80.0 },
  { name: "Briar Torres",    total: 43,  active: 12, lost: 31,  buyout: 0,  lossRate: 72.1 },
  { name: "Lake Adeyemi",    total: 44,  active: 9,  lost: 31,  buyout: 4,  lossRate: 70.5 },
  { name: "Kit Rivera",      total: 59,  active: 13, lost: 40,  buyout: 6,  lossRate: 67.8 },
  { name: "Drew Espinoza",   total: 60,  active: 23, lost: 37,  buyout: 0,  lossRate: 61.7 },
  { name: "Casey Phillips",  total: 45,  active: 9,  lost: 26,  buyout: 10, lossRate: 57.8 },
  { name: "Wilder Sharma",   total: 32,  active: 12, lost: 16,  buyout: 4,  lossRate: 50.0 },
  { name: "Alex Rivera",     total: 35,  active: 16, lost: 17,  buyout: 2,  lossRate: 48.6 },
  { name: "Riley Castro",    total: 62,  active: 32, lost: 28,  buyout: 2,  lossRate: 45.2 },
  { name: "Harbor Chen",     total: 33,  active: 16, lost: 14,  buyout: 3,  lossRate: 42.4 },
  { name: "Reese Adeyemi",   total: 57,  active: 28, lost: 25,  buyout: 4,  lossRate: 43.9 },
  { name: "Cameron Osei",    total: 27,  active: 17, lost: 8,   buyout: 2,  lossRate: 29.6 },
  { name: "Avery Walsh",     total: 22,  active: 14, lost: 7,   buyout: 1,  lossRate: 31.8 },
  { name: "Remi Kovalenko",  total: 15,  active: 11, lost: 4,   buyout: 0,  lossRate: 26.7 },
  { name: "Sloane Petrov",   total: 22,  active: 17, lost: 5,   buyout: 0,  lossRate: 22.7 },
  { name: "Storm Phillips",  total: 10,  active: 9,  lost: 1,   buyout: 0,  lossRate: 10.0 },
  { name: "Peyton Asante",   total: 13,  active: 12, lost: 1,   buyout: 0,  lossRate: 7.7  },
];

const lossColor = (rate) => {
  if (rate >= 80) return "#DC2626";
  if (rate >= 60) return "#EA580C";
  if (rate >= 40) return "#D97706";
  return "#16A34A";
};

const TENURE_COLORS = ["#DC2626", "#EA580C", "#D97706", "#16A34A"];
const BUCKET_KEYS = ["0–3mo", "3–6mo", "6–12mo", "12mo+"];

const CustomTooltipBar = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a1a2e", border: "1px solid #2d2d4e", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <p style={{ margin: "0 0 6px", fontWeight: 600, color: "#e0e0ff" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: "2px 0", color: p.fill }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPod, setSelectedPod] = useState(null);

  const podBarData = PODS.map(p => ({
    name: p.name,
    Active: p.active,
    Lost: p.lost,
    Buyout: p.buyout,
    color: p.color,
  }));

  const lossRateData = PODS.map(p => ({
    name: p.name,
    "Loss Rate %": p.lossRate,
    color: lossColor(p.lossRate),
  }));

  const selectedPodData = selectedPod ? PODS.find(p => p.id === selectedPod) : null;
  const tenurePieData = selectedPodData
    ? BUCKET_KEYS.map((k, i) => ({ name: k, value: selectedPodData.buckets[k], fill: TENURE_COLORS[i] }))
    : null;

  const roleChartData = ROLES.slice(0, 8).map(r => ({
    role: r.role.length > 18 ? r.role.slice(0, 17) + "…" : r.role,
    fullRole: r.role,
    Exits: r.exits,
    Active: r.active,
    lossRate: r.lossRate,
  }));

  const recSorted = [...RECRUITERS].sort((a, b) => b.lossRate - a.lossRate);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: "#0f0f1a", minHeight: "100vh", color: "#e2e2f0", padding: "0 0 40px" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", borderBottom: "1px solid #2d2d4e", padding: "24px 28px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#818cf8" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#818cf8", textTransform: "uppercase" }}>Scale Army · HR Dashboard</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#f0f0ff", letterSpacing: "-0.02em" }}>Pod & Role-Level Retention</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#8888aa" }}>Attrition concentration by team, role, and recruiter</p>
          </div>
          {/* Summary pills */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "Total Placements", value: "780" },
              { label: "Overall Loss Rate", value: "59%" },
              { label: "Highest Risk Pod", value: "Pod 4" },
            ].map(s => (
              <div key={s.label} style={{ background: "#1e1e35", border: "1px solid #2d2d4e", borderRadius: 10, padding: "8px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#c7c7ff" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#6666aa", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 20 }}>
          {[
            { id: "overview", label: "Pod Overview" },
            { id: "roles", label: "Role Breakdown" },
            { id: "recruiters", label: "Recruiter Analysis" },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: activeTab === t.id ? "#3730a3" : "transparent",
              border: activeTab === t.id ? "1px solid #4f46e5" : "1px solid #2d2d4e",
              borderRadius: 8,
              padding: "7px 16px",
              fontSize: 13,
              color: activeTab === t.id ? "#c7d2fe" : "#8888aa",
              cursor: "pointer",
              fontWeight: activeTab === t.id ? 600 : 400,
              transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 28px" }}>

        {/* ── POD OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div>
            {/* Pod cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
              {PODS.map(p => (
                <div key={p.id} onClick={() => setSelectedPod(selectedPod === p.id ? null : p.id)}
                  style={{
                    background: selectedPod === p.id ? "#1e1e35" : "#161624",
                    border: `1px solid ${selectedPod === p.id ? p.color : "#2d2d4e"}`,
                    borderRadius: 12,
                    padding: "16px 18px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: p.color, opacity: 0.8 }} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: "#aaaacc", marginBottom: 12 }}>{p.full}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: lossColor(p.lossRate), letterSpacing: "-0.02em" }}>{p.lossRate}%</div>
                  <div style={{ fontSize: 11, color: "#6666aa", marginBottom: 10 }}>loss rate</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, background: "#16a34a22", color: "#4ade80", borderRadius: 4, padding: "2px 7px" }}>✓ {p.active} active</span>
                    <span style={{ fontSize: 11, background: "#dc262622", color: "#f87171", borderRadius: 4, padding: "2px 7px" }}>✗ {p.lost} lost</span>
                    {p.buyout > 0 && <span style={{ fontSize: 11, background: "#7c3aed22", color: "#a78bfa", borderRadius: 4, padding: "2px 7px" }}>↗ {p.buyout} buyout</span>}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: "#6666aa" }}>avg tenure: <span style={{ color: "#c7c7ff", fontWeight: 600 }}>{p.avgTenure} mo</span></div>
                  {selectedPod === p.id && <div style={{ fontSize: 10, color: p.color, marginTop: 8 }}>▼ see tenure breakdown below</div>}
                </div>
              ))}
            </div>

            {/* Tenure breakdown for selected pod */}
            {selectedPodData && tenurePieData && (
              <div style={{ background: "#161624", border: "1px solid #2d2d4e", borderRadius: 12, padding: "20px 24px", marginBottom: 28 }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "#e0e0ff" }}>
                  {selectedPodData.name} — {selectedPodData.full}: Tenure at Exit
                </h3>
                <p style={{ margin: "0 0 20px", fontSize: 12, color: "#6666aa" }}>How long did lost talent last before leaving?</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
                  <ResponsiveContainer width={220} height={180}>
                    <PieChart>
                      <Pie data={tenurePieData} cx={110} cy={90} innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                        {tenurePieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v + " talent", n]} contentStyle={{ background: "#1a1a2e", border: "1px solid #2d2d4e", borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    {BUCKET_KEYS.map((k, i) => {
                      const val = selectedPodData.buckets[k];
                      const total = Object.values(selectedPodData.buckets).reduce((a,b)=>a+b,0);
                      const pct = total ? Math.round(val/total*100) : 0;
                      return (
                        <div key={k} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: TENURE_COLORS[i], fontWeight: 600 }}>{k}</span>
                            <span style={{ fontSize: 12, color: "#aaaacc" }}>{val} talent · {pct}%</span>
                          </div>
                          <div style={{ height: 6, background: "#2d2d4e", borderRadius: 3 }}>
                            <div style={{ height: 6, background: TENURE_COLORS[i], borderRadius: 3, width: `${pct}%`, transition: "width 0.5s" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Stacked bar - all pods */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, flexWrap: "wrap" }}>
              <div style={{ background: "#161624", border: "1px solid #2d2d4e", borderRadius: 12, padding: "20px 16px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#e0e0ff" }}>Volume by pod</h3>
                <p style={{ margin: "0 0 16px", fontSize: 11, color: "#6666aa" }}>Active · Lost · Buyout</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={podBarData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
                    <XAxis dataKey="name" tick={{ fill: "#8888aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#8888aa", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltipBar />} />
                    <Bar dataKey="Active" stackId="a" fill="#16a34a" radius={[0,0,0,0]} />
                    <Bar dataKey="Lost" stackId="a" fill="#dc2626" />
                    <Bar dataKey="Buyout" stackId="a" fill="#7c3aed" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "#161624", border: "1px solid #2d2d4e", borderRadius: 12, padding: "20px 16px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#e0e0ff" }}>Loss rate by pod</h3>
                <p style={{ margin: "0 0 16px", fontSize: 11, color: "#6666aa" }}>% of placements ending as Lost</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={lossRateData} barCategoryGap="40%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" />
                    <XAxis dataKey="name" tick={{ fill: "#8888aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#8888aa", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0,100]} unit="%" />
                    <Tooltip content={<CustomTooltipBar />} />
                    <Bar dataKey="Loss Rate %" radius={[6,6,0,0]}>
                      {lossRateData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Avg tenure bar */}
            <div style={{ background: "#161624", border: "1px solid #2d2d4e", borderRadius: 12, padding: "20px 16px", marginTop: 14 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#e0e0ff" }}>Average tenure at exit (months)</h3>
              <p style={{ margin: "0 0 16px", fontSize: 11, color: "#6666aa" }}>Longer is better — indicates more stable placement before churn</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PODS.map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, color: p.color, fontWeight: 600, minWidth: 55 }}>{p.name}</span>
                    <div style={{ flex: 1, height: 20, background: "#2d2d4e", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: 20, background: p.color, borderRadius: 4, width: `${(p.avgTenure / 8) * 100}%`, display: "flex", alignItems: "center", paddingLeft: 8, transition: "width 0.5s" }}>
                        <span style={{ fontSize: 11, color: "#fff", fontWeight: 700, whiteSpace: "nowrap" }}>{p.avgTenure} mo</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ROLE BREAKDOWN TAB ── */}
        {activeTab === "roles" && (
          <div>
            <div style={{ background: "#1e1520", border: "1px solid #4c1d3a", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 18 }}>⚠</span>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: "#f87171", fontWeight: 600 }}>Cold Caller is a critical outlier</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#aa8888" }}>142 exits vs. 10 active — 93% loss rate. This single role accounts for nearly all of Pod 4's attrition and warrants its own retention strategy.</p>
              </div>
            </div>

            {/* Role cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 24 }}>
              {ROLES.map((r, i) => {
                const total = r.exits + r.active;
                const isOutlier = r.lossRate >= 90;
                return (
                  <div key={i} style={{
                    background: isOutlier ? "#1e1520" : "#161624",
                    border: `1px solid ${isOutlier ? "#7c1d2e" : "#2d2d4e"}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#e0e0ff", flex: 1 }}>{r.role}</span>
                      <span style={{
                        fontSize: 13, fontWeight: 800, color: lossColor(r.lossRate),
                        background: lossColor(r.lossRate) + "22",
                        borderRadius: 6, padding: "2px 8px", marginLeft: 8, flexShrink: 0,
                      }}>{r.lossRate}%</span>
                    </div>
                    <div style={{ height: 6, background: "#2d2d4e", borderRadius: 3, marginBottom: 10 }}>
                      <div style={{ height: 6, background: lossColor(r.lossRate), borderRadius: 3, width: `${r.lossRate}%` }} />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "#f87171" }}>✗ {r.exits} exits</span>
                      <span style={{ fontSize: 11, color: "#4ade80" }}>✓ {r.active} active</span>
                      <span style={{ fontSize: 11, color: "#8888aa" }}>= {total} total</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Role bar chart */}
            <div style={{ background: "#161624", border: "1px solid #2d2d4e", borderRadius: 12, padding: "20px 16px" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#e0e0ff" }}>Active vs. Lost by role (top 8 by exits)</h3>
              <p style={{ margin: "0 0 16px", fontSize: 11, color: "#6666aa" }}>Cold Caller truncated — see alert above</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={roleChartData.filter(r => r.fullRole !== "Cold Caller")} layout="vertical" barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#8888aa", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="role" tick={{ fill: "#aaaacc", fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip content={<CustomTooltipBar />} />
                  <Bar dataKey="Active" fill="#16a34a" radius={[0,4,4,0]} />
                  <Bar dataKey="Exits" fill="#dc2626" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── RECRUITER TAB ── */}
        {activeTab === "recruiters" && (
          <div>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#8888aa" }}>
              Sorted by loss rate — context matters: recruiters with high volume working Bulk Hiring roles will naturally show higher loss rates.
            </p>
            <div style={{ background: "#161624", border: "1px solid #2d2d4e", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 70px 70px 110px", gap: 0, borderBottom: "1px solid #2d2d4e", padding: "10px 16px" }}>
                {["Recruiter","Total","Active","Lost","Buyout","Loss Rate"].map(h => (
                  <span key={h} style={{ fontSize: 11, color: "#6666aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
                ))}
              </div>
              {recSorted.map((r, i) => (
                <div key={r.name} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 70px 70px 70px 70px 110px",
                  gap: 0,
                  padding: "11px 16px",
                  borderBottom: i < recSorted.length - 1 ? "1px solid #1e1e30" : "none",
                  background: i % 2 === 0 ? "transparent" : "#13131f",
                  alignItems: "center",
                }}>
                  <span style={{ fontSize: 13, color: "#e0e0ff", fontWeight: 500 }}>{r.name}</span>
                  <span style={{ fontSize: 13, color: "#aaaacc" }}>{r.total}</span>
                  <span style={{ fontSize: 13, color: "#4ade80" }}>{r.active}</span>
                  <span style={{ fontSize: 13, color: "#f87171" }}>{r.lost}</span>
                  <span style={{ fontSize: 13, color: "#a78bfa" }}>{r.buyout}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: "#2d2d4e", borderRadius: 3 }}>
                      <div style={{ height: 6, background: lossColor(r.lossRate), borderRadius: 3, width: `${r.lossRate}%` }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: lossColor(r.lossRate), minWidth: 36, textAlign: "right" }}>{r.lossRate}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Insight callout */}
            <div style={{ background: "#161624", border: "1px solid #2d2d4e", borderRadius: 10, padding: "14px 16px", marginTop: 16 }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#e0e0ff" }}>Key insight</p>
              <p style={{ margin: 0, fontSize: 12, color: "#8888aa", lineHeight: 1.6 }}>
                Ridge Espinoza (90.5% loss rate, 126 placements) and Bay Nguyen (80%, 45) show significantly higher attrition than peers like Peyton Asante (7.7%) and Storm Phillips (10%). Before drawing conclusions, cross-check whether high-loss recruiters are disproportionately assigned to Cold Caller and Bulk Hiring roles — the role mix, not recruiter quality alone, may explain the gap.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

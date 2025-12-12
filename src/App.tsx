import FearGreedWidget from "./FearGreedWidget";

export default function App() {
  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="muted" style={{ fontSize: 12, letterSpacing: 0.8 }}>
            SAMPLE
          </div>
          <h1 style={{ margin: "6px 0 0" }}>Fear / Greed Index</h1>
          <p className="muted" style={{ margin: "8px 0 0", maxWidth: 720 }}>
            Fetches collection emission stats from <b>giftasset.pro</b>, computes a
            Fear/Greed score, and renders it in a small UI.
          </p>
        </div>
        <span className="badge">No private tokens in repo</span>
      </div>

      <div style={{ height: 14 }} />
      <FearGreedWidget />
    </div>
  );
}

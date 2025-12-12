import { useEffect, useMemo, useState } from "react";
import { fetchCollectionsEmission } from "./api";
import { extractCollectionsMap } from "./types";
import {
  calculateAverageGreed,
  getTopGreediestCollections,
  type GreedIndex,
} from "./fearGreed";

type LoadState =
  | { status: "idle" | "loading"; error: null }
  | { status: "error"; error: string }
  | { status: "ready"; error: null };

export default function FearGreedWidget() {
  const [collections, setCollections] = useState<Record<string, any>>({});
  const [loadState, setLoadState] = useState<LoadState>({
    status: "idle",
    error: null,
  });

  useEffect(() => {
    const ac = new AbortController();

    async function run() {
      setLoadState({ status: "loading", error: null });
      try {
        const payload = await fetchCollectionsEmission(ac.signal);
        const map = extractCollectionsMap(payload);
        setCollections(map);
        setLoadState({ status: "ready", error: null });
      } catch (e) {
        setLoadState({
          status: "error",
          error: e instanceof Error ? e.message : "Unknown error",
        });
      }
    }

    void run();
    return () => ac.abort();
  }, []);

  const averageGreed = useMemo(() => {
    return calculateAverageGreed(collections);
  }, [collections]);

  const averageFear = useMemo(() => {
    const greed = averageGreed;
    return Math.max(0, Math.min(100, 100 - greed));
  }, [averageGreed]);

  const topCollections = useMemo(() => {
    return getTopGreediestCollections(collections, 3);
  }, [collections]);

  return (
    <div className="grid">
      <section className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <span style={{ fontSize: 18 }}>📈</span>
            <h2 style={{ margin: 0, fontSize: 16 }}>Index</h2>
          </div>
          <span className="badge">emission → fear/greed</span>
        </div>

        <div style={{ height: 12 }} />

        {loadState.status === "loading" || loadState.status === "idle" ? (
          <p className="muted" style={{ margin: 0 }}>
            Loading emission stats from giftasset.pro...
          </p>
        ) : null}

        {loadState.status === "error" ? (
          <div>
            <div style={{ color: "#fecaca", fontWeight: 600 }}>Failed to load</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              {loadState.error}
            </div>
          </div>
        ) : null}

        {loadState.status === "ready" ? (
          <div className="row" style={{ gap: 18, flexWrap: "wrap" }}>
            <div>
              <div className="muted" style={{ fontSize: 12 }}>
                Average Greed
              </div>
              <div className="score" style={{ fontSize: 34 }}>
                {Math.round(averageGreed)}
                <span className="muted" style={{ fontSize: 14, marginLeft: 6 }}>
                  /100
                </span>
              </div>
            </div>

            <div>
              <div className="muted" style={{ fontSize: 12 }}>
                Average Fear
              </div>
              <div className="score" style={{ fontSize: 34 }}>
                {Math.round(averageFear)}
                <span className="muted" style={{ fontSize: 14, marginLeft: 6 }}>
                  /100
                </span>
              </div>
            </div>

            <div className="muted" style={{ fontSize: 12, maxWidth: 360 }}>
              Uses whale concentration, upgrade rate, hidden ratio, refund rate
              (inverse), and owner dispersion (inverse).
            </div>
          </div>
        ) : null}
      </section>

      <aside className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>Top Greediest Collections</h3>
          <span className="badge">top 3</span>
        </div>

        <div style={{ height: 12 }} />

        {loadState.status !== "ready" ? (
          <p className="muted" style={{ margin: 0, fontSize: 12 }}>
            Will appear after data loads.
          </p>
        ) : null}

        {loadState.status === "ready" ? (
          <div className="list">
            {topCollections.length === 0 ? (
              <div className="muted" style={{ fontSize: 12 }}>
                No collections returned.
              </div>
            ) : (
              topCollections.map((item, idx) => (
                <CollectionRow key={item.collectionName} item={item} rank={idx + 1} />
              ))
            )}
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function CollectionRow({
  item,
  rank,
}: {
  item: GreedIndex;
  rank: number;
}) {
  const color = getScoreColor(item.greed);
  return (
    <div className="listItem">
      <div style={{ minWidth: 0 }}>
        <div className="muted" style={{ fontSize: 12 }}>
          #{rank} · {item.level}
        </div>
        <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.collectionName}
        </div>
      </div>
      <div className="score" style={{ color }}>
        {Math.round(item.greed)}
        <span className="muted" style={{ fontSize: 12 }}>
          /100
        </span>
      </div>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score < 25) return "#60a5fa";
  if (score < 50) return "#4ade80";
  if (score < 75) return "#fb923c";
  return "#f87171";
}

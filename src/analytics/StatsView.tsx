import { useMemo, useState } from 'react';
import {
  clearStoredAnalytics,
  exportStoredAnalytics,
  getRemoteAnalyticsStatus,
  getStoredAnalyticsEvents
} from './analytics';

interface PackageMetrics {
  id: string;
  views: number;
  dwellMs: number;
  maxDepth: number;
  entryClicks: number;
  relationshipClicks: number;
}

export function StatsView() {
  const [revision, setRevision] = useState(0);

  const data = useMemo(() => {
    const events = getStoredAnalyticsEvents();
    const sessions = new Set(events.map((event) => event.sessionId));
    const packages = new Map<string, PackageMetrics>();
    const blockTypes = new Map<string, number>();

    const ensurePackage = (id: string): PackageMetrics => {
      const existing = packages.get(id);
      if (existing) return existing;

      const created: PackageMetrics = {
        id,
        views: 0,
        dwellMs: 0,
        maxDepth: 0,
        entryClicks: 0,
        relationshipClicks: 0
      };
      packages.set(id, created);
      return created;
    };

    for (const event of events) {
      const packageId =
        typeof event.properties.package_id === 'string'
          ? event.properties.package_id
          : null;

      if (packageId) {
        const metrics = ensurePackage(packageId);

        if (event.name === 'package_view') metrics.views += 1;
        if (event.name === 'entry_open') metrics.entryClicks += 1;
        if (event.name === 'relationship_open') metrics.relationshipClicks += 1;

        if (event.name === 'package_dwell') {
          const dwell =
            typeof event.properties.dwell_ms === 'number'
              ? event.properties.dwell_ms
              : 0;
          metrics.dwellMs += dwell;
        }

        if (event.name === 'package_depth') {
          const depth =
            typeof event.properties.depth_percent === 'number'
              ? event.properties.depth_percent
              : 0;
          metrics.maxDepth = Math.max(metrics.maxDepth, depth);
        }
      }

      if (event.name === 'block_exposed') {
        const type =
          typeof event.properties.block_type === 'string'
            ? event.properties.block_type
            : 'unknown';
        blockTypes.set(type, (blockTypes.get(type) ?? 0) + 1);
      }
    }

    return {
      events,
      sessionCount: sessions.size,
      packageRows: [...packages.values()].sort(
        (a, b) => b.views - a.views || b.dwellMs - a.dwellMs
      ),
      blockRows: [...blockTypes.entries()].sort((a, b) => b[1] - a[1]),
      relationshipFollows: events.filter(
        (event) => event.name === 'relationship_open'
      ).length,
      entryOpens: events.filter((event) => event.name === 'entry_open').length,
      landingViews: events.filter((event) => event.name === 'landing_view').length
    };
  }, [revision]);

  return (
    <main className="sf-stats">
      <header className="sf-stats-header">
        <div>
          <span>StoryForge / local usage analytics</span>
          <h1>What your usage is telling us.</h1>
          <p>
            Anonymous IDs, navigation and timing only. No story text is stored
            in analytics.
          </p>
        </div>
        <div className="sf-stats-actions">
          <button type="button" onClick={() => exportStoredAnalytics()}>
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => {
              clearStoredAnalytics();
              setRevision((value) => value + 1);
            }}
          >
            Clear local data
          </button>
          <a href="/">Return to StoryForge</a>
        </div>
      </header>

      <section className="sf-stats-kpis">
        <article>
          <span>Sessions</span>
          <strong>{data.sessionCount}</strong>
        </article>
        <article>
          <span>Landing views</span>
          <strong>{data.landingViews}</strong>
        </article>
        <article>
          <span>Entry choices</span>
          <strong>{data.entryOpens}</strong>
        </article>
        <article>
          <span>Relationship follows</span>
          <strong>{data.relationshipFollows}</strong>
        </article>
        <article>
          <span>Events stored</span>
          <strong>{data.events.length}</strong>
        </article>
        <article>
          <span>Remote backend</span>
          <strong className="sf-stats-status">
            {getRemoteAnalyticsStatus()}
          </strong>
        </article>
      </section>

      <section className="sf-stats-section">
        <div className="sf-stats-section-title">
          <span>Package engagement</span>
          <p>
            Views show attraction; dwell and depth show whether the experience
            keeps attention.
          </p>
        </div>
        <div className="sf-stats-table">
          <div className="sf-stats-row sf-stats-row-head">
            <span>Package</span>
            <span>Views</span>
            <span>Entry</span>
            <span>Rel.</span>
            <span>Avg dwell</span>
            <span>Depth</span>
          </div>
          {data.packageRows.map((row) => (
            <div className="sf-stats-row" key={row.id}>
              <strong>{row.id}</strong>
              <span>{row.views}</span>
              <span>{row.entryClicks}</span>
              <span>{row.relationshipClicks}</span>
              <span>
                {row.views
                  ? `${Math.round(row.dwellMs / row.views / 1000)}s`
                  : '—'}
              </span>
              <span>{row.maxDepth ? `${row.maxDepth}%` : '—'}</span>
            </div>
          ))}
          {!data.packageRows.length ? (
            <div className="sf-stats-empty">
              Use StoryForge normally and this table will begin filling.
            </div>
          ) : null}
        </div>
      </section>

      <section className="sf-stats-section">
        <div className="sf-stats-section-title">
          <span>Block exposure</span>
          <p>
            This shows which visualization primitives are actually being
            reached.
          </p>
        </div>
        <div className="sf-stats-blocks">
          {data.blockRows.map(([type, count]) => (
            <article key={type}>
              <span>{type}</span>
              <strong>{count}</strong>
            </article>
          ))}
          {!data.blockRows.length ? <p>No block exposure recorded yet.</p> : null}
        </div>
      </section>
    </main>
  );
}

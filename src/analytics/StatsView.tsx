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
  impressions: number;
  dwellMs: number;
  maxDepth: number;
  entryClicks: number;
  relationshipClicks: number;
  blockExposures: number;
  blockCount: number;
}

interface Signal {
  packageId: string;
  tone: 'positive' | 'watch' | 'neutral';
  title: string;
  evidence: string;
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
        impressions: 0,
        dwellMs: 0,
        maxDepth: 0,
        entryClicks: 0,
        relationshipClicks: 0,
        blockExposures: 0,
        blockCount: 0
      };
      packages.set(id, created);
      return created;
    };

    for (const event of events) {
      if (event.name === 'landing_view') {
        const ids =
          typeof event.properties.direction_ids === 'string'
            ? event.properties.direction_ids
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean)
            : [];

        for (const id of ids) {
          ensurePackage(id).impressions += 1;
        }
      }

      const packageId =
        typeof event.properties.package_id === 'string'
          ? event.properties.package_id
          : null;

      if (packageId) {
        const metrics = ensurePackage(packageId);

        if (event.name === 'package_view') {
          metrics.views += 1;
          const blockCount =
            typeof event.properties.block_count === 'number'
              ? event.properties.block_count
              : 0;
          metrics.blockCount = Math.max(metrics.blockCount, blockCount);
        }

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

        if (event.name === 'block_exposed') {
          metrics.blockExposures += 1;
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

    const packageRows = [...packages.values()].sort(
      (a, b) => b.views - a.views || b.dwellMs - a.dwellMs
    );

    const signals: Signal[] = [];

    for (const row of packageRows) {
      const avgDwell = row.views ? row.dwellMs / row.views / 1000 : 0;
      const ctr = row.impressions ? row.entryClicks / row.impressions : 0;
      const relationshipRate = row.views
        ? row.relationshipClicks / row.views
        : 0;
      const blockExposureRate =
        row.views && row.blockCount
          ? row.blockExposures / (row.views * row.blockCount)
          : 0;

      if (row.views >= 2 && avgDwell >= 25 && row.maxDepth >= 75) {
        signals.push({
          packageId: row.id,
          tone: 'positive',
          title: 'Strong engagement',
          evidence: `${Math.round(avgDwell)}s average dwell and ${row.maxDepth}% depth reached.`
        });
      }

      if (row.impressions >= 3 && ctr >= 0.4 && row.views >= 2 && avgDwell < 12) {
        signals.push({
          packageId: row.id,
          tone: 'watch',
          title: 'Entry promise stronger than retention',
          evidence: `${Math.round(ctr * 100)}% entry rate, but only ${Math.round(avgDwell)}s average dwell.`
        });
      }

      if (row.impressions >= 5 && ctr <= 0.15 && row.views >= 1 && avgDwell >= 20) {
        signals.push({
          packageId: row.id,
          tone: 'watch',
          title: 'Good once discovered; weak entry attraction',
          evidence: `${Math.round(ctr * 100)}% entry rate versus ${Math.round(avgDwell)}s average dwell.`
        });
      }

      if (row.views >= 3 && row.maxDepth <= 25) {
        signals.push({
          packageId: row.id,
          tone: 'watch',
          title: 'Deeper layer rarely reached',
          evidence: `Maximum recorded depth is ${row.maxDepth}% across ${row.views} views.`
        });
      }

      if (row.views >= 2 && relationshipRate >= 0.5) {
        signals.push({
          packageId: row.id,
          tone: 'positive',
          title: 'Connections encourage exploration',
          evidence: `${row.relationshipClicks} relationship follows across ${row.views} views.`
        });
      }

      if (
        row.views >= 2 &&
        row.blockCount >= 2 &&
        blockExposureRate > 0 &&
        blockExposureRate < 0.45
      ) {
        signals.push({
          packageId: row.id,
          tone: 'neutral',
          title: 'Large parts of the composition are being skipped',
          evidence: `About ${Math.round(blockExposureRate * 100)}% of available blocks were exposed per view.`
        });
      }
    }

    return {
      events,
      sessionCount: sessions.size,
      packageRows,
      blockRows: [...blockTypes.entries()].sort((a, b) => b[1] - a[1]),
      signals,
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
          <span>Signals</span>
          <p>
            These are evidence-based heuristics, not scores. They only appear
            after enough usage exists for a pattern to be worth noticing.
          </p>
        </div>
        <div className="sf-stats-signals">
          {data.signals.map((signal, index) => (
            <article
              className={`sf-stats-signal sf-stats-signal-${signal.tone}`}
              key={`${signal.packageId}-${signal.title}-${index}`}
            >
              <span>{signal.packageId}</span>
              <strong>{signal.title}</strong>
              <p>{signal.evidence}</p>
            </article>
          ))}
          {!data.signals.length ? (
            <p className="sf-stats-empty">
              No reliable pattern yet. A few normal browsing sessions will
              create enough evidence for diagnostics.
            </p>
          ) : null}
        </div>
      </section>

      <section className="sf-stats-section">
        <div className="sf-stats-section-title">
          <span>Package engagement</span>
          <p>
            Impressions and entry rate show attraction; dwell and depth show
            whether the experience keeps attention.
          </p>
        </div>
        <div className="sf-stats-table">
          <div className="sf-stats-row sf-stats-row-head">
            <span>Package</span>
            <span>Shown</span>
            <span>Entry</span>
            <span>Views</span>
            <span>Rel.</span>
            <span>Avg dwell</span>
            <span>Depth</span>
          </div>
          {data.packageRows.map((row) => (
            <div className="sf-stats-row sf-stats-row-wide" key={row.id}>
              <strong>{row.id}</strong>
              <span>{row.impressions}</span>
              <span>
                {row.impressions
                  ? `${Math.round(
                      (row.entryClicks / row.impressions) * 100
                    )}%`
                  : '—'}
              </span>
              <span>{row.views}</span>
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

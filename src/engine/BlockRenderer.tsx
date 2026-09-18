import type { CSSProperties } from 'react';
import type {
  StoryBlock,
  StoryPackage,
  StoryWorldManifest,
  MediaAsset
} from '../domain/story';
import { track } from '../analytics/analytics';

interface BlockRendererProps {
  block: StoryBlock;
  pkg: StoryPackage;
  world: StoryWorldManifest;
  onOpenPackage: (id: string) => void;
}

function mediaById(pkg: StoryPackage, id?: string): MediaAsset | undefined {
  if (!id) return undefined;
  return pkg.media?.find((media) => media.id === id);
}

function AssetView({ asset }: { asset: MediaAsset }) {
  if (asset.type === 'image') {
    return (
      <figure className="sf-asset">
        <img
          src={asset.src}
          alt={asset.alt ?? ''}
          loading="lazy"
          style={{
            objectPosition: asset.focalPoint
              ? `${asset.focalPoint.x}% ${asset.focalPoint.y}%`
              : undefined
          }}
        />
        {asset.caption ? <figcaption>{asset.caption}</figcaption> : null}
      </figure>
    );
  }

  if (asset.type === 'video') {
    return (
      <figure className="sf-asset">
        <video src={asset.src} controls preload="metadata" />
        {asset.caption ? <figcaption>{asset.caption}</figcaption> : null}
      </figure>
    );
  }

  if (asset.type === 'audio') {
    return (
      <figure className="sf-audio">
        <audio src={asset.src} controls preload="metadata" />
        {asset.caption ? <figcaption>{asset.caption}</figcaption> : null}
      </figure>
    );
  }

  return (
    <div className="sf-model-fallback">
      <span>3D asset</span>
      <strong>{asset.caption ?? asset.id}</strong>
    </div>
  );
}

function openTarget(
  source: StoryPackage,
  target: StoryPackage,
  label: string,
  onOpenPackage: (id: string) => void
) {
  track('relationship_open', {
    package_id: source.id,
    package_kind: source.kind,
    target_id: target.id,
    target_kind: target.kind,
    relationship_label: label
  });
  onOpenPackage(target.id);
}

function GraphView({
  block
}: {
  block: Extract<StoryBlock, { type: 'graph' }>;
}) {
  const width = 1000;
  const height = 620;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.34;

  const positions = new Map(
    block.nodes.map((node, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / block.nodes.length;
      return [
        node.id,
        {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        }
      ] as const;
    })
  );

  return (
    <div className="sf-graph-wrap">
      <svg
        className="sf-graph"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={block.heading ?? 'Relationship graph'}
      >
        <g className="sf-graph-edges">
          {block.edges.map((edge) => {
            const source = positions.get(edge.source);
            const target = positions.get(edge.target);
            if (!source || !target) return null;

            return (
              <g key={edge.id}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                />
                {edge.label ? (
                  <text
                    x={(source.x + target.x) / 2}
                    y={(source.y + target.y) / 2 - 7}
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>

        <g className="sf-graph-nodes">
          {block.nodes.map((node) => {
            const position = positions.get(node.id)!;
            return (
              <g key={node.id} transform={`translate(${position.x} ${position.y})`}>
                <circle r="34" />
                <circle className="sf-graph-node-core" r="5" />
                <text y="58" textAnchor="middle" className="sf-graph-node-label">
                  {node.label}
                </text>
                {node.kind ? (
                  <text y="76" textAnchor="middle" className="sf-graph-node-kind">
                    {node.kind}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export function BlockRenderer({
  block,
  pkg,
  world,
  onOpenPackage
}: BlockRendererProps) {
  if (block.type === 'hero') {
    const media = mediaById(pkg, block.mediaId);
    return (
      <section className="sf-block sf-hero-block">
        {media ? <AssetView asset={media} /> : null}
        <div className="sf-hero-copy">
          <span>{pkg.kind}</span>
          <h1>{block.title ?? pkg.title}</h1>
          {block.subtitle ? <p>{block.subtitle}</p> : <p>{pkg.summary}</p>}
        </div>
      </section>
    );
  }

  if (block.type === 'prose') {
    return (
      <section className="sf-block sf-prose-block">
        {block.heading ? <h2>{block.heading}</h2> : null}
        <div>
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'quote') {
    return (
      <blockquote className="sf-block sf-quote-block">
        <p>{block.text}</p>
        {block.attribution ? <footer>{block.attribution}</footer> : null}
      </blockquote>
    );
  }

  if (block.type === 'gallery') {
    const assets = block.mediaIds
      .map((id) => mediaById(pkg, id))
      .filter((asset): asset is MediaAsset => Boolean(asset));

    if (!assets.length) return null;

    return (
      <section className="sf-block sf-gallery-block">
        {block.heading ? <h2>{block.heading}</h2> : null}
        <div className="sf-gallery">
          {assets.map((asset) => (
            <AssetView key={asset.id} asset={asset} />
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'annotatedMedia') {
    const asset = mediaById(pkg, block.mediaId);
    if (!asset) return null;

    return (
      <section className="sf-block sf-annotated-block">
        {block.heading ? <h2>{block.heading}</h2> : null}
        <div className="sf-annotated-media">
          <AssetView asset={asset} />
          <div className="sf-annotation-layer">
            {block.annotations.map((annotation, index) => (
              <button
                key={annotation.id}
                type="button"
                className="sf-annotation"
                style={
                  {
                    '--annotation-x': `${annotation.x}%`,
                    '--annotation-y': `${annotation.y}%`
                  } as CSSProperties
                }
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{annotation.title}</strong>
                  {annotation.summary ? <small>{annotation.summary}</small> : null}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (block.type === 'timeline') {
    return (
      <section className="sf-block sf-timeline-block">
        {block.heading ? <h2>{block.heading}</h2> : null}
        <ol>
          {block.items.map((item, index) => (
            <li key={item.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                {item.label ? <small>{item.label}</small> : null}
                <h3>{item.title}</h3>
                {item.summary ? <p>{item.summary}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  if (block.type === 'process') {
    return (
      <section className="sf-block sf-process-block">
        {block.heading ? <h2>{block.heading}</h2> : null}
        <div className="sf-process">
          {block.items.map((item, index) => (
            <article key={item.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              {item.summary ? <p>{item.summary}</p> : null}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'journey') {
    return (
      <section className="sf-block sf-journey-block">
        {block.heading ? <h2>{block.heading}</h2> : null}
        <div className="sf-journey-track">
          {block.stops.map((stop, index) => {
            const target = stop.targetId
              ? world.packages.find((candidate) => candidate.id === stop.targetId)
              : undefined;
            const content = (
              <>
                <span className="sf-journey-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {stop.label ? <small>{stop.label}</small> : null}
                <strong>{stop.title}</strong>
                {stop.summary ? <p>{stop.summary}</p> : null}
              </>
            );

            return target ? (
              <button
                type="button"
                className="sf-journey-stop sf-journey-stop-link"
                key={stop.id}
                onClick={() => openTarget(pkg, target, 'journey', onOpenPackage)}
              >
                {content}
                <i>↗</i>
              </button>
            ) : (
              <article className="sf-journey-stop" key={stop.id}>
                {content}
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  if (block.type === 'comparison') {
    const gridStyle = {
      '--comparison-columns': block.columns.length
    } as CSSProperties;

    return (
      <section className="sf-block sf-comparison-block">
        {block.heading ? <h2>{block.heading}</h2> : null}
        <div className="sf-comparison" style={gridStyle}>
          <div className="sf-comparison-head">
            <span />
            {block.columns.map((column) => (
              <strong key={column.id}>{column.label}</strong>
            ))}
          </div>
          {block.rows.map((row) => (
            <div className="sf-comparison-row" key={row.id}>
              <strong>{row.label}</strong>
              {block.columns.map((column) => (
                <span key={column.id}>{row.values[column.id] ?? '—'}</span>
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'graph') {
    return (
      <section className="sf-block sf-graph-block">
        {block.heading ? <h2>{block.heading}</h2> : null}
        <GraphView block={block} />
      </section>
    );
  }

  const links = (pkg.relationships ?? [])
    .map((relationship) => {
      const target = world.packages.find(
        (candidate) => candidate.id === relationship.targetId
      );
      return target ? { relationship, target } : null;
    })
    .filter((value) => value !== null);

  if (!links.length) return null;

  return (
    <section className="sf-block sf-relationships-block">
      {block.heading ? <h2>{block.heading}</h2> : null}
      <div className="sf-relationship-list">
        {links.map(({ relationship, target }) => (
          <button
            type="button"
            key={relationship.id}
            onClick={() =>
              openTarget(pkg, target, relationship.label, onOpenPackage)
            }
          >
            <span>{relationship.label}</span>
            <strong>{target.title}</strong>
            <small>{target.kind}</small>
            <i>↗</i>
          </button>
        ))}
      </div>
    </section>
  );
}

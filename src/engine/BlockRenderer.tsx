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
            onClick={() => {
              track('relationship_open', {
                package_id: pkg.id,
                package_kind: pkg.kind,
                target_id: target.id,
                target_kind: target.kind,
                relationship_label: relationship.label
              });
              onOpenPackage(target.id);
            }}
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

import type { CSSProperties } from 'react';
import type { StoryworldEntity } from '../domain/types';

interface Props {
  entity: StoryworldEntity;
}

export function AmbientField({ entity }: Props) {
  return (
    <div
      className={`ambient-field ambient-${entity.kind} atmosphere-${entity.visual?.atmosphere ?? 'mysterious'}`}
      aria-hidden="true"
    >
      <div className="ambient-halo ambient-halo-a" />
      <div className="ambient-halo ambient-halo-b" />
      <div className="ambient-orbit ambient-orbit-a" />
      <div className="ambient-orbit ambient-orbit-b" />
      <div className="ambient-horizon" />
      <div className="ambient-core" />
      <div className="ambient-fractures">
        {Array.from({ length: 7 }, (_, index) => (
          <i key={index} style={{ '--i': index } as CSSProperties} />
        ))}
      </div>
      <div className="ambient-particles">
        {Array.from({ length: 14 }, (_, index) => (
          <i key={index} style={{ '--i': index } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}

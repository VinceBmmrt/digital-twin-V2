import type { CSSProperties } from 'react';
import { BENTO_ITEMS } from './constants';
import { Reveal } from './Reveal';
import { SpotlightCard } from './SpotlightCard';

export default function BentoGrid() {
    return (
        <section className="bento-section">
            <div className="bento-heading">
                <div className="bento-eyebrow">
                    <span>{'//'}</span> CAPACITÉS
                </div>
                <h2 className="bento-title">Ce que je construis</h2>
            </div>

            <div className="bento-grid">
                {BENTO_ITEMS.map((item, i) => (
                    <Reveal
                        key={item.area}
                        delay={i * 60}
                        style={{ '--area': item.area, '--accent': item.color } as CSSProperties}
                    >
                        <SpotlightCard className="bento-card">
                            <div className="bento-icon">{item.icon}</div>
                            <div className="bento-card-title">{item.title}</div>
                            <div className="bento-card-body">
                                {item.body.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                            {item.highlights && (
                                <ul className="bento-highlights">
                                    {item.highlights.map((h) => (
                                        <li key={h}>{h}</li>
                                    ))}
                                </ul>
                            )}
                            {item.tags && (
                                <div className="bento-tags">
                                    {item.tags.map((t) => (
                                        <span key={t} className="bento-tag">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </SpotlightCard>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

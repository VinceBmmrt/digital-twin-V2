import type { CSSProperties } from 'react';
import { BENTO_ITEMS } from './constants';

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
                {BENTO_ITEMS.map((item) => (
                    <div
                        key={item.area}
                        className={`bento-card${item.featured ? ' bento-card--featured' : ''}`}
                        style={{ '--area': item.area } as CSSProperties}
                    >
                        <div className="bento-icon">{item.icon}</div>
                        <div className="bento-card-title">{item.title}</div>
                        <p className="bento-card-body">{item.body}</p>
                        {item.tags && (
                            <div className="bento-tags">
                                {item.tags.map((t) => (
                                    <span key={t} className="bento-tag">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

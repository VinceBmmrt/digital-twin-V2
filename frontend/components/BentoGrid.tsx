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
                        className={`bento-card${item.featured ? ' bento-card--featured' : ''}${item.stat ? ' bento-card--stat' : ''}`}
                        style={{ '--area': item.area } as CSSProperties}
                    >
                        {item.stat ? (
                            item.stats?.map((s) => (
                                <div key={s.label}>
                                    <div className="bento-stat-value">{s.value}</div>
                                    <div className="bento-stat-label">{s.label}</div>
                                </div>
                            ))
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

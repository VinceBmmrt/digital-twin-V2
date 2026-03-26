import ReactMarkdown from 'react-markdown';

/* ── Markdown ── */
export function MarkdownContent({ content }: { content: string }) {
    return (
        <div style={{ color: '#9fbdd6', fontSize: '13.5px', lineHeight: 1.75, fontWeight: 300 }}>
            <ReactMarkdown components={{
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#63b3ff', textDecoration: 'underline' }}>{children}</a>,
                p: ({ children }) => <p style={{ margin: '0 0 8px' }}>{children}</p>,
                strong: ({ children }) => <strong style={{ color: '#c8e8ff', fontWeight: 600 }}>{children}</strong>,
                ol: ({ children }) => <ol style={{ paddingLeft: '20px', margin: '6px 0' }}>{children}</ol>,
                ul: ({ children }) => <ul style={{ paddingLeft: '20px', margin: '6px 0' }}>{children}</ul>,
                li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                code: ({ children }) => <code style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px 6px', color: '#63b3ff', fontSize: '0.85em', fontFamily: 'DM Mono, monospace' }}>{children}</code>,
            }}>{content}</ReactMarkdown>
        </div>
    );
}

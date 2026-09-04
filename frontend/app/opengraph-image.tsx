import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#060d18',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        fontSize: 24,
                        color: '#4a7a9b',
                        letterSpacing: 6,
                    }}
                >
                    AI ENGINEER · DIGITAL TWIN
                </div>
                <div
                    style={{
                        display: 'flex',
                        fontSize: 100,
                        fontWeight: 800,
                        color: '#e6f2ff',
                        marginTop: 20,
                    }}
                >
                    VINCENT BOMMERT
                </div>
                <div
                    style={{
                        display: 'flex',
                        fontSize: 30,
                        color: '#63b3ff',
                        marginTop: 24,
                    }}
                >
                    Ingénieur IA · Multi-agents & RAG en production
                </div>
                <div
                    style={{
                        display: 'flex',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 8,
                        background: 'linear-gradient(90deg, #060d18, #63b3ff, #060d18)',
                    }}
                />
            </div>
        ),
        { ...size },
    );
}

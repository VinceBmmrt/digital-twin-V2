import Twin from '@/components/twin';

const SKILLS = [
  'LangChain', 'LangGraph', 'Multi-agents', 'RAG', 'Fine-tuning', 'QLoRA', 'LoRA',
  'OpenAI API', 'Hugging Face', 'CrewAI', 'n8n', 'MCP Servers', 'Ollama',
  'Next.js', 'React', 'TypeScript', 'Python', 'Node.js', 'Spring Boot',
  'PostgreSQL', 'ChromaDB', 'Supabase Vector', 'MongoDB',
  'Docker', 'AWS', 'Vercel', 'Railway', 'Modal GPU',
  'PyTorch', 'Weights & Biases', 'Playwright', 'Redux',
];

export default function Home() {
  return (
    <main className="page-flicker" style={{
      minHeight: '100vh',
      height: '100vh',
      overflow: 'hidden',
      background: '#010603',
      fontFamily: "'IBM Plex Mono', monospace",
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Bebas+Neue&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next { height: 100%; background: #010603; overflow: hidden; }

        @keyframes subtlePulse  { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes fadeUp       { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scrollLeft   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes scanPage     { 0%{top:-2px} 100%{top:calc(100vh + 2px)} }

        @keyframes flicker {
          0%,95%,100%   { opacity:1; }
          96%           { opacity:.6; }
          97%           { opacity:1; }
          98%           { opacity:.4; }
          99%           { opacity:.9; }
        }
        @keyframes nameGlitch {
          0%,100% { text-shadow: 0 0 30px rgba(0,210,80,.35), 0 0 80px rgba(0,210,80,.12); }
          92%     { text-shadow: 0 0 30px rgba(0,210,80,.35), 0 0 80px rgba(0,210,80,.12); }
          93%     { text-shadow: -3px 0 rgba(0,255,80,.8), 3px 0 rgba(0,100,255,.5), 0 0 30px rgba(0,210,80,.5); }
          94%     { text-shadow: 3px 0 rgba(0,255,80,.8), -3px 0 rgba(0,100,255,.5), 0 0 30px rgba(0,210,80,.5); }
          95%     { text-shadow: 0 0 30px rgba(0,210,80,.35), 0 0 80px rgba(0,210,80,.12); }
        }
        @keyframes chatGlow {
          0%,100% { box-shadow: 0 0 0 1px rgba(0,210,80,.03), 0 32px 80px rgba(0,0,0,.75), 0 0 40px rgba(0,210,80,.05); }
          50%     { box-shadow: 0 0 0 1px rgba(0,210,80,.06), 0 32px 80px rgba(0,0,0,.75), 0 0 70px rgba(0,210,80,.09); }
        }

        .f1{animation:fadeUp .55s .05s ease both}
        .f2{animation:fadeUp .55s .18s ease both}
        .f3{animation:fadeUp .55s .30s ease both}
        .f4{animation:fadeUp .55s .42s ease both}

        .page-flicker { animation: flicker 8s step-end infinite; }

        .h1-name {
          animation: nameGlitch 7s step-end infinite;
        }
        .h1-name:hover {
          text-shadow: 0 0 40px rgba(0,210,80,.7), 0 0 100px rgba(0,210,80,.25), 0 0 2px #00d250 !important;
          cursor: default;
        }

        .ticker-wrap:hover .ticker-inner { animation-play-state: paused !important; }

        .chat-window { animation: chatGlow 4s ease-in-out infinite; }

        .skill-tag:hover {
          background: rgba(0,210,80,.1) !important;
          border-color: rgba(0,210,80,.35) !important;
          color: #00d250 !important;
        }
      `}</style>

      {/* ── Background grid ── */}
      <div style={{
        position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
        backgroundImage:`
          linear-gradient(rgba(0,210,80,.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,210,80,.018) 1px, transparent 1px)
        `,
        backgroundSize:'48px 48px',
      }}/>

      {/* ── Glow orbs ── */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-18%',left:'-6%',width:'60vw',height:'60vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,210,80,.05) 0%,transparent 65%)',filter:'blur(70px)'}}/>
        <div style={{position:'absolute',bottom:'-12%',right:'-2%',width:'45vw',height:'45vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,180,80,.035) 0%,transparent 65%)',filter:'blur(55px)'}}/>
      </div>

      {/* ── Page scanline ── */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:1,overflow:'hidden'}}>
        <div style={{
          position:'absolute',left:0,right:0,height:'1px',
          background:'linear-gradient(transparent,rgba(0,210,80,.03),transparent)',
          animation:'scanPage 9s linear infinite'
        }}/>
        <div style={{
          position:'absolute',inset:0,
          backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px)',
        }}/>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        position:'relative', zIndex:10,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'11px 36px',
        borderBottom:'1px solid rgba(0,210,80,.07)',
        background:'rgba(1,6,3,.92)',
        backdropFilter:'blur(14px)',
      }}>
        <div style={{display:'flex',gap:'7px',alignItems:'center'}}>
          {['#ff5f57','#febc2e','#28c840'].map(c=>(
            <div key={c} style={{width:'9px',height:'9px',borderRadius:'50%',background:c,opacity:.5}}/>
          ))}
          <span style={{marginLeft:'14px',fontSize:'9px',color:'#2a6640',letterSpacing:'.13em'}}>
            TWIN-DISTRIBUTION — SESSION ACTIVE
          </span>
        </div>
        <div style={{display:'flex',gap:'22px'}}>
          {[['SYS','NOMINAL'],['AI','ONLINE'],['ENV','PROD']].map(([k,v])=>(
            <span key={k} style={{fontSize:'9px',color:'#2a5c38',letterSpacing:'.1em'}}>
              {k}:<span style={{color:'#00d250'}}>{v}</span>
            </span>
          ))}
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div style={{
        position:'relative', zIndex:5, maxWidth:'960px', margin:'0 auto',
        padding:'24px 28px 16px',
        height:'calc(100vh - 44px)',
        display:'flex', flexDirection:'column',
        overflow:'hidden',
      }}>

        {/* ── IDENTITY BLOCK ── */}
        <div className="f1" style={{marginBottom:'16px', flexShrink:0}}>

          {/* Eyebrow */}
          <div style={{
            display:'flex', alignItems:'center', gap:'10px',
            marginBottom:'12px',
            fontSize:'9px', color:'#2a6640', letterSpacing:'.18em',
          }}>
            <span style={{display:'inline-block',width:'28px',height:'1px',background:'rgba(0,210,80,.3)'}}/>
            AI ENGINEER · DIGITAL TWIN
            <span style={{display:'inline-block',width:'28px',height:'1px',background:'rgba(0,210,80,.3)'}}/>
          </div>

          {/* Name */}
          <h1 className="h1-name" style={{
            fontFamily:"'Bebas Neue',cursive",
            fontSize:'clamp(3rem,6.5vw,5.2rem)',
            color:'#00d250',
            textShadow:'0 0 30px rgba(0,210,80,.35), 0 0 80px rgba(0,210,80,.12)',
            margin:'0 0 6px', letterSpacing:'.08em', lineHeight:1,
          }}>
            VINCENT BOMMERT
          </h1>

          {/* Subtitle + live badge */}
          <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
            <p style={{
              fontSize:'11px', color:'#3a7a50', letterSpacing:'.08em',
              margin:0, fontStyle:'italic', fontWeight:300,
            }}>
              Ingénieur IA · Multi-agents & RAG en production · Fine-tuning LLM
            </p>
            <div style={{display:'flex',alignItems:'center',gap:'5px',flexShrink:0}}>
              <span style={{
                width:'5px',height:'5px',borderRadius:'50%',
                background:'#00d250',boxShadow:'0 0 6px #00d250',
                display:'inline-block',animation:'subtlePulse 2.5s infinite',
              }}/>
              <span style={{fontSize:'8px',color:'#00d250',letterSpacing:'.1em'}}>EN LIGNE</span>
            </div>
          </div>
        </div>

        {/* ── SKILLS TICKER ── */}
        <div className="f2 ticker-wrap" style={{
          marginBottom:'14px',
          flexShrink:0,
          borderTop:'1px solid rgba(0,210,80,.06)',
          borderBottom:'1px solid rgba(0,210,80,.06)',
          padding:'7px 0',
          overflow:'hidden',
          position:'relative',
        }}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:'50px',background:'linear-gradient(90deg,#010603,transparent)',zIndex:1,pointerEvents:'none'}}/>
          <div style={{position:'absolute',right:0,top:0,bottom:0,width:'50px',background:'linear-gradient(270deg,#010603,transparent)',zIndex:1,pointerEvents:'none'}}/>
          <div className="ticker-inner" style={{
            display:'flex', gap:'8px',
            animation:'scrollLeft 30s linear infinite',
            width:'max-content',
          }}>
            {[...SKILLS,...SKILLS].map((s,i)=>(
              <span key={`${s}-${i}`} className="skill-tag" style={{
                padding:'3px 11px',
                border:'1px solid rgba(0,210,80,.12)',
                borderRadius:'2px',
                fontSize:'9px',color:'#3a8c55',letterSpacing:'.1em',
                whiteSpace:'nowrap',cursor:'default',
                transition:'all .15s',
                background:'rgba(0,210,80,.02)',
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* ── CHAT WINDOW ── */}
        <div className="f3 chat-window" style={{
          flex: 1,
          minHeight: 0,
          borderRadius:'3px',
          overflow:'hidden',
          border:'1px solid rgba(0,210,80,.1)',
          boxShadow:'0 0 0 1px rgba(0,210,80,.03), 0 32px 80px rgba(0,0,0,.75), 0 0 60px rgba(0,210,80,.05)',
          position:'relative',
        }}>
          <Twin />
        </div>

        {/* ── FOOTER ── */}
        <div className="f4" style={{
          marginTop:'10px',
          flexShrink:0,
          display:'flex',justifyContent:'space-between',alignItems:'center',
          paddingTop:'12px',
          borderTop:'1px solid rgba(0,210,80,.05)',
        }}>
          <span style={{fontSize:'8px',color:'#2a6640',letterSpacing:'.1em'}}>
            © 2025 VINCENT BOMMERT — TWIN-DISTRIBUTION
          </span>
          <div style={{display:'flex',gap:'14px'}}>
            {['LLM','RAG','MLOPS','CLOUD'].map(t=>(
              <span key={t} style={{fontSize:'8px',color:'#2a6640',letterSpacing:'.1em'}}>{t}</span>
            ))}
          </div>
          <span style={{fontSize:'8px',color:'#2a6640',letterSpacing:'.1em'}}>
            POWERED BY ANTHROPIC
          </span>
        </div>

      </div>
    </main>
  );
}
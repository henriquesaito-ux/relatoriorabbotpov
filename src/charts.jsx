// Hand-rolled SVG charts (radar + line) — animated on mount
const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

// Radar chart: 4 axes, value 0..5
function RadarChart({ data, size = 360 }) {
  const pad = 60;
  const full = size + pad * 2;
  const cx = full / 2, cy = full / 2;
  const R = size * 0.38;
  const levels = 5;
  const axes = data.length;
  const angle = (i) => (Math.PI * 2 * i) / axes - Math.PI / 2;

  const ref = useRefC(null);
  const [animated, setAnimated] = useStateC(0);
  useEffectC(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const start = performance.now();
          const dur = 1000;
          const tick = (t) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setAnimated(eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const pointAt = (i, v) => {
    const r = R * (v / levels);
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };

  const gridPolys = Array.from({ length: levels }, (_, li) => {
    const lv = li + 1;
    const pts = Array.from({ length: axes }, (_, i) => pointAt(i, lv).join(',')).join(' ');
    return <polygon key={li} points={pts} fill="none" stroke="#e2e8f0" strokeWidth="1" />;
  });
  const axesLines = Array.from({ length: axes }, (_, i) => {
    const [x, y] = pointAt(i, levels);
    return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
  });
  const dataPts = data.map((d, i) => pointAt(i, d.value * animated).join(',')).join(' ');
  const labels = data.map((d, i) => {
    const [x, y] = pointAt(i, levels + 0.8);
    let anchor = 'middle';
    if (x < cx - 5) anchor = 'end';
    else if (x > cx + 5) anchor = 'start';
    return (
      <text key={i} x={x} y={y} textAnchor={anchor} dominantBaseline="middle"
            fontSize="11" fontWeight="500" fill="#64748b">
        {d.label}
      </text>
    );
  });

  return (
    <svg ref={ref} viewBox={`0 0 ${full} ${full}`} className="w-full max-w-[420px] mx-auto">
      {gridPolys}
      {axesLines}
      <polygon points={dataPts} fill="#059669" fillOpacity="0.14" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round" />
      {data.map((d, i) => {
        const [x, y] = pointAt(i, d.value * animated);
        return <circle key={i} cx={x} cy={y} r="3" fill="#059669" stroke="#fff" strokeWidth="1.5" />;
      })}
      {labels}
      {Array.from({ length: levels }, (_, i) => {
        const [, y] = pointAt(0, i + 1);
        return <text key={i} x={cx + 4} y={y - 2} fontSize="10" fill="#94a3b8">{i + 1}</text>;
      })}
    </svg>
  );
}

// Line chart for projection — cumulative
function LineChart({ data, width = 720, height = 260, format = v => v }) {
  const pad = { top: 20, right: 24, bottom: 32, left: 56 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;
  const maxY = Math.max(...data.map(d => d.acum)) * 1.1;
  const x = (i) => pad.left + (i / (data.length - 1)) * W;
  const y = (v) => pad.top + H - (v / maxY) * H;

  const ref = useRefC(null);
  const [animated, setAnimated] = useStateC(0);
  useEffectC(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / 900);
            setAnimated(1 - Math.pow(1 - p, 3));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffectC(() => {
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / 400);
      setAnimated(p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [data]);

  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.acum * animated)}`).join(' ');
  const area = `${path} L ${x(data.length - 1)} ${pad.top + H} L ${x(0)} ${pad.top + H} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => ({ v: t * maxY, y: y(t * maxY) }));

  const [hover, setHover] = useStateC(null);

  return (
    <div className="relative">
      <svg ref={ref} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto"
           onMouseLeave={() => setHover(null)}
           onMouseMove={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const scale = width / rect.width;
             const mx = (e.clientX - rect.left) * scale;
             const idx = Math.round(((mx - pad.left) / W) * (data.length - 1));
             if (idx >= 0 && idx < data.length) setHover(idx);
           }}>
        <defs>
          <linearGradient id="area-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.left} x2={pad.left + W} y1={t.y} y2={t.y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={pad.left - 8} y={t.y} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="#94a3b8">
              {format(t.v)}
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <text key={i} x={x(i)} y={height - 10} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.mes}</text>
        ))}
        <path d={area} fill="url(#area-grad)" />
        <path d={path} fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + H} stroke="#059669" strokeDasharray="3 3" strokeWidth="1" />
            <circle cx={x(hover)} cy={y(data[hover].acum * animated)} r="4" fill="#059669" stroke="#fff" strokeWidth="1.5" />
          </g>
        )}
      </svg>
      {hover !== null && (
        <div className="absolute pointer-events-none bg-stone-900 text-white text-xs px-2.5 py-1.5 rounded-md"
             style={{ left: `calc(${(x(hover) / width) * 100}% + 8px)`, top: `${(y(data[hover].acum * animated) / height) * 100}%`, transform: 'translate(0, -100%)' }}>
          <div className="font-medium">{data[hover].mes}</div>
          <div className="text-brand-200 tabular-nums">{format(data[hover].acum)}</div>
        </div>
      )}
    </div>
  );
}

// Simple line trend for checklist weekly
function MiniLine({ data, width = 600, height = 180 }) {
  const pad = { top: 16, right: 16, bottom: 28, left: 32 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;
  const maxY = Math.max(...data.map(d => d.n)) * 1.2;
  const x = (i) => pad.left + (i / (data.length - 1)) * W;
  const y = (v) => pad.top + H - (v / maxY) * H;
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.n)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {[0, 0.5, 1].map((t, i) => (
        <line key={i} x1={pad.left} x2={pad.left + W} y1={pad.top + H - t * H} y2={pad.top + H - t * H} stroke="#f1f5f9" />
      ))}
      {data.map((d, i) => (
        <text key={`l${i}`} x={x(i)} y={height - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.week}</text>
      ))}
      <path d={path} fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.n)} r="3" fill="#fff" stroke="#059669" strokeWidth="1.5" />
          <text x={x(i)} y={y(d.n) - 9} textAnchor="middle" fontSize="10" fontWeight="500" fill="#0f172a">{d.n}</text>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, { RadarChart, LineChart, MiniLine });

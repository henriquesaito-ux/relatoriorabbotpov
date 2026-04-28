// Reusable UI primitives + hooks
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Reveal-on-scroll wrapper
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const el = ref.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add('in'), delay);
          setSeen(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [delay, seen]);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

// Stagger children (Reveal with incrementing delay)
function Stagger({ children, step = 80, base = 0, className = '' }) {
  const arr = React.Children.toArray(children);
  return (
    <>
      {arr.map((child, i) => (
        <Reveal key={i} delay={base + i * step} className={className}>{child}</Reveal>
      ))}
    </>
  );
}

// Count-up hook: animates from 0 to target when ref enters viewport
function useCountUp(target, { duration = 1200, decimals = 0 } = {}) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const from = 0;
          const to = target;
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(from + (to - from) * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return [ref, decimals ? val.toFixed(decimals) : Math.round(val)];
}

function CountNumber({ value, prefix = '', suffix = '', format = (n) => n.toLocaleString('pt-BR'), className = '' }) {
  const [ref, v] = useCountUp(value);
  return <span ref={ref} className={className}>{prefix}{format(v)}{suffix}</span>;
}

// Pill / Badge
function Pill({ children, tone = 'neutral', className = '', icon = null }) {
  const tones = {
    neutral: 'bg-stone-100 text-stone-700',
    brand: 'bg-brand-50 text-brand-700',
    green: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
    dark: 'bg-stone-900 text-white',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${tones[tone]} ${className}`}>
      {icon}{children}
    </span>
  );
}

// Avatar
function Avatar({ name, size = 40, className = '' }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-stone-100 text-stone-700 font-medium shrink-0 ${className}`}
         style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {initials}
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle, children, anchor }) {
  return (
    <div id={anchor} className="scroll-mt-20 mb-8">
      {eyebrow && (
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-stone-300" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted">{eyebrow}</span>
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-[1.15] text-ink">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-subink max-w-2xl leading-relaxed">{subtitle}</p>}
      {children}
    </div>
  );
}

function Card({ children, className = '', hover = false, grad = false, as: As = 'div', ...rest }) {
  const base = grad
    ? 'card-grad border border-stone-200/70'
    : 'bg-white border border-stone-200/70';
  return (
    <As className={`${base} rounded-xl ${hover ? 'card-hover' : ''} ${className}`} {...rest}>
      {children}
    </As>
  );
}

// Placeholder image block (striped)
function Placeholder({ label, ratio = '4/3', className = '', dark = false, rounded = 'rounded-lg' }) {
  return (
    <div className={`${dark ? 'ph-stripe-dark' : 'ph-stripe'} ${rounded} relative overflow-hidden ${className}`}
         style={{ aspectRatio: ratio }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500 bg-white/85 border border-stone-200/70 rounded px-1.5 py-0.5">
          {label}
        </span>
      </div>
    </div>
  );
}

function Section({ id, children, className = '', tight = false }) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 md:px-8 ${tight ? 'py-10 md:py-12' : 'py-12 md:py-16'} ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

// Editorial divider
function DotDivider({ className = '' }) {
  return (
    <div className={`flex justify-center py-8 ${className}`}>
      <div className="flex gap-1.5">
        <span className="h-1 w-1 rounded-full bg-stone-300" />
        <span className="h-1 w-1 rounded-full bg-stone-300" />
        <span className="h-1 w-1 rounded-full bg-stone-300" />
      </div>
    </div>
  );
}

function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="94" height="15" viewBox="0 0 94 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M87.9836 2.37005L76.8169 0.80835C78.4369 3.31478 87.9836 2.37005 87.9836 2.37005Z" fill="#67CF6A"/>
        <path d="M88.6588 2.75586C88.6588 2.75586 81.87 7.51807 75.3899 5.53221L88.6588 2.75586Z" fill="#67CF6A"/>
        <path d="M85.1679 5.85997C78.6878 9.04121 76.7977 12.3767 76.7977 12.3767C84.6665 6.11061 91.2816 6.72758 91.2816 6.72758C91.2816 6.72758 90.4138 5.66717 88.6201 5.35869C88.6201 5.35869 90.7416 5.32013 91.5324 4.60676C92.2845 3.93195 92.0917 3.14146 91.2816 2.75586H93.3838C94.136 5.20445 89.9702 5.35869 89.9702 5.35869C93.2874 6.01421 93.731 8.69416 93.731 8.69416C83.8179 7.55663 74.4448 14.9988 74.4448 14.9988C77.2799 8.40496 85.1679 5.85997 85.1679 5.85997Z" fill="#67CF6A"/>
        <path d="M54.7148 3.23877C51.7255 3.23877 49.5461 5.26319 49.5461 8.03954C49.5461 10.8159 51.7255 12.8403 54.7148 12.8403C57.7042 12.8403 59.8835 10.8159 59.8835 8.03954C59.8835 5.26319 57.7042 3.23877 54.7148 3.23877ZM54.7148 10.7388C52.8634 10.7388 51.6676 9.67836 51.6676 8.03954C51.6676 6.40072 52.8634 5.34031 54.7148 5.34031C56.5663 5.34031 57.762 6.40072 57.762 8.03954C57.762 9.67836 56.5663 10.7388 54.7148 10.7388Z" fill="currentColor"/>
        <path d="M30.3757 3.23907C29.045 3.23907 27.8492 3.62468 26.8849 4.26093V0H24.7441V12.8599L30.5107 12.8406C33.5001 12.8406 35.6794 10.8162 35.6794 8.03985C35.6794 5.24422 33.4422 3.23907 30.3757 3.23907ZM30.5107 10.7391H26.8849V8.19409C26.8849 7.46144 27.1935 6.72879 27.7528 6.24679C28.3892 5.68766 29.315 5.3599 30.3757 5.3599C32.2465 5.3599 33.5579 6.45887 33.5579 8.05913C33.5579 9.67866 32.3622 10.7391 30.5107 10.7391Z" fill="currentColor"/>
        <path d="M42.9116 3.23907C41.5808 3.23907 40.3851 3.62468 39.4208 4.26093V0H37.28V12.8599L43.0466 12.8406C46.0359 12.8406 48.2153 10.8162 48.2153 8.03985C48.2153 5.2635 45.9781 3.23907 42.9116 3.23907ZM43.0273 10.7391H39.4015V8.19409C39.4015 7.46144 39.7101 6.72879 40.2694 6.24679C40.9058 5.68766 41.8316 5.3599 42.8923 5.3599C44.7631 5.3599 46.0745 6.45887 46.0745 8.05913C46.0938 9.67866 44.8981 10.7391 43.0273 10.7391Z" fill="currentColor"/>
        <path d="M9.66236 6.40104C10.0095 5.84191 10.2024 5.18639 10.2024 4.47302C10.2024 2.41004 8.52448 0.713379 6.44158 0.713379H0V12.8599H2.14076V8.23266C2.14076 8.23266 4.30081 8.23266 5.05297 8.23266L8.0809 12.8599H10.646L7.48303 8.03986C8.37019 7.78921 9.16092 7.21081 9.66236 6.40104ZM2.14076 2.87276H6.42229C7.30945 2.87276 8.02304 3.58613 8.02304 4.47302C8.02304 5.35991 7.30945 6.07328 6.42229 6.07328H2.14076V2.87276Z" fill="currentColor"/>
        <path d="M11.6104 8.17576C11.6104 10.9714 13.7897 13.0151 16.8176 13.0151C18.1676 13.0151 19.4212 12.4752 20.4434 11.5884V12.8608H22.5649V3.33643H16.8176C13.7897 3.33643 11.6104 5.38013 11.6104 8.17576ZM20.4241 6.92254C20.4241 9.17833 18.5148 10.8557 16.7983 10.8557C14.9469 10.8557 13.7511 9.7953 13.7511 8.17576C13.7511 6.55622 14.9469 5.49581 16.7983 5.49581H20.4241V6.92254Z" fill="currentColor"/>
        <path d="M66.6723 5.49486V3.35476H63.4516V0H61.3108V7.51928C61.3108 10.4692 63.7023 12.8599 66.6531 12.8599V10.7198C64.8787 10.7198 63.4516 9.29306 63.4516 7.51928V5.49486H66.6723Z" fill="currentColor"/>
      </svg>
    </div>
  );
}

Object.assign(window, {
  Reveal, Stagger, useCountUp, CountNumber, Pill, Avatar,
  SectionHeader, Card, Placeholder, Section, DotDivider, Logo,
});

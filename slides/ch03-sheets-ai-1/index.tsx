import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  Step,
  Steps,
  useSlidePageNumber,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, useState } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#f2f6f2', text: '#18291e', accent: '#1f6b43' },
  fonts: {
    display: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
    body: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 20,
};

// 額外色票（不在 DesignSystem 範圍內）
const C = {
  muted: '#4c5e52',
  line: '#d3e0d6',
  panel: '#e3ede5',
  berry: '#a8402a',
  dark: '#132219',
  darkText: '#f2f6f2',
  darkMuted: '#b8cdbf',
  gold: '#e8bf5a',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Sans+Mono:wght@500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-ch03-sheets-ai-1';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

const serif = 'var(--osd-font-display)';
const mono = '"Noto Sans Mono", Consolas, "Noto Sans TC", "Microsoft JhengHei", monospace';

/* ---------- 共用元件 ---------- */

const Footer = ({ dark }: { dark?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        bottom: 40,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 24,
        color: dark ? C.darkMuted : C.muted,
      }}
    >
      <span>CH03｜Google Sheets AI 活用術（上）</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 4 },
  { name: '3-1 看懂公式', from: 5, to: 11 },
  { name: '3-2 說需求', from: 12, to: 18 },
  { name: '3-3 舉一反三', from: 19, to: 26 },
  { name: '3-4 自動標色', from: 27, to: 33 },
  { name: '3-5 截圖提問', from: 34, to: 39 },
  { name: '3-6 實作', from: 40, to: 46 },
  { name: '收尾', from: 47, to: 50 },
];

const ProgressBar = ({ dark }: { dark?: boolean }) => {
  const { current } = useSlidePageNumber();
  if (current === 1) return null;
  const active = CHAPTERS.findIndex((c) => current >= c.from && current <= c.to);
  return (
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        top: 28,
        display: 'flex',
        gap: 14,
      }}
    >
      {CHAPTERS.map((c, i) => {
        const len = c.to - c.from + 1;
        const fill = current > c.to ? 1 : current < c.from ? 0 : (current - c.from + 1) / len;
        const on = i === active;
        return (
          <div key={c.name} style={{ flex: len }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: on ? 700 : 400,
                color: on ? (dark ? C.gold : 'var(--osd-accent)') : dark ? C.darkMuted : C.muted,
                marginBottom: 8,
                whiteSpace: 'nowrap',
              }}
            >
              {c.name}
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: dark ? 'rgba(255,255,255,0.22)' : C.line,
              }}
            >
              <div
                style={{
                  width: `${fill * 100}%`,
                  height: '100%',
                  borderRadius: 3,
                  background: dark ? C.gold : 'var(--osd-accent)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Slide = ({
  dark,
  center,
  children,
}: {
  dark?: boolean;
  center?: boolean;
  children: ReactNode;
}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: dark ? C.dark : 'var(--osd-bg)',
      color: dark ? C.darkText : 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '96px 140px 110px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: center ? 'center' : 'flex-start',
      WebkitFontSmoothing: 'antialiased',
    }}
  >
    <ProgressBar dark={dark} />
    {children}
    <Footer dark={dark} />
  </div>
);

const Eyebrow = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <div
    style={{
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: '0.12em',
      color: dark ? C.gold : 'var(--osd-accent)',
      marginBottom: 20,
    }}
  >
    {children}
  </div>
);

const H = ({
  children,
  size = 72,
  dark,
  style,
}: {
  children: ReactNode;
  size?: number;
  dark?: boolean;
  style?: CSSProperties;
}) => (
  <h2
    style={{
      fontFamily: serif,
      fontSize: size + 8,
      fontWeight: 700,
      lineHeight: 1.25,
      margin: 0,
      color: dark ? C.darkText : 'var(--osd-text)',
      ...style,
    }}
  >
    {children}
  </h2>
);

const Tag = ({ children = '延伸建議' }: { children?: ReactNode }) => (
  <span
    style={{
      display: 'inline-block',
      fontSize: 28,
      fontWeight: 700,
      color: 'var(--osd-accent)',
      border: '2px solid var(--osd-accent)',
      borderRadius: 999,
      padding: '2px 16px',
      marginLeft: 16,
      verticalAlign: 'middle',
      letterSpacing: '0.04em',
    }}
  >
    {children}
  </span>
);

const Note = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 30, color: C.muted, marginTop: 28 }}>{children}</div>
);

// 標題下方的內容區：吃掉剩餘高度並垂直置中，避免頁面下半部留白
const Body = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingBottom: 16,
      ...style,
    }}
  >
    {children}
  </div>
);

const Card = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      background: C.panel,
      borderRadius: 'var(--osd-radius)',
      padding: '32px 40px',
      ...style,
    }}
  >
    {children}
  </div>
);

const Row = ({ n, children }: { n: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
    <div
      style={{
        flex: 'none',
        width: 88,
        height: 88,
        borderRadius: 999,
        background: 'var(--osd-accent)',
        color: C.darkText,
        fontFamily: serif,
        fontSize: 48,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div style={{ fontSize: 50, lineHeight: 1.45 }}>{children}</div>
  </div>
);


/* ---------- 共用頁面零件（所有簡報相同） ---------- */

const GroupBox = ({ tag, title, items }: { tag: string; title: string; items: string[] }) => (
  <div
    style={{
      flex: 1,
      background: C.panel,
      borderRadius: 'var(--osd-radius)',
      padding: '44px 36px',
    }}
  >
    <div
      style={{ fontSize: 34, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.1em' }}
    >
      {tag}
    </div>
    <div style={{ fontFamily: serif, fontSize: 64, fontWeight: 700, margin: '12px 0 28px' }}>
      {title}
    </div>
    {items.map((t) => (
      <div key={t} style={{ fontSize: 40, lineHeight: 1.6, whiteSpace: 'nowrap' }}>
        {t}
      </div>
    ))}
  </div>
);

const Chapter = ({ no, title, sub }: { no: string; title: string; sub: string }) => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', gap: 80 }}>
      <div
        style={{
          fontFamily: serif,
          fontSize: 300,
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--osd-accent)',
        }}
      >
        {no}
      </div>
      <div>
        <H size={112}>{title}</H>
        <div style={{ fontSize: 44, color: C.muted, marginTop: 24 }}>{sub}</div>
      </div>
    </div>
  </Slide>
);

const Summary = ({ label, line }: { label: string; line: string }) => (
  <Slide dark center>
    <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>
      {label}
    </div>
    <H size={104} dark style={{ marginTop: 28, lineHeight: 1.3 }}>
      {line}
    </H>
  </Slide>
);

const Q = ({ n, children }: { n: string; children: ReactNode }) => (
  <Card style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '44px 40px' }}>
    <div style={{ fontFamily: serif, fontSize: 88, fontWeight: 700, color: 'var(--osd-accent)' }}>
      {n}
    </div>
    <div style={{ fontSize: 46, lineHeight: 1.4 }}>{children}</div>
  </Card>
);

const Col = ({ tag, title, body }: { tag: string; title: string; body: string }) => (
  <div
    style={{
      flex: 1,
      background: C.panel,
      borderRadius: 'var(--osd-radius)',
      padding: '52px 40px',
    }}
  >
    <div
      style={{
        fontFamily: serif,
        fontSize: 44,
        fontWeight: 700,
        color: C.darkText,
        background: 'var(--osd-accent)',
        display: 'inline-block',
        padding: '4px 28px',
        borderRadius: 999,
      }}
    >
      {tag}
    </div>
    <div
      style={{
        fontFamily: serif,
        fontSize: 58,
        fontWeight: 700,
        margin: '32px 0 20px',
        lineHeight: 1.3,
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: 40, lineHeight: 1.6, color: C.muted, whiteSpace: 'pre-line' }}>
      {body}
    </div>
  </div>
);

const TRow = ({ who, how, last }: { who: string; how: string; last?: boolean }) => (
  <div
    style={{
      display: 'flex',
      gap: 48,
      padding: '28px 0',
      borderBottom: last ? 'none' : `2px solid ${C.line}`,
      fontSize: 42,
      lineHeight: 1.45,
    }}
  >
    <div style={{ flex: '0 0 480px', fontWeight: 700, color: 'var(--osd-accent)' }}>{who}</div>
    <div style={{ flex: 1 }}>{how}</div>
  </div>
);

// 翻牌卡：點一下，以 3D 旋轉翻到背面（需在播放模式 F 才點得動）
const FACE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 32,
  padding: '0 44px',
  borderRadius: 'var(--osd-radius)',
  fontSize: 44,
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
};

const Flip = ({
  front,
  back,
  hint = '點一下看答案',
  h = 128,
}: {
  front: string;
  back: string;
  hint?: string;
  h?: number;
}) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      data-osd-interactive
      onClick={() => setFlipped((f) => !f)}
      style={{ perspective: 1400, cursor: 'pointer', height: h }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)',
          transform: flipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
        }}
      >
        <div style={{ ...FACE, background: C.panel }}>
          <div style={{ flex: 1, fontWeight: 700 }}>{front}</div>
          <div style={{ fontSize: 30, color: C.muted }}>{hint}</div>
        </div>
        <div
          style={{
            ...FACE,
            background: C.dark,
            color: C.darkText,
            transform: 'rotateX(180deg)',
          }}
        >
          <div style={{ flex: '0 0 640px', fontWeight: 700, fontSize: 40, lineHeight: 1.2 }}>{front}</div>
          <div style={{ color: C.gold, fontSize: 48 }}>→</div>
          <div style={{ flex: 1, fontSize: 38, lineHeight: 1.2 }}>{back}</div>
        </div>
      </div>
    </div>
  );
};

const Chip = ({ children, strong }: { children: ReactNode; strong?: boolean }) => (
  <div
    style={{
      background: strong ? C.dark : C.panel,
      color: strong ? C.darkText : 'var(--osd-text)',
      borderRadius: 999,
      padding: '14px 36px',
      fontSize: 42,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

const Arrow = () => <div style={{ fontSize: 44, color: 'var(--osd-accent)' }}>→</div>;

const Pair = ({
  tag,
  title,
  lines,
  tagExtra,
}: {
  tag: string;
  title: string;
  lines: ReactNode[];
  tagExtra?: boolean;
}) => (
  <Card style={{ flex: 1, padding: '44px 44px' }}>
    <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.08em' }}>
      {tag}
      {tagExtra ? <Tag /> : null}
    </div>
    <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700, margin: '12px 0 24px', lineHeight: 1.3 }}>
      {title}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 40, lineHeight: 1.5 }}>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  </Card>
);

const Vote = ({ n, children }: { n: string; children: ReactNode }) => (
  <Card style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '22px 40px' }}>
    <div style={{ fontFamily: serif, fontSize: 68, fontWeight: 700, color: 'var(--osd-accent)' }}>{n}</div>
    <div style={{ fontSize: 48 }}>{children}</div>
  </Card>
);

const T3 = ({
  a,
  b,
  c,
  head,
  warn,
  cols = '300px 1fr 1fr',
}: {
  a: string;
  b: string;
  c: string;
  head?: boolean;
  warn?: boolean;
  cols?: string;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: cols,
      gap: 32,
      padding: '18px 0',
      borderBottom: `2px solid ${C.line}`,
      fontSize: head ? 40 : 38,
      fontWeight: head ? 700 : 400,
      color: head ? 'var(--osd-accent)' : 'var(--osd-text)',
      lineHeight: 1.4,
    }}
  >
    <div style={{ fontWeight: 700, color: head ? 'var(--osd-accent)' : C.muted }}>{a}</div>
    <div>{b}</div>
    <div style={{ color: warn ? C.berry : undefined, fontWeight: warn ? 700 : head ? 700 : 400 }}>{c}</div>
  </div>
);


const ChgRow = ({ n, title, line }: { n: string; title: string; line: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 36,
      background: C.panel,
      borderRadius: 'var(--osd-radius)',
      padding: '30px 44px',
    }}
  >
    <div
      style={{
        flex: 'none',
        width: 88,
        height: 88,
        borderRadius: 999,
        background: 'var(--osd-accent)',
        color: C.darkText,
        fontFamily: serif,
        fontSize: 50,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div>
      <div style={{ fontFamily: serif, fontSize: 48, fontWeight: 700, lineHeight: 1.3 }}>
        {title}
      </div>
      <div style={{ fontSize: 38, lineHeight: 1.5, color: C.muted, marginTop: 6 }}>{line}</div>
    </div>
  </div>
);


const T2 = ({ a, b, head, warn }: { a: string; b: string; head?: boolean; warn?: boolean }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '380px 1fr',
      gap: 32,
      padding: '22px 0',
      borderBottom: `2px solid ${C.line}`,
      fontSize: head ? 40 : 40,
      fontWeight: head ? 700 : 400,
      color: head ? 'var(--osd-accent)' : 'var(--osd-text)',
      lineHeight: 1.45,
    }}
  >
    <div style={{ fontWeight: 700, color: head ? 'var(--osd-accent)' : C.muted }}>{a}</div>
    <div style={{ color: warn ? C.berry : undefined, fontWeight: warn ? 700 : undefined }}>{b}</div>
  </div>
);


/* ---------- AI 職場應用班 共用元件（ai-kit-parts） ---------- */

// 把【 】標成強調色：學員要自己換掉的部分
const Fill = ({ text }: { text: string }) => (
  <>
    {text.split(/(【[^】]*】)/).map((s, i) =>
      s.startsWith('【') ? (
        <span key={i} style={{ color: 'var(--osd-accent)', fontWeight: 700 }}>
          {s}
        </span>
      ) : (
        <span key={i}>{s}</span>
      ),
    )}
  </>
);

// 提示詞框：等寬字、外框、標籤「提示詞」；一行一個字串，最多 10 行
const Prompt = ({
  lines,
  label = '提示詞',
  size = 34,
  style,
}: {
  lines: string[];
  label?: string;
  size?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: 'relative',
      border: '3px solid var(--osd-accent)',
      borderRadius: 'var(--osd-radius)',
      background: C.panel,
      padding: '44px 44px 32px',
      marginTop: 22,
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: -24,
        left: 32,
        background: 'var(--osd-accent)',
        color: C.darkText,
        fontSize: 28,
        fontWeight: 700,
        padding: '4px 22px',
        borderRadius: 999,
        letterSpacing: '0.08em',
      }}
    >
      {label}
    </div>
    <div style={{ fontFamily: mono, fontSize: size, lineHeight: 1.55 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ minHeight: '1em' }}>
          <Fill text={l} />
        </div>
      ))}
    </div>
  </div>
);

// 公式框：單行或多行公式
const Formula = ({
  children,
  label,
  size = 38,
  style,
}: {
  children: ReactNode;
  label?: string;
  size?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      background: C.dark,
      color: C.darkText,
      borderRadius: 'var(--osd-radius)',
      padding: '26px 40px',
      fontFamily: mono,
      fontSize: size,
      lineHeight: 1.5,
      ...style,
    }}
  >
    {label ? (
      <div style={{ fontFamily: 'var(--osd-font-body)', fontSize: 28, color: C.gold, fontWeight: 700, marginBottom: 6 }}>
        {label}
      </div>
    ) : null}
    {children}
  </div>
);

// 截圖待補：虛線佔位框，寫明要截什麼畫面
const ShotTodo = ({ what, w, h }: { what: string; w?: number | string; h?: number | string }) => (
  <div
    style={{
      width: w ?? '100%',
      height: h ?? '100%',
      border: `4px dashed ${C.muted}`,
      borderRadius: 'var(--osd-radius)',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 32,
      textAlign: 'center',
      color: C.muted,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '0.1em' }}>截圖待補</div>
    <div style={{ fontSize: 30, lineHeight: 1.4 }}>{what}</div>
  </div>
);

// 截圖：點一下放大（燈箱），放大後可捲動；再點一下關閉
const Shot = ({
  src,
  w,
  h,
  fit = 'contain',
  zoom = true,
}: {
  src: string;
  w?: number | string;
  h?: number | string;
  fit?: 'contain' | 'cover';
  zoom?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        data-osd-interactive={zoom ? true : undefined}
        onClick={() => zoom && setOpen(true)}
        style={{
          width: w ?? '100%',
          height: h ?? '100%',
          borderRadius: 12,
          overflow: 'hidden',
          border: `3px solid ${C.line}`,
          background: '#ffffff',
          cursor: zoom ? 'zoom-in' : 'default',
        }}
      >
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: fit, objectPosition: 'top', display: 'block' }} />
      </div>
      {open ? (
        <div
          data-osd-interactive
          onClick={() => setOpen(false)}
          onWheel={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.82)',
            overflowY: 'auto',
            padding: 60,
            cursor: 'zoom-out',
          }}
        >
          <img src={src} alt="" style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }} />
        </div>
      ) : null}
    </>
  );
};

// 小標籤：預期結果、原文、補充 等
const Pill = ({ children, warn }: { children: ReactNode; warn?: boolean }) => (
  <span
    style={{
      display: 'inline-block',
      fontSize: 28,
      fontWeight: 700,
      color: C.darkText,
      background: warn ? C.berry : 'var(--osd-accent)',
      borderRadius: 999,
      padding: '4px 20px',
      letterSpacing: '0.06em',
    }}
  >
    {children}
  </span>
);

// 通用表格：cols 用 CSS grid 欄寬
const Grid = ({
  cols,
  rows,
  size = 36,
  warnCol,
}: {
  cols: string;
  rows: string[][];
  size?: number;
  warnCol?: number;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {rows.map((r, i) => (
      <div
        key={i}
        style={{
          display: 'grid',
          gridTemplateColumns: cols,
          gap: 24,
          padding: '16px 8px',
          borderBottom: `2px solid ${C.line}`,
          fontSize: size,
          lineHeight: 1.4,
          fontWeight: i === 0 ? 700 : 400,
          color: i === 0 ? 'var(--osd-accent)' : 'var(--osd-text)',
        }}
      >
        {r.map((c, j) => (
          <div key={j} style={{ color: i > 0 && j === warnCol && c ? C.berry : undefined, fontWeight: i > 0 && j === warnCol && c ? 700 : undefined }}>
            {c}
          </div>
        ))}
      </div>
    ))}
  </div>
);

// 檢核清單的一項
const CheckItem = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 44, lineHeight: 1.4 }}>
    <div
      style={{
        flex: 'none',
        width: 56,
        height: 56,
        borderRadius: 12,
        border: '4px solid var(--osd-accent)',
      }}
    />
    <div>{children}</div>
  </div>
);

// 單元章節頁（AI 班）：單元編號＋標題＋一句學習目標
const Unit = ({ no, title, goal, time }: { no: string; title: string; goal: string; time?: string }) => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', gap: 72 }}>
      <div style={{ fontSize: 220, fontWeight: 900, lineHeight: 1, color: 'var(--osd-accent)', fontFamily: serif, whiteSpace: 'nowrap', flex: 'none' }}>
        {no}
      </div>
      <div>
        <H size={96}>{title}</H>
        <div style={{ fontSize: 42, color: C.muted, marginTop: 24, lineHeight: 1.5 }}>{goal}</div>
        {time ? (
          <div style={{ marginTop: 28 }}>
            <Pill>{time}</Pill>
          </div>
        ) : null}
      </div>
    </div>
  </Slide>
);

/* ---------- CH03 專用 ---------- */

import u31Result from './assets/u31-result.jpg';
import u35Case from './assets/u35-case.jpg';
import u35Bad from './assets/u35-bad.jpg';
import ship01 from './assets/ship01.jpg';

const CaseLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a data-osd-interactive href={href} target="_blank" rel="noopener noreferrer"
    onClick={(event) => event.stopPropagation()}
    style={{ display: 'inline-block', marginTop: 20, padding: '8px 18px', border: '2px solid var(--osd-accent)', borderRadius: 12, background: C.panel, color: 'var(--osd-accent)', fontSize: 28, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
    🔗 {children}
  </a>
);

const Big = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ fontSize: 44, lineHeight: 1.5, ...style }}>{children}</div>
);

const SumX = ({ label, line, sub }: { label: string; line: ReactNode; sub?: ReactNode }) => (
  <Slide dark center>
    <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>{label}</div>
    <H size={96} dark style={{ marginTop: 28, lineHeight: 1.3 }}>
      {line}
    </H>
    {sub ? <div style={{ fontSize: 40, color: C.darkMuted, marginTop: 40, lineHeight: 1.5 }}>{sub}</div> : null}
  </Slide>
);

const Swatch = ({ color }: { color: string }) => (
  <span
    style={{
      display: 'inline-block',
      width: 44,
      height: 44,
      borderRadius: 10,
      background: color,
      border: `3px solid ${C.muted}`,
      verticalAlign: 'middle',
      marginRight: 16,
    }}
  />
);

/* ---------- 開場 ---------- */

const Cover: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 1000 }}>
        <Eyebrow>AI 職場全效生產力應用班｜第二週・上午</Eyebrow>
        <h1 style={{ fontFamily: serif, fontSize: 120, fontWeight: 900, lineHeight: 1.18, margin: '0 0 36px' }}>
          Google Sheets
          <br />
          AI 活用術（上）
        </h1>
        <div style={{ fontSize: 48, color: 'var(--osd-accent)', fontWeight: 500 }}>
          不用背函數，也能寫出對的公式
        </div>
      </div>
      <svg width="560" height="440" viewBox="0 0 560 440" aria-hidden="true">
        <rect x="10" y="10" width="540" height="70" rx="12" fill={C.dark} />
        <text x="40" y="58" fontSize="34" fontFamily="Consolas, monospace" fill={C.gold}>fx</text>
        <text x="100" y="58" fontSize="32" fontFamily="Consolas, monospace" fill={C.darkText}>=SUMIF(A:A,E2,C:C)</text>
        {[0, 1, 2, 3, 4].map((r) => (
          <g key={r}>
            {[0, 1, 2].map((c) => (
              <rect
                key={c}
                x={10 + c * 180}
                y={100 + r * 66}
                width="180"
                height="66"
                fill={r === 0 ? C.line : r === 3 && c === 2 ? 'var(--osd-accent)' : C.panel}
                stroke={C.muted}
                strokeWidth="2"
              />
            ))}
          </g>
        ))}
        <text x="460" y="344" textAnchor="middle" fontSize="34" fontWeight="700" fill={C.darkText}>400</text>
      </svg>
    </div>
  </Slide>
);

const Preview: Page = () => (
  <Slide>
    <Eyebrow>成果預覽</Eyebrow>
    <H>今天上午，你會做出這三樣東西</H>
    <Body>
      <div style={{ display: 'flex', gap: 36 }}>
        <Col tag="①" title="抓漏填的名單" body={'25 筆名單\n一秒標出 7 筆漏填'} />
        <Col tag="②" title="查價加總商品表" body={'輸入編號就有單價\n分類合計自動算'} />
        <Col tag="③" title="拍照記錄出貨表" body={'照片交給 AI\n一列一筆、自動核對'} />
      </div>
    </Body>
  </Slide>
);

const Hook: Page = () => (
  <Slide>
    <Eyebrow>先舉手</Eyebrow>
    <H>
      你的報表裡，有沒有一個
      <br />
      「看不懂、但不敢動」的公式？
    </H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Vote n="A">有</Vote>
        <Vote n="B">沒有</Vote>
        <Vote n="C">不知道算不算</Vote>
      </div>
      <Note>先記下舉手人數，下課前再問一次</Note>
    </Body>
  </Slide>
);

const Agenda: Page = () => (
  <Slide>
    <Eyebrow>今天的六個單元</Eyebrow>
    <H>今天的六個單元</H>
    <Body>
      <Grid
        cols="140px 1fr"
        size={38}
        rows={[
          ['單元', '主題'],
          ['3-1', '看不懂公式？截圖問 AI'],
          ['3-2', '用說的，讓 AI 寫函數'],
          ['3-3', '看懂公式，才會改公式'],
          ['3-4', '讓表格自己變色'],
          ['3-5', '一張好截圖，省十句話'],
          ['3-6', '實作：拍照就能記錄的出貨表'],
        ]}
      />
      <Note>請先登入 Google 帳號，打開 Gemini 和今天的案例檔</Note>
    </Body>
  </Slide>
);

/* ---------- 3-1 ---------- */

const U1: Page = () => (
  <Unit no="3-1" title="看不懂公式？截圖問 AI" goal="截圖＋一句話，請 AI 說明公式，再依新需求修改" />
);

const U1Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>接手同事的名單，有人漏填</H>
    <Body>
      <Grid
        cols="200px 260px 330px 1fr"
        size={36}
        rows={[
          ['姓名', '生日', '手機號碼', '地址'],
          ['謝辛如', '1998/02/22', '0956-324-312', '台北市松山區…'],
          ['（空白）', '1983/05/08', '0954-071-435', '台中市西屯區…'],
          ['黃雅雯', '2008/12/05', '0934-750-620', '（空白）'],
          ['許書婷', '1986/11/18', '（空白）', '新竹市東區…'],
        ]}
      />
      <Note>共 25 筆客戶資料。主管要你：把漏填的人全部找出來</Note>
      <CaseLink href="https://docs.google.com/spreadsheets/d/113sksY4Pm-C1xywJHUUQm-XgizyaPZlzh5etSRznMQA/edit">CH03 3-1 練習｜客戶資料檢查</CaseLink>
    </Body>
  </Slide>
);

const U1Ask: Page = () => (
  <Slide>
    <Eyebrow>同一件事，三種問法</Eyebrow>
    <H>你想要的是結果，還是公式？</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Flip front="「請直接檢查並標示」" back="Gemini 處理好，給你看結果" hint="點一下看結果" h={112} />
        <Flip front="「請做成檔案給我下載」" back="拿到整份新檔，資料可能被改動" hint="點一下看結果" h={112} />
        <Flip front="「請給我 F2 的公式」" back="自己貼、自己改，最好掌握" hint="點一下看結果" h={112} />
      </div>
      <Note>資料怎麼給 AI：直接複製貼上，或上傳整份檔案</Note>
    </Body>
  </Slide>
);

const U1Result: Page = () => (
  <Slide>
    <Eyebrow>一行公式</Eyebrow>
    <H>抓出 7 筆漏填</H>
    <Body>
      <div style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Formula label="F2 公式（往下填滿到 F26）" size={30}>
            =IF(COUNTBLANK(B2:E2)&gt;0,
            <br />
            "有資料未填寫","")
          </Formula>
          <Big>
            <Pill>預期結果</Pill>
            <div style={{ marginTop: 16 }}>25 筆中標出 7 筆</div>
            <div style={{ fontSize: 36, color: C.muted }}>第 4、8、10、14、15、20、22 列</div>
          </Big>
        </div>
        <Shot src={u31Result} w={620} h={644} />
      </div>
    </Body>
  </Slide>
);

const U1Explain: Page = () => (
  <Slide>
    <Eyebrow>截圖＋一句話</Eyebrow>
    <H>請 AI 說明這個公式</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <ShotTodo what="Google Sheets 點選 F2，公式列與欄名同時入鏡" w={600} h={500} />
        <Prompt
          style={{ flex: 1 }}
          size={32}
          lines={[
            '附圖是我的試算表，',
            'F2 的公式在公式列上。',
            '請用初學者看得懂的話說明：',
            '1. 這個公式一句話在做什麼？',
            '2. COUNTBLANK(B2:E2) 算什麼？',
            '3. 複製到 F3，公式會變成什麼？',
            '看不清楚的地方請直接說，不要猜。',
          ]}
        />
      </div>
    </Body>
  </Slide>
);

const U1Modify: Page = () => (
  <Slide>
    <Eyebrow>依新需求修改</Eyebrow>
    <H>主管要的是「缺哪一欄」</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <Prompt
          style={{ flex: 1 }}
          size={32}
          lines={[
            '不要只寫「有資料未填寫」，',
            '請直接寫出缺哪幾欄，',
            '例如「缺：生日、地址」。',
            '欄名在 B1:E1，',
            '資料都齊就保持空白。',
            '請給我 F2 公式並逐段說明。',
          ]}
        />
        <div style={{ width: 560 }}>
          <Pill>預期結果</Pill>
          <div style={{ marginTop: 12 }}>
            <Grid
              cols="160px 1fr"
              size={36}
              rows={[
                ['列', 'F 欄'],
                ['第 4 列', '缺：姓名'],
                ['第 8 列', '缺：地址'],
                ['第 10 列', '缺：手機號碼'],
                ['第 14 列', '缺：生日'],
              ]}
            />
          </div>
        </div>
      </div>
    </Body>
  </Slide>
);

const U1Sum: Page = () => (
  <SumX
    label="3-1 只記一句"
    line="先請 AI 解釋，再請 AI 修改"
    sub="檔案在雲端硬碟時，先確認是 Excel 檔還是 Google 試算表"
  />
);

/* ---------- 3-2 ---------- */

const U2: Page = () => (
  <Unit no="3-2" title="用說的，讓 AI 寫函數" goal="說清楚從哪找、找什麼、放哪裡，AI 就能寫出 VLOOKUP、SUMIF" />
);

const U2Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>主管的三個問題</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Vote n="1">「VC-003 這台吸塵器多少錢？」</Vote>
        <Vote n="2">「冷氣機那幾台，加起來多少？」</Vote>
        <Vote n="3">「每一類最新的商品是哪一個？」</Vote>
      </div>
      <Note>資料都在「人氣家電商品單價表」：分類、商品編號、單價，共 12 筆</Note>
      <CaseLink href="https://docs.google.com/spreadsheets/d/1R0dHEyKo1hVRviVMYeVDakFDkLlOEo9XEjeQwFj9YWA/edit">CH03 3-2 練習｜人氣家電商品表</CaseLink>
    </Body>
  </Slide>
);

const U2Three: Page = () => (
  <Slide>
    <Eyebrow>不用記函數名稱</Eyebrow>
    <H>描述需求，只要講三件事</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <ChgRow n="1" title="從哪裡找" line="資料在哪幾欄、哪幾列，例如 B3:B14 是商品編號" />
        <ChgRow n="2" title="用什麼條件" line="要比對的值放在哪，例如 K2 輸入的編號" />
        <ChgRow n="3" title="結果放哪裡" line="公式要放在哪個儲存格，例如 L2" />
      </div>
      <Note>不知道用哪個函數？直接問：「這個需求適合用什麼函數？比較 2 種做法」</Note>
    </Body>
  </Slide>
);

const U2Vlookup: Page = () => (
  <Slide>
    <Eyebrow>問題 1：查價格</Eyebrow>
    <H>VLOOKUP</H>
    <Body>
      <Prompt
        size={32}
        lines={[
          'B3:B14 是商品編號、C3:C14 是單價。',
          '我想在 K2 輸入商品編號，L2 自動顯示單價。',
          '找不到時顯示「查無此商品」。',
          '請給我 L2 公式，並說明每個參數。',
        ]}
      />
      <Formula size={32} style={{ marginTop: 32 }}>
        =IFERROR(VLOOKUP(K2,$B$3:$C$14,2,FALSE),"查無此商品")
      </Formula>
      <Big style={{ marginTop: 28 }}>
        <Pill>預期結果</Pill>　VC-003 → 4,500　｜　VC-009 → 查無此商品
      </Big>
    </Body>
  </Slide>
);

const U2Sumif: Page = () => (
  <Slide>
    <Eyebrow>問題 2：算合計</Eyebrow>
    <H>SUMIF</H>
    <Body>
      <Prompt
        size={32}
        lines={[
          'A3:A14 是分類、C3:C14 是單價。',
          '分類名稱在 K5:K7，請在 L5:L7 算出各分類的單價合計。',
          '請給我 L5 公式，往下複製也要能用。',
        ]}
      />
      <div style={{ display: 'flex', gap: 48, alignItems: 'center', marginTop: 36 }}>
        <Formula size={34} style={{ flex: 1 }}>
          =SUMIF($A$3:$A$14,K5,$C$3:$C$14)
        </Formula>
        <div style={{ width: 520 }}>
          <Grid
            cols="1fr 200px"
            size={36}
            rows={[
              ['分類', '合計'],
              ['冷氣機', '99,400'],
              ['吸塵器', '16,700'],
              ['電風扇', '6,800'],
            ]}
          />
        </div>
      </div>
    </Body>
  </Slide>
);

const U2Last: Page = () => (
  <Slide>
    <Eyebrow>問題 3：每一類最底下那一筆</Eyebrow>
    <H>讓 Gemini 直接讀雲端硬碟的檔案</H>
    <Body>
      <div style={{ display: 'flex', gap: 44 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Prompt
            label="提示詞（原文）"
            size={30}
            lines={[
              '@Google 雲端硬碟 從「人氣家電商品表」',
              '檔案，篩選出每個「分類」最底下的',
              '那一筆資料，統整在 G3 儲存格，',
              '並依照 G～I 欄的格式存放',
            ]}
          />
          <ShotTodo what="Gemini 輸入「@Google 雲端硬碟」並選取檔案的畫面" h={170} />
        </div>
        <div style={{ width: 560 }}>
          <Pill>預期結果</Pill>
          <div style={{ marginTop: 12 }}>
            <Grid
              cols="1fr 1fr 150px"
              size={34}
              rows={[
                ['分類', '商品編號', '單價'],
                ['冷氣機', 'AC-004', '16,800'],
                ['吸塵器', 'VC-004', '5,200'],
                ['電風扇', 'FAN-004', '2,300'],
              ]}
            />
          </div>
        </div>
      </div>
      <div style={{ marginTop: 28 }}>
        <Flip front="VLOOKUP 為何拿到 AC-001？" back="它找到第一筆就停；改用 XLOOKUP 從下往上找" hint="點一下看原因" h={120} />
      </div>
    </Body>
  </Slide>
);

const U2Sum: Page = () => (
  <SumX label="3-2 只記一句" line="不用記函數，要會說需求" sub="結果不對？把錯誤畫面截圖回貼給 AI，請它重寫" />
);

/* ---------- 3-3 ---------- */

const U3: Page = () => (
  <Unit no="3-3" title="看懂公式，才會改公式" goal="請 AI 用白話拆解公式，條件一變也會自己改" />
);

const U3Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>AI 給的公式，複製貼上就好？</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair tag="只複製貼上" title="下次又要重問" lines={['條件一變就不會改', '範圍錯了也看不出來']} />
        <Pair tag="請 AI 解釋" title="自己會改" lines={['知道每個參數在做什麼', '換一張報表也能套用']} />
      </div>
      <CaseLink href="https://docs.google.com/spreadsheets/d/1tqIRM2ByJSEbhIcY2C35oiUOZzh1Gtlm-55NtsCXrmQ/edit">CH03 3-3 練習｜公式邏輯</CaseLink>
    </Body>
  </Slide>
);

const U3Explain: Page = () => (
  <Slide>
    <Eyebrow>請 AI 用白話拆解</Eyebrow>
    <H>SUMIF 到底在算什麼？</H>
    <Body>
      <div style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
        <div style={{ width: 780 }}>
          <Grid
            cols="60px 120px 1fr 100px 140px"
            size={30}
            rows={[
              ['列', 'A 類別', 'B 項目', 'C 金額', 'D 狀態'],
              ['2', '文具', '筆記本', '120', '已付款'],
              ['3', '餐飲', '午餐', '250', '已付款'],
              ['4', '文具', '原子筆', '80', '未付款'],
              ['5', '交通', '車票', '60', '已付款'],
              ['6', '餐飲', '飲料', '150', '未付款'],
              ['7', '文具', '影印紙', '200', '已付款'],
            ]}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Prompt
            size={30}
            lines={[
              'F2 公式是',
              '=SUMIF($A$2:$A$7,E2,$C$2:$C$7)',
              '請不要只給答案，依序說明：',
              '1. 一句白話在做什麼？',
              '2. 三個參數各對應哪一欄？',
              '3. 為什麼結果是 400？',
              '4. $ 符號有什麼作用？',
            ]}
          />
          <Big style={{ marginTop: 24, fontSize: 40 }}>
            <Pill>預期結果</Pill>　文具 ＝ 400
          </Big>
        </div>
      </div>
    </Body>
  </Slide>
);

const U3Rule: Page = () => (
  <Slide>
    <Eyebrow>把公式翻成規則</Eyebrow>
    <H>三個參數，三句話</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <ChgRow n="1" title="條件範圍　$A$2:$A$7" line="到 A 欄找費用類別" />
        <ChgRow n="2" title="條件　E2" line="用 E2 的「文具」來比對" />
        <ChgRow n="3" title="加總範圍　$C$2:$C$7" line="把符合的 C 欄金額加起來：120＋80＋200" />
      </div>
      <Note>$ 是「鎖住」：往下複製時範圍不動；沒有 $ 的 E2 會變成 E3、E4</Note>
    </Body>
  </Slide>
);

const U3Ifs: Page = () => (
  <Slide>
    <Eyebrow>條件變了</Eyebrow>
    <H>只算「已付款」的文具</H>
    <Body>
      <Formula size={34}>=SUMIFS($C$2:$C$7,$A$2:$A$7,E2,$D$2:$D$7,"已付款")</Formula>
      <Big style={{ margin: '26px 0' }}>
        <Pill>預期結果</Pill>　320（筆記本 120＋影印紙 200）
      </Big>
      <Flip front="SUMIF 加一個 S 就好？" back="參數順序也變了：加總範圍移到最前面" hint="點一下看答案" h={120} />
      <Note>SUMIF（條件範圍, 條件, 加總範圍）　SUMIFS（加總範圍, 條件範圍1, 條件1, …）</Note>
    </Body>
  </Slide>
);

const U3Move: Page = () => (
  <Slide>
    <Eyebrow>舉一反三</Eyebrow>
    <H>換到自己的報表</H>
    <Body>
      <Grid
        cols="300px 1fr 1fr"
        size={36}
        rows={[
          ['角色', '練習的表', '你的報表'],
          ['條件範圍', 'A2:A7 費用類別', 'B2:B100 部門'],
          ['條件儲存格', 'E2', 'H2'],
          ['加總範圍', 'C2:C7 金額', 'F2:F100 支出'],
        ]}
      />
      <Prompt
        size={30}
        style={{ marginTop: 40 }}
        lines={[
          '請先用「條件範圍／條件儲存格／加總範圍」對照舊表與新表，',
          '再給我 I2 的公式，並教我用 2～3 筆資料驗算。',
          '資訊不足請先問我，不要猜欄位。',
        ]}
      />
    </Body>
  </Slide>
);

const U3Sum: Page = () => (
  <SumX
    label="3-3 只記一句"
    line="分清楚「變」與「不變」"
    sub="練習：E3 改成「餐飲」，已付款是多少？未付款呢？先猜再算"
  />
);

const Break: Page = () => (
  <Slide dark center>
    <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>前段重點</div>
    <H size={140} dark style={{ marginTop: 20 }}>
      先解釋，再修改
    </H>
    <div style={{ fontSize: 44, color: C.darkMuted, marginTop: 36 }}>下一段：讓表格自己變色</div>
  </Slide>
);

/* ---------- 3-4 ---------- */

const U4: Page = () => (
  <Unit no="3-4" title="讓表格自己變色" goal="用文字說清楚規則，請 AI 給你條件式格式的自訂公式" />
);

const U4Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>一眼看出哪個案件落後</H>
    <Body>
      <Grid
        cols="1fr 1fr 1fr"
        size={40}
        rows={[
          ['狀態', '完成率', '顏色'],
          ['已完成', '100%', '淡綠色'],
          ['進行中', '65%', '淡紅色'],
          ['進行中', '85%', '不標色'],
          ['進行中', '（空白）', '不標色'],
        ]}
      />
      <div style={{ display: 'flex', gap: 48, marginTop: 30, fontSize: 36, alignItems: 'center' }}>
        <span>
          <Swatch color="#cfe9d6" />
          已完成
        </span>
        <span>
          <Swatch color="#f6d3cf" />
          沒完成且低於 80%
        </span>
      </div>
      <CaseLink href="https://docs.google.com/spreadsheets/d/1SygteZBJQfy16vtSViAUer6-sFcgC9qxn-Z7NSbK8gc/edit">CH03 3-4 練習｜條件式格式</CaseLink>
    </Body>
  </Slide>
);

const U4Prompt: Page = () => (
  <Slide>
    <Eyebrow>說清楚四件事：哪一欄、什麼條件、標在哪、什麼顏色</Eyebrow>
    <H>讓 AI 產生規則</H>
    <Body>
      <Prompt
        size={32}
        lines={[
          'A2:F9 是案件資料：E 欄＝狀態、F 欄＝完成率。',
          '請對 A2:F9「整列」自動標色：',
          '1. E 欄等於「已完成」：淡綠色',
          '2. 不是「已完成」且 F 欄低於 80%：淡紅色',
          '3. A 欄空白不標色；F 欄空白不標紅',
          '請給我兩條「自訂公式」，說明每個 $ 的用途，',
          '並列出 4 種測試資料讓我檢查。',
        ]}
      />
    </Body>
  </Slide>
);

const U4Steps: Page = () => (
  <Slide>
    <Eyebrow>操作步驟</Eyebrow>
    <H>四步設定條件式格式</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30 }}>
          <Steps>
            <Step>
              <Row n="1">選取 A2:F9</Row>
            </Step>
            <Step>
              <Row n="2">「格式」→「條件式格式設定」</Row>
            </Step>
            <Step>
              <Row n="3">條件選單選「自訂公式」</Row>
            </Step>
            <Step>
              <Row n="4">貼上公式、選顏色、按「完成」</Row>
            </Step>
          </Steps>
        </div>
        <ShotTodo what="「條件式格式設定」側邊欄，已選「自訂公式」" w={560} h={600} />
      </div>
    </Body>
  </Slide>
);

const U4Rules: Page = () => (
  <Slide>
    <Eyebrow>兩條規則</Eyebrow>
    <H>綠色一條，紅色一條</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30 }}>
          <Formula label="淡綠色規則" size={32}>
            =AND($A2&lt;&gt;"",$E2="已完成")
          </Formula>
          <Formula label="淡紅色規則" size={32}>
            =AND($A2&lt;&gt;"",$F2&lt;&gt;"",
            <br />
            $F2&lt;0.8,$E2&lt;&gt;"已完成")
          </Formula>
        </div>
        <ShotTodo what="套用後的案件進度表（綠／紅）" w={560} h={540} />
      </div>
    </Body>
  </Slide>
);

const U4Dollar: Page = () => (
  <Slide>
    <Eyebrow>最容易錯的地方</Eyebrow>
    <H>先猜，再翻</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Flip front="$E2" back="固定看 E 欄，每往下一列改看該列" hint="點一下看意思" h={112} />
        <Flip front="$E$2" back="永遠只看 E2，整列套用會出錯" hint="點一下看意思" h={112} />
        <Flip front="80% 怎麼寫？" back="寫成 0.8；剛好 80% 不會標紅" hint="點一下看答案" h={112} />
      </div>
      <Note>公式以套用範圍的左上角為準：範圍從 A2 開始，公式就寫第 2 列</Note>
    </Body>
  </Slide>
);

const U4Sum: Page = () => (
  <SumX label="3-4 只記一句" line="上線前，先測四種情況" sub="已完成｜低於 80%｜剛好 80%｜完成率空白" />
);

/* ---------- 3-5 ---------- */

const U5: Page = () => (
  <Unit no="3-5" title="一張好截圖，省十句話" goal="截圖＋目標＋實際與預期，AI 才能準確排錯" />
);

const U5Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>文具總金額，怎麼是 0？</H>
    <Body>
      <Shot src={u35Case} h={420} />
      <Note>F2 想算文具總金額，卻顯示 0。先自己找找看，問題在哪？</Note>
      <CaseLink href="https://docs.google.com/spreadsheets/d/1Z36CrEdsnvV_xOlAgtV-HBWS0yNaEF3EPDMjf-V2mUQ/edit">CH03 3-5 練習｜截圖排錯</CaseLink>
    </Body>
  </Slide>
);

const U5Good: Page = () => (
  <Slide>
    <Eyebrow>截圖要截什麼</Eyebrow>
    <H>壞截圖 vs. 好截圖</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Card style={{ flex: '0 0 400px' }}>
          <Pill warn>壞截圖</Pill>
          <div style={{ margin: '24px 0', height: 290, display: 'flex', alignItems: 'center' }}>
            <Shot src={u35Bad} h={90} zoom={false} />
          </div>
          <div style={{ fontSize: 38, lineHeight: 1.5 }}>只有一個 0<br />AI 只能猜</div>
        </Card>
        <Card style={{ flex: 1 }}>
          <Pill>好截圖</Pill>
          <div style={{ margin: '24px 0', height: 290 }}>
            <Shot src={u35Case} h={290} zoom={false} />
          </div>
          <div style={{ fontSize: 38, lineHeight: 1.5 }}>欄名、列號、公式、相關資料都看得到</div>
        </Card>
      </div>
      <Note>不要截到客戶姓名、電話、薪資；先改成測試資料</Note>
    </Body>
  </Slide>
);

const U5Prompt1: Page = () => (
  <Slide>
    <Eyebrow>截圖＋目標＋實際與預期</Eyebrow>
    <H>把截圖和這段話一起給 AI</H>
    <Body>
      <Prompt
        size={32}
        lines={[
          '請依附圖排查 F2 為什麼顯示 0。',
          '目標：依 E2 的費用類別，加總 C 欄「金額」。',
          '目前 F2 公式：=SUMIF($A$2:$A$7,E2,$B$2:$B$7)',
          '請先辨認各欄用途，指出哪一段參照錯誤，',
          '再給我修正公式，並列出被計入的資料列。',
          '看不清楚的內容請明說，不要猜。',
        ]}
      />
    </Body>
  </Slide>
);

const U5Prompt2: Page = () => (
  <Slide>
    <Eyebrow>資訊不夠時</Eyebrow>
    <H>讓 AI 先追問，不要亂猜</H>
    <Body>
      <Prompt
        size={32}
        lines={[
          '我附了一張錯誤畫面。請不要直接猜答案：',
          '1. 先說明你從圖片確定看見的欄名、公式、結果；',
          '2. 列出還缺少的資訊；',
          '3. 最多問我 3 個關鍵問題，',
          '收到回答後，再提出修正公式與驗算步驟。',
        ]}
      />
      <Note>AI 可能看錯小字：重要公式請另外貼文字</Note>
    </Body>
  </Slide>
);

const U5Sum: Page = () => (
  <Slide dark center>
    <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>3-5 只記一句</div>
    <H size={96} dark style={{ margin: '28px 0 48px' }}>
      錯在第三個參數
    </H>
    <div style={{ color: 'var(--osd-text)', border: `3px solid ${C.gold}`, borderRadius: 'var(--osd-radius)' }}><Flip front="$B$2:$B$7（項目，是文字）" back="改成 $C$2:$C$7（金額），0 變 400" hint="點一下看答案" h={120} /></div>
  </Slide>
);

/* ---------- 3-6 ---------- */

const U6: Page = () => (
  <Unit
    no="3-6"
    title="實作：拍照記錄出貨表"
    goal="照片交給 AI，整理成一列一筆，再加上核對公式"
  />
);

const U6Flow: Page = () => (
  <Slide>
    <Eyebrow>今天的任務</Eyebrow>
    <H>五個步驟</H>
    <Body>
      <Grid
        cols="100px 1fr"
        size={38}
        rows={[
          ['步驟', '做什麼'],
          ['1', '先想欄位：請 AI 依出貨單設計紀錄表'],
          ['2', '拍照錄入：照片交給 AI，貼進 Google 試算表'],
          ['3', '加核對公式：小計與檢查，請 AI 解釋'],
          ['4', '換一家公司：同一張表還能用嗎？'],
          ['5', '換成自己公司的單據重做一次'],
        ]}
      />
      <CaseLink href="https://docs.google.com/spreadsheets/d/1el-x8bsaSq6_L9SVHMwzChTPGF2VoMjBgLM_QMi66yQ/edit">CH03 3-6 練習｜出貨單</CaseLink>
    </Body>
  </Slide>
);

const U6Row: Page = () => (
  <Slide>
    <Eyebrow>步驟 1：先想欄位</Eyebrow>
    <H>一列＝一個品項</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <Shot src={ship01} w={740} h={480} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Pair tag="表頭" title="單號、日期、客戶" lines={['每一列都重複填']} />
          <Pair tag="明細" title="每個品項" lines={['一個品項一列']} />
        </div>
      </div>
      <Note>這樣之後才能用 SUMIF、篩選來統計（照片中的公司資訊已遮蔽）</Note>
    </Body>
  </Slide>
);

const U6Prompt: Page = () => (
  <Slide>
    <Eyebrow>步驟 2：拍照錄入</Eyebrow>
    <H>四條規則寫進提示詞</H>
    <Body>
      <Prompt
        size={32}
        lines={[
          '附圖是一張出貨單。請依下列欄位，',
          '把每個品項整理成一列，輸出成表格：',
          '【出貨單號｜出貨日期｜客戶名稱｜品名｜數量｜單價…】',
          '1. 單號、日期、客戶每一列都要重複填',
          '2. 照片上沒有的資料一律留空，不要猜',
          '3. 看不清楚的字，在備註寫「需人工確認」',
          '4. 數字只寫數字，不加逗號與單位',
        ]}
      />
      <Note>【 】裡換成你公司單據的欄位</Note>
    </Body>
  </Slide>
);

const U6Check: Page = () => (
  <Slide>
    <Eyebrow>步驟 3：加核對公式</Eyebrow>
    <H>讓公式幫你抓錯</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Formula label="K2 小計" size={32}>
            =IF(J2="","",H2*J2)
          </Formula>
          <Card>
            <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--osd-accent)' }}>O2 檢查欄會提示</div>
            <div style={{ fontSize: 38, lineHeight: 1.6, marginTop: 8 }}>
              缺單號 ／ 缺單價
              <br />
              明細與單據合計不符
            </div>
          </Card>
        </div>
        <div style={{ width: 640 }}>
          <Pill>預期結果</Pill>
          <div style={{ marginTop: 12 }}>
            <Grid
              cols="130px 90px 1fr"
              size={32}
              warnCol={2}
              rows={[
                ['照片', '列數', '檢查結果'],
                ['01', '3', '明細與單據合計不符'],
                ['002', '10', ''],
                ['003', '2', '缺單號'],
              ]}
            />
          </div>
        </div>
      </div>
    </Body>
  </Slide>
);

const U6Wrong: Page = () => (
  <Slide>
    <Eyebrow>教學亮點</Eyebrow>
    <H>單據本身也會錯</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair
          tag="01 出貨單"
          title="合計多了 495"
          lines={[
            '明細 3 × 3,300 ＝ 9,900',
            <span key="a" style={{ color: C.berry, fontWeight: 700 }}>
              單據合計卻寫 10,395
            </span>,
            '剛好是加 5% 稅，稅額欄卻寫 0',
          ]}
        />
        <Pair
          tag="002 送貨單"
          title="數量小計寫錯欄"
          lines={[
            <span key="b" style={{ color: C.berry, fontWeight: 700 }}>
              數量欄小計寫 352
            </span>,
            '其實是把單價加總',
            '真正的數量合計是 237',
          ]}
        />
      </div>
      <Note>AI 會照抄單據上的數字，不會發現錯誤；要靠公式核對</Note>
    </Body>
  </Slide>
);

const U6List: Page = () => (
  <Slide>
    <Eyebrow>完成檢核</Eyebrow>
    <H>完成了嗎？</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CheckItem>至少錄入 2 張不同格式的出貨單</CheckItem>
        <CheckItem>每個品項一列，表頭資料有重複填</CheckItem>
        <CheckItem>小計與檢查公式能正常顯示</CheckItem>
        <CheckItem>能用一句話說明檢查公式在比對什麼</CheckItem>
        <CheckItem>找出至少 1 個需要人工確認的地方</CheckItem>
      </div>
      <Note>完成後兩兩互看，各分享 1 個需要人工確認的地方</Note>
    </Body>
  </Slide>
);

/* ---------- 收尾 ---------- */

const QA: Page = () => (
  <Slide center>
    <Eyebrow>Q &amp; A</Eyebrow>
    <H size={120}>有問題嗎？</H>
    <div style={{ fontSize: 44, color: C.muted, marginTop: 36 }}>
      操作卡住、公式跑不出來，都可以現在問
    </div>
  </Slide>
);

const TakeAway: Page = () => (
  <Slide>
    <Eyebrow>今天帶走三樣東西</Eyebrow>
    <H>一個觀念、一組提示詞、一個行動</H>
    <Body>
      <div style={{ display: 'flex', gap: 32 }}>
        <Col tag="觀念" title="講清楚再驗算" body={'說清楚欄位與預期答案\nAI 給公式後\n自己用 2～3 筆驗算'} />
        <Col tag="提示詞" title="公式需求四句話" body={'我的表 A 欄是…\n我想算…\n結果放在…\n預期答案是…'} />
        <Col tag="行動" title="下週挑一個公式" body={'截圖請 AI 解釋\n報表裡一個\n看不懂的公式'} />
      </div>
    </Body>
  </Slide>
);

const Next: Page = () => (
  <Slide>
    <Eyebrow>下個單元</Eyebrow>
    <H>CH04：篩選、彙總、抓錯</H>
    <Body>
      <Grid
        cols="130px 1fr"
        size={38}
        rows={[
          ['單元', '主題'],
          ['4-1', '依部門、條件或時間篩選大量資料'],
          ['4-2', '多個工作表的數字彙總'],
          ['4-3', '資料去重與錯誤檢查'],
          ['4-4', '下拉選單與連動計算的動態報表'],
          ['4-5', '上傳整份檔案，讓 AI 建議整理方式'],
          ['4-6', '實作：篩選、彙總、錯誤檢查完整流程'],
        ]}
      />
    </Body>
  </Slide>
);

const Closing: Page = () => (
  <Slide>
    <Eyebrow>回到開場</Eyebrow>
    <H>
      那個「不敢動」的公式，
      <br />
      現在敢動了嗎？
    </H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Vote n="A">敢了，回去就試</Vote>
        <Vote n="B">還要再練習</Vote>
        <Vote n="C">我有新的問題</Vote>
      </div>
    </Body>
  </Slide>
);

export const notes: (string | undefined)[] = [
  // 1 封面
  '大家早安。今天上午是 Google Sheets AI 活用術的上篇。很多人一聽到試算表公式就頭痛，今天的目標很簡單：不用背函數，也能請 AI 寫出對的公式，而且你看得懂、改得動。',
  // 2 成果預覽
  '先看今天做完會有什麼。第一，一份會自己抓漏填的名單。第二，一張輸入編號就有單價、分類合計自動算的商品表。第三，拍出貨單照片就能記錄的紀錄表。這三樣都會在課堂上做出來。',
  // 3 開場提問
  '先舉手：你的報表裡，有沒有一個看不懂、但不敢動的公式？有的舉 A，沒有的舉 B，不確定的舉 C。我記一下人數，下課前再問一次。',
  // 4 目錄
  '今天有六個單元，包含講解、示範、跟做，以及最後的實作。請大家現在登入 Google 帳號，打開 Gemini 和案例檔，等一下要跟著做。',
  // 5 3-1 章節頁
  '第一個單元，看不懂公式怎麼辦？以前要上網查、問同事，現在截一張圖給 AI 就好。',
  // 6 情境
  '情境是這樣：你接手同事的客戶名單，25 筆資料，有人漏填姓名，有人漏填電話或地址。主管要你把漏填的全部找出來。25 筆用眼睛看還可以，250 筆呢？',
  // 7 三種問法
  '同一件事有三種問法，請大家先猜結果再翻牌。第一種，叫 Gemini 直接檢查並標示，它會處理好給你看。第二種，請它做成檔案下載，你會拿到整份新檔，但要注意它可能動到原本的資料，例如日期格式被改掉。第三種，請它直接給 F2 的公式，你自己貼、自己改，最好掌握。資料可以直接複製貼上，也可以上傳整份檔案。示範：打開案例檔，複製 B 到 E 欄貼給 Gemini，用第三種問法。',
  // 8 結果
  'AI 給的公式是：如果 B2 到 E2 之間的空白格數大於 0，就顯示有資料未填寫，否則空白。貼到 F2，往下填滿到 F26。結果應該標出 7 筆，在第 4、8、10、14、15、20、22 列。請大家對一下自己的結果，數量不對的舉手。',
  // 9 截圖說明
  '現在反過來：如果公式是別人寫好的，你看不懂怎麼辦？點 F2，讓公式列和欄名一起入鏡，截圖。截圖貼給 AI，再加上這段話。重點是最後一句：看不清楚的地方請直接說，不要猜。請大家跟著做一次。',
  // 10 修改
  '聽懂之後，主管又有新要求：不要只寫有資料未填寫，要直接寫出缺哪一欄。把這個需求告訴 AI。參考公式比較長：=IF(COUNTBLANK(B2:E2)=0,"","缺："&TEXTJOIN("、",TRUE,ARRAYFORMULA(IF(B2:E2="",$B$1:$E$1,""))))。重點是欄名所在的 B1 到 E1 要加錢字號鎖住。結果第 4 列會顯示缺姓名、第 10 列缺手機號碼。',
  // 11 總結
  '這個單元只記一句：先請 AI 解釋，再請 AI 修改。分兩次問，比較不會改錯。另外提醒，檔案放在雲端硬碟時，先確認是 Excel 檔還是 Google 試算表，兩種格式能用的功能不完全一樣。',
  // 12 3-2 章節頁
  '第二個單元，用說的讓 AI 寫函數。VLOOKUP、SUMIF 這些名字記不起來沒關係，會說需求就好。',
  // 13 情境
  '主管常問三種問題：某個商品多少錢、某一類加起來多少、每一類最新的是哪一個。資料都在人氣家電商品單價表裡，分類、商品編號、單價，三類各 4 筆，共 12 筆。',
  // 14 三件事
  '跟 AI 描述需求，只要講三件事：從哪裡找、用什麼條件、結果放哪裡。三件都講清楚，AI 就不用猜。如果不知道該用什麼函數，直接問它：這個需求適合用什麼函數？請比較兩種做法。',
  // 15 VLOOKUP
  '第一題查價格。把三件事講清楚：B 欄是編號、C 欄是單價，K2 輸入編號，L2 顯示單價，找不到就顯示查無此商品。AI 會給 VLOOKUP 加上 IFERROR。最後的 FALSE 不能省，省略的話會用大約符合，找錯商品也不會報錯。示範：K2 輸入 VC-003，應該是 4,500；輸入 VC-009 顯示查無此商品。',
  // 16 SUMIF
  '第二題算合計。分類在 A 欄、單價在 C 欄，K5 到 K7 放分類名稱。AI 給的是 SUMIF。結果：冷氣機 99,400、吸塵器 16,700、電風扇 6,800。如果結果是 0，通常是單價被存成文字，選取 C 欄改成數值格式。',
  // 17 最底下一筆
  '第三題比較難：每一類最底下那一筆，也就是最新的商品。這是講師原本的案例，直接在 Gemini 輸入小老鼠，選 Google 雲端硬碟，再選檔案。結果應該是 AC-004、VC-004、FAN-004。請大家先猜：如果用 VLOOKUP，會拿到哪一筆？翻牌。VLOOKUP 找到第一筆就停，所以會拿到 AC-001。要從下往上找，改用 XLOOKUP，最後一個參數填負 1。參考：H3 =XLOOKUP(G3,$A$3:$A$14,$B$3:$B$14,,0,-1)。另外，不同模型寫出來的做法品質會不一樣；如果改不了檔案，重開一個對話再試。',
  // 18 總結
  '這個單元只記一句：不用記函數，要會說需求。結果不對的時候，把錯誤畫面截圖回貼給 AI，請它重寫。',
  // 19 3-3 章節頁
  '第三個單元，看懂公式才會改公式。',
  // 20 情境
  'AI 給的公式，很多人複製貼上就結束了。問題是下次條件一變，例如主管只要看已付款的，你就不會改，又要重新問；範圍錯了也看不出來。請 AI 解釋，你就知道每個參數在做什麼，換一張報表也能自己套。',
  // 21 拆解
  '用這張費用表。F2 的公式是 SUMIF，E2 是文具，結果是 400。請 AI 不要只給答案，依序說明四件事。示範這段提示詞，請大家看 AI 怎麼回答，特別注意它列出被計入的是哪幾列：第 2、4、7 列，120 加 80 加 200 等於 400。',
  // 22 規則
  '把公式翻成三句話：到 A 欄找費用類別；用 E2 的文具來比對；把符合的 C 欄金額加起來。錢字號是鎖住，往下複製時範圍不會動；E2 沒有錢字號，往下就變 E3、E4，剛好可以查不同類別。',
  // 23 SUMIFS
  '條件變了：主管只想看已付款的文具。要多加一個條件，改用 SUMIFS，結果 320，原子筆 80 沒付款所以不算。先猜：是不是加一個 S 就好？翻牌。不是，參數順序也變了，加總範圍移到最前面。很多人只加 S 沒改順序，結果就錯了。',
  // 24 舉一反三
  '換到自己的報表。你的部門在 B 欄、支出在 F 欄、要查的部門在 H2。角色一樣，只是位置不同。請 AI 先做對照表，再給公式，並教你驗算。參考答案：I2 =SUMIF($B$2:$B$100,H2,$F$2:$F$100)。資訊不足請它先問，不要猜欄位。',
  // 25 總結
  '這個單元只記一句：分清楚變與不變。練習：E3 改成餐飲，把 G2 的已付款公式往下複製。先猜再算。答案：已付款餐飲是 250，只有午餐；未付款餐飲是 150，把條件改成未付款。',
  // 26 休息
  '回顧前面三個單元：公式不要直接照貼，先請 AI 解釋，再改條件，最後用案例數字驗算。接著要讓表格依條件自己變色。',
  // 27 3-4 章節頁
  '第四個單元，讓表格自己變色，也就是條件式格式設定。',
  // 28 情境
  '案件進度表有 8 筆。希望已完成的整列變淡綠色，沒完成而且完成率低於 80% 的整列變淡紅色。85% 的不標色，完成率還沒填的也不要標紅。',
  // 29 提示詞
  '跟 AI 說清楚四件事：哪一欄、什麼條件、標在哪、什麼顏色。尤其要說整列，還有空白的情況怎麼處理。最後請它列出 4 種測試資料，讓你自己檢查。',
  // 30 步驟
  '操作四步：選取 A2 到 F9；格式選單，條件式格式設定；右邊的條件選單拉到最下面選自訂公式；貼上公式、選顏色、按完成。第二條規則按新增另一項規則，一樣的步驟。示範一次，請大家跟著做。',
  // 31 兩條規則
  '綠色規則：A 欄不是空白，而且 E 欄等於已完成。紅色規則：A 欄不是空白、F 欄不是空白、F 欄小於 0.8，而且 E 欄不是已完成。設定完對照案例檔的解答工作表。如果你的試算表要求用分號分隔參數，把逗號改成分號。',
  // 32 $ 與 80%
  '這頁三張翻牌卡，先猜再翻。錢字號 E2：固定看 E 欄，每往下一列改看該列。錢字號 E 錢字號 2：永遠只看 E2，整列套用會全部一樣色。80% 要寫成 0.8，小於 0.8 代表剛好 80% 不會標紅。完成率要是數值，不能是文字的 80%。',
  // 33 總結
  '這個單元只記一句：上線前先測四種情況。已完成、低於 80%、剛好 80%、完成率空白。練習：把一筆進行中 85% 改成 75%，看這一列有沒有變紅。',
  // 34 3-5 章節頁
  '第五個單元，一張好截圖省十句話。',
  // 35 情境
  '這張表 F2 想算文具總金額，卻顯示 0。請大家先自己看 30 秒，找找問題在哪。等一下我們看 AI 怎麼找。',
  // 36 好壞截圖
  '左邊只截一個 0，AI 只能猜。右邊看得到欄名、列號、公式和相關資料，AI 才有依據。截圖之外，還要寫清楚你想算什麼、現在看到什麼、預期應該是多少。另外，不要截到客戶姓名、電話、薪資，先改成測試資料。',
  // 37 提示詞 1
  '把截圖和這段話一起給 AI。三個重點：目標、目前公式、要它不要猜。示範一次，看 AI 能不能找出錯在哪一段。',
  // 38 提示詞 2
  '如果你自己也說不清楚，就用這招：請 AI 先說它看見什麼、缺什麼，最多問你 3 個問題，再給答案。AI 有時會看錯圖片裡的小字，重要的公式請另外貼文字。',
  // 39 總結
  '答案揭曉，先猜再翻：錯在第三個參數，指到 B 欄項目，是文字，加總當然是 0。改成 C 欄金額，結果就是 400。練習：E2 改成餐飲，修正後應該是多少？答案 400，午餐 250 加飲料 150。',
  // 40 3-6 章節頁
  '最後一個單元是實作。我們要做一張拍照就能記錄的出貨紀錄表。',
  // 41 流程
  '這個實作分成五個步驟。沒帶自己公司單據的同學，用案例資料夾裡的三張出貨單照片。注意：真實單據有客戶名稱、統一編號、地址，使用前先遮住，或確認公司規定。',
  // 42 一列一品項
  '第一步先想欄位。出貨單分成表頭和明細：表頭是單號、日期、客戶；明細是每個品項。建議一列放一個品項，表頭資料每一列重複填，這樣之後才能用 SUMIF、篩選來統計。請大家先用原本的提示詞：以這張出貨單為案例，幫我設計好用的報表，我希望拍照後可以記錄資料，每筆資料做成一列，先做好紀錄就好。',
  // 43 拍照錄入
  '第二步，把照片交給 AI。四條規則一定要寫：表頭重複填、沒有的留空不要猜、看不清楚的標示、數字只寫數字。中括號裡換成你自己的欄位。表格出來後，用回覆表格上的匯出到試算表，或複製貼上。',
  // 44 核對公式
  '第三步，請 AI 寫兩個公式並解釋。K 欄小計等於數量乘單價，單價空白就不顯示。O 欄檢查比較長：=IF(A2="","缺單號",IF(J2="","缺單價",IF(L2="","",IF(ABS(SUMIF($A:$A,A2,$K:$K)-L2)>0.5,"明細與單據合計不符","")))) 。白話就是：缺單號、缺單價就提示；同一張單的明細加總和單據上的金額不一樣也提示。三張照片的預期結果在右邊，案例檔的解答工作表可以對照。',
  // 45 單據也會錯
  '這頁是今天的亮點。第一張單，明細三台各 3,300，加起來 9,900，單據合計卻寫 10,395，剛好是加了 5% 稅，可是稅額欄寫 0。第二張送貨單，數量那一欄的小計寫 352，其實是把單價加起來，真正的數量合計是 237。AI 會照抄，不會發現；要靠公式核對。',
  // 46 檢核
  '最後，換成自己公司的單據再做一次。完成後對照這五項，兩兩互看，每個人分享一個需要人工確認的地方。',
  // 47 QA
  '開放問答。操作卡住、公式跑不出來，都可以現在問。',
  // 48 帶走三樣
  '帶走三樣。觀念：先講清楚欄位和預期答案，AI 給公式後自己用兩三筆驗算。提示詞：公式需求四句話，我的表 A 欄是什麼、我想算什麼、結果放在哪、預期答案是多少，最後請它逐段解釋。行動：下週上班，挑一個看不懂的公式，截圖請 AI 解釋。',
  // 49 下篇預告
  '接著是 CH04 下篇：篩選、彙總、抓錯。會用到今天的 SUMIF 和截圖提問，請大家把今天的案例檔留著。',
  // 50 收尾
  '回到開場的問題：那個不敢動的公式，現在敢動了嗎？A 敢了、B 還要練習、C 有新問題。比較一下和開場的舉手人數。選 C 的同學，課後可以來問我。謝謝大家。',
];

export const meta: SlideMeta = {
  title: 'CH03｜Google Sheets AI 活用術（上）',
  createdAt: '2029-12-29T00:00:00.000Z',
};

export default [
  Cover,
  Preview,
  Hook,
  Agenda,
  U1,
  U1Case,
  U1Ask,
  U1Result,
  U1Explain,
  U1Modify,
  U1Sum,
  U2,
  U2Case,
  U2Three,
  U2Vlookup,
  U2Sumif,
  U2Last,
  U2Sum,
  U3,
  U3Case,
  U3Explain,
  U3Rule,
  U3Ifs,
  U3Move,
  U3Sum,
  Break,
  U4,
  U4Case,
  U4Prompt,
  U4Steps,
  U4Rules,
  U4Dollar,
  U4Sum,
  U5,
  U5Case,
  U5Good,
  U5Prompt1,
  U5Prompt2,
  U5Sum,
  U6,
  U6Flow,
  U6Row,
  U6Prompt,
  U6Check,
  U6Wrong,
  U6List,
  QA,
  TakeAway,
  Next,
  Closing,
] satisfies Page[];

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
const FONT_LINK_ID = 'osd-webfont-ch04-gas-automation';
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
      <span>CH04-2｜Google Apps Script 行政自動化</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場準備', from: 1, to: 5 },
  { name: '01 認識 GAS', from: 6, to: 12 },
  { name: '02 提醒信', from: 13, to: 19 },
  { name: '03 一拆多', from: 20, to: 29 },
  { name: '04 多合一', from: 30, to: 39 },
  { name: '檢查與行動', from: 40, to: 44 },
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

/* 獨立版；44 頁已確認架構。僅教學規格，不執行任何雲端操作。 */
const GProgress = ({ index, dark }: { index: number; dark?: boolean }) => {
  const { current } = useSlidePageNumber();
  const c = CHAPTERS[index];
  const fill = Math.max(0, Math.min(1, (current - c.from + 1) / (c.to - c.from + 1)));
  const active = current >= c.from && current <= c.to;
  return <div style={{ flex: c.to - c.from + 1, minWidth: 0 }}>
    <div style={{ fontSize: 28, fontWeight: active ? 700 : 400, color: active ? (dark ? C.gold : 'var(--osd-accent)') : (dark ? C.darkMuted : C.muted), marginBottom: 8, whiteSpace: 'nowrap' }}>{c.name}</div>
    <div style={{ height: 5, background: dark ? '#46604d' : C.line }}><div style={{ width: `${fill * 100}%`, height: 5, background: dark ? C.gold : 'var(--osd-accent)' }} /></div>
  </div>;
};
const GFrame = ({ label, title, dark = false, children }: { label: string; title: string; dark?: boolean; children: ReactNode }) => {
  const { current, total } = useSlidePageNumber();
  return <div data-gas-slide style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: dark ? C.dark : 'var(--osd-bg)', color: dark ? C.darkText : 'var(--osd-text)', padding: '108px 140px 114px', display: 'flex', flexDirection: 'column', fontFamily: 'var(--osd-font-body)', WebkitFontSmoothing: 'antialiased' }}>
    {current !== 1 ? <div style={{ position: 'absolute', top: 22, left: 140, right: 140, display: 'flex', gap: 22 }}><GProgress index={0} dark={dark}/><GProgress index={1} dark={dark}/><GProgress index={2} dark={dark}/><GProgress index={3} dark={dark}/><GProgress index={4} dark={dark}/><GProgress index={5} dark={dark}/></div> : null}
    <style>{'[data-gas-slide] [data-osd-interactive] div[style*="font-size: 38px"] { font-size: 40px !important; } [data-gas-slide] > div > a[data-gas-link] { flex: 0 0 auto !important; }'}</style>
    <Eyebrow dark={dark}>{label}</Eyebrow>
    <H dark={dark} size={64} style={{ marginBottom: 28, whiteSpace: 'pre-line' }}>{title}</H>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>{children}</div>
    <div style={{ position: 'absolute', left: 140, right: 140, bottom: 34, display: 'flex', justifyContent: 'space-between', fontSize: 28, color: dark ? C.darkMuted : C.muted }}><span>CH04-2｜Google Apps Script 行政自動化</span><span>{String(current).padStart(2,'0')} / {total}</span></div>
  </div>;
};
const GNote = ({ children, warn, dark }: { children: ReactNode; warn?: boolean; dark?: boolean }) => <div data-gas-note style={{ fontSize: 30, lineHeight: 1.45, padding: '16px 22px', borderLeft: `5px solid ${dark ? C.gold : warn ? C.berry : 'var(--osd-accent)'}`, background: dark ? '#24392b' : C.panel, color: dark ? C.darkText : warn ? C.berry : C.muted }}>{children}</div>;
const GCard = ({ tag, title, children, dark }: { tag?: string; title: string; children: ReactNode; dark?: boolean }) => <div style={{ flex: 1, minWidth: 0, padding: '30px 32px', borderRadius: 18, border: `1px solid ${dark ? '#46604d' : C.line}`, background: dark ? '#24392b' : C.panel }}>
  {tag ? <div style={{ fontSize: 28, fontWeight: 700, color: dark ? C.gold : 'var(--osd-accent)', marginBottom: 14 }}>{tag}</div> : null}
  <div style={{ fontSize: 48, lineHeight: 1.25, fontWeight: 700, marginBottom: 20, whiteSpace: 'pre-line' }}>{title}</div>
  <div style={{ fontSize: 40, lineHeight: 1.45, whiteSpace: 'pre-line' }}>{children}</div>
</div>;
const GCols = ({ children }: { children: ReactNode }) => <div style={{ display: 'flex', gap: 24, alignItems: 'stretch', width: '100%' }}>{children}</div>;
const GLine = ({ n, title, text }: { n: string; title: string; text?: string }) => <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '20px 26px', background: C.panel, borderRadius: 14 }}>
  <div style={{ fontSize: 46, color: 'var(--osd-accent)', fontWeight: 700, minWidth: 66 }}>{n}</div><div style={{ flex: 1 }}><div style={{ fontSize: 42, lineHeight: 1.35, fontWeight: 700 }}>{title}</div>{text ? <div style={{ fontSize: 40, lineHeight: 1.4, marginTop: 8 }}>{text}</div> : null}</div>
</div>;
const GLink = ({ name, url }: { name: string; url: string }) => <a data-osd-interactive data-gas-link href={url} target="_blank" rel="noopener noreferrer" onClick={(e)=>e.stopPropagation()} style={{ display: 'block', flex: 1, minWidth: 0, border: '2px solid var(--osd-accent)', borderRadius: 12, padding: '14px 20px', color: 'var(--osd-accent)', background: C.panel, fontSize: 30, fontWeight: 700, lineHeight: 1.35, textDecoration: 'none', overflowWrap: 'anywhere' }}>🔗 {name}</a>;
const GRow = ({ a,b,c,head }: { a: string;b: string;c?: string;head?: boolean }) => <div style={{ display: 'grid', gridTemplateColumns: c !== undefined ? '1fr 1fr 1fr' : '420px 1fr', gap: 22, padding: '18px 22px', borderBottom: `2px solid ${C.line}`, background: head ? C.panel : 'transparent', fontSize: 40, fontWeight: head ? 700 : 400, color: head ? 'var(--osd-accent)' : undefined, lineHeight: 1.35 }}><div>{a}</div><div>{b}</div>{c !== undefined ? <div>{c}</div> : null}</div>;
const GShot = ({ what }: { what: string }) => <div style={{ display: 'flex', alignItems: 'center', gap: 32, height: 180, flex: 'none', width: '100%' }}><div style={{ width: 320, height: 180, flex: 'none', border: `3px dashed ${C.line}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 36, fontWeight: 700 }}>截圖待補</div><div style={{ fontSize: 30, lineHeight: 1.5, color: C.muted }}>{what}<br/>16:9 預留圖框；這不是已完成的操作畫面。</div></div>;
const GUnit = ({ no,title,goal }: { no: string;title: string;goal: string }) => <GFrame label="獨立實作教材｜段落目標" title={`先看懂，再交給程式`} dark><div style={{ display: 'flex', gap: 66, alignItems: 'center', padding: '38px 0' }}><div style={{ fontSize: 220, lineHeight: 1, fontWeight: 900, color: C.gold }}>{no}</div><div><div style={{ fontSize: 94, fontWeight: 700, lineHeight: 1.2, marginBottom: 30 }}>{title}</div><div style={{ fontSize: 44, lineHeight: 1.5, maxWidth: 1050 }}>{goal}</div></div></div><GNote dark>本課先做需求、預覽與核對，不直接上線執行。</GNote></GFrame>;
const GStat = ({ label,value,warn }: { label: string;value: string;warn?: boolean }) => <div style={{ flex: 1, padding: '25px 10px', textAlign: 'center', borderRadius: 14, background: C.panel, border: `2px solid ${warn ? C.berry : C.line}` }}><div style={{ fontSize: 40, fontWeight: 700 }}>{label}</div><div style={{ fontSize: 76, fontWeight: 900, color: warn ? C.berry : 'var(--osd-accent)', marginTop: 18 }}>{value}</div><div style={{ fontSize: 28, color: C.muted }}>筆資料</div></div>;

const P01: Page = () => <GFrame label="AI 職場全效生產力應用班｜CH04-2 獨立教材" title={'Google Apps Script\n行政自動化'}><div style={{ fontSize: 62, fontWeight: 700, color: 'var(--osd-accent)', lineHeight: 1.4 }}>先預覽、再核對，<br/>最後才自動執行。</div><div style={{ display: 'flex', gap: 22, marginTop: 26 }}><Chip>付款提醒</Chip><Chip>訂單一拆多</Chip><Chip>報表多合一</Chip></div><GNote>Google 試算表與 GAS，不是桌面 Excel 巨集。</GNote></GFrame>;
const P02: Page = () => <GFrame label="成果預覽｜這是目標，不是執行成果" title="三種工作，一套檢查方法"><GCols><GCard tag="01 郵件" title="付款提醒">先看收件名單<br/>再核對信件內容</GCard><GCard tag="02 拆表" title="一張變多張">依分組拆資料<br/>逐檔對列數與權限</GCard><GCard tag="03 合表" title="多張變一張">先對齊欄名<br/>保留缺值與來源</GCard></GCols><GNote>先說清楚「怎樣才算對」，再讓 AI 規劃程式。</GNote></GFrame>;
const P03: Page = () => <GFrame label="開場提問｜請舉手選一項" title="你最不想重做哪一件事？"><GLine n="A" title="每次都要重寄的提醒信"/><GLine n="B" title="同一張表，反覆篩選與另存"/><GLine n="C" title="不同區域，欄位各寫各的"/><GNote>再想一下：如果做錯，你會用什麼方法發現？</GNote></GFrame>;
const P04: Page = () => <GFrame label="課程地圖" title="從看懂，到能驗收"><GLine n="01" title="認識 GAS" text="專案型態、介面、函式與紀錄"/><GLine n="02" title="付款提醒信" text="只預覽；看內容、收件對象與授權"/><GLine n="03" title="訂單一拆多" text="分組、列數、權限與重跑規則"/><GLine n="04" title="三區報表合一" text="欄位對位、缺值、來源與驗收"/></GFrame>;
const P05: Page = () => <GFrame label="課前準備｜任何操作之前" title="只在安全副本練習"><GCols><GCard tag="先確認" title="帳號與資料">工具能讀取 ≠ 學員可讀<br/>副本也要取得使用許可<br/>不把真實名單貼給 AI</GCard><GCard tag="本課界線" title="先模擬、不上線">不寄信、不對外分享<br/>不排程、不改雲端原檔<br/>新建檔案也先等確認</GCard></GCols><GNote warn>資料公開性尚未確認：只顯示匿名欄位、統計與驗收規格。</GNote></GFrame>;
const P06: Page = () => <GUnit no="01" title="認識 GAS" goal="能找對專案與函式，看懂執行紀錄，知道何時該停。"/>;
const P07: Page = () => <GFrame label="01 認識 GAS｜先分清楚角色" title="AI 寫程式，GAS 執行程式"><GCols><GCard tag="你＋AI" title="把需求寫清楚">情境、來源、規則<br/>預期結果與停止條件<br/>AI 協助產生程式</GCard><GCard tag="Apps Script 平台" title="在雲端執行">使用 JavaScript 寫指令<br/>串接試算表、Drive、Gmail<br/>瀏覽器編輯，不必另裝軟體</GCard></GCols><GNote>GAS＝Google 的程式自動化平台；不是另一套獨立程式語言。</GNote></GFrame>;
const P08: Page = () => <GFrame label="01 認識 GAS｜兩種專案型態" title="綁定式與獨立式"><GCols><GCard tag="附在檔案上" title="綁定式">從試算表內建立<br/>適合這張表的自訂選單<br/>能直接操作所在檔案介面</GCard><GCard tag="自己一個專案" title="獨立式">從 Drive 另建專案<br/>適合集中管理工作流程<br/>用明確來源網址或 ID 讀表</GCard></GCols><GNote>差別是「依附關係與介面能力」，不是能不能跨多個檔案。</GNote></GFrame>;
const P09: Page = () => <GFrame label="01 認識 GAS｜建立入口" title="從哪裡開專案？"><GCols><GCard title="綁定式">試算表 →「擴充功能」<br/>→「Apps Script」</GCard><GCard title="獨立式">Drive →「新增」→「更多」<br/>→「Google Apps Script」</GCard></GCols><GShot what="兩種建立入口的繁中介面；使用乾淨測試帳號"/><GNote>選項不見時先查帳號／組織設定，不要猜別的按鈕。</GNote></GFrame>;
const P10: Page = () => <GFrame label="01 基本操作｜函式＝一段有名字的工作" title="先找到這幾個位置"><GCols><GCard title="專案與程式">專案名稱<br/>程式碼編輯區<br/>儲存狀態</GCard><GCard title="執行與檢查">函式清單<br/>「執行」<br/>執行紀錄</GCard></GCols><GShot what="編輯器六個位置；繁中名稱待實機畫面確認"/><GNote>函式名要對上任務；不是永遠選清單第一個。</GNote></GFrame>;
const P11: Page = () => <GFrame label="01 基本操作｜限新建或測試專案" title="貼程式前，先留原版本"><GLine n="1" title="保留原版本，再準備完整新版本"/><GLine n="2" title="貼完整程式，避免新舊混在一起"/><GLine n="3" title="確認儲存，再選核定的函式名稱"/><GLine n="4" title="先審查內容與權限，不急著按執行"/><GNote warn>不要為了練習，把正式專案的程式一律全選刪除。</GNote></GFrame>;
const P12: Page = () => <GFrame label="01 排錯與小結" title="紅字不是重按的理由"><GCols><GCard tag="先記下來" title="錯在哪一步？">完整錯誤文字<br/>函式名、來源範圍<br/>已完成哪些部分</GCard><GCard tag="再求助 AI" title="先分錯誤類型">語法錯誤、權限不足<br/>還是資料與欄位不符？<br/>貼錯誤前先去私密資訊</GCard></GCols><GNote>重新整理可能更新畫面，但不是所有錯誤的修復方法。</GNote></GFrame>;
const P13: Page = () => <GUnit no="02" title="付款提醒信" goal="先審查三封提醒信的收件對象、內容與權限；不實際寄出。"/>;
const P14: Page = () => <GFrame label="02 案例來源｜來源程式不是預覽版" title="先打開來源，不急著執行"><GCols><GCard title="程式想做什麼？">依三個專案寄提醒信<br/>收件者仍是占位文字<br/>不代表已查過實際付款狀態</GCard><GCard title="先辨認危險位置">找出實際寄信呼叫<br/>確認自己控制的測試對象<br/>不直接貼上按執行</GCard></GCols><GLink name="GAS案例完程式碼01" url="https://docs.google.com/document/d/1VqvCL8frWCGOTW0irqDRyjJGiC2ENAczHh1bFwiXKr0/edit?usp=sharing"/><GNote warn>本課只審查與預覽；來源內的寄信指令仍會真正寄出。</GNote></GFrame>;
const P15: Page = () => <GFrame label="02 提示詞｜教學草案・待實測" title="先產生預覽，不要寄出"><Prompt size={36} lines={['請規劃三封【專案名稱】付款提醒信。','收件對象只用【自己控制的測試地址】。','先列出收件者、標題、期限與完整內容。','純文字與 HTML 使用同一個參考編號。','第一階段只輸出預覽，不寄送、不排程。','不讀取私人信件，不判斷真實付款狀態。','資訊不足時列出待確認處，等我確認。']}/><GNote>不要讓 AI「隨意生成」真實催款內容；日期與事實由人核定。</GNote></GFrame>;
const P16: Page = () => <GFrame label="02 程式審查｜只展示片段，不執行" title="找出真正會寄信的那一行"><div style={{ borderRadius: 18, padding: '32px 36px', background: C.dark, color: C.darkText, fontFamily: mono, fontSize: 34, lineHeight: 1.55 }}><div style={{ color: C.gold }}>來源寄信呼叫</div><div>GmailApp.sendEmail(to, subject, bodyText, …)</div></div><GCols><GCard title="同一封，兩種呈現">純文字 bodyText<br/>HTML 版 htmlBody<br/>都應是相同的信件資訊</GCard><GCard title="來源的風險">兩處各生隨機識別碼<br/>參考編號可能不同<br/>應先產生一次，再共用</GCard></GCols><GNote>已讀程式，不等於已修正或實寄驗證；來源雲端檔未修改。</GNote></GFrame>;
const P17: Page = () => <GFrame label="02 測試地址｜點卡片看答案" title="加號信箱不是新帳號"><div style={{ padding: '28px 32px', background: C.panel, borderRadius: 16, fontFamily: mono, fontSize: 38, lineHeight: 1.5 }}><Fill text="【自己的帳號】+【標記】@gmail.com"/></div><GLine n="＝" title="不同標記，信件仍到同一個收件匣"/><Flip front="三個加號變體＝三個獨立 Google 帳號？" back="不是；不能拿來驗證三位 KOL 的資料權限。" h={164}/><GNote>可區分測試標記，不可冒充不同收件人的身分。</GNote></GFrame>;
const P18: Page = () => <GFrame label="02 安全授權｜不理解就返回停止" title="授權不是按越快越好"><GCols><GCard title="先看四件事">程式來源與內容<br/>目前使用的帳號<br/>要求哪些資料與權限</GCard><GCard title="不要用口訣跳過">未驗證 ≠ 安全<br/>沒有刪除指令 ≠ 沒風險<br/>測試帳號也非絕對安全</GCard></GCols><GShot what="權限項目與返回停止位置；遮蔽帳號，不略過警告"/><GNote warn>不明白程式要讀、寫、寄送或分享什麼，就不要授權。</GNote></GFrame>;
const P19: Page = () => <GFrame label="02 單元檢核｜尚未有寄信成果" title="先核對內容，再談寄出"><GLine n="1" title="對象、標題與專案是否逐封對得上？"/><GLine n="2" title="期限有依核定日期與腳本時區處理？"/><GLine n="3" title="純文字與 HTML 的參考編號一致？"/><GNote>來源程式是「執行日＋3 天」，不是永遠相同的到期日。</GNote><GNote warn>只讀程式與內容；未寄信，不顯示假的收件成功畫面。</GNote></GFrame>;
const P20: Page = () => <GUnit no="03" title="訂單一拆多" goal="把一張訂單總表依優惠代碼名稱分組；驗收分組、列數與權限。"/>;
const P21: Page = () => <GFrame label="03 案例來源｜只展示欄位與驗收規格" title="先確認總表的七個欄位"><GCols><GCard tag="A～D 欄" title="訂單基本資料">訂單編號、付款時間<br/>幣別、金額</GCard><GCard tag="E～G 欄" title="付款與分組">付款狀態<br/>F：優惠代碼名稱<br/>G：優惠代碼</GCard></GCols><GLink name="A-2〈次世代機能登山服〉訂單總表" url="https://docs.google.com/spreadsheets/d/10ryuJIkZzxghl8nEOgODvrBzwqOuD50h02-ZRN3VxTo/edit?usp=drive_link"/><GNote>來源：工作表1，A2:G300，共 299 筆；公開性未確認，不投影原始明細。</GNote></GFrame>;
const P22: Page = () => <GFrame label="03 分組核對｜畫面以 A～F 組匿名" title="六組之外，還有空白"><GCols><GStat label="A 組" value="30"/><GStat label="B 組" value="43"/><GStat label="C 組" value="40"/><GStat label="D 組" value="75"/><GStat label="E 組" value="44"/><GStat label="F 組" value="32"/><GStat label="空白" value="35" warn/></GCols><div style={{ fontSize: 60, fontWeight: 700, textAlign: 'center', margin: '10px 0' }}>264 筆非空白 ＋ 35 筆空白 ＝ 299 筆</div><GNote warn>空白 35 筆先列人工處理；原情境提到 10 人，不等於來源真的有 10 組。</GNote></GFrame>;
const P23: Page = () => <GFrame label="03 提示詞｜沿用補充・待實測" title="把拆分需求寫完整"><Prompt size={34} lines={['來源：Google 試算表【副本】，A1 是表頭。','用 GAS 按 F 欄「優惠代碼名稱」分組。','先列不重複名稱／代碼對照，核對是否一致。','先預覽各組筆數、空白與預計檔名。','檔名：【原始檔名】-【優惠代碼名稱】。','建立時集中同資料夾；本階段先不要建檔。','空白或缺信箱對照時停止，不猜收件人。','說明列數、抽樣核對與避免重複執行的方法。']}/><GLink name="報表拆分腳本Prompt" url="https://docs.google.com/document/d/1Qt91_CnhluH3n3nc5jwV1S6eKULNBBxGTSKz46UKC5M/edit?usp=sharing"/></GFrame>;
const P24: Page = () => <GFrame label="03 第一階段｜流程規格，不是實際紀錄" title="第一階段不建立檔案"><GCols><GCard title="預覽必須列出">組名、筆數、預計檔名<br/>F 欄空白清單<br/>缺失的收件對照</GCard><GCard title="停止條件">合計不是 299 筆<br/>空白組被分派給某人<br/>要求 AI 猜信箱或分享</GCard></GCols><GShot what="只讀分組預覽；尚未實測，不能冒充執行紀錄"/><GNote>先看預覽清單，確認後才另談建檔；不是一次要求全自動。</GNote></GFrame>;
const P25: Page = () => <GFrame label="03 操作設計｜選單程式尚待核定／實測" title="自訂選單只是入口"><GLine n="1" title="在副本開 GAS，保留舊版再貼核定程式"/><GLine n="2" title="確認儲存，再重新開啟試算表"/><GLine n="3" title="核對選單名稱與綁定的函式"/><GShot what="副本內的自訂選單；選單名稱以核定實測版為準"/><GNote>onOpen 用來建立選單，不讓它開表就批次寄信。</GNote></GFrame>;
const P26: Page = () => <GFrame label="03 建檔階段｜預期規格・未建檔實測" title="一組一份，還要對回來源"><GCols><GCard title="六個非空白組">各一份、同資料夾<br/>原始檔名＋分組名稱<br/>不建立不明空白組</GCard><GCard tag="來源 C 組驗收" title="40 ＋ 1 ＝ 41 列">40 筆資料＋1 列標題<br/>再核對欄位順序與分組<br/>抽查原始訂單是否一致</GCard></GCols><GShot what="實際單組結果表；未核定建檔前維持待補"/><GNote>數到六個檔案不代表資料正確；舊拆檔圖片不能當本次成果。</GNote></GFrame>;
const P27: Page = () => <GFrame label="03 分享設計｜課堂不更動權限" title="有信箱，不等於能分享"><GLine n="1" title="名稱 ↔ 真實 Google 帳號，逐一核對"/><GLine n="2" title="先建檔、不分享；再確認最小權限"/><GLine n="3" title="缺對照就停止，先查單一檔對方看得到什麼"/><Flip front="加號變體收信成功，能證明權限隔離正確？" back="不能；收件匣相同，不是不同 KOL 的權限測試。" h={166}/></GFrame>;
const P28: Page = () => <GFrame label="03 重跑設計｜目前未有防重跑實測程式" title="再點一次，會發生什麼？"><GCols><GCard tag="可能的代價" title="重複建檔／寄信">沒反應不代表沒完成<br/>中途失敗可能已做一部分<br/>不要直接重按全部流程</GCard><GCard tag="先問 AI 說清楚" title="重跑依據是什麼？">查已有輸出與檔案 ID<br/>記錄成功／失敗的組別<br/>下一次只處理待完成部分</GCard></GCols><GNote>這是程式應具備的驗收要求，不宣稱來源已經做到了。</GNote></GFrame>;
const P29: Page = () => <GFrame label="03 一拆多｜三關缺一不可" title="分組、列數、權限三關" dark><GCols><GCard dark tag="先分對" title="分組">空白不能硬塞<br/>名稱不能猜</GCard><GCard dark tag="再對數" title="列數">合計對回 299<br/>逐組抽查來源</GCard><GCard dark tag="最後確認" title="權限">沒有真實對照<br/>就不要分享</GCard></GCols><GNote dark>「有產生檔案」不等於「可以交給收件人」。</GNote></GFrame>;
const P30: Page = () => <GUnit no="04" title="三區報表合一" goal="先做欄位對照，再核對列數、缺值與來源；不靠欄位位置硬接。"/>;
const P31: Page = () => <GFrame label="04 案例來源｜資料夾與三張來源表" title="三區各五筆，先看來源"><GLink name="A3 多報表合一" url="https://drive.google.com/drive/folders/1e__7GfQ5q9THJotQ9vLD0W7m-4D8KU7S?usp=sharing"/><div style={{ fontSize: 28, color: C.muted }}>上方是資料夾；下方才是三張原生試算表。</div><GCols><GCard tag="5 筆｜A:D" title="北區">業務姓名、新申辦數<br/>續約數、退租數</GCard><GCard tag="5 筆｜A:E" title="中區">有日期、方案類型<br/>沒有續約欄位</GCard><GCard tag="5 筆｜A:D" title="南區">退租、續約、申辦<br/>順序與北區不同</GCard></GCols><GCols><GLink name="A-3 業務數據－北區" url="https://docs.google.com/spreadsheets/d/1XXaEWJLTvG33bay1ivUCKGXtG2lKSz8gLt97ezfOTFY/edit"/><GLink name="A-3 業務數據－中區" url="https://docs.google.com/spreadsheets/d/1WIGN2nO46ojlV5tmfnG7500CLL3z5jzYHuULob8S9m8/edit"/><GLink name="A-3 業務數據－南區" url="https://docs.google.com/spreadsheets/d/1SVekITN5CsuN8sPGxAG052_elKoTxSiNhlm_rW-79r4/edit"/></GCols><GNote>工具帳號已能讀來源；學員存取與建立副本仍待測試。</GNote></GFrame>;
const P32: Page = () => <GFrame label="04 欄位對照｜同義先人工確認" title="同義欄名，先人工確認"><div><GRow head a="統一欄位" b="來源欄名"/><GRow a="業務員" b="業務姓名／業務員／業務員姓名"/><GRow a="申辦數" b="新申辦數／申辦數／申辦"/><GRow a="續約數" b="續約數／續約；中區無此欄"/><GRow a="退租數" b="退租數／退租"/></div><GNote>北區與南區欄序不同；不能把相同位置直接接在一起。</GNote></GFrame>;
const P33: Page = () => <GFrame label="04 缺值處理｜零是數字，缺欄是資訊不足" title="沒有續約欄，不代表零"><GCols><GCard title="中區">日期、方案保留<br/>沒有續約欄 → 留空白<br/>不是填 0</GCard><GCard title="北區與南區">沒有日期、方案 → 留空白<br/>每列加來源區域與來源檔<br/>同名也不自行去重</GCard></GCols><Flip front="來源沒有續約欄，先填 0 比較整齊？" back="不行；會把未知變成確定的零，改變資料意思。" h={164}/></GFrame>;
const P34: Page = () => <GFrame label="04 提示詞｜沿用補充・待實測" title="先給對照，再要程式"><Prompt size={34} lines={['請依【三組表頭與安全示例】先建立欄位對照。','新申辦數／申辦數／申辦 → 申辦數。','缺欄留空，不填 0、不猜值、不自行去重。','每列保留來源區域與來源檔。','先預覽三張來源檔名、各筆數與欄位映射。','我確認後再提供 GAS、設定位置與函式名。','表頭不符、網址錯或無權限時停止，不輸出半成品。']}/><GLink name="A-3 報表多合一_prompt" url="https://docs.google.com/document/d/131V_Mrq6YLkWspi1TqqLhPCEWIGS7aK8_iG-16LIvQc/edit?usp=sharing"/></GFrame>;
const P35: Page = () => <GFrame label="04 程式設定｜本例採獨立式，不是唯一方式" title="改網址，別改掉引號"><GLine n="1" title="以自己的三份副本網址／ID 設定來源"/><GLine n="2" title="只換引號中的內容，保留兩側引號"/><GLine n="3" title="確認儲存，依核定程式選對函式"/><GShot what="核定程式的來源設定位置與函式名稱；程式尚待補"/><GNote>用三個倒引號框住安全示例，再交 AI；不要貼真實敏感資料。</GNote></GFrame>;
const P36: Page = () => <GFrame label="04 延伸｜資料夾 ID 在網址 folders/ 後" title="改讀資料夾，先列清單"><GLine n="先" title="限定三張預期來源，排除提示詞文件與其他檔"/><GLine n="再" title="輸出與來源隔離，或明確排除已產出的結果"/><Flip front="讀整個資料夾，連上次輸出也一起讀？" back="不要；重跑可能把合併結果再合併一次。" h={164}/><GNote warn>原文 smartMergeReportsFromFolder 未有對應程式，不能當現成函式使用。</GNote></GFrame>;
const P37: Page = () => <GFrame label="04 驗收基準｜來源可核對・合併未實測" title="先數列，再抽查對位"><GCols><GCard tag="列數" title="15 ＋ 1 ＝ 16">三區各 5 筆＝15 筆<br/>再加 1 列標題<br/>不等於合併已成功</GCard><GCard tag="申辦／續約／退租" title="北區第 4 筆">20 ／ 12 ／ 3<br/>南區第 1 筆<br/>10 ／ 6 ／ 0</GCard></GCols><GShot what="實際合併表、來源欄與輸出網址紀錄；尚待實測"/><GNote>檢查欄寬、指定列、缺值與逐列來源，不只看總列數。</GNote></GFrame>;
const P38: Page = () => <GFrame label="04 找錯練習｜點卡片看原因" title="找出三種合併錯誤"><Flip front="南區第 1 筆：申辦變成 1" back="沿用原教案錯數；南區來源 D2 應為 10。" h={148}/><Flip front="南區第 1 筆：申辦變成 0" back="按欄位位置接反；0 是退租，不是申辦。" h={148}/><Flip front="中區每筆：續約都變成 0" back="來源沒有此欄，應留空；不能把缺值補成零。" h={148}/><GNote>答案要能回指來源，而不是再請 AI 猜一次。</GNote></GFrame>;
const P39: Page = () => <GFrame label="04 多合一｜三層一起驗收" title="列數、欄位、來源都要對" dark><GCols><GCard dark title="列數">15 筆資料<br/>來源列一對一<br/>不自行去重</GCard><GCard dark title="欄位">同義先對照<br/>缺欄保持空白<br/>抽查指定資料</GCard><GCard dark title="來源">每列保留區域<br/>與來源檔<br/>輸出要有可查網址</GCard></GCols><GNote dark>沒有實際結果與網址，就不說「自動合併完成」。</GNote></GFrame>;
const P40: Page = () => <GFrame label="自動執行｜只介紹，不建立觸發器" title="手動驗收後，才談排程"><GCols><GCard title="觸發條件＝執行規則">確認函式、事件來源<br/>時間類型與頻率<br/>再看修改／移除入口</GCard><GCard title="誰的身分在執行？">安裝型以建立者帳號執行<br/>不使用投影帳號設正式寄信<br/>時間觸發不保證精準到分</GCard></GCols><GShot what="觸發條件列表、設定項目與修改／移除入口；不儲存排程"/><GNote>知道如何停用，再考慮讓它自動跑；本課不啟用正式排程。</GNote></GFrame>;
const P41: Page = () => <GFrame label="安全與排錯｜先查清楚，才決定重跑" title="不確定完成多少，就先停"><div><GRow head a="遇到什麼？" b="先做什麼？"/><GRow a="語法／設定錯誤" b="檢查引號、來源設定、函式名稱"/><GRow a="權限／配額錯誤" b="查執行帳號、紀錄與官方限制"/><GRow a="部分已完成" b="保存產出 ID，查成功與失敗清單"/><GRow a="要刪除或整理" b="先隔離／標記，人工確認再處理"/></div><GNote warn>配額會因帳號與政策變動；不要用「再按一次」取代檢查。</GNote></GFrame>;
const P42: Page = () => <GFrame label="綜合實作｜需求與檢查清單，不直接執行" title="寫一份能交付的需求"><GLine n="選" title="寄信、拆表、合表，選一個工作情境"/><GLine n="寫" title="來源、處理規則、預覽與輸出格式"/><GLine n="查" title="怎樣算正確？哪種情況必須停止？"/><GLine n="換" title="請同學找出還要猜的欄位、信箱或缺值"/><GNote>合格：別人不必猜就知道怎麼驗收；不要求實寄、建檔或分享。</GNote></GFrame>;
const P43: Page = () => <GFrame label="帶走一組模板｜教學草案・待實測" title="先預覽，再等我確認"><Prompt size={36} lines={['情境：我是【角色】，要處理【重複工作】。','資料：來源【副本位置】，表頭／範圍是【範圍】。','規則：【分組／映射／缺值處理】，不猜未知。','輸出：【格式／欄位／命名／來源追溯】。','驗收：【列數／指定資料／權限／重跑規則】。','停止：【缺欄／空白／無權限／合計不符】。','先只讀預覽，不建檔、寄信、分享、刪除或排程。','列出待確認處，等我人工確認後再進下一階段。']}/></GFrame>;
const P44: Page = () => <GFrame label="QA｜回到你最不想重做的那件事" title="下次自動化，你先檢查什麼？" dark><GCols><GCard dark tag="一個觀念" title="檢查寫進流程">自動化不是少檢查<br/>而是每次都檢查</GCard><GCard dark tag="一組模板" title="拿走 P43">情境、資料、規則<br/>輸出、驗收、停止</GCard><GCard dark tag="一個行動" title="先做安全副本">挑一項重複工作<br/>寫需求與驗收清單<br/>不要直接上線</GCard></GCols><GNote dark>輸入可用、結果可對、出錯可停。你會先查哪一項？</GNote></GFrame>;

export const notes: string[] = [
  'P1｜這是使用者確認的獨立 CH04-2，不取代原 Sheets CH04。先說明三個案例是寄信、拆分、合併；名稱雖在 EXCEL 資料夾，工具是 Google 試算表和 Apps Script。本課只規劃預覽，不替任何人寄信或分享。',
  'P2｜先帶學員看成果規格，而不是宣稱已有自動化成果。寄信先驗對象和內容；拆表先驗分組和列數；合表先驗欄位、缺值和來源。問：你怎麼證明這件事做對？',
  'P3｜請學員選 A、B、C 並舉手，記下幾個工作痛點，不要求提供公司原始資料。接著問：如果做錯，靠什麼發現？收尾 P44 再回答一次。',
  'P4｜這四段是把兩份原筆記拆成容易教的流程，不是改寫正式教學計畫的六個單元。從看懂工具到檢查輸出，最後只有需求清單練習，沒有課堂實寄任務。',
  'P5｜先確認個人帳號、公司規範與資料許可。工具帳號能讀來源不代表學員可讀或可建副本；未用學員帳號實測。不公開原始訂單與收件對照，不把真實名單貼到 AI。建立檔案、寄信、分享、觸發器均不在本次操作範圍。',
  'P6｜本段只要求學員知道：這是哪個專案、目前是哪個函式、從哪裡看紀錄。不要讓初學者覺得要先背程式語法才能開始。先白話解釋 GAS 是 Google 工具之間的程式自動化平台。',
  'P7｜AI 協助產生程式，真正執行與存取資料的是 Apps Script。官方 overview 說明以 JavaScript 與內建 Google 服務運作。不是 AI 隨機點按介面，也不是另一套獨立語言。停下來請學員用一句話說兩者分工。',
  'P8｜綁定式附在試算表等容器，可操作該檔案介面並建立選單；獨立式是另外管理的專案。不要沿用原筆記「跨多檔不適合綁定」的絕對說法，跨檔不是獨立式專利。本例選型是管理與 UI 需求。',
  'P9｜示範順序是指出試算表擴充功能入口，再指出 Drive 新增／更多入口。圖片仍待補，不能說這是今天實機畫面。若組織隱藏服務，先停下確認帳號與管理設定；不帶學員任意開外部工具繞過限制。',
  'P10｜逐一指出專案名、程式區、儲存狀態、函式選單、執行與紀錄。函式可比喻「有名字的一段工作」。請學員指給同桌看函式清單在哪，不需要按執行。繁中介面位置待補乾淨截圖。',
  'P11｜限測試專案，先保留舊版再貼完整新版本，避免混版。不要教全選刪掉正式專案；不要永遠選第一個函式。核定程式與權限之前停止，不把本段當成實際批次執行指示。',
  'P12｜紅字先記完整錯誤、函式、來源範圍與哪些部分已完成。把帳號、文件 ID 等敏感資訊先去除再向 AI 求助。互動：請學員分辨是語法、權限、還是資料問題。重新整理只能更新畫面，不能修復全部原因。',
  'P13｜來源是三封付款提醒案例，僅閱讀與預覽。實務上是否欠款、付款期限、催款用語必須由人確認；原程式並沒有查證真實付款，不可把它說成完整帳務系統。',
  'P14｜學員可見連結是原始 GAS案例完程式碼01。先打開文件找 recipients，占位文字不是測試帳號；專案名稱星河導入、海風升級、雲端整合來自原程式。不要執行 source。工具讀到文件不等於學員權限已驗證。',
  'P15｜提示詞是由原任務改成安全預覽的教學草案，尚未在 ChatGPT 或 GAS 實測。完整版本見 S1 補充新增的獨立版提示詞段落。先清單、再內容、缺資訊停止，不讀私信也不查真實付款。畫面【】必須由使用者核定替換，不能用占位地址實寄。',
  'P16｜指出 GmailApp.sendEmail 會實寄，來源不是預覽版。純文字與 HTML 可在同封信呈現；來源 buildBodyText_ 與 buildBodyHtml_ 各生成一次 UUID，有編號不同風險。應先產生一次傳給兩者，但雲端來源尚未改動，也未實寄驗證。',
  'P17｜按 F 進播放後點翻牌卡。答案：加號變體到同一收件匣，不是獨立 Google 身分。可幫自己辨認測試標記，不可拿來驗證不同 KOL 分享權限。Google Workspace 說明網址見製作報告。',
  'P18｜授權先看來源與程式，再看帳號、服務、資料範圍。看到未驗證畫面不能逕行叫學員點進階／不安全；也不能因為沒刪除指令就保證安全。測試帳號仍可能有資料與權限風險。本頁截圖待補，使用者不理解就返回停止。',
  'P19｜對象、標題、專案、期限、參考編號逐封對。來源用執行日期加 3 天，再按腳本時區格式化，因此今天的日期不能直接寫成固定到期日。沒有寄信結果，不投影假的成功畫面。',
  'P20｜從行銷拆分總表的痛點開始：每組只能取得屬於自己的資料。核心是分組、列數與權限，不只是產生六個檔案。資料來源仍未確認可公開，畫面以分組匿名。',
  'P21｜來源 A-2 表，工作表1 A:G；F 是優惠代碼名稱，G 是代碼，不能混用。299 筆位於 A2:G300。連結可打開原始表，但來源公開性未確認，不在投影畫面展示明細或訂單編號。建立副本需學員可用性及資料使用許可另行確認。',
  'P22｜本地底稿對照 A 爸爸遛30、B 冒險旅人卡洛43、C 艾迪穿搭40、D 阿光75、E 莉莉安安44、F 收藏家伊恩32、空白35。非空白264加空白35等於299，已程式重算。姓名只留本地核對，不放學員畫面。情境10人不等於來源有10組。',
  'P23｜使用原始報表拆分腳本Prompt與已確認補充。原文件沒有真實信箱對照，也沒有完整拆表程式。提示詞先定義 A1、F欄、檔名、資料夾、筆數驗收、重跑與停止條件；用三個倒引號框匿名表頭與安全示例。完整版見單元筆記。未實測。',
  'P24｜目前是預覽功能規格，不是截到已執行的 log。預覽要列組名、筆數、檔名、空白與缺對照；35筆空白人工處理，合計要299。沒有預覽腳本與實測，不能宣稱按選單就能出結果，也不為了截圖自行執行未知程式。',
  'P25｜本次沒有核定的拆表程式，選單截圖待補。若之後另行同意測試，先用副本保留舊版，貼核定程式、存檔、重新開表，核對實際選單與函式。onOpen只建選單，不要開表就直接寄信。不存在的選單名稱不能冒充已完成。',
  'P26｜六個非空白組各一檔是建檔驗收規格；同資料夾與檔名原始檔名-優惠代碼名稱。來源C組40筆加1標題等於41列。抽查訂單、欄序與組名；本次未建新檔，舊notion-07圖片僅作來源參考，不是今日執行成果。',
  'P27｜要有真實名稱到Google帳號對照，先單檔檢查對方可見資料與最小權限。缺對照停止，不猜地址。本課不變更權限。翻牌答案：加號變體收信不能證明不同合作對象的權限隔離；用真正不同受控測試帳號另行驗收才有意義。',
  'P28｜請學員想像點兩次會不會生成兩份或寄兩次。重跑設計要先找既有輸出、記錄檔案ID與各組結果，只補待完成部分。此頁是要求AI說明設計，不宣稱目前程式有防重跑能力。',
  'P29｜請學員用分組、列數、權限三詞整理本段。空白留人工、總和299、抽樣原始列、帳號對照與權限都要過。不以檔案數量代替驗收。',
  'P30｜三區合併痛點是表頭異名與欄位順序不同；先建立映射再寫程式。這不是把三張表直接貼一起，也不是把每個同名業務去重。',
  'P31｜上方連到A3資料夾，下方三張才是來源表，每張5筆。北南A:D，中區A:E。資料夾今日只列三張表和提示詞，未見合併程式或結果；未全Drive搜尋。舊合併圖是D4命名，不當A-3結果。學員存取未實測。',
  'P32｜業務姓名／業務員／業務員姓名映射業務員；新申辦數／申辦數／申辦映射申辦數。其餘續約和退租也要按欄名。請學員先說南區哪個欄位才是申辦，避免照北區位置讀值。',
  'P33｜中區缺續約不代表零，保留日期和方案；北南缺日期方案也留空。每列新增來源區域、來源檔，讓結果能對回來源。翻牌問補0是否更整齊，答案是不可以把未知變確定；同名也不自行去重。',
  'P34｜原提示詞文件的表頭與阿豪示例可讀；教學採已確認補充的預覽優先版。三組表頭加一兩筆安全示例以倒引號包住，再要求來源筆數、映射、缺值規則、函式與輸出網址。未實測，不宣稱已在ChatGPT生成並通過GAS。',
  'P35｜本例採獨立專案便於集中管理，不是跨檔只能如此。三份來源用自己的副本網址或ID，貼到核定程式設定區而非猜第3行；保留引號。程式未取得、函式未核定，不使用原文函式名直接執行。',
  'P36｜資料夾ID是folders/後字串；讀資料夾要先白名單三個來源，排除提示詞文件、其他檔與結果。來源輸出隔離或依ID排除。翻牌答案：不要把結果再讀回去。smartMergeReportsFromFolder只在原文提名，無對應程式可驗證。',
  'P37｜來源北區小強A5:D5=20/12/3；南區阿豪A2:D2=退租0、續約6、申辦10，畫面按申辦/續約/退租為10/6/0並匿名。三區各5筆共15加標題16只是驗收基準。合併未執行、結果待補；逐列對來源、缺值與欄寬都要看。',
  'P38｜翻三張卡：南區申辦1是沿用原教案錯數；0是欄位位置接反；中區續約0是缺值誤補。來源應為南區D2=10，中區無續約。PDF靜態只見正面，答案保留在講者備註與未來完整講義。',
  'P39｜用列數、欄位、來源檢核。15筆不保證對位正確，同名不去重，來源一對一，結果要有可查網址。現在沒有合併程式與結果，不能講成功。',
  'P40｜觸發條件是什麼時候自動執行哪個函式；先手動驗收才談設定。只讀介紹事件來源、頻率、修改及移除入口，不儲存。安裝型用建立者帳號執行，時間驅動可能略有隨機，不保證精準到分。避免用投影帳號設定正式寄信。',
  'P41｜錯誤可能已完成一部分，先保留錯誤和產出ID。語法看引號和設定，權限看帳號，配額看官方與紀錄；政策會變，不寫死每日上限。若涉及刪除先隔離／標記，人工確認；本次不改雲端、不刪正式資料。',
  'P42｜作業是需求規格，不是執行任務。每人選一項重複工作，寫來源、規則、預覽輸出、正確條件與停止條件。交換後請同學指出還要猜哪個欄名、信箱、缺值或權限。符合「不用猜、能驗收」即達標，不要求真實資料。',
  'P43｜可複製模板完整文字見S1新增教學草案及日後講義附錄。本頁控制8行、替換處用【】。最後必須要求只讀預覽且等人工確認，不能把這句當成程式確實安全的證明，還是要審查程式。模板未實測。',
  'P44｜回扣開場：你選的那件事，先寫哪個驗收標準？觀念是把檢查寫進流程，模板在P43，行動是匿名副本寫需求不直接上線。QA後提醒網頁翻牌要F播放，PDF與講義圖片不能點；今天沒有實寄、分享或排程。'
];
export const meta: SlideMeta = { title: 'CH04-2｜Google Apps Script 行政自動化', createdAt: '2029-12-27T00:00:00.000Z' };
export default [P01,P02,P03,P04,P05,P06,P07,P08,P09,P10,P11,P12,P13,P14,P15,P16,P17,P18,P19,P20,P21,P22,P23,P24,P25,P26,P27,P28,P29,P30,P31,P32,P33,P34,P35,P36,P37,P38,P39,P40,P41,P42,P43,P44] satisfies Page[];

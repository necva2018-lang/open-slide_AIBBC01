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
const FONT_LINK_ID = 'osd-webfont-ch04-sheets-ai-2';
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
      <span>CH04｜Google Sheets AI 活用術（下）</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 5 },
  { name: '4-1 篩選', from: 6, to: 11 },
  { name: '4-2 跨表', from: 12, to: 17 },
  { name: '4-3 去重', from: 18, to: 23 },
  { name: '4-4 報表', from: 24, to: 29 },
  { name: '4-5 健檢', from: 30, to: 35 },
  { name: '4-6 實作', from: 36, to: 41 },
  { name: 'GAS 加碼 A', from: 42, to: 45 },
  { name: 'GAS 加碼 B', from: 46, to: 48 },
  { name: '收尾', from: 49, to: 50 },
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

/* CH04：原六單元＋獨立 Apps Script 加碼；由已確認架構製作。 */
type LinkSpec = { title: string; url: string };
type Spec = { kind: 'cover' | 'unit' | 'content' | 'prompt' | 'formula' | 'result' | 'question'; eyebrow: string; title: string; bullets: string[]; talk: string; links?: LinkSpec[]; formula?: string; shot?: string };

const CaseLink04 = ({ item }: { item?: LinkSpec }) => item ? (
  <a data-osd-interactive href={item.url} target="_blank" rel="noopener noreferrer"
    onClick={(event) => event.stopPropagation()}
    style={{ flex: 1, minWidth: 0, padding: '13px 17px', border: '2px solid var(--osd-accent)', borderRadius: 14, background: C.panel, color: 'var(--osd-accent)', fontSize: 28, fontWeight: 700, lineHeight: 1.3, textDecoration: 'none', overflowWrap: 'anywhere' }}>
    🔗 {item.title}
  </a>
) : null;

const Line04 = ({ value, dark }: { value?: string; dark: boolean }) => value ? (
  <div style={{ padding: '18px 25px', borderRadius: 16, background: dark ? 'rgba(255,255,255,0.1)' : C.panel, border: dark ? '1px solid rgba(255,255,255,0.2)' : '1px solid '+C.line, fontSize: 42, lineHeight: 1.3, fontWeight: 600 }}>
    {value}
  </div>
) : null;

const Page04 = ({ spec }: { spec: Spec }) => {
  const dark = spec.kind === 'unit' || spec.kind === 'result';
  const cover = spec.kind === 'cover';
  const links = spec.links;
  return (
    <Slide dark={dark} center={cover || spec.kind === 'unit'}>
      <Eyebrow dark={dark}>{spec.eyebrow}</Eyebrow>
      <H dark={dark} size={cover ? 112 : spec.kind === 'unit' || spec.kind === 'result' ? 88 : 62}
        style={{ whiteSpace: 'pre-line', marginBottom: cover ? 46 : 25, maxWidth: '100%' }}>{spec.title}</H>
      {spec.kind === 'prompt' ? (
        <Prompt lines={spec.bullets} size={36} style={{ marginTop: 18 }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: '100%' }}>
          <Line04 value={spec.bullets[0]} dark={dark} />
          <Line04 value={spec.bullets[1]} dark={dark} />
          <Line04 value={spec.bullets[2]} dark={dark} />
          <Line04 value={spec.bullets[3]} dark={dark} />
        </div>
      )}
      {spec.formula ? (
        <div style={{ marginTop: 22, background: C.dark, color: C.darkText, fontFamily: mono, fontSize: 30, lineHeight: 1.45, padding: '20px 26px', borderRadius: 14, overflowWrap: 'anywhere' }}>
          <div style={{ fontFamily: 'var(--osd-font-body)', fontSize: 28, color: C.gold, fontWeight: 700 }}>參考公式</div>
          {spec.formula}
        </div>
      ) : null}
      {spec.shot ? (
        <div style={{ marginTop: 20, minHeight: 146, maxHeight: 180 }}>
          <ShotTodo what={spec.shot} h={160} />
        </div>
      ) : null}
      {links ? (
        <div style={{ display: 'flex', gap: 14, marginTop: 22, width: '100%' }}>
          <CaseLink04 item={links[0]} /><CaseLink04 item={links[1]} /><CaseLink04 item={links[2]} />
        </div>
      ) : null}
    </Slide>
  );
};

const specs04: Spec[] = [
  {
    "kind": "cover",
    "eyebrow": "AI 職場全效生產力應用班",
    "title": "Google Sheets\nAI 活用術（下）",
    "bullets": [
      "從條件篩選，到可核對的報表"
    ],
    "talk": "今天承接上篇的公式操作。重點不是讓 AI 算得更快，而是讓每個條件和結果都能回頭核對。"
  },
  {
    "kind": "content",
    "eyebrow": "上篇回顧",
    "title": "會寫公式，更要能驗算",
    "bullets": [
      "先看來源欄位",
      "說清楚判斷條件",
      "用資料列核對結果"
    ],
    "talk": "回想 CH03：有公式不代表答案正確。這一章把來源、條件、結果串起來。"
  },
  {
    "kind": "content",
    "eyebrow": "成果預覽",
    "title": "做出能解釋的報表",
    "bullets": [
      "篩選與跨表彙總",
      "去重、異常、動態報表",
      "完整健檢與綜合實作"
    ],
    "talk": "今天的正式六單元會完成一份能解釋來源和驗算方式的報表。最後兩段 Apps Script 是額外加碼。"
  },
  {
    "kind": "question",
    "eyebrow": "開場提問",
    "title": "AI 算完，你先查什麼？",
    "bullets": [
      "A 看起來合理就好",
      "B 回到來源資料列",
      "C 再請 AI 算一次"
    ],
    "talk": "請學員先選一個做法。收尾再回來看，能否說出更可靠的查核順序。"
  },
  {
    "kind": "content",
    "eyebrow": "章節路線",
    "title": "六單元，再加碼",
    "bullets": [
      "篩選 → 跨表 → 去重",
      "動態報表 → 健檢 → 實作",
      "加碼：Apps Script 自動化"
    ],
    "talk": "正式計畫的六個單元順序不變。練習檔可檢視，學員請先建立自己的副本再作答。"
  },
  {
    "kind": "unit",
    "eyebrow": "正式單元 4-1",
    "title": "把條件說清楚",
    "bullets": [
      "找出正確交易，不只看顏色"
    ],
    "talk": "第一單元要練的是把日常語句拆成可檢查的條件。"
  },
  {
    "kind": "content",
    "eyebrow": "4-1｜工作情境",
    "title": "行政部九月已付款？",
    "bullets": [
      "部門＝行政部",
      "付款狀態＝已付款",
      "日期在九月，含首尾"
    ],
    "links": [
      {
        "title": "CH04 4-1 練習｜篩選條件",
        "url": "https://docs.google.com/spreadsheets/d/1Jb3s2sOfoZYB5Ah0zHVdW6D3k3O6vjme0LoOdI2mGgQ/edit"
      }
    ],
    "talk": "請學員開練習檔並建立副本。先看 A 到 E 欄，條件在 I2 到 I5。"
  },
  {
    "kind": "prompt",
    "eyebrow": "4-1｜提示詞",
    "title": "先重述四個條件",
    "bullets": [
      "我的表 A:E 是交易資料。",
      "請篩部門、付款狀態、起日與迄日。",
      "日期含首尾；先重述條件。",
      "再給 F2 公式、填滿與核對方法。"
    ],
    "talk": "示範之前請 AI 先重述條件，避免它自己猜日期邊界。這段提示詞尚未在 Gemini 實測。"
  },
  {
    "kind": "formula",
    "eyebrow": "4-1｜操作",
    "title": "標記符合，不改來源",
    "bullets": [
      "AND：四個判斷要同時成立",
      "I2:I5 固定；B2/C2/D2 隨列變"
    ],
    "formula": "=IF(AND(B2=$I$2,C2=$I$3,D2>=$I$4,D2<=$I$5),\"符合\",\"\")",
    "shot": "Google Sheets 建立篩選器與 F 欄標記",
    "talk": "貼公式前先確認 D 欄是真日期。把 F2 填到 F11，再用篩選器只看符合。"
  },
  {
    "kind": "result",
    "eyebrow": "4-1｜核對",
    "title": "3 筆，合計 430 元",
    "bullets": [
      "T001：120 元",
      "T004：250 元",
      "T008：60 元"
    ],
    "talk": "回到來源列核對這三筆；T006 在十月，T009 在八月，都不能算進來。"
  },
  {
    "kind": "content",
    "eyebrow": "4-1｜記住",
    "title": "日期邊界要明寫",
    "bullets": [
      "含 9/1 用 >=",
      "含 9/30 用 <=",
      "核對筆數、編號、總額"
    ],
    "talk": "公式能跑不代表條件正確。日期、付款狀態、部門都要核對。"
  },
  {
    "kind": "unit",
    "eyebrow": "正式單元 4-2",
    "title": "跨表彙總",
    "bullets": [
      "不同月份，也要能回到來源"
    ],
    "talk": "第二單元從兩張來源表彙總，不能只手抄最後數字。"
  },
  {
    "kind": "content",
    "eyebrow": "4-2｜工作情境",
    "title": "兩個月份，別手抄",
    "bullets": [
      "1月資料：5 筆",
      "2月資料：5 筆",
      "依部門算兩月合計"
    ],
    "links": [
      {
        "title": "CH04 4-2 練習｜跨表彙總",
        "url": "https://docs.google.com/spreadsheets/d/17dT8Mt0_QmDzoWBR8-988WLk_6OeRlTsDdQTQW_GVo8/edit"
      }
    ],
    "talk": "請學員看兩張來源分頁的 A 欄部門與 D 欄金額。練習表 B 到 D 欄留白。"
  },
  {
    "kind": "prompt",
    "eyebrow": "4-2｜提示詞",
    "title": "來源與去向都寫出來",
    "bullets": [
      "來源：1月資料、2月資料",
      "A 欄是部門，D 欄是金額",
      "練習表 B/C 分月、D 算合計",
      "請給公式與來源總額核對法"
    ],
    "talk": "提醒學員寫明來源分頁名稱，否則 AI 可能抓到彙總頁本身。提示詞未實測。"
  },
  {
    "kind": "formula",
    "eyebrow": "4-2｜公式",
    "title": "表名不能漏",
    "bullets": [
      "來源範圍要固定",
      "部門條件往下改成 A3、A4"
    ],
    "formula": "=SUMIF('1月資料'!$A$2:$A$6,$A2,'1月資料'!$D$2:$D$6)",
    "shot": "跨表公式列與月份分頁",
    "talk": "在 B2 貼等號開始的公式，再依 2 月表寫 C2；D2=B2+C2。不要把 B2 標示貼進公式。"
  },
  {
    "kind": "result",
    "eyebrow": "4-2｜核對",
    "title": "總計 2,150 元",
    "bullets": [
      "行政 400／行銷 850／業務 900",
      "1 月 1,200＋2 月 950",
      "兩個方向都要對得上"
    ],
    "talk": "核對部門合計，也核對兩張來源表的月總額。若兩者不同，先查來源範圍。"
  },
  {
    "kind": "content",
    "eyebrow": "4-2｜記住",
    "title": "資料增列，公式也要看",
    "bullets": [
      "新資料若到第 7 列，擴大範圍",
      "兩張表的單位要一致",
      "不要貼死結果數字"
    ],
    "talk": "來源資料變動，公式會更新，但固定到第六列的範圍不會自己擴大。"
  },
  {
    "kind": "unit",
    "eyebrow": "正式單元 4-3",
    "title": "先標記，再處理",
    "bullets": [
      "把疑點留下來，不直接刪"
    ],
    "talk": "第三單元練的是辨認問題，不是讓 AI 一鍵清掉資料。"
  },
  {
    "kind": "content",
    "eyebrow": "4-3｜工作情境",
    "title": "重複，不一定能刪",
    "bullets": [
      "唯一鍵＝訂單編號",
      "同號兩列都要標",
      "負數與空白另標異常"
    ],
    "links": [
      {
        "title": "CH04 4-3 練習｜重複與異常",
        "url": "https://docs.google.com/spreadsheets/d/19NVrx-j-etpxYoXb4pZmKeupIBbMWNjXSG_ZGi_XaN8/edit"
      }
    ],
    "talk": "先問學員：什麼叫同一筆？本例用訂單編號，但真實多品項訂單可能不能這樣判。"
  },
  {
    "kind": "prompt",
    "eyebrow": "4-3｜提示詞",
    "title": "重複與異常分開問",
    "bullets": [
      "E 欄：同編號出現超過一次",
      "F 欄：金額 <=0",
      "或數量空白／<=0",
      "列出編號和原因，不刪資料"
    ],
    "talk": "請 AI 分別給 E2 和 F2 公式，所有重複列都要標。提示詞未實測。"
  },
  {
    "kind": "formula",
    "eyebrow": "4-3｜公式",
    "title": "COUNTIF 只做標記",
    "bullets": [
      "E2 判斷同號出現次數",
      "F2 分別查金額與數量"
    ],
    "formula": "=IF(COUNTIF($A$2:$A$9,A2)>1,\"重複\",\"\")",
    "shot": "O002 兩列標記與異常欄",
    "talk": "示範把 E2、F2 填到第九列。不要把篩選或標記誤認為刪除。"
  },
  {
    "kind": "result",
    "eyebrow": "4-3｜核對",
    "title": "四組需要人工確認",
    "bullets": [
      "O002：兩列同編號",
      "O003：金額 -50",
      "O004 數量 0；O005 數量空白"
    ],
    "talk": "負數可能是退款，重複可能是分期。標記之後找資料擁有者確認。"
  },
  {
    "kind": "content",
    "eyebrow": "4-3｜記住",
    "title": "先留來源與處理紀錄",
    "bullets": [
      "定義唯一鍵",
      "分清空白、0、文字數字",
      "副本處理，原件不動"
    ],
    "talk": "請學員說出每筆被標記的原因，而不是只看紅色或黃色。"
  },
  {
    "kind": "unit",
    "eyebrow": "正式單元 4-4",
    "title": "選單帶動報表",
    "bullets": [
      "選條件，結果要跟著變"
    ],
    "talk": "第四單元把手動改條件變成可選的輸入。"
  },
  {
    "kind": "content",
    "eyebrow": "4-4｜工作情境",
    "title": "選部門、選月份",
    "bullets": [
      "H2：部門",
      "H3：月份",
      "H5 金額；H6 筆數"
    ],
    "links": [
      {
        "title": "CH04 4-4 練習｜動態報表",
        "url": "https://docs.google.com/spreadsheets/d/1Z-PggtLFSl6bPtWo0Qjmr8bt8_fEqtDzjopmBm9XNys/edit"
      }
    ],
    "talk": "練習版有預設值，但選單要學員自己建立。解答版已保留選單驗證。"
  },
  {
    "kind": "content",
    "eyebrow": "4-4｜操作",
    "title": "下拉選單只是輸入",
    "bullets": [
      "H2 選項來自 J2:J4",
      "H3 選項來自 K2:K3",
      "計算靠 H5/H6 的公式"
    ],
    "shot": "原生 Sheets 建立 H2/H3 下拉選單",
    "talk": "示範 H2、H3 的資料驗證。建立後改選一項，若 H5/H6 沒公式，結果仍不會變。"
  },
  {
    "kind": "prompt",
    "eyebrow": "4-4｜提示詞",
    "title": "金額和筆數分開問",
    "bullets": [
      "我有 A:D 的交易資料。",
      "H2/H3 是選單條件。",
      "H5 算已付款金額，H6 算筆數。",
      "請給 SUMIFS/COUNTIFS 和驗算法。"
    ],
    "talk": "提示詞要說清楚輸入、來源、輸出。SUMIFS 算金額、COUNTIFS 數資料列。未實測。"
  },
  {
    "kind": "result",
    "eyebrow": "4-4｜核對",
    "title": "行政部／9 月：220 元",
    "bullets": [
      "已付款 3 筆",
      "第 2、7、11 列",
      "120＋60＋40＝220"
    ],
    "talk": "請學員切換條件後，回來源列手算。結果 0 可能是選項文字與來源不同，不一定沒有交易。"
  },
  {
    "kind": "content",
    "eyebrow": "4-4｜記住",
    "title": "輸入與公式要連起來",
    "bullets": [
      "選單不會自己計算",
      "月份文字格式要一致",
      "新增資料要擴大來源範圍"
    ],
    "talk": "確認 H2/H3 是文字 2026-09，而來源 A 欄也用同樣格式。"
  },
  {
    "kind": "unit",
    "eyebrow": "正式單元 4-5",
    "title": "先健檢，再整理",
    "bullets": [
      "先知道哪裡有問題"
    ],
    "talk": "第五單元的原則是先診斷，後續整理需要人的判斷。"
  },
  {
    "kind": "content",
    "eyebrow": "4-5｜工作情境",
    "title": "一張表有多種疑點",
    "bullets": [
      "日期與金額格式不一致",
      "重複編號與負數",
      "狀態用語不一致"
    ],
    "links": [
      {
        "title": "CH04 4-5 練習｜資料健檢",
        "url": "https://docs.google.com/spreadsheets/d/11GFuVqJmUQlKHgE5P8f065f6NqQOlD1Sc33Nj1s09Ik/edit"
      }
    ],
    "talk": "只使用虛構練習表。真實表要先匿名化並確認組織規定。"
  },
  {
    "kind": "prompt",
    "eyebrow": "4-5｜提示詞 1",
    "title": "只診斷，不改檔",
    "bullets": [
      "列出每張表、欄位與資料型別。",
      "找空白、重複與格式不一致。",
      "指出位置、影響與建議。",
      "不確定的標待確認，不要猜。"
    ],
    "shot": "AI 健檢回覆（目前待實測）",
    "talk": "這是第一段提示詞。不可把模型回覆當成已核對事實；請學員回來源表查。"
  },
  {
    "kind": "result",
    "eyebrow": "4-5｜來源觀察",
    "title": "R004 重複，先別刪",
    "bullets": [
      "來源共 7 筆",
      "R003 日期空白",
      "R002 金額是文字「800元」"
    ],
    "talk": "R004 的兩列可能重複，也可能有業務原因。來源可觀察到兩列，但刪除要先確認。"
  },
  {
    "kind": "prompt",
    "eyebrow": "4-5｜提示詞 2",
    "title": "確認後才規劃清理",
    "bullets": [
      "在課堂設定：R004 重複輸入。",
      "負數 -100 是退款。",
      "「完成」對應已付款。",
      "先給副本整理計畫與驗收條件。"
    ],
    "talk": "這些確認只是虛構課堂設定，不代表真實業務資料。請 AI 先給計畫，不直接刪改。"
  },
  {
    "kind": "content",
    "eyebrow": "4-5｜記住",
    "title": "原件保留，副本處理",
    "bullets": [
      "異常不一定是錯誤",
      "先定義唯一鍵與狀態",
      "整理後比對筆數與金額"
    ],
    "talk": "資料安全提醒：完整檔案上傳前先檢查個資、客戶資料與公司機密。"
  },
  {
    "kind": "unit",
    "eyebrow": "正式單元 4-6",
    "title": "四步完成小報表",
    "bullets": [
      "篩選、去重、異常、彙總"
    ],
    "talk": "這是正式計畫的第六單元，原筆記檔名雖是 4-7，課程順序不變。"
  },
  {
    "kind": "content",
    "eyebrow": "4-6｜任務",
    "title": "一張表串起前面所學",
    "bullets": [
      "A:E 保留原始資料",
      "K2:K4 設條件",
      "F:G:H 逐步標記"
    ],
    "links": [
      {
        "title": "CH04 4-6 練習｜綜合實作",
        "url": "https://docs.google.com/spreadsheets/d/1DsPQpKCBCT7zI6-AbN2o2Ye4GNGIAlmAKq4wAebf8dI/edit"
      }
    ],
    "talk": "學員先建立練習檔副本，不要把解答版放到學員畫面。"
  },
  {
    "kind": "prompt",
    "eyebrow": "4-6｜提示詞",
    "title": "先檢查，再彙總",
    "bullets": [
      "1. F 欄標記所有重複編號。",
      "2. G 欄標記金額 <=0。",
      "3. H 欄標符合且 F/G 空白。",
      "4. K6 加總 H 欄符合金額。"
    ],
    "talk": "請 AI 一步步給第 2 列公式、填滿範圍及可核對編號。提示詞尚未實測。"
  },
  {
    "kind": "formula",
    "eyebrow": "4-6｜跟做",
    "title": "四個輔助結果可追蹤",
    "bullets": [
      "F/G/H 填到第 11 列",
      "原始 A:E 不覆寫"
    ],
    "formula": "=IF(AND(B2=$K$2,C2=$K$3,D2=$K$4,F2=\"\",G2=\"\"),\"符合\",\"\")",
    "shot": "F:H 標記與 K5:K6 核對",
    "talk": "先完成 F、G，再做 H，最後加總 K6。每一步看幾列是否符合，不跳步。"
  },
  {
    "kind": "result",
    "eyebrow": "4-6｜核對",
    "title": "3 筆，合計 400 元",
    "bullets": [
      "X001：120",
      "X003：80；X008：200",
      "X002 重複；X006 負數"
    ],
    "talk": "請學員核對符合清單與排除原因。X002 和 X006 不應悄悄算進合格金額。"
  },
  {
    "kind": "content",
    "eyebrow": "4-6｜實作檢核",
    "title": "自己的表先匿名化",
    "bullets": [
      "標明唯一鍵與異常標準",
      "用 3～5 筆人工驗算",
      "確認公司資料使用規範"
    ],
    "talk": "學員帶自己的表，只作延伸練習。不能預設資料可以上傳到 AI。"
  },
  {
    "kind": "unit",
    "eyebrow": "獨立加碼 A",
    "title": "Apps Script 自動化",
    "bullets": [
      "原六單元已完成；以下是加碼"
    ],
    "talk": "這段不是替代正式 4-1 或 4-2。Apps Script 是在 Google 應用裡寫程式來做重複工作。"
  },
  {
    "kind": "content",
    "eyebrow": "GAS A｜安全",
    "title": "先看權限，再執行",
    "bullets": [
      "先審程式與授權範圍",
      "+文字仍是同一信箱",
      "未驗證警告不能直接略過"
    ],
    "links": [
      {
        "title": "GAS案例完程式碼01",
        "url": "https://docs.google.com/document/d/1VqvCL8frWCGOTW0irqDRyjJGiC2ENAczHh1bFwiXKr0/edit"
      }
    ],
    "talk": "來源程式碼有占位收件者。本次只讀不執行；不寄信、不設定觸發器。"
  },
  {
    "kind": "content",
    "eyebrow": "GAS A｜案例",
    "title": "訂單依代碼名稱拆分",
    "bullets": [
      "來源訂單 299 筆",
      "35 筆代碼名稱空白",
      "先定義收件者對照表"
    ],
    "links": [
      {
        "title": "A-2〈次世代機能登山服〉訂單總表",
        "url": "https://docs.google.com/spreadsheets/d/10ryuJIkZzxghl8nEOgODvrBzwqOuD50h02-ZRN3VxTo/edit"
      },
      {
        "title": "報表拆分腳本Prompt",
        "url": "https://docs.google.com/document/d/1Qt91_CnhluH3n3nc5jwV1S6eKULNBBxGTSKz46UKC5M/edit"
      }
    ],
    "talk": "來源可讀，但是否全是可公開虛構資料待確認。空白組不能自動分享。"
  },
  {
    "kind": "result",
    "eyebrow": "GAS A｜核對界線",
    "title": "只模擬，不寄不分享",
    "bullets": [
      "艾迪穿搭 40 筆",
      "加標題是 41 列",
      "不是每組都有 40 筆"
    ],
    "talk": "這是來源列計數，不是已執行拆分的成果。任何真實寄信與分享須另行審核。"
  },
  {
    "kind": "unit",
    "eyebrow": "獨立加碼 B",
    "title": "三區報表合一",
    "bullets": [
      "先對欄位，再談程式"
    ],
    "links": [
      {
        "title": "A3 多報表合一",
        "url": "https://drive.google.com/drive/folders/1e__7GfQ5q9THJotQ9vLD0W7m-4D8KU7S"
      }
    ],
    "talk": "這是來源資料夾，內有北中南三表與提示詞文件，不是已完成的合併表。"
  },
  {
    "kind": "content",
    "eyebrow": "GAS B｜來源",
    "title": "欄名不同，先對齊",
    "bullets": [
      "北區：姓名、申辦、續約、退租",
      "中區：日期、業務員、方案、申辦、退租",
      "南區：姓名、退租、續約、申辦"
    ],
    "links": [
      {
        "title": "A-3 業務數據－北區",
        "url": "https://docs.google.com/spreadsheets/d/1XXaEWJLTvG33bay1ivUCKGXtG2lKSz8gLt97ezfOTFY/edit"
      },
      {
        "title": "A-3 業務數據－中區",
        "url": "https://docs.google.com/spreadsheets/d/1WIGN2nO46ojlV5tmfnG7500CLL3z5jzYHuULob8S9m8/edit"
      },
      {
        "title": "A-3 業務數據－南區",
        "url": "https://docs.google.com/spreadsheets/d/1SVekITN5CsuN8sPGxAG052_elKoTxSiNhlm_rW-79r4/edit"
      }
    ],
    "talk": "每區各五筆。中區沒有續約欄，不能自行補假數字。"
  },
  {
    "kind": "content",
    "eyebrow": "GAS B｜核對界線",
    "title": "沒有結果，就不說成功",
    "bullets": [
      "南區阿豪：申辦 10",
      "續約 6；退租 0",
      "15 筆是來源列，不是輸出驗收"
    ],
    "links": [
      {
        "title": "A-3 報表多合一_prompt",
        "url": "https://docs.google.com/document/d/131V_Mrq6YLkWspi1TqqLhPCEWIGS7aK8_iG-16LIvQc/edit"
      }
    ],
    "shot": "完成的合併結果（目前尚無）",
    "talk": "原筆記寫阿豪申辦 1 是錯的，來源是 10。尚無完成的合併表或可執行程式碼。"
  },
  {
    "kind": "result",
    "eyebrow": "帶走三樣",
    "title": "先定義，再核對",
    "bullets": [
      "觀念：條件要寫清楚",
      "模板：欄位＋條件＋輸出＋驗收",
      "行動：匿名副本做一份小報表"
    ],
    "talk": "請學員把本章常用提示詞模板帶走，先從一份沒有敏感資料的小表開始。"
  },
  {
    "kind": "question",
    "eyebrow": "QA／回到開場",
    "title": "AI 給答案，你先查什麼？",
    "bullets": [
      "來源資料列",
      "條件與邊界",
      "清單、筆數、總額"
    ],
    "talk": "回到開場投票。現在請學員說出自己的驗算方法，並提出尚未解決的操作問題。"
  }
];

const P01: Page = () => <Page04 spec={specs04[0]} />;
const P02: Page = () => <Page04 spec={specs04[1]} />;
const P03: Page = () => <Page04 spec={specs04[2]} />;
const P04: Page = () => <Page04 spec={specs04[3]} />;
const P05: Page = () => <Page04 spec={specs04[4]} />;
const P06: Page = () => <Page04 spec={specs04[5]} />;
const P07: Page = () => <Page04 spec={specs04[6]} />;
const P08: Page = () => <Page04 spec={specs04[7]} />;
const P09: Page = () => <Page04 spec={specs04[8]} />;
const P10: Page = () => <Page04 spec={specs04[9]} />;
const P11: Page = () => <Page04 spec={specs04[10]} />;
const P12: Page = () => <Page04 spec={specs04[11]} />;
const P13: Page = () => <Page04 spec={specs04[12]} />;
const P14: Page = () => <Page04 spec={specs04[13]} />;
const P15: Page = () => <Page04 spec={specs04[14]} />;
const P16: Page = () => <Page04 spec={specs04[15]} />;
const P17: Page = () => <Page04 spec={specs04[16]} />;
const P18: Page = () => <Page04 spec={specs04[17]} />;
const P19: Page = () => <Page04 spec={specs04[18]} />;
const P20: Page = () => <Page04 spec={specs04[19]} />;
const P21: Page = () => <Page04 spec={specs04[20]} />;
const P22: Page = () => <Page04 spec={specs04[21]} />;
const P23: Page = () => <Page04 spec={specs04[22]} />;
const P24: Page = () => <Page04 spec={specs04[23]} />;
const P25: Page = () => <Page04 spec={specs04[24]} />;
const P26: Page = () => <Page04 spec={specs04[25]} />;
const P27: Page = () => <Page04 spec={specs04[26]} />;
const P28: Page = () => <Page04 spec={specs04[27]} />;
const P29: Page = () => <Page04 spec={specs04[28]} />;
const P30: Page = () => <Page04 spec={specs04[29]} />;
const P31: Page = () => <Page04 spec={specs04[30]} />;
const P32: Page = () => <Page04 spec={specs04[31]} />;
const P33: Page = () => <Page04 spec={specs04[32]} />;
const P34: Page = () => <Page04 spec={specs04[33]} />;
const P35: Page = () => <Page04 spec={specs04[34]} />;
const P36: Page = () => <Page04 spec={specs04[35]} />;
const P37: Page = () => <Page04 spec={specs04[36]} />;
const P38: Page = () => <Page04 spec={specs04[37]} />;
const P39: Page = () => <Page04 spec={specs04[38]} />;
const P40: Page = () => <Page04 spec={specs04[39]} />;
const P41: Page = () => <Page04 spec={specs04[40]} />;
const P42: Page = () => <Page04 spec={specs04[41]} />;
const P43: Page = () => <Page04 spec={specs04[42]} />;
const P44: Page = () => <Page04 spec={specs04[43]} />;
const P45: Page = () => <Page04 spec={specs04[44]} />;
const P46: Page = () => <Page04 spec={specs04[45]} />;
const P47: Page = () => <Page04 spec={specs04[46]} />;
const P48: Page = () => <Page04 spec={specs04[47]} />;
const P49: Page = () => <Page04 spec={specs04[48]} />;
const P50: Page = () => <Page04 spec={specs04[49]} />;

export const notes: string[] = [
  specs04[0].talk,
  specs04[1].talk,
  specs04[2].talk,
  specs04[3].talk,
  specs04[4].talk,
  specs04[5].talk,
  specs04[6].talk,
  specs04[7].talk,
  specs04[8].talk,
  specs04[9].talk,
  specs04[10].talk,
  specs04[11].talk,
  specs04[12].talk,
  specs04[13].talk,
  specs04[14].talk,
  specs04[15].talk,
  specs04[16].talk,
  specs04[17].talk,
  specs04[18].talk,
  specs04[19].talk,
  specs04[20].talk,
  specs04[21].talk,
  specs04[22].talk,
  specs04[23].talk,
  specs04[24].talk,
  specs04[25].talk,
  specs04[26].talk,
  specs04[27].talk,
  specs04[28].talk,
  specs04[29].talk,
  specs04[30].talk,
  specs04[31].talk,
  specs04[32].talk,
  specs04[33].talk,
  specs04[34].talk,
  specs04[35].talk,
  specs04[36].talk,
  specs04[37].talk,
  specs04[38].talk,
  specs04[39].talk,
  specs04[40].talk,
  specs04[41].talk,
  specs04[42].talk,
  specs04[43].talk,
  specs04[44].talk,
  specs04[45].talk,
  specs04[46].talk,
  specs04[47].talk,
  specs04[48].talk,
  specs04[49].talk,
];

export const meta: SlideMeta = { title: 'CH04｜Google Sheets AI 活用術（下）', createdAt: '2029-12-28T00:00:00.000Z' };
export default [
  P01,
  P02,
  P03,
  P04,
  P05,
  P06,
  P07,
  P08,
  P09,
  P10,
  P11,
  P12,
  P13,
  P14,
  P15,
  P16,
  P17,
  P18,
  P19,
  P20,
  P21,
  P22,
  P23,
  P24,
  P25,
  P26,
  P27,
  P28,
  P29,
  P30,
  P31,
  P32,
  P33,
  P34,
  P35,
  P36,
  P37,
  P38,
  P39,
  P40,
  P41,
  P42,
  P43,
  P44,
  P45,
  P46,
  P47,
  P48,
  P49,
  P50,
] satisfies Page[];


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
  palette: { bg: '#fffaf0', text: '#22180f', accent: '#c2390a' },
  fonts: {
    display: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
    body: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 20,
};

// 額外色票（不在 DesignSystem 範圍內）
const C = {
  muted: '#5e4a36',
  line: '#f0dfbf',
  panel: '#fff0d1',
  berry: '#a3195b',
  dark: '#1e1b3a',
  darkText: '#fffaf0',
  darkMuted: '#cfc6ee',
  gold: '#ffc83d',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Sans+Mono:wght@500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-ch00-1-warmup';
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
      <span>CH00-1｜課前基本能力</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 4 },
  { name: '第一關 帳號與雲端', from: 5, to: 14 },
  { name: '第二關 基本操作', from: 15, to: 22 },
  { name: '第三關 跟 AI 說話', from: 23, to: 43 },
  { name: '收尾', from: 44, to: 46 },
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
const Unit = ({ no, title, goal, time }: { no: string; title: string; goal: string; time: string }) => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', gap: 72 }}>
      <div style={{ fontSize: 220, fontWeight: 900, lineHeight: 1, color: 'var(--osd-accent)', fontFamily: serif, whiteSpace: 'nowrap', flex: 'none' }}>
        {no}
      </div>
      <div>
        <H size={96}>{title}</H>
        <div style={{ fontSize: 42, color: C.muted, marginTop: 24, lineHeight: 1.5 }}>{goal}</div>
        <div style={{ marginTop: 28 }}>
          <Pill>{time}</Pill>
        </div>
      </div>
    </div>
  </Slide>
);

/* ---------- CH00-1 專用 ---------- */

// 鮮亮色塊：大面積底色，上面一律放深色字（對比度皆 ≥ 8）
const F = {
  yellow: '#ffd23f',
  teal: '#2ec4b6',
  pink: '#ff8fab',
  sky: '#6cb8ff',
  mint: '#7ee0a8',
  orange: '#ff9f45',
  ink: '#22180f',
};

const Blk = ({ bg, children, style }: { bg: string; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ background: bg, color: F.ink, borderRadius: 28, padding: '36px 40px', ...style }}>{children}</div>
);

const Ico = ({ children, size = 96 }: { children: ReactNode; size?: number }) => (
  <div style={{ fontSize: size, lineHeight: 1 }}>{children}</div>
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

// 關卡章節頁：左邊大色塊（第幾關＋圖示），右邊標題與目標
const Stage = ({
  no,
  icon,
  bg,
  title,
  goal,
  time,
}: {
  no: string;
  icon: string;
  bg: string;
  title: string;
  goal: string;
  time: string;
}) => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', gap: 80 }}>
      <Blk
        bg={bg}
        style={{
          flex: 'none',
          width: 420,
          height: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          borderRadius: 48,
          transform: 'rotate(-4deg)',
        }}
      >
        <Ico size={150}>{icon}</Ico>
        <div style={{ fontSize: 64, fontWeight: 900 }}>{no}</div>
      </Blk>
      <div>
        <H size={96}>{title}</H>
        <div style={{ fontSize: 44, color: C.muted, marginTop: 24, lineHeight: 1.5 }}>{goal}</div>
        <div style={{ marginTop: 28 }}>
          <Pill>{time}</Pill>
        </div>
      </div>
    </div>
  </Slide>
);

// 編號步驟（色塊圓點）
const StepN = ({ n, bg, children }: { n: string; bg: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
    <div
      style={{
        flex: 'none',
        width: 76,
        height: 76,
        borderRadius: 999,
        background: bg,
        color: F.ink,
        fontSize: 42,
        fontWeight: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div style={{ fontSize: 42, lineHeight: 1.4 }}>{children}</div>
  </div>
);

// 鍵帽
const Key = ({ k }: { k: string }) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: mono,
      fontSize: 34,
      fontWeight: 700,
      background: '#ffffff',
      color: F.ink,
      border: `3px solid ${F.ink}`,
      borderBottomWidth: 8,
      borderRadius: 14,
      padding: '4px 20px',
      margin: '0 6px',
      whiteSpace: 'nowrap',
    }}
  >
    {k}
  </span>
);

const KeyRow = ({ keys, bg, what }: { keys: string[]; bg: string; what: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
    <Blk bg={bg} style={{ flex: '0 0 600px', padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {keys.map((k, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
          {i > 0 ? <span style={{ fontSize: 36, fontWeight: 700 }}>＋</span> : null}
          <Key k={k} />
        </span>
      ))}
    </Blk>
    <div style={{ fontSize: 42, lineHeight: 1.35 }}>{what}</div>
  </div>
);

// 小翻牌卡（方形）：正面大字，背面圖示＋說明；結構與 Flip 相同，backcheck 可檢查
const MiniFlip = ({ front, icon, back, bg }: { front: string; icon: string; back: string; bg: string }) => {
  const [flipped, setFlipped] = useState(false);
  const face: CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '0 20px',
    textAlign: 'center',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  };
  return (
    <div data-osd-interactive onClick={() => setFlipped((f) => !f)} style={{ perspective: 1200, cursor: 'pointer', height: 250 }}>
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
        <div style={{ ...face, background: bg, color: F.ink }}>
          <div style={{ fontFamily: mono, fontSize: 64, fontWeight: 700 }}>{front}</div>
        </div>
        <div style={{ ...face, background: C.dark, color: C.darkText, transform: 'rotateX(180deg)' }}>
          <div style={{ fontSize: 64, lineHeight: 1 }}>{icon}</div>
          <div style={{ fontSize: 32, lineHeight: 1.3 }}>{back}</div>
        </div>
      </div>
    </div>
  );
};

// 深色頁用的截圖待補框
const ShotDark = ({ what, w, h }: { what: string; w: number; h: number }) => (
  <div
    style={{
      flex: 'none',
      width: w,
      height: h,
      border: `4px dashed ${C.darkMuted}`,
      borderRadius: 28,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 28,
      textAlign: 'center',
      color: C.darkMuted,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '0.1em' }}>截圖待補</div>
    <div style={{ fontSize: 28, lineHeight: 1.4 }}>{what}</div>
  </div>
);

// 對話泡泡
const Bubble = ({ who, children, bg }: { who: string; children: ReactNode; bg: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
    <div
      style={{
        flex: 'none',
        width: 84,
        height: 84,
        borderRadius: 999,
        background: C.panel,
        border: `3px solid ${C.line}`,
        fontSize: who === 'AI' ? 34 : 48,
        fontWeight: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {who}
    </div>
    <Blk bg={bg} style={{ padding: '24px 36px', fontSize: 40, lineHeight: 1.5, borderTopLeftRadius: 6 }}>
      {children}
    </Blk>
  </div>
);

// 找碴：點一下，標出 AI 自己補的地方
const Spot = () => {
  const [on, setOn] = useState(false);
  const mark = (t: string) => (
    <span
      style={{
        background: on ? F.pink : 'transparent',
        outline: on ? `4px solid ${C.berry}` : 'none',
        borderRadius: 8,
        padding: '0 6px',
        transition: 'background 300ms',
      }}
    >
      {t}
    </span>
  );
  return (
    <div data-osd-interactive onClick={() => setOn((v) => !v)} style={{ cursor: 'pointer' }}>
      <Card style={{ fontSize: 42, lineHeight: 1.75, padding: '40px 48px', border: `3px solid ${C.line}` }}>
        🎧 輕巧一整天，通勤也有好音質！藍牙 5.3 穩定不斷線，{mark('續航長達 40 小時')}。
        <br />
        {mark('現在只要 990 元')}，{mark('本週下單再送收納袋')}，快分享給朋友！
      </Card>
      <div style={{ fontSize: 30, color: C.muted, marginTop: 20 }}>
        {on ? '粉紅色＝你沒給、AI 自己補的（數字為虛構示意）' : '先找找看，再點一下看答案'}
      </div>
    </div>
  );
};

// 10 大場景：一頁一個
const Scene = ({
  n,
  name,
  when,
  lines,
  ch,
  bg,
}: {
  n: string;
  name: string;
  when: string;
  lines: string[];
  ch?: string;
  bg: string;
}) => (
  <Slide>
    <Eyebrow>場景 {n}／10</Eyebrow>
    <H>
      {name}
      {ch ? <Tag>{ch} 會再深入</Tag> : null}
    </H>
    <Body>
      <Blk bg={bg} style={{ padding: '22px 36px', fontSize: 40, lineHeight: 1.45 }}>
        💭 {when}
      </Blk>
      <Prompt style={{ marginTop: 52 }} size={36} label="提示詞框架" lines={lines} />
    </Body>
  </Slide>
);

const MenuCell = ({ n, name, bg }: { n: string; name: string; bg: string }) => (
  <Blk bg={bg} style={{ padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 8, height: 230 }}>
    <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1 }}>{n}</div>
    <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.3 }}>{name}</div>
  </Blk>
);

/* ---------- 開場 ---------- */

const Cover: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 900 }}>
        <Eyebrow>AI 職場全效生產力應用班｜開課暖身</Eyebrow>
        <h1 style={{ fontFamily: serif, fontSize: 132, fontWeight: 900, lineHeight: 1.15, margin: '0 0 36px' }}>
          先把工具
          <br />
          準備好
        </h1>
        <Blk bg={F.yellow} style={{ display: 'inline-block', padding: '14px 36px', fontSize: 48, fontWeight: 700 }}>
          今天不難，只要跟著做
        </Blk>
      </div>
      <div style={{ position: 'relative', width: 640, height: 600, flex: 'none' }}>
        <Blk bg={F.sky} style={{ position: 'absolute', left: 0, top: 20, width: 300, height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, transform: 'rotate(-6deg)' }}>
          <Ico size={110}>🔑</Ico>
          <div style={{ fontSize: 40, fontWeight: 700 }}>帳號</div>
        </Blk>
        <Blk bg={F.mint} style={{ position: 'absolute', right: 0, top: 120, width: 300, height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, transform: 'rotate(5deg)' }}>
          <Ico size={110}>☁️</Ico>
          <div style={{ fontSize: 40, fontWeight: 700 }}>雲端</div>
        </Blk>
        <Blk bg={F.orange} style={{ position: 'absolute', left: 120, top: 330, width: 300, height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, transform: 'rotate(-2deg)' }}>
          <Ico size={110}>💬</Ico>
          <div style={{ fontSize: 40, fontWeight: 700 }}>問 AI</div>
        </Blk>
      </div>
    </div>
  </Slide>
);

const IceAsk: Page = () => (
  <Slide>
    <Eyebrow>先舉手</Eyebrow>
    <H>你用過 AI 嗎？</H>
    <Body>
      <div style={{ display: 'flex', gap: 36 }}>
        <Blk bg={F.sky} style={{ flex: 1, textAlign: 'center', padding: '48px 32px' }}>
          <Ico size={120}>🙈</Ico>
          <div style={{ fontSize: 64, fontWeight: 900, marginTop: 20 }}>A</div>
          <div style={{ fontSize: 44, fontWeight: 700, marginTop: 8 }}>還沒用過</div>
        </Blk>
        <Blk bg={F.mint} style={{ flex: 1, textAlign: 'center', padding: '48px 32px' }}>
          <Ico size={120}>🙂</Ico>
          <div style={{ fontSize: 64, fontWeight: 900, marginTop: 20 }}>B</div>
          <div style={{ fontSize: 44, fontWeight: 700, marginTop: 8 }}>用過幾次</div>
        </Blk>
        <Blk bg={F.orange} style={{ flex: 1, textAlign: 'center', padding: '48px 32px' }}>
          <Ico size={120}>😎</Ico>
          <div style={{ fontSize: 64, fontWeight: 900, marginTop: 20 }}>C</div>
          <div style={{ fontSize: 44, fontWeight: 700, marginTop: 8 }}>每週都在用</div>
        </Blk>
      </div>
      <Note>選 A 的人最多也沒關係，今天就是從零開始</Note>
    </Body>
  </Slide>
);

const Preview: Page = () => (
  <Slide>
    <Eyebrow>成果預覽</Eyebrow>
    <H>100 分鐘後，你會…</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Blk bg={F.sky} style={{ display: 'flex', alignItems: 'center', gap: 36, padding: '28px 44px' }}>
          <Ico size={88}>✉️</Ico>
          <div style={{ fontSize: 50, fontWeight: 700 }}>寄出第一封給老師的信</div>
        </Blk>
        <Blk bg={F.mint} style={{ display: 'flex', alignItems: 'center', gap: 36, padding: '28px 44px' }}>
          <Ico size={88}>🔗</Ico>
          <div style={{ fontSize: 50, fontWeight: 700 }}>把檔案分享給旁邊的同學</div>
        </Blk>
        <Blk bg={F.orange} style={{ display: 'flex', alignItems: 'center', gap: 36, padding: '28px 44px' }}>
          <Ico size={88}>📝</Ico>
          <div style={{ fontSize: 50, fontWeight: 700 }}>讓 AI 幫你寫出一篇像樣的文案</div>
        </Blk>
      </div>
    </Body>
  </Slide>
);

const Stages: Page = () => (
  <Slide>
    <Eyebrow>今天三關</Eyebrow>
    <H>一關一關過，卡住就舉手</H>
    <Body>
      <div style={{ display: 'flex', gap: 28, alignItems: 'stretch' }}>
        <Blk bg={F.sky} style={{ flex: 1, padding: '40px 32px' }}>
          <Ico size={88}>🔑</Ico>
          <div style={{ fontSize: 36, fontWeight: 700, marginTop: 20 }}>第一關｜30 分</div>
          <div style={{ fontSize: 46, fontWeight: 900, marginTop: 10, lineHeight: 1.3 }}>帳號與雲端</div>
        </Blk>
        <Blk bg={F.mint} style={{ flex: 1, padding: '40px 32px' }}>
          <Ico size={88}>⌨️</Ico>
          <div style={{ fontSize: 36, fontWeight: 700, marginTop: 20 }}>第二關｜20 分</div>
          <div style={{ fontSize: 46, fontWeight: 900, marginTop: 10, lineHeight: 1.3 }}>複製貼上找檔案</div>
        </Blk>
        <Blk bg={F.yellow} style={{ flex: '0 0 220px', padding: '40px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <Ico size={80}>☕</Ico>
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 16 }}>休息 5 分</div>
        </Blk>
        <Blk bg={F.orange} style={{ flex: 1, padding: '40px 32px' }}>
          <Ico size={88}>💬</Ico>
          <div style={{ fontSize: 36, fontWeight: 700, marginTop: 20 }}>第三關｜30 分</div>
          <div style={{ fontSize: 46, fontWeight: 900, marginTop: 10, lineHeight: 1.3 }}>跟 AI 好好說話</div>
        </Blk>
      </div>
      <Note>請準備：手機、自己的 Google 帳號和密碼</Note>
    </Body>
  </Slide>
);

/* ---------- 第一關：帳號與雲端 ---------- */

const U1: Page = () => (
  <Stage no="第一關" icon="🔑" bg={F.sky} title="帳號與雲端" goal="登入、寄信、加入 Classroom，學會分享權限" time="30 分鐘" />
);

const U1Case: Page = () => (
  <Slide>
    <Eyebrow>你可能遇過</Eyebrow>
    <H>「需要存取權」？</H>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 28 }}>
        <Blk bg={F.sky} style={{ textAlign: 'center', padding: '44px 24px', height: 400 }}>
          <Ico size={110}>📨</Ico>
          <div style={{ fontSize: 34, fontWeight: 700, marginTop: 8 }}>①</div>
          <div style={{ fontSize: 40, lineHeight: 1.4, marginTop: 8 }}>同事傳來連結</div>
        </Blk>
        <Blk bg={F.pink} style={{ textAlign: 'center', padding: '44px 24px', height: 400 }}>
          <Ico size={110}>🔒</Ico>
          <div style={{ fontSize: 34, fontWeight: 700, marginTop: 8 }}>②</div>
          <div style={{ fontSize: 40, lineHeight: 1.4, marginTop: 8 }}>點開：要存取權</div>
        </Blk>
        <Blk bg={F.mint} style={{ textAlign: 'center', padding: '44px 24px', height: 400 }}>
          <Ico size={110}>💾</Ico>
          <div style={{ fontSize: 34, fontWeight: 700, marginTop: 8 }}>③</div>
          <div style={{ fontSize: 40, lineHeight: 1.4, marginTop: 8 }}>下載下來改好</div>
        </Blk>
        <Blk bg={F.orange} style={{ textAlign: 'center', padding: '44px 24px', height: 400 }}>
          <Ico size={110}>😱</Ico>
          <div style={{ fontSize: 34, fontWeight: 700, marginTop: 8 }}>④</div>
          <div style={{ fontSize: 40, lineHeight: 1.4, marginTop: 8 }}>雲端還是舊的</div>
        </Blk>
      </div>
      <Note>這一關就是把這四格的問題一次弄懂</Note>
    </Body>
  </Slide>
);

const U1Cloud: Page = () => (
  <Slide>
    <Eyebrow>先懂一個字</Eyebrow>
    <H>雲端＝放在 Google 的抽屜</H>
    <Body>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Blk bg={F.mint} style={{ flex: 1, textAlign: 'center', padding: '40px 24px' }}>
          <Ico size={120}>💻</Ico>
          <div style={{ fontSize: 44, fontWeight: 700, marginTop: 16 }}>你的電腦</div>
          <div style={{ fontSize: 34, marginTop: 8 }}>只有這台看得到</div>
        </Blk>
        <div style={{ fontSize: 72, color: 'var(--osd-accent)', fontWeight: 900 }}>⇄</div>
        <Blk bg={F.sky} style={{ flex: 1.3, textAlign: 'center', padding: '52px 24px' }}>
          <Ico size={150}>☁️</Ico>
          <div style={{ fontSize: 52, fontWeight: 900, marginTop: 16 }}>雲端硬碟</div>
          <div style={{ fontSize: 34, marginTop: 8 }}>檔案放在 Google 的電腦裡</div>
        </Blk>
        <div style={{ fontSize: 72, color: 'var(--osd-accent)', fontWeight: 900 }}>⇄</div>
        <Blk bg={F.orange} style={{ flex: 1, textAlign: 'center', padding: '40px 24px' }}>
          <Ico size={120}>📱</Ico>
          <div style={{ fontSize: 44, fontWeight: 700, marginTop: 16 }}>你的手機</div>
          <div style={{ fontSize: 34, marginTop: 8 }}>同一個帳號就打得開</div>
        </Blk>
      </div>
      <Blk bg={F.yellow} style={{ marginTop: 40, padding: '22px 40px', fontSize: 42, fontWeight: 700, textAlign: 'center' }}>
        🔑 鑰匙只有一把：同一個 Google 帳號
      </Blk>
    </Body>
  </Slide>
);

const U1Who: Page = () => (
  <Slide>
    <Eyebrow>任務 1</Eyebrow>
    <H>看一下：你現在是誰？</H>
    <Body>
      <div style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 36 }}>
          <StepN n="1" bg={F.sky}>打開 Chrome</StepN>
          <StepN n="2" bg={F.sky}>看右上角的圓形頭像</StepN>
          <StepN n="3" bg={F.sky}>點開，確認是哪一個信箱</StepN>
          <Blk bg={F.yellow} style={{ padding: '20px 32px', fontSize: 36, lineHeight: 1.45 }}>
            個人帳號、公司帳號要分清楚：檔案存在哪個帳號，就只有那個帳號看得到
          </Blk>
        </div>
        <ShotTodo what="Chrome 右上角頭像點開後的帳號清單" w={720} h={405} />
      </div>
    </Body>
  </Slide>
);

const U1Mail: Page = () => (
  <Slide>
    <Eyebrow>任務 2｜也是今天的破冰</Eyebrow>
    <H>寄一封信給老師</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <Card style={{ flex: 1, padding: '28px 40px', border: `3px solid ${C.line}` }}>
          <div style={{ display: 'flex', gap: 24, padding: '16px 0', borderBottom: `2px solid ${C.line}`, fontSize: 38 }}>
            <div style={{ flex: '0 0 150px', color: C.muted, fontWeight: 700 }}>收件者</div>
            <div style={{ fontFamily: mono, fontWeight: 700 }}>necva2028@gmail.com</div>
          </div>
          <div style={{ display: 'flex', gap: 24, padding: '16px 0', borderBottom: `2px solid ${C.line}`, fontSize: 38 }}>
            <div style={{ flex: '0 0 150px', color: C.muted, fontWeight: 700 }}>主旨</div>
            <div style={{ fontWeight: 700 }}>
              【AI班】<span style={{ color: 'var(--osd-accent)' }}>學號／姓名</span> 報到
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, padding: '16px 0', fontSize: 38, lineHeight: 1.45 }}>
            <div style={{ flex: '0 0 150px', color: C.muted, fontWeight: 700 }}>內文</div>
            <div>
              我最想讓 AI 幫我做的一件事是<span style={{ color: 'var(--osd-accent)', fontWeight: 700 }}>……</span>
            </div>
          </div>
          <Blk bg={F.pink} style={{ marginTop: 12, padding: '16px 28px', fontSize: 34 }}>
            💌 下課前，老師會挑幾封念出來
          </Blk>
        </Card>
        <ShotTodo what="Gmail「撰寫」視窗，收件者與主旨已填好" w={640} h={360} />
      </div>
      <Note>信箱用複製貼上，不要手打</Note>
    </Body>
  </Slide>
);

const U1Class: Page = () => (
  <Slide>
    <Eyebrow>任務 3</Eyebrow>
    <H>加入我們的 Classroom</H>
    <Body>
      <div style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <StepN n="1" bg={F.sky}>開 classroom.google.com</StepN>
          <StepN n="2" bg={F.sky}>右上角「＋」→「加入課程」</StepN>
          <StepN n="3" bg={F.sky}>輸入課程代碼 →「加入」</StepN>
          <Blk bg={F.yellow} style={{ padding: '24px 36px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>課程代碼</div>
            <div style={{ fontFamily: mono, fontSize: 72, fontWeight: 700, letterSpacing: '0.2em' }}>＿＿＿＿＿＿</div>
          </Blk>
        </div>
        <ShotTodo what="Classroom「＋」→「加入課程」的輸入代碼畫面" w={720} h={405} />
      </div>
    </Body>
  </Slide>
);

const U1Role: Page = () => (
  <Slide>
    <Eyebrow>分享檔案</Eyebrow>
    <H>給誰？給多少權限？</H>
    <Body>
      <div style={{ display: 'flex', gap: 32 }}>
        <Blk bg={F.sky} style={{ flex: 1, textAlign: 'center', padding: '48px 28px' }}>
          <Ico size={120}>👀</Ico>
          <div style={{ fontSize: 56, fontWeight: 900, marginTop: 20 }}>檢視者</div>
          <div style={{ fontSize: 40, marginTop: 12 }}>只能看</div>
        </Blk>
        <Blk bg={F.mint} style={{ flex: 1, textAlign: 'center', padding: '48px 28px' }}>
          <Ico size={120}>💬</Ico>
          <div style={{ fontSize: 56, fontWeight: 900, marginTop: 20 }}>加註者</div>
          <div style={{ fontSize: 40, marginTop: 12 }}>看＋留言</div>
        </Blk>
        <Blk bg={F.orange} style={{ flex: 1, textAlign: 'center', padding: '48px 28px' }}>
          <Ico size={120}>✏️</Ico>
          <div style={{ fontSize: 56, fontWeight: 900, marginTop: 20 }}>編輯者</div>
          <div style={{ fontSize: 40, marginTop: 12 }}>可以直接改</div>
        </Blk>
      </div>
      <Note>原則：給最小就好。只要對方看，就給「檢視者」</Note>
    </Body>
  </Slide>
);

const U1Flip: Page = () => (
  <Slide>
    <Eyebrow>先猜，再翻</Eyebrow>
    <H>這三句，對還是錯？</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Flip front="拿到網址，就一定打得開？" back="不一定。網址是地址，權限才是鑰匙" h={140} />
        <Flip front="下載下來改，雲端會跟著變？" back="不會。下載＝複製一份到電腦" h={140} />
        <Flip front="一台電腦只能登入一個帳號？" back="可以好幾個，所以要看清楚現在是誰" h={140} />
      </div>
    </Body>
  </Slide>
);

const U1Game: Page = () => (
  <Slide>
    <Eyebrow>小遊戲｜兩人一組</Eyebrow>
    <H>改得動嗎？</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <StepN n="A" bg={F.sky}>上傳一份檔案，「共用」給 B，選「檢視者」</StepN>
          <StepN n="B" bg={F.mint}>打開檔案，試著改一個字</StepN>
          <StepN n="A" bg={F.sky}>把 B 改成「編輯者」</StepN>
          <StepN n="B" bg={F.mint}>再改一次 → 成功就舉手 🙌</StepN>
        </div>
        <ShotTodo what="雲端硬碟「共用」視窗，角色下拉選單展開" w={680} h={383} />
      </div>
      <Note>B 第一次改不了，才是對的</Note>
    </Body>
  </Slide>
);

const U1Sum: Page = () => (
  <Slide dark center>
    <div style={{ display: 'flex', alignItems: 'center', gap: 80 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>第一關｜過關檢查</div>
        <H size={92} dark style={{ marginTop: 28, lineHeight: 1.3 }}>
          同一個帳號，
          <br />
          到哪都打得開
        </H>
        <div style={{ fontSize: 40, color: C.darkMuted, marginTop: 40, lineHeight: 1.5 }}>
          手機裝「Google 雲端硬碟」App，
          <br />
          看得到剛剛上傳的檔案＝過關
        </div>
      </div>
      <ShotDark what="手機雲端硬碟 App 的檔案清單（直式）" w={340} h={600} />
    </div>
  </Slide>
);

/* ---------- 第二關：基本操作 ---------- */

const U2: Page = () => (
  <Stage no="第二關" icon="⌨️" bg={F.mint} title="複製貼上找檔案" goal="會用快速鍵、知道檔案下載到哪、看得懂副檔名" time="20 分鐘" />
);

const U2Keys: Page = () => (
  <Slide>
    <Eyebrow>五個快速鍵</Eyebrow>
    <H>學一次，用一整年</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <KeyRow keys={['Ctrl', 'C']} bg={F.mint} what="複製" />
        <KeyRow keys={['Ctrl', 'V']} bg={F.mint} what="貼上" />
        <KeyRow keys={['Ctrl', 'Shift', 'V']} bg={F.yellow} what="只貼文字（不帶網頁格式）" />
        <KeyRow keys={['Win', 'Shift', 'S']} bg={F.sky} what="框選截圖，可直接貼給 Gemini" />
        <KeyRow keys={['Ctrl', 'J']} bg={F.orange} what="打開下載清單，找剛下載的檔案" />
      </div>
      <Note>Mac 把 Ctrl 換成 ⌘；手機是「長按 → 複製／貼上」</Note>
    </Body>
  </Slide>
);

const U2Flip: Page = () => (
  <Slide>
    <Eyebrow>遇到這種狀況，按哪個？</Eyebrow>
    <H>先猜，再翻</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Flip front="網頁貼過來，字體顏色全跟著跑" back="Ctrl＋Shift＋V 只貼文字" h={140} />
        <Flip front="想貼上剛剛複製過的上一筆" back="Win＋V 叫出剪貼簿紀錄" h={140} />
        <Flip front="截了圖，不知道存去哪" back="直接 Ctrl＋V 貼進對話框" h={140} />
      </div>
    </Body>
  </Slide>
);

const U2Dir: Page = () => (
  <Slide>
    <Eyebrow>方向別搞反</Eyebrow>
    <H>上傳 ↑　下載 ↓</H>
    <Body>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <Blk bg={F.sky} style={{ flex: 1, textAlign: 'center', padding: '48px 24px' }}>
          <Ico size={130}>☁️</Ico>
          <div style={{ fontSize: 50, fontWeight: 900, marginTop: 16 }}>雲端硬碟</div>
        </Blk>
        <div style={{ flex: '0 0 560px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Blk bg={F.mint} style={{ padding: '22px 32px', fontSize: 40, fontWeight: 700 }}>⬅ 上傳：電腦 → 雲端</Blk>
          <Blk bg={F.orange} style={{ padding: '22px 32px', fontSize: 40, fontWeight: 700 }}>➡ 下載：雲端 → 電腦</Blk>
          <div style={{ fontSize: 34, color: C.muted, lineHeight: 1.45 }}>下載＝複製一份<br />改電腦那份，雲端不會變</div>
        </div>
        <Blk bg={F.yellow} style={{ flex: 1, textAlign: 'center', padding: '48px 24px' }}>
          <Ico size={130}>💻</Ico>
          <div style={{ fontSize: 50, fontWeight: 900, marginTop: 16 }}>你的電腦</div>
          <div style={{ fontSize: 32, marginTop: 8 }}>預設放在「下載」</div>
        </Blk>
      </div>
      <Note>資料夾＝抽屜：放哪個抽屜，就去哪個抽屜找</Note>
    </Body>
  </Slide>
);

const U2Ext: Page = () => (
  <Slide>
    <Eyebrow>配對遊戲｜大家喊答案</Eyebrow>
    <H>這些檔案是什麼？</H>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 24 }}>
        <MiniFlip front=".pdf" icon="📄" back="排版固定的文件" bg={F.pink} />
        <MiniFlip front=".docx" icon="📝" back="Word 文件" bg={F.sky} />
        <MiniFlip front=".xlsx" icon="📊" back="Excel 試算表" bg={F.mint} />
        <MiniFlip front=".mp4" icon="🎬" back="影片" bg={F.orange} />
        <MiniFlip front=".mp3" icon="🎙️" back="錄音、音訊" bg={F.yellow} />
        <MiniFlip front=".txt" icon="🗒️" back="純文字，沒有格式" bg={F.teal} />
        <MiniFlip front=".md" icon="#️⃣" back="用符號排版的純文字" bg={F.pink} />
        <MiniFlip front="？" icon="🔍" back="看不到副檔名：檔案總管「檢視」→ 勾「副檔名」" bg={F.sky} />
      </div>
    </Body>
  </Slide>
);

const U2Name: Page = () => (
  <Slide>
    <Eyebrow>檔名</Eyebrow>
    <H>哪一個比較好找？</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Blk bg={F.pink} style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '32px 44px' }}>
          <Ico size={80}>❌</Ico>
          <div style={{ fontFamily: mono, fontSize: 44, fontWeight: 700 }}>新增 Microsoft Excel 工作表 (3).xlsx</div>
        </Blk>
        <Blk bg={F.mint} style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '32px 44px' }}>
          <Ico size={80}>✅</Ico>
          <div style={{ fontFamily: mono, fontSize: 44, fontWeight: 700 }}>20261016_報價單_王小明.xlsx</div>
        </Blk>
        <div style={{ fontSize: 44, textAlign: 'center', marginTop: 8 }}>
          公式：<span style={{ fontWeight: 900, color: 'var(--osd-accent)' }}>日期＿內容＿誰</span>
        </div>
      </div>
    </Body>
  </Slide>
);

const U2Sum: Page = () => (
  <Slide dark center>
    <div style={{ display: 'flex', alignItems: 'center', gap: 72 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>第二關｜闖關挑戰</div>
        <H size={80} dark style={{ marginTop: 24, lineHeight: 1.3 }}>
          下載 → 找到 → 上傳
        </H>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 40, fontSize: 40, lineHeight: 1.4 }}>
          <div>① 下載老師資料夾裡的 PDF</div>
          <div>② 按 Ctrl＋J，找到它在電腦哪裡</div>
          <div>③ 上傳到自己的「AI班_姓名」資料夾</div>
        </div>
      </div>
      <ShotDark what="Chrome 下載清單（Ctrl＋J）與「在資料夾中顯示」" w={640} h={360} />
    </div>
  </Slide>
);

const Break: Page = () => (
  <Slide dark center>
    <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>休息時間</div>
    <H size={140} dark style={{ marginTop: 20 }}>
      ☕ 休息 5 分鐘
    </H>
    <div style={{ fontSize: 44, color: C.darkMuted, marginTop: 36 }}>回來前，先打開 gemini.google.com</div>
  </Slide>
);

/* ---------- 第三關：跟 AI 好好說話 ---------- */

const U3: Page = () => (
  <Stage no="第三關" icon="💬" bg={F.orange} title="跟 AI 好好說話" goal="提示詞＝你對 AI 下的指令。說清楚，它才幫得上忙" time="30 分鐘" />
);

const U3Case: Page = () => (
  <Slide>
    <Eyebrow>你可能遇過</Eyebrow>
    <H>「幫我寫 FB 貼文」</H>
    <Body>
      <div style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Bubble who="🙋" bg={F.sky}>幫我寫 FB 貼文</Bubble>
          <Bubble who="AI" bg={C.panel}>
            新品上市！快來看看我們的超棒產品，品質優良、價格實惠，絕對讓你滿意……
          </Bubble>
          <div style={{ alignSelf: 'flex-end' }}>
            <Pill warn>任何產品都能用的空話</Pill>
          </div>
        </div>
        <Blk bg={F.yellow} style={{ flex: '0 0 520px', padding: '36px 40px' }}>
          <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 20 }}>AI 不知道的事</div>
          <div style={{ fontSize: 40, lineHeight: 1.7 }}>
            賣什麼？
            <br />
            寫給誰看？
            <br />
            要多長？
            <br />
            什麼語氣？
          </div>
        </Blk>
      </div>
    </Body>
  </Slide>
);

const U3Chef: Page = () => (
  <Slide>
    <Eyebrow>打個比方</Eyebrow>
    <H>如果 AI 是廚師…</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Blk bg={F.pink} style={{ flex: 1, textAlign: 'center', padding: '44px 32px' }}>
          <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.4 }}>「給我做個東西」</div>
          <div style={{ fontSize: 56, margin: '20px 0' }}>⬇</div>
          <Ico size={140}>🥗</Ico>
          <div style={{ fontSize: 40, marginTop: 16 }}>隨便一盤沙拉</div>
        </Blk>
        <Blk bg={F.mint} style={{ flex: 1, textAlign: 'center', padding: '44px 32px' }}>
          <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.4 }}>「義大利麵、清爽、15 分鐘、兩人份」</div>
          <div style={{ fontSize: 56, margin: '20px 0' }}>⬇</div>
          <Ico size={140}>🍝</Ico>
          <div style={{ fontSize: 40, marginTop: 16 }}>剛好是你要的</div>
        </Blk>
      </div>
    </Body>
  </Slide>
);

const U3Four: Page = () => (
  <Slide>
    <Eyebrow>好問題四要素</Eyebrow>
    <H>角色＋目標＋限制＋格式</H>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        <Blk bg={F.sky} style={{ padding: '30px 40px' }}>
          <div style={{ fontSize: 50, fontWeight: 900 }}>🎭 角色</div>
          <div style={{ fontSize: 38, marginTop: 10, lineHeight: 1.4 }}>你是一位網路行銷專家</div>
        </Blk>
        <Blk bg={F.mint} style={{ padding: '30px 40px' }}>
          <div style={{ fontSize: 50, fontWeight: 900 }}>🎯 目標</div>
          <div style={{ fontSize: 38, marginTop: 10, lineHeight: 1.4 }}>為新款藍牙耳機寫 FB 推廣文案</div>
        </Blk>
        <Blk bg={F.yellow} style={{ padding: '30px 40px' }}>
          <div style={{ fontSize: 50, fontWeight: 900 }}>📏 限制</div>
          <div style={{ fontSize: 38, marginTop: 10, lineHeight: 1.4 }}>18～30 歲台灣年輕人、輕鬆潮流的語氣</div>
        </Blk>
        <Blk bg={F.pink} style={{ padding: '30px 40px' }}>
          <div style={{ fontSize: 50, fontWeight: 900 }}>📋 格式</div>
          <div style={{ fontSize: 38, marginTop: 10, lineHeight: 1.4 }}>標題＋亮點（藍牙 5.3、輕量、長效續航）</div>
        </Blk>
      </div>
    </Body>
  </Slide>
);

const U3Flip: Page = () => (
  <Slide>
    <Eyebrow>同一件事，三種問法</Eyebrow>
    <H>差在哪？翻開看</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Flip front="❌ 幫我寫藍牙耳機的 FB 貼文" back="通用文案，看不出產品特色" hint="點一下看結果" h={150} />
        <Flip front="🔺 加上對象：18～30 歲" back="語氣對了，但亮點是 AI 自己編的" hint="點一下看結果" h={150} />
        <Flip front="✅ 角色、目標、限制、格式都寫" back="有標題、三個亮點都在、語氣一致" hint="點一下看結果" h={150} />
      </div>
    </Body>
  </Slide>
);

const U3Dinner: Page = () => (
  <Slide>
    <Eyebrow>暖身｜大家一起跟做</Eyebrow>
    <H>今晚吃什麼？</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Prompt
            size={34}
            lines={['請幫我規劃一頓晚餐：', '【2 個人】吃、【20 分鐘】內做完、【不吃辣】。', '請列出菜名、材料和步驟。']}
          />
          <Prompt style={{ marginTop: 48 }} size={34} label="再追加一句" lines={['家裡沒有烤箱，請調整。']} />
        </div>
        <ShotTodo what="Gemini 回覆晚餐規劃的畫面" w={640} h={360} />
      </div>
      <Note>看一看：有沒有兩人份？時間在 20 分鐘內？追加後還有沒有用烤箱？</Note>
    </Body>
  </Slide>
);

const U3Tpl: Page = () => (
  <Slide>
    <Eyebrow>今天帶走的模板</Eyebrow>
    <H>萬用填空提示詞</H>
    <Body>
      <Prompt
        size={42}
        lines={[
          '你是一位【角色】。',
          '請幫我【任務】，對象是【給誰看】。',
          '限制：【字數／語氣／不要出現的內容】。',
          '請用【條列／表格／三個版本】的格式回答。',
          '資料裡沒有的內容，請標「待確認」，不要自己編。',
        ]}
      />
      <Note>【　】換成你的內容；送出前，檢查還有沒有沒換掉的【　】</Note>
    </Body>
  </Slide>
);

const U3Spot: Page = () => (
  <Slide>
    <Eyebrow>找碴遊戲｜搶答</Eyebrow>
    <H>AI 偷偷幫你補了什麼？</H>
    <Body>
      <div style={{ fontSize: 36, color: C.muted, marginBottom: 24 }}>你只給了：藍牙 5.3、輕量、長效續航</div>
      <Spot />
    </Body>
  </Slide>
);

const U3Menu: Page = () => (
  <Slide>
    <Eyebrow>10 大職場場景</Eyebrow>
    <H>挑一個最像你工作的</H>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 22 }}>
        <MenuCell n="1" name="會議紀錄" bg={F.sky} />
        <MenuCell n="2" name="客戶溝通模擬" bg={F.mint} />
        <MenuCell n="3" name="簡報開場" bg={F.yellow} />
        <MenuCell n="4" name="數據分析" bg={F.pink} />
        <MenuCell n="5" name="問題拆解" bg={F.orange} />
        <MenuCell n="6" name="Email 公文" bg={F.teal} />
        <MenuCell n="7" name="學習研究" bg={F.sky} />
        <MenuCell n="8" name="專案規劃" bg={F.mint} />
        <MenuCell n="9" name="行銷社群" bg={F.yellow} />
        <MenuCell n="10" name="職涯面試" bg={F.pink} />
      </div>
      <Note>老師現場挑 2～3 個示範，其他的帶回去照著用</Note>
    </Body>
  </Slide>
);

const S1: Page = () => (
  <Scene n="1" name="會議紀錄與摘要" ch="CH02" bg={F.sky} when="開了兩小時的會，老闆要重點、同事要行動清單" lines={['請幫我整理以下【逐字稿／會議筆記】，輸出格式為：', '1. 主要決策', '2. 待辦事項（含負責人）', '3. 下一步行動時間表']} />
);
const S2: Page = () => (
  <Scene n="2" name="客戶溝通模擬" bg={F.mint} when="明天要提案，怕客戶丟出刁難問題，想先演練一遍" lines={['請模擬一位【對象角色】，', '針對以下【方案／提案】提出【數量】個尖銳問題，', '並逐一寫出可能的反駁點。', '我會回覆，你再模擬客戶回應。']} />
);
const S3: Page = () => (
  <Scene n="3" name="簡報與報告開場" ch="CH07" bg={F.yellow} when="報告開頭卡關，想吸引注意又怕太隨便" lines={['我有一份關於【主題】的簡報，', '請幫我設計【數量】種不同風格的開場白：', '1. 正式專業', '2. 輕鬆幽默', '3. 故事帶入']} />
);
const S4: Page = () => (
  <Scene n="4" name="數據分析與視覺化" ch="CH10" bg={F.pink} when="一堆 Excel 數據看不出趨勢，也不知道用什麼圖" lines={['你是一位數據分析師。', '請分析這份【資料類型】，幫我輸出：', '1. 主要成長趨勢', '2. 可能的異常點', '3. 建議適合用【圖表種類】呈現的部分']} />
);
const S5: Page = () => (
  <Scene n="5" name="問題拆解與邏輯整理" bg={F.orange} when="老闆問「專案為什麼延遲？」心裡有答案，卻說不出條理" lines={['請一步一步分析【問題】，輸出格式為：', '1. 背景原因', '2. 三個主要挑戰', '3. 可能解決方案', '最後整理成【時間長度】內能說完的口頭簡報稿。']} />
);
const S6: Page = () => (
  <Scene n="6" name="Email／公文寫作" ch="CH06" bg={F.teal} when="回客戶怕太冷淡，寫給主管又怕太冗長" lines={['請幫我將以下回覆潤色成「【語氣風格】」的', '【語言】商務郵件，長度不超過【字數】。', '', '【貼上你的草稿】']} />
);
const S7: Page = () => (
  <Scene n="7" name="學習與研究助理" ch="CH05" bg={F.sky} when="突然接到陌生主題，只有一天可以準備" lines={['請幫我用【步驟數】步驟解釋【主題】的核心概念，', '並提供【地區／產業】近【時間範圍】的', '【數量】個實際案例。']} />
);
const S8: Page = () => (
  <Scene n="8" name="專案規劃與排程" bg={F.mint} when="接到新專案，不知道從哪裡開始" lines={['你是一位專案經理。', '根據以下【專案目標】，請輸出：', '1. 任務拆解清單', '2. 優先順序（高／中／低）', '3. 【時間範圍】的時間表']} />
);
const S9: Page = () => (
  <Scene n="9" name="行銷與社群內容" ch="CH11" bg={F.yellow} when="每天要發文，靈感卻用完了" lines={['請幫我針對【主題】，', '設計【數量】個【平台類型】的內容，', '要求：【風格／效果】。']} />
);
const S10: Page = () => (
  <Scene n="10" name="職涯與面試準備" bg={F.pink} when="想轉職，履歷不知道怎麼改，面試也沒人陪練" lines={['你是一位【職稱／角色】。', '請幫我檢視這份【履歷／自傳】，', '指出【數量】個需要優化的地方，', '並模擬一場【職位名稱】面試，先問【數量】個常見問題。']} />
);

const U3More: Page = () => (
  <Slide>
    <Eyebrow>一次沒問好？</Eyebrow>
    <H>用追問改，不用重來</H>
    <Body>
      <Prompt size={38} label="追問" lines={['很好。請把它改短成 100 字以內，', '再多給我 2 個不同的標題選擇。']} />
      <div style={{ display: 'flex', gap: 32, marginTop: 44 }}>
        <Blk bg={F.mint} style={{ flex: 1, padding: '28px 36px', fontSize: 40, lineHeight: 1.45 }}>
          ✅ 同一個對話裡追問
          <br />
          AI 記得前面說過的
        </Blk>
        <Blk bg={F.pink} style={{ flex: 1, padding: '28px 36px', fontSize: 40, lineHeight: 1.45 }}>
          ⚠️ 開了新對話
          <br />
          前面的要求要重講一次
        </Blk>
      </div>
    </Body>
  </Slide>
);

const U3Sum: Page = () => (
  <SumX
    label="第三關｜一句話"
    line="說清楚，AI 才幫得上忙"
    sub="角色・目標・限制・格式　｜　重要數字、價格、日期，自己核對"
  />
);

/* ---------- 收尾 ---------- */

const TakeAway: Page = () => (
  <Slide>
    <Eyebrow>今天帶走三樣東西</Eyebrow>
    <H>一個觀念、一組提示詞、一個行動</H>
    <Body>
      <div style={{ display: 'flex', gap: 32 }}>
        <Col tag="觀念" title="先說清楚" body={'角色、目標、限制、格式\nAI 補的資料要核對'} />
        <Col tag="提示詞" title="萬用填空" body={'你是一位【角色】\n請幫我【任務】\n限制、格式寫清楚'} />
        <Col tag="行動" title="這週問一次" body={'用 Gemini 問一件\n工作上真的要做的事'} />
      </div>
    </Body>
  </Slide>
);

const Letters: Page = () => (
  <Slide>
    <Eyebrow>回到開場</Eyebrow>
    <H>老師來念幾封你們的信</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <Blk bg={F.yellow} style={{ flex: 1, padding: '56px 52px', transform: 'rotate(-1.5deg)' }}>
          <Ico size={100}>💌</Ico>
          <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.45, marginTop: 24 }}>
            「我最想讓 AI 幫我做的一件事是……」
          </div>
        </Blk>
        <div style={{ flex: '0 0 560px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 42, fontWeight: 700 }}>再舉手一次：</div>
          <Blk bg={F.sky} style={{ padding: '18px 32px', fontSize: 40 }}>🙈 A 還是有點怕</Blk>
          <Blk bg={F.mint} style={{ padding: '18px 32px', fontSize: 40 }}>🙂 B 回去會試試看</Blk>
          <Blk bg={F.orange} style={{ padding: '18px 32px', fontSize: 40 }}>😎 C 已經想好要問什麼</Blk>
        </div>
      </div>
    </Body>
  </Slide>
);

const Next: Page = () => (
  <Slide center>
    <Eyebrow>下一站</Eyebrow>
    <H size={104}>CH01｜AI 資料整理術</H>
    <div style={{ fontSize: 48, color: 'var(--osd-accent)', fontWeight: 700, marginTop: 24 }}>亂資料，交給 AI 先整理</div>
    <div style={{ display: 'flex', gap: 24, marginTop: 64 }}>
      <Blk bg={F.sky} style={{ padding: '18px 32px', fontSize: 40, fontWeight: 700 }}>🔑 帳號登入好</Blk>
      <Blk bg={F.mint} style={{ padding: '18px 32px', fontSize: 40, fontWeight: 700 }}>⬆ 會上傳檔案</Blk>
      <Blk bg={F.orange} style={{ padding: '18px 32px', fontSize: 40, fontWeight: 700 }}>💬 帶著填空模板</Blk>
    </div>
  </Slide>
);

export const notes: (string | undefined)[] = [
  // 1 封面
  '大家好，歡迎來到 AI 職場全效生產力應用班。正式上課前，我們先花 100 分鐘把工具準備好：帳號、雲端、跟 AI 說話。今天不難，只要跟著做，卡住就舉手。',
  // 2 破冰提問
  '先舉手：你用過 AI 嗎？A 還沒用過、B 用過幾次、C 每週都在用。（記下大概人數，下課前 P45 再問一次。）選 A 的人多也沒關係，這門課就是從零開始設計的。約 2 分鐘。',
  // 3 成果預覽
  '100 分鐘後，你會做到三件事：寄出第一封給我的信、把檔案分享給旁邊的同學、讓 AI 幫你寫出一篇像樣的文案。三件都做到，後面每一章就不會卡在工具上。',
  // 4 三關地圖
  '今天分三關。第一關帳號與雲端 30 分鐘，第二關複製貼上找檔案 20 分鐘，休息 5 分鐘，第三關跟 AI 好好說話 30 分鐘。請把手機拿出來，也確認自己記得 Google 密碼。',
  // 5 第一關章節頁
  '第一關：帳號與雲端，30 分鐘。這一關給最多時間，因為之後每一章都要登入、上傳、分享。',
  // 6 需要存取權
  '這四格大家可能都遇過：同事傳連結叫你改，點開說需要存取權；好不容易打開，下載下來改好，結果雲端上的還是舊的。這一關就是把這四格的問題一次弄懂。約 2 分鐘。',
  // 7 雲端
  '先懂一個字：雲端。雲端就是檔案放在 Google 的電腦裡，不是放在你的電腦。所以換電腦、用手機都打得開，前提只有一個：登入同一個 Google 帳號。帳號就是鑰匙。',
  // 8 任務 1
  '任務一：看一下你現在是誰。打開 Chrome，看右上角的圓形頭像，點開確認信箱。很多人電腦同時登入個人和公司帳號，檔案存到哪個帳號，就只有那個帳號看得到。今天請大家統一用個人帳號。巡場確認每個人都登入了。約 3 分鐘。',
  // 9 任務 2
  '任務二，也是今天的破冰：寄一封信給我。收件者 necva2028@gmail.com，請用複製貼上，不要手打。主旨照格式：【AI班】學號／姓名 報到。內文寫一句：我最想讓 AI 幫我做的一件事是什麼。下課前我會挑幾封念出來。示範：Gmail 左上「撰寫」，填好按「傳送」。約 5 分鐘。常見卡關：信箱打錯一個字，請到「寄件備份」看收件者。',
  // 10 任務 3
  '任務三：加入 Classroom。開 classroom.google.com，右上角「＋」，選「加入課程」，輸入課程代碼。（課程代碼現場寫在白板或螢幕上。）之後的講義、作業都在這裡。找不到課程的同學，多半是用了另一個帳號，切回剛剛那個帳號。選單名稱以當天畫面為準。約 4 分鐘。',
  // 11 三種權限
  '分享檔案有三種角色。檢視者只能看；加註者可以看、可以留言；編輯者可以直接改。原則是給最小就好：只要對方看，就給檢視者；要對方給意見，給加註者；要一起改，才給編輯者。示範：檔案按右鍵「共用」，輸入信箱，選角色，「傳送」。約 3 分鐘。',
  // 12 翻牌
  '先猜再翻。第一句：拿到網址就一定打得開？不一定，網址是地址，權限才是鑰匙。第二句：下載下來改，雲端會跟著變？不會，下載是複製一份。第三句：一台電腦只能登入一個帳號？可以好幾個，所以要看清楚現在是誰。（按 F 進播放模式才能翻。）約 3 分鐘。',
  // 13 小遊戲
  '兩人一組玩一下。A 上傳一份檔案、共用給 B，選檢視者；B 打開試著改一個字，應該改不了，這才是對的；A 再把 B 改成編輯者；B 再改一次，成功就舉手。完成後兩人角色交換。這也是問卷的基礎驗證，可以記錄誰需要協助。約 7 分鐘。',
  // 14 第一關總結
  '最後過關檢查：手機裝 Google 雲端硬碟 App，用同一個帳號登入，看得到剛剛上傳的檔案就過關。這一關只記一句：同一個帳號，到哪都打得開。約 3 分鐘。',
  // 15 第二關章節頁
  '第二關：複製、貼上、找檔案，20 分鐘。之後每一章都是同一個動作：從某處複製資料，貼給 Gemini，再把結果貼回文件或試算表。',
  // 16 快速鍵
  '五個快速鍵，學一次用一整年。Ctrl＋C 複製、Ctrl＋V 貼上；Ctrl＋Shift＋V 只貼文字，從網頁貼過來不會帶一堆格式；Win＋Shift＋S 框選截圖，截好可以直接貼給 Gemini；Ctrl＋J 打開下載清單。Mac 把 Ctrl 換成 Command。請大家每個都按一次。約 5 分鐘。',
  // 17 翻牌
  '遇到這些狀況按哪個？網頁貼過來格式亂掉：Ctrl＋Shift＋V。想貼剛剛複製過的上一筆：Win＋V 叫出剪貼簿紀錄，第一次用要按「開啟」。截了圖不知道存去哪：不用存，直接 Ctrl＋V 貼進對話框。約 2 分鐘。',
  // 18 上傳下載
  '方向別搞反：上傳是電腦到雲端，下載是雲端到電腦。下載等於複製一份，改了電腦那份，雲端的不會變。電腦下載的檔案預設放在「下載」資料夾。資料夾就是抽屜，放在哪個抽屜，就去哪個抽屜找。約 3 分鐘。',
  // 19 副檔名配對
  '配對遊戲：我指一張卡，大家喊答案，再翻開。pdf 是排版固定的文件；docx 是 Word；xlsx 是 Excel；mp4 是影片；mp3 是錄音；txt 是純文字；md 是用符號排版的純文字，AI 回答常用這種格式。最後一張：看不到副檔名的話，檔案總管「檢視」，勾「副檔名」。這些格式大多都能上傳給 Gemini，影片與錄音的大小限制以當天實測為準。約 4 分鐘。',
  // 20 檔名
  '哪個檔名比較好找？當然是下面這個。公式是：日期、內容、誰，用底線隔開。之後交作業也請用這個格式。約 2 分鐘。',
  // 21 闖關
  '第二關闖關：下載我資料夾裡的 PDF，按 Ctrl＋J 找到它在電腦哪裡，點「在資料夾中顯示」；再到雲端硬碟「新增」→「新資料夾」，命名 AI班_姓名，把 PDF 上傳進去。完成舉手。常見卡關：在根目錄按了上傳，要先點進資料夾再上傳。約 4 分鐘。',
  // 22 休息
  '休息 5 分鐘。回來前請先打開 gemini.google.com，用剛剛那個帳號登入。',
  // 23 第三關章節頁
  '第三關：跟 AI 好好說話，30 分鐘。先記一個詞：提示詞，就是你對 AI 下的指令。',
  // 24 FB 貼文
  '大家可能遇過：主管說幫我想一下新產品的 FB 貼文，你輸入「幫我寫 FB 貼文」，得到一篇什麼產品都適用的空話。不是 AI 不會寫，是它不知道你賣什麼、寫給誰看、要多長、什麼語氣。約 2 分鐘。',
  // 25 廚師
  '打個比方：AI 是廚師。你只說「給我做個東西」，可能拿到一盤隨便的沙拉；你說「義大利麵、清爽、15 分鐘、兩人份」，就剛好是你要的。約 2 分鐘。',
  // 26 四要素
  '好問題四要素：角色、目標、限制、格式。用藍牙耳機當例子：角色是網路行銷專家；目標是為新款藍牙耳機寫 FB 推廣文案；限制是 18 到 30 歲台灣年輕人、輕鬆潮流的語氣；格式是要有標題，亮點寫藍牙 5.3、輕量、長效續航。約 3 分鐘。',
  // 27 三種問法
  '同一件事三種問法，先猜再翻。只說寫貼文：通用文案；加上對象：語氣對了，但亮點是 AI 自己編的；四要素都寫：有標題、三個亮點都在、語氣一致。可以現場在 Gemini 跑第一句和第三句比較。完整四要素提示詞見 001-3 原文開頭。約 3 分鐘。',
  // 28 晚餐
  '暖身，大家一起跟做：在 Gemini 輸入晚餐這段，2 個人、20 分鐘、不吃辣。看完結果，在同一個對話再追加一句：家裡沒有烤箱，請調整。檢查三件事：是不是兩人份、時間有沒有在 20 分鐘內、追加後還有沒有用烤箱。結果每個人都不一樣，這是正常的。約 5 分鐘。',
  // 29 萬用模板
  '今天帶走的模板：萬用填空。你是一位什麼角色；請幫我做什麼任務，對象是誰；限制是字數、語氣、不要出現的內容；用條列、表格或三個版本的格式；最後一句很重要：資料裡沒有的請標待確認，不要自己編。請大家複製存起來。約 3 分鐘。',
  // 30 找碴
  '找碴遊戲：我們只給了藍牙 5.3、輕量、長效續航，這段文案裡哪些是 AI 自己補的？搶答後點一下看答案：續航 40 小時、990 元、送收納袋，都是我們沒給的（這段是示意文字，數字是虛構的）。AI 會補看起來很合理的資料，重要的數字、價格、日期一定要自己核對。約 3 分鐘。',
  // 31 場景選單
  '這是 10 個職場最常用的場景，每一個都有填空框架。我今天挑 2 到 3 個示範，其他的請帶回去照著用。（現場依學員舉手或課前問卷結果挑選，直接翻到對應頁：場景 1 在 P32，依序到場景 10 在 P41。）',
  // 32 場景 1
  '場景一：會議紀錄。兩小時的會議，請 AI 整理成主要決策、待辦事項含負責人、下一步時間表。範例：請幫我整理以下「行銷部會議逐字稿」。CH02 會用真的錄音檔練完整流程。',
  // 33 場景 2
  '場景二：客戶溝通模擬。提案前請 AI 扮演挑剔的客戶，先問你尖銳問題。範例：請模擬一位「挑剔的企業客戶」，針對「CRM 系統導入方案」提出 5 個尖銳問題。你回覆後，它會繼續追問，等於提案彩排。',
  // 34 場景 3
  '場景三：簡報開場。請 AI 一次給三種風格：正式專業、輕鬆幽默、故事帶入，你挑一個最適合的。範例主題：電商市場趨勢。CH07、CH08 會做完整簡報。',
  // 35 場景 4
  '場景四：數據分析。請 AI 當數據分析師，看月度銷售報表，給成長趨勢、異常點、建議用折線圖或長條圖。數字一定要回原檔核對。CH03、CH04、CH10 會深入。',
  // 36 場景 5
  '場景五：問題拆解。老闆問專案為什麼延遲，請 AI 一步一步分析背景原因、三個挑戰、解決方案，最後整理成 3 分鐘能講完的口頭簡報稿。',
  // 37 場景 6
  '場景六：Email。把你的草稿貼進去，請 AI 潤色成禮貌但明確的英文商務郵件，不超過 150 字。客戶名稱、金額這些先換掉再貼。CH06 會深入。',
  // 38 場景 7
  '場景七：學習研究。突然接到陌生主題，例如 ESG，請 AI 用 5 個步驟解釋核心概念，並舉台灣近三年的兩個實際案例。案例請自己查證來源。CH05 會教 NotebookLM。',
  // 39 場景 8
  '場景八：專案規劃。請 AI 當專案經理，把新品上市專案拆成任務清單、排高中低優先順序、做兩週時間表。',
  // 40 場景 9
  '場景九：行銷社群。靈感用完時，例如「AI 與日常生活」這個主題，設計 5 個 IG 限動互動問題，要有趣、能吸引參與。CH11 會深入。',
  // 41 場景 10
  '場景十：職涯面試。請 AI 當人資經理，檢視你的履歷指出三個要改的地方，再模擬行銷專員面試，先問三個常見問題。履歷上的電話、地址先拿掉。',
  // 42 追問
  '一次沒問好不用重來，用追問改。例如：很好，請把它改短成 100 字以內，再多給我 2 個不同的標題選擇。在同一個對話裡追問，AI 記得前面說過的；開了新對話，前面的要求就要重講一次。請大家拿剛剛的結果追問一次。約 3 分鐘。',
  // 43 第三關總結
  '第三關只記一句：說清楚，AI 才幫得上忙。角色、目標、限制、格式；重要的數字、價格、日期，自己核對。',
  // 44 帶走三樣
  '今天帶走三樣。觀念：說清楚 AI 才幫得上忙，它補的資料要核對。提示詞：萬用填空模板。行動：這週用 Gemini 問一件工作上真的要做的事，下次上課分享。約 2 分鐘。',
  // 45 念信
  '回到開場：我來念幾封大家寄來的信，「我最想讓 AI 幫我做的一件事」。（挑 3～4 封，順便說這件事會在哪一章學到。）最後再舉手一次：A 還是有點怕、B 回去會試試看、C 已經想好要問什麼，和開場比較一下。約 3 分鐘。',
  // 46 下一站
  '下一站是 CH01 AI 資料整理術：亂資料，交給 AI 先整理。請確認三件事：帳號登入好、會上傳檔案、填空模板存好了。謝謝大家。',
];

export const meta: SlideMeta = {
  title: 'CH00-1｜課前基本能力',
  createdAt: '2030-01-01T00:00:00.000Z',
};

export default [
  Cover,
  IceAsk,
  Preview,
  Stages,
  U1,
  U1Case,
  U1Cloud,
  U1Who,
  U1Mail,
  U1Class,
  U1Role,
  U1Flip,
  U1Game,
  U1Sum,
  U2,
  U2Keys,
  U2Flip,
  U2Dir,
  U2Ext,
  U2Name,
  U2Sum,
  Break,
  U3,
  U3Case,
  U3Chef,
  U3Four,
  U3Flip,
  U3Dinner,
  U3Tpl,
  U3Spot,
  U3Menu,
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
  S9,
  S10,
  U3More,
  U3Sum,
  TakeAway,
  Letters,
  Next,
] satisfies Page[];

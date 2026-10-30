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
  palette: { bg: '#f3f5f7', text: '#1a2430', accent: '#2b5a8a' },
  fonts: {
    display: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
    body: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 20,
};

// 額外色票（不在 DesignSystem 範圍內）
const C = {
  muted: '#4e5d6c',
  line: '#d6dde5',
  panel: '#e6ebf1',
  berry: '#b0431f',
  dark: '#16212d',
  darkText: '#f3f5f7',
  darkMuted: '#b9c6d4',
  gold: '#f0b45a',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Sans+Mono:wght@500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-ch01-data-tidy-1';
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
      <span>CH01｜AI 資料整理術（上）</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 5 },
  { name: '1-1 亂 Excel', from: 6, to: 13 },
  { name: '1-2 多份 PDF', from: 14, to: 20 },
  { name: '1-3 先檢查', from: 21, to: 27 },
  { name: '1-4 跨格式', from: 28, to: 34 },
  { name: '1-5 樣板', from: 35, to: 40 },
  { name: '1-6 實作', from: 41, to: 45 },
  { name: '收尾', from: 46, to: 49 },
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

/* ---------- CH01 專用 ---------- */

import u11Table from './assets/u11-gemini-table.jpg';
import u11Menu from './assets/u11-export-menu.jpg';
import u11Note from './assets/u11-note.jpg';
import u12Bike from './assets/u12-bike-gemini.jpg';
import u12Ui from './assets/u12-nlm-ui.jpg';
import u12NlmTable from './assets/u12-nlm-table.jpg';
import u12P20 from './assets/u12-tow-p20.jpg';
import u12P21 from './assets/u12-tow-p21.jpg';
import u13Tabs from './assets/u13-tabs.jpg';

const Big = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ fontSize: 44, lineHeight: 1.5, ...style }}>{children}</div>
);

const CaseLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    data-osd-interactive
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(event) => event.stopPropagation()}
    style={{
      display: 'inline-block',
      padding: '8px 18px',
      border: '2px solid var(--osd-accent)',
      borderRadius: 12,
      background: C.panel,
      color: 'var(--osd-accent)',
      fontSize: 28,
      fontWeight: 700,
      textDecoration: 'none',
      whiteSpace: 'nowrap',
    }}
  >
    🔗 {children}
  </a>
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

/* ---------- 開場 ---------- */

const Cover: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 980 }}>
        <Eyebrow>AI 職場全效生產力應用班｜第一週・上午</Eyebrow>
        <h1 style={{ fontFamily: serif, fontSize: 120, fontWeight: 900, lineHeight: 1.18, margin: '0 0 36px' }}>
          AI 資料整理術
          <br />
          （上）
        </h1>
        <div style={{ fontSize: 48, color: 'var(--osd-accent)', fontWeight: 500 }}>亂資料，交給 AI 先整理</div>
      </div>
      <svg width="600" height="440" viewBox="0 0 600 440" aria-hidden="true">
        <rect x="10" y="40" width="150" height="56" rx="10" fill={C.panel} stroke={C.muted} strokeWidth="2" transform="rotate(-8 85 68)" />
        <rect x="40" y="150" width="130" height="56" rx="10" fill={C.panel} stroke={C.muted} strokeWidth="2" transform="rotate(6 105 178)" />
        <rect x="0" y="260" width="160" height="56" rx="10" fill={C.panel} stroke={C.muted} strokeWidth="2" transform="rotate(-4 80 288)" />
        <rect x="50" y="360" width="120" height="56" rx="10" fill={C.panel} stroke={C.muted} strokeWidth="2" transform="rotate(9 110 388)" />
        <text x="85" y="78" textAnchor="middle" fontSize="28" fill={C.muted} transform="rotate(-8 85 68)">1/1/2025</text>
        <text x="105" y="188" textAnchor="middle" fontSize="28" fill={C.muted} transform="rotate(6 105 178)">50,000</text>
        <text x="80" y="298" textAnchor="middle" fontSize="28" fill={C.muted} transform="rotate(-4 80 288)">PDF p.23</text>
        <text x="110" y="398" textAnchor="middle" fontSize="28" fill={C.muted} transform="rotate(9 110 388)">錄音</text>
        <text x="235" y="240" textAnchor="middle" fontSize="64" fill="var(--osd-accent)">→</text>
        {[0, 1, 2, 3, 4].map((r) => (
          <g key={r}>
            {[0, 1, 2].map((c) => (
              <rect
                key={c}
                x={300 + c * 98}
                y={60 + r * 66}
                width="98"
                height="66"
                fill={r === 0 ? 'var(--osd-accent)' : C.panel}
                stroke={C.muted}
                strokeWidth="2"
              />
            ))}
          </g>
        ))}
        <text x="349" y="103" textAnchor="middle" fontSize="26" fontWeight="700" fill={C.darkText}>月份</text>
        <text x="447" y="103" textAnchor="middle" fontSize="26" fontWeight="700" fill={C.darkText}>筆數</text>
        <text x="545" y="103" textAnchor="middle" fontSize="26" fontWeight="700" fill={C.darkText}>合計</text>
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
        <Col tag="①" title="每月銷售統計表" body={'100 筆訂單\n一段話變兩張表'} />
        <Col tag="②" title="跨 PDF 對照表" body={'兩份統計報表\n十年數字一張表'} />
        <Col tag="③" title="整理樣板" body={'寫一次\n每個月都能用'} />
      </div>
    </Body>
  </Slide>
);

const Hook: Page = () => (
  <Slide>
    <Eyebrow>先舉手</Eyebrow>
    <H>
      上週你花多少時間
      <br />
      在「對齊格式」？
    </H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Vote n="A">不到 1 小時</Vote>
        <Vote n="B">1～3 小時</Vote>
        <Vote n="C">3 小時以上</Vote>
      </div>
      <Note>複製貼上、挑重點、上網找資料，正是 AI 最能幫上忙的地方</Note>
    </Body>
  </Slide>
);

const Agenda: Page = () => (
  <Slide>
    <Eyebrow>今天的六個單元</Eyebrow>
    <H>一個單元，解決一種亂資料</H>
    <Body>
      <Grid
        cols="140px 1fr"
        size={32}
        rows={[
          ['單元', '主題'],
          ['1-1', '一份 Excel，兩張表'],
          ['1-2', '兩份 PDF，一張對照表'],
          ['1-3', '先檢查，再分類'],
          ['1-4', '三種格式，一份報告'],
          ['1-5', '做一次，用一整年'],
          ['1-6', '實作：你桌上那份資料'],
        ]}
      />
      <Note>請先登入 Google 帳號，打開 Gemini 和雲端硬碟的案例資料夾</Note>
      <div style={{ marginTop: 18 }}>
        <CaseLink href="https://drive.google.com/drive/folders/1tLLfRwkIcIlfoHCXrdtHlWEWXi75nlzo?usp=sharing">CH01</CaseLink>
      </div>
    </Body>
  </Slide>
);

const Ask: Page = () => (
  <Slide>
    <Eyebrow>複習 CH00-1</Eyebrow>
    <H>好問題＝角色＋目標＋限制＋格式</H>
    <Body>
      <div style={{ display: 'flex', gap: 28 }}>
        <Pair tag="角色" title="你是誰" lines={['你是一位網路行銷專家']} />
        <Pair tag="目標" title="要做什麼" lines={['為新款藍牙耳機寫 FB 推廣文案']} />
        <Pair tag="限制" title="條件" lines={['18～30 歲', '輕鬆潮流的語氣']} />
        <Pair tag="格式" title="長什麼樣" lines={['標題＋三個亮點']} />
      </div>
      <Note>還記得萬用填空模板嗎？今天每一段提示詞，都是這四樣的組合</Note>
    </Body>
  </Slide>
);

/* ---------- 1-1 ---------- */

const U1: Page = () => (
  <Unit no="1-1" title="一份 Excel，兩張表" goal="上傳 Excel，請 Gemini 依月份、依產品統計，並自己核對總數" />
);

const U1Safe: Page = () => (
  <Slide>
    <Eyebrow>第一次上傳檔案</Eyebrow>
    <H>上傳之前，先問四件事</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CheckItem>有沒有姓名、電話、身分證字號、帳號？</CheckItem>
        <CheckItem>有沒有薪資、報價、合約金額等公司機密？</CheckItem>
        <CheckItem>公司允不允許把資料放到外部 AI？</CheckItem>
        <CheckItem>用的是公司帳號，還是個人免費帳號？</CheckItem>
      </div>
      <Note>有個資就先換成「客戶A、客戶B」，整理完再換回來；不確定就先問主管</Note>
    </Body>
  </Slide>
);

const U1Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>「每個月賣多少？哪支手機賣最好？」</H>
    <Body>
      <Grid
        cols="200px 1fr 120px 170px 230px 150px"
        size={34}
        rows={[
          ['訂單編號', '產品名稱', '數量', '銷售額', '訂單日期', '地區'],
          ['O0001', 'Sony Xperia 5 V', '3', '4968', '8/17/2023', '台南'],
          ['O0002', 'iPhone 15', '5', '2628', '4/8/2023', '高雄'],
          ['O0003', 'Oneplus 11', '1', '4805', '11/8/2023', '台北'],
          ['…', '…', '…', '…', '…', '…'],
        ]}
      />
      <Note>共 100 筆、10 欄，2023 全年。訂單和用戶資料混在同一張表</Note>
      <Note>用「上傳檔案」，不要貼成文字：4/8/2023 貼成文字可能被讀成 8 月 4 日</Note>
      <div style={{ marginTop: 18 }}>
        <CaseLink href="https://docs.google.com/spreadsheets/d/1fi92uJ9wxHQlszbgLDNCv4a-WSIC71ko/edit?usp=drive_link&amp;ouid=106933289380374061450&amp;rtpof=true&amp;sd=true">CH01_1-1 訂單與用戶資料.xlsx</CaseLink>
      </div>
    </Body>
  </Slide>
);

const U1Raw: Page = () => (
  <Slide>
    <Eyebrow>先用原本的問法</Eyebrow>
    <H>三句話，AI 做了什麼？</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Prompt
            label="提示詞（原文）"
            size={34}
            lines={['統計每一個月個別的銷售額', '哪個品項賣最好 總共賣了多少 賺了多少', '製作成表格']}
          />
          <Note>結果只有一張「產品排行」，每個月的部分不見了</Note>
        </div>
        <Shot src={u11Table} w={600} h={548} />
      </div>
    </Body>
  </Slide>
);

const U1Flip: Page = () => (
  <Slide>
    <Eyebrow>先猜，再翻</Eyebrow>
    <H>差一個字，結果完全不同</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Flip front="「這個月個別的銷售額」" back="AI 把整年當一份，做成產品排行" hint="點一下看結果" h={120} />
        <Flip front="「每一個月的銷售額」" back="1～12 月各一列" hint="點一下看結果" h={120} />
        <Flip front="「賺了多少」" back="沒有成本欄，只能拿銷售額充數" hint="點一下看結果" h={120} />
      </div>
      <Note>截圖裡打的是「這個月」；三件事寫在一起，AI 也容易只挑一件做</Note>
    </Body>
  </Slide>
);

const U1Split: Page = () => (
  <Slide>
    <Eyebrow>改成分開問</Eyebrow>
    <H>明講要兩張表、各有哪些欄位</H>
    <Body>
      <div style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
        <Prompt
          style={{ flex: 1 }}
          size={30}
          lines={[
            '我上傳的是一份 2023 年的訂單明細。',
            '請只根據檔案內容，做兩張表：',
            '1. 每月銷售統計：月份｜訂單數｜銷售數量｜銷售額',
            '   1～12 月各一列，最後一列合計',
            '2. 產品銷售排行：產品名稱｜訂單數｜銷售數量｜銷售額',
            '   依銷售額由高到低',
            '沒有的資料（例如成本）請直接說，不要估算。',
          ]}
        />
        <div style={{ width: 460 }}>
          <Pill>預期結果</Pill>
          <div style={{ marginTop: 12 }}>
            <Grid
              cols="1fr 190px"
              size={34}
              rows={[
                ['月份', '銷售額'],
                ['6 月（最高）', '31,915'],
                ['4 月（最低）', '14,129'],
                ['全年合計', '272,901'],
                ['第一名產品', 'Xperia 5 V'],
              ]}
            />
          </div>
        </div>
      </div>
    </Body>
  </Slide>
);

const U1Export: Page = () => (
  <Slide>
    <Eyebrow>匯出，再自己加一次</Eyebrow>
    <H>表格存進試算表，用 SUM 核對</H>
    <Body>
      <div style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30 }}>
          <Row n="1">表格下方點「⋯」</Row>
          <Row n="2">選「匯出到試算表」</Row>
          <Row n="3">用 SUM 加總銷售額那一欄</Row>
          <Big>
            <Pill>預期結果</Pill>　272,901 元、300 件
          </Big>
        </div>
        <Shot src={u11Menu} w={580} h={346} />
      </div>
      <Note>Excel 檔（.xlsx）放在雲端可以看、可以改；要用 Google 試算表的功能，先「檔案」→「儲存為 Google 試算表」</Note>
    </Body>
  </Slide>
);

const U1Sum: Page = () => (
  <Slide dark center>
    <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>1-1 只記一句</div>
    <H size={96} dark style={{ marginTop: 28, lineHeight: 1.3 }}>
      沒有成本，就算不出賺多少
    </H>
    <div style={{ display: 'flex', gap: 48, alignItems: 'center', marginTop: 44 }}>
      <Shot src={u11Note} w={760} h={282} zoom={false} />
      <div style={{ fontSize: 40, color: C.darkMuted, lineHeight: 1.5 }}>
        AI 用銷售額替你補了假設
        <br />
        要看得出來
      </div>
    </div>
  </Slide>
);

/* ---------- 1-2 ---------- */

const U2: Page = () => (
  <Unit no="1-2" title="兩份 PDF，一張對照表" goal="指定要哪個數字、哪幾年，請 AI 從多份 PDF 做出數據對照表" />
);

const U2Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>「近十年自行車事故，順便跟機車比」</H>
    <Body>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        <Shot src={u12P20} w={350} h={496} />
        <Shot src={u12P21} w={350} h={496} />
        <Pair
          tag="拖吊 2 頁＋事故 6 頁"
          title="每張表都跨兩頁"
          lines={['右頁沒有年份欄', '要靠列的順序對回左頁', '表裡的「-」代表 0']}
        />
      </div>
      <Note>PDF 版面固定、不能直接加總；以前要從 A 文件抄進 B 表格，再寫進 C 報告</Note>
      <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
        <CaseLink href="https://drive.google.com/file/d/1FF6rsEmC67tH_nS9yvprLEK_WUMHqCpZ/view">ch01_1-2-1 托吊統計</CaseLink>
        <CaseLink href="https://drive.google.com/file/d/14CyUhDVpT6C_9RrRxRM4-QIaXtHNwUZD/view">ch01_1-2-2交通事故統計</CaseLink>
      </div>
    </Body>
  </Slide>
);

const U2Prompt: Page = () => (
  <Slide>
    <Eyebrow>先問「有什麼」，再問「要什麼」</Eyebrow>
    <H>分兩次問</H>
    <Body>
      <Prompt
        label="提示詞 1　先問有什麼"
        size={30}
        lines={[
          '我上傳了兩份臺北市的統計 PDF。先不要統計，請告訴我：',
          '1. 每份有幾張表、各是什麼主題、涵蓋哪些年份',
          '2. 哪幾張表有「自行車」，那一欄的意思是什麼',
        ]}
      />
      <Prompt
        label="提示詞 2　再問要什麼"
        size={30}
        style={{ marginTop: 52 }}
        lines={[
          '請做 103～114 年的對照表，欄位：',
          '年別｜肇事者騎自行車的死亡案件數｜死亡者使用自行車的人數｜資料來源',
          '「-」填 0；只用 PDF 的數字，看不清楚的填「？」',
        ]}
      />
      <Note>多模態＝文字、PDF、圖片、錄音都能一起交給 AI；兩份 PDF 一次上傳就好</Note>
    </Body>
  </Slide>
);

const U2Bike: Page = () => (
  <Slide>
    <Eyebrow>先猜，再翻</Eyebrow>
    <H>「自行車」出現兩次，意思不一樣</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Flip front="第 23 頁的「自行車」" back="肇事責任較大的一方騎自行車" hint="點一下看意思" h={120} />
        <Flip front="第 27 頁的「自行車」" back="死亡的人當時騎自行車" hint="點一下看意思" h={120} />
      </div>
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', marginTop: 32 }}>
        <Shot src={u12Bike} w={380} h={310} zoom={false} />
        <div style={{ fontSize: 40, lineHeight: 1.5 }}>
          原文提示詞只說「腳踏車的事故部分」
          <br />
          <span style={{ color: C.muted }}>AI 可能只給一種，或把兩種混成一欄</span>
        </div>
      </div>
    </Body>
  </Slide>
);

const U2Result: Page = () => (
  <Slide>
    <Eyebrow>核對結果</Eyebrow>
    <H>自行車對照表　103～114 年</H>
    <Body>
      <Grid
        cols="300px repeat(12, 1fr)"
        size={32}
        rows={[
          ['年別', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114'],
          ['肇事者騎', '3', '3', '3', '2', '2', '4', '4', '3', '7', '5', '6', '9'],
          ['死者騎', '10', '12', '9', '8', '6', '15', '8', '8', '10', '11', '14', '16'],
        ]}
      />
      <Big style={{ marginTop: 36 }}>
        <Pill>預期結果</Pill>　114 年：9 件、16 人，兩項都是十二年來最高
      </Big>
      <Note>肇事者：第 23 頁死亡肇事車種｜死者：第 27 頁死亡者使用車種｜拖吊統計沒有自行車</Note>
      <Note>抽查挑最後一年、最後一個月；114 年那列是全年，下面的 7～12 月是明細，不能加在一起</Note>
    </Body>
  </Slide>
);

const U2Nlm: Page = () => (
  <Slide>
    <Eyebrow>來源多、要反覆問時</Eyebrow>
    <H>NotebookLM 的「資料表」</H>
    <Body>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        <Shot src={u12Ui} w={1000} h={410} />
        <Shot src={u12NlmTable} w={420} h={410} />
      </div>
      <div style={{ display: 'flex', gap: 22, alignItems: 'center', marginTop: 36 }}>
        <Chip>「新增來源」</Chip>
        <Arrow />
        <Chip>「工作室」</Chip>
        <Arrow />
        <Chip>「資料表」</Chip>
        <Arrow />
        <Chip>「⋮」匯出</Chip>
      </div>
    </Body>
  </Slide>
);

const U2Sum: Page = () => (
  <SumX
    label="1-2 只記一句"
    line="放在一起，才看得到"
    sub={
      <>
        機車被拖吊 22,505 → 4,527 輛；機車死亡 63 → 55 人（103 → 114 年）
        <br />
        兩者沒有因果關係，AI 寫成因果要請它拿掉
      </>
    }
  />
);

/* ---------- 1-3 ---------- */

const U3: Page = () => (
  <Unit no="1-3" title="先檢查，再分類" goal="請 AI 先找出資料的問題，確認後再拆工作表、做彙總" />
);

const U3Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>一份 709 筆的收支流水帳</H>
    <Body>
      <Grid
        cols="200px 180px 160px 1fr 170px"
        size={34}
        rows={[
          ['日期', '類別', '子類別', '細目', '金額'],
          ['1/1/2025', '收入', '正職', '1 月薪資發放 - 公司入帳', '50,000'],
          ['1/3/2025', '支出', '食物', '85 度 C 咖啡', '120'],
          ['1/5/2025', '儲蓄', '買房', '房屋基金儲蓄 - 每月定存', '15,000'],
          ['1/5/2025', '固定開銷', '電話費', '手機月租費', '999'],
        ]}
      />
      <Prompt label="提示詞（原文）" size={32} style={{ marginTop: 26 }} lines={['幫我直接增加 Excel 的工作表來做這些分類的部分']} />
      <Note>業績、庫存、客戶資料也一樣：分類、細目統計交給 AI 很快，前提是資料先檢查過</Note>
      <div style={{ marginTop: 8 }}>
        <CaseLink href="https://docs.google.com/spreadsheets/d/1XZT2gpFnMKZR7ZFuweXCPA2jiJpg27dd/edit?usp=drive_link&amp;ouid=106933289380374061450&amp;rtpof=true&amp;sd=true">CH01_1-3 交易紀錄</CaseLink>
      </div>
    </Body>
  </Slide>
);

const U3Flip: Page = () => (
  <Slide>
    <Eyebrow>先猜，再翻</Eyebrow>
    <H>支出裡，哪一項花最多？</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Flip front="直接問 AI" back="「購物」193,675" hint="點一下看答案" h={128} />
        <Flip front="刪掉重複的 58 筆再問" back="「學習」179,317（購物 175,675）" hint="點一下看答案" h={128} />
      </div>
      <Note>同一份檔案，答案整個翻過來。問題出在資料，不是 AI</Note>
    </Body>
  </Slide>
);

const U3Issues: Page = () => (
  <Slide>
    <Eyebrow>這份資料本來就有的問題</Eyebrow>
    <H>四個問題，打開檔案一眼看不出來</H>
    <Body>
      <Grid
        cols="70px 340px 1fr"
        size={36}
        warnCol={1}
        rows={[
          ['#', '問題', '在哪裡'],
          ['1', '重複貼上一段', '第 2～59 列（58 筆）後面又出現一次；第 60 列日期跳回 1/1'],
          ['2', '日期是文字', '看起來是日期，其實是「1/1/2025」這樣的文字'],
          ['3', '摘要月份不對', '60 筆，例如 2/2 那筆寫「3 月房租繳費」'],
          ['4', '同月多筆薪資', '4～12 月每月 3 筆；不一定是錯，要人確認'],
        ]}
      />
    </Body>
  </Slide>
);

const U3Check: Page = () => (
  <Slide>
    <Eyebrow>第一步</Eyebrow>
    <H>只找問題，不要改</H>
    <Body>
      <div style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
        <Prompt
          style={{ flex: 1 }}
          size={30}
          lines={[
            '我上傳的是一份收支流水帳。',
            '先不要整理，請檢查資料品質：',
            '1. 有沒有重複？是哪幾列、怎麼判斷的',
            '2. 日期欄是真的日期，還是文字？',
            '3. 「細目」的月份和「日期」對得上嗎？',
            '   列出筆數和三個例子',
            '4. 共幾筆、日期範圍、各類別幾筆',
            '只列問題，不要自己改資料。',
          ]}
        />
        <ShotTodo what="Gemini 回覆的資料品質檢查結果" w={460} h={500} />
      </div>
    </Body>
  </Slide>
);

const U3Sort: Page = () => (
  <Slide>
    <Eyebrow>第二步</Eyebrow>
    <H>寫清楚規則，再分類</H>
    <Body>
      <div style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
        <Prompt
          style={{ flex: 1 }}
          size={30}
          lines={[
            '1. 刪除第 2～59 列（重複的那段），其他不動',
            '2. 月份一律看「日期」欄，不看「細目」',
            '3. 新增工作表：收入、支出、固定開銷、儲蓄',
            '4. 新增「分類彙總」：類別｜子類別｜筆數｜金額',
            '5. 金額保持數字格式',
          ]}
        />
        <Shot src={u13Tabs} w={400} h={282} />
      </div>
      <div style={{ marginTop: 36 }}>
        <Grid
          cols="200px repeat(4, 1fr)"
          size={34}
          rows={[
            ['刪除後', '收入', '固定開銷', '支出', '儲蓄'],
            ['筆數', '145', '144', '218', '144'],
            ['金額', '2,462,501', '843,155', '617,488', '1,374,209'],
          ]}
        />
      </div>
      <Note>AI 給的檔案是 .xlsx；要在雲端協作，上傳後「檔案」→「儲存為 Google 試算表」</Note>
    </Body>
  </Slide>
);

const U3Sum: Page = () => (
  <SumX
    label="1-3 只記一句"
    line="刪資料，由人決定"
    sub="練習：用 1-1 的訂單檔做客戶分級——A 級 3 位、B 級 13 位、C 級 4 位"
  />
);

/* ---------- 1-4 ---------- */

const U4: Page = () => (
  <Unit no="1-4" title="三種格式，一份報告" goal="PDF、錄音、簡報一起交給 AI，整理成一份標明出處的報告" />
);

const U4Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>會開完了，老闆要一份報告</H>
    <Body>
      <div style={{ display: 'flex', gap: 32 }}>
        <Col tag="PDF" title="7 頁文章" body={'AI 與社群影音\n行銷的未來發展'} />
        <Col tag="MP3" title="4 分鐘會議" body={'十日家居新品會議\nEmily、Alan'} />
        <Col tag="圖片" title="會議簡報" body={'含工作分配表\n（待補）'} />
      </div>
      <Note>Word 檔、試算表也一樣可以一起上傳</Note>
      <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
        <CaseLink href="https://drive.google.com/file/d/1VRKtKLwWh4SBYT-VdOPhYPnvNFsOWaYQ/view?usp=drive_link">ch01_1-4-1 PDF 文件</CaseLink>
        <CaseLink href="https://drive.google.com/file/d/10JR_Af5StLxBBPZaj9JjNzpayjbSlyyO/view?usp=drive_link">ch01_1-4-2 會議錄音</CaseLink>
      </div>
    </Body>
  </Slide>
);

const U4Raw: Page = () => (
  <Slide>
    <Eyebrow>原本的問法</Eyebrow>
    <H>可以直接用</H>
    <Body>
      <div style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
        <Prompt
          label="提示詞（原文）"
          style={{ flex: 1 }}
          size={30}
          lines={[
            '你是一位資深商業顧問。',
            '我上傳了這次專案相關的 PDF 資料、',
            '簡報圖片以及會議錄音 MP3。',
            '請分析並整理生成一份專業、嚴謹且',
            '條理分明的報告。報告請使用繁體中文，',
            '並以 Google 文件的排版邏輯進行呈現。',
          ]}
        />
        <ShotTodo what="Gemini 同時上傳 PDF、MP3、圖片的對話框" w={480} h={460} />
      </div>
      <Note>但「專業、嚴謹」每個人想的不一樣，報告長什麼樣要自己訂</Note>
    </Body>
  </Slide>
);

const U4Better: Page = () => (
  <Slide>
    <Eyebrow>加三件事：每份是什麼、要哪幾段、標出處</Eyebrow>
    <H>改良版</H>
    <Body>
      <Prompt
        size={30}
        lines={[
          '我上傳了三份資料：',
          '1. PDF：AI 與社群影音行銷趨勢的文章',
          '2. MP3：今天新品行銷會議的錄音',
          '3. 圖片：會議簡報，含各部門工作分配表',
          '請整理成報告，段落：一、會議摘要　二、新品與客群',
          '三、三大策略　四、預定目標　五、AI 趨勢（引用 PDF）',
          '六、分工與待辦　七、待確認事項',
          '每段結尾標（出處：PDF／錄音／簡報）',
          '沒提到的寫「資料未提及」，聽不清楚的不要猜',
        ]}
      />
    </Body>
  </Slide>
);

const U4Check: Page = () => (
  <Slide>
    <Eyebrow>核對結果</Eyebrow>
    <H>報告裡的數字對不對？</H>
    <Body>
      <div style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Grid
            cols="1fr 340px"
            size={36}
            rows={[
              ['錄音裡的目標', '數字'],
              ['首月新品銷售', '5,000 件'],
              ['官方社群粉絲', '成長 20%'],
              ['貼文與短影音互動率', '提升 30%'],
              ['電商平台評價', '500 則以上'],
              ['評分', '4.8 星以上'],
            ]}
          />
        </div>
        <ShotTodo what="Gemini 產出的報告（含出處標示）" w={460} h={520} />
      </div>
    </Body>
  </Slide>
);

const U4Flip: Page = () => (
  <Slide>
    <Eyebrow>先猜，再翻</Eyebrow>
    <H>缺資料時，AI 會自己補</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Flip front="沒給分配表，第六段卻有分工" back="AI 自己編的，不能用" hint="點一下看答案" h={116} />
        <Flip front="第六段寫「資料未提及」" back="正確：沒有就說沒有" hint="點一下看答案" h={116} />
        <Flip front="「十日家居」變成「時日家居」" back="錄音辨識錯字，先給名單或人工核對" hint="點一下看答案" h={116} />
      </div>
      <Note>課堂練習：只上傳 PDF 和 MP3，看第六段 AI 寫了什麼</Note>
    </Body>
  </Slide>
);

const U4Sum: Page = () => <SumX label="1-4 只記一句" line="每一段都要說得出「從哪來」" />;

/* ---------- 1-5 ---------- */

const U5: Page = () => (
  <Unit no="1-5" title="做一次，用一整年" goal="把每月要做的整理寫成樣板：換人、換月份，結果都一樣" />
);

const U5Four: Page = () => (
  <Slide>
    <Eyebrow>一件事做超過三次，就做成樣板</Eyebrow>
    <H>四段公式：線框 → 痛點 → 期待 → 驗收</H>
    <Body>
      <Grid
        cols="200px 1fr"
        size={38}
        rows={[
          ['段', '本案例怎麼寫'],
          ['① 線框', '每月訂單明細 Excel：訂單編號、產品、數量、銷售額、日期…'],
          ['② 痛點', '每次問，欄位和格式都不一樣，要手動對齊'],
          ['③ 期待', '直接貼出表頭＋一列範例'],
          ['④ 驗收', '欄位不能改、金額純數字、沒資料寫「—」、結尾回報合計'],
        ]}
      />
    </Body>
  </Slide>
);

const U5Prompt: Page = () => (
  <Slide>
    <Eyebrow>銷售月報樣板（精簡版）</Eyebrow>
    <H>存起來，每個月貼一次</H>
    <Body>
      <Prompt
        size={30}
        lines={[
          '【固定規則，之後每個月都照這個做】',
          '輸入：訂單明細 Excel＋我指定的月份',
          '輸出：月份｜訂單數｜銷售數量｜銷售額｜比上月增減｜銷售額最高產品',
          '範例：2023-06｜10｜36｜31915｜+27.5%｜Google Pixel 8（10050）',
          '規則：',
          '- 欄位和順序不能改，金額只寫數字',
          '- 增減用百分比、小數一位；沒有上月就寫「—」',
          '- 沒有的資料寫「—」，不要估算',
          '- 結尾：本月共 N 筆訂單，產品明細合計 X',
          '聽懂請回「OK，請告訴我月份」',
        ]}
      />
    </Body>
  </Slide>
);

const U5Test: Page = () => (
  <Slide>
    <Eyebrow>交接測試</Eyebrow>
    <H>換人、換月份，還一樣嗎？</H>
    <Body>
      <Grid
        cols="170px 180px 120px 160px 150px 190px 1fr"
        size={32}
        rows={[
          ['誰', '月份', '訂單', '數量', '銷售額', '比上月', '最高產品'],
          ['同學 A', '2023-06', '10', '36', '31915', '+27.5%', 'Pixel 8（10050）'],
          ['同學 B', '2023-04', '6', '17', '14129', '-38.1%', 'iPhone 15（6051）'],
        ]}
      />
      <Big style={{ marginTop: 40 }}>欄位、順序、格式一模一樣，樣板才算完成</Big>
      <Note>只要有一處不同，就回到第 ④ 段，把規則寫得更死</Note>
    </Body>
  </Slide>
);

const U5Ways: Page = () => (
  <Slide>
    <Eyebrow>樣板存在哪裡</Eyebrow>
    <H>三種固定方式</H>
    <Body>
      <div style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Grid
            cols="90px 280px 1fr"
            size={36}
            rows={[
              ['', '方式', '怎麼用'],
              ['A', '存成筆記', '每次開新對話先貼上'],
              ['B', '做成 Gem', '樣板貼進「指示」，以後只要上傳檔案'],
              ['C', '空白試算表', '先做好表頭，請 AI 照欄位填'],
            ]}
          />
        </div>
        <ShotTodo what="Gemini 建立 Gem 的畫面，指示欄貼上樣板" w={480} h={480} />
      </div>
    </Body>
  </Slide>
);

const U5Sum: Page = () => (
  <SumX
    label="1-5 只記一句"
    line="給誰用都一樣，才算樣板"
    sub={
      <>
        練習：用樣板跑 12 月 → 23052、+12.3%、Sony Xperia 5 V（11656）
        <br />
        將來公司要做自動化，這份樣板就是交給 IT 的需求說明
      </>
    }
  />
);

/* ---------- 1-6 ---------- */

const U6: Page = () => (
  <Unit no="1-6" title="實作：你桌上那份資料" goal="用今天的方法整理自己的資料，帶走一份能重複使用的樣板" />
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
          ['1', '上傳前檢查：去識別、確認公司規定'],
          ['2', '先檢查：請 AI 說出資料有什麼問題'],
          ['3', '再整理：指定欄位、規則、要幾張表'],
          ['4', '核對：總數、頭尾、抽三筆回原檔'],
          ['5', '存成樣板，兩兩分享'],
        ]}
      />
    </Body>
  </Slide>
);

const U6Prompt: Page = () => (
  <Slide>
    <Eyebrow>依序使用，【 】換成你的內容</Eyebrow>
    <H>三段提示詞</H>
    <Body>
      <Prompt
        label="① 先檢查"
        size={30}
        lines={['我上傳的是【資料名稱】。先不要整理，請告訴我：', '共幾筆、有哪些欄位、有沒有重複或格式不一的地方']}
      />
      <Prompt
        label="② 再整理"
        size={30}
        style={{ marginTop: 44 }}
        lines={[
          '請整理成表格，欄位：【欄位1】｜【欄位2】｜【欄位3】',
          '規則：【日期 YYYY-MM-DD、金額只留數字】。沒有的寫「—」，最後回報筆數與合計',
        ]}
      />
      <Prompt
        label="③ 讓 AI 自己先招"
        size={30}
        style={{ marginTop: 44 }}
        lines={['最後分兩區列出：哪些是照抄我的資料、哪些是你推論的（標高／中／低把握）']}
      />
    </Body>
  </Slide>
);

const U6List: Page = () => (
  <Slide>
    <Eyebrow>完成檢核</Eyebrow>
    <H>完成了嗎？</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CheckItem>一份整理好的表格或報告，已匯出</CheckItem>
        <CheckItem>至少一項數字，自己核對過</CheckItem>
        <CheckItem>一則筆記「〈某報表〉整理樣板」</CheckItem>
        <CheckItem>說得出：原本亂在哪、哪一句提示詞解決</CheckItem>
      </div>
      <Note>沒帶資料：用 1-3 的交易紀錄整理每月支出 → 合計 617,488，最多的是「學習」</Note>
    </Body>
  </Slide>
);

const U6Share: Page = () => (
  <Slide>
    <Eyebrow>分享</Eyebrow>
    <H>兩兩互看，說一句</H>
    <Body>
      <Card style={{ padding: '56px 56px' }}>
        <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 700, lineHeight: 1.5 }}>
          「我的資料原本亂在＿＿＿＿，
          <br />
          我用『＿＿＿＿』這一句解決。」
        </div>
      </Card>
      <Note>每組推派 1 位分享，1 人 1 分鐘</Note>
    </Body>
  </Slide>
);

/* ---------- 收尾 ---------- */

const QA: Page = () => (
  <Slide center>
    <Eyebrow>Q &amp; A</Eyebrow>
    <H size={120}>有問題嗎？</H>
    <div style={{ fontSize: 44, color: C.muted, marginTop: 36 }}>上傳不了、結果對不上，都可以現在問</div>
  </Slide>
);

const TakeAway: Page = () => (
  <Slide>
    <Eyebrow>今天帶走三樣東西</Eyebrow>
    <H>一個觀念、一組提示詞、一個行動</H>
    <Body>
      <div style={{ display: 'flex', gap: 32 }}>
        <Col tag="觀念" title="先檢查再核對" body={'亂資料先請 AI 找問題\n整理完自己加總\n合計對了才交出去'} />
        <Col tag="提示詞" title="整理四句話" body={'我上傳的是【資料】\n欄位：【A｜B｜C】\n沒有的寫「—」\n最後回報筆數與合計'} />
        <Col tag="行動" title="下週做一份樣板" body={'挑最常整理的報表\n照四段公式寫好\n存成筆記'} />
      </div>
    </Body>
  </Slide>
);

const Next: Page = () => (
  <Slide>
    <Eyebrow>下一章</Eyebrow>
    <H>CH02：錄音檔變會議記錄</H>
    <Body>
      <Grid
        cols="130px 1fr"
        size={38}
        rows={[
          ['單元', '主題'],
          ['2-1', '定期追蹤市場資訊、競品動態'],
          ['2-2', '會議錄音轉逐字稿，整理行動事項'],
          ['2-3', '客戶通話記錄、訪談摘要的結構化重點'],
          ['2-4', '語音備忘錄整理成條列筆記'],
          ['2-5', '摘要樣板，統一會議記錄格式'],
          ['2-6', '實作：帶音檔，生成會議記錄與行動清單'],
        ]}
      />
    </Body>
  </Slide>
);

const Closing: Page = () => (
  <Slide>
    <Eyebrow>回到開場</Eyebrow>
    <H>
      下週對齊格式的時間，
      <br />
      能少一半嗎？
    </H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Vote n="A">可以，回去就做樣板</Vote>
        <Vote n="B">還要再練習</Vote>
        <Vote n="C">我有新的問題</Vote>
      </div>
    </Body>
  </Slide>
);

export const notes: (string | undefined)[] = [
  // 1 封面
  '大家早安，歡迎來到 AI 職場全效生產力應用班。第一週上午是 AI 資料整理術的上篇。每個人桌上都有一堆亂資料：格式不一的 Excel、抄不完的 PDF、開完會的錄音。今天的目標是：這些東西交給 AI 先整理，人只負責檢查和核對。',
  // 2 成果預覽
  '先看今天做完會有什麼。第一，一份每月銷售統計表，一百筆訂單用一段話變兩張表。第二，一張跨兩份 PDF 的數據對照表。第三，一份每個月都能重複使用的整理樣板。三樣都會在課堂上做出來。',
  // 3 開場提問
  '先舉手：上週你花多少時間在對齊格式，也就是複製貼上、改日期、調欄位這些事？不到一小時舉 A，一到三小時舉 B，三小時以上舉 C。我記一下人數，下課前再問一次。畫面下方這句：複製貼上、挑重點、上網找資料，這些機械工作正是 AI 最能幫上忙的地方。',
  // 4 目錄
  '今天六個單元，前五個是講解、示範、跟做，最後一個是實作。請大家現在登入 Google 帳號，打開 Gemini，再打開雲端硬碟裡今天的案例資料夾，等一下要上傳檔案。',
  // 5 提問力
  '快速複習 CH00-1：好問題四要素，角色、目標、限制、格式。還是藍牙耳機的例子：網路行銷專家是角色；寫 FB 推廣文案是目標；18 到 30 歲、輕鬆潮流是限制；要有標題和三個亮點是格式。今天每一段提示詞都是這四樣的組合，等一下講到提示詞，我會指出哪句是哪一樣。',
  // 6 1-1 章節頁
  '第一個單元：一份 Excel，兩張表。',
  // 7 上傳前檢查
  '今天是全課第一次上傳檔案，先停下來問四件事。有沒有個資？有沒有公司機密？公司允不允許用外部 AI？用的是公司帳號還是個人免費帳號？今天的案例檔都是虛構資料，可以放心上傳；回公司用自己的資料，有個資就先把姓名換成客戶 A、客戶 B，整理完再用尋找取代換回來。不確定公司規定，就先問主管。',
  // 8 情境
  '主管說：把今年的訂單整理一下，看每個月賣多少、哪支手機賣最好。檔案是一百筆訂單、十個欄位，2023 年全年。它亂在哪裡？訂單和用戶資料混在同一張表，同一個客戶的姓名、地區每一筆都重複出現；日期是月、日、年的格式。請用上傳檔案，不要複製貼上成文字：貼成文字時，4/8/2023 這種日期可能被讀成 8 月 4 日。',
  // 9 原文提示詞
  '先用原本的問法跑一次。示範：在 Gemini 按加號，上傳 CH01_1-1 訂單與用戶資料，貼上這三句話。看結果：AI 給了一張產品排行，Sony Xperia 5 V 第一，可是每個月的部分不見了。請大家跟著做，看自己的結果是不是也一樣。',
  // 10 翻牌
  '為什麼？三張卡先猜再翻。第一張：截圖裡打的是「這個月」，AI 就把整年當成一份。第二張：要的是「每一個月」，才會 1 到 12 月各一列。第三張：賺了多少，檔案裡沒有成本，AI 只能拿銷售額充數。另外，三件事寫在同一句，AI 很容易只挑一件做。',
  // 11 分開問
  '改成分開問：明講要兩張表，每張表要哪些欄位。最後一句很重要：沒有的資料直接說，不要估算。請大家在同一個對話貼上這段。核對：6 月最高 31,915，4 月最低 14,129，全年合計 272,901，第一名還是 Sony Xperia 5 V，銷售額 58,512、67 件。',
  // 12 匯出
  '表格出來後，滑到表格下方，點三個點，選匯出到試算表，會開一份新的 Google 試算表。用 SUM 把銷售額那一欄加起來，應該是 272,901 元、300 件。對得上才算完成。常見問題：匯出的金額變成文字，請 AI 金額只留數字，或在試算表用格式、數字轉換。Excel 檔和 Google 試算表的差別：雲端硬碟裡的 xlsx 可以看、可以改，但部分 Google 功能要先另存為 Google 試算表。',
  // 13 總結
  '這個單元只記一句：沒有成本，就算不出賺多少。截圖裡 Gemini 自己註明了以總銷售額計算，它是在替你補假設。你要看得出來，而且在提示詞裡先講：沒有的資料直接說。',
  // 14 1-2 章節頁
  '第二個單元：兩份 PDF，一張對照表。',
  // 15 情境
  '主管丟來兩份臺北市的統計報表 PDF：幫我整理近十年自行車事故的數字，順便跟機車比一下。PDF 的版面是固定的，適合給人看，不能直接加總；以前要從 A 文件抄進 B 表格、再寫進 C 報告，一格一格抄。注意這兩份 PDF 的特性：一張表跨兩頁，右頁沒有年份欄，要靠列的順序對回左頁；表格裡的橫線代表 0。點一下可以放大看。',
  // 16 提示詞
  '分兩次問。第一次只問有什麼：每份有幾張表、各是什麼主題、哪幾張有自行車、那一欄是什麼意思。確認 AI 讀對了，第二次再請它做對照表，並寫明橫線填 0、看不清楚填問號、附上資料來源。示範：兩份 PDF 一起上傳，先貼提示詞 1。順便說一個詞：多模態，就是文字、PDF、圖片、錄音都能一起交給 AI 讀。',
  // 17 兩種自行車
  '先猜再翻。第 23 頁的自行車，是肇事責任較大的一方騎自行車；第 27 頁的自行車，是死掉的人當時騎自行車，不一定是肇事者。原文提示詞只說腳踏車的事故部分，AI 可能只給一種，或把兩種混成一欄。左下是 Gemini 的回答，它有分成兩部分，這是好的結果。',
  // 18 結果
  '核對結果。肇事者騎自行車：103 到 114 年是 3、3、3、2、2、4、4、3、7、5、6、9。死者騎自行車：10、12、9、8、6、15、8、8、10、11、14、16。114 年兩項都是十二年來最高。拖吊統計那份沒有自行車，AI 如果硬給數字就是錯的。抽查時挑最後一年和最後一個月，跨頁錯位最容易在那裡被發現。另外，114 年那列是全年，下面的 7 到 12 月是月份明細，不能加在一起。',
  // 19 NotebookLM
  '如果來源很多、要反覆問，用 NotebookLM。新增來源把 PDF 上傳，右邊工作室點資料表，產生後點右上三個點匯出。右邊是產生的資料表，103 到 112 年的數字和我們的對照表一致。',
  // 20 總結
  '這個單元只記一句：放在一起，才看得到。機車被拖吊的數量十二年少了八成，從兩萬兩千多輛降到四千五百多輛；機車死亡人數卻沒有跟著降。這是把兩份報表放在一起才看得到的事。但兩者沒有因果關係，如果 AI 寫出拖吊減少導致死亡增加，要請它拿掉。',
  // 21 1-3 章節頁
  '第三個單元：先檢查，再分類。給講師：案例是個人收支流水帳，課堂上可以說成公司的收支流水帳，分類邏輯一樣。',
  // 22 情境
  '這是一份 709 筆的收支流水帳，五個欄位：日期、類別、子類別、細目、金額。四大類、十九個子類。原本的提示詞是：幫我直接增加 Excel 的工作表來做這些分類的部分。業績、庫存、客戶資料都一樣，分類和細目統計交給 AI 很快，前提是資料先檢查過。先別急著跑。',
  // 23 翻牌
  '先問大家：支出裡哪一項花最多？直接問 AI，會得到購物 193,675。翻第二張：把重複的 58 筆刪掉再問，答案變成學習 179,317，購物 175,675 退到第二。同一份檔案，答案整個翻過來。問題出在資料，不是 AI。',
  // 24 四個問題
  '這份資料本來就有四個問題。第一，第 2 到 59 列這 58 筆，在後面的全年資料裡每一筆都又出現一次，第 60 列日期突然跳回 1 月 1 日，這就是重複貼上的訊號。第二，日期欄看起來是日期，其實是文字。第三，有 60 筆細目寫的月份和日期對不上，例如 2 月 2 日那筆寫 3 月房租繳費。第四，4 到 12 月每月都有 3 筆薪資，不一定是錯，但要人確認。',
  // 25 檢查提示詞
  '第一步只找問題，不要改。示範：上傳 CH01_1-3 交易紀錄，貼上這段。看 AI 能不能找出重複的那一段。最後一句「只列問題，不要自己改資料」一定要寫。',
  // 26 分類提示詞
  '人看過問題、決定怎麼處理，第二步才請它動手：刪除第 2 到 59 列，月份看日期欄，拆四個工作表，加一張分類彙總。完成後對照下面：收入 145 筆 2,462,501、固定開銷 144 筆 843,155、支出 218 筆 617,488、儲蓄 144 筆 1,374,209，四類合計 5,297,353。右上是講師跑出來的工作表分頁。常見錯誤：AI 自己刪掉一些看起來重複的資料，所以只准刪指定列號。AI 給的檔案是 xlsx，要在雲端協作，上傳後選檔案、儲存為 Google 試算表。',
  // 27 總結
  '這個單元只記一句：刪資料，由人決定。練習：換回 1-1 的訂單檔，依用戶 ID 彙總消費總額，兩萬以上 A 級、一萬到兩萬 B 級、一萬以下 C 級。預期 A 級 3 位、B 級 13 位、C 級 4 位。加分挑戰：楊志敏消費 19,988，差 12 元就是 A 級，訂單數卻是 20 位客戶裡最多的，只看金額會漏掉什麼？',
  // 28 1-4 章節頁
  '第四個單元：三種格式，一份報告。',
  // 29 情境
  '開完新品行銷會議，主管說：把錄音、會議簡報、還有上次那份 AI 行銷趨勢的文章，整理成一份報告給老闆。三份資料：七頁的 PDF 文章；四分鐘的會議錄音，是十日家居的新品行銷會議，主持人 Emily、行銷團隊組長 Alan；還有會議簡報圖片。單元名稱寫的是 Word、PDF、試算表，道理一樣，Word 檔、試算表也可以一起上傳。給講師：會議簡報與工作分配表目前待補。',
  // 30 原文提示詞
  '原本的提示詞可以直接用：先給角色，資深商業顧問，再說有哪些資料、要什麼報告。示範：在 Gemini 一次上傳 PDF 和 MP3，貼上這段。問題是「專業、嚴謹、條理分明」每個人想的不一樣，報告長什麼樣，最好自己訂。',
  // 31 改良版
  '改良版加三件事：每份資料是什麼、報告要哪幾段、每段標出處。最後一句最重要：沒提到的寫資料未提及，聽不清楚的不要猜。完整版：你是一位資深商業顧問。我上傳了三份資料：1. PDF：一篇關於 AI 與社群影音行銷趨勢的文章；2. MP3：今天新品行銷會議的錄音，約 4 分鐘；3. 圖片：會議簡報，含各部門工作分配表。請整理成一份繁體中文報告，以 Google 文件的排版呈現，段落如下：一、會議摘要 二、新品與目標客群 三、三大行銷策略 四、預定目標（數字列成表格） 五、AI 趨勢如何支援這次策略（引用 PDF） 六、各部門分工與待辦（依工作分配表） 七、待確認事項。規則：每一段結尾用出處標明資料來源；錄音裡聽不清楚的人名、品名，列進待確認事項，不要自己猜；某一份資料沒有提到的內容，直接寫資料未提及。',
  // 32 核對
  '核對第四段的數字，要和錄音一致：首月新品銷售 5,000 件、官方社群粉絲成長 20%、貼文與短影音互動率提升 30%、電商評價 500 則以上、維持 4.8 星以上。第五段要真的引用 PDF，例如短影音讓注意力分散、AI 可以優化標題封面、找最佳發布時間，而不是 AI 自己另外寫一套趨勢。完成後可以從回覆下方的分享匯出存成 Google 文件，選單名稱以當天畫面為準。',
  // 33 翻牌
  '三張卡先猜再翻。沒給工作分配表，第六段卻有分工：那是 AI 自己編的，不能用。第六段寫資料未提及：正確，沒有就說沒有。「十日家居」變成「時日家居」、組長 Alan 變成「阿倫」：這是錄音辨識的錯字，在提示詞先給名單（十日家居、Emily、Alan），或人工聽過再改。課堂練習：只上傳 PDF 和 MP3，看第六段 AI 寫了什麼。',
  // 34 總結
  '這個單元只記一句：每一段都要說得出從哪來。多份資料混在一起，最怕分不出哪句是會議講的、哪句是文章寫的、哪句是 AI 自己加的。',
  // 35 1-5 章節頁
  '第五個單元：做一次，用一整年。沿用 1-1 的訂單檔。一件事一個月做一次、一年就是十二次，值得花十分鐘做成樣板。',
  // 36 四段公式
  '樣板用四段公式寫。線框：這是什麼資料、從哪來。痛點：每次卡在哪。期待：輸出長什麼樣，直接貼表頭加一列範例。驗收：寫死的規則，欄位不能改、金額純數字、沒資料寫一槓、結尾回報合計。',
  // 37 樣板
  '這是精簡版，請大家整段複製，存進筆記。完整版另外有第二張表：產品明細，依銷售額由高到低，欄位是產品名稱、訂單數、銷售數量、銷售額。範例列很重要，比用文字描述「金額要純數字」更清楚。結尾要它回報產品明細合計，讓它自己對帳。',
  // 38 交接測試
  '交接測試：兩人一組。同學 A 在新對話貼樣板、上傳 1-1 檔案，回 6 月；同學 B 在另一個新對話回 4 月。預期：6 月 10 筆、36 件、31915、比上月加 27.5%、Google Pixel 8；4 月 6 筆、17 件、14129、減 38.1%、iPhone 15。兩張表欄位、順序、格式要一模一樣。有一處不同，就回第四段把規則寫死。',
  // 39 三種方式
  '樣板存在哪裡？A 存成筆記，每次新對話先貼。B 做成 Gem，把樣板貼進指示，以後打開這個 Gem 只要上傳檔案，適合每週、每月固定做的事。C 先做好空白試算表，請 AI 照欄位填，適合要直接進公司既有報表。Gem 的建立路徑以當天介面為準。',
  // 40 總結
  '這個單元只記一句：給誰用都一樣，才算樣板。你今天寫的樣板，將來公司要做自動化時，就是交給 IT 的需求說明。練習：用樣板跑 12 月，預期 9 筆、28 件、23052、加 12.3%、Sony Xperia 5 V。',
  // 41 1-6 章節頁
  '最後一個單元是實作。用你自己帶來、這週真的要整理的資料。',
  // 42 流程
  '五個步驟。第一步一定要做上傳前檢查。順序固定是檢查、整理、核對。沒帶資料或不方便上傳的同學，用 1-3 的交易紀錄練習。',
  // 43 三段提示詞
  '三段提示詞依序用，中括號換成你的內容。第一段先檢查；第二段再整理，欄位和規則寫清楚；第三段讓 AI 自己先招：哪些是照抄、哪些是推論。但它標高把握也可能錯，核對照做：總數用 COUNTA、SUM 自己算，看頭尾兩筆，隨便抽三筆回原檔對。',
  // 44 檢核
  '對照四項成果。沒帶資料的同學，任務是整理 2025 年每個月的支出：刪除重複後，支出合計 617,488，子類別最多的是學習 179,317。沒刪重複就會變成購物最多，這就是 1-3 的重點。常見問題：檔案太大上傳失敗，先只上傳一個月；PDF 讀不到字，可能是掃描檔，改用 NotebookLM 或說明這是掃描檔。',
  // 45 分享
  '最後兩兩互看，用這句話分享：我的資料原本亂在哪裡，我用哪一句提示詞解決。每組推派一位，一人一分鐘。',
  // 46 QA
  '開放問答。上傳不了、結果對不上，都可以現在問。',
  // 47 帶走三樣
  '帶走三樣。觀念：先檢查、一定核對，亂資料先請 AI 找問題，整理完自己加總，合計對了才交出去。提示詞：整理四句話，我上傳的是什麼資料、欄位是哪些、只用我的資料沒有的寫一槓、最後回報筆數與合計。行動：下週上班，挑最常整理的那份報表，照四段公式做成樣板，存成筆記。',
  // 48 下篇預告
  '下一章是 CH02 下篇：錄音檔變會議記錄。會用到今天的分開問、標出處和樣板，請把今天存的樣板留著。',
  // 49 收尾
  '回到開場的問題：下週對齊格式的時間，能少一半嗎？A 可以，回去就做樣板；B 還要再練習；C 有新的問題。比較一下和開場的舉手人數。選 C 的同學，午休可以來問我。謝謝大家。',
];

export const meta: SlideMeta = {
  title: 'CH01｜AI 資料整理術（上）',
  createdAt: '2029-12-31T00:00:00.000Z',
};

export default [
  Cover,
  Preview,
  Hook,
  Agenda,
  Ask,
  U1,
  U1Safe,
  U1Case,
  U1Raw,
  U1Flip,
  U1Split,
  U1Export,
  U1Sum,
  U2,
  U2Case,
  U2Prompt,
  U2Bike,
  U2Result,
  U2Nlm,
  U2Sum,
  U3,
  U3Case,
  U3Flip,
  U3Issues,
  U3Check,
  U3Sort,
  U3Sum,
  U4,
  U4Case,
  U4Raw,
  U4Better,
  U4Check,
  U4Flip,
  U4Sum,
  U5,
  U5Four,
  U5Prompt,
  U5Test,
  U5Ways,
  U5Sum,
  U6,
  U6Flow,
  U6Prompt,
  U6List,
  U6Share,
  QA,
  TakeAway,
  Next,
  Closing,
] satisfies Page[];

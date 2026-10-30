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
const FONT_LINK_ID = 'osd-webfont-ch02-data-tidy-2';
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
      <span>CH02｜AI 資料整理術（下）</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 5 },
  { name: '2-1 網路資料', from: 6, to: 12 },
  { name: '2-2 逐字稿', from: 13, to: 19 },
  { name: '2-3 意見待辦', from: 20, to: 27 },
  { name: '2-4 口述', from: 28, to: 34 },
  { name: '2-5 範本', from: 35, to: 40 },
  { name: '2-6 實作', from: 41, to: 45 },
  { name: '收尾', from: 46, to: 50 },
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

/* ---------- CH02 專用 ---------- */

import infoA from './assets/u21-info-a.jpg';
import infoB from './assets/u21-info-b.jpg';

const CaseLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    data-osd-interactive
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(event) => event.stopPropagation()}
    style={{ display: 'inline-block', padding: '8px 18px', border: '2px solid var(--osd-accent)', borderRadius: 12, background: C.panel, color: 'var(--osd-accent)', fontSize: 28, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
  >
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

// 逐字稿的一句：發話者＋內容
const Say = ({ who, children }: { who: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 24, fontSize: 38, lineHeight: 1.5 }}>
    <div style={{ flex: '0 0 140px', fontWeight: 700, color: 'var(--osd-accent)' }}>{who}：</div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

/* ---------- 開場 ---------- */

const Cover: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 980 }}>
        <Eyebrow>AI 職場全效生產力應用班｜第一週・下午</Eyebrow>
        <h1 style={{ fontFamily: serif, fontSize: 120, fontWeight: 900, lineHeight: 1.18, margin: '0 0 36px' }}>
          AI 資料整理術
          <br />
          （下）
        </h1>
        <div style={{ fontSize: 48, color: 'var(--osd-accent)', fontWeight: 500 }}>錄音檔，直接變成會議記錄</div>
      </div>
      <svg width="600" height="440" viewBox="0 0 600 440" aria-hidden="true">
        {[40, 90, 150, 70, 180, 120, 60, 160, 100, 50, 130, 80].map((h, i) => (
          <rect key={i} x={20 + i * 18} y={220 - h / 2} width="10" height={h} rx="5" fill="var(--osd-accent)" />
        ))}
        <text x="285" y="240" textAnchor="middle" fontSize="64" fill="var(--osd-accent)">→</text>
        <rect x="340" y="60" width="240" height="320" rx="16" fill={C.panel} stroke={C.muted} strokeWidth="2" />
        <rect x="370" y="100" width="120" height="18" rx="9" fill="var(--osd-accent)" />
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <rect key={r} x="370" y={150 + r * 34} width={r % 2 ? 150 : 180} height="12" rx="6" fill={C.muted} opacity="0.55" />
        ))}
      </svg>
    </div>
  </Slide>
);

const Recap: Page = () => (
  <Slide>
    <Eyebrow>上篇回顧</Eyebrow>
    <H>上午六個單元，各記一句</H>
    <Body>
      <Grid
        cols="140px 1fr"
        size={38}
        rows={[
          ['單元', '只記一句'],
          ['1-1', '沒有成本，就算不出賺多少'],
          ['1-2', '放在一起，才看得到'],
          ['1-3', '刪資料，由人決定'],
          ['1-4', '每一段都要說得出「從哪來」'],
          ['1-5', '給誰用都一樣，才算樣板'],
          ['1-6', '先檢查，再整理，一定核對'],
        ]}
      />
    </Body>
  </Slide>
);

const Preview: Page = () => (
  <Slide>
    <Eyebrow>成果預覽</Eyebrow>
    <H>今天下午，你會做出這三樣東西</H>
    <Body>
      <div style={{ display: 'flex', gap: 36 }}>
        <Col tag="①" title="趨勢資訊圖表" body={'網路排行榜\n整理成一張圖'} />
        <Col tag="②" title="分好發話者" body={'4 分鐘會議錄音\n變成逐字稿'} />
        <Col tag="③" title="照範本記錄" body={'全團隊的會議記錄\n格式長一樣'} />
      </div>
    </Body>
  </Slide>
);

const Hook: Page = () => (
  <Slide>
    <Eyebrow>先舉手</Eyebrow>
    <H>
      你上一份會議記錄，
      <br />
      花了多久才寫完？
    </H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Vote n="A">30 分鐘內</Vote>
        <Vote n="B">30 分鐘～1 小時</Vote>
        <Vote n="C">超過 1 小時，或乾脆沒寫</Vote>
      </div>
      <Note>先記下舉手人數，下課前再問一次</Note>
    </Body>
  </Slide>
);

const Agenda: Page = () => (
  <Slide>
    <Eyebrow>今天下午的六個單元</Eyebrow>
    <H>13:30～17:00</H>
    <Body>
      <Grid
        cols="140px 1fr 260px"
        size={38}
        rows={[
          ['單元', '主題', '時間'],
          ['2-1', '網路資料，整理成一張圖', '13:45'],
          ['2-2', '錄音變逐字稿', '14:10'],
          ['2-3', '整理意見與待辦', '14:35'],
          ['2-4', '口述錄音變條列筆記', '15:10'],
          ['2-5', '照範本出會議記錄', '15:35'],
          ['2-6', '實作：你的錄音', '15:55'],
        ]}
      />
      <Note>請打開 Gemini、NotebookLM 和雲端硬碟的 CH02 案例資料夾</Note>
    </Body>
  </Slide>
);

/* ---------- 2-1 ---------- */

const U1: Page = () => (
  <Unit no="2-1" title="網路資料，整理成一張圖" goal="用 NotebookLM 搜尋網路來源、提問、做表，再輸出成資訊圖表" time="13:45～14:10" />
);

const U1Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>「最近市場在流行什麼？」</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair tag="以前" title="開好幾個網站抄" lines={['一家一家抄排行榜', '自己寫心得', '每個月重來一次']} />
        <Pair tag="現在" title="網頁當來源" lines={['交給 NotebookLM 讀', '問趨勢、做表格', '輸出成一張圖']} />
      </div>
      <Note>案例：中文圖書上半年暢銷排行榜（誠品、博客來）</Note>
    </Body>
  </Slide>
);

const U1Steps: Page = () => (
  <Slide>
    <Eyebrow>操作步驟</Eyebrow>
    <H>NotebookLM 六步</H>
    <Body>
      <Grid
        cols="90px 1fr"
        size={38}
        rows={[
          ['步', '做什麼'],
          ['1', '建立新筆記本，命名「中文暢銷書追蹤」'],
          ['2', '「在網路上搜尋新來源」，把網頁匯入成來源'],
          ['3', '檢查來源：是不是書店排行？是不是今年上半年？'],
          ['4', '提問：趨勢分析＋前十名表格'],
          ['5', '回答下方按「儲存至記事」'],
          ['6', '「工作室」→「資訊圖表」'],
        ]}
      />
    </Body>
  </Slide>
);

const U1Prompt: Page = () => (
  <Slide>
    <Eyebrow>提示詞</Eyebrow>
    <H>加上來源與榜單期間</H>
    <Body>
      <Prompt
        label="提示詞（原文）"
        size={30}
        lines={['幫我搜尋中文圖書上半年的排行榜', '這些中文暢銷榜反映出台灣讀者當前的閱讀興趣與偏好趨勢嗎?', '把誠品和博客來前十名的書製作成表格']}
      />
      <Prompt
        label="補強版"
        size={30}
        style={{ marginTop: 52 }}
        lines={[
          '只根據我勾選的來源回答。',
          '誠品、博客來前十名分別做成表格，欄位：排名｜書名｜作者｜分類｜來源網頁｜榜單期間',
          '來源沒寫榜單期間，就標「未標示」，不要推測。',
        ]}
      />
    </Body>
  </Slide>
);

const U1Flip: Page = () => (
  <Slide>
    <Eyebrow>先猜，再翻</Eyebrow>
    <H>網路資料最容易錯的三件事</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Flip front="兩家書店的第 1 名，直接比？" back="先看榜單期間，週榜和半年榜不能比" hint="點一下看答案" h={120} />
        <Flip front="表格裡有本書找不到來源" back="AI 用自己的知識補，要拿掉" hint="點一下看答案" h={120} />
        <Flip front="AI 說的「趨勢」" back="是解讀，要能指回榜單上的書" hint="點一下看答案" h={120} />
      </div>
    </Body>
  </Slide>
);

const U1Result: Page = () => (
  <Slide>
    <Eyebrow>工作室輸出</Eyebrow>
    <H>一張給主管看的資訊圖表</H>
    <Body>
      <div style={{ display: 'flex', gap: 32 }}>
        <Shot src={infoA} w={810} h={452} />
        <Shot src={infoB} w={810} h={452} />
      </div>
      <Note>結果每次都不同；圖上的書名、數字，要對照表格逐項檢查</Note>
    </Body>
  </Slide>
);

const U1Sum: Page = () => (
  <SumX
    label="2-1 只記一句"
    line="來源決定答案"
    sub="定期追蹤：同一個筆記本，每月重搜一次，用同一組提示詞前後比較"
  />
);

/* ---------- 2-2 ---------- */

const U2: Page = () => (
  <Unit no="2-2" title="錄音變逐字稿" goal="上傳會議錄音，請 AI 轉成標好發話者的逐字稿，並核對專有名詞" time="14:10～14:35" />
);

const U2Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>上午那場會議，現在變成文字</H>
    <Body>
      <Grid
        cols="240px 1fr"
        size={38}
        rows={[
          ['項目', '內容'],
          ['發話者', 'Emily（主持人）、Alan（行銷團隊組長）'],
          ['公司', '十日家居'],
          ['長度', '約 4 分鐘'],
          ['內容', '三項新品、三大行銷策略、四項 KPI'],
        ]}
      />
      <Note>和上午 1-4 是同一支錄音</Note>
      <div style={{ marginTop: 18 }}>
        <CaseLink href="https://drive.google.com/file/d/11ghkaP6rWqyGriEuc_dr2KP7fbIkW6T-/view?usp=drive_link">ch02_2-2會議錄音 的副本</CaseLink>
      </div>
    </Body>
  </Slide>
);

const U2Prompt: Page = () => (
  <Slide>
    <Eyebrow>提示詞</Eyebrow>
    <H>照原話、標發話者、不確定的列出來</H>
    <Body>
      <div style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Prompt label="提示詞（原文）" size={30} lines={['將錄音轉成逐字稿，協助辨識並標註發話者']} />
          <Prompt
            label="補強版"
            size={30}
            style={{ marginTop: 48 }}
            lines={[
              '1. 每段開頭標發話者，名字從對話判斷',
              '   判斷不出來就標「發話者A、B」',
              '2. 照原話寫，不要摘要',
              '3. 聽不清楚的標【聽不清】',
              '4. 最後列出不確定的人名、公司名、產品名',
            ]}
          />
        </div>
        <ShotTodo what="Gemini 上傳會議錄音並貼上提示詞的畫面" w={460} h={520} />
      </div>
    </Body>
  </Slide>
);

const U2Result: Page = () => (
  <Slide>
    <Eyebrow>預期結果</Eyebrow>
    <H>兩位發話者</H>
    <Body>
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Say who="Emily">大家好……今天我們特別邀請行銷團隊組長 Alan 來分享他的行銷計畫。</Say>
        <Say who="Alan">好的，謝謝 Emily……新品包括多功能摺疊置物籃、環保矽膠摺疊杯，以及日式極簡海報燈。</Say>
      </Card>
      <div style={{ marginTop: 32 }}>
        <Flip front="AI 怎麼知道第二個人叫 Alan？" back="Emily 開場點名「行銷團隊組長 Alan」" hint="點一下看答案" h={120} />
      </div>
    </Body>
  </Slide>
);

const U2Wrong: Page = () => (
  <Slide>
    <Eyebrow>教學亮點</Eyebrow>
    <H>語音辨識最常錯的是專有名詞</H>
    <Body>
      <Grid
        cols="460px 1fr"
        size={38}
        warnCol={1}
        rows={[
          ['正確', '一般本機辨識工具的結果'],
          ['十日家居', '十字架局、時日家居、施志家居'],
          ['Alan', '阿倫'],
          ['多功能摺疊置物籃', '多麼能折疊置物欄'],
          ['短影音', '短硬陰'],
          ['蝦皮、momo', '蝦皮摸摸'],
        ]}
      />
      <Note>同一支錄音，同一份逐字稿裡品牌名就有三種寫法；Gemini 的版本是正確的</Note>
    </Body>
  </Slide>
);

const U2Save: Page = () => (
  <Slide>
    <Eyebrow>操作步驟</Eyebrow>
    <H>存成 Google 文件</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Row n="1">逐字稿存成 Google 文件</Row>
          <Row n="2">命名 YYYY-MM-DD-會議名稱-逐字稿</Row>
          <Row n="3">放進雲端的會議資料夾</Row>
          <Row n="4">用「朗讀」聽一段，比對漏句</Row>
        </div>
        <ShotTodo what="Gemini 回覆下方的分享／匯出選單" w={460} h={480} />
      </div>
    </Body>
  </Slide>
);

const U2Sum: Page = () => (
  <SumX
    label="2-2 只記一句"
    line="人名、品名、數字，一定要核對"
    sub="練習：提示詞開頭先給名單（Emily、Alan、十日家居），再轉一次比較"
  />
);

/* ---------- 2-3 ---------- */

const U3: Page = () => (
  <Unit no="2-3" title="整理意見與待辦" goal="把逐字稿整理成意見表和待辦表，沒講的標「未提及」" time="14:35～15:00" />
);

const U3Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>逐字稿太長，沒人看</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Q n="1">誰說了什麼？</Q>
        <Q n="2">接下來，誰要做什麼？</Q>
      </div>
      <Note>會議、客戶通話、業務訪談，大家最在意的都是這兩件事</Note>
    </Body>
  </Slide>
);

const U3Prompt: Page = () => (
  <Slide>
    <Eyebrow>提示詞</Eyebrow>
    <H>兩張表，沒講的填「未提及」</H>
    <Body>
      <Prompt label="提示詞（原文）" size={30} lines={['幫我整理各與會人分別提出了哪些意見', '整理待辦事項']} />
      <Prompt
        label="補強版"
        size={30}
        style={{ marginTop: 48 }}
        lines={[
          '1. 與會人意見：發話者｜提出的重點',
          '2. 待辦事項：項目｜負責人｜期限｜依據（逐字稿原句）',
          '沒有明講的負責人或期限，填「未提及」，不要自己指派。',
          '最後把所有「未提及」列成【待確認】清單。',
        ]}
      />
    </Body>
  </Slide>
);

const U3Opinion: Page = () => (
  <Slide>
    <Eyebrow>預期結果　表 1</Eyebrow>
    <H>誰說了什麼</H>
    <Body>
      <Grid
        cols="300px 1fr"
        size={36}
        rows={[
          ['發話者', '提出的重點'],
          ['Emily（主持人）', '說明會議目的；詢問具體策略與 KPI；收尾請團隊依計畫分工、定期回報'],
          ['Alan（行銷組長）', '三項新品與目標客群；三大策略；四項 KPI；補充市場調研組要做 FB／IG 調查'],
        ]}
      />
    </Body>
  </Slide>
);

const U3Todo: Page = () => (
  <Slide>
    <Eyebrow>預期結果　表 2</Eyebrow>
    <H>誰要做什麼</H>
    <Body>
      <Grid
        cols="1fr 330px 260px"
        size={34}
        rows={[
          ['項目', '負責人', '期限'],
          ['三大策略依工作分配表分工執行', '各部門（依分工表）', '未提及'],
          ['會後補上詳細資料', 'Alan（推定）', '會議結束後'],
          ['Facebook、Instagram 市場調查分析', '市場調研組', '未提及'],
          ['調查細節補進分工表', '未提及', '會議結束後'],
          ['依計畫分工並定期回報進度', '行銷團隊成員', '未提及'],
        ]}
      />
      <Note>【待確認】分工表內容、市場調查期限、回報頻率、補分工表由誰負責</Note>
    </Body>
  </Slide>
);

const U3Flip: Page = () => (
  <Slide>
    <Eyebrow>先猜，再翻</Eyebrow>
    <H>待辦事項最常見的三個錯</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Flip front="每條待辦都有負責人和日期" back="AI 自己指派的，改成「未提及」" hint="點一下看答案" h={120} />
        <Flip front="「定期回報進度」" back="頻率沒講，列進待確認" hint="點一下看答案" h={120} />
        <Flip front="逐字稿沒標發話者" back="只知道說了什麼，不知道誰說的" hint="點一下看答案" h={120} />
      </div>
    </Body>
  </Slide>
);

const U3Sum: Page = () => (
  <SumX
    label="2-3 只記一句"
    line="「未提及」就是會後要追的清單"
    sub="練習：把待辦表改寫成會後確認信草稿（寄信與行事曆在 CH06 細講）"
  />
);

const Break: Page = () => (
  <Slide dark center>
    <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>休息時間</div>
    <H size={140} dark style={{ marginTop: 20 }}>
      休息 10 分鐘
    </H>
    <div style={{ fontSize: 44, color: C.darkMuted, marginTop: 36 }}>15:10 回來｜下一段：口述錄音變條列筆記</div>
  </Slide>
);

/* ---------- 2-4 ---------- */

const U4: Page = () => (
  <Unit no="2-4" title="口述錄音變條列筆記" goal="把跳來跳去的口述，整理成要做、要記、要問、已更正四類" time="15:10～15:35" />
);

const U4Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>沒有議程的話，最難記</H>
    <Body>
      <Grid
        cols="230px 1fr 1fr"
        size={34}
        rows={[
          ['檔案', '情境', '難點'],
          ['9-1.wav', '業務拜訪完，開車回公司口述', '要做、要記、請同事幫忙混在一起'],
          ['9-2.wav', '採購和建興五金談完價格', '五項條件＋一個但書'],
          ['9-3.wav', '督導巡完三家店', '三家店要分組'],
          ['6-3 更正.wav', '主管電話交辦，中途改口', '取消的事不能留在清單'],
        ]}
      />
      <Note>案例在 CH02 資料夾的「語音案例20260917」，每段 23～48 秒</Note>
    </Body>
  </Slide>
);

const U4Prompt: Page = () => (
  <Slide>
    <Eyebrow>提示詞</Eyebrow>
    <H>四類：要做、要記、要問、已更正</H>
    <Body>
      <Prompt
        size={30}
        lines={[
          '這是一段沒有整理過的口述錄音（可能跳來跳去、中途改口）。',
          '請整理成：',
          '- 【要做的事】條列，能判斷負責人／期限就標',
          '- 【要記住的資訊】數字、名稱、地點、金額',
          '- 【要問／要確認的事】',
          '- 【已取消或已更正】原本講、後來改掉的事',
          '中途改口以最後講的為準；重複的合併；',
          '沒有內容的分類寫「（無）」，不要硬補。',
        ]}
      />
    </Body>
  </Slide>
);

const U4Buy: Page = () => (
  <Slide>
    <Eyebrow>預期結果　9-2 採購電話</Eyebrow>
    <H>談定的條件，一項都不能漏</H>
    <Body>
      <Grid
        cols="320px 1fr"
        size={38}
        rows={[
          ['要記住', ''],
          ['單價', '每顆 2.3 元'],
          ['最低訂購量', '1 萬顆'],
          ['交期', '下單後 10 個工作天'],
          ['付款條件', '月結 30 天'],
        ]}
      />
      <Big style={{ marginTop: 28, color: C.berry, fontWeight: 700 }}>
        <Pill warn>但書</Pill>　價格只保證這個月，下個月可能重談
      </Big>
      <Big style={{ marginTop: 12 }}>
        <Pill>要問</Pill>　建興五金有沒有現貨庫存
      </Big>
    </Body>
  </Slide>
);

const U4Shop: Page = () => (
  <Slide>
    <Eyebrow>預期結果　9-3 巡店口述</Eyebrow>
    <H>三家店，先依門市分組</H>
    <Body>
      <Grid
        cols="180px 1fr 400px"
        size={34}
        rows={[
          ['門市', '待改善', '複查'],
          ['西門店', '冰箱溫度異常，本週五前找廠商檢修', '督導下週一複查'],
          ['公館店', '排班表沒貼公告欄，明天改善', '督導後天 LINE 詢問'],
          ['士林店', '垃圾桶區有點亂', '口頭提醒，不用複查'],
        ]}
      />
      <Big style={{ marginTop: 32 }}>
        <Pill>督導自己的待辦</Pill>　問人資：教育訓練錄影什麼時候上傳
      </Big>
    </Body>
  </Slide>
);

const U4Flip: Page = () => (
  <Slide>
    <Eyebrow>預期結果　6-3 主管改口三次</Eyebrow>
    <H>先猜，再翻</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Flip front="主視覺下班前交？" back="先暫停，等兩點和客戶對完色調" hint="點一下看結果" h={116} />
        <Flip front="找倉儲調貨？" back="改成催採購，今天給交期" hint="點一下看結果" h={116} />
        <Flip front="月底跟財務對請款？" back="改對退貨折讓單，請款下週" hint="點一下看結果" h={116} />
      </div>
      <Note>原本的指示要放進【已取消或已更正】，不能留在要做的事</Note>
    </Body>
  </Slide>
);

const U4Sum: Page = () => (
  <SumX
    label="2-4 只記一句"
    line="中途改口，以最後講的為準"
    sub="加分：6-2 錄音裡「那個誰……你稍微 follow 一下」，寫成「跟進：對象未指明」，不要腦補"
  />
);

/* ---------- 2-5 ---------- */

const U5: Page = () => (
  <Unit no="2-5" title="照範本出會議記錄" goal="給 AI 範本＋逐字稿，全團隊產出長一樣的會議記錄" time="15:35～15:55" />
);

const U5Case: Page = () => (
  <Slide>
    <Eyebrow>工作情境</Eyebrow>
    <H>三個人做記錄，三種樣子</H>
    <Body>
      <div style={{ display: 'flex', gap: 32 }}>
        <Col tag="A" title="條列" body={'重點有寫\n誰負責沒寫'} />
        <Col tag="B" title="一大段" body={'全部寫進去\n找不到結論'} />
        <Col tag="C" title="貼截圖" body={'白板拍一張\n事後看不懂'} />
      </div>
      <Note>主管每次都要再問一次「結論是什麼、誰負責」</Note>
    </Body>
  </Slide>
);

const U5Old: Page = () => (
  <Slide>
    <Eyebrow>教學亮點</Eyebrow>
    <H>範本裡還留著上一場會議</H>
    <Body>
      <Grid
        cols="250px 1fr 1fr"
        size={34}
        warnCol={1}
        rows={[
          ['欄位', '範本裡寫的', '這場會議應該是'],
          ['會議主題', '旅遊觀光業市場規模與成長趨勢', '十日家居新品行銷策略'],
          ['日期', '2025 年 9 月 8 日', '未提及'],
          ['與會人員', '王經理、陳專員、林組員', 'Emily、Alan'],
          ['紀錄人', '林組員', '自己的名字'],
        ]}
      />
      <Note>不說清楚，AI 很可能把舊資料原封不動抄進新記錄</Note>
      <div style={{ marginTop: 18 }}>
        <CaseLink href="https://docs.google.com/document/d/1LdBd9Vrs8BuCs_FkV7WFrDalO_TPaZ33XT5LPi53dxQ/edit?usp=sharing">20250908 會議記錄</CaseLink>
      </div>
    </Body>
  </Slide>
);

const U5Template: Page = () => (
  <Slide>
    <Eyebrow>建議另存一份給學員</Eyebrow>
    <H>乾淨的範本長這樣</H>
    <Body>
      <Prompt
        label="會議記錄範本"
        size={32}
        lines={[
          '會議主題：',
          '日期：　　時間：　　地點：',
          '與會人員：（姓名＋角色）',
          '一、會議討論內容（依議程分段，每段一個小標題）',
          '二、決議事項',
          '三、行動指派：項目｜負責人｜期限',
          '紀錄人：　　簽核：',
        ]}
      />
    </Body>
  </Slide>
);

const U5Prompt: Page = () => (
  <Slide>
    <Eyebrow>提示詞</Eyebrow>
    <H>範本只看格式</H>
    <Body>
      <div style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Prompt
            size={30}
            lines={[
              '我上傳了會議記錄範本和今天的逐字稿。',
              '請依範本的格式和段落順序整理會議記錄。',
              '1. 範本裡的主題、日期、人名是舊資料，不要沿用',
              '2. 逐字稿沒講到的欄位填「未提及」',
              '3. 議程小標題依今天的內容重新命名',
              '4. 沒講到負責人或期限的，填「未提及」',
            ]}
          />
          <Note>原文：「整理我的會議記錄，我有提供會議紀錄範本請依照範本製作」</Note>
        </div>
        <ShotTodo what="Gemini 同時上傳範本與逐字稿的畫面" w={440} h={500} />
      </div>
    </Body>
  </Slide>
);

const U5Sum: Page = () => (
  <SumX
    label="2-5 只記一句"
    line="範本＝格式，不是內容"
    sub="核對：主題是十日家居、與會是 Emily 和 Alan、日期寫「未提及」"
  />
);

/* ---------- 2-6 ---------- */

const U6: Page = () => (
  <Unit no="2-6" title="實作：你的錄音" goal="用自己的錄音做出一份會議記錄與行動清單，帶走一份樣板" time="15:55～16:45・50 分鐘" />
);

const U6Flow: Page = () => (
  <Slide>
    <Eyebrow>今天的任務</Eyebrow>
    <H>五個步驟，50 分鐘</H>
    <Body>
      <Grid
        cols="100px 1fr 160px"
        size={38}
        rows={[
          ['步驟', '做什麼', '時間'],
          ['1', '上傳前檢查：錄音同意、有沒有機密', '5 分'],
          ['2', '轉逐字稿：標發話者、核對專有名詞', '10 分'],
          ['3', '整理意見與待辦：沒講的填未提及', '10 分'],
          ['4', '套範本：用乾淨的會議記錄範本', '10 分'],
          ['5', '核對、存檔、存樣板，兩兩分享', '15 分'],
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
        label="① 轉逐字稿"
        size={30}
        lines={['請將錄音轉成逐字稿，標註發話者。與會者：【姓名與角色】', '照原話寫；聽不清楚標【聽不清】；最後列出不確定的人名、公司名、產品名']}
      />
      <Prompt
        label="② 意見與待辦"
        size={30}
        style={{ marginTop: 44 }}
        lines={['整理兩張表：與會人意見、待辦事項（項目｜負責人｜期限｜依據）', '沒明講的填「未提及」，不要自己指派；最後列出【待確認】']}
      />
      <Prompt
        label="③ 套範本"
        size={30}
        style={{ marginTop: 44 }}
        lines={['依範本格式整理會議記錄；範本裡的舊主題、日期、人名不要沿用']}
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
        <CheckItem>一份會議記錄，已存成 Google 文件</CheckItem>
        <CheckItem>一張行動清單，含【待確認】</CheckItem>
        <CheckItem>一則筆記「〈某會議〉記錄樣板」</CheckItem>
        <CheckItem>說得出：AI 哪裡聽錯、你怎麼發現的</CheckItem>
      </div>
      <Note>沒帶音檔：用十日家居會議錄音走一次，答案對照 2-3、2-5</Note>
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
          「AI 在＿＿＿＿聽錯了，
          <br />
          我是從＿＿＿＿發現的。」
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
    <div style={{ fontSize: 44, color: C.muted, marginTop: 36 }}>錄音上傳不了、發話者分不對，都可以現在問</div>
  </Slide>
);

const TakeAway: Page = () => (
  <Slide>
    <Eyebrow>今天下午帶走三樣東西</Eyebrow>
    <H>一個觀念、一組提示詞、一個行動</H>
    <Body>
      <div style={{ display: 'flex', gap: 32 }}>
        <Col tag="觀念" title="聽完先核對" body={'人名、品名、數字\n決議、負責人\n寄出前人工看過'} />
        <Col tag="提示詞" title="會議記錄三步" body={'轉逐字稿標發話者\n意見＋待辦（未提及）\n照範本整理'} />
        <Col tag="行動" title="下次開會就用" body={'開會前說要錄音\n會後照樣板跑一次\n寄出前核對'} />
      </div>
    </Body>
  </Slide>
);

const Week: Page = () => (
  <Slide>
    <Eyebrow>第一週回顧</Eyebrow>
    <H>今天一整天</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair tag="上午　CH01" title="亂資料 → 乾淨報表" lines={['Excel、PDF、跨格式', '先檢查，再整理', '做成樣板']} />
        <Pair tag="下午　CH02" title="錄音 → 會議記錄" lines={['網路資料、錄音、口述', '標發話者、列待辦', '照範本產出']} />
      </div>
      <Note>共同的一句：AI 先整理，人負責檢查與核對</Note>
    </Body>
  </Slide>
);

const Next: Page = () => (
  <Slide>
    <Eyebrow>下週六上午</Eyebrow>
    <H>CH03：Google Sheets AI 活用術</H>
    <Body>
      <Grid
        cols="130px 1fr"
        size={38}
        rows={[
          ['單元', '主題'],
          ['3-1', '看不懂公式？截圖問 AI'],
          ['3-2', '用說的，讓 AI 寫函數'],
          ['3-3', '看懂公式，才會改公式'],
          ['3-4', '讓表格自己變色'],
          ['3-5', '一張好截圖，省十句話'],
          ['3-6', '實作：帶自己公司的報表'],
        ]}
      />
    </Body>
  </Slide>
);

const Closing: Page = () => (
  <Slide>
    <Eyebrow>回到開場</Eyebrow>
    <H>
      下一份會議記錄，
      <br />
      你想花多久？
    </H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Vote n="A">10 分鐘，照樣板跑</Vote>
        <Vote n="B">還要再練習</Vote>
        <Vote n="C">我有新的問題</Vote>
      </div>
    </Body>
  </Slide>
);

export const notes: (string | undefined)[] = [
  // 1 封面
  '大家午安。下午是 AI 資料整理術的下篇。上午我們整理的是表格、PDF；下午換成網路資料和聲音：會議錄音、電話後的口述、走廊上的交辦。目標一樣：AI 先整理，人負責檢查和核對。',
  // 2 上篇回顧
  '先花一分鐘回顧上午。六個單元各記一句：沒有成本就算不出賺多少；放在一起才看得到；刪資料由人決定；每一段都要說得出從哪來；給誰用都一樣才算樣板；先檢查、再整理、一定核對。下午這些都會再用到，尤其是「從哪來」和「樣板」。',
  // 3 成果預覽
  '今天下午做完會有三樣東西：一張網路排行榜整理成的資訊圖表；一份標好發話者的逐字稿；一份照範本產出、全團隊格式一樣的會議記錄。',
  // 4 開場提問
  '先舉手：你上一份會議記錄花了多久才寫完？30 分鐘內舉 A，30 分鐘到 1 小時舉 B，超過 1 小時或乾脆沒寫舉 C。我記一下人數，下課前再問一次。',
  // 5 目錄
  '下午六個單元。2-1 先處理網路資料；2-2 到 2-5 是一條線：錄音變逐字稿、整理意見與待辦、口述變筆記、照範本出會議記錄；2-6 用你自己的錄音實作 50 分鐘。請打開 Gemini、NotebookLM，還有雲端的 CH02 案例資料夾。',
  // 6 2-1 章節頁
  '第一個單元：網路資料，整理成一張圖。大約 25 分鐘，用 NotebookLM。',
  // 7 情境
  '行銷或採購每個月都要回報「市場最近在流行什麼」。以前是開好幾個網站抄排行，自己寫心得，每個月重來一次。現在把網頁當來源丟進 NotebookLM，請它整理、比較、做成一張圖。今天的案例是中文圖書上半年的暢銷排行榜。',
  // 8 六步
  '示範六步。建立新筆記本；左邊來源按「在網路上搜尋新來源」，打「幫我搜尋中文圖書上半年的排行榜」，把搜到的網頁匯入；第三步最重要，檢查來源：是不是書店的排行、是不是今年上半年，不對的取消勾選；第四步提問；第五步在回答下方按「儲存至記事」；第六步右邊工作室選資訊圖表。工作室有九種輸出，簡單帶過：語音摘要、簡報、影片摘要、心智圖、報告、學習卡、測驗、資訊圖表、資料表。按鈕名稱以當天介面為準。',
  // 9 提示詞
  '上面是原文的三句，可以直接用。補強版加了兩件事：只根據我勾選的來源回答；表格加上來源網頁和榜單期間。榜單期間很重要，下一頁會講。注意：這個單元的結果每次都不一樣，因為來源是當天搜到的網頁，所以我們對的不是答案，是檢查方法。',
  // 10 翻牌
  '三張卡先猜再翻。兩家書店的第 1 名可以直接比嗎？不行，先看榜單期間，週榜和半年榜不能比。表格裡有本書找不到來源？那是 AI 用自己的知識補的，要拿掉。AI 說的趨勢呢？那是解讀，要能指回榜單上的書；指不回去的就是它自己推論的。',
  // 11 資訊圖表
  '這兩張是講師用工作室做出來的資訊圖表，點一下可以放大。很好看，但圖是生成的，可能寫錯字、寫錯書名，所以一定要對照表格逐項檢查。',
  // 12 總結
  '這個單元只記一句：來源決定答案。至於「定期追蹤」：固定用同一個筆記本，每週或每月重新搜尋一次、加入新來源，用同一組提示詞再問一次，前後比較。要讓系統自動定時抓，需要另外的排程或自動化工具，本課不示範。練習：換一個跟自己工作有關的主題，跑一次六步。',
  // 13 2-2 章節頁
  '第二個單元：錄音變逐字稿。大約 25 分鐘。',
  // 14 情境
  '這支錄音大家上午在 1-4 已經用過，是十日家居的新品行銷會議，約 4 分鐘。兩位發話者：主持人 Emily、行銷團隊組長 Alan。內容有三項新品、三大策略、四項 KPI。以前 4 分鐘的會可能要打半小時，現在交給 AI。',
  // 15 提示詞
  '原文提示詞是一句：將錄音轉成逐字稿，協助辨識並標註發話者。補強版加四條規則：名字從對話判斷、判斷不出來標 A、B；照原話不要摘要；聽不清楚標出來；最後列出不確定的專有名詞。示範：Gemini 按加號上傳錄音，貼補強版。',
  // 16 預期結果
  '結果應該有兩位發話者。先猜：AI 怎麼知道第二個人叫 Alan？翻牌：因為 Emily 開場就說「今天我們特別邀請行銷團隊組長 Alan」。AI 靠音調音色分出不同的人，名字則要從對話內容推斷。如果沒人叫名字，它只能標 A、B。完整的正確逐字稿在雲端資料夾，檔名 CH02_2-3 將錄音轉成逐字稿。',
  // 17 錯字
  '這頁是亮點。講師用一般的本機語音辨識工具轉同一支錄音，品牌名「十日家居」在同一份逐字稿裡出現三種寫法：十字架局、時日家居、施志家居；Alan 變成阿倫；短影音變成短硬陰；蝦皮、momo 變成蝦皮摸摸。Gemini 的版本是正確的，但不管用什麼工具，人名、公司名、產品名、數字都一定要核對，錯了會一路錯到會議記錄。',
  // 18 存檔
  '逐字稿存成 Google 文件，命名用日期加會議名稱，放進雲端的會議資料夾。好處是之後可以在 Gemini 用小老鼠直接引用、和同事共用、在文件裡搜尋。最後用朗讀功能聽一段，和錄音比對有沒有漏句。',
  // 19 總結
  '這個單元只記一句：人名、品名、數字一定要核對。練習：在提示詞開頭先給名單，與會者 Emily、Alan，公司十日家居，產品三項，再轉一次，比較前後專有名詞的正確率。錄音前記得先取得與會者同意。',
  // 20 2-3 章節頁
  '第三個單元：整理意見與待辦。大約 25 分鐘，接著用剛剛的逐字稿。',
  // 21 情境
  '逐字稿很長，沒人會看。會議、客戶通話、業務訪談，大家最在意的就兩件事：誰說了什麼，接下來誰要做什麼。客戶通話也一樣，把發話者換成我方和客戶就好。',
  // 22 提示詞
  '原文兩句：整理各與會人的意見、整理待辦事項。補強版指定兩張表的欄位，最重要的一句：沒有明講的負責人或期限填「未提及」，不要自己指派。最後把未提及列成待確認清單。請大家在同一個對話接著貼。',
  // 23 意見表
  '表 1：Emily 是主持人，說明目的、問策略和 KPI、收尾請大家分工回報。Alan 報告新品與客群、三大策略、四項 KPI，最後補充市場調研組要做 FB 和 IG 的調查。',
  // 24 待辦表
  '表 2 有五條。注意期限那一欄，大部分都是未提及，因為錄音裡真的沒講。「會後補上詳細資料」是 Alan 說的，負責人是推定。待確認至少有四件：分工表內容、市場調查期限、回報頻率、補分工表由誰負責。如果你的表每條都有日期，那是 AI 自己補的。',
  // 25 翻牌
  '三張卡。每條待辦都有負責人和日期：AI 自己指派的，改成未提及。「定期回報進度」：頻率沒講，列進待確認。逐字稿沒標發話者：只知道說了什麼，不知道誰說的，所以 2-2 要先標好。',
  // 26 總結
  '這個單元只記一句：未提及就是會後要追的清單。練習：請 AI 把表 2 改寫成一封會後確認信草稿，信末列出待確認的問題。寄信和行事曆在第三週的 CH06 細講。',
  // 27 休息
  '休息 10 分鐘，15:10 回來。下一段處理沒有議程的口述錄音。',
  // 28 2-4 章節頁
  '第四個單元：口述錄音變條列筆記。大約 25 分鐘。',
  // 29 情境
  '主管在電話裡一口氣交代好幾件事，中間還改口；業務拜訪完在車上錄一段語音；督導巡完店邊走邊講。案例在 CH02 資料夾的語音案例，每段 23 到 48 秒。今天用這四個：9-1 業務拜訪、9-2 採購電話、9-3 巡店、6-3 主管改口。給講師：這批錄音和舊版講義的文字不完全一樣，以錄音為準。',
  // 30 提示詞
  '口述沒有議程，所以先分類：要做、要記、要問，再加一類已取消或已更正。三條規則：改口以最後講的為準、重複的合併、沒內容的寫無。示範：上傳 9-2，貼這段。',
  // 31 9-2
  '採購電話：五項條件要記全：單價每顆 2.3 元、最低訂購量 1 萬顆、交期下單後 10 個工作天、月結 30 天。最重要的是紅字那句但書：價格只保證這個月，下個月可能重談。這句最容易被當成閒聊濾掉，下個月被漲價時才發現沒留紀錄。要問的事：有沒有現貨庫存。錄音沒講要寄確認信，AI 可以建議，但要標成它的建議。',
  // 32 9-3
  '巡店口述有三家店，先依門市分組。西門店冰箱溫度異常，週五前找廠商修，督導下週一複查；公館店排班表沒貼，明天改，督導後天 LINE 問；士林店垃圾桶區亂，口頭提醒就好。最後一件問人資教育訓練錄影，是公館店店長問的，但要督導自己去辦，所以另列，不能塞進公館店那列。',
  // 33 6-3
  '主管改口三次，先猜再翻。主視覺下班前交？先暫停，等兩點和客戶對完色調再動。找倉儲調貨？改成催採購，今天給交期。月底對請款？改對各通路的退貨折讓單，請款下週。原本的三個指示要放進已取消或已更正，不能留在要做的事。',
  // 34 總結
  '這個單元只記一句：中途改口，以最後講的為準。加分題：上傳 6-2，裡面有一句「那個誰？上次提的規格修改，你稍微 follow 一下」。請 AI 寫成「跟進：上次提的規格修改，對象未指明」，不要讓它自己猜要做什麼。',
  // 35 2-5 章節頁
  '第五個單元：照範本出會議記錄。大約 20 分鐘。',
  // 36 情境
  '部門三個人輪流做會議記錄，三種樣子：有人條列但沒寫誰負責，有人寫一大段找不到結論，有人只拍白板。主管每次都要再問。解法是：做一份公司的範本，每個人都請 AI 照範本整理。',
  // 37 舊資料
  '這頁是亮點。我們手上的範本是從上一場會議改來的，裡面還留著旅遊觀光業的主題、2025 年 9 月 8 日、王經理、陳專員、林組員。如果不說清楚，AI 很可能把這些舊資料原封不動抄進十日家居的會議記錄。',
  // 38 乾淨範本
  '最好的範本是空的範本：欄位名稱留著，內容清空。這份建議另存給學員。需要示範完成品的時候，另外放一份「完成範例」，並標明是範例。雲端上方連結那份 20250908 會議記錄，就可以當完成範例。',
  // 39 提示詞
  '原文提示詞是：整理我的會議記錄，我有提供會議紀錄範本請依照範本製作。補強版多四條：範本裡的舊資料不要沿用、沒講到的填未提及、小標題依今天內容重新命名、沒講負責人期限的填未提及。示範：範本和逐字稿一起上傳，或用小老鼠選雲端文件。',
  // 40 總結
  '這個單元只記一句：範本是格式，不是內容。核對三件事：主題是十日家居新品行銷、與會是 Emily 和 Alan、日期寫未提及。範本加提示詞存成筆記或 Gem，全部門共用，就是上午 1-5 的樣板做法。',
  // 41 2-6 章節頁
  '最後一個單元是實作，50 分鐘，用你自己帶來的錄音。',
  // 42 流程
  '五個步驟，時間都寫在上面。第一步一定要做上傳前檢查：錄音時有沒有告知與會者？有沒有薪資、人事、客戶個資？太長的錄音先剪一段 5 到 15 分鐘的。',
  // 43 三段提示詞
  '三段提示詞依序用，中括號換成你的內容：轉逐字稿、整理意見與待辦、套範本。範本用 2-5 那份乾淨的。巡堂重點：有沒有核對專有名詞、待辦有沒有亂派人。',
  // 44 檢核
  '對照四項成果。沒帶音檔的同學，用十日家居的會議錄音完整走一次，答案對照 2-3 的待辦表和 2-5 的核對重點。也可以用 9-3 巡店口述練口述變行動清單。不建議用語音案例資料夾裡兩個兩小時的檔案，那是真實的公開會議，有真實人名。',
  // 45 分享
  '最後 15 分鐘的後段，兩兩互看，用這句話分享：AI 在哪裡聽錯了，我是從哪裡發現的。每組推派一位，一人一分鐘。',
  // 46 QA
  '開放問答。錄音上傳不了、發話者分不對，都可以現在問。',
  // 47 帶走三樣
  '下午帶走三樣。觀念：聽完先核對，人名、品名、數字、決議、負責人，寄出前人工看過。提示詞：會議記錄三步，轉逐字稿標發話者、整理意見與待辦、照範本整理。行動：下次開會就用，開會前說要錄音，會後照樣板跑一次，寄出前核對。',
  // 48 第一週回顧
  '回顧今天一整天。上午是亂資料變乾淨報表：Excel、PDF、跨格式，先檢查再整理，做成樣板。下午是錄音變會議記錄：網路資料、錄音、口述，標發話者、列待辦、照範本產出。共同的一句：AI 先整理，人負責檢查與核對。',
  // 49 下週預告
  '下週六上午是 CH03 Google Sheets AI 活用術：看不懂的公式截圖問 AI、用說的讓 AI 寫函數、自動標色，最後實作帶自己公司的報表。請大家下週帶一份自己工作上的試算表（去識別後）。',
  // 50 收尾
  '回到開場的問題：下一份會議記錄，你想花多久？A 十分鐘，照樣板跑；B 還要再練習；C 有新的問題。比較一下和開場的舉手人數。謝謝大家，第一週辛苦了。',
];

export const meta: SlideMeta = {
  title: 'CH02｜AI 資料整理術（下）',
  createdAt: '2029-12-30T00:00:00.000Z',
};

export default [
  Cover,
  Recap,
  Preview,
  Hook,
  Agenda,
  U1,
  U1Case,
  U1Steps,
  U1Prompt,
  U1Flip,
  U1Result,
  U1Sum,
  U2,
  U2Case,
  U2Prompt,
  U2Result,
  U2Wrong,
  U2Save,
  U2Sum,
  U3,
  U3Case,
  U3Prompt,
  U3Opinion,
  U3Todo,
  U3Flip,
  U3Sum,
  Break,
  U4,
  U4Case,
  U4Prompt,
  U4Buy,
  U4Shop,
  U4Flip,
  U4Sum,
  U5,
  U5Case,
  U5Old,
  U5Template,
  U5Prompt,
  U5Sum,
  U6,
  U6Flow,
  U6Prompt,
  U6List,
  U6Share,
  QA,
  TakeAway,
  Week,
  Next,
  Closing,
] satisfies Page[];

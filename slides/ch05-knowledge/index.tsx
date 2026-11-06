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
  palette: { bg: '#f3f3f8', text: '#1c1d33', accent: '#3f4a9a' },
  fonts: {
    display: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
    body: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 20,
};

// 額外色票（不在 DesignSystem 範圍內）
const C = {
  muted: '#55576e',
  line: '#d9dae8',
  panel: '#e8e9f3',
  berry: '#a8441c',
  dark: '#181a30',
  darkText: '#f3f3f8',
  darkMuted: '#c0c3dc',
  gold: '#efb862',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Sans+Mono:wght@500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-ch05-knowledge';
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
      <span>CH05｜AI 知識管理術</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 4 },
  { name: '5-1 財報', from: 5, to: 12 },
  { name: '5-2 影片', from: 13, to: 18 },
  { name: '5-3 文件', from: 19, to: 28 },
  { name: '5-4 分析', from: 29, to: 37 },
  { name: '5-5 Gems', from: 38, to: 42 },
  { name: '收尾', from: 43, to: 45 },
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

/* CH05 AI 知識管理術；完整提示詞與來源見章節筆記及講師講義。 */
type Block = { head: string; body: string };

const Box = ({ head, body }: Block) => (
  <Card style={{ flex: 1, minWidth: 0, padding: '36px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--osd-accent)', marginBottom: 20 }}>{head}</div>
    <div style={{ fontSize: 42, lineHeight: 1.45, whiteSpace: 'pre-line' }}>{body}</div>
  </Card>
);

const S = ({ eyebrow, title, a, b, c, prompt, shot, foot, link }: {
  eyebrow: string; title: string; a?: Block; b?: Block; c?: Block;
  prompt?: string[]; shot?: string; foot?: string; link?: { label: string; href: string };
}) => (
  <Slide>
    <Eyebrow>{eyebrow}</Eyebrow>
    <H size={65}>{title}</H>
    <Body style={{ gap: 24 }}>
      {prompt ? <Prompt lines={prompt} size={36} /> : null}
      {shot ? (
        <div style={{ display: 'flex', gap: 28, height: 490 }}>
          {a ? <Box {...a} /> : null}
          <div style={{ flex: 1.3 }}><ShotTodo what={shot} /></div>
        </div>
      ) : (a || b || c) ? (
        <div style={{ display: 'flex', gap: 28, width: '100%', minHeight: c ? 450 : 410 }}>
          {a ? <Box {...a} /> : null}
          {b ? <Box {...b} /> : null}
          {c ? <Box {...c} /> : null}
        </div>
      ) : null}
      {foot ? <div style={{ fontSize: 32, color: C.muted, lineHeight: 1.35 }}>{foot}</div> : null}
      {link ? <a data-osd-interactive href={link.href} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} style={{ fontSize: 30, fontWeight: 700, color: 'var(--osd-accent)', textDecoration: 'underline', alignSelf: 'flex-start' }}>🔗 {link.label}</a> : null}
    </Body>
  </Slide>
);

const U = ({ no, title, goal }: { no: string; title: string; goal: string }) => (
  <Slide center>
    <Eyebrow>CH05｜AI 知識管理術</Eyebrow>
    <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
      <div style={{ fontSize: 210, fontWeight: 900, color: 'var(--osd-accent)', whiteSpace: 'nowrap' }}>{no}</div>
      <div><H size={90}>{title}</H><div style={{ fontSize: 44, lineHeight: 1.5, marginTop: 30 }}>{goal}</div></div>
    </div>
  </Slide>
);

const D = ({ label, line, sub }: { label: string; line: string; sub?: string }) => (
  <Slide dark center>
    <Eyebrow dark>{label}</Eyebrow>
    <H size={100} dark style={{ whiteSpace: 'pre-line' }}>{line}</H>
    {sub ? <div style={{ fontSize: 42, color: C.darkMuted, marginTop: 42, lineHeight: 1.45 }}>{sub}</div> : null}
  </Slide>
);

const P01: Page = () => <Slide center><Eyebrow>AI 職場全效生產力應用班｜CH05</Eyebrow><H size={122}>AI 知識管理術</H><div style={{ fontSize: 52, color: 'var(--osd-accent)', marginTop: 40 }}>資料放進去之前，先想怎麼查回來</div></Slide>;
const P02: Page = () => <S eyebrow="成果預覽" title="今天帶走五種可查核成果" a={{head:'財報與影片',body:'財報核對卡\n影片知識架構卡'}} b={{head:'生活文件',body:'文件疑點表\n原文位置'}} c={{head:'分析與應用',body:'驗算與檔案檢查單\n來源觀點卡'}} />;
const P03: Page = () => <S eyebrow="先舉手" title="AI 給你答案，你去哪裡確認？" a={{head:'A',body:'看起來很有道理'}} b={{head:'B',body:'看 AI 附的引用'}} c={{head:'C',body:'回原文件核對'}} foot="先選一個；最後一頁再回來看。" />;
const P04: Page = () => <S eyebrow="今天的路線" title="五個單元，一條共同流程" a={{head:'先準備',body:'來源盤點\n問具體問題'}} b={{head:'再查證',body:'點開引用\n回原文核對'}} c={{head:'最後交付',body:'選擇形式\n標明待查'}} />;

const P05: Page = () => <U no="5-1" title="財報先找原文" goal="兩期數字、來源位置與簡報草稿，三者都要對得上。" />;
const P06: Page = () => <S eyebrow="5-1｜來源建立" title="先建筆記本，再選官方財報" a={{head:'建筆記本',body:'一家公司\n一個明確報告期間'}} b={{head:'取財報 PDF',body:'公開資訊觀測站\n指定公司與年度'}} foot="財報檔名、年度與學員可用連結待指定；不預填真實財務數字。" />;
const P07: Page = () => <S eyebrow="5-1｜來源核對" title="上傳前，先記四件事" a={{head:'公司與期間',body:'報表屬於誰？\n比較哪兩期？'}} b={{head:'報表類型',body:'合併還是個體？\n金額單位是什麼？'}} shot="NotebookLM 財報來源與文件摘要；指定 PDF 後補圖" foot="AI 摘要只作導覽；報表身分須回 PDF 核對。" />;
const P08: Page = () => <S eyebrow="提示詞｜待實測" title="兩期數字，先列表再計算" prompt={['只根據【勾選的財報 PDF】回答。','列【科目】的本期、前期及金額單位。','附原文頁碼或引用位置，再算差額。','找不到寫「待查」，不要猜數字。']} foot="完整提示詞見 5-1 筆記【補充】；指定財報後才能填示例數字。" />;
const P09: Page = () => <S eyebrow="人工驗算" title="引用與增率，都要回財報" a={{head:'先核對原表',body:'科目、兩期、單位\n合併／個體'}} b={{head:'再算增減率',body:'（本期－前期）\n÷ 前期 ×100%'}} foot="前期為零或負值、兩期口徑不同時，不套用簡單百分比解讀。" />;
const P10: Page = () => <S eyebrow="5-1｜生成簡報" title="選用途與語言，再查成品" a={{head:'口頭報告',body:'投影片重點\n每頁一件事'}} b={{head:'書面傳閱',body:'詳細簡報\n保留數字與來源'}} shot="NotebookLM 工作室簡報設定：繁體中文與用途" foot="「Beta 版」及按鈕名稱以授課帳號的實際介面為準。" />;
const P11: Page = () => <S eyebrow="5-1｜下載與修改" title="PDF、PPTX 能不能改？打開測" a={{head:'播放與下載',body:'開啟生成結果\n檢查 PDF／PPTX'}} b={{head:'實際修改',body:'試選取一個標題\n試改一個數字'}} foot="NotebookLM 工作室輸出與 5-4 的檔案生成路線分開驗收；能下載不等於文字可編輯。" />;
const P12: Page = () => <D label="5-1 一句話" line={'財報簡報完成前，\n回原表查三件事。'} sub="財報頁碼、兩期數字與單位、每項財務觀察；來源位置要實際點開核對。" />;

const P13: Page = () => <U no="5-2" title="影片變成可回看的架構" goal="留下字幕來源、主題層次與可回看的位置。" />;
const P14: Page = () => <S eyebrow="知識點" title="字幕、逐字稿、架構不一樣" a={{head:'字幕',body:'畫面顯示的字\n可能辨識錯'}} b={{head:'逐字稿',body:'按播放順序\n整理出的文字'}} c={{head:'知識架構',body:'主題與關係\n不是短摘要'}} />;
const P15: Page = () => <S eyebrow="先選路線" title="先看 CC，再決定工具" a={{head:'公開、有字幕',body:'YouTube 內建\nGlasp 取字\nNotebook 匯入'}} b={{head:'授權本機檔',body:'Buzz 轉錄\n人工校正'}} c={{head:'沒有授權',body:'停止取檔\n換合法素材'}} />;
const P16: Page = () => <S eyebrow="操作示範｜影片待指定" title="取字前，先記影片身分" a={{head:'先記四項',body:'標題、頻道、網址\n字幕來源與查看日'}} shot="YouTube「顯示逐字稿」與可跳回的時間位置" foot="未指定影片前，不填標準答案或時間碼。" />;
const P17: Page = () => <S eyebrow="提示詞與核對｜完整版見筆記" title="AI 列主題，時間碼回影片確認" prompt={['只根據這支影片的逐字稿整理。','列 3～5 個主題、例子與限制。','每個主題附可回看的時間位置。','沒有可靠時間碼，寫「時間待核」。']} foot="逐字稿看不到畫面動作；數字、術語和操作須回原影片核對。" />;
const P18: Page = () => <S eyebrow="人工驗收" title="逐字稿看不到畫面動作" a={{head:'回看片段',body:'主題開頭\n數字與術語'}} b={{head:'再看畫面',body:'按鈕、圖表\n字幕未描述的動作'}} c={{head:'分開標記',body:'影片明說\n我的延伸應用'}} />;
const P19: Page = () => <D label="5-2 一句話" line="能點回原片段，才算完成。" sub="交付：影片資料、字幕來源、主題節點、時間位置與人工核對。" />;

const P20: Page = () => <U no="5-3" title="生活文件先盤點來源" goal="找條款與疑點；不請 AI 替你做個案裁決。" />;
const N20: Page = () => <S eyebrow="5-3｜來源檢查" title="Notebook 三區，來源先過四關" a={{head:'三個區域',body:'來源、對話、工作室\n先勾來源再問'}} b={{head:'來源四關',body:'完整性、版本\n可信度、隱私權限'}} foot="介面截圖待補；課堂不要求上傳個資或公司機密。" />;
const P21: Page = () => <S eyebrow="先認識工具" title="Notebook 的三個區域" a={{head:'來源',body:'加入並勾選\n要看的文件'}} b={{head:'對話',body:'問具體問題\n點開引用'}} c={{head:'工作室',body:'轉成報告\n資料表或圖像'}} />;
const P22: Page = () => <S eyebrow="來源進來，先判順序" title="每份來源先過四關" a={{head:'內容',body:'完整嗎？\n有附件嗎？'}} b={{head:'時效與可信',body:'版本對嗎？\n誰發布？'}} c={{head:'權限',body:'有個資嗎？\n可以上傳嗎？'}} foot="課堂不要求上傳真實保單、病歷、租約或公司機密。" />;
const P23: Page = () => <S eyebrow="案例 1｜保單" title="找條款，不預判理賠" a={{head:'要找',body:'主約、附約、批註\n等待期與除外'}} b={{head:'要問',body:'條款寫什麼？\n還缺哪些個案事實？'}} foot="無公開練習保單全文；此頁示範提問結構，案例檔待補。" />;
const P24: Page = () => <S eyebrow="案例 2a｜勞動權益" title="資遣與 PIP：先分事實和規則" a={{head:'公司說法',body:'理由、通知\n契約與工作規則'}} b={{head:'官方規則',body:'看現行主管機關資料\n附來源與日期'}} c={{head:'待確認',body:'未走 PIP\n不直接判合法性'}} />;
const P25: Page = () => <S eyebrow="案例 2b｜勞退" title="制度計算，不等於個人金額" a={{head:'先查制度',body:'月提繳工資\n申報分級'}} b={{head:'再查紀錄',body:'雇主申報資料\n個人官方紀錄'}} c={{head:'最後問',body:'何時可請領？\n缺資料就待確認'}} />;
const P26: Page = () => <S eyebrow="案例 2c｜產假與給付" title="兩個制度，分開問" a={{head:'向雇主請假',body:'產假規定\n適用與文件'}} b={{head:'向保險請領',body:'生育給付\n資格與申請'}} foot="缺個人投保與生產資料，不計算確定可領金額。" />;
const P27: Page = () => <S eyebrow="案例 3｜租約" title="兩份文件，各要有引用" a={{head:'租約草稿',body:'押金、退租\n修繕、設備'}} b={{head:'官方規範',body:'當期版本\n適用範圍'}} c={{head:'交付',body:'文字差異\n問出租人的問題'}} foot="無公開去識別化租約全文；案例檔待補。" />;
const P28: Page = () => <S eyebrow="案例 4｜虛構信用卡" title="先列條件，再算回饋" a={{head:'甲卡',body:'3% 回饋\n上限 200 元\n須登錄'}} b={{head:'乙卡',body:'2% 回饋\n摘要未列上限'}} foot="教學用虛構活動；海外手續費、排除項目與完整辦法未提供。" />;
const P29: Page = () => <S eyebrow="案例 4｜自己驗算" title="20,000 元，3% 不一定比較好" a={{head:'消費 5,000 元',body:'甲卡 150 元\n乙卡 100 元'}} b={{head:'消費 20,000 元',body:'甲卡 200 元（上限）\n乙卡 400 元'}} foot="只依虛構摘要明示條件；不代表真實刷卡淨收益。" />;
const P30: Page = () => <S eyebrow="5-3｜輸出與收尾" title="用途決定成品，不替你決定" a={{head:'精確比較',body:'資料表\n來源與條件對齊'}} b={{head:'理解內容',body:'報告或心智圖\n保留不確定處'}} c={{head:'對人說明',body:'簡報或圖表\n仍回原文核對'}} foot="交付前三問：來源現行嗎？個資安全嗎？結果拿來做什麼？" />;
const P31: Page = () => <D label="5-3 一句話" line={'AI 幫你問好問題，\n不替你做決定。'} sub="檢查來源是否現行、個資是否安全、答案要拿來做什麼。" />;

const P32: Page = () => <U no="5-4" title="先驗算，再生成檔案" goal="同一份虛構資料：算對、說清楚、打開成品測試。" />;
const N30: Page = () => <S eyebrow="5-4｜工作室總覽" title="九類工具，按目的選" a={{head:'用聽與看',body:'語音、簡報\n影片摘要'}} b={{head:'用來理解',body:'心智圖、報告\n學習卡'}} c={{head:'用來查核',body:'測驗、資訊圖表\n資料表'}} foot="帳號用量與方案因人而異；授課當日看使用量入口。" />;
const P33: Page = () => <S eyebrow="用量與方案" title="使用額度，看自己的帳號" a={{head:'不同限制',body:'筆記本數\n每本來源數\n生成額度'}} shot="Gemini Notebook 帳號「設定→使用量」或當日入口" foot="方案與額度可能變動；不在課堂背死數字。" />;
const P34: Page = () => <S eyebrow="工作室總覽" title="九類工具，不必九種全做" a={{head:'用聽與看',body:'語音摘要\n簡報\n影片摘要'}} b={{head:'用來理解',body:'心智圖\n報告\n學習卡'}} c={{head:'用來查核',body:'測驗\n資訊圖表\n資料表'}} />;
const P35: Page = () => <S eyebrow="共用練習來源" title="六景點是虛構資料" a={{head:'先貼資料',body:'2023／2024 人次\n六個景點'}} shot="貼上虛構景點人流資料並勾選唯一來源" foot="不是臺灣官方觀光統計；真實資料另建筆記本。" />;
const P36: Page = () => <S eyebrow="案例 1｜分析提示詞" title="增量與增率要分開算" a={{head:'差額',body:'2024 人次\n減 2023 人次'}} b={{head:'年增率',body:'差額 ÷ 2023 人次\n再乘 100%'}} foot="請 AI 按年增率排序；資料沒給原因，就寫無法判定。" />;
const P37: Page = () => <S eyebrow="案例 1｜核對結果" title="第一名看增率，不看增量" a={{head:'成長前三',body:'青禾 ＋30%\n海灣 ＋20%\n松林 ＋10%'}} b={{head:'兩個衰退',body:'碧水 −10%\n遠山 −20%'}} foot="原始六列逐筆驗算；人流變化的原因仍未知。" />;
const P38: Page = () => <S eyebrow="案例 2｜資訊圖表" title="先查數字，再看美觀" a={{head:'逐項檢查',body:'景點名稱\n正負號與百分比\n虛構資料標示'}} shot="工作室資訊圖表生成結果（需先實測）" />;
const P39: Page = () => <S eyebrow="案例 3a｜PPTX" title="下載後，試改一個標題" a={{head:'兩條路',body:'工作室簡報\n對話要求 PPTX'}} shot="PowerPoint 開啟檔案、選取並修改標題" foot="能下載不代表所有圖像和版面元素都能逐項編輯。" />;
const P40: Page = () => <S eyebrow="案例 3b｜XLSX" title="改一格，公式要跟著重算" a={{head:'驗收順序',body:'檢查六列與格式\n暫改人次\n看差額和年增率'}} shot="Excel 修改儲存格後，公式連動，再復原" foot="固定數字表不叫可更新報表。" />;
const P41: Page = () => <S eyebrow="案例 4｜聯網補來源" title="新資料先審查，別混進虛構本" a={{head:'候選來源',body:'發布者、年份\n範圍、統計口徑'}} b={{head:'匯入之前',body:'打開原表\n記網址與更新日'}} c={{head:'不能硬比',body:'虛構與真實資料\n分開筆記本'}} />;
const P42: Page = () => <D label="5-4 一句話" line={'來源、計算、成品、解釋：\n四關都要過。'} sub="漂亮的檔案，不能替代人工核對。" />;

const P43: Page = () => <U no="5-5" title="有任務，也要有可查來源" goal="做一個產品決策提問助手，不冒充真實名人。" />;
const P44: Page = () => <S eyebrow="知識點" title="Gem 訂規則，Notebook 管來源" a={{head:'Gem',body:'任務、語氣\n回答格式'}} b={{head:'Notebook',body:'公開資料\n來源引用'}} foot="直接把整本 Notebook 掛進 Gem 的操作尚未驗證；沒有入口就用授權檔案 Knowledge。" />;
const P45: Page = () => <S eyebrow="候選來源" title="公開資料先審查，再提煉" a={{head:'找原始資料',body:'Steve Jobs Archive\n公開演講'}} b={{head:'核對三層',body:'原文位置\n可支持的觀點\n我的工作轉用'}} foot="🔗 具體出版物檔名、授權與學員存取狀態待確認。" />;
const P46: Page = () => <S eyebrow="提示詞｜完整版見筆記" title="不模仿本人，改做產品決策提問" prompt={['只根據勾選來源，整理產品設計觀點。','每項附原文位置、可支持的說法。','工作應用推論請另外標示。','找不到依據，不編口頭禪或本人發言。']} foot="Gem 使用說明：先問聽眾、目的、資料與期限；再列事實、待查與下一步。" />;
const P47: Page = () => <D label="5-5 一句話" line={'模擬風格，\n不是本人發言。'} sub="交一張來源／原文位置／觀點／工作轉用卡；至少點開三處引用。" />;

const P48: Page = () => <S eyebrow="本章小練習" title="挑一份有權使用的資料" a={{head:'交三個問題',body:'AI 短答\n原文位置\n待查事項'}} b={{head:'上傳前檢查',body:'個資、機密\n授權與公司規範'}} foot="沒有合適資料，就用本章虛構景點資料練習。" />;
const P49: Page = () => <S eyebrow="帶走的提示詞模板" title="只用這些來源；找不到就說找不到" prompt={['只根據【我勾選的來源】回答【問題】。','輸出【欄位與格式】，每項附原文位置。','資料不足寫「待查」，不要自行補入。','最後列出我需要人工核對的三件事。']} />;
const P50: Page = () => <D label="帶走三樣｜回到開場提問" line="看引用，還要回原文。" sub="觀念：AI 找線索。模板：限定來源並標待查。行動：下次工作，為一份文件做三題來源卡。" />;

const previousNotes = [
  '開場直接問：資料放進 AI 以後，怎麼知道答案從哪裡來？本章不是比誰生成得快，而是練習查回來源。',
  '五種成果不要求每人一次做完。財報核對卡、影片架構卡、文件疑點表、資料檢查單、來源觀點卡都要留下可回查的位置。',
  '先讓大家選 A、B、C，不急著公布。收尾回到這題。引用是線索，最後仍要回原文。',
  '把五個單元用同一條線串起：先選來源，問小問題，點引用，回原文與數字，才做報告或檔案。',
  '第一單元只交一張閱讀卡。不是把整份英文 PDF 翻完，而是把三個指定問題找到位置。',
  '主案例是歷史 INTERMOLD 2026 簡章。先說清楚不是今天的報名依據。原檔名 im2026_en.pdf 已由 Drive 中繼資料核實，分享權限顯示知道連結者可讀；課堂仍要確認學員設備能開啟。畫面連結在播放模式可點。',
  'PDF 印刷頁碼、AI 引用和官方網頁是不同東西。請學員把三個位置分別寫，不把新網頁資料覆蓋舊 PDF。',
  '示範圈封面或 BOOKING PROCEDURE 的局部，保留表頭與場次。此操作在課堂帳號尚未實測；截圖待補。',
  '提示詞完整版在 5-1 筆記。此頁只留下來源範圍、分場次、原文位置與待查四個核心要求。AI 模式未實測，不能展示虛構回應。',
  '已回 im2026_en.pdf 第 8 頁視覺核對：一般付款敘述 30 天、首次參展 14 天；封面第 1 頁亦確認兩場日期。取消表要分大阪與名古屋，本簡報不報完整費率。',
  '轉到文獻回顧，帶出同一個方法。已回原 PDF 印刷 p.5 和 p.8 視覺核對：納入 15 篇，結論提到 3 篇否定結果。不是個人醫療建議。原檔名已核實，分享權限顯示知道連結者可讀，仍要在學員設備測試。',
  '請學員交四欄閱讀卡。Notebook 生成報告和簡報屬選做延伸，只有閱讀卡已核對的重點才能放進去。',
  '第二單元要做可回看的影片知識架構，不只是短摘要。指定影片尚未提供，示範時不可編造時間碼。',
  '用白話說三個詞：字幕是畫面文字，逐字稿是依播放順序的文字，架構是你整理出的主題關係。',
  '先看 CC。公開有字幕可用 YouTube 內建、Glasp 或 Notebook；Buzz 只處理有權使用的本機影音。沒有授權就停止。',
  '講師課前須指定公開、有字幕的影片。現階段只示範要記的資訊，不把任何影片當作已實測。',
  '貼完整提示詞時要提供逐字稿與時間位置。Notebook 只取得文字，不讀完整畫面。若沒有時間碼，要求寫時間待核。',
  '驗收至少回看主題起點、數字術語與一個畫面操作；影片明說和自己的工作延伸分開。',
  '完成門檻不是 AI 寫得順，而是別人能用時間位置回到原片段；缺位置就待核。',
  '第三單元用生活文件練來源管理。此處不是保險、勞動或法律諮詢；AI 只幫我們找條款與待查問題。',
  '來源、對話、工作室三區。請先選來源再問，不要把不同主題的文件混在一本裡。介面截圖待補。',
  '每新增一個來源先檢查完整性、版本、發布者與上傳權限。私人資料不作課堂練習。',
  '保單案例要有主約、附約、批註與除外條款才談可能給付。沒有公開練習保單全文，今天示範問法，不假裝有理賠答案。',
  '資遣問題先分公司說法、現行官方規則與個人尚待確認事實。PIP 是公司可能使用的績效程序，不能單憑沒走 PIP 直接判合法。',
  '勞退分制度和個人紀錄。月薪一句話不夠算確定提繳金額；核對月提繳工資與申報紀錄，再查請領規定。',
  '產假是向雇主請假，生育給付是社會保險請領。兩制度分開查；缺投保與日期資料就不計算個人確定金額。',
  '租約草稿與官方規範各要有引用。此處無公開去識別化租約全文，做條款對照框架示範，沒有合法性結論。',
  '信用卡用虛構摘要。甲卡有 3% 和 200 元上限，乙卡 2% 且摘要未列上限。未知的手續費與排除條件不許猜。',
  '請大家手算兩個消費金額。5,000 元是甲 150、乙 100；20,000 元甲 200、乙 400。乙卡數字只在摘要所述條件下成立。',
  '比較用資料表、理解用報告或心智圖、說明用簡報；先核對內容，再選輸出形式。',
  '回顧三道檢查：來源現行嗎、個資安全嗎、結果將拿來做什麼。高風險決策回正式窗口確認。',
  '第四單元用同一份虛構資料從分析到可編輯檔案。所有數字都要先驗算，再轉成圖表。',
  '筆記本數、每本來源數、生成額度不是同一種限制。到現場帳號的使用量查看，不背死數字；截圖待補。',
  '九類工作室只是選擇總覽。不要要求學員同時做九種輸出，先問交付對象與用途。',
  '把六景點虛構資料貼入單一本，確認只勾選這個來源。這不是官方觀光統計；匯入畫面待截圖。',
  '示範增量和增率不同。差額是新減舊，年增率要除以舊年。提示詞完整版在 5-4 筆記。',
  '六筆已按原表重算。青禾增率 30% 第一，但海灣增量 20,000 比青禾增量 15,000 大；不能把兩種排名混用。原因資料未提供。',
  '先查圖上的景點、百分比、正負號，再看設計。虛構資料標示不能消失。工作室操作與截圖待實測。',
  '工作室簡報與進階對話生成 PPTX 是兩條路。實際打開檔案，選取並修改一個標題；若只能改整張圖片，不稱逐項可編輯。',
  'XLSX 要有公式。暫改一筆人次，看差額和年增率是否連動，完成後復原。此功能在課堂帳號待實測。',
  '搜尋只得到候選來源。打開原頁查發布者、年份、範圍與統計口徑。虛構練習和真實統計分本，不硬算年增。',
  '四關：來源、計算、成品、解釋。只要有一關沒過，正式報告就不能直接交。',
  '第五單元沿用原筆記的職場急件情境，但不把虛構的名人回應說成本人觀點。目標是有來源的提問助手。',
  'Gem 訂任務與回答規則，Notebook 管來源。Google 官方有 Gem 加本機或 Drive 檔案 Knowledge 的路線；直接掛整本 Notebook 進 Gem 未核實，現場沒有入口就不用。',
  'Steve Jobs Archive 和公開演講只是候選來源。先查發布者與授權，再找原文位置，才談工作應用。具體出版物檔名和權限待確認。',
  '在 Notebook 提煉觀點時每項附原文。先核對引用，再把確認過的重點寫成 Gem 使用說明。不冒充真人、不編口頭禪。',
  '交付四欄觀點卡，至少點開三處引用。若只有流暢的名人口吻、沒有原文，不能說這是本人做法。',
  '請學員挑一份有權使用的資料，提出三個問題並記原文位置。不方便上傳私人檔案者用本章虛構資料。',
  '這是本章可重用模板：限定來源、指定問題與格式、附原文、缺資料寫待查。中括號由學員換成自己的內容。',
  '回到第三頁的選擇。正確做法不止看引用，而是回原文核對。下次工作先選一份文件，做三題來源卡。',
];

const new51Notes = [
  '第一單元使用新 5-1 財報筆記。先說明成果是核對卡與簡報草稿，不是投資建議。指定財報 PDF 尚未提供，畫面沒有真實財務數字。',
  '對應原筆記步驟一、二。先建 NotebookLM 筆記本，再取得公開資訊觀測站的官方財報 PDF。請先確認公司、年度、檔名與全班存取權；未指定前不展示假案例。',
  '對應原筆記步驟二、三。上傳前記公司、期間、合併或個體、金額單位。AI 摘要是導覽，不等於已核對報表身分。截圖待補。',
  '對應原筆記步驟四。完整提示詞在新 5-1 的【補充】。先要求列科目與兩期數字，附原文位置；指定財報後才填入預期數字。此提示詞待實測。',
  '示範人工驗算：先回資產負債表核對科目、期間與單位，再算差額及增率。前期為零、負值或口徑變動時，不直接解讀百分比。',
  '對應原筆記步驟五、六。工作室簡報先選口頭或書面用途，再確認繁體中文與內容。介面名稱及 Beta 標示可能變動，課堂帳號待實測，截圖待補。',
  '對應原筆記步驟七。生成後打開 PDF 和 PPTX，試選取標題與修改數字。NotebookLM 工作室輸出與 5-4 的可編輯檔案路線分開驗收；不能修改就如實說明。',
  '對應原筆記步驟八。回原始財報頁核對兩期數字、單位及每項財務觀察。原筆記說的原始段落編號尚未實測，不承諾每張投影片都有。',
];

export const notes = [
  ...previousNotes.slice(0, 4),
  ...new51Notes,
  ...previousNotes.slice(12, 17),
  previousNotes[18],
  previousNotes[19],
  'NotebookLM 分來源、對話、工作室三區；新來源先過完整性、版本、可信度、隱私權限四關。先勾來源再問，私人資料不作課堂練習。介面截圖待補。',
  ...previousNotes.slice(22, 30),
  previousNotes[31],
  '九類工作室只作總覽：語音、簡報、影片、心智圖、報告、學習卡、測驗、資訊圖表、資料表。帳號使用量與方案因人而異，授課當日查看。',
  ...previousNotes.slice(34, 40),
  previousNotes[41],
  ...previousNotes.slice(42, 47),
  ...previousNotes.slice(47, 50),
];

export const meta: SlideMeta = { title: 'CH05｜AI 知識管理術', createdAt: '2029-12-26T00:00:00.000Z' };
export default [
  P01,P02,P03,P04,P05,P06,P07,P08,P09,P10,
  P11,P12,P13,P14,P15,P16,P17,P19,P20,N20,
  P23,P24,P25,P26,P27,P28,P29,P30,P32,N30,
  P35,P36,P37,P38,P39,P40,P42,P43,P44,P45,
  P46,P47,P48,P49,P50,
] satisfies Page[];

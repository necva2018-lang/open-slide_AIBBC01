import { useEffect, useState } from 'react';
import { type DeckModule, decks } from 'virtual:decks';
import { Home } from './Home';
import { Player } from './Player';

// 網址用 #/01/5、#/00-1/5 這種形式：不需要伺服器轉址，GitHub Pages 直接可用
function parseHash(): { no: string; page: number } | null {
  const m = window.location.hash.match(/^#\/(\d{2}(?:-\d+)?)(?:\/(\d+))?/);
  return m ? { no: m[1], page: Number(m[2] ?? '1') } : null;
}

export function App() {
  const [route, setRoute] = useState(parseHash);
  const [mods, setMods] = useState<Record<string, DeckModule>>({});

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    for (const d of decks) d.load().then((m) => setMods((prev) => ({ ...prev, [d.no]: m })));
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const deck = route ? decks.find((d) => d.no === route.no) : undefined;

  // 網址指到未開放的簡報就回首頁
  useEffect(() => {
    if (route && !deck) window.location.hash = '';
  }, [route, deck]);

  if (route && deck) {
    const mod = mods[deck.no];
    if (!mod) return <div className="loading">載入中…</div>;
    return <Player no={deck.no} mod={mod} page={route.page} />;
  }
  return <Home decks={decks} mods={mods} />;
}

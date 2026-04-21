'use client';

import { useState } from 'react';

type Stage = 'one' | 'two' | 'three' | 'cake';

function TableSVG() {
  return (
    <svg
      viewBox="0 0 120 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-20 h-16 sm:w-28 sm:h-20 md:w-32 md:h-24"
    >
      <rect x="4" y="18" width="112" height="14" rx="5" fill="#7c3aed" />
      <rect x="4" y="18" width="112" height="6" rx="5" fill="#9333ea" />
      <rect x="16" y="32" width="10" height="52" rx="4" fill="#5b21b6" />
      <rect x="94" y="32" width="10" height="52" rx="4" fill="#5b21b6" />
      <rect x="16" y="58" width="88" height="6" rx="3" fill="#4c1d95" />
    </svg>
  );
}

export default function Home() {
  const [stage, setStage] = useState<Stage>('one');
  const [btnPos, setBtnPos] = useState({ top: 50, left: 50 });

  const [pizzasInBar, setPizzasInBar] = useState([0, 1, 2, 3, 4]);
  const [pizzasOnTables, setPizzasOnTables] = useState([0, 0, 0]);
  const [nextTable, setNextTable] = useState(0);
  const [allPlaced, setAllPlaced] = useState(false);

  const reset = () => {
    setStage('one');
    setBtnPos({ top: 50, left: 50 });
    setPizzasInBar([0, 1, 2, 3, 4]);
    setPizzasOnTables([0, 0, 0]);
    setNextTable(0);
    setAllPlaced(false);
  };

  // Keep button within safe bounds so it doesn't clip off screen on mobile
  const randomPos = () => ({
    top: Math.floor(Math.random() * 50) + 15,
    left: Math.floor(Math.random() * 50) + 15,
  });

  const handleStageOne = () => {
    setBtnPos(randomPos());
    setStage('two');
  };

  const handlePizzaClick = (pizzaId: number) => {
    const remaining = pizzasInBar.filter((p) => p !== pizzaId);
    setPizzasInBar(remaining);

    const updated = [...pizzasOnTables];
    updated[nextTable]++;
    setPizzasOnTables(updated);
    setNextTable((nextTable + 1) % 3);

    if (remaining.length === 0) setAllPlaced(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">

      {/* ── STAGE ONE ── */}
      {stage === 'one' && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <button
            id="btn-stage-one"
            onClick={handleStageOne}
            className="px-6 py-4 sm:px-10 sm:py-5 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-lg sm:text-2xl font-bold rounded-2xl shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-105 active:scale-95 text-center"
          >
            Click This <span className="line-through">Button</span> One
          </button>
          {/* Hint */}
          <div className="fixed bottom-6 left-4 right-4 flex items-center justify-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-full px-4 py-2.5 text-slate-400 text-xs sm:text-sm">
            <span>👆</span>
            <span>Butona tıkla ve yolculuğa başla</span>
          </div>
        </div>
      )}

      {/* ── STAGE TWO ── */}
      {stage === 'two' && (
        <>
          <button
            id="btn-stage-two"
            onClick={() => setStage('three')}
            style={{
              position: 'absolute',
              top: `${btnPos.top}%`,
              left: `${btnPos.left}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="px-5 py-3 sm:px-8 sm:py-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-base sm:text-xl font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Click This one This one
          </button>
          {/* Hint */}
          <div className="fixed bottom-6 left-4 right-4 flex items-center justify-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-full px-4 py-2.5 text-slate-400 text-xs sm:text-sm">
            <span>🏃</span>
            <span>This one this one doğrusuna tıkla</span>
          </div>
        </>
      )}

      {/* ── STAGE THREE ── */}
      {stage === 'three' && (
        <div className="flex flex-col min-h-screen pb-24">

          {/* Pizza Bar */}
          <div className="w-full bg-slate-800/80 backdrop-blur border-b border-slate-700 pt-3 pb-4 px-3 sm:px-6">
            <p className="text-center text-slate-500 text-[10px] sm:text-xs mb-3 tracking-wide uppercase font-medium">
              🍕 Tüm Pizzaları Seç ve Masana yolla 5 tane hakkın var!
            </p>
            <div className="flex justify-around items-end max-w-lg mx-auto min-h-[90px] sm:min-h-[110px] gap-1">
              {pizzasInBar.map((id) => (
                <div key={id} className="flex flex-col items-center gap-1 sm:gap-2 transition-all duration-300">
                  <span className="text-3xl sm:text-5xl md:text-6xl select-none">🍕</span>
                  <button
                    id={`btn-pizza-${id}`}
                    onClick={() => handlePizzaClick(id)}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white text-[10px] sm:text-xs font-bold rounded-lg shadow shadow-orange-500/30 transition-all duration-200 hover:scale-110 active:scale-95 whitespace-nowrap"
                  >
                    this one one
                  </button>
                </div>
              ))}
              {pizzasInBar.length === 0 && (
                <p className="text-slate-500 text-sm mx-auto self-center">Pizza kalmadı 🍽️</p>
              )}
            </div>
          </div>

          {/* Tables — scrollable row on mobile, centered row on desktop */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-row items-end justify-center gap-4 sm:gap-10 md:gap-16 px-4 py-6 overflow-x-auto w-full">
              {[0, 1, 2].map((tableIdx) => (
                <div key={tableIdx} className="flex flex-col items-center flex-shrink-0">
                  {/* Pizzas on table */}
                  <div className="flex flex-wrap gap-0.5 mb-1 min-h-[32px] sm:min-h-[48px] items-end justify-center max-w-[96px]">
                    {Array.from({ length: pizzasOnTables[tableIdx] }).map((_, i) => (
                      <span
                        key={i}
                        className="text-2xl sm:text-3xl md:text-4xl animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        🍕
                      </span>
                    ))}
                  </div>
                  <TableSVG />
                  <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Masa {tableIdx + 1}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hint */}
          {!allPlaced && (
            <div className="fixed bottom-6 left-4 right-4 flex items-center justify-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-full px-4 py-2.5 text-slate-400 text-xs sm:text-sm z-10">
              <span>🍕</span>
              <span>
                Kalan: <span className="text-orange-400 font-bold">{pizzasInBar.length}</span> — Pizzaları masaya yolla!
              </span>
            </div>
          )}

          {/* Apology Button */}
          {allPlaced && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none px-4">
              <button
                id="btn-apology"
                onClick={() => setStage('cake')}
                className="pointer-events-auto px-6 py-5 sm:px-10 sm:py-6 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-base sm:text-xl font-bold rounded-3xl shadow-2xl shadow-rose-500/40 transition-all duration-300 hover:scale-105 active:scale-95 text-center animate-pulse max-w-sm sm:max-w-lg"
              >
                Özür dilerim bu butonlar yanlış butonmuş click this one this one
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── CAKE STAGE ── */}
      {stage === 'cake' && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
          <p className="text-lg sm:text-2xl font-bold text-yellow-300 tracking-wide animate-pulse text-center">
            🎉 Doğum Günün Kutlu Olsun Hasta Kartal Tüm Butonlara Tıkla!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!🎉
          </p>
          {/* Candles */}
          <div className="flex gap-2 sm:gap-4">
            {['🕯️', '🕯️', '🕯️', '🕯️', '🕯️'].map((c, i) => (
              <span key={i} className="text-3xl sm:text-5xl animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
                {c}
              </span>
            ))}
          </div>
          {/* Giant cake */}
          <span
            className="select-none"
            style={{
              fontSize: 'clamp(6rem, 40vw, 18rem)',
              lineHeight: 1,
              filter: 'drop-shadow(0 0 60px rgba(251,191,36,0.5))',
            }}
          >
            🎂
          </span>
          {/* Confetti */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-2xl sm:text-4xl">
            {['🎉', '🎊', '✨', '🎈', '🎉', '🎊', '✨', '🎈'].map((e, i) => (
              <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                {e}
              </span>
            ))}
          </div>
          {/* Buttons row */}
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <button
              id="btn-reset"
              onClick={reset}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-300 hover:text-white text-sm sm:text-base font-semibold rounded-xl border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              🔄 Başa Dön
            </button>
            <a
              id="btn-whatsapp"
              href="https://wa.me/905412625034?text=Doğum günü Mesajım nerde"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow shadow-green-500/30 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp'tan Doğum Günü Mesajı al
            </a>
            <a
              id="btn-birthday-song"
              href="https://www.youtube.com/watch?v=RKiAo69xIZQ&list=RDRKiAo69xIZQ&start_radio=1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow shadow-rose-500/30 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              🎵 Doğum Günü Şarkısı
            </a>
            <a
              id="btn-special"
              href="https://www.youtube.com/watch?v=WiA-eo9-u1g&list=RDWiA-eo9-u1g&start_radio=1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 active:from-yellow-600 active:to-orange-600 text-white text-sm sm:text-base font-bold rounded-xl shadow shadow-orange-500/40 transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse"
            >
              ⭐ ÖZEL BUTON
            </a>
            <a
              id="btn-blow-cake"
              href="https://www.youtube.com/watch?v=fB0pyJ4QqQk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-black hover:to-gray-600 active:from-gray-950 active:to-gray-800 text-white text-sm sm:text-base font-semibold rounded-xl border border-gray-500 hover:border-white shadow shadow-gray-900/50 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              🕯️ Pastanı Üfle
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

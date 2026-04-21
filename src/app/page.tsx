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
            🎉 Doğum Günün Kutlu Olsun Hasta Kartal 🎉
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
          {/* Reset */}
          <button
            id="btn-reset"
            onClick={reset}
            className="mt-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-300 hover:text-white text-sm sm:text-base font-semibold rounded-xl border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            🔄 Başa Dön
          </button>
        </div>
      )}
    </div>
  );
}

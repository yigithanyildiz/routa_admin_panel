'use client';

import { useState } from 'react';

type Stage = 'one' | 'two' | 'three' | 'cake';

function TableSVG() {
  return (
    <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Table top */}
      <rect x="4" y="18" width="112" height="14" rx="5" fill="#7c3aed" />
      <rect x="4" y="18" width="112" height="6" rx="5" fill="#9333ea" />
      {/* Left leg */}
      <rect x="16" y="32" width="10" height="52" rx="4" fill="#5b21b6" />
      {/* Right leg */}
      <rect x="94" y="32" width="10" height="52" rx="4" fill="#5b21b6" />
      {/* Crossbar */}
      <rect x="16" y="58" width="88" height="6" rx="3" fill="#4c1d95" />
    </svg>
  );
}

export default function Home() {
  const [stage, setStage] = useState<Stage>('one');
  const [btnPos, setBtnPos] = useState({ top: 50, left: 50 });

  // Pizza bar: array of pizza ids still in bar
  const [pizzasInBar, setPizzasInBar] = useState([0, 1, 2, 3, 4]);
  // How many pizzas on each table (index 0,1,2)
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

  const randomPos = () => ({
    top: Math.floor(Math.random() * 55) + 10,
    left: Math.floor(Math.random() * 55) + 10,
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
        <div className="flex items-center justify-center min-h-screen">
          <button
            id="btn-stage-one"
            onClick={handleStageOne}
            className="px-10 py-5 bg-purple-600 hover:bg-purple-500 text-white text-2xl font-bold rounded-2xl shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Click This <span className="line-through">Button</span> One
          </button>
          {/* Hint */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-full px-5 py-2.5 text-slate-400 text-sm">
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
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xl font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Click This one This one
          </button>
          {/* Hint */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-full px-5 py-2.5 text-slate-400 text-sm">
            <span>🏃</span>
            <span>This one this one doğrusuna tıkla</span>
          </div>
        </>
      )}

      {/* ── STAGE THREE ── */}
      {stage === 'three' && (
        <div className="flex flex-col min-h-screen">

          {/* Pizza Bar */}
          <div className="w-full bg-slate-800/80 backdrop-blur border-b border-slate-700 pt-3 pb-4 px-6">
            <p className="text-center text-slate-500 text-xs mb-3 tracking-wide uppercase font-medium">🍕 Tüm Pizzaları Seç ve Masana yolla 5 tane hakkın var!</p>
            <div className="flex justify-around items-end max-w-3xl mx-auto min-h-[110px]">
              {pizzasInBar.map((id) => (
                <div key={id} className="flex flex-col items-center gap-2 transition-all duration-300">
                  <span className="text-6xl select-none">🍕</span>
                  <button
                    id={`btn-pizza-${id}`}
                    onClick={() => handlePizzaClick(id)}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold rounded-lg shadow shadow-orange-500/30 transition-all duration-200 hover:scale-110 active:scale-95 whitespace-nowrap"
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
          {/* Stage 3 hint */}
          {!allPlaced && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-full px-5 py-2.5 text-slate-400 text-sm z-10">
              <span>🍕</span>
              <span>Kalan pizza: <span className="text-orange-400 font-bold">{pizzasInBar.length}</span> — Tüm butonlara tıkla ve pizzaları masaya yolla!</span>
            </div>
          )}

          {/* Tables */}
          <div className="flex-1 flex items-center justify-center gap-16 px-8">
            {[0, 1, 2].map((tableIdx) => (
              <div key={tableIdx} className="flex flex-col items-center">
                {/* Pizzas sitting on top of table */}
                <div className="flex gap-1 mb-1 min-h-[48px] items-end justify-center">
                  {Array.from({ length: pizzasOnTables[tableIdx] }).map((_, i) => (
                    <span key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                      🍕
                    </span>
                  ))}
                </div>
                <TableSVG />
                <p className="text-slate-400 text-sm font-medium mt-2">Masa {tableIdx + 1}</p>
              </div>
            ))}
          </div>

          {/* Apology Button */}
          {allPlaced && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
              <button
                id="btn-apology"
                onClick={() => setStage('cake')}
                className="pointer-events-auto px-10 py-6 bg-rose-600 hover:bg-rose-500 text-white text-xl font-bold rounded-3xl shadow-2xl shadow-rose-500/40 transition-all duration-300 hover:scale-105 active:scale-95 max-w-lg text-center animate-pulse"
              >
                Özür dilerim bu butonlar yanlış butonmuş click this one this one
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── CAKE STAGE ── */}
      {stage === 'cake' && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <p className="text-2xl font-bold text-yellow-300 tracking-wide animate-pulse">🎉 Doğum Günün Kutlu Olsun Hasta Kartal 🎉</p>
          {/* Candles row */}
          <div className="flex gap-4">
            {['🕯️', '🕯️', '🕯️', '🕯️', '🕯️'].map((c, i) => (
              <span key={i} className="text-5xl animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
                {c}
              </span>
            ))}
          </div>
          {/* Giant cake */}
          <span
            className="select-none"
            style={{ fontSize: 'clamp(8rem, 30vw, 22rem)', lineHeight: 1, filter: 'drop-shadow(0 0 60px rgba(251,191,36,0.5))' }}
          >
            🎂
          </span>
          {/* Confetti row */}
          <div className="flex gap-3 text-4xl">
            {['🎉', '🎊', '✨', '🎈', '🎉', '🎊', '✨', '🎈'].map((e, i) => (
              <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                {e}
              </span>
            ))}
          </div>
          {/* Reset button */}
          <button
            id="btn-reset"
            onClick={reset}
            className="mt-4 px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-base font-semibold rounded-xl border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            🔄 Başa Dön
          </button>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { guideSteps } from '../data/initialData';

export const FirstAidGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<{ [guideKey: string]: Set<number> }>({});
  const [isMetroRunning, setIsMetroRunning] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const metroIntervalRef = useRef<number | null>(null);
  const heartRef = useRef<HTMLSpanElement>(null);

  const currentGuide = guideSteps[activeTab];

  // Stop metronome when tab changes or unmounts
  useEffect(() => {
    stopMetronome();
    return () => {
      stopMetronome();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [activeTab]);

  const playBeep = () => {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext may be blocked before interaction
    }

    if (heartRef.current) {
      heartRef.current.animate(
        [{ transform: 'scale(1.28)' }, { transform: 'scale(1)' }],
        { duration: 250 }
      );
    }
  };

  const startMetronome = () => {
    playBeep();
    metroIntervalRef.current = window.setInterval(playBeep, 60000 / 110);
    setIsMetroRunning(true);
  };

  const stopMetronome = () => {
    if (metroIntervalRef.current !== null) {
      clearInterval(metroIntervalRef.current);
      metroIntervalRef.current = null;
    }
    setIsMetroRunning(false);
  };

  const toggleMetronome = () => {
    if (isMetroRunning) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  const toggleStep = (stepIdx: number) => {
    const guideKey = currentGuide.k;
    setCompletedSteps((prev) => {
      const currentSet = new Set(prev[guideKey] || []);
      if (currentSet.has(stepIdx)) {
        currentSet.delete(stepIdx);
      } else {
        currentSet.add(stepIdx);
      }
      return { ...prev, [guideKey]: currentSet };
    });
  };

  const currentDoneCount = (completedSteps[currentGuide.k] || new Set()).size;
  const progressPct = Math.round((currentDoneCount / currentGuide.s.length) * 100);

  return (
    <section className="guide" id="guide">
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker">أداة تفاعلية</span>
          <h2>دليل الإسعافات الأولية في جيبك</h2>
          <p>
            خطوات بسيطة يتعلمها المشاركون في دوراتنا. وهي لا تغني عن تكوين حقيقي، لذلك اتصل دائمًا بالرقم{' '}
            <a href="tel:15">15</a> أو <a href="tel:141">141</a> في الحالات الخطيرة.
          </p>
        </div>

        <div className="guide-box">
          <div className="guide-tabs" role="tablist">
            {guideSteps.map((g, idx) => (
              <button
                key={g.k}
                role="tab"
                aria-selected={activeTab === idx}
                onClick={() => setActiveTab(idx)}
                type="button"
              >
                <span className="gi">{g.i}</span>
                {g.t}
              </button>
            ))}
          </div>

          <div className="guide-panel" role="tabpanel" aria-live="polite">
            <h3>{currentGuide.t}</h3>
            <div className="warn">⚠ {currentGuide.w}</div>

            <ol className="steps">
              {currentGuide.s.map((step, idx) => {
                const isDone = (completedSteps[currentGuide.k] || new Set()).has(idx);
                return (
                  <li
                    key={idx}
                    tabIndex={0}
                    className={isDone ? 'done' : ''}
                    onClick={() => toggleStep(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleStep(idx);
                      }
                    }}
                  >
                    {step}
                  </li>
                );
              })}
            </ol>

            {currentGuide.metro && (
              <div className="guide-foot" style={{ marginTop: '22px' }}>
                <button
                  className="btn btn-red btn-sm"
                  onClick={toggleMetronome}
                  type="button"
                >
                  {isMetroRunning ? '■ إيقاف' : '▶ تشغيل إيقاع الضغط (110/د)'}
                </button>
                <span
                  ref={heartRef}
                  style={{
                    fontSize: '2rem',
                    color: 'var(--red)',
                    display: 'inline-block',
                    transition: 'transform 0.1s ease',
                  }}
                >
                  ♥
                </span>
              </div>
            )}

            <div className="guide-foot">
              <span>اضغط على كل خطوة لتأشيرها ({currentDoneCount} من {currentGuide.s.length})</span>
              <div className="progress">
                <i style={{ width: `${progressPct}%` }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

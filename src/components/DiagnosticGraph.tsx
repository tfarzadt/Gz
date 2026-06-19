import React, { useEffect, useRef, useState } from 'react';

interface DiagnosticGraphProps {
  isOptimized: boolean;
  isRunning: boolean;
}

export const DiagnosticGraph: React.FC<DiagnosticGraphProps> = ({ isOptimized, isRunning }) => {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const animationRef = useRef<number | null>(null);
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    // Fill initial points
    const points: number[] = [];
    for (let i = 0; i < 50; i++) {
      points.push(isOptimized ? 33.3 + (Math.random() * 2 - 1) * 0.5 : 30 + Math.random() * 8 + (Math.sin(i / 2) * 5));
    }
    setDataPoints(points);
  }, [isOptimized]);

  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const updateGraph = () => {
      offsetRef.current += 1;
      setDataPoints((prev) => {
        const next = [...prev.slice(1)];
        let newPoint = 0;
        if (isOptimized) {
          // Optimized high-precision timing (flat 33ms or highly stable performance)
          newPoint = 33.33 + (Math.sin(offsetRef.current / 5) * 0.3) + (Math.random() * 0.4 - 0.2);
        } else {
          // Unstable legacy timeGetTime and heavy cache misses (sudden spikes)
          const base = 30 + (Math.cos(offsetRef.current / 4) * 4) + (Math.random() * 5);
          const hasSpike = Math.random() > 0.94;
          newPoint = hasSpike ? base + 15 + Math.random() * 10 : base;
        }
        next.push(newPoint);
        return next;
      });
      animationRef.current = requestAnimationFrame(updateGraph);
    };

    animationRef.current = requestAnimationFrame(updateGraph);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isOptimized, isRunning]);

  // Compute stats
  const average = dataPoints.reduce((a, b) => a + b, 0) / (dataPoints.length || 1);
  const peak = Math.max(...dataPoints, 1);
  const currentVal = dataPoints[dataPoints.length - 1] || 0;
  const variance = isOptimized ? '0.2 ms' : '6.4 ms';

  return (
    <div className="bg-zinc-950 p-4 rounded-lg font-mono border border-zinc-800">
      <div className="flex justify-between items-center mb-3 text-xs">
        <span className="text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          Realtime SAGE Frametime Analysis (ms)
        </span>
        <span className="text-zinc-500">Target: 33.33 ms (30 FPS Simulation Tick)</span>
      </div>

      <div className="relative h-44 flex items-end gap-[2px] pt-4 select-none pb-1 bg-zinc-900/60 rounded p-2 border border-zinc-900">
        {/* Grid lines */}
        <div className="absolute left-0 right-0 top-1/4 border-t border-zinc-800/40 pointer-events-none"></div>
        <div className="absolute left-0 right-0 top-1/2 border-t border-zinc-800/40 pointer-events-none"></div>
        <div className="absolute left-0 right-0 top-3/4 border-t border-zinc-800/40 pointer-events-none"></div>

        {/* Dynamic Bars */}
        {dataPoints.map((point, index) => {
          // Max height represent roughly 60ms
          const pct = Math.min((point / 60) * 100, 100);
          
          let color = 'bg-emerald-500/80';
          if (!isOptimized) {
            if (point > 45) color = 'bg-rose-500';
            else if (point > 38) color = 'bg-amber-500';
            else color = 'bg-cyan-500/80';
          }

          return (
            <div
              key={index}
              style={{ height: `${pct}%` }}
              className={`flex-1 transition-all duration-75 ${color} hover:brightness-125 rounded-t-[1px]`}
              title={`Frame ${index}: ${point.toFixed(2)} ms`}
            />
          );
        })}

        {/* Perfect Target Reference line */}
        <div className="absolute left-0 right-0 top-[44%] border-b border-rose-500/30 border-dashed pointer-events-none">
          <span className="absolute right-2 -top-4 text-[9px] text-rose-400">Fixed Physics Threshold</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4 text-center">
        <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase">Avg Frametime</div>
          <div className={`text-sm font-bold ${isOptimized ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {average.toFixed(2)} ms
          </div>
        </div>
        <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase">Peak Frametime</div>
          <div className={`text-sm font-bold ${peak > 45 ? 'text-rose-400 animate-pulse' : 'text-zinc-300'}`}>
            {peak.toFixed(2)} ms
          </div>
        </div>
        <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase">Jitter Variance</div>
          <div className={`text-sm font-bold ${isOptimized ? 'text-emerald-400' : 'text-amber-400'}`}>
            {variance}
          </div>
        </div>
        <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase">Replay Safety</div>
          <div className={`text-sm font-bold ${isOptimized ? 'text-emerald-400' : 'text-rose-500'}`}>
            {isOptimized ? '100% SECURE' : 'DRIFT HAZARD'}
          </div>
        </div>
      </div>
    </div>
  );
};

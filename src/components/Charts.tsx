import React, { useState } from "react";
import { ATTRIBUTION_CHANNELS, REVENUE_THROUGHPUT_SERIES } from "../data/plans";

export const RevenueThroughputChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const width = 560;
  const height = 220;
  const padLeft = 42;
  const padRight = 18;
  const padTop = 20;
  const padBottom = 32;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const maxRev = 200;
  const points = REVENUE_THROUGHPUT_SERIES.map((d, i) => {
    const x =
      padLeft + (i / (REVENUE_THROUGHPUT_SERIES.length - 1)) * innerW;
    const y = padTop + innerH - (d.revenue / maxRev) * innerH;
    return { ...d, x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(
    padTop + innerH
  ).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padTop + innerH).toFixed(1)} Z`;

  const activePoint =
    hoveredIdx !== null
      ? points[hoveredIdx]
      : points[points.length - 1];

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Reconciled Monthly Revenue &amp; Automated Tasks
          </h4>
          <p className="text-xs text-slate-500">
            Stripe + CRM Pipeline · Rolling 6 Months
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-700">
          <span>
            {activePoint.month}: <strong className="text-slate-900">${activePoint.revenue}k</strong>
          </span>
          <span className="text-slate-400">|</span>
          <span>
            {activePoint.automatedTasks.toLocaleString()} tasks
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Reconciled monthly revenue and automated workflow tasks chart"
      >
        <defs>
          <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {[0, 50, 100, 150, 200].map((tick) => {
          const y = padTop + innerH - (tick / maxRev) * innerH;
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[10px] font-mono"
              >
                ${tick}k
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#revAreaGrad)" />
        <path
          d={linePath}
          fill="none"
          stroke="#1E40AF"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((pt, idx) => {
          const isSelected = hoveredIdx === idx;
          return (
            <g key={pt.month}>
              <text
                x={pt.x}
                y={height - 10}
                textAnchor="middle"
                className="fill-slate-500 text-[11px] font-mono"
              >
                {pt.month}
              </text>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 5.5 : 3.5}
                className={isSelected ? "fill-blue-800" : "fill-white"}
                stroke="#1E40AF"
                strokeWidth="2"
              />
              <rect
                x={pt.x - 24}
                y={padTop}
                width={48}
                height={innerH + 20}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const ChannelAttributionChart: React.FC = () => {
  const maxLeads = 140;

  return (
    <div className="w-full">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Qualified Lead Attribution by Channel
          </h4>
          <p className="text-xs text-slate-500">
            318 Total SQLs · Marketing Automation + Content
          </p>
        </div>
        <span className="text-xs font-mono tabular-nums text-slate-600">
          Avg Conv: 26.6%
        </span>
      </div>

      <div className="space-y-4">
        {ATTRIBUTION_CHANNELS.map((item) => {
          const widthPct = Math.round((item.leads / maxLeads) * 100);
          return (
            <div key={item.channel} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-slate-700 truncate">
                  {item.channel}
                </span>
                <span className="font-mono tabular-nums text-slate-900 whitespace-nowrap shrink-0">
                  {item.leads} leads · {item.conversionRate}% conv
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-sm bg-slate-100">
                <div
                  className="h-full rounded-sm bg-slate-900 transition-all duration-300"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

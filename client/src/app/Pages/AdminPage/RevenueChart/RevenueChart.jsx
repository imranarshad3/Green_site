import React, { useEffect, useMemo, useRef, useState } from "react";

import { formatCompactMoney, formatCount, formatMoney } from "../AdminDashboard/dashboardStats";
import "./RevenueChart.css";

const HEIGHT = 260;
const PAD = { top: 16, right: 16, bottom: 32, left: 52 };

function niceStep(value) {
  if (value <= 0) return 25;
  const exponent = 10 ** Math.floor(Math.log10(value));
  const fraction = value / exponent;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * exponent;
}

function niceScale(maxValue) {
  const step = niceStep(maxValue / 4);
  const top = Math.max(step, Math.ceil(maxValue / step) * step);
  const ticks = [];
  for (let value = 0; value <= top + step / 2; value += step) ticks.push(value);
  return { top, ticks };
}

function RevenueChart({ series }) {
  const frameRef = useRef(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const frame = frameRef.current;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const geometry = useMemo(() => {
    const plotWidth = width - PAD.left - PAD.right;
    const plotHeight = HEIGHT - PAD.top - PAD.bottom;
    const scale = niceScale(Math.max(...series.map((point) => point.revenue), 0));
    const max = scale.top;
    const step = series.length > 1 ? plotWidth / (series.length - 1) : 0;
    const x = (index) => PAD.left + (series.length > 1 ? index * step : plotWidth / 2);
    const y = (value) => PAD.top + plotHeight - (value / max) * plotHeight;
    const points = series.map((point, index) => [x(index), y(point.revenue)]);
    const line = points.map(([px, py], index) => `${index ? "L" : "M"}${px},${py}`).join(" ");
    const baseline = PAD.top + plotHeight;
    const area = points.length
      ? `${line} L${points[points.length - 1][0]},${baseline} L${points[0][0]},${baseline} Z`
      : "";
    const ticks = scale.ticks.map((value) => ({ value, y: y(value) }));
    const labelEvery = Math.max(1, Math.ceil(series.length / Math.max(2, Math.floor(plotWidth / 72))));
    return { plotWidth, baseline, step, x, points, line, area, ticks, labelEvery };
  }, [series, width]);

  const indexFromPointer = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const relative = event.clientX - box.left - PAD.left;
    if (series.length <= 1) return 0;
    return Math.min(series.length - 1, Math.max(0, Math.round(relative / geometry.step)));
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      setActive((current) => Math.min(series.length - 1, Math.max(0, (current ?? (delta > 0 ? -1 : series.length)) + delta)));
    } else if (event.key === "Escape") {
      setActive(null);
    }
  };

  const total = series.reduce((sum, point) => sum + point.revenue, 0);
  const peak = series.reduce((best, point, index) => (point.revenue > (series[best]?.revenue ?? -1) ? index : best), 0);
  const activePoint = active === null ? null : series[active];
  const activeX = active === null ? 0 : geometry.points[active][0];
  const tooltipLeft = Math.min(Math.max(activeX, 90), width - 90);
  const lastIndex = series.length - 1;
  const showLabel = (index) =>
    index === lastIndex ||
    (index % geometry.labelEvery === 0 && lastIndex - index >= geometry.labelEvery * 0.6);

  return (
    <div className="rc-frame" ref={frameRef}>
      <svg
        className="rc-svg"
        width={width}
        height={HEIGHT}
        viewBox={`0 0 ${width} ${HEIGHT}`}
        role="img"
        aria-label={`Revenue chart. ${formatMoney(total)} across ${series.length} periods. Use left and right arrow keys to read each period.`}
        tabIndex={0}
        onPointerMove={(event) => setActive(indexFromPointer(event))}
        onPointerLeave={() => setActive(null)}
        onKeyDown={handleKeyDown}
        onBlur={() => setActive(null)}
      >
        {geometry.ticks.map((tick) => (
          <g key={tick.value}>
            <line className="rc-grid" x1={PAD.left} x2={width - PAD.right} y1={tick.y} y2={tick.y} />
            <text className="rc-axis" x={PAD.left - 10} y={tick.y} dy="0.32em" textAnchor="end">
              {formatCompactMoney(tick.value)}
            </text>
          </g>
        ))}

        {series.map((point, index) =>
          showLabel(index) ? (
            <text
              key={point.label + index}
              className="rc-axis"
              x={geometry.points[index][0]}
              y={HEIGHT - 10}
              textAnchor={index === 0 ? "start" : index === lastIndex ? "end" : "middle"}
            >
              {point.label}
            </text>
          ) : null
        )}

        <path className="rc-area" d={geometry.area} />
        <path className="rc-line" d={geometry.line} />

        {series[peak]?.revenue > 0 && active === null && (
          <g>
            <circle className="rc-dot" cx={geometry.points[peak][0]} cy={geometry.points[peak][1]} r={4} />
            <text
              className="rc-peak"
              x={Math.min(Math.max(geometry.points[peak][0], PAD.left + 40), width - PAD.right - 40)}
              y={Math.max(geometry.points[peak][1] - 12, PAD.top + 4)}
              textAnchor="middle"
            >
              {formatMoney(series[peak].revenue, 0)}
            </text>
          </g>
        )}

        {activePoint && (
          <g>
            <line className="rc-crosshair" x1={activeX} x2={activeX} y1={PAD.top} y2={geometry.baseline} />
            <circle className="rc-dot" cx={activeX} cy={geometry.points[active][1]} r={5} />
          </g>
        )}

        <rect
          className="rc-hit"
          x={PAD.left - geometry.step / 2}
          y={0}
          width={geometry.plotWidth + geometry.step}
          height={HEIGHT}
        />
      </svg>

      {activePoint && (
        <div className="rc-tooltip" style={{ left: tooltipLeft }} role="status">
          <span className="rc-tooltip-title">{activePoint.title}</span>
          <strong className="rc-tooltip-value">{formatMoney(activePoint.revenue)}</strong>
          <span className="rc-tooltip-meta">
            <span className="rc-tooltip-key" />
            {formatCount(activePoint.orders)} {activePoint.orders === 1 ? "order" : "orders"}
          </span>
        </div>
      )}
    </div>
  );
}

export default RevenueChart;

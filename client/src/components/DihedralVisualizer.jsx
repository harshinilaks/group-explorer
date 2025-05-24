import React from 'react';

function getPolygonPoints(n, radius = 100, cx = 150, cy = 150) {
  return Array.from({ length: n }, (_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2; // Top-centered
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
}

function rotatePoints(points, k) {
  const n = points.length;
  return points.map((_, i) => points[(i - k + n) % n]);
}

function reflectPoints(points, cx = 150) {
  return points.map((p) => ({ x: 2 * cx - p.x, y: p.y }));
}

function applyElementToPoints(element, points, n) {
  if (element === 'e') return points;

  if (/^r\d+$/.test(element)) {
    const k = parseInt(element.slice(1)) % n;
    return rotatePoints(points, k);
  }

  if (element === 's') {
    return reflectPoints(points);
  }

  if (/^sr\d+$/.test(element)) {
    const k = parseInt(element.slice(2)) % n;
    return reflectPoints(rotatePoints(points, k));
  }

  return points;
}

function DihedralVisualizer({ n, element }) {
  const originalPoints = getPolygonPoints(n);
  const transformedPoints = applyElementToPoints(element, originalPoints, n);

  return (
    <svg width="300" height="300" style={{ background: '#222', marginTop: '20px' }}>
      <polygon
        points={transformedPoints.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="#ccc"
        strokeWidth="2"
      />
      {transformedPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="8"
          fill={`hsl(${(i / n) * 360}, 80%, 60%)`}
          stroke="#fff"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export default DihedralVisualizer;

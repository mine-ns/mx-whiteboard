// src/utils.ts
var PRECISION = 1e-4;
var clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};
var round = (value, precision, func = "round") => {
  const multiplier = Math.pow(10, precision);
  return Math[func]((value + Number.EPSILON) * multiplier) / multiplier;
};
var roundToStep = (value, step, func = "round") => {
  const factor = 1 / step;
  return Math[func](value * factor) / factor;
};
var average = (a, b) => (a + b) / 2;
var isFiniteNumber = (value) => {
  return typeof value === "number" && Number.isFinite(value);
};
var isCloseTo = (a, b, precision = PRECISION) => Math.abs(a - b) < precision;

// src/angle.ts
var normalizeRadians = (angle) => angle < 0 ? angle % (2 * Math.PI) + 2 * Math.PI : angle % (2 * Math.PI);
var cartesian2Polar = ([
  x,
  y
]) => [
  Math.hypot(x, y),
  normalizeRadians(Math.atan2(y, x))
];
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}
function radiansToDegrees(degrees) {
  return degrees * 180 / Math.PI;
}
function isRightAngleRads(rads) {
  return Math.abs(Math.sin(2 * rads)) < PRECISION;
}
function radiansBetweenAngles(a, min, max) {
  a = normalizeRadians(a);
  min = normalizeRadians(min);
  max = normalizeRadians(max);
  if (min < max) {
    return a >= min && a <= max;
  }
  return a >= min || a <= max;
}
function radiansDifference(a, b) {
  a = normalizeRadians(a);
  b = normalizeRadians(b);
  let diff = a - b;
  if (diff < -Math.PI) {
    diff = diff + 2 * Math.PI;
  } else if (diff > Math.PI) {
    diff = diff - 2 * Math.PI;
  }
  return Math.abs(diff);
}

// src/vector.ts
function vector(x, y, originX = 0, originY = 0) {
  return [x - originX, y - originY];
}
function vectorFromPoint(p, origin = [0, 0], threshold, defaultValue = [0, 1]) {
  const vec = vector(p[0] - origin[0], p[1] - origin[1]);
  if (threshold && vectorMagnitudeSq(vec) < threshold * threshold) {
    return defaultValue;
  }
  return vec;
}
function vectorCross(a, b) {
  return a[0] * b[1] - b[0] * a[1];
}
function vectorDot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
function isVector(v) {
  return Array.isArray(v) && v.length === 2 && typeof v[0] === "number" && !isNaN(v[0]) && typeof v[1] === "number" && !isNaN(v[1]);
}
function vectorAdd(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}
function vectorSubtract(start, end) {
  return [start[0] - end[0], start[1] - end[1]];
}
function vectorScale(v, scalar) {
  return vector(v[0] * scalar, v[1] * scalar);
}
function vectorMagnitudeSq(v) {
  return v[0] * v[0] + v[1] * v[1];
}
function vectorMagnitude(v) {
  return Math.sqrt(vectorMagnitudeSq(v));
}
var vectorNormalize = (v) => {
  const m = vectorMagnitude(v);
  if (m === 0) {
    return vector(0, 0);
  }
  return vector(v[0] / m, v[1] / m);
};
var vectorNormal = (v) => vector(v[1], -v[0]);

// src/point.ts
function pointFrom(x, y) {
  return [x, y];
}
function pointFromArray(numberArray) {
  return numberArray.length === 2 ? pointFrom(numberArray[0], numberArray[1]) : void 0;
}
function pointFromPair(pair) {
  return pair;
}
function pointFromVector(v, offset = pointFrom(0, 0)) {
  return pointFrom(offset[0] + v[0], offset[1] + v[1]);
}
function isPoint(p) {
  return Array.isArray(p) && p.length === 2 && typeof p[0] === "number" && !isNaN(p[0]) && typeof p[1] === "number" && !isNaN(p[1]);
}
function pointsEqual(a, b, tolerance = PRECISION) {
  const abs = Math.abs;
  return abs(a[0] - b[0]) < tolerance && abs(a[1] - b[1]) < tolerance;
}
function pointRotateRads([x, y], [cx, cy], angle) {
  return pointFrom(
    (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle) + cx,
    (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle) + cy
  );
}
function pointRotateDegs(point, center, angle) {
  return pointRotateRads(point, center, degreesToRadians(angle));
}
function pointTranslate(p, v = [0, 0]) {
  return pointFrom(p[0] + v[0], p[1] + v[1]);
}
function pointCenter(a, b) {
  return pointFrom((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
}
function pointDistance(a, b) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}
function pointDistanceSq(a, b) {
  const xDiff = b[0] - a[0];
  const yDiff = b[1] - a[1];
  return xDiff * xDiff + yDiff * yDiff;
}
var pointScaleFromOrigin = (p, mid, multiplier) => pointTranslate(mid, vectorScale(vectorFromPoint(p, mid), multiplier));
var isPointWithinBounds = (p, q, r) => {
  return q[0] <= Math.max(p[0], r[0]) && q[0] >= Math.min(p[0], r[0]) && q[1] <= Math.max(p[1], r[1]) && q[1] >= Math.min(p[1], r[1]);
};

// src/constants.ts
var LegendreGaussN24TValues = [
  -0.06405689286260563,
  0.06405689286260563,
  -0.1911188674736163,
  0.1911188674736163,
  -0.3150426796961634,
  0.3150426796961634,
  -0.4337935076260451,
  0.4337935076260451,
  -0.5454214713888396,
  0.5454214713888396,
  -0.6480936519369755,
  0.6480936519369755,
  -0.7401241915785544,
  0.7401241915785544,
  -0.820001985973903,
  0.820001985973903,
  -0.8864155270044011,
  0.8864155270044011,
  -0.9382745520027328,
  0.9382745520027328,
  -0.9747285559713095,
  0.9747285559713095,
  -0.9951872199970213,
  0.9951872199970213
];
var LegendreGaussN24CValues = [
  0.12793819534675216,
  0.12793819534675216,
  0.1258374563468283,
  0.1258374563468283,
  0.12167047292780339,
  0.12167047292780339,
  0.1155056680537256,
  0.1155056680537256,
  0.10744427011596563,
  0.10744427011596563,
  0.09761865210411388,
  0.09761865210411388,
  0.08619016153195327,
  0.08619016153195327,
  0.0733464814110803,
  0.0733464814110803,
  0.05929858491543678,
  0.05929858491543678,
  0.04427743881741981,
  0.04427743881741981,
  0.028531388628933663,
  0.028531388628933663,
  0.0123412297999872,
  0.0123412297999872
];

// src/curve.ts
function curve(a, b, c, d) {
  return [a, b, c, d];
}
function solveWithAnalyticalJacobian(curve2, lineSegment2, t0, s0, tolerance = 1e-3, iterLimit = 10) {
  let error = Infinity;
  let iter = 0;
  while (error >= tolerance) {
    if (iter >= iterLimit) {
      return null;
    }
    const bt = 1 - t0;
    const bt2 = bt * bt;
    const bt3 = bt2 * bt;
    const t0_2 = t0 * t0;
    const t0_3 = t0_2 * t0;
    const bezierX = bt3 * curve2[0][0] + 3 * bt2 * t0 * curve2[1][0] + 3 * bt * t0_2 * curve2[2][0] + t0_3 * curve2[3][0];
    const bezierY = bt3 * curve2[0][1] + 3 * bt2 * t0 * curve2[1][1] + 3 * bt * t0_2 * curve2[2][1] + t0_3 * curve2[3][1];
    const lineX = lineSegment2[0][0] + s0 * (lineSegment2[1][0] - lineSegment2[0][0]);
    const lineY = lineSegment2[0][1] + s0 * (lineSegment2[1][1] - lineSegment2[0][1]);
    const fx = bezierX - lineX;
    const fy = bezierY - lineY;
    error = Math.abs(fx) + Math.abs(fy);
    if (error < tolerance) {
      break;
    }
    const dfx_dt = -3 * bt2 * curve2[0][0] + 3 * bt2 * curve2[1][0] - 6 * bt * t0 * curve2[1][0] - 3 * t0_2 * curve2[2][0] + 6 * bt * t0 * curve2[2][0] + 3 * t0_2 * curve2[3][0];
    const dfy_dt = -3 * bt2 * curve2[0][1] + 3 * bt2 * curve2[1][1] - 6 * bt * t0 * curve2[1][1] - 3 * t0_2 * curve2[2][1] + 6 * bt * t0 * curve2[2][1] + 3 * t0_2 * curve2[3][1];
    const dfx_ds = -(lineSegment2[1][0] - lineSegment2[0][0]);
    const dfy_ds = -(lineSegment2[1][1] - lineSegment2[0][1]);
    const det = dfx_dt * dfy_ds - dfx_ds * dfy_dt;
    if (Math.abs(det) < 1e-12) {
      return null;
    }
    const invDet = 1 / det;
    const dt = invDet * (dfy_ds * -fx - dfx_ds * -fy);
    const ds = invDet * (-dfy_dt * -fx + dfx_dt * -fy);
    t0 += dt;
    s0 += ds;
    iter += 1;
  }
  return [t0, s0];
}
var bezierEquation = (c, t) => pointFrom(
  (1 - t) ** 3 * c[0][0] + 3 * (1 - t) ** 2 * t * c[1][0] + 3 * (1 - t) * t ** 2 * c[2][0] + t ** 3 * c[3][0],
  (1 - t) ** 3 * c[0][1] + 3 * (1 - t) ** 2 * t * c[1][1] + 3 * (1 - t) * t ** 2 * c[2][1] + t ** 3 * c[3][1]
);
var initial_guesses = [
  [0.5, 0],
  [0.2, 0],
  [0.8, 0]
];
var calculate = ([t0, s0], l, c) => {
  const solution = solveWithAnalyticalJacobian(c, l, t0, s0, 0.01, 3);
  if (!solution) {
    return null;
  }
  const [t, s] = solution;
  if (t < 0 || t > 1 || s < 0 || s > 1) {
    return null;
  }
  return bezierEquation(c, t);
};
function curveIntersectLineSegment(c, l) {
  let solution = calculate(initial_guesses[0], l, c);
  if (solution) {
    return [solution];
  }
  solution = calculate(initial_guesses[1], l, c);
  if (solution) {
    return [solution];
  }
  solution = calculate(initial_guesses[2], l, c);
  if (solution) {
    return [solution];
  }
  return [];
}
function curveClosestPoint(c, p, tolerance = 1e-3) {
  const localMinimum = (min, max, f, e = tolerance) => {
    let m = min;
    let n = max;
    let k;
    while (n - m > e) {
      k = (n + m) / 2;
      if (f(k - e) < f(k + e)) {
        n = k;
      } else {
        m = k;
      }
    }
    return k;
  };
  const maxSteps = 30;
  let closestStep = 0;
  for (let min = Infinity, step = 0; step < maxSteps; step++) {
    const d = pointDistance(p, bezierEquation(c, step / maxSteps));
    if (d < min) {
      min = d;
      closestStep = step;
    }
  }
  const t0 = Math.max((closestStep - 1) / maxSteps, 0);
  const t1 = Math.min((closestStep + 1) / maxSteps, 1);
  const solution = localMinimum(
    t0,
    t1,
    (t) => pointDistance(p, bezierEquation(c, t))
  );
  if (!solution) {
    return null;
  }
  return bezierEquation(c, solution);
}
function curvePointDistance(c, p) {
  const closest = curveClosestPoint(c, p);
  if (!closest) {
    return 0;
  }
  return pointDistance(p, closest);
}
function isCurve(v) {
  return Array.isArray(v) && v.length === 4 && isPoint(v[0]) && isPoint(v[1]) && isPoint(v[2]) && isPoint(v[3]);
}
function curveTangent([p0, p1, p2, p3], t) {
  return vector(
    -3 * (1 - t) * (1 - t) * p0[0] + 3 * (1 - t) * (1 - t) * p1[0] - 6 * t * (1 - t) * p1[0] - 3 * t * t * p2[0] + 6 * t * (1 - t) * p2[0] + 3 * t * t * p3[0],
    -3 * (1 - t) * (1 - t) * p0[1] + 3 * (1 - t) * (1 - t) * p1[1] - 6 * t * (1 - t) * p1[1] - 3 * t * t * p2[1] + 6 * t * (1 - t) * p2[1] + 3 * t * t * p3[1]
  );
}
function curveCatmullRomQuadraticApproxPoints(points, tension = 0.5) {
  if (points.length < 2) {
    return;
  }
  const pointSets = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1 < 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1 >= points.length ? points.length - 1 : i + 1];
    const cpX = p1[0] + (p2[0] - p0[0]) * tension / 2;
    const cpY = p1[1] + (p2[1] - p0[1]) * tension / 2;
    pointSets.push([
      pointFrom(cpX, cpY),
      pointFrom(p2[0], p2[1])
    ]);
  }
  return pointSets;
}
function curveCatmullRomCubicApproxPoints(points, tension = 0.5) {
  if (points.length < 2) {
    return;
  }
  const pointSets = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1 < 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1 >= points.length ? points.length - 1 : i + 1];
    const p3 = points[i + 2 >= points.length ? points.length - 1 : i + 2];
    const tangent1 = [(p2[0] - p0[0]) * tension, (p2[1] - p0[1]) * tension];
    const tangent2 = [(p3[0] - p1[0]) * tension, (p3[1] - p1[1]) * tension];
    const cp1x = p1[0] + tangent1[0] / 3;
    const cp1y = p1[1] + tangent1[1] / 3;
    const cp2x = p2[0] - tangent2[0] / 3;
    const cp2y = p2[1] - tangent2[1] / 3;
    pointSets.push(
      curve(
        pointFrom(p1[0], p1[1]),
        pointFrom(cp1x, cp1y),
        pointFrom(cp2x, cp2y),
        pointFrom(p2[0], p2[1])
      )
    );
  }
  return pointSets;
}
function curveOffsetPoints([p0, p1, p2, p3], offset, steps = 50) {
  const offsetPoints = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const c = curve(p0, p1, p2, p3);
    const point = bezierEquation(c, t);
    const tangent = vectorNormalize(curveTangent(c, t));
    const normal = vectorNormal(tangent);
    offsetPoints.push(pointFromVector(vectorScale(normal, offset), point));
  }
  return offsetPoints;
}
function offsetPointsForQuadraticBezier(p0, p1, p2, offsetDist, steps = 50) {
  const offsetPoints = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const t1 = 1 - t;
    const point = pointFrom(
      t1 * t1 * p0[0] + 2 * t1 * t * p1[0] + t * t * p2[0],
      t1 * t1 * p0[1] + 2 * t1 * t * p1[1] + t * t * p2[1]
    );
    const tangentX = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const tangentY = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    const tangent = vectorNormalize(vector(tangentX, tangentY));
    const normal = vectorNormal(tangent);
    offsetPoints.push(pointFromVector(vectorScale(normal, offsetDist), point));
  }
  return offsetPoints;
}
function curveLength(c) {
  const z2 = 0.5;
  let sum = 0;
  for (let i = 0; i < 24; i++) {
    const t = z2 * LegendreGaussN24TValues[i] + z2;
    const derivativeVector = curveTangent(c, t);
    const magnitude = Math.sqrt(
      derivativeVector[0] * derivativeVector[0] + derivativeVector[1] * derivativeVector[1]
    );
    sum += LegendreGaussN24CValues[i] * magnitude;
  }
  return z2 * sum;
}
function curveLengthAtParameter(c, t) {
  if (t <= 0) {
    return 0;
  }
  if (t >= 1) {
    return curveLength(c);
  }
  const z1 = t / 2;
  const z2 = t / 2;
  let sum = 0;
  for (let i = 0; i < 24; i++) {
    const parameter = z1 * LegendreGaussN24TValues[i] + z2;
    const derivativeVector = curveTangent(c, parameter);
    const magnitude = Math.sqrt(
      derivativeVector[0] * derivativeVector[0] + derivativeVector[1] * derivativeVector[1]
    );
    sum += LegendreGaussN24CValues[i] * magnitude;
  }
  return z1 * sum;
}
function curvePointAtLength(c, percent) {
  if (percent <= 0) {
    return bezierEquation(c, 0);
  }
  if (percent >= 1) {
    return bezierEquation(c, 1);
  }
  const totalLength = curveLength(c);
  const targetLength = totalLength * percent;
  let tMin = 0;
  let tMax = 1;
  let t = percent;
  let currentLength = 0;
  const tolerance = totalLength * 1e-4;
  const maxIterations = 20;
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    currentLength = curveLengthAtParameter(c, t);
    const error = Math.abs(currentLength - targetLength);
    if (error < tolerance) {
      break;
    }
    if (currentLength < targetLength) {
      tMin = t;
    } else {
      tMax = t;
    }
    t = (tMin + tMax) / 2;
  }
  return bezierEquation(c, t);
}

// src/ellipse.ts
function ellipse(center, halfWidth, halfHeight) {
  return {
    center,
    halfWidth,
    halfHeight
  };
}
var ellipseIncludesPoint = (p, ellipse2) => {
  const { center, halfWidth, halfHeight } = ellipse2;
  const normalizedX = (p[0] - center[0]) / halfWidth;
  const normalizedY = (p[1] - center[1]) / halfHeight;
  return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
};
var ellipseTouchesPoint = (point, ellipse2, threshold = PRECISION) => {
  return ellipseDistanceFromPoint(point, ellipse2) <= threshold;
};
var ellipseDistanceFromPoint = (p, ellipse2) => {
  const { halfWidth, halfHeight, center } = ellipse2;
  const a = halfWidth;
  const b = halfHeight;
  const translatedPoint = vectorAdd(
    vectorFromPoint(p),
    vectorScale(vectorFromPoint(center), -1)
  );
  const px = Math.abs(translatedPoint[0]);
  const py = Math.abs(translatedPoint[1]);
  let tx = 0.707;
  let ty = 0.707;
  for (let i = 0; i < 3; i++) {
    const x = a * tx;
    const y = b * ty;
    const ex = (a * a - b * b) * tx ** 3 / a;
    const ey = (b * b - a * a) * ty ** 3 / b;
    const rx = x - ex;
    const ry = y - ey;
    const qx = px - ex;
    const qy = py - ey;
    const r = Math.hypot(ry, rx);
    const q = Math.hypot(qy, qx);
    tx = Math.min(1, Math.max(0, (qx * r / q + ex) / a));
    ty = Math.min(1, Math.max(0, (qy * r / q + ey) / b));
    const t = Math.hypot(ty, tx);
    tx /= t;
    ty /= t;
  }
  const [minX, minY] = [
    a * tx * Math.sign(translatedPoint[0]),
    b * ty * Math.sign(translatedPoint[1])
  ];
  return pointDistance(pointFromVector(translatedPoint), pointFrom(minX, minY));
};
function ellipseSegmentInterceptPoints(e, s) {
  const rx = e.halfWidth;
  const ry = e.halfHeight;
  const dir = vectorFromPoint(s[1], s[0]);
  const diff = vector(s[0][0] - e.center[0], s[0][1] - e.center[1]);
  const mDir = vector(dir[0] / (rx * rx), dir[1] / (ry * ry));
  const mDiff = vector(diff[0] / (rx * rx), diff[1] / (ry * ry));
  const a = vectorDot(dir, mDir);
  const b = vectorDot(dir, mDiff);
  const c = vectorDot(diff, mDiff) - 1;
  const d = b * b - a * c;
  const intersections = [];
  if (d > 0) {
    const t_a = (-b - Math.sqrt(d)) / a;
    const t_b = (-b + Math.sqrt(d)) / a;
    if (0 <= t_a && t_a <= 1) {
      intersections.push(
        pointFrom(
          s[0][0] + (s[1][0] - s[0][0]) * t_a,
          s[0][1] + (s[1][1] - s[0][1]) * t_a
        )
      );
    }
    if (0 <= t_b && t_b <= 1) {
      intersections.push(
        pointFrom(
          s[0][0] + (s[1][0] - s[0][0]) * t_b,
          s[0][1] + (s[1][1] - s[0][1]) * t_b
        )
      );
    }
  } else if (d === 0) {
    const t = -b / a;
    if (0 <= t && t <= 1) {
      intersections.push(
        pointFrom(
          s[0][0] + (s[1][0] - s[0][0]) * t,
          s[0][1] + (s[1][1] - s[0][1]) * t
        )
      );
    }
  }
  return intersections;
}
function ellipseLineIntersectionPoints({ center, halfWidth, halfHeight }, [g, h]) {
  const [cx, cy] = center;
  const x1 = g[0] - cx;
  const y1 = g[1] - cy;
  const x2 = h[0] - cx;
  const y2 = h[1] - cy;
  const a = Math.pow(x2 - x1, 2) / Math.pow(halfWidth, 2) + Math.pow(y2 - y1, 2) / Math.pow(halfHeight, 2);
  const b = 2 * (x1 * (x2 - x1) / Math.pow(halfWidth, 2) + y1 * (y2 - y1) / Math.pow(halfHeight, 2));
  const c = Math.pow(x1, 2) / Math.pow(halfWidth, 2) + Math.pow(y1, 2) / Math.pow(halfHeight, 2) - 1;
  const t1 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
  const t2 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
  const candidates = [
    pointFrom(x1 + t1 * (x2 - x1) + cx, y1 + t1 * (y2 - y1) + cy),
    pointFrom(x1 + t2 * (x2 - x1) + cx, y1 + t2 * (y2 - y1) + cy)
  ].filter((p) => !isNaN(p[0]) && !isNaN(p[1]));
  if (candidates.length === 2 && pointsEqual(candidates[0], candidates[1])) {
    return [candidates[0]];
  }
  return candidates;
}

// src/line.ts
function line(a, b) {
  return [a, b];
}
function linesIntersectAt(a, b) {
  const A1 = a[1][1] - a[0][1];
  const B1 = a[0][0] - a[1][0];
  const A2 = b[1][1] - b[0][1];
  const B2 = b[0][0] - b[1][0];
  const D = A1 * B2 - A2 * B1;
  if (D !== 0) {
    const C1 = A1 * a[0][0] + B1 * a[0][1];
    const C2 = A2 * b[0][0] + B2 * b[0][1];
    return pointFrom((C1 * B2 - C2 * B1) / D, (A1 * C2 - A2 * C1) / D);
  }
  return null;
}

// src/segment.ts
function lineSegment(a, b) {
  return [a, b];
}
var isLineSegment = (segment) => Array.isArray(segment) && segment.length === 2 && isPoint(segment[0]) && isPoint(segment[0]);
var lineSegmentRotate = (l, angle, origin) => {
  return lineSegment(
    pointRotateRads(l[0], origin || pointCenter(l[0], l[1]), angle),
    pointRotateRads(l[1], origin || pointCenter(l[0], l[1]), angle)
  );
};
var segmentsIntersectAt = (a, b) => {
  const a0 = vectorFromPoint(a[0]);
  const a1 = vectorFromPoint(a[1]);
  const b0 = vectorFromPoint(b[0]);
  const b1 = vectorFromPoint(b[1]);
  const r = vectorSubtract(a1, a0);
  const s = vectorSubtract(b1, b0);
  const denominator = vectorCross(r, s);
  if (denominator === 0) {
    return null;
  }
  const i = vectorSubtract(vectorFromPoint(b[0]), vectorFromPoint(a[0]));
  const u = vectorCross(i, r) / denominator;
  const t = vectorCross(i, s) / denominator;
  if (u === 0) {
    return null;
  }
  const p = vectorAdd(a0, vectorScale(r, t));
  if (t >= 0 && t < 1 && u >= 0 && u < 1) {
    return pointFromVector(p);
  }
  return null;
};
var pointOnLineSegment = (point, line2, threshold = PRECISION) => {
  const distance = distanceToLineSegment(point, line2);
  if (distance === 0) {
    return true;
  }
  return distance < threshold;
};
var distanceToLineSegment = (point, line2) => {
  const [x, y] = point;
  const [[x1, y1], [x2, y2]] = line2;
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) {
    param = dot / len_sq;
  }
  let xx;
  let yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
};
function lineSegmentIntersectionPoints(l, s, threshold) {
  const candidate = linesIntersectAt(line(l[0], l[1]), line(s[0], s[1]));
  if (!candidate || !pointOnLineSegment(candidate, s, threshold) || !pointOnLineSegment(candidate, l, threshold)) {
    return null;
  }
  return candidate;
}
function lineSegmentsDistance(s1, s2) {
  if (lineSegmentIntersectionPoints(s1, s2)) {
    return 0;
  }
  return Math.min(
    distanceToLineSegment(s1[0], s2),
    distanceToLineSegment(s1[1], s2),
    distanceToLineSegment(s2[0], s1),
    distanceToLineSegment(s2[1], s1)
  );
}

// src/polygon.ts
function polygon(...points) {
  return polygonClose(points);
}
function polygonFromPoints(points) {
  return polygonClose(points);
}
var polygonIncludesPoint = (point, polygon2) => {
  const x = point[0];
  const y = point[1];
  let inside = false;
  for (let i = 0, j = polygon2.length - 1; i < polygon2.length; j = i++) {
    const xi = polygon2[i][0];
    const yi = polygon2[i][1];
    const xj = polygon2[j][0];
    const yj = polygon2[j][1];
    if ((yi > y && yj <= y || yi <= y && yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};
var polygonIncludesPointNonZero = (point, polygon2) => {
  const [x, y] = point;
  let windingNumber = 0;
  for (let i = 0; i < polygon2.length; i++) {
    const j = (i + 1) % polygon2.length;
    const [xi, yi] = polygon2[i];
    const [xj, yj] = polygon2[j];
    if (yi <= y) {
      if (yj > y) {
        if ((xj - xi) * (y - yi) - (x - xi) * (yj - yi) > 0) {
          windingNumber++;
        }
      }
    } else if (yj <= y) {
      if ((xj - xi) * (y - yi) - (x - xi) * (yj - yi) < 0) {
        windingNumber--;
      }
    }
  }
  return windingNumber !== 0;
};
var pointOnPolygon = (p, poly, threshold = PRECISION) => {
  let on = false;
  for (let i = 0, l = poly.length - 1; i < l; i++) {
    if (pointOnLineSegment(p, lineSegment(poly[i], poly[i + 1]), threshold)) {
      on = true;
      break;
    }
  }
  return on;
};
function polygonClose(polygon2) {
  return polygonIsClosed(polygon2) ? polygon2 : [...polygon2, polygon2[0]];
}
function polygonIsClosed(polygon2) {
  return pointsEqual(polygon2[0], polygon2[polygon2.length - 1]);
}

// src/range.ts
import { toBrandedType } from "@excalidraw/common";
function rangeInclusive(start, end) {
  return toBrandedType([start, end]);
}
function rangeInclusiveFromPair(pair) {
  return toBrandedType(pair);
}
var rangesOverlap = ([a0, a1], [b0, b1]) => {
  if (a0 <= b0) {
    return a1 >= b0;
  }
  if (a0 >= b0) {
    return b1 >= a0;
  }
  return false;
};
var rangeIntersection = ([a0, a1], [b0, b1]) => {
  const rangeStart = Math.max(a0, b0);
  const rangeEnd = Math.min(a1, b1);
  if (rangeStart <= rangeEnd) {
    return toBrandedType([rangeStart, rangeEnd]);
  }
  return null;
};
var rangeIncludesValue = (value, [min, max]) => {
  return value >= min && value <= max;
};

// src/rectangle.ts
function rectangle(topLeft, bottomRight) {
  return [topLeft, bottomRight];
}
function rectangleFromNumberSequence(minX, minY, maxX, maxY) {
  return rectangle(pointFrom(minX, minY), pointFrom(maxX, maxY));
}
function rectangleIntersectLineSegment(r, l) {
  return [
    lineSegment(r[0], pointFrom(r[1][0], r[0][1])),
    lineSegment(pointFrom(r[1][0], r[0][1]), r[1]),
    lineSegment(r[1], pointFrom(r[0][0], r[1][1])),
    lineSegment(pointFrom(r[0][0], r[1][1]), r[0])
  ].map((s) => lineSegmentIntersectionPoints(l, s)).filter((i) => !!i);
}
function rectangleIntersectRectangle(rectangle1, rectangle2) {
  const [[minX1, minY1], [maxX1, maxY1]] = rectangle1;
  const [[minX2, minY2], [maxX2, maxY2]] = rectangle2;
  return minX1 < maxX2 && maxX1 > minX2 && minY1 < maxY2 && maxY1 > minY2;
}

// src/triangle.ts
function triangleIncludesPoint([a, b, c], p) {
  const triangleSign = (p1, p2, p3) => (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
  const d1 = triangleSign(p, a, b);
  const d2 = triangleSign(p, b, c);
  const d3 = triangleSign(p, c, a);
  const has_neg = d1 < 0 || d2 < 0 || d3 < 0;
  const has_pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(has_neg && has_pos);
}
export {
  PRECISION,
  average,
  bezierEquation,
  cartesian2Polar,
  clamp,
  curve,
  curveCatmullRomCubicApproxPoints,
  curveCatmullRomQuadraticApproxPoints,
  curveClosestPoint,
  curveIntersectLineSegment,
  curveLength,
  curveLengthAtParameter,
  curveOffsetPoints,
  curvePointAtLength,
  curvePointDistance,
  curveTangent,
  degreesToRadians,
  distanceToLineSegment,
  ellipse,
  ellipseDistanceFromPoint,
  ellipseIncludesPoint,
  ellipseLineIntersectionPoints,
  ellipseSegmentInterceptPoints,
  ellipseTouchesPoint,
  isCloseTo,
  isCurve,
  isFiniteNumber,
  isLineSegment,
  isPoint,
  isPointWithinBounds,
  isRightAngleRads,
  isVector,
  line,
  lineSegment,
  lineSegmentIntersectionPoints,
  lineSegmentRotate,
  lineSegmentsDistance,
  linesIntersectAt,
  normalizeRadians,
  offsetPointsForQuadraticBezier,
  pointCenter,
  pointDistance,
  pointDistanceSq,
  pointFrom,
  pointFromArray,
  pointFromPair,
  pointFromVector,
  pointOnLineSegment,
  pointOnPolygon,
  pointRotateDegs,
  pointRotateRads,
  pointScaleFromOrigin,
  pointTranslate,
  pointsEqual,
  polygon,
  polygonFromPoints,
  polygonIncludesPoint,
  polygonIncludesPointNonZero,
  radiansBetweenAngles,
  radiansDifference,
  radiansToDegrees,
  rangeIncludesValue,
  rangeInclusive,
  rangeInclusiveFromPair,
  rangeIntersection,
  rangesOverlap,
  rectangle,
  rectangleFromNumberSequence,
  rectangleIntersectLineSegment,
  rectangleIntersectRectangle,
  round,
  roundToStep,
  segmentsIntersectAt,
  triangleIncludesPoint,
  vector,
  vectorAdd,
  vectorCross,
  vectorDot,
  vectorFromPoint,
  vectorMagnitude,
  vectorMagnitudeSq,
  vectorNormal,
  vectorNormalize,
  vectorScale,
  vectorSubtract
};
//# sourceMappingURL=index.js.map

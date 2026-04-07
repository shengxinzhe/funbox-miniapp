// 错觉实验室 - Illusion Lab

// ---------- Illusion Drawing Functions ----------

function drawMullerLyer(ctx, w, h) {
  const cx = w / 2, cy = h / 2;
  const len = w * 0.28, arm = 30, gap = 90;
  ctx.strokeStyle = '#1D1D1F';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  // Line 1 (with outward arrows ><) - upper
  const y1 = cy - gap;
  ctx.beginPath(); ctx.moveTo(cx - len, y1); ctx.lineTo(cx + len, y1); ctx.stroke();
  // Left arrowhead outward
  ctx.beginPath(); ctx.moveTo(cx - len, y1); ctx.lineTo(cx - len - arm, y1 - arm); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - len, y1); ctx.lineTo(cx - len - arm, y1 + arm); ctx.stroke();
  // Right arrowhead outward
  ctx.beginPath(); ctx.moveTo(cx + len, y1); ctx.lineTo(cx + len + arm, y1 - arm); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + len, y1); ctx.lineTo(cx + len + arm, y1 + arm); ctx.stroke();

  // Line 2 (with inward arrows <>) - lower
  const y2 = cy + gap;
  ctx.beginPath(); ctx.moveTo(cx - len, y2); ctx.lineTo(cx + len, y2); ctx.stroke();
  // Left arrowhead inward
  ctx.beginPath(); ctx.moveTo(cx - len, y2); ctx.lineTo(cx - len + arm, y2 - arm); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - len, y2); ctx.lineTo(cx - len + arm, y2 + arm); ctx.stroke();
  // Right arrowhead inward
  ctx.beginPath(); ctx.moveTo(cx + len, y2); ctx.lineTo(cx + len - arm, y2 - arm); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + len, y2); ctx.lineTo(cx + len - arm, y2 + arm); ctx.stroke();

  // Labels
  ctx.fillStyle = '#86868B';
  ctx.font = '26px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('A', cx - len - 10, y1 - 40);
  ctx.fillText('B', cx - len - 10, y2 - 40);
}

function drawMullerLyerReveal(ctx, w, h) {
  drawMullerLyer(ctx, w, h);
  const cx = w / 2, cy = h / 2, len = w * 0.28, gap = 90;
  // Dashed equal-length indicators
  ctx.strokeStyle = '#34C759';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.moveTo(cx - len, cy - gap - 18); ctx.lineTo(cx + len, cy - gap - 18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - len, cy + gap - 18); ctx.lineTo(cx + len, cy + gap - 18); ctx.stroke();
  // tick marks
  [[cx - len, cy - gap - 18],[cx + len, cy - gap - 18],[cx - len, cy + gap - 18],[cx + len, cy + gap - 18]].forEach(([x,y]) => {
    ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8); ctx.stroke();
  });
  ctx.setLineDash([]);
  ctx.fillStyle = '#34C759';
  ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('两线等长 ✓', cx, cy - gap - 40);
}

function drawEbbinghaus(ctx, w, h) {
  const cx = w / 2, cy = h / 2;
  const r = 30, bigR = 52, smallR = 16, orbitR = 95;
  const leftX = cx - 130, rightX = cx + 130;

  // Left center circle (surrounded by big circles)
  ctx.fillStyle = '#FF9F0A';
  ctx.beginPath(); ctx.arc(leftX, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5856D6';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath(); ctx.arc(leftX + Math.cos(a) * orbitR, cy + Math.sin(a) * orbitR, bigR, 0, Math.PI * 2); ctx.fill();
  }

  // Right center circle (surrounded by small circles)
  ctx.fillStyle = '#FF9F0A';
  ctx.beginPath(); ctx.arc(rightX, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#5856D6';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath(); ctx.arc(rightX + Math.cos(a) * (r + smallR + 8), cy + Math.sin(a) * (r + smallR + 8), smallR, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = '#86868B';
  ctx.font = '26px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', leftX, cy + 160);
  ctx.fillText('B', rightX, cy + 160);
}

function drawEbbinghausReveal(ctx, w, h) {
  drawEbbinghaus(ctx, w, h);
  const cx = w / 2, cy = h / 2, r = 30;
  const leftX = cx - 130, rightX = cx + 130;
  ctx.strokeStyle = '#34C759';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  ctx.beginPath(); ctx.arc(leftX, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(rightX, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#34C759';
  ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('两圆等大 ✓', cx, cy - 140);
}

function drawVerticalHorizontal(ctx, w, h) {
  const cx = w / 2, cy = h / 2 + 40;
  const len = 160;
  ctx.strokeStyle = '#1D1D1F';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  // Horizontal line
  ctx.beginPath(); ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy); ctx.stroke();
  // Vertical line (from middle of horizontal, going up)
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - len * 2); ctx.stroke();

  ctx.fillStyle = '#86868B';
  ctx.font = '26px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('横线', cx, cy + 50);
  ctx.textAlign = 'right';
  ctx.fillText('竖线', cx - 20, cy - len * 2 + 10);
}

function drawVerticalHorizontalReveal(ctx, w, h) {
  drawVerticalHorizontal(ctx, w, h);
  const cx = w / 2, cy = h / 2 + 40, len = 160;
  ctx.strokeStyle = '#34C759';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.moveTo(cx - len, cy - 20); ctx.lineTo(cx + len, cy - 20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 20, cy); ctx.lineTo(cx + 20, cy - len * 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#34C759';
  ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('两线等长 ✓', cx + 80, cy - len - 20);
}

function drawJastrow(ctx, w, h) {
  const cx = w / 2, cy = h / 2;
  function drawArc(x, y, r1, r2, startAngle, endAngle, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r2, startAngle, endAngle);
    ctx.arc(x, y, r1, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fill();
  }
  const yOffset = 60;
  // Upper arc (appears smaller - inner part faces up)
  drawArc(cx, cy - yOffset, 80, 130, -Math.PI * 0.6, Math.PI * 0.6 + 0.1, '#5856D6');
  // Lower arc (appears larger - outer part faces down)
  drawArc(cx, cy + yOffset, 80, 130, -Math.PI * 0.6 - 0.1, Math.PI * 0.6, '#AF52DE');

  ctx.fillStyle = '#86868B';
  ctx.font = '26px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A（上）', cx - 20, cy - yOffset - 80);
  ctx.fillText('B（下）', cx - 20, cy + yOffset + 100);
}

function drawJastrowReveal(ctx, w, h) {
  drawJastrow(ctx, w, h);
  const cx = w / 2, cy = h / 2;
  ctx.fillStyle = '#34C759';
  ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('两弧形完全相同 ✓', cx, cy + 180);
}

function drawPoggendorff(ctx, w, h) {
  const cx = w / 2, cy = h / 2;
  const rw = 70, rh = h * 0.55;
  // Rectangle (occluding bar)
  ctx.fillStyle = '#E5E5EA';
  ctx.strokeStyle = '#C7C7CC';
  ctx.lineWidth = 1;
  ctx.fillRect(cx - rw, cy - rh / 2, rw * 2, rh);
  ctx.strokeRect(cx - rw, cy - rh / 2, rw * 2, rh);

  // Diagonal line (left part)
  const slope = 0.6;
  const lx1 = cx - rw - 140, ly1 = cy - slope * 140;
  const lx2 = cx - rw, ly2 = cy;
  ctx.strokeStyle = '#5856D6';
  ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.moveTo(lx1, ly1); ctx.lineTo(lx2, ly2); ctx.stroke();

  // Two possible continuations on the right
  const rx = cx + rw;
  // Option A: correct continuation (appears wrong)
  const ay1 = cy, ay2 = cy + slope * 140;
  ctx.strokeStyle = '#FF9F0A';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(rx, ay1); ctx.lineTo(rx + 140, ay2); ctx.stroke();
  // Option B: shifted up (appears correct to eyes)
  const by1 = cy - 30, by2 = cy - 30 + slope * 140;
  ctx.strokeStyle = '#FF3B30';
  ctx.lineWidth = 3;
  ctx.lineDash = [];
  ctx.beginPath(); ctx.moveTo(rx, by1); ctx.lineTo(rx + 140, by2); ctx.stroke();

  ctx.fillStyle = '#86868B';
  ctx.font = '26px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('A', rx + 145, ay2 + 8);
  ctx.fillText('B', rx + 145, by2 + 8);
}

function drawPoggendorffReveal(ctx, w, h) {
  drawPoggendorff(ctx, w, h);
  const cx = w / 2, cy = h / 2, slope = 0.6;
  ctx.strokeStyle = '#34C759';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 5]);
  const lx1 = cx - 70 - 140, ly1 = cy - slope * 140;
  const rx2 = cx + 70 + 140, ry2 = cy + slope * 140;
  ctx.beginPath(); ctx.moveTo(lx1, ly1); ctx.lineTo(rx2, ry2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#34C759';
  ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A是正确延伸 ✓', cx, cy - h * 0.3);
}

function drawSander(ctx, w, h) {
  const cx = w / 2, cy = h / 2;
  // Two parallelograms
  const pw = 200, ph = 100, skew = 60;
  // Left parallelogram
  const lx = cx - 130;
  const lPoints = [[lx - pw/2 + skew, cy - ph/2], [lx + pw/2 + skew, cy - ph/2],
                    [lx + pw/2 - skew, cy + ph/2], [lx - pw/2 - skew, cy + ph/2]];
  ctx.fillStyle = '#F2F2F7';
  ctx.strokeStyle = '#C7C7CC';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  lPoints.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Left diagonal
  ctx.strokeStyle = '#5856D6';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(lPoints[0][0], lPoints[0][1]); ctx.lineTo(lPoints[2][0], lPoints[2][1]); ctx.stroke();

  // Right parallelogram (larger)
  const rx = cx + 80;
  const rph = 160;
  const rPoints = [[rx - pw/2 + skew*1.5, cy - rph/2], [rx + pw/2 + skew*1.5, cy - rph/2],
                    [rx + pw/2 - skew*1.5, cy + rph/2], [rx - pw/2 - skew*1.5, cy + rph/2]];
  ctx.fillStyle = '#F2F2F7';
  ctx.strokeStyle = '#C7C7CC';
  ctx.beginPath();
  rPoints.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // Right diagonal (shorter-looking)
  ctx.strokeStyle = '#AF52DE';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(rPoints[0][0], rPoints[0][1]); ctx.lineTo(rPoints[2][0], rPoints[2][1]); ctx.stroke();

  ctx.fillStyle = '#86868B';
  ctx.font = '26px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', lx, cy + ph/2 + 40);
  ctx.fillText('B', rx, cy + rph/2 + 40);
}

function drawSanderReveal(ctx, w, h) {
  drawSander(ctx, w, h);
  const cx = w / 2, cy = h / 2;
  ctx.fillStyle = '#34C759';
  ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('两条对角线等长 ✓', cx, cy - 120);
}

function drawDelboeuf(ctx, w, h) {
  const cx = w / 2, cy = h / 2;
  const r = 36;
  const leftX = cx - 130, rightX = cx + 130;

  // Left: small ring difference
  ctx.strokeStyle = '#5856D6';
  ctx.lineWidth = 3;
  ctx.fillStyle = 'none';
  ctx.beginPath(); ctx.arc(leftX, cy, r + 20, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#FF9F0A';
  ctx.beginPath(); ctx.arc(leftX, cy, r, 0, Math.PI * 2); ctx.fill();

  // Right: large ring difference
  ctx.strokeStyle = '#5856D6';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(rightX, cy, r + 80, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#FF9F0A';
  ctx.beginPath(); ctx.arc(rightX, cy, r, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#86868B';
  ctx.font = '26px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', leftX, cy + r + 50);
  ctx.fillText('B', rightX, cy + r + 50);
}

function drawDelboeufReveal(ctx, w, h) {
  drawDelboeuf(ctx, w, h);
  const cx = w / 2, cy = h / 2, r = 36;
  const leftX = cx - 130, rightX = cx + 130;
  ctx.strokeStyle = '#34C759';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  ctx.beginPath(); ctx.arc(leftX, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(rightX, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#34C759';
  ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('两实心圆等大 ✓', cx, cy - 130);
}

function drawZollner(ctx, w, h) {
  const cx = w / 2, cy = h / 2;
  const numLines = 4, spacing = 90, lineLen = w * 0.75;
  const startX = cx - lineLen / 2;
  ctx.lineWidth = 2.5;

  for (let i = 0; i < numLines; i++) {
    const y = cy - (numLines - 1) * spacing / 2 + i * spacing;
    ctx.strokeStyle = '#1D1D1F';
    ctx.beginPath(); ctx.moveTo(startX, y); ctx.lineTo(startX + lineLen, y); ctx.stroke();
    // Short crossing lines, alternating angle per row
    const angle = (i % 2 === 0) ? Math.PI / 4 : -Math.PI / 4;
    const crossLen = 28, crossSpacing = 48;
    ctx.strokeStyle = '#5856D6';
    ctx.lineWidth = 2;
    for (let x = startX + 20; x < startX + lineLen - 10; x += crossSpacing) {
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(angle) * crossLen, y - Math.sin(angle) * crossLen);
      ctx.lineTo(x + Math.cos(angle) * crossLen, y + Math.sin(angle) * crossLen);
      ctx.stroke();
    }
    ctx.lineWidth = 2.5;
  }
}

function drawZollnerReveal(ctx, w, h) {
  drawZollner(ctx, w, h);
  const cx = w / 2, cy = h / 2;
  ctx.strokeStyle = '#34C759';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.moveTo(cx - w * 0.35, cy - 150); ctx.lineTo(cx - w * 0.35, cy + 150); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + w * 0.35, cy - 150); ctx.lineTo(cx + w * 0.35, cy + 150); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#34C759';
  ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('长线完全平行 ✓', cx, cy + 180);
}

function drawHering(ctx, w, h) {
  const cx = w / 2, cy = h / 2;
  // Radiating lines
  ctx.strokeStyle = '#C7C7CC';
  ctx.lineWidth = 1;
  const numRays = 24, rayLen = Math.max(w, h) * 0.7;
  for (let i = 0; i < numRays; i++) {
    const a = (i / numRays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * rayLen, cy + Math.sin(a) * rayLen);
    ctx.stroke();
  }
  // Two vertical lines that appear to bow outward
  const lx = cx - 80, rx = cx + 80;
  ctx.strokeStyle = '#5856D6';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(lx, cy - 180); ctx.lineTo(lx, cy + 180); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(rx, cy - 180); ctx.lineTo(rx, cy + 180); ctx.stroke();
}

function drawHeringReveal(ctx, w, h) {
  drawHering(ctx, w, h);
  const cx = w / 2, cy = h / 2;
  ctx.strokeStyle = '#34C759';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.moveTo(cx - 80, cy - 190); ctx.lineTo(cx - 80, cy + 190); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 80, cy - 190); ctx.lineTo(cx + 80, cy + 190); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#34C759';
  ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('竖线是完全直线 ✓', cx, cy - 200);
}

function drawFick(ctx, w, h) {
  const cx = w / 2, cy = h / 2;
  const area = 160 * 90;
  // Vertical rectangle (tall, narrow - appears larger)
  const vw = 70, vh = Math.round(area / vw);
  // Horizontal rectangle (wide, short - appears smaller)
  const hw = Math.round(area / 60), hh = 60;

  const gap = 80;
  ctx.fillStyle = '#5856D6';
  ctx.beginPath();
  ctx.roundRect(cx - gap - vw, cy - vh / 2, vw, vh, 8);
  ctx.fill();

  ctx.fillStyle = '#AF52DE';
  ctx.beginPath();
  ctx.roundRect(cx + gap, cy - hh / 2, hw, hh, 8);
  ctx.fill();

  ctx.fillStyle = '#86868B';
  ctx.font = '26px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', cx - gap - vw / 2, cy + vh / 2 + 44);
  ctx.fillText('B', cx + gap + hw / 2, cy + hh / 2 + 44);
}

function drawFickReveal(ctx, w, h) {
  drawFick(ctx, w, h);
  const cx = w / 2, cy = h / 2;
  ctx.fillStyle = '#34C759';
  ctx.font = 'bold 22px -apple-system, PingFang SC, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('两矩形面积相等 ✓', cx, cy - 120);
}

// ---------- Illusion Data ----------
const ILLUSIONS = [
  {
    name: '缪勒-莱尔错觉',
    question: '哪条线更长？',
    options: ['A线更长', 'B线更长', '一样长'],
    correctIndex: 2,
    explanation: '缪勒-莱尔错觉：两条线实际等长！箭头方向不同让大脑误判线段的起止点，从而产生长度差异的错觉。',
    draw: drawMullerLyer,
    drawReveal: drawMullerLyerReveal
  },
  {
    name: '艾宾浩斯错觉',
    question: '哪个橙色圆更大？',
    options: ['A更大', 'B更大', '一样大'],
    correctIndex: 2,
    explanation: '艾宾浩斯错觉：两个橙色圆实际等大！大圆环绕使中心圆看起来更小，小圆环绕使中心圆看起来更大。',
    draw: drawEbbinghaus,
    drawReveal: drawEbbinghausReveal
  },
  {
    name: '竖横错觉',
    question: '竖线和横线哪个更长？',
    options: ['竖线更长', '横线更长', '一样长'],
    correctIndex: 2,
    explanation: '竖横错觉：两条线实际等长！大脑对垂直方向的距离估计偏大，使竖线看起来比横线更长。',
    draw: drawVerticalHorizontal,
    drawReveal: drawVerticalHorizontalReveal
  },
  {
    name: '贾斯特罗错觉',
    question: '哪个弧形更大？',
    options: ['上面的更大', '下面的更大', '一样大'],
    correctIndex: 2,
    explanation: '贾斯特罗错觉：两个弧形完全相同！将弧形并排放置时，外缘较长的一侧与内缘较短的一侧相邻，造成大小差异的错觉。',
    draw: drawJastrow,
    drawReveal: drawJastrowReveal
  },
  {
    name: '波根多夫错觉',
    question: '左边的斜线连到了A还是B？',
    options: ['连到A', '连到B'],
    correctIndex: 0,
    explanation: '波根多夫错觉：正确答案是A！矩形遮挡使大脑对对角线的位置判断产生偏差，真正的延伸看起来反而不对。',
    draw: drawPoggendorff,
    drawReveal: drawPoggendorffReveal
  },
  {
    name: '桑德错觉',
    question: '哪条对角线更长？',
    options: ['A更长', 'B更长', '一样长'],
    correctIndex: 2,
    explanation: '桑德错觉：两条对角线实际等长！平行四边形的大小差异让大脑误判了对角线的长度。',
    draw: drawSander,
    drawReveal: drawSanderReveal
  },
  {
    name: '德勃夫错觉',
    question: '哪个实心圆更大？',
    options: ['A更大', 'B更大', '一样大'],
    correctIndex: 2,
    explanation: '德勃夫错觉：两个实心圆实际等大！外圈大小影响对内圆的感知——大外圈让内圆看起来更小，小外圈让内圆看起来更大。',
    draw: drawDelboeuf,
    drawReveal: drawDelboeufReveal
  },
  {
    name: '佐尔纳错觉',
    question: '这些长线是平行的吗？',
    options: ['不平行，是斜的', '是平行的'],
    correctIndex: 1,
    explanation: '佐尔纳错觉：这些长线完全平行！短斜线使视觉系统误判长线的方向，产生不平行的强烈错觉。',
    draw: drawZollner,
    drawReveal: drawZollnerReveal
  },
  {
    name: '赫林错觉',
    question: '两条竖线是直线还是弯曲的？',
    options: ['是弯曲的', '是直线'],
    correctIndex: 1,
    explanation: '赫林错觉：两条竖线完全笔直！放射状背景线误导大脑，使直线看起来像是向外弯曲的弓形。',
    draw: drawHering,
    drawReveal: drawHeringReveal
  },
  {
    name: '菲克错觉',
    question: '哪个矩形面积更大？',
    options: ['A更大', 'B更大', '一样大'],
    correctIndex: 2,
    explanation: '菲克错觉：两个矩形面积相等！竖向矩形视觉上显得更大，这与竖横错觉的原理类似——大脑高估垂直方向的尺寸。',
    draw: drawFick,
    drawReveal: drawFickReveal
  }
];

// ---------- Page ----------
Page({
  data: {
    phase: 'intro',         // intro | playing | reveal | result
    currentIndex: 0,
    currentIllusion: null,
    progressPct: 0,
    fooledCount: 0,
    selectedOption: -1,
    answerResult: '',       // correct | wrong
    bestScore: -1,
    answerLog: [],
    resultRating: '',
    resultEmoji: ''
  },

  _canvas: null,
  _ctx: null,
  _dpr: 1,
  _canvasW: 0,
  _canvasH: 0,

  onLoad() {
    const best = wx.getStorageSync('illusion_best');
    if (best !== '' && best !== undefined) {
      this.setData({ bestScore: best });
    }
  },

  onShareAppMessage() {
    const { fooledCount } = this.data;
    return {
      title: `我被错觉骗了 ${fooledCount}/10 次，来挑战错觉实验室！`,
      path: '/pages/illusion/illusion'
    };
  },

  startGame() {
    this.setData({
      phase: 'playing',
      currentIndex: 0,
      fooledCount: 0,
      selectedOption: -1,
      answerResult: '',
      answerLog: [],
      currentIllusion: ILLUSIONS[0],
      progressPct: 10
    }, () => {
      this._initCanvas(() => {
        this._drawCurrentIllusion(false);
      });
    });
  },

  _initCanvas(cb) {
    const query = wx.createSelectorQuery();
    query.select('#illusion-canvas').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        setTimeout(() => this._initCanvas(cb), 100);
        return;
      }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getWindowInfo().pixelRatio || 2;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      this._canvas = canvas;
      this._ctx = ctx;
      this._dpr = dpr;
      this._canvasW = res[0].width;
      this._canvasH = res[0].height;
      if (cb) cb();
    });
  },

  _clearCanvas() {
    const { _ctx: ctx, _canvasW: w, _canvasH: h } = this;
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
  },

  _drawCurrentIllusion(reveal) {
    const { _ctx: ctx, _canvasW: w, _canvasH: h } = this;
    if (!ctx) return;
    this._clearCanvas();
    const illusion = ILLUSIONS[this.data.currentIndex];
    if (reveal) {
      illusion.drawReveal(ctx, w, h);
    } else {
      illusion.draw(ctx, w, h);
    }
  },

  answer(e) {
    if (this.data.phase !== 'playing') return;
    const index = e.currentTarget.dataset.index;
    const illusion = ILLUSIONS[this.data.currentIndex];
    const correct = index === illusion.correctIndex;
    const fooled = !correct;

    const newLog = this.data.answerLog.concat([{
      name: illusion.name,
      fooled: fooled
    }]);

    this.setData({
      phase: 'reveal',
      selectedOption: index,
      answerResult: correct ? 'correct' : 'wrong',
      fooledCount: this.data.fooledCount + (fooled ? 1 : 0),
      answerLog: newLog
    });

    this._drawCurrentIllusion(true);
  },

  nextQuestion() {
    const next = this.data.currentIndex + 1;
    if (next >= ILLUSIONS.length) {
      this._showResult();
      return;
    }
    this.setData({
      currentIndex: next,
      currentIllusion: ILLUSIONS[next],
      phase: 'playing',
      selectedOption: -1,
      answerResult: '',
      progressPct: Math.round((next + 1) / ILLUSIONS.length * 100)
    }, () => {
      this._drawCurrentIllusion(false);
    });
  },

  _showResult() {
    const score = this.data.fooledCount;
    let rating, emoji;
    if (score <= 2) {
      rating = '火眼金睛！你的视觉系统非常精准！'; emoji = '🦅';
    } else if (score <= 5) {
      rating = '观察力不错，只被骗了一半！'; emoji = '🧐';
    } else if (score <= 8) {
      rating = '视觉很容易被欺骗，你的大脑喜欢走捷径～'; emoji = '😵';
    } else {
      rating = '你的大脑完全被骗了！不过这很正常～'; emoji = '🤯';
    }

    const best = this.data.bestScore;
    if (best < 0 || score > best) {
      wx.setStorageSync('illusion_best', score);
    }

    this.setData({ phase: 'result', resultRating: rating, resultEmoji: emoji });
  },

  retryGame() {
    this.setData({
      phase: 'intro',
      currentIndex: 0,
      fooledCount: 0,
      selectedOption: -1,
      answerResult: '',
      answerLog: [],
      bestScore: wx.getStorageSync('illusion_best') || 0
    });
  },

  shareResult() {
    wx.showShareMenu({ withShareTicket: false });
  }
});

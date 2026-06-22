// =============================================================================
// OPTION C — Bold Icon Style (flat fills, 2px outlines, instant readability)
// Drop-in replacement for draw() methods in game.js
// Usage: copy relevant draw() method into the respective class
// =============================================================================

// Helper
function _circ(ctx, x, y, r, fill, stroke, lw) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill)   { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 2; ctx.stroke(); }
}

// ---- DUCK (Player) ----
// Replace Player.draw() internals — call after shield ring, before _drawAccessories
function drawDuck_C(ctx, facing, time, squished, moving) {
  ctx.save();
  if (squished) ctx.scale(1.0, 0.72);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // Body
  ctx.fillStyle = '#FFE44D'; ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, 8, 14, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Head
  _circ(ctx, 4, -8, 12, '#FFE44D', '#1A1A1A', 2);
  // Bill
  ctx.fillStyle = '#FF8C00'; ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(14, -9); ctx.lineTo(23, -7); ctx.lineTo(14, -5); ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Eye
  _circ(ctx, 8, -11, 4, '#FFFFFF', '#1A1A1A', 1.5);
  const px = 8 + Math.cos(facing) * 1.5, py = -11 + Math.sin(facing) * 1.5;
  _circ(ctx, px, py, 2.2, '#1A1A1A', null);
  // Wing hint
  ctx.strokeStyle = '#C8860A'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(-2, 8, 7, Math.PI * 0.9, Math.PI * 1.9); ctx.stroke();
  ctx.restore();
}

// ---- SPIDER → Opa mit Rollator ----
// Replace Spider.draw() body
/*
  draw(ctx) {
    ctx.save(); ctx.translate(this.x, this.y);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // Walker
    const wW = 18, wTop = 6, wBottom = 22;
    ctx.strokeStyle = '#909090'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-wW, wTop); ctx.lineTo(-wW, wBottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(wW, wTop); ctx.lineTo(wW, wBottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-wW, wTop); ctx.lineTo(wW, wTop); ctx.stroke();
    _circ(ctx, -wW, wBottom, 2.5, '#555', null);
    _circ(ctx,  wW, wBottom, 2.5, '#555', null);
    ctx.strokeStyle = '#777'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-wW-2, wTop); ctx.lineTo(-wW+2, wTop); ctx.stroke();
    ctx.beginPath(); ctx.moveTo( wW-2, wTop); ctx.lineTo( wW+2, wTop); ctx.stroke();
    ctx.lineCap = 'butt';
    // Body
    ctx.fillStyle = '#8B7355'; ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, 10, 10, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Head
    _circ(ctx, 0, -4, 10, '#F5CBA7', '#1A1A1A', 2);
    // Hair
    ctx.strokeStyle = '#E8E8E8'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.arc(i * 4, -13, 4, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    }
    ctx.lineCap = 'butt';
    // Glasses
    ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(-4.5, -4, 4, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(4.5, -4, 4, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-0.5, -4); ctx.lineTo(0.5, -4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-8.5, -4); ctx.lineTo(-11, -4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo( 8.5, -4); ctx.lineTo( 11, -4); ctx.stroke();
    _circ(ctx, -4.5, -4, 1.5, '#1A1A1A', null);
    _circ(ctx,  4.5, -4, 1.5, '#1A1A1A', null);
    ctx.restore();
  }
*/

// ---- SNAKE → Oma auf Scooter ----
// Replace Snake.draw() body
/*
  draw(ctx) {
    ctx.save(); ctx.translate(this.x, this.y);
    ctx.rotate(this.baseAngle);
    ctx.rotate(Math.sin(this.sinePhase) * 0.2);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    // Scooter body
    ctx.fillStyle = '#F48FB1'; ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(-14, 2, 28, 14, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#E57399';
    ctx.beginPath(); ctx.roundRect(-12, 13, 24, 4, 2); ctx.fill();
    _circ(ctx,  11, 19, 5, '#37474F', '#1A1A1A', 2);
    _circ(ctx,  11, 19, 2, '#90A4AE', null);
    _circ(ctx, -11, 19, 5, '#37474F', '#1A1A1A', 2);
    _circ(ctx, -11, 19, 2, '#90A4AE', null);
    // Handlebar
    ctx.strokeStyle = '#9E9E9E'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(10, 2); ctx.lineTo(10, -4); ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(6, -4); ctx.lineTo(14, -4); ctx.stroke();
    ctx.lineCap = 'butt';
    // Grandma body
    ctx.fillStyle = '#7B1FA2'; ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(-2, -3, 7, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Head
    _circ(ctx, -2, -13, 5.5, '#FDDBB4', '#1A1A1A', 1.5);
    _circ(ctx, -4, -19, 4.5, '#F5F5F5', '#BDBDBD', 1.2);
    // Glasses
    ctx.strokeStyle = '#FFC107'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(-4, -13, 2, Math.PI * 0.8, Math.PI * 2.2); ctx.stroke();
    ctx.beginPath(); ctx.arc( 0, -13, 2, Math.PI * 0.8, Math.PI * 2.2); ctx.stroke();
    // Arm
    ctx.strokeStyle = '#FDDBB4'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(4, -5); ctx.quadraticCurveTo(8, -5, 10, -4); ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.restore();
  }
*/

// ---- OCTOPUS → Grummeliger Opa ----
// Replace Octopus.draw() body
/*
  draw(ctx) {
    ctx.save(); ctx.translate(this.x, this.y);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const armAmp = this.charging ? 1.4 : 1.0;
    ctx.strokeStyle = '#D4956A'; ctx.lineWidth = 5;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const w = Math.sin(this.tentaclePhase + i * 1.05) * 8 * armAmp;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.quadraticCurveTo(Math.cos(a+0.5)*14+w, Math.sin(a+0.5)*14, Math.cos(a)*22, Math.sin(a)*22);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
    // Vest
    ctx.fillStyle = '#6D4C41'; ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, 9, 11, 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#4E342E';
    ctx.beginPath(); ctx.moveTo(-3,1); ctx.lineTo(-9,6); ctx.lineTo(0,8); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(3,1);  ctx.lineTo(9,6);  ctx.lineTo(0,8); ctx.closePath(); ctx.fill();
    // Head
    const faceColor = this.charging ? '#E53935' : '#E57373';
    _circ(ctx, 0, -6, 12, faceColor, '#1A1A1A', 2);
    // Eyebrows
    ctx.strokeStyle = this.charging ? '#B71C1C' : '#4E342E';
    ctx.lineWidth = this.charging ? 4 : 3.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-9, -11); ctx.lineTo(-2, -9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(9, -11);  ctx.lineTo(2, -9);  ctx.stroke();
    ctx.lineCap = 'butt';
    // Eyes
    _circ(ctx, -4, -6, 2.2, '#1A1A1A', null);
    _circ(ctx,  4, -6, 2.2, '#1A1A1A', null);
    // Frown
    ctx.strokeStyle = '#4E342E'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -1, 4, 0.15, Math.PI - 0.15, false); ctx.stroke();
    // Hair wisps
    ctx.strokeStyle = '#F5F5F5'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(-5, -16, 4, Math.PI*1.0, Math.PI*1.7); ctx.stroke();
    ctx.beginPath(); ctx.arc( 5, -16, 4, Math.PI*1.3, Math.PI*2.0); ctx.stroke();
    ctx.lineCap = 'butt';
    if (this.charging) {
      ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = '#FF6B35'; ctx.lineWidth = 3;
      ctx.shadowColor = '#FF4500'; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }
*/

// ---- GHOST → Schlafwandel-Oma ----
// Replace Ghost.draw() body
/*
  draw(ctx) {
    ctx.save(); ctx.translate(this.x, this.y);
    const pulse = 0.5 + 0.5 * Math.sin(this.floatPhase * 2);
    const bob = Math.sin(this.floatPhase) * 5;
    ctx.translate(0, bob);
    ctx.save(); ctx.globalAlpha = 0.18 + pulse * 0.15;
    ctx.shadowColor = '#B3E5FC'; ctx.shadowBlur = 18 + pulse * 12;
    ctx.fillStyle = '#B3E5FC'; ctx.beginPath(); ctx.arc(0, -5, 17, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.restore();
    ctx.globalAlpha = 0.88;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    // Body
    ctx.fillStyle = '#F5F5FF'; ctx.strokeStyle = '#C0C8E8'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -4, 13, Math.PI, 0);
    ctx.lineTo(13, 16);
    ctx.quadraticCurveTo( 9, 22,  5, 16);
    ctx.quadraticCurveTo( 1, 22, -4, 16);
    ctx.quadraticCurveTo(-8, 22,-13, 16);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // Fold lines
    ctx.strokeStyle = '#A8B8D8'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-5, 2); ctx.quadraticCurveTo(-7, 10, -5, 16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo( 5, 2); ctx.quadraticCurveTo( 7, 10,  5, 16); ctx.stroke();
    // Eyes
    ctx.fillStyle = '#1A1A2E';
    ctx.beginPath(); ctx.ellipse(-4.5, -5, 2.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse( 4.5, -5, 2.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    // Mouth
    ctx.beginPath(); ctx.ellipse(0, 2, 1.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
    // Curlers
    const curlerXs = [-9, -3, 3, 9]; ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1.2;
    for (const cx of curlerXs) {
      ctx.fillStyle = '#FF9FC0'; ctx.beginPath(); ctx.arc(cx, -16, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    // Arms
    ctx.strokeStyle = '#F5F5FF'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(-20, -6, -24, -2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, 0);  ctx.quadraticCurveTo(20, -6, 24, -2);   ctx.stroke();
    ctx.globalAlpha = 1; ctx.restore();
  }
*/

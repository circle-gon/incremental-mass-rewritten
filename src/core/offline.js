import { computed, reactive } from "vue";
import { tick } from "../main";
import { TICKS } from "./utils";
import { player } from "./save";
import Decimal from "break_eternity.js";
import { format, formatInteger } from "./format";

const ACTIVE_TIME = 60; // 60ms

export const offlineProgress = reactive({
  active: false,
  ticks: 0,
  ranTicks: 0,
  speed: 0,
  time: 0,
  graph: [],
  canvas: null
});

const plotting = computed(() => plotData(offlineProgress.graph))

function update() {
  if (offlineProgress.canvas) drawGraph()
  if (offlineProgress.ranTicks === offlineProgress.ticks) {
    offlineProgress.canvas = null
    offlineProgress.graph = []
    return
  }

  setTimeout(update, ACTIVE_TIME)
}

export async function runOfflineProgress(time) {
  offlineProgress.active = true;
  offlineProgress.ranTicks = 0;
  offlineProgress.speed = 0;
  offlineProgress.time = time;
  offlineProgress.graph.push([0, player.mass])

  // Run the game 1000x faster than normal by default
  const ticks = Math.min(1e4, Math.ceil((time * TICKS) / 1000));
  offlineProgress.ticks = ticks;

  // Draw asynchronously to not block offline progress loop
  update()

  while (true) {
    let exit = false
    const now = Date.now();

    while (Date.now() - now < ACTIVE_TIME) {
      const toUse = Math.min(
        ticks - offlineProgress.ranTicks,
        Math.pow(2, offlineProgress.speed)
      );
      offlineProgress.ranTicks += toUse;

      tick((time / ticks) * toUse)
      if (offlineProgress.ranTicks === ticks) {
        exit = true
        break;
      }
    }

    offlineProgress.graph.push([offlineProgress.ranTicks, player.mass])
    if (exit) break

    // Let the browser handle the UI
    await new Promise((r) => setTimeout(r));
  }
}

// Code shamelessly copied from MrRedShark77's Shark Incremental
function tooSlow(min, max, oom) {
  const atLeast = Decimal.tetrate(10, oom - 1)
  const top = atLeast.max(max).iteratedlog(10, oom)
  const bottom = atLeast.max(min).iteratedlog(10, oom)
  return top.sub(bottom).lt(10)
}

function createAxis(min, max, log10) {
  const pow10 = log10.pow10()

  let floor, ceil, grid

  // Confusing!
  if (min.eq(max)) {
    floor = min.floor()
    ceil = max.ceil()
    grid = [floor]
  } else {
    const jump = log10.eq(0) ? Decimal.dOne : max.div(pow10).ceil().sub(min.div(pow10).floor()).mul(pow10).div(10)
    floor = min.div(jump).floor().mul(jump)
    ceil = max.div(jump).ceil().mul(jump)
    grid = Array(Math.round(ceil.sub(floor).div(jump).toNumber() + 1))
      .fill()
      .map((_, i) => jump.mul(i).add(floor))
    grid[0] = min
    grid[grid.length - 1] = max
  }

  return {
    min,
    max,
    dist: max.sub(min).max(0.001),
    grid,
    // Also confusing!
    times: floor.eq(ceil) ? [0.5] : grid.map(i => i.sub(min).div(max.sub(min)).toNumber())
  }
}

function plotData(plots) {
  // Confusing!
  if (plots.length === 0) plots = [[0, 0]]

  let xMin = Decimal.dInf, xMax = new Decimal(offlineProgress.ticks), yMin = Decimal.dInf, yMax = Decimal.dNegInf

  for (const plot of plots) {
    xMin = xMin.min(plot[0])
    xMax = xMax.max(plot[0])
    yMin = yMin.min(plot[1])
    yMax = yMax.max(plot[1])
  }

  let xOom = xMax.max(10).slog(10).sub(1).floor().toNumber()
  let yOom = yMax.max(10).slog(10).sub(1).floor().toNumber()

  if (xOom > 0 && tooSlow(xMin, xMax, xOom)) xOom--
  if (yOom > 0 && tooSlow(yMin, yMax, yOom)) yOom--

  const xAtLeast = Decimal.tetrate(10, xOom - 1)
  const yAtLeast = Decimal.tetrate(10, yOom - 1)

  const xMinLog = xMin.max(xAtLeast).iteratedlog(10, xOom)
  const xMaxLog = xMax.iteratedlog(10, xOom)
  const yMinLog = yMin.max(yAtLeast).iteratedlog(10, yOom)
  const yMaxLog = yMax.iteratedlog(10, yOom)

  const xGraphLog10 = xMaxLog.sub(xMinLog).log10().floor()
  const yGraphLog10 = yMaxLog.sub(yMinLog).log10().floor()

  const xAxis = createAxis(xMinLog, xMaxLog, xGraphLog10)
  const yAxis = createAxis(yMinLog, yMaxLog, yGraphLog10)
  return {
    xOom,
    yOom,
    xAxis,
    yAxis,
    // Also confusing!
    times: plots.length === 1 ? [[0.5, 0.5]] : plots.map(p => [
      xAtLeast.max(p[0]).iteratedlog(10, xOom).sub(xAxis.min).div(xAxis.dist).toNumber(),
      p[1].max(yAtLeast).iteratedlog(10, yOom).sub(yAxis.min).div(yAxis.dist).toNumber()
    ])
  }
}

function drawRotated(ctx, text, x, y, deg) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(Math.PI / 180 * deg)
  ctx.translate(-x, -y)
  ctx.fillText(text, x, y)
  ctx.restore()
}

function drawGraph() {
  // Why these constants? I don't know!
  const xt = 520, yt = 380

  const ctx = offlineProgress.canvas
  const plot = plotting.value

  ctx.clearRect(0, 0, 800, 600)

  // Layer #1: Draw X-axis & Y-axis lines & levels
  ctx.lineWidth = 4; 
  ctx.strokeStyle = '#333';
  ctx.fillStyle = '#fff'; 
  ctx.textAlign = "right"; 
  ctx.textBaseline = 'middle'; 
  ctx.font = "14px Courier";

  const text = (
    plot.xOom > 0 ? 
      `OoMs${plot.xOom > 1 ? "^" + formatInteger(plot.xOom) : ""} of ` : ""
  ) + "Ticks"
  const text2 = (
    plot.yOom > 0 ? `OoMs${plot.yOom > 1 ? "^" + formatInteger(plot.yOom) : ""} of ` : ""
  ) + "Mass"

  for (const [idx, point] of plot.yAxis.times.entries()) {
    const t = 400 - yt * point

    ctx.beginPath()
    ctx.moveTo(200, t)
    ctx.lineTo(790, t)
    ctx.stroke()

    ctx.fillText(format(plot.yAxis.grid[idx], 1, 12), 200, t);
  }

  ctx.fillText(text, 187, 450);

  for (const [idx, point] of plot.xAxis.times.entries()) {
    const t = 260 + xt * point

    ctx.beginPath()
    ctx.moveTo(t, 10)
    ctx.lineTo(t, 460)
    ctx.stroke()

    drawRotated(ctx, formatInteger(plot.xAxis.grid[idx]), t, 460, -45)
  }

  ctx.fillText(text2, 214, 478);

  // Layer #2: Draw Graph
  ctx.strokeStyle = ctx.fillStyle = "orange";
  ctx.beginPath()

  if (plot.times.length > 1) {
    for (const [idx, point] of plot.times.entries()) {
      if (idx === 0) ctx.moveTo(260 + xt * point[0], 400 - yt * point[1])
      else ctx.lineTo(260 + xt * point[0], 400 - yt * point[1])
    }
    ctx.stroke()
  } else {
    const point = plot.times[0]
    ctx.arc(260 + xt * point[0], 400 - yt * point[1], 5, 0, 2 * Math.PI)
    ctx.fill()
  }

  // Layer #3: Draw Ox, Oy
  ctx.strokeStyle = '#fff'

  ctx.beginPath()
  ctx.moveTo(190, 450)
  ctx.lineTo(790, 450)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(210, 10)
  ctx.lineTo(210, 470)
  ctx.stroke()
}
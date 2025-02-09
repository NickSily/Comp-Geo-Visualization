"use strict";
import axios from "https://esm.sh/axios";

/** @type HTMLCanvasElement */
const myCanvas = document.getElementById("myCanvas");

// Setup Canvas
const width = window.innerWidth;
myCanvas.width = width;
const height = window.innerHeight;
myCanvas.height = height;

/** @type {CanvasRenderingContext2D} */
const ctx = myCanvas.getContext("2d");

function get2dPoints(n) {
  let result = [];

  const x0 = myCanvas.width / 4;
  const xSpan = x0 * 2;
  const y0 = myCanvas.height / 4;
  const ySpan = y0 * 2;

  for (let i = 0; i < n; i++) {
    let x = x0 + Math.floor(Math.random() * xSpan);
    let y = y0 + Math.floor(Math.random() * ySpan);

    result.push([x, y]);
  }

  return result;
}

function draw(points, lines) {
  clear();
  drawPoints(points);
  drawLines(lines);
}

function clear() {
  // clears the canvas
  ctx.clearRect(0, 0, width, height);
}

function hashPoints(p1, p2) {
  // Simple hash function combining the four integer values
  const hash = (p1[0] * 31 + p1[1]) * 31 + p2[0] * 31 + p2[1];
  return hash;
}

function addLine(lines, p1, p2) {
  lines.set(hashPoints(p1,p2), [p1, p2]);
}

function removeLine(lines, p1, p2) {
  lines.delete(hashPoints(p1,p2));
}

function drawPoints(points) {
  for (let i = 0; i < points.length; i++) {
    // Draw Point (white)
    drawPoint(points[i], "white", "4");
  }
}

function drawPoint(point, color = "white", radius = "5") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
  ctx.fill();
}

function clearPoint(point, color = "black", radius = "5") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
  ctx.fill();
}

function drawLines(lines) {
  for (let line of lines.values()) {
    drawLine(line);
  }
}

function drawLine(line, color = "blue", width = "4") {
  ctx.beginPath();
  ctx.moveTo(line[0][0], line[0][1]);
  ctx.lineTo(line[1][0], line[1][1]);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function convexHull(points, algorithm = jarvisMarch) {
  if (!Array.isArray(points)) {
    throw new Error("Expected an array of points as input!");
  }

  algorithm(points);
}

function jarvisMarch(points) {}

//p1 is starting, p2 is what you're checking
function getAngle(p1, p2) {
  // return c.c.w. angle from horizontal to p1-p2 segment

  const dx = p2[0] - p1[0];
  const dy = -(p2[1] - p1[1]);
  // Flipping dy since y axis if flipped on display

  if (dx == 0) {
    if (dy > 0) {
      return Math.PI / 2;
    }
    return (3 * Math.PI) / 2;
  }

  if (dx > 0) {
    if (dy > 0) {
      // Q1
      return Math.atan(dy / dx);
    }
    // Q4
    if (dy < 0) return Math.atan(dy / dx) + Math.PI * 2;
    // dy = 0
    return 0;
  }

  if (dx < 0) {
    // Q2 or Q3
    return Math.atan(dy / dx) + Math.PI;
  }
}

function compareAngle(refPoint) {
  // Return comparator function
  return (a, b) => {
    // Return difference of angles with reference Point
    return getAngle(refPoint, a) - getAngle(refPoint, b);
  };
}

function grahamScan(points) {
  // Get bottom point (max Y coordinate)
  // O(N)
  let bottomIdx = 0;
  for (let i = 0; i < points.length; i++) {
    if (points[i][1] > points[bottomIdx][1]) {
      bottomIdx = i;
    }
  }

  const bottomPoint = points[bottomIdx];

  // Mark the point
  drawPoint(bottomPoint, "red");

  // Remove point from original array O(N)
  points.splice(bottomIdx, 1);

  // Sort points based on angle
  points.sort(compareAngle(bottomPoint));

  // paint & Connect each point
  for (let i = 0; i < points.length; i++) {
    setTimeout(() => {
      console.log(i, ": Angle = ", getAngle(bottomPoint, points[i]));
      drawPoint(points[i], "white");
    }, (2 + i) * 2000);
  }
}
function chenAlgorithm(points) {}

async function drawAndErase(points, lines){
      // draw Lines
  for (let i = 0; i < points.length - 1; i++) {
    addLine(lines, points[i], points[i + 1]);

    await new Promise((resolve) => setTimeout(resolve, 100));
    draw(points, lines);
  }

  // Erase Lines
  for (let i = 0; i < points.length - 1; i++) {
    removeLine(lines, points[i], points[i + 1]);

    await new Promise((resolve) => setTimeout(resolve, 100));
    draw(points, lines);
  }
}

async function run() {
  // Testing Drawing
  const points = get2dPoints(50);

  const lines = new Map();

  drawPoints(points);

//   drawAndErase(points, lines);

    


}

// setTimeout(() => {
//   console.log("okay let's begin");
//   run();
// }, 1000);

run();

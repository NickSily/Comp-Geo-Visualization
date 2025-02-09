"use strict";
import axios from "https://esm.sh/axios";

/** @type HTMLCanvasElement */
const myCanvas = document.getElementById("myCanvas");

// Setup Canvas
myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;

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

function drawLine(p1, p2, color = "red", width = "4") {
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function clearLine(p1, p2, color = "black", width = "5") {
  ctx.globalCompositeOperation = "destination-out"; // Set mode to erase
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.lineWidth = width; // Slightly larger to fully erase the previous line
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over"; // Restore default mode
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
  drawPoint(bottomPoint, "white");

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

async function drawLines(numbers) {
  for (let i = 0; i < numbers.length - 1; i++) {
    await new Promise((resolve) => {
      setTimeout(() => {
        const p1 = numbers[i];
        const p2 = numbers[i + 1];
        drawLine(p1, p2, "white", "2");
        resolve();
      }, 250);
    });
  }
}

async function clearLines(numbers) {
  for (let i = 0; i < numbers.length - 1; i++) {
    await new Promise((resolve) => {
      setTimeout(() => {
        const p1 = numbers[i];
        const p2 = numbers[i + 1];
        clearLine(p1, p2);
        resolve();
      }, 500);
    });
  }
}

async function run() {
  // Testing Drawing
  const numbers = get2dPoints(50);

  drawPoints(numbers);

  // Connect Points
  await drawLines(numbers);

  await clearLines(numbers);
}

setTimeout(() => {
  console.log("okay let's begin");
  run();
}, 1000);

run();

/**
 * Created by Rammer on 21/10/2017.
 */
"use strict";

const PREVIEW_WIDTH = '15px';

let frame = document.createElement('canvas');
frame.style.width = PREVIEW_WIDTH;
frame.style.height = '100%';
frame.style.display = 'block';
frame.style.position = 'fixed';
frame.zIndex = 1000;
frame.style.top = 0;
frame.style.bottom = 0;
frame.style.right = 0;
document.body.appendChild(frame);

let frameContext = frame.getContext('2d');

let updateFrame = () => {
  let clientHeight = document.documentElement.clientHeight;
  let pageHeight = document.documentElement.getBoundingClientRect().height;
  let heightRatio = clientHeight / pageHeight;

  let frameTop = ((window.scrollY * heightRatio) + 0.5) | 0;
  let frameHeight = ((clientHeight * heightRatio) + 0.5) | 0;

  frame.height = clientHeight;
  frameContext.strokeStyle = '#0ff';
  frameContext.strokeRect(1, frameTop, frame.width - 2, frameHeight);
};

let doUpdate = () => {
  updateRequested = false;
  updateFrame();
  // TODO: 21/10/2017 update stripe
};

let updateRequested = false;
let requestUpdate = () => {
  if (!updateRequested) {
    updateRequested = true;
    requestAnimationFrame(doUpdate);
  }
};

window.addEventListener('scroll', requestUpdate);
window.addEventListener('resize', requestUpdate);

let clientHeight = document.documentElement.clientHeight;
let pageHeight = document.documentElement.getBoundingClientRect().height;
let heightRatio = clientHeight / pageHeight;
console.log(clientHeight, pageHeight, heightRatio);

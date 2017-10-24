/**
 * Created by Rammer on 21/10/2017.
 */
"use strict";

const PREVIEW_WIDTH = '15px';

const stripe = document.createElement('canvas');
stripe.style.width = PREVIEW_WIDTH;
stripe.style.height = '100%';
stripe.style.display = 'block';
stripe.style.position = 'fixed';
stripe.style.background = '#fff';
stripe.style.borderLeft = '1px solid #ccc';
stripe.zIndex = 1000;
stripe.style.top = 0;
stripe.style.bottom = 0;
stripe.style.right = 0;
document.body.appendChild(stripe);

const stripeContext = stripe.getContext('2d');

const updateStripe = (handlers) => {
  let clientHeight = document.documentElement.clientHeight;
  let pageHeight = document.documentElement.getBoundingClientRect().height;
  let heightRatio = clientHeight / pageHeight;
  let scrollY = window.scrollY;

  stripe.height = clientHeight;
  for (let { highlightedNodes, color } of handlers) {
    let lastMarkY = 0;
    stripeContext.fillStyle = color;
    highlightedNodes.forEach((n) => {
      let rect = n.getBoundingClientRect();
      let markY = (((scrollY + rect.top) * heightRatio) + 0.5) | 0;
      if (markY && markY !== lastMarkY) {
        lastMarkY = markY;
        stripeContext.fillRect(0, markY, stripe.width, (((rect.height * heightRatio) + 0.5) | 0) || 1);
      }
    });
  }
};

const frame = document.createElement('canvas');
frame.style.width = PREVIEW_WIDTH;
frame.style.height = '100%';
frame.style.display = 'block';
frame.style.position = 'fixed';
frame.zIndex = 1000;
frame.style.top = 0;
frame.style.bottom = 0;
frame.style.right = 0;
document.body.appendChild(frame);

const frameContext = frame.getContext('2d');

let updateFrameRequested = false;
const updateFrame = () => {
  updateFrameRequested = false;

  let clientHeight = document.documentElement.clientHeight;
  let pageHeight = document.documentElement.getBoundingClientRect().height;
  let heightRatio = clientHeight / pageHeight;

  let frameTop = ((window.scrollY * heightRatio) + 0.5) | 0;
  let frameHeight = ((clientHeight * heightRatio) + 0.5) | 0;

  frame.height = clientHeight;
  frameContext.strokeStyle = '#0ff';
  frameContext.strokeRect(1, frameTop, frame.width - 2, frameHeight);
};

const requestUpdateFrame = () => {
  if (!updateFrameRequested) {
    updateFrameRequested = true;
    requestAnimationFrame(updateFrame);
  }
};

window.addEventListener('scroll', requestUpdateFrame);
window.addEventListener('resize', requestUpdateFrame);

export {
  updateStripe
}

/**
 * Created by Rammer on 21/10/2017.
 */
"use strict";

const PREVIEW_WIDTH = '15px';
const FADE_OUT_DELAY = 3000;
const FADE_OUT_STEP = 0.05;
const FADE_OUT_INTERVAL = 1 / FADE_OUT_STEP;

const stripe = document.createElement('canvas');
stripe.style.width = PREVIEW_WIDTH;
stripe.style.height = '100%';
stripe.style.display = 'block';
stripe.style.position = 'fixed';
stripe.style.background = '#fff';
stripe.style.borderLeft = '1px solid #ccc';
stripe.style.zIndex = 10000;
stripe.style.top = 0;
stripe.style.bottom = 0;
stripe.style.right = 0;
stripe.style.opacity = 1.0;
document.body.appendChild(stripe);

const stripeContext = stripe.getContext('2d');

const updateStripe = (hlInfos) => {
  const clientHeight = document.documentElement.clientHeight;
  const pageHeight = document.documentElement.getBoundingClientRect().height;
  const heightRatio = clientHeight / pageHeight;
  const scrollY = window.scrollY;

  stripe.height = clientHeight;
  for (const { color, hlNodes } of hlInfos) {
    let lastMarkY = 0;
    stripeContext.fillStyle = color;
    hlNodes.forEach((n) => {
      const rect = n.getBoundingClientRect();
      const markY = (((scrollY + rect.top) * heightRatio) + 0.5) | 0;
      if (markY && markY !== lastMarkY) {
        lastMarkY = markY;
        stripeContext.fillRect(0, markY, stripe.width, (((rect.height * heightRatio) + 0.5) | 0) || 1);
      }
    });
  }

  fadeOut();
};

const frame = document.createElement('canvas');
frame.style.width = PREVIEW_WIDTH;
frame.style.height = '100%';
frame.style.display = 'block';
frame.style.position = 'fixed';
frame.style.zIndex = 10000;
frame.style.top = 0;
frame.style.bottom = 0;
frame.style.right = 0;
frame.style.opacity = 1.0;
document.body.appendChild(frame);

const frameContext = frame.getContext('2d');

let updateFrameRequested = false;
const updateFrame = () => {
  updateFrameRequested = false;

  const clientHeight = document.documentElement.clientHeight;
  const pageHeight = document.documentElement.getBoundingClientRect().height;
  const heightRatio = clientHeight / pageHeight;

  const frameTop = ((window.scrollY * heightRatio) + 0.5) | 0;
  const frameHeight = ((clientHeight * heightRatio) + 0.5) | 0;

  frame.height = clientHeight;
  frameContext.globalAlpha = 0.75;
  frameContext.fillStyle = '#ccc';
  frameContext.fillRect(1, frameTop, frame.width - 2, frameHeight);

  fadeOut();
};

const requestUpdateFrame = () => {
  if (!updateFrameRequested) {
    updateFrameRequested = true;
    requestAnimationFrame(updateFrame);
  }
};

window.addEventListener('scroll', requestUpdateFrame);
window.addEventListener('resize', requestUpdateFrame);

let fadeOutEvent = null;
let fadeOutAnimation = null;
const fadeOut = () => {
  stripe.style.opacity = 1.0;
  frame.style.opacity = 1.0;

  if (fadeOutEvent) {
    clearTimeout(fadeOutEvent);
    fadeOutEvent = null;
  }
  if (fadeOutAnimation) {
    clearInterval(fadeOutAnimation);
    fadeOutAnimation = null;
  }

  fadeOutEvent = setTimeout(() => {
    fadeOutEvent = null;

    let opacity = stripe.style.opacity;
    fadeOutAnimation = setInterval(() => {
      if (opacity >= FADE_OUT_STEP) {
        opacity -= FADE_OUT_STEP;
        stripe.style.opacity = opacity;
        frame.style.opacity = opacity;
      } else {
        stripe.style.opacity = 0;
        frame.style.opacity = 0;
        clearInterval(fadeOutAnimation);
      }
    }, FADE_OUT_INTERVAL);
  }, FADE_OUT_DELAY);
};

export {
  updateStripe
};

/**
 * Created by Rammer on 21/10/2017.
 */
"use strict";

const PREVIEW_WIDTH = '15px';
const FADE_OUT_DELAY = 3000;
const FADE_OUT_INTERVAL = 20;
const STRIPE_FADE_OUT_STEP = 1 / FADE_OUT_INTERVAL;
const BAR_FADE_OUT_STEP = 0.75 / FADE_OUT_INTERVAL;

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
stripe.style.opacity = 0.0;
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

  fadeOutAction.requestFadeOut();
};

const bar = document.createElement('div');
bar.style.width = PREVIEW_WIDTH;
bar.style.height = 0;
bar.style.display = 'block';
bar.style.position = 'fixed';
bar.style.background = '#ccc';
bar.style.zIndex = 10000;
bar.style.top = 0;
bar.style.bottom = 0;
bar.style.right = 0;
bar.style.opacity = 0.0;
document.body.appendChild(bar);

let updateBarRequested = false;
const updateBar = () => {
  updateBarRequested = false;

  const clientHeight = document.documentElement.clientHeight;
  const pageHeight = document.documentElement.getBoundingClientRect().height;
  const heightRatio = clientHeight / pageHeight;

  bar.style.top = (window.scrollY * heightRatio) + 'px';
  bar.style.height = (clientHeight * heightRatio) + 'px';

  fadeOutAction.requestFadeOut();
};

const requestUpdateBar = () => {
  if (!updateBarRequested) {
    updateBarRequested = true;
    requestAnimationFrame(updateBar);
  }
};

window.addEventListener('scroll', requestUpdateBar);
window.addEventListener('resize', requestUpdateBar);

const fadeOutAction = {
  requestFadeOutRequested: false,
  fadeOutAnimation: 0,
  fadeOutEvent: 0,

  requestFadeOut: function () {
    if (!this.requestFadeOutRequested) {
      this.requestFadeOutRequested = true;

      stripe.style.opacity = 1.0;
      bar.style.opacity = 0.75;

      requestAnimationFrame(this.start.bind(this));
    }
  },

  start: function () {
    this.requestFadeOutRequested = false;
    this.cancel();
    this.fadeOutEvent = setTimeout(this.doFadeOut, FADE_OUT_DELAY);
  },

  doFadeOut: function () {
    this.fadeOutEvent = null;

    let opacity = stripe.style.opacity;
    this.fadeOutAnimation = null;
    this.fadeOutAnimation = setInterval(() => {
      if (opacity >= STRIPE_FADE_OUT_STEP) {
        opacity -= STRIPE_FADE_OUT_STEP;
        stripe.style.opacity = opacity;
        bar.style.opacity = bar.style.opacity - BAR_FADE_OUT_STEP;
      } else {
        stripe.style.opacity = 0;
        bar.style.opacity = 0;
        clearInterval(this.fadeOutAnimation);
      }
    }, FADE_OUT_INTERVAL);
  },

  cancel: function () {
    if (this.fadeOutEvent) {
      clearTimeout(this.fadeOutEvent);
      this.fadeOutEvent = 0;
    }
    if (this.fadeOutAnimation) {
      clearInterval(this.fadeOutAnimation);
      this.fadeOutAnimation = 0;
    }
  }
};

export {
  updateStripe
};

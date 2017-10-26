/**
 * Created by huoguangjin on 19/10/2017.
 */
"use strict";

import { updateStripe } from './preview.js'
import { highlight, HL_CLASS, resetNode, resetSelection } from './highlight'

const HL_LIST = [
  { fg: '#fff', bg: '#ff0000' },
  { fg: '#fff', bg: '#ff649f' },
  { fg: '#fff', bg: '#e040fb' },
  { fg: '#fff', bg: '#b388ff' },
  { fg: '#fff', bg: '#3f51b5' },
  { fg: '#fff', bg: '#1976d2' },
  { fg: '#000', bg: '#81d4fa' },
  { fg: '#000', bg: '#00b8d4' },
  { fg: '#000', bg: '#64ffda' },
  { fg: '#000', bg: '#4caf50' },
  { fg: '#000', bg: '#76ff03' },
  { fg: '#000', bg: '#cddc39' },
  { fg: '#000', bg: '#ffff00' },
  { fg: '#000', bg: '#ffca28' },
  { fg: '#fff', bg: '#ff6d00' },
  { fg: '#fff', bg: '#d84315' },
  { fg: '#fff', bg: '#795548' },
  { fg: '#fff', bg: '#9e9e9e' },
  { fg: '#fff', bg: '#607d8b' },
];

let color = 0;

const css = document.createElement('style');
css.type = 'text/css';
let cssText = `.${HL_CLASS} {`
  + 'font-style:normal;'
  + 'border-radius:3px;'
  + 'padding-left:3px;'
  + 'padding-right:3px;'
  + 'box-shadow:1px 1px 3px rgba(0,0,0,0.3);'
  + 'text-decoration:none;'
  + '}';
HL_LIST.forEach(({ fg, bg }, idx) => {
  cssText += ` .${HL_CLASS}_${idx} {color:${fg};background:${bg};}`;
});
css.innerHTML = cssText;
document.body.appendChild(css);

const keyword2hlInfo = new Map();

document.body.addEventListener('dblclick', () => {
  let selection = window.getSelection();
  let rangeCount = selection.rangeCount;
  if (rangeCount > 1) {
    console.log('highlight selection with ranges is not support now..');
    return;
  }

  let range = selection.getRangeAt(0);
  let { startContainer, endContainer } = range;
  if (startContainer !== endContainer) {
    console.log('highlight selection over nodes is not support now..');
    return;
  }

  let selectedText = selection.toString().trim();
  if (!selectedText) {
    return;
  }

  let anchorNode = selection.anchorNode;
  let hlInfo = keyword2hlInfo.get(selectedText);
  if (hlInfo) {
    keyword2hlInfo.delete(selectedText);
    let hlNode = anchorNode.parentNode;
    hlInfo.hlNodes.forEach((n) => {
      if (hlNode !== n && n) {
        resetNode(n);
      }
    });
    resetSelection(selectedText.length, hlNode);
  } else {
    const colorIndex = (color++) % HL_LIST.length;
    const className = `${HL_CLASS} ${HL_CLASS}_${colorIndex}`;
    const hlNodes = highlight(document.body, anchorNode, range.startOffset, selectedText, className);
    keyword2hlInfo.set(selectedText, { color: HL_LIST[colorIndex].bg, hlNodes });
  }

  requestUpdateStripe();
});

let updateStripeRequested = false;
const doUpdateStripe = () => {
  updateStripeRequested = false;
  updateStripe(keyword2hlInfo.values());
};

const requestUpdateStripe = () => {
  if (!updateStripeRequested) {
    updateStripeRequested = true;
    requestAnimationFrame(doUpdateStripe);
  }
};

window.addEventListener('resize', requestUpdateStripe);

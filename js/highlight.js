/**
 * Created by Rammer on 25/10/2017.
 */
"use strict";

const HL_CLASS = 'X_HIGHLIGHTED';

function nodeFilter(node) {
  let pNode = node.parentNode;
  let pTag = pNode.tagName;
  return (pNode && !pNode.classList.contains(HL_CLASS) && !(pTag === 'SCRIPT' || pTag === 'STYLE'))
    ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
}

function resetNode(hlNode) {
  let prevNode = hlNode.previousSibling;
  let nextNode = hlNode.nextSibling;

  if (prevNode && nextNode) {
    if (prevNode.nodeType === Node.TEXT_NODE && nextNode.nodeType === Node.TEXT_NODE) {
      mergePrevNextText(hlNode, prevNode, nextNode);
    } else if (prevNode.nodeType === Node.TEXT_NODE) {
      mergePrevText(hlNode, prevNode);
    } else if (nextNode.nodeType === Node.TEXT_NODE) {
      mergeNextText(hlNode, nextNode);
    } else {
      // console.log('resetNode: prevNode && nextNode but neither == t3');
      replaceHighlight(hlNode);
    }
  } else if (prevNode) {
    if (prevNode.nodeType === Node.TEXT_NODE) {
      mergePrevText(hlNode, prevNode);
    } else {
      // console.log('resetNode: prevNode && !nextNode but prevNode != t3');
      replaceHighlight(hlNode);
    }
  } else if (nextNode) {
    if (nextNode.nodeType === Node.TEXT_NODE) {
      mergeNextText(hlNode, nextNode);
    } else {
      // console.log('resetNode: !prevNode && nextNode but nextNode != t3');
      replaceHighlight(hlNode);
    }
  } else {
    // console.log('resetNode: !prevNode && !nextNode');
    replaceHighlight(hlNode);
  }
}

function mergePrevNextText(hlNode, prevNode, nextNode) {
  // console.log('mergePrevNextText', hlNode, prevNode, nextNode);
  prevNode.nodeValue = prevNode.nodeValue + hlNode.innerText + nextNode.nodeValue;
  nextNode.remove();
  hlNode.remove();
}

function mergePrevText(hlNode, prevNode) {
  // console.log('mergePrevText', hlNode, prevNode);
  prevNode.nodeValue = prevNode.nodeValue + hlNode.innerText;
  hlNode.remove();
}

function mergeNextText(hlNode, nextNode) {
  // console.log('mergeNextText', hlNode, nextNode);
  nextNode.nodeValue = hlNode.innerText + nextNode.nodeValue;
  hlNode.remove();
}

function replaceHighlight(hlNode) {
  let original = document.createTextNode(hlNode.innerText);
  hlNode.parentNode.replaceChild(original, hlNode);
  return original;
}

function resetSelection(len, hlNode) {
  let prevNode = hlNode.previousSibling;
  let nextNode = hlNode.nextSibling;

  if (prevNode && nextNode) {
    if (prevNode.nodeType === Node.TEXT_NODE && nextNode.nodeType === Node.TEXT_NODE) {
      let start = prevNode.length;
      mergePrevNextText(hlNode, prevNode, nextNode);
      selectRange(prevNode, start, start + len);
    } else if (prevNode.nodeType === Node.TEXT_NODE) {
      let start = prevNode.length;
      mergePrevText(hlNode, prevNode);
      selectRange(prevNode, start, start + len);
    } else if (nextNode.nodeType === Node.TEXT_NODE) {
      mergeNextText(hlNode, nextNode);
      selectRange(nextNode, 0, len);
    } else {
      let original = replaceHighlight(hlNode);
      selectRange(original, 0, original.length);
    }
  } else if (prevNode) {
    if (prevNode.nodeType === Node.TEXT_NODE) {
      let start = prevNode.length;
      mergePrevText(hlNode, prevNode);
      selectRange(prevNode, start, start + len);
    } else {
      // console.log('resetSelection: prevNode && !nextNode but prevNode != t3');
      let original = replaceHighlight(hlNode);
      selectRange(original, 0, original.length);
    }
  } else if (nextNode) {
    if (nextNode.nodeType === Node.TEXT_NODE) {
      mergeNextText(hlNode, nextNode);
      selectRange(nextNode, 0, len);
    } else {
      // console.log('resetSelection: !prevNode && nextNode but nextNode != t3');
      let original = replaceHighlight(hlNode);
      selectRange(original, 0, original.length);
    }
  } else {
    // console.log('resetSelection: !prevNode && !nextNode');
    let original = replaceHighlight(hlNode);
    selectRange(original, 0, original.length);
  }
}

function selectRange(textNode, start, end) {
  let range = document.createRange();
  range.setStart(textNode, start);
  range.setEnd(textNode, end);
  let selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function highlight(container, anchorNode, anchorOffset, keyword, className) {
  const highlightedNodes = [];

  const selectedNode = anchorNode.splitText(anchorOffset);
  selectedNode.splitText(keyword.length);

  const hlNode = document.createElement('span');
  hlNode.className = className;
  hlNode.innerText = selectedNode.nodeValue;
  selectedNode.parentNode.replaceChild(hlNode, selectedNode);
  highlightedNodes.push(hlNode);

  const range = document.createRange();
  range.selectNodeContents(hlNode);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  for (let node, it = document.createNodeIterator(container, NodeFilter.SHOW_TEXT, nodeFilter, false);
       node = it.nextNode();) {
    highlightNode(node, keyword, className, highlightedNodes);
  }

  return highlightedNodes;
}

function highlightNode(node, keyword, className, highlightedNodes) {
  const len = keyword.length;
  const content = node.nodeValue;
  const contentLen = content.length;

  const fragment = document.createDocumentFragment();

  let curr = 0;
  let last = 0;
  while (curr + len <= contentLen) {
    curr = content.indexOf(keyword, curr);
    if (curr === -1) {
      break; // no more match..
    }

    if (curr !== 0) {
      const prevNode = document.createTextNode(content.slice(last, curr));
      fragment.appendChild(prevNode);
    }

    last = curr + len;
    const hlNode = document.createElement('span');
    hlNode.className = className;
    hlNode.innerText = content.slice(curr, last);
    fragment.appendChild(hlNode);
    highlightedNodes.push(hlNode);

    curr = last;
  }

  if (last !== 0) {
    fragment.appendChild(document.createTextNode(content.slice(last)));
    node.parentNode.replaceChild(fragment, node);
  }
}

export {
  HL_CLASS,
  resetNode,
  resetSelection,
  highlight
};

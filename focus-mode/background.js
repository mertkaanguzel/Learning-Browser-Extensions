chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  });
});

const extensions = 'https://developer.chrome.com/docs/extensions';
const webstore = 'https://developer.chrome.com/docs/webstore';

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
    const nextState = await setNextState(tab);

    if (nextState === 'ON') {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ["focus-mode.css"],
        target: { tabId: tab.id },
      });
    } else if (nextState === 'OFF') {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ["focus-mode.css"],
        target: { tabId: tab.id },
      });
    }
  }

  if (tab.url.startsWith('https://developer.mozilla.org') && tab.url.includes('/docs')) {
    const nextState = await setNextState(tab);

    if (nextState === 'ON') {
      // Execute func setElementsInvisible
      await chrome.scripting.executeScript({
        func: setElementsInvisible,
        target: { tabId: tab.id },
      });
    } else if (nextState === 'OFF') {
      // Execute func setElementsVisible
      await chrome.scripting.executeScript({
        func: setElementsVisible,
        target: { tabId: tab.id },
      });
    }
  }
});

function setElementsInvisible() {
  document.querySelector('#nav-access').style.display = 'none';
  document.querySelector('#nav-footer').style.display = 'none';
  document.querySelector('.top-banner').style.display = 'none';
  document.querySelector('.main-document-header-container').style.display = 'none';
  document.querySelector('.sidebar-container').style.display = 'none';
}

function setElementsVisible() {
  document.querySelector('#nav-access').style.display = '';
  document.querySelector('#nav-footer').style.display = '';
  document.querySelector('.top-banner').style.display = '';
  document.querySelector('.main-document-header-container').style.display = '';
  document.querySelector('.sidebar-container').style.display = '';
}

async function setNextState(tab) {
  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  // Next state will always be the opposite
  const nextState = prevState === 'ON' ? 'OFF' : 'ON';

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  return nextState;
}


const tabs = await chrome.tabs.query({
  url: [
    'https://developer.chrome.com/docs/webstore/*',
    'https://developer.chrome.com/docs/extensions/*',
    'https://developer.mozilla.org/*/docs/*'
  ],
});

// Collator for comparison by local lang
const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

// Non-rendered element to be used repeatedly
const template = document.getElementById('li_template');

// Prevents value repetition
const elements = new Set();

for (const tab of tabs) {
  // Copy first child element(<li>) of the template with its sub elements
  const element = template.content.firstElementChild.cloneNode(true);

  const title = tab.title.split("-")[0].trim();
  const url = new URL(tab.url);
  const pathname = url.pathname.slice(url.pathname.indexOf('/docs') + '/docs'.length);

  element.querySelector('.title').textContent = title;
  element.querySelector('.pathname').textContent = pathname;
  element.querySelector('a').addEventListener('click', async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}
document.querySelector('ul').append(...elements);
/*
const button = document.querySelector('button');
button.addEventListener('click', async () => {
  const tabIds = tabs.map(({ id }) => id);
  const group = await chrome.tabs.group({ tabIds });
  await chrome.tabGroups.update(group, { title: 'DOCS' });
});
*/

const button = document.querySelector('button');

button.addEventListener('click', async () => {  
  if (button.innerText === 'Group Tabs') {
    await groupTabs();
    button.innerText = 'Ungroup Tabs';
  } else if (button.innerText === 'Ungroup Tabs')  {
    await ungroupTabs();
    button.innerText = 'Group Tabs';
  }
});

async function groupTabs() {
  const tabIds = tabs.map(({ id }) => id);
  const group = await chrome.tabs.group({ tabIds });
  await chrome.tabGroups.update(group, { title: 'DOCS' });
}

async function ungroupTabs() {
  const title = 'DOCS';
  const groups = await chrome.tabGroups.query({ title });
  const groupId = groups[0].id;
  const tabs = await chrome.tabs.query({ groupId });
  const tabIds = tabs.map(({ id }) => id);
  await chrome.tabs.ungroup(tabIds);
  //await chrome.tabGroups.update(groupId, { collapsed: true }); // To collapse tabs
}
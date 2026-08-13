// 拡張アイコンのクリックで、現在のウィンドウの全タブURLを .txt としてダウンロードする。

const BADGE_DURATION_MS = 2000;

function pad(value) {
  return String(value).padStart(2, "0");
}

// tabs-YYYYMMDD-hhmmss.txt
function buildFileName(date) {
  const stamp =
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  return `tabs-${stamp}.txt`;
}

// タブの並び順（左から右）を保ったまま、URLを1行1件で連結する。
function buildText(tabs) {
  const urls = tabs
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((tab) => tab.url ?? "")
    .filter((url) => url !== "");
  return urls.length === 0 ? "" : `${urls.join("\n")}\n`;
}

// MV3のservice workerではURL.createObjectURL()が使えないため、data URLで渡す。
function toDataUrl(text) {
  return `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
}

async function showBadge(text, color) {
  await chrome.action.setBadgeBackgroundColor({ color });
  await chrome.action.setBadgeText({ text });
  setTimeout(() => chrome.action.setBadgeText({ text: "" }), BADGE_DURATION_MS);
}

async function exportCurrentWindowTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const text = buildText(tabs);
  if (text === "") {
    await showBadge("0", "#9aa0a6");
    return;
  }

  await chrome.downloads.download({
    url: toDataUrl(text),
    filename: buildFileName(new Date()),
    saveAs: false,
  });
  await showBadge("OK", "#1e8e3e");
}

chrome.action.onClicked.addListener(() => {
  exportCurrentWindowTabs().catch(async (error) => {
    console.error("Tab URL Exporter: export failed", error);
    await showBadge("ERR", "#d93025");
  });
});

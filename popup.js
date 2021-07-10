// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");



/*

The Plan:

1. How do we get the data?
2. When exactly do we fetch the data and perform calculations?
  - When the icon is clicked (the extension icon)
	- Wbat is the event for this? DOMContentLoaded?
3. Display considerations
  - How do we show it?

*/




chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
// let color = '#3aa757';


// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color: color });
//   console.log('Default background color set to %cgreen', `color: ${color}`);
// });

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (tab.status === 'loading') {
    console.log(tab)

		const session = {
			url: tab.url,
			startingTime: new Date(),
			duration: 1234
		}

		chrome.storage.sync.set({ [tab.url]: session })
		chrome.storage.sync.get("https://netflix.com")
	}

	// we need to start a new timer for the target page
	// we need to end the timer for the current page
	// create session object -> needs url, starting time: current time
	// timer we just ended, we need to record in the session that just ended

})

chrome.tabs.onActivated.addListener((arg) => {
	console.log('Tab activated! ', arg);
})


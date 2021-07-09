// chrome.runtime.onInstalled.addListener(() => {
//   console.log('Default background color set to green');
// });

let currentSession;

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ keys: [] })
})


chrome.runtime.onStartup.addListener(() => {
	chrome.storage.sync.get(['keys'], (result) => {
		console.log('The currently stored keys are: ', result)
	})
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (tab.status === 'loading' && !tab.favIconUrl) {
		// get the url. e.g. https://www.stackoverflow.com/vim/keybindings/query?asdf => stackoverflow.com
		const url = (new URL(tab.url)).hostname.split('.').slice(1).join('.')

		// if the hostname hasn't changed because of the update, do nothing
		if (url === currentSession) return

		// close the current session
		endCurrentSession(currentSession)

		// set the current session and create the session object
		currentSession = url
		const session = {
			url: url,
			startTime: new Date(),
			endTime: null,
			duration: 1234
		}

		// get the current keys and update them with the new key
		chrome.storage.sync.get('keys', ({ keys }) => {
			// ensure that keys are unique. If adding an existing key, the set will ensure no duplicates
			keys = Array.from(new Set([...keys, url]))
			chrome.storage.sync.set({ keys });
			console.log('Keys: ', keys)

			// get existing sessions for new url
			chrome.storage.sync.get(url, (sessions => {
				console.log(`sessions for ${url}: `, sessions)
				chrome.storage.sync.set({ url: []})
			}))
		});
	}
})

chrome.tabs.onActivated.addListener((tabInfo) => {
	console.log('Tab activated! ', tabInfo);
})

function newSession() {

}

function endCurrentSession(key) {
	chrome.storage.sync.get(key, (result) => {
		console.log('Ending current session ', result);

	})
}


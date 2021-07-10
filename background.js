
// chrome.action.onClicked.addListener((action) => {
// 	console.log('action occurred: ', action)
// })

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ 'keys': [] })
	chrome.storage.sync.set({ 'favicons': {} })
});

chrome.runtime.onStartup.addListener(async () => {
	chrome.storage.sync.get('keys', (result) => {
		if (!result) chrome.storage.sync.set({ 'keys': [] })
	})
	chrome.storage.sync.get('favicons', (result) => {
		if (!result) chrome.storage.sync.set({ 'favicons': {} })
	})
})

let currentSession;

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	processChangeEvent(tab);
})

chrome.tabs.onActivated.addListener(async (tabInfo) => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true})
	processChangeEvent(tab);
})

function endCurrentSession(url) {
	url && chrome.storage.sync.get([url], (result) => {
		const sessions = result[url]
		const latestSession = sessions[sessions.length - 1]
		latestSession.end = (new Date()).getTime();
		latestSession.duration = latestSession.end - latestSession.start;
		sessions[sessions.length - 1] = latestSession
		chrome.storage.sync.set({ [url]: sessions})

		console.log(sessions);
	})
}

function parseUrl(url) {
	url = (new URL(url)).hostname.split('.') // docs.google.com != mail.google.com
	if (url.length > 2) url = url.slice(1)
	return url.join('.')
}

function processChangeEvent(tab) {
	if (tab.status === 'complete') {
		// favIconUrl
		// currently, tab.url === the entire path rather than just the host
		const url = parseUrl(tab.url)
		console.log(url) // google.com, netflix.com => docs.google.com === mail.google.com

		console.log(`Tab change event. Current session: ${currentSession}. New session: ${url}.`)
		if (currentSession === url) return // if changing the page to the same url (host), do nothing e.g., google.com/dogs => google.com/cats

		endCurrentSession(currentSession)

		currentSession = url

		const session = {
			url: url,
			start: (new Date()).getTime(),
			end: null,
			duration: null,
		}

    // make sure that if it's a new URL, it's in our keys list
		chrome.storage.sync.get(['keys'], ({ keys }) => {
			// now you have acces to the keys
			if(!keys.includes(url)){
				keys.push(url)
				// save the keys back into the storage
				chrome.storage.sync.set({ keys })
				// if we're here, set an empty array for the new key
				chrome.storage.sync.set({ [url]: [session] })
				chrome.storage.sync.get(['favicons'], ({ favicons }) => {
					if (!(url in favicons)) favicons[url] = tab.favIconUrl
					chrome.storage.sync.set({ favicons })
				})
			} else {
				chrome.storage.sync.get([url], (result) => {
					const sessions = result[url]
					sessions.push(session)
					chrome.storage.sync.set({ [url]: sessions })
				})
			}
		})
	}
}
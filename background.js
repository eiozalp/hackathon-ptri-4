chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ 'keys': [] })
});

chrome.runtime.onStartup.addListener(async () => {
	chrome.storage.sync.get('keys', (result) => {
		if (!result) chrome.storage.sync.set({ 'keys': [] })
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
	return (new URL(url)).hostname.split('.').slice(1).join('.') // docs.google.com != mail.google.com
}

function processChangeEvent(tab) {
	if (tab.status === 'complete') {
		// currently, tab.url === the entire path rather than just the host
		const url = parseUrl(tab.url)
		console.log(url) // google.com, netflix.com => docs.google.com === mail.google.com

		if (currentSession === url) return // if changing the page to the same url (host), do nothing e.g., google.com/dogs => google.com/cats

		endCurrentSession(currentSession)

		currentSession = url

		const session = {
			url: url,
			start: (new Date()).getTime(),
			end: null,
			duration: null
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
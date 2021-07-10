// Initialize button with user's preferred color
const popup = document.querySelector('#app')
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['keys'], ({ keys }) => {
    // Now we've got the keys

    // loops through keys (urls) or maybe... just pass entire array as argument to get
    chrome.storage.sync.get(keys, (sessionLists) => {
      const total = {};
      //key : [{duration: },{}]
      for (let key in sessionLists) {
        // key => 'google.com'
        const sum = sessionLists[key].reduce((acc,curr) => {
          // { duration: 1234, start: 12341234, end: 12341234, url: 'google.com' }
          //check if the duration is null 
          return acc + (curr.duration ?? (new Date()).getTime() - curr.start); 
        }, 0)
        total[key] = sum
      }

      // TODO: Improve efficiency as stretch goal -> may be inefficient as is
      const sorted = Object.keys(total).sort((a, b) => total[b] - total[a])

      chrome.storage.sync.get(['favicons'], ({ favicons }) => {
        // create dom elements and mount them to the popup div (#app)
        let popupHTML = ''
        for (let i = 0; i < (sorted.length < 5 ? sorted.length : 5); i++) {
          const data = {
            url: sorted[i],
            duration: convertTime(total[sorted[i]])
          }

          const el = /* html */`
            <div>
              <div style="display: flex; align-items: center; justify-content: flex-start;">
                <img style="width: 40px;" src="${favicons[sorted[i]]}">
                <h2 class="site--title">${data.url}</h2>
              </div>
              <sub class="site--sub">${data.duration}</sub>
            </div>
          `

          popupHTML += el
        }
        popup.innerHTML = popupHTML

      })
    })

    function convertTime( ms ) {
      // 1- Convert to seconds:
      var seconds = ms / 1000;
      // 2- Extract hours:
      var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
      seconds = seconds % 3600; // seconds remaining after extracting hours
      // 3- Extract minutes:
      var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
      // 4- Keep only seconds not extracted to minutes:
      seconds = seconds % 60;
      return `${hours+":"}${minutes+":"}${seconds}`;
  }

    // now we have our session lists full of objects
    // create new output object
      // { 'google.com': [{duration, start, end, url}, {}], 'netflix.com': [{}, {}] } 
      // reduce each session list for each key

    // [{}, {}, {}, {}, {}]

  })

/*

The Plan:

1. How do we get the data?
  - Fetch keys // 'keys' 
  - Use chrome.storage to get the keys
2. When exactly do we fetch the data and perform calculations?
  - When the icon is clicked (the extension icon)
	- Wbat is the event for this? DOMContentLoaded?
3. Display considerations
  - How do we show it?

*/



})

// let button = document.getElementById("changeColor");
// button.addEventListener('click', () => {
//   console.log('button clicked')
// })

// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });


// When the button is clicked, inject setPageBackgroundColor into current page
// button.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });

// chrome.action.onClicked.addListener((action) => {
//   console.log('clicked')
// })

// // // The body of this function will be executed as a content script inside the
// // // current page
// function setPageBackgroundColor() {
//   document.querySelector('#app').innerHTML = 'Hello!'
//   console.log('clicked')
// }
// Initialize button with user's preferred color
const popup = document.querySelector('#app')
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['keys'], ({ keys }) => {
    chrome.storage.sync.get(keys, (sessionLists) => {
      const total = {};
      //key : [{duration: },{}]
      for (let key in sessionLists) {
        // key => 'google.com'
        const sum = sessionLists[key].reduce((acc,curr) => {
          // { duration: 1234, start: 12341234, end: 12341234, url: 'google.com' }
          //check if the duration is null 
          console.log(`Current duration of final session for ${ curr.url }: `, curr.duration)
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
            <div class="site--block">
              <div style="display: flex; align-items: center; justify-content: flex-start;">
                <img style="width: 30px;" src="${favicons[sorted[i]]}">
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
      let returned ; 
      seconds = seconds % 60;
      if(hours === 0) {
        returned = (minutes === 0) ?  `${seconds.toFixed()}s` : `${minutes.toFixed()+":"} m ${seconds.toFixed()} s`;
      } 
      else returned = `${hours.toFixed()+":"}h ${minutes.toFixed()+":"}m ${seconds.toFixed()}s`;
      return returned;
  }
  })
})

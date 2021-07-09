
1. Get the data
  - The Data: The path: https://example.com. Categorization+ : Page content (including meta).
2. Establish mechanism to determine path change.
  - { active: true, currentWindow: true } <- count that
3. Store sites and time as key/value pairs:
  - { [css-tricks.com]: 2345236 }
4. Create UI to view results
  - Initially, just render the raw values.
	- Nice to have: Chart.js analytics.

```
	netflix: [{ duration: 41, time: time of day }, 41, 20] <- sum
	hulu: [{ duration: 32, time: new Date()	}]
```
/* global browser */

browser.topSites.get()
.then((sites) => {
	var div = document.getElementById('site-list');
	if (!sites.length) {
		div.innerText = 'No sites returned from the topSites API.';
		return;
	}

	let ul = document.createElement('ul');
	ul.className = 'list-group';
	for (let site of sites) {
		let li = document.createElement('li');
		li.className = 'list-group-item';
		let a = document.createElement('a');
		a.href = site.url;
		a.innerText = site.title || site.url;
		li.appendChild(a);
		ul.appendChild(li);
	}

	div.appendChild(ul);
});

function gotVisits(visits) {
	//console.log("Visit count: " + visits.length);
	document.getElementById('last-visit-url').innerText += " ( Visit count: " + visits.length + " )";
	let ul = document.createElement('ul');
	ul.className = '';

	for (visit of visits) {
		//console.log(visit.visitTime);
		let li = document.createElement('li');
		li.className = '';
		li.innerText = visit.visitTime || visit.visitTime;
		ul.appendChild(li);
	}

	document.getElementById('last-visits').appendChild(ul);
}

function listVisits(historyItems) {
	if (historyItems.length) {
		//console.log("URL " + historyItems[0].url);
		document.getElementById('last-visit-url').innerText = historyItems[0].url;

		var gettingVisits = browser.history.getVisits({
			url: historyItems[0].url
		});
		gettingVisits.then(gotVisits);
	}
}

var searching = browser.history.search({
	text: "",
	startTime: 0,
	maxResults: 1
});

searching.then(listVisits);
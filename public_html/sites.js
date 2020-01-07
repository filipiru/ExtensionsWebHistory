/* global browser */

/* * TOP PAGESITES * */
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
		if (site.title) {
			let li = document.createElement('li');
			li.className = 'list-group-item text-success';
			var url = new URL(site.url);
			var pathName = url.pathname.split('/');
			pathName = pathName.join(' > ');
			li.innerText = urlPreprocesor(url.hostname) + " " + pathName + " ";
			let a = document.createElement('a');
			a.href = site.url;

			//a.innerText = site.title || site.url;
			a.innerText = site.title;
			let br = document.createElement('br');
			li.appendChild(br);
			li.appendChild(a);
			ul.appendChild(li);
		} else {
			let li = document.createElement('li');
			li.className = 'list-group-item text-danger';
			var url = new URL(site.url);
			var pathName = url.pathname.split('/');
			pathName = pathName.join(' > ');
			li.innerText = urlPreprocesor(url.hostname) + " " + pathName + " ";
			let a = document.createElement('a');
			a.href = site.url;

			a.innerText = "link (no title)";
			li.appendChild(a);
			ul.appendChild(li);
		}
	}

	div.appendChild(ul);
});

/* * LAST HISTORY VISITED * */
browser.history.search({
	text: "",
	startTime: 0
}).then((histories) => {
	if (histories.length) {
		//console.log(histories.length);
		ShowHistory(histories);
	}
});

function ShowHistory(sites) {
	//console.log(sites);

	var div = document.getElementById('history-items');
	if (!sites.length) {
		div.innerText = 'No sites returned from the topSites API.';
		return;
	}

	let ul = document.createElement('ul');
	ul.className = 'list-group';
	for (let site of sites) {
		if (site.title) {
			let li = document.createElement('li');
			li.className = 'list-group-item text-success';
			var url = new URL(site.url);
			var pathName = url.pathname.split('/');
			pathName = pathName.join(' > ');
			li.innerText = urlPreprocesor(url.hostname) + " " + pathName + " ";
			let a = document.createElement('a');
			a.href = site.url;

			//a.innerText = site.title || site.url;
			a.innerText = site.title;
			let br = document.createElement('br');
			li.appendChild(br);
			li.appendChild(a);
			ul.appendChild(li);
		} else {
			let li = document.createElement('li');
			li.className = 'list-group-item text-danger';
			var url = new URL(site.url);
			var pathName = url.pathname.split('/');
			pathName = pathName.join(' > ');
			li.innerText = urlPreprocesor(url.hostname) + " " + pathName + " ";
			let a = document.createElement('a');
			a.href = site.url;

			a.innerText = "link (no title)";
			li.appendChild(a);
			ul.appendChild(li);
		}
	}

	div.appendChild(ul);
}

function urlPreprocesor(urlHostname) {
	var levelsDomain = urlHostname.split('.');
	if (levelsDomain.length < 2) {
		return urlHostname;
	}
	var preprocesorDomain = levelsDomain.reverse();
	var tld = preprocesorDomain.shift();
	var iild = preprocesorDomain.shift();
	iild = iild.toUpperCase();
	if (!preprocesorDomain.length) {
		return iild + " (" + tld + ")";
	}
	//console.log(preprocesorDomain.join('.'));

	return iild + "." + preprocesorDomain.join('.') + " (" + tld + ")";
}

/* * LAST VISITED ALL HISTORY * */

function gotVisits(visits) {
	//console.log("Visit count: " + visits.length);
	document.getElementById('last-visit-url').innerText += " ( Visit count: " + visits.length + " )";
	let ul = document.createElement('ul');
	ul.className = 'list-group';

	for (visit of visits) {
		//console.log(visit.visitTime);
		let li = document.createElement('li');
		li.className = 'list-group-item text-warning';
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
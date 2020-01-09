/* * APP History New Tab * */
/* global browser, _, moment */

const app = {history: {}, utils: {}, render: {}};
app.init = function () {
	app.lastHistory(20);
	app.topSites();
	app.lastSiteVisit();
	//console.log('init()', app);
};
app.lastSiteVisit = function () {
	browser.history.search({
		text: "",
		startTime: 0,
		maxResults: 1
	}).then((sites) => {
		if (sites.length) {
			let url = sites[0].url;
			//console.log("lastSiteVisit() url: ", url);
			document.getElementById('last-visits-url')
			.innerText = url;

			browser.history.getVisits({
				url: url
			}).then((visit) => {
				//console.log("lastSiteVisit() visit: ", visit);
				document.getElementById('last-visits-url').innerText += " ( Visit count: " + visit.length + " )";
				let ul = app.render.listGroupHorizontal(visit);
				document.getElementById('last-visits').appendChild(ul);
			});
		}
	});
};
app.topSites = function ()
{
	browser.topSites.get()
	.then((sites) => {
		sites = app.history.modifyHistoryItems(sites);
		app.history.renderTopSites(sites);
		//console.log('topSites()', sites);
	});
};
app.lastHistory = function (limit, searchText = "") {
	browser.history.search({
		text: searchText,
		startTime: 0,
		maxResults: limit
	}).then((sites) => {
		//console.log('lastHistory()', sites[0]);
		sites = app.history.modifyHistoryItems(sites);
		let groupByHostname = _.groupBy(sites, 'urlHostname');
		//console.log('lastHistory() _.groupBy', groupByHostname);
		app.history.render(sites);
		app.history.renderAccordion(groupByHostname);
	});
};
app.history.modifyHistoryItems = function (sites) {
	//console.log('history.modifyHistoryItems()', sites);

	for (let site of sites) {
		var url = new URL(site.url);
		site.urlHostname = url.hostname;
		site.urlPathname = url.pathname;
		site.urlHost = url.protocol + '//' + url.host;
		//console.log('history.modifyHistoryItems() site', site);
	}

	return sites;
};
app.history.renderTopSites = function (sites)
{
	//console.log('history.renderTopSites()', sites);
	let div = document.getElementById('topSites');
	if (!sites.length) {
		div.innerText = 'No sites returned from the topSites API.';
		return;
	}
	let ul = app.render.listGroupUl(sites);
	div.appendChild(ul);
};
app.history.renderAccordion = function (sitesGroupByHostname) {
	let sites = sitesGroupByHostname;
	//console.log('history.renderAccordion()', sites);

	let div = document.getElementById('accordionHostname');
	let i = 0;
	for (let hostname in sites) {
		//console.log('history.renderAcord()', i);
		let title = app.utils.urlHostname(hostname);
		let accord = app.render.accordCard(i, title, sites[hostname], 'accordionHostname');
		div.appendChild(accord);
		i++;
	}
};
app.history.render = function (sites) {
	let div = document.getElementById('historyItems');
	if (!sites.length) {
		div.innerText = 'No sites returned from the topSites API.';
		return;
	}
	let ul = app.render.listGroupUl(sites);
	div.appendChild(ul);
};
app.utils.urlHostname = function (urlHostname) {
	let levelsDomain = urlHostname.split('.');
	if (levelsDomain.length < 2) {
		return urlHostname;
	}
	let preprocesorDomain = levelsDomain.reverse();
	let tld = preprocesorDomain.shift();
	let iild = preprocesorDomain.shift();
	iild = iild.toUpperCase();
	if (!preprocesorDomain.length) {
		return iild + " (" + tld + ")";
	}
	//console.log(preprocesorDomain.join('.'));
	return iild + "." + preprocesorDomain.join('.') + " (" + tld + ")";
};
app.utils.urlPathname = function (urlPathname) {
	let pathName = urlPathname.split('/');
	pathName = pathName.join(' > ');
	return pathName;
};
app.utils.extractKeywords = function (text) {
	text = text.toLowerCase();
	let res = text.match(/\S{4,}/g);
	return _.uniq(res);
};
app.render.accordCard = function (index, title, body, divAccord) {
	let bodyList = app.render.listGroupUl(body);
	let div = document.createElement('div');
	div.className = 'card';
	div.innerHTML = "<div class=\"card-header\" id=\"heading-" + index + "\"><h2 class=\"mb-0\"><button class=\"btn btn-link\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapse-" + index + "\" aria-expanded=\"true\" aria-controls=\"collapse-" + index + "\">" + title + "</button></h2></div>";

	let divBody = document.createElement('div');
	divBody.className = 'collapse';
	if (index === 0) {
		divBody.className += ' show';
	}
	divBody.id = 'collapse-' + index;
	divBody.setAttribute('aria-labelledby', 'heading-' + index);
	divBody.setAttribute('data-parent', '#' + divAccord);
	let cardBody = document.createElement('div');
	cardBody.className = 'card-body';
	cardBody.appendChild(bodyList);
	divBody.appendChild(cardBody);
	div.appendChild(divBody);
	return div;
};
app.render.listGroupHorizontal = function (visits) {
	//console.log('render.listGroupHorizontal()', visits);
	let ul = document.createElement('ul');
	ul.className = 'list-group list-group-horizontal';
	for (let visit of visits) {
		let li = document.createElement('li');
		li.className = 'list-group-item text-muted';
		li.innerText = moment.unix(visit.visitTime);
		ul.appendChild(li);
	}
	return ul;
};
app.render.listGroupUl = function (sites) {
	let ul = document.createElement('ul');
	ul.className = 'list-group';
	for (let site of sites) {
		let li = document.createElement('li');
		let a = document.createElement('a');
		if (site.title) {
			li.className = 'list-group-item text-success';
			if (site.visitCount) {
				li.innerText = '(' + site.visitCount + ') ';
			}
			li.innerText += app.utils.urlHostname(site.urlHostname) + " ";
			li.innerText += app.utils.urlPathname(site.urlPathname) + " ";
			a.href = site.url;
			a.innerText = site.title || site.url;
			let br = document.createElement('br');
			li.appendChild(br);
		} else {
			li.className = 'list-group-item text-danger';
			if (site.visitCount) {
				li.innerText = '(' + site.visitCount + ') ';
			}
			li.innerText += app.utils.urlHostname(site.urlHostname) + " ";
			li.innerText += app.utils.urlPathname(site.urlPathname) + " ";
			a.href = site.url;
			a.innerText = "link (no title)";
		}
		li.appendChild(a);
		ul.appendChild(li);
	}
	return ul;
};
app.init();
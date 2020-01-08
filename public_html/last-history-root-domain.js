/* * LAST HISTORY ROOT DOMAIN * */
/* global browser, _ */

const app = {history: {}, storage: {}, utils: {}, render: {}};
app.init = function () {
	app.history.search();
	//console.log('init()', app);
};
app.history.search = function (searchText = "") {
	browser.history.search({
		text: searchText,
		startTime: 0,
		maxResults: 20
	}).then((sites) => {
		if (sites.length) {
			//console.log('history.search()', sites[0]);
			app.history.process(sites);
		}
	});
};
app.history.process = function (sites) {
	//console.log('history.process()', sites);

	for (let site of sites) {
		var url = new URL(site.url);
		site.urlHostname = url.hostname;
		site.urlPathname = url.pathname;
		site.urlHost = url.protocol + '//' + url.host;
		//console.log('history.process() site', site);
	}

	let groupByHostname = _.groupBy(sites, 'urlHostname');

	//console.log('history.process() _.groupBy', groupByHostname);
	//app.history.render(sites);
	//app.history.renderGroup(groupByHostname);
	app.history.renderAccord(groupByHostname);

};
app.history.renderGroup = function (sitesGroupByHostname) {
	let sites = sitesGroupByHostname;
	//console.log('history.renderAcord()', sites);

	let div = document.getElementById('accordionHostname');

	for (let hostname in sites) {
		let h4 = document.createElement('h4');
		h4.innerText = hostname;

		//console.log('history.renderAcord()', sites[hostname]);
		let ul = app.render.listGroupUl(sites[hostname]);

		div.appendChild(h4);
		div.appendChild(ul);
	}
};
app.history.renderAccord = function (sitesGroupByHostname) {
	let sites = sitesGroupByHostname;
	//console.log('history.renderAcord()', sites);

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
	let div = document.getElementById('history-items');
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
app.render.listGroupUl = function (sites) {
	let ul = document.createElement('ul');
	ul.className = 'list-group';
	for (let site of sites) {
		let li = document.createElement('li');
		let a = document.createElement('a');
		if (site.title) {
			li.className = 'list-group-item text-success';
			li.innerText = '(' + site.visitCount + ') ';
			//li.innerText += app.utils.urlHostname(site.urlHostname) + " ";
			li.innerText += app.utils.urlPathname(site.urlPathname) + " ";
			a.href = site.url;
			a.innerText = site.title || site.url;
			let br = document.createElement('br');
			li.appendChild(br);
		} else {
			li.className = 'list-group-item text-danger';
			li.innerText = '(' + site.visitCount + ') ';
			//li.innerText += app.utils.urlHostname(site.urlHostname) + " ";
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
var feeds = [
	'http://rss.cnn.com/rss/cnn_topstories.rss',
	'http://www.wral.com/news/rss/48/',
	"http://feeds.bbci.co.uk/news/rss.xml",
	"http://www.cbn.com/cbnnews/world/feed/",
	"http://feeds.reuters.com/Reuters/worldNews",
	"http://www.cbn.com/cbnnews/us/feed/",
	"http://feeds.reuters.com/Reuters/domesticNews",
	"http://news.yahoo.com/rss/",
	"http://feeds.bbci.co.uk/news/business/rss.xml",
	"http://feeds.bbci.co.uk/news/technology/rss.xml",
	"http://feeds.washingtonpost.com/rss/rss_blogpost",
	"http://rssfeeds.usatoday.com/usatoday-newstopstories&x=1",
	"http://feeds.skynews.com/feeds/rss/us.xml"
];

var entries = [];

var numEntries = 200;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var ids = [];

function loadFeeds() {
	ids = [];
	entries = [];
	for (let url of feeds) {
		ids.push(url);
		feednami.load(url)
	    .then(feed => {
	    	for(let entry of feed.entries){
	    		entries.push({
	    			title: entry.title,
					pubDate: entry.pubDate,
					link: entry.link,
					description: entry.description
	    		});
	    	}
	    	var idx = ids.indexOf(url);
	    	if (ids !== -1) {
	    		ids.splice(idx, 1);
	    	}
	    })
	}
	updateFeeds();
}

function isUpdating() {
	return ids.length !== 0;
}

async function updateFeeds() {
	clearEntries();
	while (isUpdating()) {
		await sleep(1000);
	}
	entries.sort(function(a, b) {
		return new Date(b.pubDate) - new Date(a.pubDate);
	});
	entries.length = numEntries;
	for (let entry of entries) {
		addEntry(entry);
	}
}

var scrollInterval = 0;
var scrollTime = 0.1*1000;
var scrollAmount = 0;
var maxAmount = 50000;
var scrollLines = 4;

function clearEntries() {
	var news = document.getElementById("news");
	news.innerHTML = '';
}

function addEntry(entry) {
	var news = document.getElementById("news");
	var elem = document.createElement("div");
	var title = document.createElement("div");
	var pubdate = document.createElement("div");
	var link = document.createElement("div");
	var description = document.createElement("div");
	title.innerHTML = entry.title;
	pubdate.innerHTML = (new Date(entry.pubDate)).toLocaleString();
	link.innerHTML = entry.link;
	description.innerHTML = entry.description;
	title.className = "title";
	pubdate.className = "pubDate";
	link.className = "link";
	description.className = "description";
	elem.appendChild(title);
	elem.appendChild(pubdate);
	elem.appendChild(link);
	elem.appendChild(description);
	elem.className = "item";
	news.appendChild(elem);
}

var images = [
	"../res/000.jpg",
	"../res/001.jpg",
	"../res/002.jpg",
	"../res/003.jpg",
	"../res/004.jpg",
	"../res/005.jpg",
	"../res/006.jpg",
	"../res/007.jpg",
	"../res/008.jpeg",
	"../res/009.jpg",
	"../res/010.jpg",
	"../res/011.jpg",
	"../res/012.jpg"
]

var texts = [
	"Museum of Art",
	"Museum of Natural History",
	"Marbles Kid's Museum",
	"Museum of History",
	"Triangle Rock Club",
	"JC Raulston Arboretum",
	"William B. Umstead State Park",
	"North Carolina State Capitol",
	"Historic Yates Mill County Park",
	"Raleigh Little Theatre",
	"Contemporary Art Museum",
	"City of Raleigh Museum",
	"Executive Mansion"
];

var interval = 5000;
var idx = 0;

window.onload = function() {
	loadFeeds();
	var news = document.getElementById("news");
	scrollInterval = setInterval(function() {
		news.scroll(0, scrollAmount += scrollLines);
		if (scrollAmount >= news.scrollHeight) {
			scrollAmount = 0;
		}
	}, scrollTime);
	news.scrollTop = 0;
	setInterval(loadFeeds, 15*60*1000);

	var slide = document.getElementById("slide");
	slide.setAttribute("src", images[idx]);
	var slidetext = document.getElementById("slide-text");
	slidetext.innerText = texts[idx];
	setInterval(function() {
		var slide = document.getElementById("slide");
		slide.setAttribute("src", images[idx]);
		var slidetext = document.getElementById("slide-text");
		slidetext.innerText = texts[idx];
		idx++;
		if (idx >= images.length) {
			idx = 0;
		}
	}, interval);
};

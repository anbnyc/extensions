function retrieveData(url){
	url = url ? url : "";
	if(url.startsWith("chrome://")){
		populateTooltip({subdomain: "chrome://", count: 1, lastVisitTime: new Date(), urls: [url]})
		return;
	}
	let query = { maxResults: 10000, text: url }
	chrome.history.search(query,function(visits){
		let data = {};
		visits.forEach(function(visit){
			let subdomain = visit.url.substring(0, visit.url.search(/\.{1}(com|org|io|edu|it|co|net|gov|run|us)/) + 4);
			if(!data[subdomain]){
				data[subdomain] = {
					subdomain: subdomain,
					count: 0,
					lastVisitTime: new Date(0),
					urls: []
				}
			}
			data[subdomain].count += 1;
			data[subdomain].urls.push(visit.url);
			if(data[subdomain].lastVisitTime < new Date(visit.lastVisitTime)){
				data[subdomain].lastVisitTime = new Date(visit.lastVisitTime);
			}
		});
		if(url){
			populateTooltip(Object.values(data)[0]);
		} else {
			populateGraph(Object.values(data).sort((a,b)=>b.count - a.count));
		}
	});
}

function populateGraph(items){

	clearTooltip();
	const ht = 300;

	var scaler = d3.scaleLinear()
		.domain([0,d3.max(items,o=>o.count)])
		.range([0,ht-15]);

	var svg = d3.select("svg#graph")
		.attr("height",ht)
		.attr("width",10*items.length);

	var groups = svg.selectAll("g")
		.data(items);

	groups.exit().remove();

	var newgroups = groups
		.enter()
		.append("g");

	newgroups.append("rect")
		.attr("fill","#a157e8");
	newgroups.append("text")
		.attr("class","label");

	var gs = groups
		.merge(newgroups)
		.attr("transform",(d,i)=>"translate("+(i*10)+","+(ht-scaler(d.count))+")");

	gs.selectAll("rect")
		.attr("height",d=>scaler(d.count))
		.attr("width",8);

	gs.selectAll("text.label")
		.text(d=>d.count)
		.attr("y",-5);

	gs
		.on('click',function(d){
			populateTooltip(d);
		})
		.on('dblclick',function(){
			clearTooltip();
		});

}

function populateTooltip(d){
	if(!d3.event){
		d3.select("svg").attr("height",0);
	}
	let html = "<span><h4>Subdomain: "+d.subdomain+"</h4></span><span><h4/>Count: "+
		d.count+"</h4></span><span><h4>Last Visit Time: "+d.lastVisitTime+"</h6></span><ul>";
	d.urls.forEach(function(url){
		html += "<li>"+url+"</li>"
	});
	html += "</ul>";
	d3.select("div#tooltip")
		.html(html);
}

function clearTooltip(){
	d3.select("div#tooltip").html("");
}

document.getElementById("history-thispage").addEventListener("click",function(){
	getCurrentTabUrl(function(url){
		retrieveData(url);
	});
});

document.getElementById("history-all").addEventListener("click",function(){
	retrieveData();
});

function getCurrentTabUrl(callback) {
	chrome.tabs.getSelected(null,function(tab){
		var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
		callback(url);
	})
}
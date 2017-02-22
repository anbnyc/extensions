
function addAttributes(){
  let label = document.createElement("g");
  label.innerHTML = "<text>Type: </text><text id='type'></text>";
  let dom = document.body.innerHTML;
  let rects = document.getElementsByTagName("rect");
  for(var i = 0; i < rects.length; i++){
    let attrs = rects[i].attributes;
    let topval = parseInt(rects[i].y.baseVal.value)+parseInt(attrs.height.value)+(10*i);
    let metadata = "<div class='metadata' left='"+rects[i].x.baseVal.value+
      "' top='"+topval+"'>";
    for(var j = 0; j < attrs.length; j++){
      metadata += "<br/><span>"+attrs[j].name+": "+attrs[j].value+"</span>";
    }
    metadata += "</div>"
    dom += metadata;
  }
  document.body.innerHTML = dom;
}

addAttributes();
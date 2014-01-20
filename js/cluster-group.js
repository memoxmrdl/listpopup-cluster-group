function get_item_of_group(v) {
  var name = "";
  for (var i=0;i<addressPoints.length;i++) {
    var ap = addressPoints[i];
    if(ap[0] == v.lat && ap[1] == v.lng) {
      name = "Name:" + ap[2] + " - Lat: " + ap[0] + ", Lng: " + ap[1] + "";
      break;
    }         
  }
  
  return name;
}

function render_list_popup(childs) {
  var item_list = items_list = "",
      info;

  height = childs.length > 4 ? 250 : (childs.length * 73);

  $.each(childs, function(i, v) {
    item_list = get_item_of_group(v._latlng);
    items_list += "\n<a class=\"cluster-tile-container\">";
    items_list += "<div class=\"cluster-content\">"+ item_list +"</div>";
    items_list += "</a>";
  });
  
  content =  "<div class=\"cluster-modal-container\">";
  content += "<div class=\"cluster-modal-list\" style=\"height:"+ height +"px\">"+ items_list +"</div>";
  content += "</div>";

  return content;
}

var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
    cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade, Points &copy 2012 LINZ',
    cloudmade = L.tileLayer(cloudmadeUrl, {maxZoom: 17, attribution: cloudmadeAttribution}),
    latlng = L.latLng(-37.82, 175.24);

var map = L.map('map', {center: latlng, zoom: 13, layers: [cloudmade]});

var markersGroup = L.markerClusterGroup({ 
  disableClusteringAtZoom: 17,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: false
});

markersGroup.on('clusterclick', function (a) { 
  var childs = a.layer.getAllChildMarkers();

  L.popup({         
    maxWidth: 300, 
    maxHeight: 450, 
    closeButton: false, 
    keepInView: false, 
    zoomAnimation: false,
  })
  .setLatLng(a.latlng)
  .setContent(render_list_popup(childs))
  .openOn(map);
});

$.each(addressPoints, function(i, v) { 
  var marker = L.marker(L.latLng(v[0], v[1]), { title: v[2] });
  marker.bindPopup(v[2]);
  markersGroup.addLayer(marker);
});

map.addLayer(markersGroup);
function get_info_group(v) {
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

function render_popup(childs) {
  var list = content = "";
  var info;

  height = childs.length > 4 ? 250 : (childs.length * 73);
  $.each(childs, function(i, v) {
    info = get_info_group(v._latlng);
    list += "\n<a class=\"cluster-tile-container\">";
    list += "<div class=\"cluster-content\">"+ info +"</div></a>";
  });
  
  content = "<div class=\"cluster-modal-container\">";
  content += "<div class=\"cluster-modal-list\" ";
  content += "style=\"height:"+ height +"px\">"+ list +"</div></div>";

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
  .setContent(render_popup(childs))
  .openOn(map);
});

for (var i = 0; i < addressPoints.length; i++) {
  var a = addressPoints[i];
  var title = a[2];
  var marker = L.marker(L.latLng(a[0], a[1]), { title: title });
  marker.bindPopup(title);
  markersGroup.addLayer(marker);
}

map.addLayer(markersGroup);
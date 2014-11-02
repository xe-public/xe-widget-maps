function addMarker(target_map, map_marker_positions) {
	positions = makeLocationArray(map_marker_positions);

	// 전체 마커 생성
	for(var i = 0; i < positions.length; i++)
	{
		var markers = new daum.maps.Marker({
			position: positions[i]
		});
		markers.setMap(target_map);
		markers.setDraggable(false);
	}

}
function makeLocationArray(str_position) {
	var arr_positons = new Array();
	var positions = str_position.split(";");
	for(var i = 0; i < positions.length; i++)
	{
		if(!positions[i].trim()) continue;
		var position = positions[i].split(",");
		arr_positons[i] = new daum.maps.LatLng(position[0],position[1]);
	}
	return arr_positons;
}

function getMapWidget(map_id, map_center, map_markers, p_map_zoom) {
	var center_split = map_center.split(',');
	var map_zoom = 20 - parseInt(p_map_zoom,10);
	if(!map_zoom) map_zoom = 5;

	var mapOption = {
		level: map_zoom,
		center: new daum.maps.LatLng(center_split[0], center_split[1])
	}
	var map = new daum.maps.Map(document.getElementById(map_id), mapOption);

	var zoomControl = new daum.maps.ZoomControl();
	map.addControl(zoomControl, daum.maps.ControlPosition.LEFT);
	var mapTypeControl = new daum.maps.MapTypeControl();
	map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);

	addMarker(map, map_markers);
}
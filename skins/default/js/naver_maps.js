function addMarker(target_map, map_marker_positions) {
	positions = makeLocationArray(map_marker_positions);
	var oSize = new nhn.api.map.Size(28, 37);
	var oOffset = new nhn.api.map.Size(14, 37);
	var oIcon = new nhn.api.map.Icon('http://static.naver.com/maps2/icons/pin_spot2.png', oSize, oOffset);

	// 전체 마커 생성
	for(var i = 0; i < positions.length; i++)
	{
		var markers = new nhn.api.map.Marker(oIcon, {
			point: positions[i]
		});
		target_map.addOverlay(markers);
	}

}
function makeLocationArray(str_position) {
	var arr_positons = new Array();
	var positions = str_position.split(";");
	for(var i = 0; i < positions.length; i++)
	{
		if(!positions[i].trim()) continue;
		var position = positions[i].split(",");
		arr_positons[i] = new nhn.api.map.LatLng(position[0],position[1]);
	}
	return arr_positons;
}

function getMapWidget(map_id, map_center, map_markers, p_map_zoom) {
	var center_split = map_center.split(',');
	var map_zoom = parseInt(p_map_zoom,10) - 5;
	if(!map_zoom) map_zoom = 10;

	var mapOption = {
		zoom: map_zoom,
		point: new nhn.api.map.LatLng(center_split[0], center_split[1]),
		enableWheelZoom : true,
		enableDragPan : true,
		enableDblClickZoom : true,
		mapMode : 0,
		activateTrafficMap : false,
		activateBicycleMap : false
	}
	var p_map = new nhn.api.map.Map(map_id, mapOption);

	var zoomControl = new nhn.api.map.ZoomControl();
	p_map.addControl(zoomControl);
	zoomControl.setPosition({ top : 10, left : 10 });
	var mapTypeControl = new nhn.api.map.MapTypeBtn();
	p_map.addControl(mapTypeControl);
	mapTypeControl.setPosition({ top : 10, right : 10 });

	addMarker(p_map, map_markers);
}
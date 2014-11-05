/* Copyright (C) Kim, MinSoo <misol.kr@gmail.com> */
/*
 * @file	js/microsoft_maps.js
 * @author	MinSoo Kim (misol.kr@gmail.com)
 * @brief	javascript for viewing bing map.
 * @see		지도 위젯의 열람용 자바스크립트
 */
function addMarker(target_map, map_marker_positions) {
	positions = makeLocationArray(map_marker_positions);

	// 전체 마커 생성
	for(var i = 0; i < positions.length; i++)
	{
		var markers = new Microsoft.Maps.Pushpin(positions[i], {
			draggable: false
		});
		target_map.entities.push(markers);
	}

}
function makeLocationArray(str_position) {
	var arr_positons = new Array();
	var positions = str_position.split(";");
	for(var i = 0; i < positions.length; i++)
	{
		if(!positions[i].trim()) continue;
		var position = positions[i].split(",");
		arr_positons[i] = new Microsoft.Maps.Location(position[0],position[1]);
	}
	return arr_positons;
}

function getMapWidget(map_id, map_center, map_markers, map_zoom, map_draggable, cont_id) {
	var center_split = map_center.split(',');
	var map_zoom = parseInt(map_zoom,10);
	if(!map_zoom) map_zoom = 13;

	if(map_draggable == 'false')
	{
		map_draggable = true;// disablePanning은 반대로 설정해야 한다
	}
	else
	{
		map_draggable = false; 
	}

	var map_canvas = document.getElementById(map_id);
	var map_width = jQuery( map_canvas ).width();
	var map_height = jQuery( map_canvas ).height();
	var mapOption = {
		credentials: map_api_key,
		width: map_width,
		height: map_height,
		zoom: map_zoom,
		disablePanning: map_draggable,
		center: new Microsoft.Maps.Location(center_split[0], center_split[1]),
		mapTypeId: Microsoft.Maps.MapTypeId.road,
		showMapTypeSelector: false,
		showScalebar: false,
		showDashboard: false,
		enableSearchLogo: false
	}
	var map = new Microsoft.Maps.Map(map_canvas, mapOption);
	oMap[cont_id] = map;

	addMarker(map, map_markers);
}

// 백분율 단위 가로 사이즈일 때, 모바일 화면 사이즈 변화나 화면 사이즈 변화 대응
jQuery(window).on("resize", function(){
	jQuery("div.maps_widget").each( function() {
		var style = jQuery( this ).attr("style"); // setSize 후에 style 변조 방지
		var new_width = jQuery( this ).width();
		var new_height = jQuery( this ).height();
		var cont_id = jQuery( this ).attr("data-maps-count");
		oMap[cont_id].setOptions({
			width: new_width,
			height: new_height
		});
		//oMap[cont_id].setSize(new nhn.api.map.Size(new_width, new_height));
		jQuery( this ).attr("style", style);// setSize 후에 style 변조 방지
	});
});
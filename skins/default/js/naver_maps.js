/* Copyright (C) Kim, MinSoo <misol.kr@gmail.com> */
/*
 * @file	js/naver_maps.js
 * @author	MinSoo Kim (misol.kr@gmail.com)
 * @brief	javascript for viewing naver map.
 * @see		지도 위젯의 열람용 자바스크립트
 */
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

function getMapWidget(map_id, map_center, map_markers, p_map_zoom, map_draggable, cont_id) {
	var center_split = map_center.split(',');
	var map_zoom = parseInt(p_map_zoom,10) - 5;
	if(!map_zoom) map_zoom = 10;

	if(map_draggable == 'false')
	{
		map_draggable = false; 
	}
	else
	{
		map_draggable = true; 
	}

	var mapOption = {
		zoom: map_zoom,
		point: new nhn.api.map.LatLng(center_split[0], center_split[1]),
		enableWheelZoom : true,
		enableDragPan : map_draggable,
		enableDblClickZoom : true,
		mapMode : 0,
		activateTrafficMap : false,
		activateBicycleMap : false
	}
	var map = new nhn.api.map.Map(map_id, mapOption);
	oMap[cont_id] = map;

	var zoomControl = new nhn.api.map.ZoomControl();
	map.addControl(zoomControl);
	zoomControl.setPosition({ top : 10, left : 10 });
	var mapTypeControl = new nhn.api.map.MapTypeBtn();
	map.addControl(mapTypeControl);
	mapTypeControl.setPosition({ top : 10, right : 10 });

	addMarker(map, map_markers);
}

// 백분율 단위 가로 사이즈일 때, 모바일 화면 사이즈 변화나 화면 사이즈 변화 대응
jQuery(window).on("resize", function(){
	jQuery("div.maps_widget").each( function() {
		var style = jQuery( this ).attr("style"); // setSize 후에 style 변조 방지
		var new_width = jQuery( this ).width();
		var new_height = jQuery( this ).height();
		var cont_id = jQuery( this ).attr("data-maps-count");
		oMap[cont_id].setSize(new nhn.api.map.Size(new_width, new_height));
		jQuery( this ).attr("style", style);// setSize 후에 style 변조 방지
	});
});
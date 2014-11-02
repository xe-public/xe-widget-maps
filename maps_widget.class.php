<?php
/* Copyright (C) Kim, MinSoo <misol.kr@gmail.com> */
/**
 * @file	maps_widget.class.php
 * @author	MinSoo Kim (misol.kr@gmail.com)
 * @brief	class of the maps widget
 */
class maps_widget extends WidgetHandler
{
	private $langtype = '';
		//language setting
	private $xe_langtype = array(
			'ko',
			'en',
			'zh-tw',
			'zh-cn',
			'jp',
			'es',
			'fr',
			'ru',
			'vi',
			'mn',
			'tr'
		);
	private $google_langtype = array(
			'ko',
			'en',
			'zh-Hant',
			'zh-Hans',
			'ja',
			'es',
			'fr',
			'ru',
			'vi',
			'en', // google does not not support
			'tr'
		);

	/**
	 * @brief Widget execution
	 *
	 * Get extra_vars declared in ./widgets/widget/conf/info.xml as arguments
	 * After generating the result, do not print but return it.
	 */
	function proc($widget_info)
	{
		Context::loadFile(array('./common/js/jquery.js', 'head', 'gte IE 9', -110000), true);
		$this->langtype = str_replace($this->xe_langtype, $this->google_langtype, strtolower(Context::getLangType()));

		// API 종류 정하기 다음/네이버/구글
		$oMapsModel = getModel('maps');
		$maps_config = $oMapsModel->getMapsConfig();
		if(!$maps_config->maps_api_type)
		{
			return 'Error: No Maps Module';
		}
		Context::set('maps_api_type', $maps_config->maps_api_type);

		$args = new stdClass();
		$args->maps_srl = intval($widget_info->maps_srl);

		// 정수형이고, 값이 존재할 경우 실제 존재하는 지도인지 확인(업데이트 날짜가 존재하는지 확인)
		if($args->maps_srl > 0)
		{
			$output = executeQuery('maps.getMapUpdate', $args);
		}

		// 존재하는 지도일 경우, 지도 데이터 가져옴
		if($output->data->update)
		{
			$output = executeQuery('maps.getMapbySrl', $args);

			$maps_content = unserialize(base64_decode($output->data->maps_content));

			Context::set('map_title',$output->data->title);
			Context::set('map_content',$output->data->content);
			Context::set('map_center',$maps_content->map_center);
			Context::set('map_markers',$maps_content->map_markers);
			Context::set('map_zoom',$maps_content->map_zoom);
		}


		// Set a path of the template skin (values of skin, colorset settings)
		$tpl_path = sprintf('%sskins/%s', $this->widget_path, $widget_info->skin);
		$tpl_file = 'index';

		if(!$widget_info->map_width) $widget_info->map_width = 320;
		if(!$widget_info->map_height) $widget_info->map_height = 300;

		Context::set('colorset', $widget_info->colorset);
		Context::set('map_width', intval($widget_info->map_width));
		Context::set('map_height', intval($widget_info->map_height));
		if(in_array($widget_info->map_draggable, array('true','false')))
		{
			Context::set('map_draggable', $widget_info->map_draggable);
		}
		else
		{
			Context::set('map_draggable', 'true');
		}
		if(in_array($widget_info->map_width_unit, array('%','px')))
		{
			Context::set('map_width_unit', $widget_info->map_width_unit);
		}
		else
		{
			Context::set('map_width_unit', 'px');
		}

		//한 페이지 내에 지도 수
		$map_count = Context::get('widget_maps_count');
		if(!$map_count) {
			$map_count=1;
		} else {
			$map_count=$map_count+1;
		}
		Context::set('widget_maps_count' , $map_count);

		$header_script = '';
		if($map_count==1) {
			if($maps_config->maps_api_type == 'daum')
			{
				$header_script .= '<script src="https://apis.daum.net/maps/maps3.js?apikey='.$maps_config->map_api_key.'"></script><style type="text/css">div.maps_widget img {max-width:none;}div.maps_widget>a>img {max-width:none;}</style>'."\n";
			}
			elseif($maps_config->maps_api_type == 'naver')
			{
				$header_script .= '<script src="http://openapi.map.naver.com/openapi/naverMap.naver?ver=2.0&amp;key='.$maps_config->map_api_key.'"></script><style type="text/css">div.maps_widget img {max-width:none;}div.maps_widget>a>img {max-width:none;}</style>'."\n";
			}
			elseif($maps_config->maps_api_type == 'microsoft')
			{
				$header_script .= '<script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script><style type="text/css">div.maps_widget img {max-width:none;}div.maps_widget>a>img {max-width:none;}</style>'."\n";
			}
			else
			{
				$header_script .= '<script src="https://maps-api-ssl.google.com/maps/api/js?sensor=false&amp;language='.$this->langtype.'"></script><style type="text/css">.gmnoprint div[title^="Pan"],.gmnoprint div[title~="이동"] {opacity: 0 !important;}div.maps_widget img {max-width:none;}div.maps_widget>a>img {max-width:100%;}</style>'."\n";
			}
		}

		Context::set('header_script' , $header_script);

		// Compile a template
		$oTemplate = &TemplateHandler::getInstance();
		return $oTemplate->compile($tpl_path, $tpl_file);
	}
}
/* End of file language_select.class.php */
/* Location: ./widgets/language_select/language_select.class.php */

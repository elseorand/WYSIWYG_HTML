<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html>
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=11" />
		<title>HTML Developing</title>

 		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css" />
 		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
 		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>

		<style type="text/css" >
			* {
				font-family: 'A-TTC 新ゴ M', 'ヒラギノ角ゴ Pro W3',
				'Hiragino Kaku Gothic Pro W3', 'メイリオ', Meiryo, 'ＭＳ Ｐゴシック', sans-serif,
				'ＭＳ ゴシック', monospace;
			}

			body {
				margin: 0px;
			}

			.shadow {
				padding: 6px;
				box-shadow: 5px 5px 15px #000000;
				background: black\9;
				border-radius: 5px;
			}

			p,dl {
				padding: 5px;
			}

			th {
				white-space: nowrap;
				word-break: keep-all;
			}

			input {
				border-radius: 5px;
			}

			input[type=text] {
				padding: 5px;
			}

			.shadow:not (:target ) {
				filter: none;
				background: rgba(128, 128, 128, 0.1);
			}

			#content_root {
				width: 100%;
			}

			h1,h2,h3,h4 {
				text-align: center;
			}

			h1 {
				font-size: 4em;
			}

			h2 {
				font-size: 3em;
			}

			h3 {
				font-size: 2em;
			}

			.csssplite {
				cursor: pointer;
				background-position: -20px -4px;
			}

			.hide_mode_target {
				width: 100%;
			}

			.menu_bar {
				background-color: rgba(221, 221, 221, 0.5);
				padding: 5px;
				height: 50px;
			}

			.side_menu_bar>input {
				margin: 4px;
			}

			.objSelected {
				border:4px dotted red !important;
				opacity: 0.6;
			}

			.objSelected * {
				background-color: orange !important;
				opacity: 0.6;
			}

			.objCut {
				border:4px dotted blue !important;
				opacity: 0.6;
			}

			.objCut *{
				background-color: #aaccff !important;
				opacity: 0.6;
			}

			.objCopy {
				border:4px dotted green !important;
				opacity: 0.6;
			}

			.objCopy *{
				background-color: #aaffcc !important;
				opacity: 0.6;
			}

			label {
				padding-left: 5px;
				padding-right: 5px;
				white-space: nowrap;
			}

			.snap {
				background-color: white;
				border: 1px dotted gray;
			}

			#header_menu_bar , #sub_header_menu_bar{
				padding-left:60px;
			}
			.display_none{
				display : none;
			}
			.menu_button{
				margin:10px;
			}

		</style>
	</head>
	<body>
		<header>
			<section id="header_menu_bar" class="menu_bar hide_mode_target" data-fire-key-code="escape" style="position:fixed;top:0px ;left: 0px ;z-index:101;" >

			</section>
			<section id="sub_header_menu_bar" class="hide_mode_target menu_bar" data-fire-key-code="escape"	 style="position:fixed;top:0px ;left: 0px ;z-index:101; display:none;" >
				<input type="button" value="Save" id="func_save_element" />
				<input type="button" value="Load" id="func_load_element" />
				<input type="text" id="saved_serialized"	placeholder="click save => The data comes here" />
				<select id="history" ></select>
			</section>
		</header>
		<section id="screen" style="position:absolute; top:44px;bottom:44px;z-index:100;background-color:LemonChiffon;width:100%; height:1440px;" data-my-obj-id="0"></section>
		<section id="side_menu_bar" class="menu_bar side_menu_bar float_menu header_menu" style="position:absolute; top:540px;z-index:101;right:0px;width:20%; height:30%;border-radius:20px;" >
			<input type="button" value="Del" id="func_delete_element" /><br />
			<input type="button" value="CxlSel" id="func_cxlselected_element" /><br />
			<input type="button" value="Copy" id="func_copy_element" /><br />
			<input type="button" value="Cut" id="func_cut_element" /><br />
			<input type="button" value="Paste" id="func_paste_element" /><br />
			<input type="button" value="Html" id="func_html_element" /><br />
			<textarea id="sandbox_screen" ></textarea>
			<div id="sandbox_hidden" style="display:none;" data-my-obj-id="-1"></div>
		</section>
		<section id="part_list_bar" class="menu_bar side_menu_bar float_menu header_menu" style="position:absolute; top:180px;z-index:101;right:0px;width:1280px;border-radius:20px;overflow:auto;" >
			<span>part_list<input id="part_list_reg" type="button" value="Reg"/><input id="part_list_name" type="text" value=""/>
				<select id="part_list_select"></select><input id="part_list_del" type="button" value="Del" style="float:right;" /></span>
			<ul id="part_list"></ul>
		</section>
		<section id="prop_list_bar" class="menu_bar side_menu_bar float_menu header_menu" style="position:absolute; top:360px;z-index:101;right:0px;width:1280px;border-radius:20px;overflow:auto;" >
			<span>prop_list<input id="prop_list_reg" type="button" value="Reg"/><input id="prop_list_name" type="text" value=""/>
				<select id="prop_list_select"></select><input id="prop_list_del" type="button" value="Del" style="float:right;" /></span>
			<ul id="prop_list"></ul>
		</section>
		<section id="basic_menu" class="menu_bar float_menu header_menu" style="position:absolute; top:50px;z-index:101;right:0px;width:1100px; height:7em;border-radius:20px;" >
			<label for="ValTag">Tag	 </label><input type="text" placeholder="tag tag*num like div>div*3" id="ValTag" class="autoExtend" style="ime-mode:disabled;" value="table_cross_header($a 5 =,6,$a 4 -)" /><br />
			<input type="hidden" id="part_list_input" class="json_val" value="" />
			<label for="ValArrayJSON">vals	</label><input type="text" placeholder="val array JSON" id="ValArrayJSON" class="autoExtend" style="width:15em" value="test" /><br />
			<input type="hidden" id="prop_list_input" class="json_val" value="" />
			<input type="button" class="menu_button" value="Ins" id="func_insert_element" /><input type="button" class="menu_button" value="Reg" id="FuncRegElement" />
		</section>
		<footer style="position:fixed; bottom:0px;">
			<section id="footer_menu_bar" class="menu_bar" style="position:fixed;bottom:0px ;left: 0px ;z-index:101; width:100% " >
				<input type="button" value="Select" id="func_select_element" />
				<label for="SelectedMyObjId">MyID</label><input type="text" id="SelectedMyObjId" class="autoExtend" style="width:15em; ime-mode:disabled;"/>
				<input type="button" value="UpSlctd" id="func_update_element" class="menu_button" />
				<label for="SelectedValTag">Tag</label><input type="text" id="SelectedValTag" readonly="readonly" class="autoExtend" style="width:3em; ime-mode:disabled;"/>
				<label for="SelectedValArrayJSON">vals</label><input type="text" id="SelectedValArrayJSON" class="" style="width:10em"/>
				<label for="SelectedValPropJSON" >props</label><input type="text" id="SelectedValPropJSON" class="autoExtend json_val" style="width:15em" value="{&quot;style&quot;:&quot&quot;}"	 />
			</section>
		</footer>
		<script>
			$(function(){
				var FUNC_ID = "HtmlDeveloping";
				var MY_STORAGE = constructor_storage(FUNC_ID);

				//複数形はsufixとして_sまたは､_s1. 多重配列は_s_sではなく_s2
				// Constatns
				var DEFAULT_GRID_SIZE = 32;
				var CLASS_SELECTED = 'objSelected';
				var CLASS_COPY = 'objCopy';
				var CLASS_CUT = 'objCut';
				var CLASS_HTMLIZE = 'htmlize';
				var CLASS_S = {"selected":CLASS_SELECTED, "copy":CLASS_COPY,"cut":CLASS_CUT,"htmlize":CLASS_HTMLIZE};
				
				var LAYER_SEP = '>';
				var LOOP_HLD = '*';
				var SBL_HLD = '+';
				var DEFAULT_WIDTH = 100;
				var DEFAULT_HEIGHT = 30;


				// Fields
				// func
				var func_name_s = ["copy","cut","paste","html","delete","insert","select","update","save","load","cxlselected"];
				var el_func_s = {};
				$.each(func_name_s,function(idx, name){
					el_func_s[name] = $('#func_'+name+'_element');
				});
									var el_func_cancel_selected = $('#func_cxlselected_element');
				var el_func_json_val = $('.json_val');

				// input area
				var el_val_tag = $('#ValTag');
				var el_val_array_json = $('#ValArrayJSON');

				var el_selected_val_id = $('#SelectedMyObjId');
				var el_selected_val_tag = $('#SelectedValTag');
				var el_selected_val_prop_json = $('#SelectedValPropJSON');
				var el_selected_val_array_json = $('#SelectedValArrayJSON');

				var el_some_list = {"part_list":$('#part_list'), "prop_list":$('#prop_list')};
				var el_some_input = {"part_list":$('#part_list_input'), "prop_list":$('#prop_list_input')};
				var el_some_func_suffix_s = ["reg","select","del","name"];


				// screen area
				var el_screen_area = $('#screen');
				var el_sandbox_screen_area = $('#sandbox_screen');
				var el_saved_serialized = $('#saved_serialized');
				var el_sandbox_hidden = $('#sandbox_hidden');
				var el_float_menu = $('.float_menu');

				var el_history = $('#history');

				// settings
				var tag_setting_s ={"input":{"require_s":["type"]}};
				var draggableとresizableが同時には正常に動かないためwrapするタグ = ["input"	,"select","textarea","ol" ,"ul"];
				var 必ず子要素のタグ = ["tbody","thead","tr","td","th","li","option"];
				var サイズを持たせないタグ = ["tbody","thead","tr"];
				var resizableのみ対象のタグ = [];
				var HTML5のタグには無い文字 = ["_","-","$",":",";","(",")","+","@","[","]","{","}","/",">","<",",",".","#","%","&","'",'"',"=","^","~"];

				// status , state
				var STATUS = getStatus();

				var not_click = false;

				// Implement_s
				function select_element(raw_select_my_obj_id, input_this){
					var _these;
					var selector = '';
					var no_aster = true;
					if(arguments.length >= 2){
						_these = input_this;
					}else{
						var idx_aster =	 raw_select_my_obj_id.lastIndexOf('_*')
							if(idx_aster > 0 && raw_select_my_obj_id.length - 2 === idx_aster){
								no_aster = false;
								selector = '*[data-my-obj-id^="'+raw_select_my_obj_id.substring(0,raw_select_my_obj_id.length - 1)+'"]';
							}else{
								selector = '*[data-my-obj-id="'+raw_select_my_obj_id+'"]';
							}
						//console.log('selector:'+selector);
						_these = $(selector, el_screen_area);
						//console.log('_this id:'+_this.data('my-obj-id'));
					}
					var length_these_minus_1 = _these.length - 1;
					_these.each(function(idx, in_this){
						var _this = $(in_this);
						var my_obj_id = _this.data('my-obj-id');
						//console.log('my-obj-id:'+my_obj_id);
						if(_this.data('my-selected') === false){
							_this.data('my-selected', true);
							_this.addClass(CLASS_SELECTED);

							if(length_these_minus_1 === idx){
								if( no_aster ){
									el_selected_val_id.val(my_obj_id);
								}
								var new_prop_s = _this.data('my-org-prop_s');
								new_prop_s.style = merge_css( new_prop_s.style, _this.attr('style') );
								var set_val ;
								if( length_these_minus_1 > 0){
									// 一度に複数選択された場合は 選択順の制御ができないため､valとして値の配列ではなく､updateを見越してnullを設定する
									set_val = 'null';
									el_selected_val_tag.val('');
								}else{
									set_val = new_prop_s.html;
									if( typeof set_val === 'undefined'){
										set_val = _this.text();
									}
									el_selected_val_tag.val(_this.get(0).localName);
								}
								el_selected_val_array_json.val(set_val).trigger('change');
								delete new_prop_s.html;
								el_selected_val_prop_json.val(JSON.stringify(new_prop_s)).trigger('change');
							}
						}else{
							_this.data('my-selected', false);
							_this.removeClass(CLASS_SELECTED);
						}
					});
				}

				/**
				 * 単一要素やJSONや､"hogehoge"などのraw_val_sに対応
				 * @return null => null
				 */
				function format_raw_val_s(raw_val_s){
					//console.log(raw_val_s);//TODO history機能の一部に
					var formatted_val_s = [""];
					if( raw_val_s != null && raw_val_s !== ''){
						raw_val_s = raw_val_s.trim();
						var first_char = raw_val_s[0];
						var last_char = raw_val_s[raw_val_s.length - 1];
						//console.log('first:'+first_char+', last:'+last_char);
						if( first_char === '[' && last_char === ']'){
							formatted_val_s =	 JSON.parse(raw_val_s);
						}else if(first_char === '"' && last_char === '"'){//[hoge]という文字列として渡したい場合の特殊事例ルート
							formatted_val_s[0] = raw_val_s.substring(1, raw_val_s.length - 1);
						}else{
							formatted_val_s[0] = raw_val_s;
						}
					}else if(raw_val_s === null){
						formatted_val_s = null;
					}
					return formatted_val_s;
				}
				/**
				* ignore_nest_parenthesis_s should be like  [["(",")"],["{","}"]]
				*	 nestを$nest$ など単階層同一文字もサポートする
				* @return 
				*/
				function split_ignore_nest(str,splitter, ignore_nest_parenthesis_s){
					var ign_pair_map = {};
					$.each(ignore_nest_parenthesis_s,function(idx, pair){
						ign_pair_map[pair[0]] = pair[1];
					});
					if(ignore_nest_parenthesis_s.indexOf(splitter) > -1) throw new Error('splitter '+splitter+' is in ignores');
					if(str == null || typeof str !== 'string')	throw new TypeError(str + ' is not valid.');
					var length_str = str.length;
					var result = [];
					var tmp_str = '';
					var nested_char_stack = [];
					var now_close_char = '';

					for(var i=0; i<length_str; ++i){
						var char = str[i];
						//nestを$nest$ など単階層同一文字もサポートするため
						if(char === now_close_char){
							tmp_str += char;
							now_close_char = nested_char_stack.pop();
							continue;
						}else if(ign_pair_map.hasOwnProperty(char)){
							tmp_str += char;
							nested_char_stack.push(now_close_char);
							now_close_char = ign_pair_map[char];
							continue;
						}else if(now_close_char !== ''){
							tmp_str += char;
							continue;
						}

						if(splitter === char){
							result.push(tmp_str);
							tmp_str = '';
						}else{
							tmp_str += char;
						}
					}
					if(tmp_str !== ''){
						result.push(tmp_str);
					}
					return result;
				}
				/**
				 * @param tag tag_2 tag_? tag1,tag2
				 * @return tag:[tag[tag[tag1, tag2],･･･len_val ],tag[same]]
				 */
				function format_raw_tag_s(raw_tag_s, _param_s){
//					console.log('format_raw_tag_s '+JSON.stringify(arguments));
					var param_s = {};
					var resolved_param_s = {};
					$.extend(true, param_s, _param_s);
					if( raw_tag_s == null || raw_tag_s.trim() === ''){
						console.log('Please input at least one tag');
						return ;
					}
					raw_tag_s = raw_tag_s.trim().replace(/\s+/g,' ').replace(/\s*,\s*/g,',');//複数連続スペースやカンマを一つに変換
//					console.log("raw_tag_s:"+JSON.stringify(raw_tag_s));
					var tag_s2 = [];
					$.each(raw_tag_s.split(LAYER_SEP), function(idx, tag){
						var trimed_tag = tag.trim();
						var pooled_tag_s = [];
						$.each(split_ignore_nest(trimed_tag,SBL_HLD,[["(",")"]]), function(cIdx, sbl){//sibiling
							var tag_num = split_ignore_nest(sbl.trim() , LOOP_HLD,[["(",")"]]);//h1タグがあり､tr3でtrを3回とはしづらいため､*を区切りとする仕様
							var loop_num = 1;
							if(tag_num.length > 1){
								var raw_num = tag_num[1];
//								console.log("loop_raw_num : "+raw_num);
								raw_num = param_s.hasOwnProperty(raw_num) ? param_s[raw_num] : raw_num;
								if( ! $.isNumeric(raw_num)){
//									console.log('tag param_s : '+ sbl + ' :: ' + JSON.stringify(param_s));
									var result = reverse_porlish_notation_logic(raw_num, param_s, resolved_param_s);
									loop_num = result[0];
									resolved_param_s = result[2];
//									console.log('formula : '+raw_num + ', loop num : '+loop_num + ', param_s : '+JSON.stringify(param_s) + ', resolved : '+JSON.stringify(resolved_param_s));
								}else{
									loop_num = parseInt(raw_num, 10);
								}
								if( loop_num < 0 ){
									throw new Error('loop num : '+loop_num +' should be >= 0 ');
								}
								//console.log('loop_num:'+loop_num);
							}
							var tag = tag_num[0];
							for(var l_idx=0; l_idx < loop_num; ++l_idx){
								pooled_tag_s.push(tag);
							}
						});
						tag_s2.push({"tag_s":pooled_tag_s});
					});
					//console.log('tag_s2:'+JSON.stringify(tag_s2));

					return tag_s2;
				}

				function format_raw_tag_holder_s(raw_tag_holder_s){
					var rtn_map = {};
					if(raw_tag_holder_s != null && typeof raw_tag_holder_s === 'string'){
						try{
							$.extend(rtn_map, JSON.parse(raw_tag_holder_s));
						}catch(e){}
					}
					return rtn_map;
				}

				var kept_element_s = ['class','style'];
				/**
				 * raw_prop_s allowed: {"single css selector":{"style":"hoge"},"single css selector"･･･} or {"style":"hoge"}
				 */
				function format_raw_prop_s(raw_prop_s){
					var prop_s = {};
					var rtn = {};
					try{
						//console.log(raw_prop_s);//TODO historyの一要素に
						if( raw_prop_s != null && raw_prop_s.trim() !== ''){
							prop_s = JSON.parse(raw_prop_s);
						}
						if( ! $.isPlainObject(prop_s) ){
							throw new TypeError('Error : props should be JSON Object!! ');
						}
						if(prop_s.hasOwnProperty('style') || prop_s.hasOwnProperty('class') || prop_s.hasOwnProperty('id')){
							rtn['*'] = prop_s;
						}else{
							for(var key in prop_s) if(prop_s.hasOwnProperty(key)){
								var tmp_prop_s = prop_s[key];
								if($.isPlainObject(tmp_prop_s)){
									var tag = key.trim();
									var selector_s;
									if(tag.indexOf(',') > -1){
										selector_s = tag.split(',');
									}else{
										selector_s = [tag];
									}
									for(var t=0; t < selector_s.length; ++t){
										var tmp_key = selector_s[t].trim();
										var kept = {};
										var tmp_kept_key = '';
										kept['style'] = {};//TODO Classにまとめよう･･･
										kept['class'] = '';
										if(rtn.hasOwnProperty(tmp_key)){
											for(var k=0; k < kept_element_s.length; ++k){
												tmp_kept_key = kept_element_s[k];
												if(rtn[tmp_key].hasOwnProperty(tmp_kept_key)){
													if(tmp_kept_key === 'style'){
														rtn[tmp_key][tmp_kept_key] = merge_css(rtn[tmp_key][tmp_kept_key], tmp_prop_s[tmp_kept_key]);
													}else if(tmp_kept_key === 'class'){
														rtn[tmp_key][tmp_kept_key] += ' ' + tmp_prop_s[tmp_kept_key];
													}
												}
											}
										}else{
											rtn[tmp_key] = {};
											$.extend(rtn[tmp_key],tmp_prop_s);
										}
									}
								}else{
									throw new TypeError('Error : props should be JSON Object!! ');
								}
							}
						}
						// Important position : absoluteが必須だが､ここで設定してもdraggableで上書きされるため無駄
					}catch(e){
						console.log(e);
					}
					//console.log('prop_s : '+JSON.stringify(rtn));
					return rtn;
				}

				/**
				 * 空のアプリケーションの基本オブジェクトを返す
				 */
				function my_apply(tag, prop_s, child_s){
					if(arguments.length === 0){
						return {"tag":"","prop_s":{"style":""},"child_s":[]};
					}
					if(typeof tag !== 'string'){
						throw new TypeError('tag is not a string.');
					}
					if( ! $.isPlainObject(prop_s) ){
						throw new TypeError('prop_s is not a plain object.');
					}
					if( ! $.isArray(child_s)){
						throw new TypeError('child_s is not an array.');
					}
					return { "tag":tag ,"prop_s":prop_s ,"child_s":child_s};
				}

				/**
				* 副作用 param_mapに
				*/
				function extract_param_from(_input_tag, param_map, parent_param_s){
//console.log('extract_param_from : '+JSON.stringify(arguments));
					var parenthesis_first = _input_tag.indexOf('(');
					var parenthesis_last = _input_tag.lastIndexOf(')');
					if( parenthesis_last < parenthesis_first || parenthesis_first * parenthesis_first < 0 ){
						throw new TypeError(_input_tag);
					}
					if(parenthesis_first !== -1 ){
						var raw_param = _input_tag.substring(parenthesis_first + 1, parenthesis_last).trim();
						var input_tag = _input_tag.substring(0, parenthesis_first) + _input_tag.substring(parenthesis_last + 1, _input_tag.length);
						var raw_param_split = raw_param.split(',');
						var length_raw_param_split = raw_param_split.length;
						var param_s = {};
						var resolved = {};
						$.extend(true, resolved, param_map, parent_param_s);
						for(var p=0; p<length_raw_param_split; ++p){
							var val_param_extract = reverse_porlish_notation_logic(raw_param_split[p], resolved,{});
//console.log('val_param_extract : '+JSON.stringify(val_param_extract));
							$.extend(resolved,val_param_extract[2]);
//TODO mod same param_map n
							param_s["$"+Object.keys(param_s).length] = val_param_extract[0];
						}
					}else{
						input_tag = _input_tag;
						param_s = {};
					}
//console.log('extract_param_from : ' + _input_tag + ' : ' + JSON.stringify([input_tag,param_s]));
					return [input_tag,param_s];
				}

				function extract_css_selector(input_tag, prop_map){
					var tag = null;
					var prop_s = {};
					var tag_id_cls = [];
					if(input_tag.indexOf('.') > -1){
						tag_id_cls = input_tag.split('.');//has class
					}else{
						tag_id_cls[0] = input_tag;
					}
					var tag_id = tag_id_cls[0];
					if(tag_id.indexOf('#') > -1){
						tag_id = tag_id.split('#');
						//TODO validation
						tag = tag_id[0];
						prop_s['id'] = tag_id[1];
					}else{
						tag = tag_id;
					}

					if(prop_map.hasOwnProperty('*')){
						$.extend(true,prop_s, prop_map['*']);
					}
					var tmp_cl_s = '';
					for(var cl=1; cl < tag_id_cls.length; ++cl){//0 := tag#id
						var tmp = tag_id_cls[cl];
						tmp_cl_s += tmp+' ';
						if(prop_map.hasOwnProperty( '.'+tmp)){
							prop_s['style'] = merge_css(prop_s['style'], prop_map['.'+tmp]['style']);
						}
					}
					prop_s['class'] = tmp_cl_s;
					if(tag.indexOf('=') > -1){
						//TODO []
					}
					return [tag, prop_s];
				}
				var 関数タグの対象外css_selector = ["id","class","type"];
				function check_input_data(tag, prop_s, infinite_loop_check){
					var length_forbidden = 関数タグの対象外css_selector.length;
					for(var i=0; i < length_forbidden; ++i){
						var tgt = 関数タグの対象外css_selector[i];
						if(prop_s.hasOwnProperty(tgt) && prop_s[tgt] != ''){
//							console.log('prop_s : ' + JSON.stringify(prop_s));
							alert("Sorry. parts in Tag don't support #.[]");
							throw new TypeError("Sorry. parts in Tag don't support #.[]");
						}
					}
					var index_tag = infinite_loop_check.indexOf(tag);
					if(index_tag > -1){
						alert('Error : '+tag+' : infinite loop detected !');
						throw new TypeError('Error : infinite loop !');
					}
				}

				function convert_lineardata_to_child_s(tag_s2, prop_map, val_s, part_map, param_map, parent_param_s, infinite_loop_check){
					var root_s = {"child_s":[],"last_child_s":[]};
					var parent_s = [root_s];
					var length_tag_s2 = tag_s2.length;
					// 初期サイズ決定のため､最下層から要素数とサイズを調査する
					var tag_size_s = [];
					var counter = 1;
					for(var i=length_tag_s2 - 1; i >= 0; --i){
						tag_size_s.push(counter);
						counter *= tag_s2[i].tag_s.length;
					};
					tag_size_s = tag_size_s.reverse();

					$.each(tag_s2, function(layer_idx, tag_s ){
						var new_parent_s = [];
						$.each(parent_s, function(pIdx, parent){
							for(var i=0; i < tag_s.tag_s.length; ++i){
								//tag_s.tag_s[i] :  tag#hoge.fuga.hage($col=4,5,0) //removed "*n"
								var input_tag_param_s = extract_param_from(tag_s.tag_s[i], param_map, parent_param_s);//副作用 param_mapへ
								var input_tag = input_tag_param_s[0];
								var param_s = input_tag_param_s[1];
								//css selector
								var tag_prop_s = extract_css_selector(input_tag, prop_map);
								var tag = tag_prop_s[0];
								var prop_s = tag_prop_s[1];
								//サイズ指定が無いと､選択不能な1pxサイズになるため､初期サイズを確保
								set_default_size(tag, prop_s, tag_size_s, layer_idx, i);

								if(part_map.hasOwnProperty(tag)){//part nest route
									//error check
									check_input_data(tag, prop_s, infinite_loop_check);
									infinite_loop_check.push(tag);//new
									var child_last = convert_lineardata_to_child_s(format_raw_tag_s(part_map[tag], param_s), prop_map, val_s, part_map, param_map, param_s, infinite_loop_check);
									infinite_loop_check[infinite_loop_check.indexOf(tag)] = "";//delete
									$.merge(parent.child_s, child_last.child_s);
									// child の一番下の子孫を新しい親とする
									$.merge(new_parent_s, child_last.last_child_s);//子供もやがて親になる･･･
								}else{
									$.each(HTML5のタグには無い文字, function(idx,forbidden_char){//TODO tagを分解して回した方が良いはず
										if(tag.indexOf(forbidden_char) > 0) throw new TypeError('Tag : '+tag+' does not belong to HTML5. ');
									});
									if(prop_map.hasOwnProperty(tag)){
										var kept_style = merge_css(prop_s.style, prop_map[tag].style);
										$.extend(prop_s, prop_map[tag]);
										prop_s.style = kept_style;
									}
									var child = my_apply(tag, prop_s,[]);
									if($.inArray(tag, draggableとresizableが同時には正常に動かないためwrapするタグ) > -1){
										if(! child.prop_s.hasOwnProperty('class')){	child.prop_s['class'] = '';	}
										child.prop_s['class'] += ' wrapped';
										child = my_apply('div',{"class":"wrapper","style":"background-color:transparent;padding:8px;"},[child] );//wrapper
									}
									parent.child_s.push(child);
									new_parent_s.push(child);//子供もやがて親になる･･･
								}
							}
						});
						parent_s = new_parent_s;
					});
					root_s.last_child_s = parent_s;
					return root_s;
				};

				/**
				 * 1pxサイズの操作不能オブジェクトを産まないために､
				 * Defaultサイズを設定する
				 * TODO ユーザー指定CSSの設定も調査対象にする
				 */
				function set_default_size(tag, temp_prop_s, tag_size_s, my_layer_idx, my_idx){
					if($.inArray(tag, サイズを持たせないタグ) > -1){
						if( typeof temp_prop_s.style === 'undefined'){
							temp_prop_s.style = 'z-index: '+get_z_index(my_layer_idx)+';';
						}else if( temp_prop_s.style.indexOf('z-index') === -1){
							temp_prop_s.style +='z-index:'+get_z_index(my_layer_idx)+';';
						}
						return;
					}
					var my_height = DEFAULT_HEIGHT + 25 * (tag_size_s.length - my_layer_idx);
					var my_width = (DEFAULT_WIDTH + 10 * (tag_size_s.length - my_layer_idx)) * tag_size_s[my_layer_idx];
					if( typeof temp_prop_s.style === 'undefined'){
						temp_prop_s.style = 'z-index: '+get_z_index(my_layer_idx)+';height:'+my_height+'px;width:'+my_width+'px;top:'+get_top(my_layer_idx)+'px;left:'+get_left(tag_size_s, my_layer_idx, my_idx)+'px;';
						//console.log('no style');
					}else {
						if( temp_prop_s.style.indexOf('z-index') === -1){
							temp_prop_s.style +='z-index:'+get_z_index(my_layer_idx)+';';
						}
						if( temp_prop_s.style.indexOf('width') === -1){
							temp_prop_s.style +='width:'+my_width+'px;';
						}
						if( temp_prop_s.style.indexOf('height') === -1){
							temp_prop_s.style +='height:'+my_height+'px;';
						}
						if( temp_prop_s.style.indexOf('top') === -1){
							temp_prop_s.style +='top:'+get_top(my_layer_idx)+'px;';
						}
						if( temp_prop_s.style.indexOf('left') === -1){
							temp_prop_s.style +='left:'+get_left(tag_size_s, my_layer_idx, my_idx)+'px;';
						}
					}
				};


				/**
				 * draggableやresizableを可能にする加工を施します｡
				 * tableやinputはdivでwrapするなど副作用があります｡
				 */
				function convert_data_to_display(raw_tag_s , raw_val_s , raw_prop_s, raw_tag_holder_s){
					console.log('convert_data_to_display '+JSON.stringify(arguments));
					try{
						// 引数 整形 処理
						var val_s = format_raw_val_s(raw_val_s);
						var length_val_s = val_s.length;
						var prop_map = format_raw_prop_s(raw_prop_s, length_val_s);
						var part_map = format_raw_tag_holder_s(raw_tag_holder_s);
						var linear_data = format_raw_tag_s(raw_tag_s, []);//return [[tag#hoge.fuga.hage($col=4,5,0)*3]]
						var param_map = {};
						var infinite_loop_check = [];//再帰を使用しているため無限ループや無限トランポリン対策
//console.log('start convert_lineardata_to_child_s');
						var root = convert_lineardata_to_child_s(linear_data, prop_map, val_s, part_map, param_map, [], infinite_loop_check);

						//値埋め
						if(val_s !== null){
							$.each(root.last_child_s, function(pIdx, parent){
								var setVal = val_s[parseInt(pIdx % val_s.length, 10)];//TODO valのループ仕様をDefaultは不自然だよね･･･
								//console.log('setVal:'+setVal);
								if( parent.tag === 'input'){
									parent.prop_s["value"] = setVal;
								}else{
									parent.prop_s["html"] = setVal;
								}
							});
						}
						delete root.last_child_s;

						return root;
					}catch(e){
						console.log(JSON.stringify(e));
						throw e;
					}
				}

				/**
				 * {"tag":"table","prop_s":{},"child_s":[{loop...}]}を再帰処理する
				 * データの二重加工を防ぐため､副作用処理一切禁止 そういった処理はconvert_to_displayに実装
				 * _this.tag === ''の場合､targetのpropを_thisのpropで更新する
				 * my_apply形式のデータが対象
				 */
				function display_onscreen(target_s, _this, is_resizable_draggable){
					if( typeof is_resizable_draggable === 'undefined' ){
						is_resizable_draggable = true;
					}
					var tag = _this['tag'];
					var prop_s = _this['prop_s'];
					var child_s = _this['child_s'];
					if( ! $.isArray(child_s)){
						console.log('Error this is not Array:'+JSON.stringify(child_s));
					}

					if(tag_setting_s.hasOwnProperty(tag)){
						var setting = tag_setting_s[tag];
						var require_s = setting['require_s'];
						$.each(require_s, function(layer_idx, require){
							if( ! prop_s.hasOwnProperty(require)){
								console.log("This "+tag+" tag requires a "+require+" prop.")
									throw new Error("This "+tag+" tag requires a "+require+" prop.");
							}
						});
					}

					//console.log('tag : '+tag);
					var length_target_s	 = target_s.length;
					for(var idx_tgt=0; idx_tgt < length_target_s; ++idx_tgt){
						var target = $(target_s[idx_tgt]);

						var work_jq = tag.length == 0 ? target : $('<'+tag+'>');
						for(var prop in prop_s)if(prop_s.hasOwnProperty(prop)){
							prop = prop.trim();
							if( prop === 'html'){//余計なお節介機能
								if( tag === 'input'){
									work_jq.val(prop_s[prop]);
								}else{
									work_jq.html(prop_s[prop]);
								}
								work_jq.data('my-obj-val', prop_s[prop]);
								work_jq.attr('data-my-obj-val', prop_s[prop]);
							}else{
								work_jq.attr(prop,prop_s[prop]);
							}
						}

						work_jq.data('my-org-prop_s', prop_s);
						if( work_jq === target){
							continue;
						}

						var my_obj_id = STATUS.getNewMyObjId();//TODO DIできるように
						var parent_id = target.attr('data-my-obj-id');
						var my_regular_id = parent_id+'_'+ my_obj_id;
						//console.log('parent my-obj-id:'+parent_id +', mine:'+my_regular_id);
						var user_input_id = work_jq.attr('id');
						if( typeof user_input_id === 'undefined' ){
							user_input_id = my_regular_id;
						}
						work_jq
							.addClass(CLASS_HTMLIZE)
							.attr('data-my-obj-id', my_regular_id)
							.data('my-obj-id', my_regular_id)
							.attr({"id":user_input_id})
							.on('click',function(ev){
								ev.stopPropagation();
								if( not_click ){
									//console.log(not_click);
									not_click = false;//TODO dragとclickが被るための対処策｡jquery内で解決策あれば･･･
									return;
								}
								//console.log(work_jq.attr('id')+':click');
								select_element(my_regular_id, work_jq);//TODO XXX

							});
						var length_child_s = child_s.length;
						for(var idx_child=0; idx_child < length_child_s; ++idx_child){
							display_onscreen([work_jq], child_s[idx_child]);
						}

						var resizableOption = {
							"stop":function(ev, ui){
								not_click = true;
							},
								"start":function(ev, ui){
									not_click = true;
								},
								"autoHide":true, "handles":"all", "cancel":"option","minWidth":"10","minHeight":"10"
						};
						var draggableOption ={"snap":".snap","snapTolerance":"8","distance":"4",
							"stop":function(ev, ui){
								not_click = true;
							},
							"start":function(ev, ui){
								not_click = true;
							}
						};
						var wrapped_is_true = typeof prop_s['class'] !== 'undefined' && prop_s['class'].indexOf('wrapped') !== -1;
						var i_am_wrapper = typeof prop_s['class'] !== 'undefined' && prop_s['class'].indexOf('wrapper') !== -1;
						if( i_am_wrapper ){
							resizableOption["alsoResize"] = '[data-my-obj-id^="'+my_regular_id+'_"]';
							resizableOption["stop"] = function(ev, ui){
								var tmp = $('*',work_jq);
								work_jq.height(tmp.height() + 10).width(tmp.width() + 10);
							};
							//console.log("also tag:"+tag+', parent:'+parent_id);
							//console.log("handle:"+JSON.stringify(draggableOption));
						}

						work_jq
							.data('my-selected',false)
							.appendTo( target );
						if( wrapped_is_true ){
							//nothing
						}else if(必ず子要素のタグ.indexOf(tag) > -1 ){
							//nothing
							work_jq.css({"top":"","left":"","position":"relative"});
						}else if(resizableのみ対象のタグ.indexOf(tag) > -1){

						}else{
							if( is_resizable_draggable ){
								work_jq
									.data('able-drag-resize',true)
									.attr('data-able-drag-resize',true)
									.draggable(draggableOption)
									.resizable(resizableOption)
									.data("resizable", resizableOption);
							}
							work_jq
								.addClass('snap')
								.css('position','absolute');
						}
					}
					$('td,th').resizable({"stop":function(ev, ui){
						not_click = true;
					},
						"start":function(ev, ui){
							not_click = true;
						},
						"autoHide":true, "handles":"all", "cancel":"option"});
				}

				function mthd_delete_element_impl(in_target_css){
					var target_css ;
					if( in_target_css !== null){
						target_css = in_target_css.trim();
					}else{
						return;
					}
					if(target_css[0] !== '.'){
						target_css = '.'+target_css;
					}
					$(target_css).each(function(){
						var _this = $(this);
						var my_regular_id = _this.data('my-obj-id');
						//console.log('delete my_regular_id:'+my_regular_id);
						$('[data-my-obj-id^="'+my_regular_id+'_"]', el_screen_area).empty().remove();
						_this.empty().remove();
					});
					//console.log('delete css:'+target_css);
				}

				function getStatus(){
					var obj_id = 1;
					return {
						"getNewMyObjId":function(){
							return obj_id++;
						}
					};
				}

				// screen util setting
				var default_width_setting_s = {};
				var el_auto_extend = $('.autoExtend');
				el_auto_extend.each(function(idx,obj){
					var _this = $(obj);
					default_width_setting_s[_this.attr('id')] = _this.width();
				});
				$('.menu_bar').on('keyup change mouseout','.autoExtend',function(){
					var _this = $(this);
					var length_val = 0;
					if(_this.get(0).tagName === 'textarea'){
						length_val = _this.html().length;
					}else{
						length_val = _this.val().length;
					}
					var length_for_eval = parseInt(length_val * 0.7, 10);
					var has_width = _this.css('width');
					var not_extended = typeof has_width === 'undefined' ? false : has_width !== '1000px';
					if(length_for_eval > 20 && not_extended){
						_this.animate({"width":"1000px"},200);
					}else if(! not_extended){
						//nothing
					}else{
						_this.animate({"width":default_width_setting_s[_this.attr('id')]},200);
					}
				});

				el_float_menu.resizable({"autoHide":true,"minWidth":80}).draggable();
				el_screen_area.on('click',function(){
					el_func_s['cxlselected'].trigger('click');
				});

				// menu func
				el_func_s['insert'].on('click', function(){
					try{
						var for_add_target_s = null;
						var el_selected_s = $('.'+CLASS_SELECTED);
						if( el_selected_s.length > 0){
							for_add_target_s = el_selected_s;
						}else{
							for_add_target_s = [el_screen_area];//追加先のデフォルトはscreen
						}
						var raw_tag_s = el_val_tag.val();
						if( typeof raw_tag_s !== 'undefined' && raw_tag_s != ''){
							var root = convert_data_to_display(raw_tag_s , el_val_array_json.val(), el_some_input['prop_list'].val(), el_some_input['part_list'].val() );

							//console.log('root:'+JSON.stringify(root.child_s));
							$.each(root.child_s, function(cIdx, child){
								display_onscreen(for_add_target_s, child);
							});
						}
					}catch(e){
						console.log(e);
					}
				});

				/**
				 *
				 */
				el_func_s['update'].on('click', function(){
					var target_s;
					var el_selected_s = $('.'+CLASS_SELECTED);
					if( el_selected_s.length > 0){
						target_s = el_selected_s;
					}else{
						return;
					}
					//console.log('target_s:'+JSON.stringify(target_s));
					var raw_val_s = el_selected_val_array_json.val();
					var func_val = null;
					var length_val_s = 1;
					if( raw_val_s !== null){
						raw_val_s = raw_val_s.trim();
					}
					if(raw_val_s === 'null'){
						raw_val_s = [null];
						func_val = do_void;
					}else if(raw_val_s === '"null"'){
						raw_val_s = ['null'];
					}else if( raw_val_s[0] === '[' && raw_val_s[raw_val_s.length - 1] === ']'){
						raw_val_s = JSON.parse(raw_val_s);
						length_val_s = raw_val_s.length;
					}else{
						raw_val_s = [raw_val_s];
					}

					var prop_s = JSON.parse( el_selected_val_prop_json.val() );
					if( ! $.isPlainObject(prop_s)){
						throw new TypeError('prop is not JSON style.');
					}

					$.each(target_s, function(idx, _target){
						var target = $(_target);
						target.children
						//val
						var tag = target.get(0).localName;
						//console.log('tag name : '+ tag);
						if( func_val !== null){
							// do nothing
						}else if( tag === 'input'){
							func_val = call_val;
						}else{
							func_val = call_safe_html;
						}
						//console.log('raw_val_s : '+JSON.stringify(raw_val_s));
						func_val(target, raw_val_s[parseInt(idx % length_val_s, 10)] );
						//prop
						var org_prop_s = target.data('my-org-prop_s');
						for( var p_key in prop_s){
							var val = prop_s[p_key];
							if( typeof val === 'undefined' || val == null || val == ''){
								continue;
							}
							if( p_key !== 'style' && p_key !== 'class' && p_key !== 'html'){
								target.attr(p_key, val);
								org_prop_s[p_key] = val;
							}else if( p_key === 'class'){
								var p_class = prop_s['class'].trim();
								if(p_class[0] === '-'){
									target.removeClass( p_class.substring(1) );
								}else if(p_class[0] === '+'){
									target.addClass( p_class.substring(1) );
								}else{
									//target.addClass( p_class );
								}
								org_prop_s['class'] = target.attr('class');
							}else{
								var val = merge_css( target.attr('style'), prop_s.style );
								target.attr('style', val);
								org_prop_s['style'] = val;
							}
						}
						target.data('my-org-prop_s', org_prop_s);
					});
				});

				el_func_s['select'].on('click', function(){
					var my_regular_id = el_selected_val_id.val();
					select_element(my_regular_id);
				});
				
				var copy_cut_func_s = ["copy","cut"];
				/**
				 * copy : no recursive , mono layer
				 */
					$.each(copy_cut_func_s,function(idx, name){
						el_func_s[name].on('click', function(){
							try{
								$('.'+CLASS_SELECTED).toggleClass(CLASS_S[name]);
							}catch(e){
								console.log(e);
							}
						});
					});
						
				/**
				 * paste
				 */
				el_func_s['paste'].on('click', function(){
					try{
						var added_target_s = null;
						var el_selected_s = $('.'+CLASS_COPY + ', .'+CLASS_CUT);
						if( el_selected_s.length > 0){
							added_target_s = el_selected_s;
						}else{
							added_target_s = [el_screen_area];//追加先のデフォルトはscreen
						}
//TODO tmp copy impl
						var root = convert_data_to_display( el_selected_val_tag.val()
								, el_selected_val_array_json.val(), el_selected_val_prop_json.val(), {});
						$.each(root.child_s, function(cIdx, child){
							display_onscreen([el_screen_area], child);
						});
					}catch(e){
						console.log(e);
					}
				});

				el_func_s['html'].on('click',function(){
					var raw_child = el_saved_serialized.val();
					var parsed = JSON.parse(raw_child);
					if( ! $.isArray(parsed)){
						parsed = [parsed];
					}
					var len_parsed = parsed.length;
					el_sandbox_hidden.empty();
					for(var i=0; i < len_parsed; ++i){
						display_onscreen(el_sandbox_hidden, parsed[i]);
					}
					//console.log('destroy len:'+$('[data-able-drag-resize="true"]',el_sandbox_hidden).length);
					var target_s = $('[data-able-drag-resize="true"]',el_sandbox_hidden);
					target_s.draggable('destroy').resizable('destroy');
					target_s.each(function(idx, _target){
						var target = $(_target);
						target
							.removeData('able-drag-resize').removeAttr('data-able-drag-resize')
					});
					var output_html = el_sandbox_hidden.html();
					//output_html = output_html.replace(/></g,'>\n<');
					console.log('output html size : '+output_html.length);
					el_sandbox_screen_area.html(output_html);
				});

				el_func_s['delete'].on('click', function(){
					//console.log("delete");
					mthd_delete_element_impl(CLASS_SELECTED);
				});

				el_func_s['cxlselected'].on('click', function(){
					$('.'+CLASS_SELECTED).each(function(){
						$(this).removeClass(CLASS_SELECTED);
					});
				});


				var history_counter = MY_STORAGE.keys(true).length;
				function init_save_history(){
					var appender = '';
					var keys = MY_STORAGE.keys(true);
					for(var i=0; i < keys.length; ++i){
						appender = '<option value="'+keys[i]+'">'+keys[i]+'</option>' + appender;
					}
					el_history.html(appender);
				}

				init_save_history();
				/**
				 * saveされる対象はdata-my-obj-idが付与されているもの
				 */
				el_func_s['save'].on('click', function(){
					var mother_id = el_screen_area.attr('data-my-obj-id');//attrだと文字, dataだとobj
					//console.log('mother id:'+mother_id);
					var stringified = get_tree_select_dom(mother_id).stringify();
					el_saved_serialized.val(stringified);
					MY_STORAGE
						.transaction()
						.remove('save_'+(history_counter-3))
						.replace('save_'+history_counter, stringified)
						.commit();
					init_save_history();
				++history_counter;
				});

				el_func_s['load'].on('click', function(){
					var raw_child = el_saved_serialized.val();
					var parsed = [];
					try{
						parsed = JSON.parse(raw_child);
					}catch(e){
						console.log(e.message);
						alert('Error : check console log');
						return;
					}
					if( ! $.isArray(parsed)){
						parsed = [parsed];
					}
					var len_parsed = parsed.length;
					for(var i=0; i < len_parsed; ++i){
						display_onscreen(el_screen_area, parsed[i]);
					}
				});

				el_func_json_val.on('change', function(){
					var _this = $(this);
					try{
						if( typeof JSON.parse(_this.val()) === 'object' ){
							_this.siblings('.menu_button').attr({"disabled":false});
						}else{
							_this.siblings('.menu_button').attr({"disabled":true});
						}
					}catch(e){
						_this.siblings('.menu_button').attr({"disabled":true});
					}
				});

				el_history.on('change',function(){
					var _this = $(this);
					var selected = _this.val();
					var saved = MY_STORAGE
						.select(selected);
					el_saved_serialized.val(saved);
				}).trigger('change');

				// Key bind
				$(document).on('keydown',function(_ev, _this ){
					switch(_ev.keyCode){
						case 27 ://ESC
							$('[class*="hide_mode_target"][data-fire-key-code="escape"]').toggle('clip',null,500);
							break;
						default :
							break;
					}
				});

				MY_STORAGE
					.transaction()
					.ifelse(! MY_STORAGE.has("part_list")
							, ['replace',"part_list",JSON.stringify({"example":{"thead_th":"thead>tr>th*$0","tbody_th_td":"tbody>tr*$1>th+td*($0 1 -)","table_cross_header":"table>thead_th($0)+tbody_th_td($0,$1)"}})]
						, []
					)
					.ifelse(! MY_STORAGE.has("prop_list")
							, ['replace',"prop_list",JSON.stringify({"example":{"table":{"style":"border-collapse:collapse;background-color:white;table-layout:fixed;"},"td,th":{"style":"border:1px solid black;"},"th":{"style":"color:red;"}}})]
						,[]
					)
					.commit();

				//part_list, prop_list
				$.each(Object.keys(el_some_list), function(idx, some_key){
					var el_some = {};
					var length_el_some_func_suffix_s = el_some_func_suffix_s.length;
					for(var f=0; f < length_el_some_func_suffix_s; ++f){
						var suffix = el_some_func_suffix_s[f];
						el_some[suffix] = $('#'+some_key+'_'+suffix);
					}
					//pull down
					refresh_select_list(some_key, el_some.select);
					el_some.select.on('change',function(){
						var some_name = this.value;
						var list_s_in_storage = JSON.parse(MY_STORAGE.select(some_key));
						if(list_s_in_storage != null && typeof list_s_in_storage !== 'undefined'){
							var keys_list_s = Object.keys(list_s_in_storage);
							if(keys_list_s.length > 0){
								if( some_name == null || some_name == ''){
									some_name = keys_list_s[0]
								}
								el_some.name.val(some_name);
							}else{
								return false;
							}
							var list_in_storage = list_s_in_storage[some_name];
							if(typeof list_in_storage === 'undefined'){
								return false;
							}
						}else{
							return false;
						}

						var tmp_el_list = el_some_list[some_key];
						var tmp_el_input = el_some_input[some_key];
						tmp_el_list.empty();//clear
						$.each(Object.keys(list_in_storage), function(idx,key){
							new_empty_line(tmp_el_list, key, force_stringify(list_in_storage[key]));
						});
						// for new empty input
						new_empty_line(tmp_el_list);
						tmp_el_list.parent().height(tmp_el_list.height() + 100);

						tmp_el_list.on('change','input.key',function(){
							var pre_height = tmp_el_list.height();
							$('input.key', tmp_el_list).each(function(){
								var _this = $(this);
								if(_this.val().trim().length === 0){
									_this.parent().remove();
								}
							});
							new_empty_line(tmp_el_list);
							var added_height = tmp_el_list.height() - pre_height;
							var parent = tmp_el_list.parent();
							parent.height(parent.height() + added_height);
						});
						tmp_el_list.on('change','input',function(){
							tmp_el_input.val(force_stringify(collect_some_list(tmp_el_list)));
						});
						tmp_el_input.val(force_stringify(collect_some_list(tmp_el_list)));
					}).trigger('change');//end el_some.select

					el_some.reg.on('click',function(){
						var some_name = el_some.name.val();
						var tmp_el_list = el_some_list[some_key]; //TODO dupe
						var list_s_in_storage = JSON.parse(MY_STORAGE.select(some_key));
						list_s_in_storage[some_name] = collect_some_list(tmp_el_list);
						MY_STORAGE
							.transaction()
							.replace(some_key, JSON.stringify(list_s_in_storage))
							.commit();
						refresh_select_list(some_key, el_some.select);
					});

					el_some.del.on('click',function(){
						alert('now coding');
					});
				});

				function refresh_select_list(some_key, el_some_select){
					// creating option in select
					var list_s_in_storage = JSON.parse(MY_STORAGE.select(some_key));
					if(typeof list_s_in_storage === 'undefined' || list_s_in_storage == null){
						return;
					}
					var keys_list_s = Object.keys(list_s_in_storage);
					var length_keys_list_s = keys_list_s.length;
					el_some_select.empty();
					for(var i=0; i < length_keys_list_s; ++i){
						var val = keys_list_s[i];
						$('<option>').val(val).html(val).appendTo(el_some_select);
					}
					return list_s_in_storage;
				}

				function collect_some_list(parent_list){
					var input_val = {}
					$('li',parent_list).each(function(){
						var _this = $(this);
						var input_s = $('input',_this);
						var key = input_s[0].value;
						if(key != null && typeof key !== 'undefined' && key.length !== 0){
							input_val[input_s[0].value] = force_parse(input_s[1].value);
						}
					});
					return input_val;
				}

				function new_empty_line(parent, key, val){
					var new_li = $('<li>');
					var tmp = $('<input />').attr({"class":"key"}).css({"width":"10em"}).appendTo(new_li);
					if(typeof key !== 'undefined'){
						tmp.val(key);
					}
					tmp =	$('<input />').attr({"class":"autoExtend val"}).css({"width":"40em","ime-mode":"disabled"}).appendTo(new_li);
					if(typeof val !== 'undefined'){
						tmp.val(val);
					}
					new_li.appendTo(parent);
				}

				//Util
				function call_val(obj, set_val){
					obj.data('my-obj-val', set_val);
					obj.attr('my-obj-val', set_val);
					obj.val(set_val);
				}
				function call_html(obj, set_val){
					obj.data('my-obj-val', set_val);
					obj.attr('my-obj-val', set_val);
					obj.html(set_val);
				}
				function call_safe_html(obj, set_val){
					obj.data('my-obj-val', set_val);
					obj.attr('my-obj-val', set_val);
					var resizableOption = obj.data("resizable");
					var is_resizable = true;
					try{
						obj.resizable('destroy');
					}catch(e){
						is_resizable = false;
					}
					var _text = obj.text();
					var _html = obj.html().substring(_text.length);
					obj.html(set_val + _html);
					if( is_resizable){
						obj.resizable(resizableOption);
					}
				}
				function call_text(obj, set_val){
					obj.text(set_val);
				}
				function do_void(){}
				/**
				 * override
				 */
				function merge_css(){
					var pool = {};
					var length_arguments = arguments.length;
					for(var i=0; i < length_arguments; ++i){
						var raw = arguments[i];
						if(raw.hasOwnProperty('style')){
							raw = raw.style;
						}
						if( typeof raw !== 'string'){
							continue;
						}
						var raw_el_s = raw.split(';');
						var length_el_s = raw_el_s.length;
						for(var j=0; j < length_el_s; ++j){
							var key_val = raw_el_s[j].split(':');
							if( key_val.length >= 2){
								var key = key_val[0].trim();
								var val = key_val[1].trim();
								if( typeof val === 'undefined' || val == null || val == 'null'){
									continue;
								}
								pool[key] = val;
							}
						}
					}
					var rtn = '';
					for(var css_key in pool){
						rtn += css_key+':'+pool[css_key]+';';
					}
					return rtn;
				}
				//console.log('merge_css_test:'+merge_css({"style":"same0:0;same1:10;other:1"},"same2:11",{"style":"same0:2;"},"same1:100"));

				function force_stringify(obj){
					if($.isPlainObject(obj) || $.isArray(obj)){
						return JSON.stringify(obj);
					}else if(typeof obj === 'string'){
						return obj;
					}else{
						return obj.tostring();
					}
				}

				function force_parse(obj){
					if(typeof obj === 'string'){
						try{
							return JSON.parse(obj);
						}catch(e){
							return obj;
						}
					}else if($.isPlainObject(obj) || $.isArray(obj)){
						return obj;
					}else{
						return obj;
					}
				}

				function _tree(in_mother_id){
					var mother_id = in_mother_id;
					var pool = {};
					return {
						"upsert":function(my_obj_id, body){
							var parent_obj_id = my_obj_id.substring(0,my_obj_id.lastIndexOf('_'));
							var pooled_parent =	 pool[parent_obj_id];
							if( typeof pooled_parent === 'undefined'){
								var newer = my_apply();
								newer.child_s.push(body);
								pool[parent_obj_id] = newer;
							}else{
								pooled_parent.child_s.push(body);
							}

							var pooled_myself = pool[my_obj_id];
							if( typeof pooled_myself !== 'undefined'){
								var pre_child_s = pooled_myself.child_s;
								$.merge( body.child_s, pre_child_s);
							}
							pool[my_obj_id] = body;
						},
							"stringify":function(){
								var rtn = JSON.stringify(pool[mother_id].child_s);
								//console.log(rtn);
								return rtn;
							}
					};
				}

				function constructor_storage(FUNC_ID){
					var uncommit_pool = {};
					var is_locked = false;
					return {
						"raw":function(){
							var raw = localStorage[FUNC_ID];
							if(typeof raw === 'undefined'){
								raw = '{}';
							}
							return raw;
						},
							"transaction":function(){
								if(is_locked){
									throw new Error('transaction has opened.');
								}else{
									var raw = this.raw();
									try{
										uncommit_pool = JSON.parse(raw);
									}catch(e){
										console.log(e.message);
										localStorage[FUNC_ID] = '{}';
									}
									is_locked = true;
									return this;
								}
							},
							"commit":function(){
								localStorage[FUNC_ID] = JSON.stringify(uncommit_pool);
								is_locked = false;
								return this;
							},
							"close":function(){
								uncommit_pool = {};
								is_locked = false;
								return this;
							},
							"select":function(key){
								var str_key = ''+key;
								var pooled = uncommit_pool[str_key];
								if(typeof pooled === 'undefined'){
									var raw = localStorage[FUNC_ID];
									if(typeof raw === 'undefined'){
										return null;
									}
									var saved = raw[key];
									if(typeof saved === 'undefined'){
										return null;
									}else{
										return saved;
									}
								}else{
									return pooled;
								}
							},
							"replace":function(key, val){
								var str_key = ''+key;
								uncommit_pool[str_key] = val;
								return this;
							},
							"merge":function(key_val){
								$.extend(true, uncommit_pool, key_val);//deep copy
								return this;
							},
							"remove":function(key){
								if(typeof uncommit_pool[key] !== 'undefined'){
									delete uncommit_pool[key];
								}else{
									console.log('nokey : '+key);
								}
								return this;
							},
							"truncate":function(){
								delete localStorage[FUNC_ID];
							},
							"keys":function(is_true_storage){
								if( typeof is_true_storage === 'undefined' || is_true_storage === false){
									return Object.keys(uncommit_pool);
								}else if(is_true_storage === true){
									var rtn = Object.getOwnPropertyNames(JSON.parse(this.raw()));
									//console.log('keys : '+rtn);
									return rtn;
								}else{
									return [];
								}
							},
							"rollback":function(){
								is_locked = false;
								this.transaction();
								is_locked = true;
								return this;
							},
						"has":function(key){
							return null != this.select(key);
						},
						  "ifelse":function(bool, true_param_s, false_param_s){
								var func_name = null;
								var param_s = null;
								if(bool === true){
									param_s = arguments[1];
								}else if(bool === false){
									param_s = arguments[2];
								}else{
									throw new TypeError('func if param bool is required.');
								}
								param_s = if_nullOrUndef_then_return_init(param_s, []);
								if(param_s.length > 0){
									func_name = param_s.shift();
									this[func_name].apply(this, param_s);
								}
								return this;
							}
					};
				};

				function get_tree_select_dom(mother_id){
					var user_add_content_s = $('*[data-my-obj-id^='+mother_id+'_]', el_screen_area);
					var len_content_s = user_add_content_s.length;
					var tree = _tree(mother_id);
					//TODO save する root を自動取得 selected対応
					var root = my_apply();
					root.tag = 'section';//TODO
					tree.upsert(mother_id,root);

					for(var i=0; i < len_content_s; ++i){
						var target = my_apply();
						var content = user_add_content_s.get(i);
						var _content = $(content);
						var my_obj_id = _content.data('my-obj-id');

						target.tag = content.localName;
						target.prop_s.style = _content.attr('style');

						var raw_my_obj_val = _content.data('my-obj-val');
						var my_obj_val ;
						if(typeof raw_my_obj_val === 'undefined' || raw_my_obj_val == ''){
							if ( content.localName === 'input'){
								my_obj_val = _content.val();
							}else if(content.localName === 'textarea'){
								my_obj_val = _content.text();
							}else{
								my_obj_val = "";
							}
						}else{
							my_obj_val = raw_my_obj_val;
						}
						var new_prop_s = {};
						$.extend(true, new_prop_s,_content.data('my-org-prop_s'), target.prop_s);
						target.prop_s = new_prop_s;
						if( content.localName === 'input'){//TODO 関数化
							target.prop_s['value'] = my_obj_val;
						}else{
							target.prop_s['html'] = my_obj_val;
						}
						tree.upsert(my_obj_id, target);
					}
					return tree;
				};

				function get_z_index(my_layer_idx){
					return 110 + my_layer_idx;
				};
				function get_top(my_layer_idx){
					if( my_layer_idx === 0){
						return 100;
					}else{
						return 10 ;
					}
				};
				function get_left(tag_size_s, my_layer_idx, my_idx){
					if( my_layer_idx === 0){
						return 100;
					}else{
						return 10 + (DEFAULT_WIDTH + 12 * (tag_size_s.length - my_layer_idx) ) * (tag_size_s[my_layer_idx] * (my_idx));
					}
				};

				var OPERATOR_CHAR_S = ' +-*/%()=';
				var IDX_MULTI = OPERATOR_CHAR_S.indexOf('*');
				var IDX_PAREN = OPERATOR_CHAR_S.indexOf('(');
				var IDX_EQUAL = OPERATOR_CHAR_S.indexOf('=');
				var operator_s =[ //null
					,function(a0, a1){is_calcable(a0,a1); return a1 + a0;}
					,function(a0, a1){is_calcable(a0,a1); return a1 - a0;}
					,function(a0, a1){is_calcable(a0,a1); return a1 * a0;}
					,function(a0, a1){is_calcable(a0,a1); return a1 / a0;}
					,function(a0, a1){is_calcable(a0,a1); return a1 % a0;}
				];
				function is_calcable(a0, a1){
					if($.isNumeric(a0) && $.isNumeric(a1)){
						return ;
					}else{
						throw new TypeError(a0 + ' : ' + a1 + ' are not resolved ');
					}
				}
				function reverse_porlish_notation(formula, _param_s){
					var param_s = if_nullOrUndef_then_return_init(_param_s, {});
					return reverse_porlish_notation_logic(formula, param_s, {})[0];
				}
				function reverse_porlish_notation_logic(_formula, _param_s, _resolved_param_s){
//console.log('reverse_porlish_notation_logic : '+JSON.stringify(arguments));
					var param_s = {}; $.extend(true,param_s, _param_s);
					var resolved_param_s = {}; $.extend(true,resolved_param_s, _resolved_param_s);
					var formula = _formula;
					var _parent_counter = 0;
					if($.isArray(formula)){
						formula = formula.join(' ');
					}
					if(typeof formula === 'string'){
						formula = formula.replace(/\s+/g,' ').trim();
					}
					if(formula != null && typeof formula !== 'undefined'){
						var stack = [];
						var pool = '';
						var num = 0;
						var length_formula = formula.length;
						for(var i=0; i<length_formula; ++i){
							var c = formula.charAt(i);
							var op_idx = OPERATOR_CHAR_S.indexOf(c);
							if (op_idx === 0) {
								if(pool !== ''){
									pool = param_s.hasOwnProperty(pool) ? param_s[pool] : resolved_param_s.hasOwnProperty(pool) ? resolved_param_s[pool] : pool;
									if(pool === '+' || pool === '-'){//(+3 -1 +)への対応
										stack.push(operator_s[OPERATOR_CHAR_S.indexOf(pool)] (stack.pop(), stack.pop()));
									}else if(! $.isNumeric(pool) && pool.lastIndexOf('$',0) === 0){//var route
										stack.push(pool);
										pool = '';
									}else{
										num = parseInt(pool, 10);
										pool = '';
										stack.push(num);
									}
								}
							}else	if(IDX_MULTI <= op_idx && op_idx < IDX_PAREN 
											|| ((i+1 === length_formula || formula.charAt(i+1) === ' ') && 0 < op_idx && op_idx < IDX_MULTI)){//(+3 -1 +)への対応
								stack.push(operator_s[op_idx] (stack.pop(), stack.pop()));
							}else if( op_idx === IDX_PAREN){
								++i;
								++_parent_counter;
								var pool_formula = "";
								for(; i<length_formula; ++i){
									c = formula.charAt(i);
									if( c === '(') ++_parent_counter;
									if( c === ')') --_parent_counter;
									if(_parent_counter === 0){
										var result = reverse_porlish_notation_logic(pool_formula, param_s,resolved_param_s);
										param_s = result[1];
										resolved_param_s = result[2];
										stack.push(result[0]);
										break;
									}
									pool_formula += c;
								}
							}else if( op_idx === IDX_PAREN + 1){
								throw new TypeError("Error formula not closed ) : " + formula);
							}else if( op_idx === IDX_EQUAL ){
								var val = stack.pop();// 評価順に依存しないため
								var key = stack.pop();
								while(! $.isNumeric(val) && resolved_param_s.hasOwnProperty(val) ){
									val = resolved_param_s[val];
								}
								if($.isNumeric(key)){
									throw new TypeError('Error '+key+' is not var. val is ' + val);
								}
								resolved_param_s[key] = val;								
								stack.push(val);
							}else{
								pool += c;
							}
						}//end for
						if(pool != null && pool != ''){
							pool = param_s.hasOwnProperty(pool) ? param_s[pool] : resolved_param_s.hasOwnProperty(pool) ? resolved_param_s[pool] : pool;
							stack.push(pool);
						}
					}
					if(stack.length !== 1){
						console.log('resolved_param_s : '+JSON.stringify(resolved_param_s));
						console.log('stack : '+ JSON.stringify(stack));
						throw new Error("Error formula is illegal : " + formula + ' : param_s : ' + JSON.stringify(param_s));
					}
					var rtn = stack[0];
					if( ! $.isNumeric(rtn) ){
						throw new Error("Error var " + rtn + ' is not resolved ');
					}else{
						rtn = parseInt(rtn,10);
					}
//console.log('return reverse_porlish_notation_logic '+JSON.stringify([rtn,param_s,resolved_param_s]));
					return [rtn,param_s,resolved_param_s];
				}

				function if_nullOrUndef_then_return_init(param, init){
					if(typeof param === 'undefined' || param == null ){
						return init;
					}else{
						return param;
					}
				}
				console.log(reverse_porlish_notation('1 5 -') === -4);
				console.log(JSON.stringify(reverse_porlish_notation_logic("$a ($b 3 *) =",{"$b":2},{})));
				console.log(JSON.stringify(reverse_porlish_notation_logic("$c $a $b 4 * = =",{"$b":3},{})));
				console.log(JSON.stringify(reverse_porlish_notation_logic("$a $b 4 * = 4 *",{"$b":3},{})));
				console.log(reverse_porlish_notation('$0 $1 +', {"$0":1,"$1":3}) === 4);
				console.log(reverse_porlish_notation('4 (6 (3 $0 +) +) * 2 (1 $1 +) * /', {"$0":1,"$1":3}) === 5);

				console.log(reverse_porlish_notation('1 5 + 2 3 + *') === 30);
				console.log(reverse_porlish_notation('1 5 + 3 +') === 9);
				console.log(reverse_porlish_notation('1 5 + 2 4 + -') === 0);
				console.log(reverse_porlish_notation('1 6 * 2 1 * /') === 3);
				console.log(reverse_porlish_notation('4 (6 (3 1 +) +) * 2 (1 3 +) * /') === 5);
				console.log(reverse_porlish_notation('34') === 34);

				console.log(reverse_porlish_notation('($a 2 =)') === 2);

				console.log(split_ignore_nest('table>thead_th($col=$0)+tbody_th_td(($col -1 +),$row=$1)','+',[["(",")"]]));
				console.log(split_ignore_nest('Hello(world,!!)',',',[["(",")"]]));
				console.log(split_ignore_nest('true','',[]));
				console.log(reverse_porlish_notation_logic("$0",{"$0":3,"$1":6,"$2":2},{}));

			});
		</script>
	</body>
</html>

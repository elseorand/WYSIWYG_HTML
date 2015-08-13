$(function(){
    /**TODO
     * 1. undo / redo
     * 5. tree diagram
     * 7. position left,bottom,top,right
     * 9. include resource json
     * a. wizard
     */
    /**COMP
     * 3. grid 
     * 4. style editor
     * 6. css selector 
     * 8. style manager
     * 2. screen tab
     */
    var FUNC_ID = "HtmlDeveloping";
    var MY_STORAGE = constructor_storage(FUNC_ID);
    var MAX_SAVE_SLOT_S = 16;
    var MY_OBJ_SEP = '-';

    // Global vars : status , state
    var STATUS = getStatus();
    var not_click = false;
    var is_suspend = false;
    var page_s = {};

    //複数形はsufixとして_sまたは､_s1. 多重配列は_s_sではなく_s2
    // Constants
    var DEFAULT_GRID_SIZE = 32;
    var CLASS_SELECTED = 'objSelected';
    var CLASS_COPY = 'objCopy';
    var CLASS_CUT = 'objCut';
    var CLASS_HTMLIZE = 'htmlize';
    var CLASS_S = {"selected":CLASS_SELECTED, "copy":CLASS_COPY,"cut":CLASS_CUT,"htmlize":CLASS_HTMLIZE};
    var CLASS_ON_EDIT = 'objOnEdit';
    var CLASS_EDIT_DATA = 'objEditData';
    var CLASS_DRAG_RESIZE = 'objDraggableResizable';

    var LAYER_SEP = '>';
    var LOOP_HLD = '*';
    var SBL_HLD = '+';
    var DEFAULT_WIDTH = 100;
    var DEFAULT_HEIGHT = 30;

    var SVG_NS = 'http://www.w3.org/2000/svg';
    var XLink_NS = 'http://www.w3.org/1999/xlink';

    // mode
    var NMS_EDIT = '.edit';
    var MODE_EDIT = 'EditMode';
    // my events
    var MY_CLICK = 'click'+NMS_EDIT;
    var MY_CHANGE = 'change'+NMS_EDIT;
    var MY_KEYUP = 'keyup'+NMS_EDIT;
    var MY_MOUSEOUT = 'mouseout'+NMS_EDIT;
    var MY_INIT = FUNC_ID + 'INIT';

    // settings
    var tag毎の入力規則 ={"input":{"require_s":["type", "value"],"default":{"type":"text", "value":""}},"svg":{"require_s":["xmlns"],"default":{"xmlns":SVG_NS}}};
    var draggableとresizableが同時には正常に動かないためwrapするタグ = ["input","select","textarea","ol" ,"ul","svg"];
    var 必ず子要素のタグ = ["tbody","thead","tr","td","th","li","option"];
    var サイズを持たせないタグ = ["table","tbody","thead","tr"];
    var resizableのみ対象のタグ = [];
    var HTML5のタグには無い文字 = ["_","-","$",":",";","(",")","+","@","[","]","{","}","/",">","<",",",".","#","%","&","'",'"',"=","^","~"];
    var 直接文字編集可能タグ = ["input","textarea"];
    var 単一タグ = ["input","br","hr","img"];
    var 各タグ毎の初期サイズ = {"input":{"width":70,"height":30},"td":{"width":70,"height":30},"th":{"width":70,"height":30}};
    var 関数タグの対象外css_selector = ["id","class","type"];
    var HTML出力時に削除するAttr_s = ["data-my-htmlize-target","data-my-obj-id","data-my-obj-val","data-conns"];
    var HTML出力時に削除するclass_s = ["htmlize","snap","snap_border","data-conns","wrapped","wrapper","ui-resizable-autohide","ui-draggable","ui-draggable-handle","ui-resizable"];
    var position_relative禁止タグ = ["th","td"];//IE Chromeniにバグあり｡FirefoxはOK

    // util
    var el_func_json_val = $('.json_val');
    
    // main menu
    var el_basic_menu = $('body > #basic_menu');
    var el_basic_menu_operator = $('#basic_menu_operator', el_basic_menu);
    var el_basic_menu_forward = $('#basic_menu_forward', el_basic_menu)
	    .on(MY_INIT, function(){
		var _this = $(this);
		el_basic_menu.data('right', parseInt(el_basic_menu.css('right'), 10));
	    })
    	    .on(MY_CLICK, function(){
		var original = el_basic_menu.data('right');
		var btn_posi = parseInt(el_basic_menu_operator.css('left'), 10);
		if(btn_posi < 720){
		    var new_width = 480;
		    btn_posi += new_width;
		}
		el_basic_menu.css({"right":original+'px', "left":"auto", "width":"+="+new_width});
		el_basic_menu_operator.css('left', btn_posi);
	    }).trigger(MY_INIT);
    var el_basic_menu_backward = $('#basic_menu_backward', el_basic_menu)
    	    .on(MY_CLICK, function(){
		var original = el_basic_menu.data('right');
		var btn_posi = parseInt(el_basic_menu_operator.css('left'), 10);
		if(btn_posi > 0){
		    var new_width = 480;
		    btn_posi -= new_width;
		}
		el_basic_menu.css({"right":original+'px', "left":"auto", "width":"-="+new_width});
		el_basic_menu_operator.css('left', btn_posi);
	    });
    var el_header_menu_bar = $('#header_menu_bar');
    var el_val_tag = $('#ValTag', el_basic_menu);
    var el_del_val_tag = $('#delValTag', el_basic_menu).on(MY_CLICK, function(){
	el_val_tag.val('');
    });
    var el_val_array_json = $('#ValArrayJSON', el_basic_menu);
    var el_del_val_array_json = $('#delValArrayJSON', el_basic_menu).on(MY_CLICK, function(){
	el_val_array_json.val('');
    });
    var el_selected_val_tag = $('#footer_menu_bar > #SelectedValTag');
    var el_selected_val_prop_json = $('#footer_menu_bar > #SelectedValPropJSON');

    var el_some_key_s = ["part_list", "prop_list", "style_list"];
    var el_some_list = [];
    var el_some_input = [];
    var el_some_func_suffix_s = ["reg","select","del","name","new"];
    el_some_key_s.forEach(function(x,i,a){
	el_some_list[x] = $('#'+x);
	el_some_input[x] = $('#'+x+'_input');
    });
    var el_sandbox_style_screen_area = $('#sandbox_style', el_basic_menu);
    var el_saved_serialized = $('#header_menu_bar > #saved_serialized');
    var el_sandbox_hidden = $('header_menu_bar > #sandbox_hidden');
    var el_float_menu = $('.float_menu');
    var el_history = $('#history');
    var el_edit_mode = $('#'+MODE_EDIT);
    var el_sandobox_screen =  $('#sandobox_screen');
    var el_func_new_page_element = $('#func_new_page_element').on(MY_CLICK, function(){
	page = create_page(el_new_page_element.val());
    });
    var el_new_page_element = $('#new_page_element');
    
    // context menu
    var context_menu = $('#context_menu');
    var el_func_cancel_selected = $('#func_cxlselected_element', context_menu);
    var el_selector = $('#SelectedMyObjId', context_menu);
    var el_selected_val_array_json = $('#SelectedValArrayJSON', context_menu);

    // Fields
    // func
    var func_name_s = [
	{"name":"html", "label":"", "input":'', "style":""},
	{"name":"style", "label":"", "input":'', "style":""},
	{"name":"insert", "label":"Ins", "input":'', "style":"", "col2":false},
	{"name":"edit", "label":"Edit","input":'<span id="EditMode" style="margin-left:2em;"></span>', "style":"", "col2":false},
	{"name":"select", "label":"Sel", "input":'<select id="parent_list" style=""></select><input type="text" id="SelectedMyObjId" class="" style="width:13em; ime-mode:disabled;float:right;"/><br><input type="text" id="AppendCssSelector" class="" style="width:21em; ime-mode:disabled;margin-left:1em; float:right;" placeholder="append css selector" />', "style":"height:4em;", "col2":true},
	{"name":"update_var", "label":"UpVar", "input":'<input type="text" id="SelectedValArrayJSON" class="" style="width:10em"/>', "style":"", "col2":true},
	{"name":"update_prop", "label":"UpProp", "input":'', "style":"", "col2":false},
	{"name":"cxlselected", "label":"CxlSel", "input":'', "style":"", "col2":false},
	{"name":"copy", "label":"Cp", "input":'', "style":"", "col2":false},
	{"name":"cut", "label":"Mv", "input":'', "style":"", "col2":false},
	{"name":"paste", "label":"Paste", "input":'', "style":"", "col2":false},
	{"name":"delete", "label":"Del", "input":'', "style":"", "col2":false},
	{"name":"save", "label":"", "input":'', "style":""},
	{"name":"load", "label":"", "input":'', "style":""},
	{"name":"register_part", "label":"RegPart", "input":'', "style":"", "col2":false},
	{"name":"stop_dra_res", "label":"tglDr&Rs", "input":'', "style":"", "col2":false},
    ];

    //init
    // page
    var el_HtmlDeveloping = $('#HtmlDeveloping');
    var page;
    var el_func_s = {};
    (function(){
	context_menu.css({"left":0,"top":0,"position":"absolute","z-index":10000,"padding-left":"2.5em","display":"none"})
	    .addClass('shadow');
	page = create_page('Default');
	var child;
	var isNewChild = true;
	var li_s;
	func_name_s.forEach(function(obj,a){
	    if(obj.label === ''){
		el_func_s[obj.name] = $('#func_'+obj.name+'_element');
		return;
	    }
	    var _this = $('<input type="button" id="func_'+obj.name+'_element" value="'+obj.label+'" class="menu_button" style="display:none;">');
	    _this.appendTo(el_header_menu_bar);
	    el_func_s[obj.name] = _this;
	    if(isNewChild){
		child = $('<li style="clear:both;">');
		child.appendTo(context_menu); 
	    }
	    var defa_size = 10;
	    if(obj.col2){
		defa_size *= 2;
	    }
	    if(!obj.col2){
		isNewChild = !isNewChild;
	    }

	    var btn = $('<div>').attr("style", merge_css('float:left;width:'+defa_size+'em;height:2em;', obj.style));
	    child.append(btn
			 .append(obj.label)
			 .append(obj.input)
			 .css({"border-bottom":"1px dotted grey","padding":"2px","opacity":1,"user-select":"none"})
			 .hover(function(){
			     li_s.css({"opacity":0.4});
			     btn.parent().css({"opacity":1.0});
			 },function(){
			     li_s.css({"opacity":1.0});
			 })
			 .on(MY_CLICK,function(ev){
			     ev.stopPropagation();
			     el_func_s[obj.name].trigger(MY_CLICK);
			 }));
	});
	li_s = $(' > li', context_menu);
	//TODO まとめる
	el_sandobox_screen = $('#sandbox_screen');
	el_saved_serialized = $('#saved_serialized');
	el_sandbox_hidden = $('#sandbox_hidden');
	el_float_menu = $('.float_menu').resizable({"autoHide":true,"minWidth":80}).draggable();;
	el_history = $('#history');
	el_selected_val_array_json = $('#SelectedValArrayJSON')
	    .hover(function(){
		context_menu.is_close_menu = false;
	    },function(){
		context_menu.is_close_menu = true;
	    });
	el_edit_mode = $('#'+MODE_EDIT).html(is_suspend.toString());
	el_selector = $('#SelectedMyObjId').on(MY_CLICK, function(ev){
	    ev.stopPropagation();
	});
	context_menu.append_css_selector = $('#AppendCssSelector').on(MY_CLICK, function(ev){
	    ev.stopPropagation();
	});
	context_menu.parent_list = $('#parent_list').on(MY_CHANGE +' '+ MY_CLICK,function(ev, obj){
	    ev.stopPropagation();
	    var _this = myWrapElement(this);
	    el_selector.val(_this.val());
	    // el_func_s['cxlselected'].trigger(MY_CLICK); // 複数tableが選択し辛くなるため、無効化コメントアウト
	});
    })();

    function create_page(name){
	if(page_s.hasOwnProperty(name)){
	    console.log('There are the same name:' + name + ' .');
	    return page_s[name];
	}
	var _page = {};
	if(typeof page !== 'undefined' && page !== null){
	    page.screen.css({"display":"none"});
	}
	page_s['screen'+name] = _page;
	_page.screen = $('<section id="screen'+name+'" class="screen" style="position:absolute; top:0px;bottom:44px;z-index:100;background-color:LemonChiffon;width:100%; height:1440px;" data-my-obj-id="'+STATUS.getNewMyObjId()+'">');
	context_menu.is_close_menu = true;
	
	move_page_singleton(page, _page);
	_page.screen.on('contextmenu',function(ev){
	    console.log('context click' );
	    ev.preventDefault();
	    ev.stopPropagation();
	    context_menu.css({"left":ev.pageX - 50,"top":ev.pageY - 30,"display":""});
	}).on(MY_CLICK,function(ev){
	    if(context_menu.is_close_menu){
		context_menu.css({"display":"none"});
	    }
	    el_func_s['cxlselected'].trigger(MY_CLICK);
	});
	var _btn_name = name;
	$('<input class="func_scrn_change" type="button" value="'+_btn_name+'">').data('page', _page).appendTo(el_header_menu_bar);
	el_HtmlDeveloping.append(_page.screen);
	return _page;
    }
    function move_page_singleton(now, new_page){
    }

    el_header_menu_bar.on(MY_CLICK, '.func_scrn_change', function(){
	var _this = $(this);
	var _page = _this.data('page');
	if(page === _page){return;}
	move_page_singleton(page, _page);
	_page.screen.css({"display":""});
	var now_screen = page.screen.css({"display":"none"});
	page = _page;
    });

    // screen util setting
    var default_width_setting_s = {};
    var el_auto_extend = $('.autoExtend');
    el_auto_extend.each(function(idx,obj){
	var _this = $(obj);
	default_width_setting_s[_this.attr('id')] = _this.width();
    });

    $('.menu_bar').on(MY_KEYUP +' '+ MY_CHANGE +' '+ MY_MOUSEOUT,'.autoExtend',function(){//xxx
	var _this = myWrapElement(this);
	var length_val = 0;
	if(_this.get(0).localName === 'textarea'){
	    length_val = _this.html().length;
	}else{
	    length_val = _this.val().length;
	}
	var length_for_eval = parseInt(length_val * 1.2, 10);
	var has_width = _this.css('width');
	var not_extended = typeof has_width === 'undefined' ? false : has_width !== '1000px';
	if(length_for_eval > 20 && not_extended){
	    _this.animate({"width":"90em"},200);
	}else if(! not_extended){
	    //nothing
	}else{
	    _this.animate({"width":default_width_setting_s[_this.attr('id')]},200);
	}
    });

    // menu func
    el_func_s.insert.on(MY_CLICK, function(){
	try{
	    var for_add_target_s = null;
	    var el_selected_s = $('.'+CLASS_SELECTED, page.screen);
	    if( el_selected_s.length > 0){
		for_add_target_s = el_selected_s;
	    }else{
		for_add_target_s = [page.screen];//追加先のデフォルトはscreen
	    }
	    var raw_tag_s = el_val_tag.val();
	    if( typeof raw_tag_s !== 'undefined' && raw_tag_s != ''){
		var root = convert_data_to_display(raw_tag_s , el_val_array_json.val(), el_some_input.prop_list.val(), el_some_input.part_list.val() );
		$.each(root.child_s, function(cIdx, child){
		    display_onscreen(for_add_target_s, child);
		});
	    }
	    draw_arrow_s();
	}catch(e){
	    console.log(e);
	}
    });

    el_func_s.update_var.on(MY_CLICK, function(){
	var target_s = $('.'+CLASS_SELECTED, page.screen);
	if( target_s.length === 0){ return;}
	var raw_val_s = el_selected_val_array_json.val();
	var func_val = null;
	var length_val_s = 1;
	if( raw_val_s !== null){raw_val_s = raw_val_s.trim();}
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

	$.each(target_s, function(idx, _target){
	    var target = $(_target);
	    //val
	    var tag = target.get(0).localName;
	    if(target.hasClass('wrapper')){return true;}
	    if( func_val !== null){
		// do nothing
	    }else if( tag === 'input'){
		func_val = call_val;
	    }else{
		func_val = call_safe_text;
	    }
	    func_val(target, raw_val_s[parseInt(idx % length_val_s, 10)] );
	});
    });

    /**
     *
     */
    el_func_s.update_prop.on(MY_CLICK, function(){
	var target_s = $('.'+CLASS_SELECTED, page.screen);
	if( target_s.length === 0){ return;}

	var prop_s = JSON.parse( el_selected_val_prop_json.val() );
	if( ! $.isPlainObject(prop_s)){throw new TypeError('prop is not JSON style.');}

	$.each(target_s, function(idx, _target){
	    var target = $(_target);
	    //val
	    var tag = target.get(0).localName;
	    if(target.hasClass('wrapper')){return true;}
	    //prop
	    var org_prop_s = target.data('my-org-prop_s');
	    for( var _p_key in prop_s){
		var p_key = _p_key.toLowerCase();
		var val = prop_s[p_key];
		if( typeof val === 'undefined' || val == null || val === ''){continue;}
		if( p_key !== 'style' && p_key !== 'class' && p_key !== 'html'){
		    target.attr(p_key, val);
		    org_prop_s[p_key] = val;
		}else if( p_key === 'class'){
		    var p_class_s = val.trim().split(' ');
		    var new_org_class = '';
		    $.each(p_class_s,function(idx,p_class){
			if(p_class[0] === '-'){
			    target.removeClass( p_class.substring(1) );
			}else if(p_class[0] === '+'){
			    new_org_class += ' ' + p_class.substring(1) ;
			    target.addClass( p_class.substring(1) );
			}else{
			    new_org_class += ' ' + p_class;
			    target.addClass(p_class);
			}
		    });
		    org_prop_s['class'] = new_org_class.length > 1 ? new_org_class.substring(1) : new_org_class;
		}else if( p_key === 'style'){
		    var val = merge_css( target.attr('style'), prop_s.style );
		    target.attr('style', val);
		    org_prop_s['style'] = val;
		}else if( p_key === 'html'){
		    if(target.get(0).localName === 'input'){
			target.val(val);
		    }else{
			target.html(val);
		    }
		}
	    }
	    target.data('my-org-prop_s', org_prop_s);
	});
	draw_arrow_s();
    });

    el_func_s.select.on(MY_CLICK, function(){
	var my_selector = el_selector.val();
	var append_css_selector = context_menu.append_css_selector.val();
	select_element(true, my_selector, append_css_selector);
    });

    var 互いに排他の機能_s = ["copy","cut"];
    var 互いに排他機能のCLASSを含まないセレクタ = '';
    /**
     * copy : no recursive , mono layer
     */
    $.each(互いに排他の機能_s,function(idx, name){
	var now_class = CLASS_S[name];
	el_func_s[name].on(MY_CLICK, function(){
	    try{
		var new_targeted = $('.'+CLASS_SELECTED + 互いに排他機能のCLASSを含まないセレクタ);
		//TODO if hasClass('wrapped'), then cancel and select menu
		//新規選択分があれば､それのみを処理し､既存分は触らない
		if(new_targeted.length > 0){
		    new_targeted.removeClass(CLASS_SELECTED).addClass(now_class);
		}else{//新規選択分がなければ､全解除し選択状態に
		    $('.'+now_class).removeClass(now_class).addClass(CLASS_SELECTED);
		}
	    }catch(e){
		console.log(e);
	    }
	});
	互いに排他機能のCLASSを含まないセレクタ += ':not(.'+now_class+')';
    });

    /**
     * paste
     */
    el_func_s.paste.on(MY_CLICK, function(){
	try{
	    var added_target_s = null;
	    var el_selected_s = $('.'+CLASS_SELECTED + 互いに排他機能のCLASSを含まないセレクタ, page.screen);//xxx
	    var added_candidate_s;
	    if( el_selected_s.length > 0){
		added_candidate_s = el_selected_s;
	    }else{
		added_candidate_s = page.screen;//追加先のデフォルトはscreen
	    }
	    var len_added_candidate_s = added_candidate_s.length;
	    //TODO bug infinite loop
	    $.each( 互いに排他の機能_s,function(idx, name){
		var now_class = CLASS_S[name];
		$('.'+now_class).each(function(){//コピー元は全ページ対象
		    var _this = myWrapElement(this);
		    var my_obj_id = _this.attr('data-my-obj-id');
		    if(typeof my_obj_id !== 'undefined'){
			var root = get_child_tree_select_dom(my_obj_id).raw()[my_obj_id];
			var target_s = added_candidate_s.filter(function(){
			    var rtn = null;
			    try{
				var _this = $(this);
				var another_id = _this.attr('data-my-obj-id');
				if(typeof another_id !== 'undefined'){
				    rtn = ! (another_id+'-').startsWith(my_obj_id+'-');
				}
				if(rtn === false){console.log('ウロボロス検知 :' + my_obj_id +' : '+another_id);}
			    }catch(e){console.log(e);}
			    return rtn;
			});
			if(target_s.length > 0){
			    if(name === 'cut') {mthd_delete_element_by_my_id(my_obj_id);}//TODO
			    display_onscreen(target_s, root);
			}
		    }
		});
	    });
	    draw_arrow_s();
	}catch(e){
	    console.log(e);
	}
    });

    el_func_s.html.on(MY_CLICK,function(){
	//var raw_child = el_saved_serialized.val();
	var parsed = getSelectedOrRoot();
	if( ! $.isArray(parsed)){
	    parsed = [parsed];
	}
	var len_parsed = parsed.length;
	el_sandbox_hidden.empty();
	for(var i=0; i < len_parsed; ++i){
	    display_onscreen(el_sandbox_hidden, parsed[i]);
	}

	var target_s = $('[data-my-htmlize-target="true"]',el_sandbox_hidden);
	target_s.each(function(idx, _target){
	    var target = $(_target);
	    try{target.draggable('destroy');}catch(e){/*kill error*/};
	    try{target.resizable('destroy');}catch(e){/*kill error*/};
	    HTML出力時に削除するAttr_s.forEach(function(attr,i,a){
		//NS objectの処理もあるため、jQueryは使用しない
		_target.removeAttribute(attr);
	    });
	    HTML出力時に削除するclass_s.forEach(function(cl,i,a){
		_target.classList.remove(cl);
	    });
	});

	var head_src = '';
	try{
	    head_src = $('head').html();
	    var output_html = el_sandbox_hidden.html();
	    output_html = '<!doctype html><html><head>' + head_src + '</head><body>' + output_html + '</body></html>';
	    output_html = output_html.replace(/></g,'>\n<').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	    el_sandobox_screen.empty();
	    $('<textarea rows="1" style="height:1em;width:8em;">').html(output_html).appendTo(el_sandobox_screen);
	}catch(e){console.log('e '+e);};
    });

    var el_style = $('style#MyEditableStyle');
    
    el_func_s.style
	.on(MY_CLICK, function(){
	    el_some_list.style_list.empty();
	    var style_html = el_sandbox_style_screen_area.val().trim();
	    if(typeof style_html !== 'undefined' && style_html.length > 0){
		el_style.html(style_html);
	    }
	    style_html = style_html.replace(/\n/g, '');
	    var css_keyval = style_html.split('}');
	    css_keyval.forEach(function(x,i,a){
		var k_v = x.split('{');
		if(k_v.length === 2){
		    new_empty_line(el_some_list.style_list, k_v[0].trim(), k_v[1].trim(), false);
		}
	    });
	})
	.on(MY_INIT, function(){
	    el_sandbox_style_screen_area.val(el_style.html().replace(/></g,'>\n<').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
	})
	.trigger(MY_INIT);
    
    el_func_s.delete.on(MY_CLICK, function(){
//	mthd_delete_element_impl(CLASS_SELECTED+':not(.wrapped)');//TODO
	mthd_delete_element_impl(CLASS_SELECTED);//TODO
    });

    el_func_s.cxlselected.on(MY_CLICK, function(){
	$('.'+CLASS_SELECTED, page.screen).each(function(){
	    removeSelected(myWrapElement(this));
	});
    });

        // Implement_s
    function select_element(keep_raw_selector, raw_selector, append_css_selector){
	var _these;
	var selector = '';
	var type_raw_selector = typeof raw_selector;
	if(type_raw_selector === undefined){
	    return;
	}else if(type_raw_selector !== 'string'){
	    _these = raw_selector;
	}else{
	    if(raw_selector.startsWith(page.screen.data('my-obj-id')+'-')){//case my_id
		var idx_aster = raw_selector.lastIndexOf(MY_OBJ_SEP+'*');
		if(idx_aster > 0 && raw_selector.length - 2 === idx_aster){
		    selector = '*[data-my-obj-id^="'+raw_selector.substring(0,raw_selector.length - 1)+'"]';
		}else{
		    selector = '*[data-my-obj-id="'+raw_selector+'"]';
		}
	    }else{//case css
		selector = raw_selector;
	    }
	    selector = selector.trim();
	    if(typeof append_css_selector === 'string' && append_css_selector !== '' ){
		selector += ' ' + append_css_selector;
	    }
	    _these = $(selector +'.htmlize', page.screen);
	}
	var length_these_minus_1 = _these.length - 1;
	_these.each(function(idx, in_this){
	    var _this = myWrapElement(in_this);
	    if(_this.hasClass(CLASS_COPY) || _this.hasClass(CLASS_CUT)){return ;}//TODO List
	    var my_obj_id = _this.data('my-obj-id');
	    var is_my_selected = _this.data('my-selected');
	    if(typeof is_my_selected === 'undefined' || is_my_selected === false){
		addSelected(_this);
		if(length_these_minus_1 === idx){
		    if( ! keep_raw_selector ){
			el_selector.val(my_obj_id);
		    }
		    var new_prop_s = if_nullOrUndef_then_return_init(_this.data('my-org-prop_s'),{"style":""});
		    new_prop_s.style = merge_css( new_prop_s.style, _this.attr('style') );
		    var set_val ;
		    if( length_these_minus_1 > 0){
			// 一度に複数選択された場合は 選択順の制御ができないため､valとして値の配列ではなく､updateを見越してnullを設定する
			set_val = 'null';
			el_selected_val_tag.val('');
		    }else{
			set_val = new_prop_s.html;
			if( typeof set_val === 'undefined'){
			    set_val = _this.data('my-obj-val');
			}
			el_selected_val_tag.val(_this.get(0).localName);
		    }
		    el_selected_val_array_json.val(set_val).trigger(MY_CHANGE);
		    delete new_prop_s.html;
		    el_selected_val_prop_json.val(JSON.stringify(new_prop_s)).trigger(MY_CHANGE);
		}
	    }else{
		removeSelected(_this);
	    }
	});
    }

    function removeSelected(jq_tgt){
	var adjust_width = jq_tgt.data("adjust-width");
	var adjust_height = jq_tgt.data("adjust-height");
	jq_tgt
	    .data('my-selected', false)
	    .css({"width":"+="+adjust_width, "height":"+="+adjust_height})
	    .removeClass(CLASS_SELECTED)
	;
	return jq_tgt;
    }
    function addSelected(jq_tgt){
	var adjust_width = - jq_tgt.outerWidth() ;//for grid mode adjust
	var adjust_height = - jq_tgt.outerHeight() ;//for grid mode adjust
	jq_tgt
	    .data("my-selected", true)
	    .addClass(CLASS_SELECTED);
	adjust_width = jq_tgt.outerWidth()  + adjust_width;//for grid adjust
	adjust_height = jq_tgt.outerHeight() + adjust_height;//for grid adjust
	jq_tgt
	    .css({"width":"-="+adjust_width, "height":"-="+adjust_height})
	    .data({"adjust-width": adjust_width, "adjust-height": adjust_height});
	return jq_tgt;
    }

    /**
     * 単一要素やJSONや､"hogehoge"などのraw_val_sに対応
     * @return null => null
     */
    function format_raw_val_s(raw_val_s){
	var formatted_val_s = [];
	if(typeof raw_val_s !== undefined && raw_val_s != null && raw_val_s !== ''){
	    raw_val_s = raw_val_s.trim();
	    var first_char = raw_val_s[0];
	    var last_char = raw_val_s[raw_val_s.length - 1];
	    if( first_char === '[' && last_char === ']'){
		formatted_val_s =	 JSON.parse(raw_val_s);
	    }else if(first_char === '"' && last_char === '"' || first_char === "'" && last_char === "'"){//[" h o g e "]という文字列として渡したい場合の特殊事例ルート
		formatted_val_s[0] = raw_val_s.substring(1, raw_val_s.length - 1);
	    }else{
		formatted_val_s = raw_val_s.split(' ');
	    }
	}else if(raw_val_s === null){
	    formatted_val_s = null;
	}
	return formatted_val_s;
    }
    /**
     * ignore_nest_parenthesis_s should be like  [["(",")"],["{","}"]]
     *	 nestを$nest$ など単階層同一文字もサポートする
     * @return B
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
    function format_raw_tag_s(raw_tag_s, _param_s, length_val_s){
	var param_s = {};
	var resolved_param_s = {};
	$.extend(true, param_s, _param_s);
	if( raw_tag_s == null || raw_tag_s.trim() === ''){
	    console.log('Please input at least one tag');
	    return ;
	}
	raw_tag_s = raw_tag_s.trim().replace(/\s+/g,' ').replace(/\s*,\s*/g,',');//複数連続スペースやカンマを一つに変換
	var tag_s2 = [];
	$.each(raw_tag_s.split(LAYER_SEP), function(idx, tag){
	    var trimed_tag = tag.trim();
	    var pooled_tag_s = [];
	    $.each(split_ignore_nest(trimed_tag,SBL_HLD,[["(",")"]]), function(cIdx, sbl){//sibiling
		var tag_num = split_ignore_nest(sbl.trim(), LOOP_HLD,[["(",")"]]);//h1タグがあり､tr3でtrを3回とはしづらいため､*を区切りとする仕様
		var loop_num = 1;
		if(tag_num.length > 1){
		    var raw_num = tag_num[1];
		    raw_num = param_s.hasOwnProperty(raw_num) ? param_s[raw_num] : raw_num;
		    if( ! $.isNumeric(raw_num)){
			if( raw_num === '?' ){
			    raw_num = length_val_s;
			    loop_num = raw_num;
			}else{
			    var result = reverse_porlish_notation_logic(raw_num, param_s, resolved_param_s);
			    loop_num = result[0];
			    resolved_param_s = result[2];
			}
		    }else{
			loop_num = parseInt(raw_num, 10);
		    }
		    if( loop_num < 0 ){
			throw new Error('loop num : '+loop_num +' should be >= 0 ');
		    }
		}
		var tag = tag_num[0];
		//[] と {}の処理
		for(var l_idx=0; l_idx < loop_num; ++l_idx){
		    pooled_tag_s.push(tag);
		}
	    });
	    tag_s2.push({"tag_s":pooled_tag_s});
	});

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
	    if( raw_prop_s != null && raw_prop_s.trim() !== ''){prop_s = JSON.parse(raw_prop_s);}
	    if( ! $.isPlainObject(prop_s) ){throw new TypeError('Error : props should be JSON Object!! ');}
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
	return rtn;
    }

    /**
     * 空のアプリケーションの基本オブジェクトを返す
     */
    function my_apply(tag, prop_s, child_s){
	if(arguments.length === 0){return {"tag":"","prop_s":{"style":""},"child_s":[]};}
	if(typeof tag !== 'string'){throw new TypeError('tag is not a string.');}
	if( ! $.isPlainObject(prop_s) ){throw new TypeError('prop_s is not a plain object.');}
	if( ! $.isArray(child_s)){throw new TypeError('child_s is not an array.');}
	return { "tag":tag ,"prop_s":prop_s ,"child_s":child_s};
    }

    /**
     * input_tagから外周の()を一つ抽出し解析
     * 副作用 param_mapに
     * []内の()はpseudo-class用(e.g :not())として処理しない
     */
    function extract_param_from(_input_tag, param_map, parent_param_s){
	_input_tag = _input_tag.trim();
	var length_input_tag = _input_tag.length;
	var parenthesis_first = -1;
	var parenthesis_last = -1;
	var nest_counter = 0;
	var parenthesis_counter = 0;
	for(var idx=0; idx < length_input_tag; ++idx){
	    var c = _input_tag[idx];
	    if(c === '[') ++nest_counter;
	    if(c === ']') --nest_counter;
	    if(c === '(' && nest_counter === 0){
		if(parenthesis_first === -1){parenthesis_first = idx;}
		++parenthesis_counter;
	    }
	    if(c === ')' && nest_counter === 0){
		--parenthesis_counter;
		if(parenthesis_counter === 0){parenthesis_last = idx;}
	    }
	}
	if( parenthesis_last < parenthesis_first 
	    || parenthesis_first * parenthesis_first < 0 ){
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
		$.extend(resolved,val_param_extract[2]);
		//TODO mod same param_map n
		param_s["$"+Object.keys(param_s).length] = val_param_extract[0];
	    }
	}else{
	    input_tag = _input_tag;
	    param_s = {};
	}
	return [input_tag,param_s];
    }

    function analisys_css_selector(input_tag){
	input_tag = input_tag.trim();
	var length_input_tag = input_tag.length - 1;
	var pool = '';
	var kept_char = '';
	var tmp_id = '';
	var tmp_cl_s = [];
	var tmp_attr_split = null;
	var tmp_attr_s = {};
	var nest_counter = 0;
	for(var ic=0; ic <= length_input_tag; ++ic){
	    var c = input_tag[ic];
	    if(c === ']')	--nest_counter;
	    if( nest_counter === 0 && ( c === '#' || c === '.' || c === '[' || c === ']' || ic === length_input_tag)){
		if(ic === length_input_tag && c !== ']'){
		    pool += c;
		}
		if( kept_char === ''){
		    tag = pool;
		}else if( kept_char === '#'){
		    if( tmp_id !== '') throw new TypeError('Error '+input_tag+' has some #.');
		    tmp_id = pool;
		}else if( kept_char === '.' ){
		    tmp_cl_s.push(pool);
		}else if( kept_char === '[' ){
		    if( nest_counter === 0 && c !== ']' ){throw new TypeError('Error '+input_tag+' is not closed [] ');}
		    if(nest_counter !== 0){
			pool += c;
			continue;
		    }
		    tmp_attr_split = split_ignore_nest(pool.trim() , '=',[["[","]"]]);
		    tmp_attr_s[tmp_attr_split[0].trim()] = tmp_attr_split[1].trim();
		}
		pool = '';
		kept_char = c;
	    }else{
		pool += c;
	    }
	    if(c === '[')	++nest_counter;
	}
	return {"tag":tag,"id":tmp_id,"class":tmp_cl_s,"attr":tmp_attr_s};
    }

    function extract_css_selector(input_tag, prop_map){
	var analized_result = analisys_css_selector(input_tag);
	var cls_s = analized_result['class'];
	var tag = null;
	var prop_s = {};

	if(prop_map.hasOwnProperty('*')){$.extend(true,prop_s, prop_map['*']);}
	var concat_cl_s = '';
	for(var cl=0; cl < cls_s.length; ++cl){
	    var tmp = cls_s[cl];
	    concat_cl_s += tmp+' ';
	    if(prop_map.hasOwnProperty( '.'+tmp)){
		prop_s['style'] = merge_css(prop_s['style'], prop_map['.'+tmp]['style']);
	    }
	}
	tag = analized_result['tag'];
	prop_s['id'] = analized_result['id'];
	prop_s['class'] = concat_cl_s;
	if(prop_map.hasOwnProperty(tag)){
	    var kept_style = merge_css(prop_s.style, prop_map[tag].style);
	    $.extend(prop_s, prop_map[tag]);
	    prop_s.style = kept_style;
	}
	//TODO classについてprop_mapからextract

	prop_s = $.extend(true, prop_s, analized_result['attr']);//汎用設定prop_listを個別設定tagで上書き
	return [tag, prop_s];
    }

    function check_input_data(tag, prop_s, infinite_loop_check){
	// var length_forbidden = 関数タグの対象外css_selector.length;
	// for(var i=0; i < length_forbidden; ++i){
	//     var tgt = 関数タグの対象外css_selector[i];
	//     if(prop_s.hasOwnProperty(tgt) && prop_s[tgt] != ''){
	// 	alert("Sorry. parts in Tag don't support #.[]");
	// 	throw new TypeError("Sorry. parts in Tag don't support #.[]");
	//     }
	// }
	var index_tag = infinite_loop_check.indexOf(tag);
	if(index_tag > -1){
	    alert('Error : '+tag+' : infinite loop detected !');
	    throw new TypeError('Error : infinite loop !');
	}
    }

    function recursive_collect_last_child(child_s, last_child_s){
	child_s.forEach(function(child){
	    if(child.child_s.length === 0){
		last_child_s.push(child);
	    }else{
		recursive_collect_last_child(child.child_s, last_child_s);
	    }
	});
	return last_child_s;
    }

    function convert_lineardata_to_child_s(tag_s2, prop_map, part_map, param_map, parent_param_s, infinite_loop_check){
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
		    //tag_s.tag_s[i] :  tag#hoge.fuga.hage($col 4 =,5,0) //removed "*n"
		    //副作用 param_mapへ
		    var input_tag_param_s = extract_param_from(tag_s.tag_s[i], param_map, parent_param_s);
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

			var resolve_tag = part_map[tag];
			var stringified_tag = resolve_tag;
			if(typeof resolve_tag !== 'string'){stringified_tag = JSON.stringify(resolve_tag);}
			var child_last = null;
			if(stringified_tag.startsWith('[') || stringified_tag.startsWith('{')){
			    child_last = {"child_s":resolve_tag};
			    last_child_s = [];
			    recursive_collect_last_child(resolve_tag, last_child_s);
			    child_last.last_child_s = last_child_s;
			}else{
			    child_last = convert_lineardata_to_child_s(format_raw_tag_s(resolve_tag, param_s), prop_map, part_map, param_map, param_s, infinite_loop_check);//TODO XXX
			}
			infinite_loop_check[infinite_loop_check.indexOf(tag)] = "";//delete
			$.merge(parent.child_s, child_last.child_s);
			// child の一番下の子孫を新しい親とする
			$.merge(new_parent_s, child_last.last_child_s);//子供もやがて親になる･･･
		    }else{
			$.each(HTML5のタグには無い文字, function(idx,forbidden_char){//TODO tagを分解して回した方が良いはず
			    if(tag.indexOf(forbidden_char) > 0) throw new TypeError('Tag : '+tag+' does not belong to HTML5. ');
			});
			var child = my_apply(tag, prop_s,[]);
			new_parent_s.push(child);//子供もやがて親になる･･･
			//wrap
			if($.inArray(tag, draggableとresizableが同時には正常に動かないためwrapするタグ) > -1){
			    if(! child.prop_s.hasOwnProperty('class')){	child.prop_s['class'] = '';	}
			    child.prop_s['class'] += ' wrapped';
			    child = my_apply('div',{"class":"wrapper","style":"background-color:transparent;padding-bottom:12px;padding-right:12px;"},[child] );//wrapper
			}
			parent.child_s.push(child);
		    }
		}
	    });
	    parent_s = new_parent_s;
	});
	root_s.last_child_s = parent_s;
	return root_s;
    };

    var DISTANT_HEIGHT = 45;
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
	var my_height = DEFAULT_HEIGHT + DISTANT_HEIGHT * (tag_size_s.length - my_layer_idx );
	var my_width = DEFAULT_WIDTH + 10 * (tag_size_s.length - my_layer_idx + tag_size_s[my_layer_idx]);
	// default size
	if( 各タグ毎の初期サイズ[tag] !== undefined ){
	    var default_style = 各タグ毎の初期サイズ[tag];
	    my_height = default_style['height'];
	    my_width = default_style['width'];
	}

	if( typeof temp_prop_s.style === 'undefined'){
	    temp_prop_s.style = 'z-index: '+get_z_index(my_layer_idx)+';height:'+my_height+'px;width:'+my_width+'px;top:'+get_top(tag_size_s, my_layer_idx, my_idx)+'px;left:'+get_left(tag_size_s, my_layer_idx, my_idx)+'px;';
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
		temp_prop_s.style +='top:'+get_top(tag_size_s, my_layer_idx, my_idx)+'px;';
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
	try{
	    // 引数 整形 処理
	    var val_s = format_raw_val_s(raw_val_s);
	    var length_val_s = val_s.length;
	    var prop_map = format_raw_prop_s(raw_prop_s, length_val_s);
	    var part_map = format_raw_tag_holder_s(raw_tag_holder_s);
	    var linear_data = format_raw_tag_s(raw_tag_s, [], length_val_s);//return [[tag#hoge.fuga.hage($col=4,5,0)*3]]
	    var param_map = {};
	    var infinite_loop_check = [];//再帰を使用しているため無限ループや無限トランポリン対策
	    var root = convert_lineardata_to_child_s(linear_data, prop_map, part_map, param_map, [], infinite_loop_check);
	    //値埋め
	    if(val_s !== null && val_s.length > 0){
		$.each(root.last_child_s, function(pIdx, obj){
		    var setVal = val_s[parseInt(pIdx % val_s.length, 10)];
		    if( obj.tag === 'input'){
			obj.prop_s["value"] = setVal;
		    }else{
			obj.prop_s["html"] = setVal;
		    }
		});
	    }else{
		$.each(root.last_child_s, function(pIdx, obj){
		    if( obj.tag !== 'input' && typeof obj.prop_s["html"] === 'undefined'){
			obj.prop_s["html"] = '';
		    }
		});
	    }
	    delete root.last_child_s;
	    adjustSize(root.child_s);
	    return root;
	}catch(e){
	    throw e;
	}
    }

    function adjustSize(myApply){
	return innerObserveNumChilds(myApply,0, 0);
    }

    function innerObserveNumChilds(app_s, poolW, poolH){
	app_s.forEach(function(app,i,a){
	    if(app.child_s.length === 0){
		var style = analysisCss(app.prop_s.style, {});
		poolW += parseInt(style.width,10);
		poolH += parseInt(style.height,10);
	    }else{
		var pools = innerObserveNumChilds(app.child_s, poolW, poolH);
		var app_style = analysisCss(app.prop_s.style, {});
		//							if(parseInt(app_style.width,10) < pools[0]){
		//								poolW = pools[0] + 4;
		//								app_style.width = pools[0]+'px';
		//							}
		if(parseInt(app_style.height,10) < pools[1]){ 
		    poolH = pools[1] + 4;
		    app_style.height = pools[1]+'px';
		}
		app.prop_s.style = cssStringify(app_style);
	    }
	});
	return [poolW, poolH];
    }

    function myCreateElement(tag, is_svg){
	var raw;
	var elm ;
	if(is_svg){
	    raw = document.createElementNS(SVG_NS, tag);
	    elm = $(raw);
	    elm.data('my-is-svg',true);
	    elm.attr = function(key,val){
		if( arguments.length === 1 ){
		    if( $.isPlainObject(key) ){
			for(var objKey in key){
			    raw.setAttribute(objKey, key[objKey]);
			}
			return this;
		    }else{
			var rtn = raw.getAttribute(key);
			if( typeof rtn !== 'undefined'){
			    return rtn;
			}
			return undefined;
		    }
		}else if( arguments.length >= 2 ){
		    raw.setAttribute(key,val);
		    return this;
		}
		return this;
	    };
	    if( tag === 'text'){
		elm.html = function (txt){
		    if(typeof txt === 'undefined'){
			var rtn = '';
			$.each(raw.childNodes,function(idx,node){
			    if(node.noteType === 3){
				rtn += note.textContent + ' ';
			    }
			});
		    }else{
			var txt_node = document.createTextNode(txt);
			raw.appendChild(txt_node);
			return this;
		    }
		};
		elm.appendTo = function (parent){
		    if(parent instanceof jQuery){
			parent = parent[0];
		    };
		    parent.appendChild(raw);
		}
	    }
	    elm.addClass = function(clz){
		var already =  raw.getAttribute('class');
		if( already.indexOf(clz) === -1){
		    raw.setAttribute('class', already.trim()+' '+clz);
		}
		return this;
	    };
	    elm.removeClass = function(clz){
		var already =  raw.getAttribute('class');
		if( already.indexOf(clz) !== -1){
		    raw.setAttribute('class', already.replace(clz,''));
		}
		return this;
	    };
	}else{
	    if(単一タグ.some(function(st){return tag === st;})){
		elm = $('<'+tag+' />');//TODO brが<br></br>になる・・・
	    }else{
		elm = $('<'+tag+'>');
	    }
	    elm.data('my-is-svg',false);
	}
	return elm;
    }

    function myWrapElement(raw){
	var elm;
	if(raw instanceof jQuery){
	    if(raw.length > 1){
		throw new TypeError('myWrapElement doesnot accepts array.');
	    }
	    raw = raw[0];
	    elm = $(raw);
	}else{
	    elm = $(raw);
	}

	if(elm.data('my-is-svg')){
	    elm.attr = function(key,val){
		if( arguments.length === 1 ){
		    if( $.isPlainObject(key) ){
			for(var objKey in key){
			    raw.setAttribute(objKey, key[objKey]);
			}
			return this;
		    }else{
			var rtn = raw.getAttribute(key);
			if( rtn != null){
			    return rtn;
			}
			//return undefined
		    }
		}else if( arguments.length >= 2 ){
		    raw.setAttribute(key,val);
		    return this;
		}
	    };
	    elm.addClass = function(clz){
		var already =  raw.getAttribute('class');
		if( already.indexOf(clz) === -1){
		    raw.setAttribute('class', already.trim()+' '+clz);
		}
		return this;
	    };
	    elm.removeClass = function(clz){
		var already =  raw.getAttribute('class');
		if( already.indexOf(clz) !== -1){
		    raw.setAttribute('class', already.replace(clz,''));
		}
		return this;
	    };
	}

	return elm;
    }

    /**
     * {"tag":"table","prop_s":{},"child_s":[{loop...}]}を再帰処理する
     * データの二重加工を防ぐため､副作用処理一切禁止 そういった処理はconvert_to_displayに実装
     * _this.tag == ''の場合､targetのpropを_thisのpropで更新する
     * my_apply形式のデータが対象
     * TODO position:relativeが無効なtd,th直下では､draggable 禁止
     */
    function display_onscreen(target_s, _this, _is_draggable, is_svg){
	var is_default_draggable = _is_draggable || typeof _is_draggable === 'undefined' ;
	var tag = _this['tag'].trim().toLowerCase();
	var prop_s = _this['prop_s'];
	var child_s = _this['child_s'];
	if( ! $.isArray(child_s)){
	    console.log('Error this is not Array:'+JSON.stringify(child_s));
	}
	if(tag毎の入力規則.hasOwnProperty(tag)){
	    var setting = tag毎の入力規則[tag];
	    var require_s = setting['require_s'];
	    var default_val_s = setting['default'];
	    $.each(require_s, function(layer_idx, require){
		if( ! prop_s.hasOwnProperty(require)){
		    if( default_val_s.hasOwnProperty(require)){
			prop_s[require] = default_val_s[require];
		    }else{
			console.log("This "+tag+" tag requires a "+require+" prop.");
			throw new Error("This "+tag+" tag requires a "+require+" prop.");
		    }
		}
	    });
	}

	var length_target_s	 = target_s.length;
	var parent_is_svg = false;
	for(var idx_tgt=0; idx_tgt < length_target_s; ++idx_tgt){
	    var target = myWrapElement(target_s[idx_tgt]);
	    var parent_tag = target[0].localName.toLowerCase();
	    var is_relative禁止タグ = position_relative禁止タグ.indexOf(parent_tag) >= 0;
	    var is_resizable = true;

	    if( !is_relative禁止タグ && is_default_draggable){var is_draggable = true;}
	    if( tag === 'svg'){
		is_svg = true;
		is_draggable = false;
	    }else if( tag === 'th' || tag === 'td'){
		if(parent_tag !== 'tr') throw new Error(' td,th should be under tr.');
		is_draggable = false;
	    }else if( tag === 'tr' || tag === 'tbody' || tag === 'thead'){
		is_draggable = false;
		is_resizable = false;
	    }else	if( typeof is_svg === 'undefined'){
		is_svg = false;
	    }

	    if(target.data('my-is-svg')){
		parent_is_svg = true;
		is_draggable = false;
	    }else{
		parent_is_svg = is_svg;
	    }
	    var work_jq = tag.length == 0 ? target : myCreateElement(tag, parent_is_svg);
	    for(var prop in prop_s)if(prop_s.hasOwnProperty(prop)){
		prop = prop.trim().toLowerCase();
		if( prop === 'html'){//余計なお節介機能
		    if( tag === 'input' && work_jq.val() === '' ){
			work_jq.val(prop_s[prop]);
		    }else{
			work_jq.html(prop_s[prop]);
		    }
		    work_jq
			.data('my-obj-val', prop_s[prop])
			.attr('data-my-obj-val', prop_s[prop]);
		}else if( prop === 'value' ){
		    if( tag === 'textarea' ){
			work_jq.html(prop_s[prop]);
		    }else{
			work_jq.val(prop_s[prop]);
		    }
		    work_jq
			.data('my-obj-val', prop_s[prop])
			.attr('data-my-obj-val', prop_s[prop]);
		}else{
		    work_jq.attr(prop,prop_s[prop]);
		}
	    }
	    if(typeof work_jq.data('my-obj-val') === 'undefined'){work_jq.data('my-obj-val','');}
	    if(typeof work_jq.attr('data-my-obj-val') === 'undefined'){work_jq.attr('data-my-obj-val','');}

	    work_jq.data('my-org-prop_s', prop_s);
	    if( work_jq === target){
		continue;
	    }

	    var my_obj_id = STATUS.getNewMyObjId();
	    var parent_id = target.attr('data-my-obj-id');
	    var my_regular_id = parent_id+MY_OBJ_SEP+ my_obj_id;
	    var user_input_id = work_jq.attr('id');
	    if( typeof user_input_id === 'undefined' || $('#'+user_input_id).length !== 0 ){
		user_input_id = my_regular_id;
	    }
	    work_jq
		.addClass(CLASS_HTMLIZE)
		.attr('data-my-obj-id', my_regular_id)
		.data('my-obj-id', my_regular_id)
		.attr({"id":user_input_id})
		.on(MY_CLICK,select_handler)
		.on(MY_CHANGE,function(ev){
		    var _this = myWrapElement(this);
		    var val = _this.val()
		    _this
			.data('my-obj-val', val)
			.attr('data-my-obj-val', val);
		});
	    var length_child_s = child_s.length;
	    for(var idx_child=0; idx_child < length_child_s; ++idx_child){
		display_onscreen([work_jq], child_s[idx_child], is_draggable, is_svg);
	    }

	    var is_table_cell = false;
	    var original_coord = null;
	    var x_sibl = null;
	    var y_sibl = null;
	    var resizableOption = {
		"stop":function(ev, ui){
		    is_table_cell = false;
		    //								draw_arrow_s(cached_arrow_factory, _this);
		    cached_arrow_factory = null;
		},
		"resize":function(ev, ui){
		    if(is_table_cell){
			var _this = $(this);
			x_sibl.width(original_coord.x + ev.pageX);
			y_sibl.height(original_coord.y + ev.pageY);
		    }
		    continuous_draw_arrow_s();
		},
		"start":function(ev, ui){
		    not_click = true;
		    var _this = $(this);
		    var my_id = _this.attr('data-my-obj-id');
		    cached_arrow_factory = draw_arrow_s_factory(null, my_id);
		    var tag = _this[0].localName;
		    x_sibl = null; y_sibl = null;
		    if(tag === 'td' || tag === 'th'){
			var parent = _this.parent();
			var parent_id = parent.attr('data-my-obj-id');
			is_table_cell = true;
			original_coord = {"x": _this.width() - ev.pageX  ,"y":_this.height() - ev.pageY};
			$(' > td, > th',parent).each(function(idx,obj){
			    var _id = $(this).attr('data-my-obj-id');
			    if(my_id === _id){
				++idx;
				x_sibl = $(' tr[data-my-obj-id!="'+parent_id+'"] > *:nth-child('+idx+')', parent.parent().parent());
				return false;
			    }
			});
			x_sibl.width(10);
			y_sibl = _this.siblings().height(10);
			x_sibl.each(function(){
			    var _this = $(this);
			    console.log('_this :' + _this.attr('data-my-obj-id'));
			});
		    }else{
			original_coord = null;
			is_table_cell = false;
		    }
		},
		"autoHide":true, "handles":"e,s,se", "cancel":"option","minWidth":"10","minHeight":"10"
	    };
	    var draggableOption ={"snap":".snap","snapTolerance":"8","distance":"4",
				  "stop":function(ev, ui){
				      var _this = $(this);
				      _this.removeClass('snap_border')
					  .parent().removeClass('snap_border')
					  .children('.snap').removeClass('snap_border');
				      if(this.localName === 'table' || this.localName === 'ol'){
					  _this.css({"width":"auto", "height":"auto"});
				      }
				      draw_arrow_s(cached_arrow_factory, _this);
				      cached_arrow_factory = null;
				  },
				  "drag":continuous_draw_arrow_s,
				  "start":function(ev, ui){
				      not_click = true;
				      var _this = $(this);
				      _this.addClass('snap_border')
					  .parent(':not(#screen)').addClass('snap_border')
					  .children('.snap').addClass('snap_border');
				      var my_id = _this.attr('data-my-obj-id');
				      cached_arrow_factory = draw_arrow_s_factory(null, my_id);
				  }
				 };
	    var wrapped_is_true = typeof prop_s['class'] !== 'undefined' && prop_s['class'].indexOf('wrapped') !== -1;
	    var i_am_wrapper = typeof prop_s['class'] !== 'undefined' && prop_s['class'].indexOf('wrapper') !== -1;
	    if( i_am_wrapper ){
		resizableOption["alsoResize"] = '[data-my-obj-id^="'+my_regular_id+MY_OBJ_SEP+'"]';
		resizableOption["stop"] = function(ev, ui){
		    var tmp = $('*',work_jq);
		    work_jq.height(tmp.height() + 16).width(tmp.width() + 16);
		};
	    }

	    removeSelected(work_jq)
		.appendTo( target )
		.data('my-htmlize-target',true)
		.attr('data-my-htmlize-target',true);
	    if( wrapped_is_true ){
		//nothing
	    }else if(必ず子要素のタグ.indexOf(tag) > -1 ){
		work_jq
		//.css({"top":"","left":"","position":"relative"});
		//CSS2.1の仕様により td, th にはposition relativeが効いてはいけない｡
		    .css({"top":"","left":""});
		if( is_resizable || is_draggable ){
		    resizableOption["stop"] = function(ev, ui){
			var _this = $(this);
			draw_arrow_s(cached_arrow_factory, _this);
			cached_arrow_factory = null;
			work_jq.css({"left":0,"top":0});
		    };
		    work_jq
			.resizable(resizableOption)
			.data('resizableOption', resizableOption);
		}
		if( is_draggable ){
		    work_jq.draggable(draggableOption)
			.data('draggableOption', draggableOption);
		}
	    }else if(resizableのみ対象のタグ.indexOf(tag) > -1){
		work_jq.css({"top":0, "left":0});
		//nothing
	    }else{
		if( is_draggable ){
		    if(!is_relative禁止タグ){
			work_jq.draggable(draggableOption)
			    .data('draggableOption', draggableOption);
		    }else{
			work_jq.css({"top":0, "left":0});
		    }
		}else{
		    if(!is_relative禁止タグ){
			work_jq.css('position','relative');//子要素のpositionがabsoluteになり得るため
		    }else{
			work_jq.css({"top":0, "left":0});
		    }
		}
		if(!is_relative禁止タグ){
		    work_jq.css('position','absolute');
		}else{
		    work_jq.css('position','relative');
		}
		work_jq
		    .resizable(resizableOption)
		    .data('resizableOption', resizableOption)
		    .addClass('snap');
	    }
	}
    }
    var cached_arrow_factory = null;
    function continuous_draw_arrow_s(){
	try{
	    not_click = true;
	    draw_arrow_s(cached_arrow_factory, $(this));
	}catch(e){
	    console.log('Error '+JSON.stringify(e));
	}
    }

    function draw_arrow_s(cache, operated){
	var my_id = null;
	var now_coord = null;
	if(typeof operated !== 'undefined' && operated !=  null){
	    my_id = operated.attr('data-my-obj-id');
	}
	if(typeof cache === 'undefined' || cache == null){
	    cache = draw_arrow_s_factory(null, my_id);
	}

	var arrow_s = cache['arrows'];
	var length_arrow_s = arrow_s.length;
	for(var idx=0; idx < length_arrow_s; ++idx){
	    var svg_cmd = LinePathCmdFactory();//BezierPathCmdFactory();//
	    var arrow = arrow_s[idx];
	    var path_d_array = arrow[1];// 1 means path_d.
	    var path_d = '';
	    for(var p_idx=0; p_idx < path_d_array.length; ++p_idx){
		path_d += svg_cmd(get_center_abs_coord(get_offset_width_height(path_d_array[p_idx])));
	    }
	    arrow[0].attr('d',path_d);
	}
    }

    var LinePathCmdFactory = function(){
	var idx = 0;
	var add = 1;
	var CMD_s = ["M "," L "];
	return function(path){
	    if(typeof path === 'undefined') path = '';
	    var rtn = CMD_s[idx];
	    idx += add;
	    add = 0;
	    return rtn + path;
	};
    };

    var BezierPathCmdFactory = function(){
	var idx = 0;
	var add = 1;
	var CMD_s = ["M "," Q ",];
	var pre = [0,0];
	var curve = -1;
	return function(path){
	    if(typeof path === 'undefined') path = '';
	    var rtn = CMD_s[idx];
	    var path_split = path.trim().split(' ');
	    path_split = [parseFloat(path_split[0]),parseFloat(path_split[1])];
	    if( idx === 1 ){
		var middle_coord = [ curve * (path_split[1] - pre[1])/2 + pre[0] ,  - curve *  (path_split[0] - pre[0])/3 + pre[1]];
		rtn += middle_coord[0] + ' ' + middle_coord[1] + ' ' + path;
	    }else{
		rtn += ' ' + path;
	    }
	    curve *= -1;
	    pre = path_split;
	    idx += add;
	    add = 0;
	    return rtn;
	};
    };

    function draw_arrow_s_factory(target_s, op_my_id){
	if(typeof target_s === 'undefined' || target_s == null || ! arget_s.hasOwnProperty('member_s')){
	    target_s = {"member_s":$('svg.data-conns > *[data-conns]', page.screen)};
	}
	if(typeof op_my_id !== 'undefined' && op_my_id != null && op_my_id !== ''){
	    target_s['my_id'] = op_my_id;
	}else{
	    op_my_id = null;
	}

	var arrow_func_s = [];
	$.each(target_s.member_s,function(idx, obj){
	    var arrow = $(this);
	    var selector_s = arrow.attr('data-conns').split(' ');
	    var length_selector_s = selector_s.length;
	    var path_d = [];
	    var path_d_idx = 0;
	    for(var idx = 0; idx < length_selector_s; ++idx){
		var node_selector = selector_s[idx].trim();
		var node_s = $(node_selector,page.screen);
		if(typeof node_s === 'undefined' || node_s == null || node_s.length === 0){
		    continue;
		}
		for(var node_idx = 0; node_idx < node_s.length; ++node_idx){
		    var node = $(node_s[node_idx]);
		    var ch_my_id = node.attr('data-my-obj-id');
		    path_d.push(node);
		};
	    }
	    arrow_func_s.push([arrow,path_d]);
	});
	target_s['arrows'] = arrow_func_s;
	return target_s;
    }

    function get_center_bottom_abs_coord(info){
	return (info['offset'].left+info['width']/2)+' '+(info['offset'].top+info['height']);
    }

    function get_center_abs_coord(info){
	try{
	    return (info['offset'].left+info['width']/2)+' '+(info['offset'].top+info['height']/2);
	}catch(e){
	    console.log('get_center_abs_coord : '+JSON.stringify(e));
	    return undefined;
	}
    }

    function select_handler(ev){// 選択処理実装
	if(is_suspend) return;
	ev.stopPropagation();
	var _this = myWrapElement(this);
	var my_regular_id = _this.attr('data-my-obj-id');
	if( not_click ){
	    not_click = false;//TODO dragとclickが被るための対処策｡jquery内で解決策あれば･･･
	    return;
	}
	select_element(false, _this);
	//analisys my-obj-id
	var id_list = my_regular_id.split(MY_OBJ_SEP);
	var concat_id = '';
	var appendHtml = '';
	$.each(id_list,function(idx,my_id){
	    concat_id += my_id;
	    var tmp = $('*[data-my-obj-id='+concat_id+']',page.screen).get(0);
	    if(typeof tmp !== 'undefined'){
		appendHtml += '<option value="'+concat_id+'">'+tmp.localName+'</option>';
	    }
	    concat_id += MY_OBJ_SEP;
	});
	concat_id = concat_id.substring(0, concat_id.length - 1);
	context_menu.parent_list.empty().append(appendHtml).val(concat_id);
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
	    var my_regular_id = myWrapElement(this).data('my-obj-id');
	    mthd_delete_element_by_my_id(my_regular_id);
	});
    }
    /**
     * 削除する。但し現スクリーンのみ
     */
    function mthd_delete_element_by_my_id(my_regular_id){
	$('[data-my-obj-id="'+my_regular_id+'"]', page.screen).empty().remove();
    }

    function getStatus(){
	var obj_id = 1;
	return {
	    "getNewMyObjId":function(){
		return obj_id++;
	    }
	};
    }

    var history_counter = 0;
    function init_save_history(){
	var appender = '';
	var save_s = MY_STORAGE.select('save_s');
	history_counter = 0;
	for(var key in save_s) if(save_s.hasOwnProperty(key) && key.startsWith('save')){
	    appender = '<option value="'+key+'">'+key+'</option>' + appender;
	    var tmp = parseInt(key.split(MY_OBJ_SEP)[1],10);
	    history_counter = history_counter < tmp ? tmp : history_counter;
	}
	el_history.empty().html(appender);
    }
    init_save_history();

    function preserve_destroy_dr_rs(obj){
	var resizableOption = obj.data('resizableOption');
	var draggableOption = obj.data('draggableOption');
	if(typeof resizableOption !== 'undefined'){obj.data('resizableOption', resizableOption).resizable('destroy');}
	if(typeof draggableOption !== 'undefined'){obj.draggable('destroy');}
	return {"resizableOption":resizableOption, "draggableOption":draggableOption};	
    }
    function recovery_dr_rs(obj, resizableOption, draggableOption){
	try{
	    if(typeof resizableOption !== 'undefined'){
		obj.resizable(resizableOption);
	    }else{
		var rOption = obj.data('resizableOption');
		if(typeof rOption !== 'undefined'){obj.resizable(rOption);}
	    }
	}catch(e){console.log('resizable error :' + e);};
	try{
	    if(typeof draggableOption !== 'undefined'){
		obj.draggable(draggableOption);
	    }else{
		var dOption = obj.data('draggableOption');
		if(typeof dOption !== 'undefined'){obj.draggable(dOption);}
	    }
	}catch(e){console.log('draggable error :' + e);};
    }
    function preserve_destroy_remove_recovery_dr_rs(obj, conv, removed, callback){
	var d_r_opt_s = preserve_destroy_dr_rs(obj);
	callback(obj, conv);
	removed.remove();
	recovery_dr_rs(obj, d_r_opt_s.resizableOption, d_r_opt_s.draggableOption);
    }

    el_func_s.edit
	.on(MY_CLICK,function(ev, obj){
	    is_suspend = ! is_suspend;
	    el_edit_mode.html(is_suspend.toString());
	    if(is_suspend){
		var NOW_SELECTED = $('.'+CLASS_SELECTED, page.screen)
			.addClass(CLASS_ON_EDIT)
			.each(function(idx,obj){
			    var _this = $(this);
			    var parent = _this.parent();
			    $('<textarea class="'+CLASS_EDIT_DATA+'" style="z-index:'+(10000+parseInt(_this.css('z-index'), 10))+';width:100%;position:absolute;top:0px;left:0px;height:'+_this.height()+'px" >').append(_this.attr('data-my-obj-val').replace(/</g,'&lt;').replace(/>/g,'&gt;')).appendTo(_this);
			});
		el_func_s['cxlselected'].trigger(MY_CLICK);
	    }else{
		$('.'+CLASS_ON_EDIT + ' > .'+CLASS_EDIT_DATA, page.screen)
		    .each(function(idx,obj){
			var _this = $(this);
			var conv = _this.val().replace(/\n/g,'<br>');
			var parent = _this.parent();
			preserve_destroy_remove_recovery_dr_rs(parent, conv, _this, call_safe_html);
		    }).removeClass(CLASS_ON_EDIT);
	    }
	});

    function getSelectedOrRoot(){
	var mother_id = null;
	var NOW_SELECTED = $('.'+CLASS_SELECTED, page.screen);
	var save = null;
	/* create new */
	if(NOW_SELECTED.length === 0){
	    mother_id = page.screen.attr('data-my-obj-id');//attrだと文字, dataだとobj
	    var child_tree = get_child_tree_select_dom(mother_id);
	    save = child_tree.child_s();
	}else{
	    save = [];
	    NOW_SELECTED.each(function(){
		var _this = $(this);
		mother_id = _this.attr('data-my-obj-id');
		var child_tree = get_child_tree_select_dom(mother_id);
		save.push(child_tree.self());
	    });
	}
	return save;
    }

    /**
     * saveされる対象はdata-my-obj-idが付与されているもの
     */
    el_func_s.save.on(MY_CLICK, function(){
	/* get selected or root */
	var save = getSelectedOrRoot();
	el_saved_serialized.val(JSON.stringify(save));

	/* delete old */
	var save_s = MY_STORAGE.select('save_s');
	save_s = save_s == null ? {} : save_s;
	++history_counter;
	var tmp_counter = 0;
	while(history_counter - tmp_counter > MAX_SAVE_SLOT_S){
	    if(save_s.hasOwnProperty('save'+MY_OBJ_SEP+tmp_counter)){
		delete save_s['save'+MY_OBJ_SEP+tmp_counter];
	    }
	    if(tmp_counter > 10000){
		console.log('break');
	    }
	    ++tmp_counter;
	}

	/* save this */
	save_s['save'+MY_OBJ_SEP+history_counter] = save;
	MY_STORAGE
	    .transaction()
	    .replace('save_s', save_s)
	    .commit();

	/* refresh screen */
	init_save_history();
    });

    el_func_s.register_part.on(MY_CLICK, function(){
	/* get selected or root */
	var save = getSelectedOrRoot();
	$('.p_list_child:last-child > .val', el_some_list.part_list).val(JSON.stringify(save));
    });

    el_func_s.stop_dra_res.on(MY_CLICK, function(){
	var NOW_OFF_DS = $('.'+CLASS_DRAG_RESIZE+'.'+CLASS_SELECTED, page.screen)
		.removeClass(CLASS_DRAG_RESIZE)
		.each(function(obj, idx){
		    var _this = $(this);
		    removeSelected(_this);
		    recovery_dr_rs(_this);
		});
	var NOW_SELECTED = $('.'+CLASS_SELECTED+':not(.'+CLASS_DRAG_RESIZE+')', page.screen)
		.addClass(CLASS_DRAG_RESIZE)
		.each(function(obj, idx){
		    var _this = $(this);
		    removeSelected(_this);
		    preserve_destroy_dr_rs(_this);
		});
    });

    el_func_s.load.on(MY_CLICK, function(){
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
	    display_onscreen(page.screen, parsed[i]);
	}
	draw_arrow_s();
    });
    el_history.on(MY_CHANGE,function(){
	var _this = myWrapElement(this);
	var saved = MY_STORAGE.select('save_s');
	if(saved != null){
	    var selected = _this.val();
	    el_saved_serialized.val(JSON.stringify(saved[selected]));
	}
    }).trigger(MY_CHANGE);

    el_func_json_val.on(MY_CHANGE, function(){
	var _this = myWrapElement(this);
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
	.ifelse(true
		, ['merge',{"part_list":{"latest_example":{"thead_th":"thead>tr>th*$0","tbody_th_td":"tbody>tr*$1>th+td*($0 1 -)","table_cross_header":"table>thead_th($0)+tbody_th_td($0,$1)","svg_example":"svg.data-conns>path[data-conns=#hoge #fuga]+path[data-conns=#hoge #hage]+path[data-conns=#fuga #hage]","svg_example2":"svg.data-conns>path[data-conns=#hoge #fuga #hage]","svg_example3":"svg.data-conns>path[data-conns=#hoge #fuga #hage #hoge]","div_conned":"div#hoge+div#fuga+div#hage","svg_example4":"svg.data-conns>path[data-conns=div.htmlize:not(.wrapper)]"}}}]
		, []
	       )
	.ifelse(true
		, ['merge',{"prop_list":{"latest_example":{"table":{"style":"border-collapse:collapse;background-color:white;table-layout:fixed;"},"td,th":{"style":"border:1px solid black;"},"th":{"style":"color:red;"},"svg":{"xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","style":"height:800px;width:1200px;"},"path":{"fill":"black","stroke":"black","stroke-width":1,"d":""}}}}]
		,[]
	       )
	.commit();

    //part_list, prop_list, style_list
    $.each(el_some_key_s, function(idx, some_key){
	var el_some = {};
	var length_el_some_func_suffix_s = el_some_func_suffix_s.length;
	for(var f=0; f < length_el_some_func_suffix_s; ++f){
	    var suffix = el_some_func_suffix_s[f];
	    el_some[suffix] = $('#'+some_key+'_'+suffix, el_basic_menu);
	}
	var tmp_el_list = el_some_list[some_key].sortable();
	var tmp_el_input = el_some_input[some_key];
	var is_add_button = some_key === 'part_list'? true : false;//TODO
	//pull down
	refresh_select_list(some_key, el_some.select);
	//pull donw init
	var name_in_storage = MY_STORAGE.select(some_key+'_selected');
	if( name_in_storage != null && name_in_storage !== '' ){
	    el_some.name.val(name_in_storage);
	    el_some.select.val(name_in_storage);
	}

	el_some.select.on(MY_CHANGE,function(){
	    var some_name = this.value;
	    var input_name = el_some.name.val();
	    var list_s_in_storage = MY_STORAGE.select(some_key);
	    if(list_s_in_storage != null && typeof list_s_in_storage !== 'undefined'){
		var keys_list_s = Object.keys(list_s_in_storage);
		if(keys_list_s.length > 0){
		    if(typeof some_name !== 'undefined' && some_name != null && some_name !== '' ){
			el_some.name.val(some_name);
			el_some.select.val(some_name);
			if( name_in_storage !== some_name){
			    MY_STORAGE.transaction().replace(some_key+'_selected', some_name).commit();
			    name_in_storage = some_name;
			}
		    }
		}else{
		    return false;
		}
		var list_in_storage = list_s_in_storage[el_some.name.val()];
		if(typeof list_in_storage === 'undefined'){
		    return false;
		}
	    }else{
		return false;
	    }

	    tmp_el_list.empty();//clear
	    $.each(Object.keys(list_in_storage), function(idx,key){
		new_empty_line(tmp_el_list, key, force_stringify(list_in_storage[key]), is_add_button);
	    });
	    // for new empty input
	    new_empty_line (tmp_el_list,'','', is_add_button);
	    //tmp_el_list.parent().height(tmp_el_list.height() + 100);//TODO 高さ関数の修正

	    tmp_el_list
		.on(MY_CHANGE,'input.key',function(){
		    var pre_height = tmp_el_list.height();
		    $('input.key', tmp_el_list).each(function(){
			var _this = myWrapElement(this);
			if(_this.val().trim().length === 0){
			    _this.parent().remove();
			}
		    });
		    new_empty_line(tmp_el_list,'','', is_add_button);
		    var added_height = tmp_el_list.height() - pre_height;
		    var parent = tmp_el_list.parent();
		    parent.height(parent.height() + added_height);
		})
		.on(MY_CLICK +','+ MY_CHANGE,'input',function(){
		    tmp_el_input.val(force_stringify(collect_some_list(tmp_el_list)));
		    el_some.name.animate({"background-color":"#ffaaaa"}, 500).animate({"background-color":""}, 500);
		});
	    tmp_el_input.val(force_stringify(collect_some_list(tmp_el_list)));
	    if(some_key === 'style_list'){//TODO 個別処理
		var style_html = '';
		$('>li.p_list_child', el_some_list[some_key]).each(function(){
		    var _this = $(this);
		    var key = $('>input.key', _this).val().trim();
		    var val = $('>input.val', _this).val().trim().replace(/\t/g, '');
		    if(key.length > 0){
			style_html += key+'{\n'+val.replace(/;/g, ';\n')+'}\n';
		    }
		});
		el_sandbox_style_screen_area.val(style_html);
	    }
	}).trigger(MY_CHANGE);//end el_some.select

	el_some.reg.on(MY_CLICK,function(){
	    var some_name = el_some.name.val();
	    var tmp_el_list = el_some_list[some_key];
	    var list_s_in_storage = MY_STORAGE.select(some_key);
	    if(list_s_in_storage === null ){
		list_s_in_storage = [];
	    }
	    list_s_in_storage[some_name] = collect_some_list(tmp_el_list);
	    MY_STORAGE
		.transaction()
		.replace(some_key, list_s_in_storage)
		.commit();
	    refresh_select_list(some_key, el_some.select);
	    el_some.select.val(some_name);
	});

	el_some.del.on(MY_CLICK,function(){
	    var some_name = el_some.name.val();
	    MY_STORAGE
		.transaction()
		.remove(some_key, el_some.select.val())
		.commit();
	    el_some.select.find('[value='+el_some.select.val()+']').remove();
	    el_some.new.trigger(MY_CLICK);
	});
	el_some.new.on(MY_CLICK,function(){
	    tmp_el_list.empty();//clear
	    el_some.name.val('');
	    new_empty_line(tmp_el_list,'','', is_add_button);
	});
    });

    function refresh_select_list(some_key, el_some_select){
	// creating option in select
	var list_s_in_storage = MY_STORAGE.select(some_key);
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
	var input_val = {};
	$('.p_list_child',parent_list).each(function(){
	    var _this = myWrapElement(this);
	    var input_s = $('input.key,input.val',_this);
	    var key = input_s[0].value;
	    if(key != null && typeof key !== 'undefined' && key.length !== 0){
		input_val[input_s[0].value] = force_parse(input_s[1].value);
	    }
	});
	return input_val;
    }

    function new_empty_line(parent, key, val, is_add_button){
	var part_list_func_s = [">","+"];
	var new_li = $('<li>',{"style":"white-space:nowrap;","class":"p_list_child"});
	if(is_add_button){
	    for(var idx=0; idx < part_list_func_s.length; ++idx){
		$('<input />').attr({"type":"button","value":part_list_func_s[idx]}).css({"width":"2.5em","margin-right":"4px","text-align":"center"})	//TODO style
		    .on(MY_CLICK,function (){
			var now_val = el_val_tag.val();
			var new_val = '';
			now_val = typeof now_val === 'undefined' ? '' : now_val;
			if(now_val !== '' && part_list_func_s.indexOf(now_val.slice(-1) !== -1)){
			    new_val = $(this).val() + $(' ~ .key', this).val();
			}else{
			    new_val = $(' ~ .key', this).val();
			}
			// extract param
			var expression =  $(' ~ .val', this).val();
			var counter = 0;
			expression.split('').forEach(function(x,i,a){
			    if( x === '$' ) ++counter;
			});
			var params = counter > 0 ? '(,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,'.substring(0, counter) +')' : '';
			el_val_tag.val(now_val + new_val + params);
		    }).appendTo(new_li);
	    }
	}
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
	obj.attr('data-my-obj-val', set_val);
	obj.val(set_val);
    }
    /**
     * 上書き方式　子要素以下は削除される
     */
    function call_html(obj, set_val){
	obj.data('my-obj-val', set_val);
	obj.attr('data-my-obj-val', set_val);
	obj.html(set_val);
    }
    /**
     * 孫要素を退避して追記する方式
     */
    function call_safe_text(obj, set_val){
	obj.data('my-obj-val', set_val);
	obj.attr('data-my-obj-val', set_val);
	var kept = $(' *',obj).detach();
	obj.text(set_val);
	kept.appendTo(obj);
    }
    /**
     * 孫要素を退避して追記する方式
     */
    function call_safe_html(obj, set_val){
	obj.data('my-obj-val', set_val);
	obj.attr('data-my-obj-val', set_val);
	var kept = $(' .htmlize',obj).detach();
	obj.empty().html(set_val);
	kept.appendTo(obj);
    }
    function call_text(obj, set_val){
	obj.text(set_val);
    }
    function do_void(){}

    function get_offset_width_height(jq_obj){
	try{
	    return {"offset":jq_obj.offset(),"width":jq_obj.outerWidth(),"height":jq_obj.outerHeight()};
	}catch(e){
	    console.log('get_offset_width_height : '+JSON.stringify(e));
	}
    }

    /**
     * override
     */
    function merge_css(){
	var pool = {};
	var length_arguments = arguments.length;
	for(var i=0; i < length_arguments; ++i){
	    var raw = arguments[i];
	    if( typeof raw !== 'string'){
		continue;
	    }
	    if(raw.hasOwnProperty('style')){
		raw =raw.style;
	    }
	    pool = analysisCss(raw, pool);
	}
	return cssStringify(pool);
    }

    function cssStringify(pool){
	var rtn = '';
	for(var css_key in pool){
	    rtn += css_key+':'+pool[css_key]+';';
	}
	return rtn;
    }
    function analysisCss(style, pool){
	style.split(';').forEach(function(x){
	    var key_val = x.split(':');
	    if( key_val.length >= 2){
		var val = key_val[1].trim();
		if( typeof val === 'undefined' || val == null || val == 'null'){
		    return;
		}
		pool[key_val[0].trim()] = val;
	    }
	});
	return pool;
    }

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
		if($.isNumeric(my_obj_id)){
		    my_obj_id = my_obj_id.toString();
		}
		var parent_obj_id = my_obj_id.substring(0,my_obj_id.toString().lastIndexOf(MY_OBJ_SEP));
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
	    "stringify_child_s":function(){
		var rtn = JSON.stringify(pool[mother_id].child_s);
		return rtn;
	    },
	    "stringify":function(){
		var rtn = JSON.stringify(pool);
		return rtn;
	    },
	    "child_s":function(){
		return pool[mother_id].child_s
	    },
	    "self":function(){
		return pool[mother_id];
	    },
	    "raw":function(){
		var rtn = {};
		$.extend(true,rtn, pool);
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
		if(typeof raw === 'undefined'){	raw = '{}';	}
		return raw;
	    },
	    "transaction":function(){
		if(is_locked){throw new Error('transaction has opened.');
			     }else{
				 var raw = this.raw();
				 try{	uncommit_pool = JSON.parse(raw);
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
		uncommit_pool = {};
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
		    if(typeof raw === 'undefined' || raw == null){return null;}
		    raw = JSON.parse(raw);
		    var saved = raw[key];
		    if(typeof saved === 'undefined'){	return null;
						    }else{return saved;
							 }
		}else{
		    try{pooled = JSON.parse(pooled);
		       }catch(e){console.log('JSON parse Error:' + e);	}
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
	    "remove":function(){
		var loop = arguments.length - 1;
		var target_pool = uncommit_pool;
		for(var i=0; i <= loop; ++i){
		    var key = arguments[i];
		    if(typeof key !== 'undefined' && typeof target_pool[key] !== 'undefined'){
			if(i === loop){
			    delete target_pool[key];
			}
		    }else{
			console.log('nokey : '+key);
			break;
		    }
		    target_pool = target_pool[key];
		}
		return this;
	    },
	    "truncate":function(){
		delete localStorage[FUNC_ID];
		return this;
	    },
	    "keys":function(is_true_storage){
		if( typeof is_true_storage === 'undefined' || is_true_storage === false){
		    return Object.keys(uncommit_pool);
		}else if(is_true_storage){
		    return Object.getOwnPropertyNames(JSON.parse(this.raw()));
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

    function extract_from_dom(tree, user_add_content_s){
	var len_content_s = user_add_content_s.length;
	for(var i=0; i < len_content_s; ++i){
	    var target = my_apply();
	    var content = user_add_content_s[i];
	    var _content = $(content);
	    var my_obj_id = _content.data('my-obj-id');

	    for(var key in content) if(typeof _content.attr(key) !== 'undefined'){
		target.prop_s[key] = _content.attr(key);
	    }
	    target.tag = content.localName;

	    var raw_my_obj_val = _content.data('my-obj-val');
	    var my_obj_val ;
	    if(typeof raw_my_obj_val === 'undefined' || raw_my_obj_val === ''){
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
    }

    function get_child_tree_select_dom(mother_id){
	var user_add_content_s = $(' *[data-my-obj-id^='+mother_id+MY_OBJ_SEP+']');
	var root_dom = $('*[data-my-obj-id='+mother_id+']')[0];
	var tree = _tree(mother_id);
	tree = extract_from_dom(tree, [root_dom]);
	return extract_from_dom(tree, user_add_content_s);
    };

    function get_z_index(parent_layer_idx){
	return 110 + parseInt(parent_layer_idx,10);
    };
    function get_top(tag_size_s, parent_layer_idx, my_idx){
	if( parent_layer_idx === 0){
	    return 100;
	}else{
	    return 10 + (DEFAULT_HEIGHT + (DISTANT_HEIGHT - 10) * (tag_size_s.length - parent_layer_idx) ) * (tag_size_s[parent_layer_idx] * (my_idx));//TODO
	}
    };
    function get_left(tag_size_s, parent_layer_idx, my_idx){
	if( parent_layer_idx === 0){
	    return 100;
	}else{
	    return 10 ;
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
	console.log('_formula :' + _formula);
	console.log('_param_s :' + JSON.stringify(_param_s));
	console.log('_resolved_param_s :' + JSON.stringify(_resolved_param_s));
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
		}else if(IDX_MULTI <= op_idx && op_idx < IDX_PAREN
			   || ((i+1 === length_formula || formula.charAt(i+1) === ' ') && 0 < op_idx && op_idx < IDX_MULTI)){//(+3 -1 +)への対応
		    stack.push(operator_s[op_idx] (stack.pop(), stack.pop()));
		}else if( op_idx === IDX_PAREN){
		    ++i;
		    ++_parent_counter;
		    var pool_formula = "";
		    for(; i<length_formula; ++i){
			c = formula.charAt(i);
			if( c === '('){
			    ++_parent_counter;
			}else if( c === ')'){
			    --_parent_counter;
			}
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
	return [rtn,param_s,resolved_param_s];
    }

    function if_nullOrUndef_then_return_init(param, init){
	if(typeof param === 'undefined' || param == null ){
	    return init;
	}else{
	    return param;
	}
    }
});

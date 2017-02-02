$(function(){
  /**
   * Web Functional Component
   */
  /** On developing
   * displaying not functional tag preset to explorer
   * emacs keybinding
   */
  /** TODO CLIENT wizard
   * font text
   * 3D
   * ajax request / callback
   * flex grid box
   */
  /** TODO CSS
   * size
   * marks
   * page
   * orphans
   * widows
   * border-image
   * border-image-source
   * border-image-slice
   * border-image-width
   * border-image-outset
   * border-image-repeat
   * multi box-shadow
   * clip-path
   * quotes
   * content
   * counter-reset
   * counter-increment
   * list-style
   * list-style-type
   * list-style-position
   * list-style-image
   * font
   * font-style
   * font-variant
   * font-weight
   * font-family
   * font-stretch
   * font-size-adjust
   * font-synthesis
   * font-kerning
   * font-feature-settings
   * font-variant-numeric
   * font-variant-caps
   * font-variant-ligatures
   * font-variant-position
   * font-variant-alternates
   * font-variant-east-asian
   * font-language-override
   * text-align
   * text-decoration
   * vertical-align
   * text-underline-position
   * text-transform
   * white-space
   * line-height
   * line-break
   * word-break
   * word-wrap
   * word-spacing
   * letter-spacing
   * columns
   * column-count
   * column-width
   * column-gap
   * column-rule
   * column-rule-width
   * column-rule-style
   * column-rule-color
   * column-span
   * column-fill
   * mix-blend-mode
   * background-blend-mode
   * isolation
   */
  /** TODO CLIENT
   * printable window
   * display : file => page , stack or merge pages
   * psuedo link
   * customizable key binding
   * transform perspective
   * sync BOX Model inputs
   * directory tree
   * multi language
   * command line user interface
   * undo / redo by a screen
   * undo / redo by module , component
   * undo / redo (style)
   * css tree eg text-align  => left center right
   * wizard, easy menu
   * Sass
   * parse Real HTML
   * parse thymeleaf html template
   * SVG reinforcing
   * autocomplete
   * Append Func supports String
   * Append Func supports Function
   * save biz obj arr
   * table cell concat
   * split window
   * Edit supports ordinary wysiwyg html editors
   * animation editor
   * jQuery 3 support
   * bootstrap js support
   * Web Component
   * Component mixin
   * scalatest seleniumのコードの生成
   * dictionary
   */
  /** TODO SERVER
   * Websocket sharing
   * Master Slave system
   * Angularjs support => open another window ?
   */
  /** DONE
   * font-size
   * explorer window function
   * grid
   * style editor
   * css selector
   * style manager
   * screen tab
   * include resource json
   * tree diagram(using browser dev tool)
   * insert element
   * position fix,left,bottom,top,right
   * undo / redo (dimension)
   * dot by dot move
   * color editor
   * shadow box text
   * font-size
   * thumbnail (transform:scale)
   * scripting mode
   * bootstrap css support
   * serializing html function
   */
  // storage structure
  /**
   * saved data structure
   ** part_list
   ** part_list_selected
   ** prop_list
   ** prop_list_selected
   ** style_list
   ** style_list_selected
   ** monoColors
   ** gradColors
   ** save_s: name // quick save
   ** save_page_s: page, info
   ** save_dirs: positive name map
   ** TODO yet sent data to Server
   */

  // mod prototype
  // startsWith
  if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
      value: function(searchString, position) {
	      position = position || 0;
	      return this.lastIndexOf(searchString, position) === position;
	    },
      enumerable: false
    });
  }
  // flatMap
  if (!Array.prototype.flatMap){
    Object.defineProperty(Array.prototype, 'flatMap', {
      value: function(f, self){
        self = self || this;
        return this.reduce(function(ys, x){
          return ys.concat(f.call(self, x));
        }, []);
      },
      enumerable: false
    });
  }
  // mod prototype

  // Global key bind
  var fn_ctrlB = undefined;
  var fn_ctrlP = undefined;
  var fn_ctrlF = undefined;
  var fn_ctrlN = undefined;

  var FUNC_ID = "HtmlDeveloping";
  var MY_STORAGE = constructor_storage(FUNC_ID, localStorage);// TODO websocket
  var MAX_SAVE_SLOT_S = 16;
  var MY_NODE_SEP = '-';

  // Global vars : status , state
  var windows = {};
  var STATUS = getStatus();//get_child_tree_select_domがmy-obj-idがユニークであることに依存している
  var not_click = false;
  var is_suspend = false;
  var page_s = {};//
  var page_save_s = {};
  var page_trash = {};
  var command_undo_history = [];
  var command_redo_history = [];

  //複数形はsufixとして_sまたは､_s1. 多重配列は_s_sではなく_s2
  // Constants
  var DEFAULT_GRID_SIZE = 32;
  var CLASS_SELECTED = 'HDobjSelected';
  var CLASS_COPY = 'HDobjCopy';
  var CLASS_CUT = 'HDobjCut';
  var CLASS_HTMLIZE = 'htmlize';
  var CLASS_S = {"selected":CLASS_SELECTED, "copy":CLASS_COPY,"cut":CLASS_CUT,"htmlize":CLASS_HTMLIZE};
  var CLASS_ON_EDIT = 'HDobjOnEdit';
  var CLASS_EDIT_DATA = 'HDobjEditData';
  var CLASS_POSITION = 'HDobjPositioning';
  var エクスプローラー表示対象クラス = 'HDnow-displaying-class';
  var CLASS_EXPLORER_CONTAINER = 'HDpageContainer';
  var CLASS_TRASH_PAGE = 'HDtrashPage';
  var CLASS_SCREEN_SAVE = 'HDScreenSaved';
  var CLASS_SELECTED_BTN_PAGE = 'HDselectedScrnBtn';

  var TAG_LAYER_SEP = '>';
  var LOOP_HLD = '*';
  var SBL_HLD = '+';
  var DEFAULT_WIDTH = 100;
  var DEFAULT_HEIGHT = 100;
  var DISTANT_HEIGHT = 10;
  var NEW_WIDTH = 480;
  var MIN_HEIGHT = 15;

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var XLink_NS = 'http://www.w3.org/1999/xlink';

  var NOP = function(){return null;};

  // mode
  var NMS_EDIT = '.edit';
  var MODE_EDIT = 'EditMode';
  // my events
  var MY_CLICK = 'click'+NMS_EDIT;
  var MY_CHANGE = 'change'+NMS_EDIT;
  var MY_KEYUP = 'keyup'+NMS_EDIT;
  var MY_MOUSEOUT = 'mouseout'+NMS_EDIT;
  var MY_FOCUS = 'focus'+NMS_EDIT;
  var MY_INIT = FUNC_ID + '_INIT';

  // settings
  var tag毎の入力規則 ={"input":{"require_s":["type", "value"],"default":{"type":"text", "value":""}},"svg":{"require_s":["xmlns"],"default":{"xmlns":SVG_NS}}};
  var draggableとresizableが同時には正常に動かないためwrapするタグ = ["input","select","textarea","ol" ,"ul","svg", "button"];
  var 必ず子要素のタグ = ["tbody","thead","tr","td","th","li","option"];
  var サイズを持たせないタグ = ["table","tbody","thead","tr"];
  var resizableのみ対象のタグ = [];
  var HTML5のタグには無い文字 = ["$",";","(",")","+","@","[","]","{","}","/","\\",">","<",",",".","#","%","&","'",'"',"=","^","~","|"];
  var 直接文字編集可能タグ = ["input","textarea"];
  var 単一タグ = ["input","br","hr","img"];
  var 各タグ毎の初期サイズ = {"input":{"width":70,"height":30},"td":{"width":70,"height":30},"th":{"width":70,"height":30}};
  var 関数タグの対象外css_selector = ["id","class","type"];
  var HTML出力時に削除するAttr_s = ["data-myhd-htmlize-target","data-myhd-node-id","data-myhd-obj-id","data-myhd-obj-val","data-conns"];
  var HTML出力時に削除するclass_s = ["htmlize","snap","snap_border","data-conns","wrapped","wrapper","ui-resizable-autohide","ui-draggable","ui-draggable-handle","ui-resizable"];
  var position_relative禁止タグ = ["th","td"];//IE Chromeniにバグあり｡FirefoxはOK
  var 互いに排他の機能_s = ["copy","cut"];
  var 互いに排他機能のCLASSを含まないセレクタ = '';// 初期化がなされる
  var css結合子 = [" ", "+", "~", ">"];

  // util
  var el_func_json_val = $('.json_val');

  // main menu singleton
  var el_basic_menu = $('body > #basic_menu');
  var el_basic_menu_operator = $('#basic_menu_operator', el_basic_menu);
  var el_basic_menu_forward = $('#basic_menu_forward', el_basic_menu)
	    .on(MY_INIT, function(){
		    el_basic_menu
		      .data('right', parseInt(el_basic_menu.css('right'), 10))
		      .data('original-height', el_basic_menu.height());
	    })
    .on(MY_CLICK, function(){
		  var original = el_basic_menu.data('right');
		  var btn_posi = parseInt(el_basic_menu_operator.css('left'), 10);
		  if(btn_posi < 720){
		    btn_posi += NEW_WIDTH;
		    el_basic_menu_operator.css('left', "+="+NEW_WIDTH);
		    el_basic_menu.css({"right":original+'px', "left":"auto", "width":"+="+NEW_WIDTH});
		  }
		  if(parseInt(el_basic_menu.height(), 10) <= MIN_HEIGHT){
		    el_basic_menu
			    .css({"height":el_basic_menu.data('original-height')+'px'});
		  }
	  }).trigger(MY_INIT);
  var el_basic_menu_backward = $('#basic_menu_backward', el_basic_menu)
    .on(MY_CLICK, function(){
		  var original = el_basic_menu.data('right');
		  var btn_posi = parseInt(el_basic_menu_operator.css('left'), 10);
		  if(btn_posi > 0){
		    el_basic_menu_operator.css('left', "-="+NEW_WIDTH);
		    el_basic_menu.css({"right":original+'px', "left":"auto", "width":"-="+NEW_WIDTH});
		  }else if(parseInt(el_basic_menu.height(), 10) > MIN_HEIGHT){
		    el_basic_menu
			    .data('original-height', el_basic_menu.height())
			    .css({"height":MIN_HEIGHT+'px'});
		  }else{
		    el_basic_menu
			    .css({"height":el_basic_menu.data('original-height')+'px'});
		  }
	  });
  var el_header_menu_bar = $('body > header > #header_menu_bar');
  var el_val_tag = $('#ValTag', el_basic_menu);
  var el_del_val_tag = $('#delValTag', el_basic_menu).on(MY_CLICK, function(){el_val_tag.val('');});

  var el_repeatTimes = $('#repeatTimes');
  var el_repeatTimesBtn = $('#repeatTimesBtn').on(MY_CLICK,function(){
	  var nowTagVal = el_val_tag.val();
	  var lastTagVal = nowTagVal.split('>').pop().split('+').pop();
	  var lastIndex = lastTagVal.indexOf('*');
	  var repeatTimes = el_repeatTimes.val();
	  repeatTimes = repeatTimes === '0' ? '?' : repeatTimes;
	  if(lastIndex < 0){
	    el_val_tag.val(nowTagVal + '*' + repeatTimes);
	  }else{
	    el_val_tag.val(nowTagVal.slice(0, lastIndex - lastTagVal.length) + '*' + repeatTimes);
	  }
  });
  var el_val_array_json = $('#ValArrayJSON', el_basic_menu);
  var el_del_val_array_json = $('#delValArrayJSON', el_basic_menu).on(MY_CLICK, function(){
	  el_val_array_json.val('');
  });
  var el_footer_menu_bar = $('body > footer > #footer_menu_bar', el_footer_menu_bar);
  var el_selected_val_tag = $('#SelectedValTag', el_footer_menu_bar);
  var el_selected_val_prop_json = $('#SelectedValPropJSON', el_footer_menu_bar);

  var el_some_key_s = ["part_list", "prop_list", "style_list", "script_list"];
  var el_some_list = {};
  var el_some_input = {};
  var el_some_name = {};
  var el_some_func_suffix_s = ["reg","select","del","name","new"];
  el_some_key_s.forEach(function(x,i,a){
	  el_some_list[x] = $('#'+x);
	  el_some_input[x] = $('#'+x+'_input');
	  el_some_name[x] = $('#'+x+'_name');
  });
  var el_sandbox_style_screen_area = $('#sandbox_style', el_basic_menu);
  var el_sandbox_hidden = $('#sandbox_hidden', el_header_menu_bar);
  var el_float_menu = $('.float_menu').resizable({"autoHide":true,"minWidth":80}).draggable({"handle":".menuHandler"});

  var el_sandbox_screen =  $('#sandbox_screen');
  var el_func_new_filter_page = $('#func_new_filter_page')
    .on(MY_CLICK, function(){
	    var name = el_new_page.val().trim();
      if (!name){
        // TODO alert required
        return ;
      }
      // TODO check dupe
      // page_sにあり、trashでなければ、NA
      // page_sにあり、trashならば、上書き

	    var btn_page = createPage(name, el_filterPageList);
	    if(!btn_page){return ;}
	    setNowPage(btn_page.btn, btn_page.page);
	    btn_page.btn.trigger(MY_CLICK);
    });

  var el_func_delete_selected_page = $('#func_delete_selected_page')  // pageをゴミ箱へ移す
      .on(MY_CLICK, function(){
        var pageBtn = el_filterPageList.find('.' + CLASS_SELECTED_BTN_PAGE);
        var btnName = pageBtn.val();
        if (btnName){
          pageBtn.detach().appendTo(el_trashPageList);
          var targetPage = page_s[btnName];
          putInExplorer(CLASS_TRASH_PAGE, targetPage.screen);
          delete page_s[btnName];
          page_trash[btnName] = targetPage;
        }// else {// Root selected
      });

  var el_func_open_trash = $('#func_open_trash').on(MY_CLICK, function(){
    refreshExplorerSpace(CLASS_TRASH_PAGE);
  });

  var el_load_presetFile = $('#HDload_presetFile');
  var el_load_presetBtn = $('#HDload_presetBtn').on(MY_CLICK,function(){
	  var name = el_load_presetFile.val();
	  if(name.endsWith('.json')){//TODO now Developing
	    $.getJSON(name)
		    .done(function(res){
		      if(res.hasOwnProperty('style')){
			      var pool = '';
			      res.style.forEach(function(selector_attr_val,i,a){
			        Object.keys(selector_attr_val).forEach(function(selector,i,a){
				        pool += selector+'{\n';
				        var attr_val = selector_attr_val[selector];
				        Object.keys(attr_val).forEach(function(attr,i,a){
				          pool += '  '+attr+':'+attr_val[attr]+';\n';
				        });
				        pool+='}\n';
			        });
			      });
			      el_sandbox_style_screen_area.val(pool);
		      }
		      if(res.hasOwnProperty('child_s')){
			      res.child_s.forEach(function(data,i,a){
			        display_onscreen('appendTo', nowPage.screen, data);
			      });
		      }
		    });
	  }
  });

  var el_func_new_base_page = $('#func_new_base_page').on(MY_CLICK, function(){
	  var name = el_new_page.val().trim();
	  var btn_dir = createBasePage(name);
  });
  var el_new_page = $('#new_page_name');
  var el_style = $('style#MyEditableStyle');
  var el_script = $('#MyEditableScript');
  var el_now_selected = {};

  // operator menu
  var el_oprt_model = $('#oprt_model').each(function(){
	  var _this = $(this);
	  _this.data('my-default-prop_s', {"style":_this.attr('style')});
  });
  var el_operate_option = $('#operate_option');
  var el_oprt_value = $('#oprt_value');
  var oprt_type = {
	  "size":{"l":sizeFuncSupplier("width", "-="), "u":sizeFuncSupplier("height", "+="), "r":sizeFuncSupplier("width", "+="), "d":sizeFuncSupplier("height", "-=")},
	  "position":{"l":positionFuncSupplier('left', '-='), "u":positionFuncSupplier('top', '-='), "r":positionFuncSupplier('left', '+='), "d":positionFuncSupplier('top', '+=')},
	  "rotateXY":{"l":transformFuncSupplier('rotateY', '-'), "u":transformFuncSupplier('rotateX', '+'), "r":transformFuncSupplier('rotateY', '+'), "d":transformFuncSupplier('rotateX', '-')},
	  "rotateZ":{"l":transformFuncSupplier('rotate', '-'), "u":transformFuncSupplier('rotateZ', '-'), "r":transformFuncSupplier('rotate', '+'), "d":transformFuncSupplier('rotateZ', '+')}
  };
  var els_openCloseTrigger = $('.openCloseTrigger').on(MY_CLICK,function(){
	  $(this)
	    .toggleClass('hiddenState')
	    .siblings('.openCloseTarget').toggleClass('displayNone');
  }).on(MY_INIT, function(){
	  var _this = $(this);
	  var nowStr = _this.text();
	  $('<span>').text('_______').css({"color":"transparent"}).appendTo(_this);
	  // width, height  1/2 font
	  _this.css('width', (nowStr.length/2+1)+'em');
  }).trigger(MY_INIT);
  //Box Model
  var el_transform_scale = $('#transform_scale').on(MY_CLICK+' '+MY_KEYUP, function(){
	  var scaleVal = $(this).val() / 100;
	  var cssFunc = transformFuncSupplier('scale');
	  cssFunc(el_oprt_model, scaleVal);
	  for(var key in el_now_selected) if(el_now_selected.hasOwnProperty(key)){
	    cssFunc(el_oprt_model, scaleVal, el_now_selected[key]);
	  }
  });
  var els_box_xyz = {};
  var els_xyz = $('.xyz').on(MY_CLICK+' '+MY_CHANGE, function(){
	  var _this = $(this);
	  var css = _this.attr('id');
	  var cssVal = _this.val();
	  cssVal = $.isNumeric(cssVal) ? cssVal+'px' : cssVal;
	  el_oprt_model.css(css, cssVal);
	  for(var key in el_now_selected) if(el_now_selected.hasOwnProperty(key)){
	    el_now_selected[key].css(css, cssVal);
	  }
  }).on(MY_INIT, function(){
	  var _this = $(this);
	  var css = _this.attr('id');
	  els_box_xyz[css] = _this;
  }).trigger(MY_INIT);

  var els_shadows = {};
  ["box-shadow", "text-shadow"].forEach(function(cssStr,i,a){
	  els_shadows[cssStr] = $('.'+cssStr);
	  els_shadows[cssStr].on(MY_CLICK+' '+MY_CHANGE+' '+MY_KEYUP, function(){
	    var cssVal = ' ';
	    els_shadows[cssStr].each(function(){
		    cssVal += ' '+$(this).val()+'px';
	    });
	    cssVal += ' black';
	    el_oprt_model.css(cssStr, cssVal);
	    for(var key in el_now_selected) if(el_now_selected.hasOwnProperty(key)){
		    el_now_selected[key].css(cssStr, cssVal);
	    }
	  });
  });

  // Color edit
  var el_colors = {};
  var els_colorEdit;
  var el_operate_color_option = $('#operate_color_option');
  var el_transparent = $('#transparent').on(MY_CHANGE, function(){
	  if(el_transparent.prop('checked')){
	    update_prop(el_oprt_model, {"style":'background-color:transparent;'});
	    for(var key in el_now_selected) if(el_now_selected.hasOwnProperty(key)){
		    update_prop(el_now_selected[key], {"style":'background-color:transparent;'});
	    }
	  }else{
	    els_colorEdit.trigger(MY_CHANGE);
	  }
  });

  function extractColor(){
	  var _this = $(this);
	  var colorExp = _this.css('background-color').trim();
	  var colorRgba = _this.css('background').trim();
	  if(colorExp.startsWith('#')){
	    colorExp = colorExp.substring(1);
	  }else if(colorExp.startsWith('rgb(')){
	    colorExp = colorExp.slice('rgb('.length, -1).split(',').map(function(x,i,a){
		    return parseFloat(x.trim(), 10);
	    });
	    colorExp.push(1);
	    els_colorEdit.each(function(idx){
		    $(this).val(colorExp[idx]);
	    });
	  }else if(colorExp.startsWith('rgba(')){
	    colorExp = colorExp.slice('rgba('.length, -1).split(',').map(function(x,i,a){
		    return parseFloat(x.trim(), 10);
	    });
	    els_colorEdit.each(function(idx){
		    $(this).val(colorExp[idx]);
	    });
	  }else{
	    return ;
	  }
	  el_color16.val(colorExp.splice(0, 3).map(function(obj){
	    var color = obj.toString(16);
	    return color.length === 1 ? '0'+color : color;
	  }).join('')).trigger(MY_CHANGE);
  }
  var el_trashPalette = $('#trashPalette').sortable({"revert":true, "delay":700, "connectWith":".palette", "receive":function(){
	  var kept = [];
	  var newTrashColor;
	  $(' > div', this).each(function(){
	    var _this = $(this);
	    if(_this.hasClass('newColor')){
		    _this.remove();
		    return true;
	    }else if(_this.hasClass('monoColor')){
		    newTrashColor = _this.css('background-color');
		    _this.removeClass('monoColor');
	    }
	    kept.push(_this);
	  });
	  $(' > div', el_colorPalette).each(function(){
	    var _this = $(this);
	    if(_this.css('background-color') === newTrashColor){
		    _this.remove();
	    }
	  });
	  if(kept.length > 3){
	    kept[0].remove();
	  }
  }}).on(MY_CLICK, 'div', extractColor);

  var el_gradPalette = $('#gradPalette').sortable({"revert":true, "connectWith":"#colorPalette", "placeholder":".HDobjCopy", "delay":700})
	  .trigger('initColor');
  var el_colorPalette = $('#colorPalette').sortable({"helper":"clone","revert":true, "connectWith":"#trashPalette",  "placeholder":".HDobjCopy", "delay": 700, "receive":function(){
	  var thisPalette = $(this);
	  var removing = [];
	  var hasColors = {};
	  $(' > div', el_colorPalette).each(function(){
	    var _this = $(this);
	    var color = _this.css('background-color');
	    if(hasColors.hasOwnProperty(color)){
		    removing.push(_this);
	    }else{
		    hasColors[color] = true;
	    }
	  });
	  removing.forEach(function(x,i,a){
	    x.remove();
	  });
	  var save = [];
	  $(' > div', el_colorPalette).each(function(){
	    var _this = $(this);
	    var myColor = _this.css('background-color');
	    _this.remove();
	    $('<div class="colorObj monoColor">')
		    .draggable({"helper":"clone","connectToSortable":".palette", "revert":"invalid"})
		    .css({"float":"left", "margin": "1px", "width":"32px", "height":"32px", "background-color":"rgb("+myColor+")", "right":"auto", "bottom":"auto"})
		    .html('&nbsp;&nbsp;&nbsp;&nbsp;').appendTo(thisPalette);
	    _this.removeClass('newColor');
	    save.push(myColor);
	  });
	  MY_STORAGE.transaction()
	    .replace('monoColors', save)
	    .commit();
  }})
	  .on(MY_CLICK, 'div', extractColor)
	  .on('initColor', function(){
		  var _this = $(this);
		  var monoColors = orDefault(MY_STORAGE.select('monoColors'), []).concat(["255,255,255", "255,0,0", "255,135,25", "255,215,0", "255,240,0", "173,255,47", "0,255,0","60,205,60", "0,15,255", "0,0,255", "0,0,139", "128,0,128", "148,0,195", "75,0,130",  "0,0,0"]);
		  monoColors.map(function(x, i, a){
		    x = x.replace(/\s/g, '');
		    if(x.startsWith('rgb')){
			    x = x.slice(x.indexOf('(') + 1, x.indexOf(')'));
		    }
		    return x;
		  }).filter(function(x,i,a){
		    if(x === 'transparent'){return false;}
		    return a.indexOf(x) === i;// rm dupe
		  }).forEach(function(x,i,a){
		    $('<div class="colorObj monoColor">')
			    .draggable({"helper":"clone","connectToSortable":".palette", "revert":"invalid"})
			    .css({"float":"left", "margin": "1px", "width":"32px", "height":"32px", "background-color":"rgba("+x+")", "right":"auto", "bottom":"auto"})
			    .html('&nbsp;&nbsp;&nbsp;&nbsp;').appendTo(_this);
		  });

	  })
	  .trigger('initColor');

  var el_color16Display = $('#color16Display').draggable({"helper":"clone", "connectToSortable":".palette", "revert":"invalid"});
  var el_color16 = $('#color16').on(MY_CLICK+' '+MY_CHANGE+' '+MY_KEYUP,function(){
	  var _this = $(this);
	  var colorHex = _this.val();
	  if(colorHex.length === 6){
	    var colors = ['red', 'green', 'blue'];
	    var forDisplay = [];
	    colorHex2Decimals(colorHex).forEach(function(x,i,a){
		    var clr = parseInt(x, 10);
		    el_colors[colors[i]].val(clr);
		    forDisplay.push(clr) ;
	    });
	    forDisplay.push(el_alpha.val());
	    el_color16Display.css('background-color', 'rgba('+forDisplay.join(',')+')');
	    els_colorEdit.trigger(MY_CHANGE);
	  }
  }).on('colorChangeOnly', function(){
	  var _this = $(this);
	  var colors = ['red', 'green', 'blue'];
	  var forDisplay = [];
	  var colorHex = _this.val();
	  colorHex2Decimals(colorHex).forEach(function(x,i,a){
	    var clr = parseInt(x, 10);
	    el_colors[colors[i]].val(clr);
	    forDisplay.push(clr) ;
	  });
	  forDisplay.push(el_alpha.val());
	  el_color16Display.css('background-color', 'rgba('+forDisplay.join(',')+')');
  });
  var el_alpha = $('#alpha');
  els_colorEdit = $('.colorEdit')
	  .each(function(){
	    var _this = $(this);
	    el_colors[_this.attr('id')] = _this;
	  }).on(MY_CHANGE+' '+MY_KEYUP+' '+MY_CLICK, function(){
	    var _this = $(this);
	    var id = _this.attr('id');
	    var val = _this.val();
	    if(id === 'red'){
		    _this.next().css('background-color', 'rgba('+val+',0,0,1)');
	    }else if(id === 'green'){
		    _this.next().css('background-color', 'rgba(0,'+val+',0,1)');
	    }else if(id === 'blue'){
		    _this.next().css('background-color', 'rgba(0,0,'+val+',1)');
	    }
	    el_oprt_model
		    .data('bgc-'+id, val);
	    var newBgColor = el_transparent.prop('checked') ? 'transparent' : 'rgba('+el_oprt_model.data('bgc-red')+','+ el_oprt_model.data('bgc-green')+','+ el_oprt_model.data('bgc-blue')+','+ el_oprt_model.data('bgc-alpha')+')';
	    var css = el_operate_color_option.val();
	    if(css.startsWith('background')){
		    newBgColor = {"style":css + ':'+ newBgColor+';background:;'};
	    }else if(css === 'box-shadow' || css === 'text-shadow'){
		    var coord = [];
		    els_shadows[css].each(function(){
		      var _this = $(this);
		      coord.push(_this.val()+'px ');
		    });
		    newBgColor = {"style":css + ':'+ coord.join('')+newBgColor+';'};
	    }else{
		    newBgColor = {"style":css + ':'+ newBgColor+';'};
	    }
	    update_prop(el_oprt_model, newBgColor);
	    for(var key in el_now_selected) if(el_now_selected.hasOwnProperty(key)){
		    update_prop(el_now_selected[key], newBgColor);
	    }

	    var c16 = parseInt(el_colors['blue'].val(), 10).toString(16);
	    c16 = c16.length === 1 ? '0'+c16:c16;
	    c16 = parseInt(el_colors['green'].val(), 10).toString(16)+c16;
	    c16 = c16.length === 3 ? '0'+c16:c16;
	    c16 = parseInt(el_colors['red'].val(), 10).toString(16)+c16;
	    c16 = c16.length === 5 ? '0'+c16:c16;
	    el_color16.val(c16).trigger('colorChangeOnly');
	  }).trigger(MY_CHANGE);

  // Grad
  var el_delGrad = $('#delGrad').on(MY_CLICK, function(){
	  $('.gradSelected', el_colorGrads).remove();
	  var save = [];
	  $('.gradColor', el_colorGrads).each(function(){
	    var _this = $(this);
	    save.push(_this.data('originalGradColor'));
	  });
	  MY_STORAGE.transaction()
	    .replace('gradColors', save)
	    .commit();
  });
  var el_colorGrads = $('#colorGrads').on(MY_CLICK,'.gradColor',function(){
	  var _this = $(this);
	  var newBgColor = {"style":'background:'+analysisCss(_this.attr('style'))['background']+';'};
	  update_prop(el_oprt_model, newBgColor);
	  for(var key in el_now_selected) if(el_now_selected.hasOwnProperty(key)){
	    update_prop(el_now_selected[key], newBgColor);
	  }
	  var colorStr = _this.data('originalGradColor');
	  var split = split_ignore_nest(colorStr.slice('linear-gradiend('.length, -1),',',[["(",")"]]).map(function(obj){
			return obj.trim();//remove ,
		});
	  // analysis, redisplay
	  var direct = split[0].trim();
	  var colors = split;//spliceだとside effectの所為でdataが壊れる
	  if(direct.endsWith('deg')){direct = direct.slice(0, -'deg'.length);}
	  $('.monoColor', el_gradPalette).remove();
	  colors.forEach(function(myColor,i,a){
	    if(i === 0){return;}
	    $('<div class="colorObj monoColor">')
		    .draggable({"connectToSortable":".palette", "revert":"invalid"})
		    .css({"float":"left", "margin": "1px", "width":"32px", "height":"32px", "background-color":"rgb("+myColor+")", "right":"auto", "bottom":"auto"})
		    .html('&nbsp;&nbsp;&nbsp;&nbsp;').appendTo(el_gradPalette);
	  });
	  el_directionGrad.val(direct);
  })
	  .on('contextmenu','.gradColor',function(ev){// select grad color
		  ev.preventDefault();
		  ev.stopPropagation();
		  var _this = $(this);
		  _this.toggleClass('gradSelected');
	  })
	  .on(MY_INIT, function(){
		  var _this = $(this);
		  orDefault(MY_STORAGE.select('gradColors'), []).forEach(function(colorStr,i,a){
		    if(isEmpty(colorStr)){return true;}
		    createGradObject(colorStr, _this);
		  });
	  }).trigger(MY_INIT);
  var el_directionGrad = $('#directionGrad');
  var el_addGrad = $('#addGrad').on(MY_CLICK,function(){
	  var colors = $(' > div', el_gradPalette);
	  var save = orDefault(MY_STORAGE.select('gradColors'), []);
	  if(colors.length >= 2){
	    var arrayColor = [];
	    colors.each(function(){
		    var _this = $(this);
		    arrayColor.push(_this.css('background-color'));
	    });
	    var colorStr = "linear-gradient("+el_directionGrad.val()+"deg, "+arrayColor.join(',')+")";
	    save.push(colorStr);
	    createGradObject(colorStr, el_colorGrads);
	  }
	  colors.each(function(){
	    var _this = $(this);
	    save.push(_this.css('background'));
	  });
	  MY_STORAGE.transaction()
	    .replace('gradColors', save)
	    .commit();
  });

  function createGradObject(colorStr, target){
	  $('<div class="gradColor">').data('originalGradColor', colorStr).css({"width":"96px", "height":"2em","margin":"3px", "float":"left","border-left":"16px solid white", "background":colorStr}).appendTo(target);
  }
  // context menu
  var context_menu = $('#context_menu');

  // Fields
  // func
  var func_name_s = [
	  {"name":"html", "label":"", "input":'', "style":""},
	  {"name":"style", "label":"", "input":'', "style":""},
	  {"name":"script", "label":"", "input":'', "style":""},
	  {"name":"modelCssApply", "label":"", "input":'', "style":""},
	  {"name":"modelCssReset", "label":"", "input":'', "style":""},
	  {"name":"append", "label":"Append", "input":'', "style":"", "col2":false},

	  {"name":"edit", "label":"Edit","input":'<span id="EditMode" style="margin-left:2em;"></span>', "style":"", "col2":false},
	  {"name":"select", "label":"Sel", "input":'<select id="parent_list" style=""></select><input type="text" id="SelectedMyObjId" class="" style="width:10em;ime-mode:disabled;float:right;height:28px;"/><br><input type="text" id="AppendCssSelector" class="" style="width:18.5em;ime-mode:disabled;margin-left:1em;float:right;height:28px;" placeholder="append css selector" />', "style":"height:5em;", "col2":true},
	  {"name":"update_var", "label":"Up var ", "input":'<input type="text" id="SelectedValArrayJSON" class="" style="width:10em;height:24px;"/>', "style":"", "col2":true},
	  {"name":"update_prop", "label":"Up prop ", "input":'<input type="text" id="updateAttr" class="" style="width:3.5em;height:24px;"/><input type="text" id="updateAttrValue" class="" style="width:9.5em;height:24px;"/>', "style":"", "col2":true},
	  {"name":"copy", "label":"Copy", "input":'', "style":"", "col2":false},
	  {"name":"cut", "label":"Mv (Cut)", "input":'', "style":"", "col2":false},
    //	{"name":"pasteInsertBefore", "label":"PstBefore", "input":'', "style":"", "col2":false},
	  {"name":"pasteAppend", "label":"Paste Append", "input":'', "style":"", "col2":false},
	  {"name":"pasteInsertAfter", "label":"Paste After", "input":'', "style":"", "col2":false},
	  {"name":"delete", "label":"rm (Delete)", "input":'', "style":"", "col2":false},
	  {"name":"save", "label":"", "input":'', "style":""},
	  {"name":"load", "label":"", "input":'', "style":""},
	  {"name":"register_part", "label":"Register", "input":'', "style":"", "col2":false},
	  {"name":"cxlselected", "label":"Cxl Select", "input":'', "style":"", "col2":false},
	  {"name":"positionFix", "label":"Fix Position", "input":'', "style":"", "col2":false},
	  {"name":"undo", "label":"Undo Structure", "style":"", "col2":false},
	  {"name":"redo", "label":"Redo Structure", "style":"", "col2":false}
  ];

  //init
  // Directory / Explorer
  var el_explorer = $('#HDexplorer');
  el_explorer
	  .data('parent', el_explorer.children('section'))
	  .data('brother',el_explorer.find('.menuHandler'))
	  .resizable({"autoHide":true,"minWidth":80,
			          resize:function(ev, ui){
			            el_explorerSpace
				            .height(el_explorer.data('parent').innerHeight() - el_explorer.data('brother').outerHeight());
			          }
		           })
	  .draggable({"handle":".menuHandler"});
  var el_explorerSpace = $('#HDexplorerSpace');
  var el_pageSpace = $('#HDpageSpace');
  var el_pageRoot = $('#HDpageRoot');
  var el_basePageList = $('#HDbasePageList');
  var el_filterPageList = $('#HDfilterPageList');
  var el_trashPageList = $('#HDtrashPageList');
  // page
  var el_HtmlDeveloping = $('#HtmlDeveloping');
  var nowPage;
  var el_func_s = {};
  var el_ObjectName = isEmpty(el_ObjectName) ? $('#ObjectName') : el_ObjectName;
  var ROOT_BTN_PAGE = createPage('Root', el_pageRoot, 'dir');

  (function(){
	  context_menu.css({"left":0,"top":0,"position":"absolute","z-index":60000,"padding-left":"2.5em","display":"none", "background-color":"white", "box-shadow": "5px 5px 15px #000000", "border-radius":"5px"});
	  setNowPage(ROOT_BTN_PAGE.btn, ROOT_BTN_PAGE.page);

    // loading saved pages
	  var savedPages = MY_STORAGE.select('save_page_s') || {}; //
    Object.keys(savedPages).forEach(function(pageName,i,a){
      var loadedPage = createPage(pageName, el_filterPageList);
	    display_onscreen('appendTo', loadedPage.page.screen, savedPages[pageName].page);
    });

	  var child;
	  var isNewChild = true;
	  var li_s;
	  func_name_s.forEach(function(obj,a){
	    if(isEmpty(obj.label)){
		    el_func_s[obj.name] = $('#func_'+obj.name+'_element');
		    return;
	    }
	    el_func_s[obj.name] = $('<input type="button" id="func_'+obj.name+'_element" value="'+obj.label+'" class="menu_button" style="display:none;">').appendTo(el_header_menu_bar);
	    if(isNewChild){
		    child = $('<li style="clear:both;">');
		    child.appendTo(context_menu);
	    }
	    var defa_size = 9;
	    if(obj.col2){
		    defa_size *= 2;
	    }
	    if(!obj.col2){
		    isNewChild = !isNewChild;
	    }

	    var btn = $('<div class="func_'+obj.name+'">').attr("style", merge_css('float:left;width:'+defa_size+'em;height:2em;', obj.style));
	    child.append(btn.append(obj.label)
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
	  context_menu.el_func_cancel_selected = $('#func_cxlselected_element', context_menu);
	  context_menu.el_selected_val_array_json = $('#SelectedValArrayJSON', context_menu)
	    .hover(function(){
		    context_menu.is_close_menu = false;
	    },function(){
		    context_menu.is_close_menu = true;
	    });
	  context_menu.el_edit_mode = $('#'+MODE_EDIT).html('start');
	  context_menu.el_selector = $('#SelectedMyObjId', context_menu).on(MY_CLICK, function(ev){
	    ev.stopPropagation();
	  });
	  context_menu.append_css_selector = $('#AppendCssSelector').on(MY_CLICK, function(ev){
	    ev.stopPropagation();
	  });
	  context_menu.parent_list = $('#parent_list').on(MY_CHANGE +' '+ MY_CLICK,function(ev, obj){
	    ev.stopPropagation();
	    var _this = myWrapElement(this);
	    context_menu.el_selector.val(_this.val());
	    // el_func_s['cxlselected'].trigger(MY_CLICK);// 複数tableが選択し辛くなるため、無効化コメントアウト
	  });
	  context_menu.el_updateAttr = $('#updateAttr').on(MY_CLICK,function(ev){
	    ev.preventDefault();
	    ev.stopPropagation();
	  })
    //	    .autocomplete()
	  ;
	  context_menu.el_updateAttrValue = $('#updateAttrValue').on(MY_CLICK,function(ev){
	    ev.preventDefault();
	    ev.stopPropagation();
	  });
  })();

  // operator
  function sizeFuncSupplier(css, func){
	  return function(model, org_val, candidate){
	    var op_val = $.isNumeric(org_val) ? org_val+'px':org_val;
	    if(arguments.length >= 3){
		    var target = candidate;
	    }else{
		    target = model;
	    }
	    var val = isEmpty(func) ? op_val+'px' : func+op_val;
	    target.css(css, val);
	    els_box_xyz[css].val(parseInt(target.css(css), 10));
	  };
  }

  var counter_css = {"top":"bottom", "bottom":"top", "left":"right", "right":"left"};
  var counter_operator = {"+=":"-=", "-=":"+="};
  function positionFuncSupplier(css, func){
	  return function(model, org_val, candidate){
	    var op_val = $.isNumeric(org_val) ? org_val+'px':org_val;
	    if(arguments.length >= 3){
		    var target = candidate;
	    }else{
		    target = model;
	    }

	    var css_parts = target.data('my-org-prop_s').style.trim().split(';');
	    var part;
	    css_parts.forEach(function(x,i,a){
		    if(x.startsWith(css)){
		      part = x.split(':')[1].trim();
		      return false;
		    }
	    });
	    if(isEmpty(part) || part === 'auto'){
		    var counter_part_css = counter_css[css];
		    var counter_part = target.css(counter_part_css);
		    if(isEmpty(counter_part) || counter_part === 'auto' ){return '';}
		    target.css(counter_part_css, counter_operator[func]+op_val);
	    }else{
		    target.css(css, func+op_val);
	    }
	  };
  }
  function cssFuncSupplier(css, oprt, dim){
	  if(dim === undefined){dim = '';	}
	  return function(original, op_val, target){
	    if(arguments.length === 3){
		    target.css(css, oprt+op_val);
	    }else if(arguments.length === 2){
		    original.css(css, oprt+op_val);
	    }
	  };
  }

  function transformFuncSupplier(css, func){
	  return function(original, op_val, selected){
	    var target;
	    if(arguments.length >= 3){
		    target = selected;
	    }else if(arguments.length === 2){
		    target = original;
	    }
	    if(target.data('transform') === undefined){
		    var emptyObj = {};
		    emptyObj[css] = 0;
		    target.data('transform', emptyObj);
	    }
	    var cssObj = target.data('transform');
	    if(cssObj[css] === undefined){
		    cssObj[css] = 0;
	    }
	    if(css.startsWith('scale')){
		    cssObj[css] = op_val;
	    }else {
		    cssObj[css] = reverse_porlish_notation( parseInt(cssObj[css], 10) +' '+ parseInt(op_val, 10)+' '+func);
	    }
	    target.data('transform', cssObj);

	    var newCss = '';
	    for(var key in cssObj) if(cssObj.hasOwnProperty(key)){
		    if(key.startsWith('rotate')){
		      newCss += key+'('+cssObj[key]+'deg) ';
		    }else{
		      newCss += key+'('+cssObj[key]+') ';
		    }
	    }
	    target.css('transform', newCss);
	  };
  }

  el_operate_option.on(MY_CHANGE,function(){
	  el_operate_option.data("now_type", oprt_type[el_operate_option.val()]);
  }).trigger(MY_CHANGE);
  var opt_func_s = {};
  var els_oprt = $('.oprt').each(function(){
	  var _this = $(this);
	  var cmd = _this.attr('id').split('_')[1];
	  _this.on(MY_CLICK, function(){
	    var cssFunc = el_operate_option.data("now_type")[cmd];
	    if(cssFunc === undefined ){return;}
	    var op_val = el_oprt_value.val();
	    cssFunc(el_oprt_model, op_val);
	    for(var key in el_now_selected) if(el_now_selected.hasOwnProperty(key)){
		    cssFunc(el_oprt_model, op_val, el_now_selected[key]);
	    }
	  });
	  if(cmd === 'l'){fn_ctrlB = function(){_this.trigger(MY_CLICK);};}
	  if(cmd === 'u'){fn_ctrlP = function(){_this.trigger(MY_CLICK);};}
	  if(cmd === 'r'){fn_ctrlF = function(){_this.trigger(MY_CLICK);};}
	  if(cmd === 'd'){fn_ctrlN = function(){_this.trigger(MY_CLICK);};}
  });

  var els_borderRadiusX = $('.borderRadiusX');
  var els_borderRadiusY = $('.borderRadiusY');
  var el_borderRadiusDimension = $('#borderRadiusDimension');
  var els_borderRadius = $('.borderRadius').on(MY_CHANGE+' '+MY_CLICK,function(){
	  var brCss = '';
	  var dimension = el_borderRadiusDimension.val();
	  els_borderRadiusX.each(function(){
	    var _this = $(this);
	    brCss += _this.val()+dimension+' ';
	  });
	  brCss +='/';
	  els_borderRadiusY.each(function(){
	    var _this = $(this);
	    brCss += _this.val()+dimension+' ';
	  });
	  var cssFunc = cssFuncSupplier('border-radius', '');
	  if(cssFunc === undefined ){return;}
	  cssFunc(el_oprt_model, brCss);
	  for(var key in el_now_selected) if(el_now_selected.hasOwnProperty(key)){
	    cssFunc(el_oprt_model, brCss, el_now_selected[key]);
	  }
  });

  var els_boxDesign = $('.boxDesign').on(MY_CLICK+' '+MY_CHANGE,function(){
	  var _this = $(this);
	  var cmd = _this.attr('id');
	  var cssFunc = cssFuncSupplier(cmd, '');
	  if(cssFunc === undefined ){return;}
	  var op_val = _this.val();
	  op_val = $.isNumeric(op_val) ? op_val+'px':op_val;
	  cssFunc(el_oprt_model, op_val);
	  for(var key in el_now_selected) if(el_now_selected.hasOwnProperty(key)){
	    cssFunc(el_oprt_model, op_val, el_now_selected[key]);
	  }
  });

  function createPageDOM(name, adderClass, container, width, height){
	  var pageName = name.trim();
    var pageId = convPageId(pageName);
	  var now_id = STATUS.getNewMyObjId();
	  var _page = {};
	  _page.screen = $('<section id="'+pageId+'" class="'+adderClass+'" style="position:absolute;top:0px;bottom:44px;right:0px;z-index:100;width:'+width+';height:'+height+';" data-myhd-node-id="'+now_id+'" data-myhd-obj-id="'+now_id+'">')
	    .on('contextmenu', display_contextmenu)// on screen
	    .on(MY_CLICK,function(ev){
		    if(context_menu.is_close_menu){
		      context_menu.css({"display":"none"});
		    }
		    el_func_s.cxlselected.trigger(MY_CLICK);
	    }).data('name', name);
	  _page.prop_history = [];//TODO undo css
	  container[pageName] = _page;
	  return _page;
  }
  function convPageId(name){
	  return name ? 'HDpage' + name.trim() : 'temp';
  }

  /**
   * pageをつくる
   */
  function createPage(name, appendTarget, type, width, height){
	  if(!height){ height = '100%';}
	  if($.isNumeric(width)){ width +='px';}
	  if(!width){ width = '100%';}
	  var pageName = name.trim();
    var pageId = convPageId(name);
    var pageObj = null;
	  if(page_s.hasOwnProperty(pageName)){
	    console.log('There are the same name:' + name + ' .');
      pageObj = page_s[pageName];
	    return {"btn":$('#'+'HDbtn_'+name).data('page', pageObj), "page":pageObj};// TODO mod mutual
	  }
	  var adderClass = type === 'dir' ? 'HDpageClass HDbasePage ' : 'HDpageClass';
	  pageObj = createPageDOM(name, adderClass, page_s, width, height);
	  context_menu.is_close_menu = true;
	  var pageBtn  = $('<input id="HDbtn_'+name+'" class="func_page_change freeScrnBtn '+adderClass+'" type="button" value="'+name+'" />').data('page', pageObj).appendTo(appendTarget);
	  el_HtmlDeveloping.append(pageObj.screen);//TODO folder
	  el_ObjectName.html(pageObj.screen.data('name'));
	  return {"btn":pageBtn, "page":pageObj};
  }
  function createBasePage(name){
	  return createPage(name, el_basePageList, 'dir');
  }
  function display_contextmenu(ev, _x, _y){
	  ev.preventDefault();
	  ev.stopPropagation();
    var x = _x || - 50;
    var y = _y || - 30;
	  context_menu.css({"left":ev.pageX + x,"top":ev.pageY + y,"display":""});
  };
  // Directory
  function refreshExplorerSpace(clazz){
	  var preClass = el_explorerSpace.data('myhdDisplayClass');
	  if(preClass){
	    el_explorerSpace.removeClass(preClass);
	  }
	  el_explorerSpace.data('myhdDisplayClass', clazz);
    /* 表示、非表示の切替 #HDexplorerSpace.clazz > :not(.HDScreenSaved) {display: none;} */
	  el_explorerSpace.addClass(clazz).find('.explorerSelected').removeClass('explorerSelected'); // save dir の場合の選択解除
  }
  //  save dir
  var el_dirSave = $('#HDdirSave').data(エクスプローラー表示対象クラス, CLASS_SCREEN_SAVE).on(MY_CLICK,function(){
	  var _this = $(this);
	  refreshExplorerSpace(_this.data(エクスプローラー表示対象クラス));
  });

  /**
   * change screen.
   * @param clazz  explorer space on off start の表示切替クラス
   * @param minimizedScrn explorerに放り込む page.screen
   * @param exceptPageName 対象外ページ名 TODO 対象外ページ名から、clazzを引けるようにする
   */
  function putInExplorer(clazz, minimizedScrn, exceptPageName){
	  var pageName = minimizedScrn.data('name');
	  if(!pageName || pageName === exceptPageName){
	    return true;
	  }
	  minimizedScrn.css({"transform-origin":"0px 0px", "margin":"2px", "transform":"scale(0.125)", "height":""}).detach()
	    .find('.'+CLASS_SELECTED).removeClass(CLASS_SELECTED);
	  var explorerPageContainer = $('<div class="'+clazz+' explorerContainer">')
		  .css({"flex-basis":"320px", "height":"180px", "position":"relative", "overflow":"hidden", "border":"1px dotted grey", "margin":"4px"})
		  .append(minimizedScrn)
		  .append('<div class="explorerShim '+clazz+'" style="width:100%;height:100%;color:rgba(0,0,0,0.5);text-shadow:2px 2px 6px;font-size:24pt;position:absolute;top:0px;bottom:0px;left:0px;right:0px;margin:0px;z-index:1000000;"><div style="position:absolute;top:auto;bottom:0px;left:0px;right:0px;margin:auto;height:1.5em;width:100%;text-align:center;">'+pageName+'</div></div>')
// page name label
	    .data('explorerShim', pageName)
        .appendTo(el_explorerSpace);
    switch(clazz){
    case CLASS_EXPLORER_CONTAINER:
      explorerPageContainer
		    .on(MY_CLICK, '.explorerShim.' + clazz, function(){
		      //trigger explorer 左のボタン押下 TODO page mergeまでの暫定挙動
		      el_pageSpace.find('.func_page_change').filter(function(){
			      return this.value === pageName;
		      }).trigger(MY_CLICK);
		    });
      break;
    case CLASS_SCREEN_SAVE:
		  explorerPageContainer.on(MY_CLICK, '.explorerShim.' + clazz, function(){
		    var _this = $(this).toggleClass('explorerSelected');
		  });
      break;
    case CLASS_TRASH_PAGE: // TODO el_func_delete_selected_page.clickとロジック共通化
    	explorerPageContainer.on(MY_CLICK, '.explorerShim.' + clazz, function(){
        // recovery from trash
        el_trashPageList.find('#HDbtn_' + pageName).detach().appendTo(el_filterPageList);
        var targetPage = page_trash[pageName];
        putInExplorer(CLASS_EXPLORER_CONTAINER, targetPage.screen);
        delete page_trash[pageName];
        page_s[pageName] = targetPage;
        explorerPageContainer.remove();
		  });
      break;
    default:
      // nothing
    }

	  return true;
  }

  var el_openDirs = $('#HDopenDirs');
  el_pageSpace
	  .data(エクスプローラー表示対象クラス, CLASS_EXPLORER_CONTAINER)
	  .on(MY_CLICK, '.func_page_change', function(){
	    var _this = $(this).addClass(CLASS_SELECTED_BTN_PAGE);
	    var _page = _this.data('page');
	    var selectedName = _page.screen.data('name');
	    ROOT_BTN_PAGE.page.screen.siblings('.HDpageClass').each(function(idx){// screenに全ページがありRoot以外を一旦explorerに収納
		    return putInExplorer(CLASS_EXPLORER_CONTAINER, $(this), selectedName);
	    });
	    if(ROOT_BTN_PAGE.page !== _page && nowPage !== _page){
		    setNowPage(_this, _page);
		    var parent =_page.screen.parent();
		    var selectedScreen = _page.screen
			    .css({"transform":"scale(1)", "margin":"0px"});
		    if(parent.hasClass(CLASS_EXPLORER_CONTAINER)){
		      selectedScreen.detach().appendTo(el_HtmlDeveloping);// 選択ページをexplorerから、表示領域に移動
		      parent.remove();
		    }
	    }else if(ROOT_BTN_PAGE.page === _page){
		    setNowPage(_this, _page);
	    }
	    el_ObjectName.html(nowPage.screen.data('name'));
	    refreshExplorerSpace(el_pageSpace.data(エクスプローラー表示対象クラス));
	  }).on(MY_INIT,function(){
	    ROOT_BTN_PAGE.btn.trigger(MY_CLICK);//TODO lazy load
	  }).trigger(MY_INIT);

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
  el_func_s.append.on(MY_CLICK, function(){
	  commands.append().execute();
  });

  el_func_s.update_var.on(MY_CLICK, function(){
	  var target_s = getSelectedDomsOn();
	  if( target_s.length === 0){ return;}
	  var raw_val_s = context_menu.el_selected_val_array_json.val();
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

  function update_prop(target, prop_s){
	  var tag = target.get(0).localName;
	  if(target.hasClass('wrapper')){return true;}
	  //prop
	  var org_prop_s = orDefault(target.data('my-org-prop_s'), {});
	  var kept_prop_s = {};
	  var prop_history = orDefault(target.data('prop-history'), {});
	  for(var _p_key in prop_s){
	    var p_key = _p_key.toLowerCase();
	    var val = prop_s[p_key];
	    if(!val){continue;}
	    kept_prop_s[p_key] = target.attr(p_key);
	    if( p_key === 'html'){
		    if(target.get(0).localName === 'input'){
		      target.val(val);
		    }else{
		      target.html(val);
		    }
		    continue;
	    }
	    if( p_key !== 'style' && p_key !== 'class'){
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
		    val = merge_css( target.attr('style'), prop_s.style );
		    target.attr('style', val);
		    org_prop_s['style'] = val;
	    }
	  }
	  target.data('my-org-prop_s', org_prop_s);
	  return target;
  }

  el_func_s.update_prop.on(MY_CLICK, function(){
	  var target_s = getSelectedDomsOn();
	  if( target_s.length === 0){ return;}
	  var prop_s = JSON.parse( el_selected_val_prop_json.val() );
	  if( ! $.isPlainObject(prop_s)){throw new TypeError('prop is not JSON style.');}
	  var overrideAttr = context_menu.el_updateAttr.val();
	  var overrideAttrVal = context_menu.el_updateAttrValue.val();
	  if(overrideAttr){
	    prop_s[overrideAttr] = overrideAttrVal;
	  }
	  $.each(target_s, function(idx, _target){
	    //	    var prop_history_id = STATUS.getNewProp();
	    update_prop($(_target), prop_s);
	  });
	  draw_arrow_s();
  });

  el_func_s.select.on(MY_CLICK, function(){
	  var sel_s = select_element(context_menu.el_selector.val(), context_menu.append_css_selector.val());
	  var length_these_minus_1 = sel_s.length - 1;
	  setProps(sel_s[length_these_minus_1], length_these_minus_1 > 0);
  });

  /**
   * ready for copy : no recursive , mono page
   */
  $.each(互いに排他の機能_s,function(idx, name){
	  var now_class = CLASS_S[name];
	  el_func_s[name].on(MY_CLICK, function(){
	    try{
		    var new_targeted = $('.'+CLASS_SELECTED + 互いに排他機能のCLASSを含まないセレクタ);
		    //新規選択分があれば､それのみを処理し､既存分は触らない
		    if(new_targeted.length > 0){
		      removeSelected(new_targeted.addClass(now_class));
		    }else{//新規選択分がなければ､全解除し選択状態に
		      addSelected($('.'+now_class).removeClass(now_class));
		    }
	    }catch(e){
		    console.log(e);
	    }
	  });
	  互いに排他機能のCLASSを含まないセレクタ += ':not(.'+now_class+')';
  });

  // el_func_s.pastePrepend.on(MY_CLICK, function(){
  // 	paste_method('prependTo');
  // });
  // el_func_s.pasteInsertBefore.on(MY_CLICK, function(){
  // 	paste_method('insertBefore');
  // });
  el_func_s.pasteAppend.on(MY_CLICK, function(){
	  paste_method('appendTo');
  });
  el_func_s.pasteInsertAfter.on(MY_CLICK, function(){
	  paste_method('insertAfter');
  });

  function setProps(target, isSetVal){
	  if(typeof target !== 'undefined'){
	    var new_prop_s = orDefault(target.data('my-org-prop_s'),{"style":""});
	    new_prop_s.style = merge_css( new_prop_s.style, target.attr('style') );
	    var set_val ;
	    if(isSetVal){
		    // 一度に複数選択された場合は 選択順の制御ができないため､valとして値の配列ではなく､updateを見越してnullを設定する
		    set_val = 'null';
		    el_selected_val_tag.val('');
	    }else{
		    set_val = new_prop_s.html;
		    if( typeof set_val === 'undefined'){
		      set_val = target.data('myhd-obj-val');
		    }
		    el_selected_val_tag.val(target.get(0).localName);
	    }
	    context_menu.el_selected_val_array_json.val(set_val).trigger(MY_CHANGE);
	    delete new_prop_s.html;
	    el_selected_val_prop_json.val(JSON.stringify(new_prop_s)).trigger(MY_CHANGE);
	  }
  }

  // copy, cut, paste
  function paste_method(add_method){
	  try{
	    var added_target_s = null;
	    var el_selected_s = $('.'+CLASS_SELECTED + 互いに排他機能のCLASSを含まないセレクタ, nowPage.screen);//xxx
	    var added_candidate_s;
	    if( el_selected_s.length > 0){
		    added_candidate_s = el_selected_s;
	    }else{
		    added_candidate_s = nowPage.screen;//追加先のデフォルトはscreen
	    }
	    var len_added_candidate_s = added_candidate_s.length;
	    //TODO bug infinite loop
	    $.each( 互いに排他の機能_s,function(idx, name){
		    var now_class = CLASS_S[name];
		    var src_s = $('.'+now_class);
		    if(src_s.length !== 0){
		      if(name === 'cut') {
			      commands.cut_paste(add_method, src_s, added_candidate_s).execute();
		      }else{
			      commands.copy_paste(add_method, src_s, added_candidate_s).execute();
		      }
		    }
	    });
	    draw_arrow_s();
	  }catch(e){
	    console.log(e);
	  }
  }

  function Coord(){
	  if(arguments.length === 1){
	    var raw = arguments[0];
	    if(raw.hasOwnProperty('prop_s') && raw.prop_s.hasOwnProperty('style')){
		    raw = raw.prop_s.style;
	    }else if(raw.hasOwnProperty('style')){
		    raw = raw.style;
	    }
	    var style = analysisCss(raw, {});
	    return arguments.callee(style.left, style.top, style.right, style.bottom);//XXX
	  }else if(arguments.length === 3){
	    return {
		    "left":parseInt(arguments[0], 12),
		    "top":parseInt(arguments[1], 10),
		    "right":'auto',
		    "bottom":'auto'
	    };
	  }else if(arguments.length === 4){
	    var x = arguments[0];
	    var y = arguments[1];
	    var cx = arguments[2];
	    var cy = arguments[3];
	    if(typeof x !== 'undefined' && typeof y !== 'undefined'
	       && $.isNumeric(parseInt(x, 10)) && $.isNumeric(parseInt(y, 10))){
		    return arguments.callee(x, y);
	    }else{
		    return {
		      "left":x,
		      "top":y,
		      "right":cx,
		      "bottom":cy
		    };
	    }
	  }else{
	    return null;
	  }
  }

  function htmlize(parsed){
	  if( ! $.isArray(parsed)){
	    parsed = [parsed];
	  }
	  el_sandbox_hidden.empty();
	  parsed.forEach(function(parse,i,a){
	    display_onscreen('appendTo', el_sandbox_hidden, parse);
	  });
	  //XXX Important この処理でwrapper divを外すため厳密にはWysiwygではなくなる
	  var wrappers_s = $('.wrapper',el_sandbox_hidden).each(function(i, obj){
	    var wrapper = $(this);
	    try{wrapper.draggable('destroy');}catch(e){/*kill error*/};
	    try{wrapper.resizable('destroy');}catch(e){/*kill error*/};
	    var position = wrapper.css('position');
	    var top = wrapper.css('top');
	    var right = wrapper.css('right');
	    var bottom = wrapper.css('bottom');
	    var left = wrapper.css('left');
	    wrapper.children().each(function(i, obj){
		    var _this = $(this);
		    _this.css({"position":position, "top":top, "right":right, "bottom":bottom, "left":left});
	    });
	    wrapper.replaceWith(wrapper.html());
	  });
	  var target_s = $('[data-myhd-htmlize-target=true]',el_sandbox_hidden);
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
	    //TODO wrapper
	  });

	  var head_src = '';
	  try{
	    head_src = $('head').html();
	    var output_html = el_sandbox_hidden.html();
	    return '<!doctype html><html><head>' + head_src + '</head><body data-ng-app="app">' + output_html + '\n<div id="MyEditableScript" class="htmlize">\n' + el_script.html()+'\n</div>\n</body></html>';
	  }catch(e){console.log('e '+e);};
  }

  el_func_s.html.on(MY_CLICK,function(){
	  $('<textarea rows="1" style="height:1.5em;width:8em;">').html(htmlTag2escape(htmlize(getSelectedOrRoot())))
	    .appendTo(el_sandbox_screen.empty());
  });

  el_func_s.style
	  .on(MY_CLICK, function(){
	    el_some_list.style_list.empty();
	    var style_html = el_sandbox_style_screen_area.val().trim();
	    if(typeof style_html !== 'undefined' && style_html.length > 0){
		    el_style.html(style_html);
	    }
	    style_html = style_html.replace(/\n/g, '');
	    var css_keyval = split_ignore_nest(style_html, '}', [["{","}"]]);
	    // TODO css structure var pool = [];
	    css_keyval.forEach(function(x,i,a){
		    var trimed = x.trim();
		    if (trimed.indexOf('@keyframes') > -1){
		      //  css animation
		      var idxNami = trimed.indexOf('{');
		      var keyframeName = trimed.substring(0, idxNami).trim();
		      var rawAnimeSettings = trimed.substring(idxNami + 1).replace(/\s/g, '');
	        // TODO css structure
		      // var animeSettings = rawAnimeSettings.split('}');
		      // animeSettings.forEach(function(csskey_val,i,a){
          //   csskey_val.split('{')
		      // });
          new_empty_line(el_some_list.style_list, keyframeName, rawAnimeSettings, false);
		    } else {
		      var k_v = trimed.split('{');
		      if(k_v.length === 2){
            var cssSelector = k_v[0].trim();
            var rawAttrVals = k_v[1].trim();
	          // TODO css structure
			      // var attr_val_s = rawAttrVals.split(';');
			      // var pool_v = {};
			      // attr_val_s.forEach(function(acv,i,a){
			      //   var a_v = acv.split(':');
			      //   if(a_v !== null && a_v.length === 2){
				    //     pool_v[a_v[0].trim()] = a_v[1].trim();//後勝ち
			      //   }
			      // });
			      // var cssSelector_css_value = {};
            // cssSelector_css_value[cssSelector] = pool_v;
			      // pool.push(cssSelector_css_value);
			      new_empty_line(el_some_list.style_list, cssSelector, rawAttrVals, false);
		      }
		    }
	    });
	  })
	  .on(MY_INIT, function(){
	    el_sandbox_style_screen_area.val(el_style.html().replace(/></g,'>\n<').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
	  })
	  .trigger(MY_INIT);

  el_func_s.script
	  .on(MY_CLICK, function(){
	    $('<script>').html(el_some_list['script_list'].val()).appendTo(el_script.empty());
	  }).on(MY_INIT, function(){
	    $('<script>').html(el_some_list['script_list'].val()).appendTo(el_script.empty());
	  }).trigger(MY_INIT);

  el_func_s.modelCssApply.on(MY_CLICK, function(){
	  var apply_css = ["font-size", "width", "height", "color", "border", "border-width", "border-left-width", "border-top-width", "border-right-width", "border-bottom-width", "padding", "background-color", "padding", "padding-width", "padding-left-width", "padding-top-width", "padding-right-width", "margin-width", "margin-left-width", "margin-top-width", "margin-right-width", "transform", "border-radius", "text-shadow", "box-shadow"];//XXX
	  var apply_style = '';
	  apply_css.forEach(function(css,i,a){
	    var temp = el_oprt_model.css(css);
	    if(!temp){return;}
	    apply_style += css+':'+temp+';';
	  });
	  for(var key in el_now_selected) if(el_now_selected.hasOwnProperty(key)){
	    update_prop(el_now_selected[key], {"style":apply_style});
	  };
  });

  var el_boxModel = $('#boxModel').data('cursorTarget', {});
  $('input[type=number]', el_basic_menu)
	  .on(MY_INIT,function(){
	    var _this = $(this);
	    var min = _this.attr('min');
	    min = isEmpty(min) ? null : parseInt(min, 10);
	    var max = _this.attr('max');
	    max = isEmpty(max) ? null : parseInt(max, 10);
	    var step = _this.attr('step');
	    step = isEmpty(step) ? 1 : parseInt(step, 10);
	    var step5 = step * 5;
	    _this.data('keyCodeSetting', {"min":min, "max":max, "step":step, "step5":step5});
	  }).trigger(MY_INIT)
	  .on('focus',function(){
	    var _this = $(this);
	  }).on('keydown',function(ev){
	    var _this = $(this);
	    var setting = _this.data('keyCodeSetting');
	    var keyCd = ev.keyCode;
	    switch(keyCd){
	    case 37:
		    _this.val(parseInt(_this.val(), 10) - setting.step5);break;
	    case 66:
		    if(ev.ctrlKey){ _this.val(parseInt(_this.val(), 10) - setting.step5);}
		    ev.stopPropagation();ev.preventDefault();
		    break;
	    case 38:
		    _this.val(parseInt(_this.val(), 10) + setting.step);
		    break;
	    case 80:
		    if(ev.ctrlKey){ _this.val(parseInt(_this.val(), 10) + setting.step);}
		    ev.stopPropagation();ev.preventDefault();
		    break;
	    case 39:
		    _this.val(parseInt(_this.val(), 10) + setting.step5);
		    break;
	    case 70:
		    if(ev.ctrlKey){ _this.val(parseInt(_this.val(), 10) + setting.step5);}
		    ev.stopPropagation();ev.preventDefault();
		    break;
	    case 40:
		    _this.val(parseInt(_this.val(), 10) - setting.step);
		    break;
	    case 78:
		    if(ev.ctrlKey){ _this.val(parseInt(_this.val(), 10) - setting.step);}
		    ev.stopPropagation();ev.preventDefault();
		    break;
	    }
	    var nowVal = _this.val();
	    if(!isEmpty(setting.min) && nowVal < setting.min){
		    _this.val(setting.min);
	    }else if(!isEmpty(setting.max) && nowVal > setting.max){
		    _this.val(setting.max);
	    }
	    _this.trigger(MY_CLICK);
	    var cursorTarget = el_boxModel.data('cursorTarget');
	  });
  el_func_s.modelCssReset.on(MY_CLICK, function(){
	  el_oprt_model.attr('style', el_oprt_model.data('my-default-prop_s'));
	  el_oprt_model.attr('transform', {});
	  update_prop(el_oprt_model, el_oprt_model.data('my-default-prop_s'));
  });

  el_func_s.delete.on(MY_CLICK, function(){
	  getSelectedDomsOn().each(function(){
	    var my_node_id = myWrapElement(this).attr('data-myhd-node-id');
	    commands.delete(my_node_id).execute();
	  });
  });

  el_func_s.cxlselected.on(MY_CLICK, function(){
	  getSelectedDomsOn().each(function(){
	    removeSelected(myWrapElement(this));
	  });
  });

  el_func_s.edit.on(MY_CLICK,function(ev, obj){
	  is_suspend = ! is_suspend;
	  if(is_suspend){
	    context_menu.el_edit_mode.html('end');
	    var NOW_SELECTED = getSelectedDomsOn()
		    .addClass(CLASS_ON_EDIT)
		    .each(function(idx,obj){
			    var _this = $(this);
			    var parent = _this.parent();
			    $('<textarea class="'+CLASS_EDIT_DATA+'" style="z-index:'+(100000+parseInt(_this.css('z-index'), 10))+';width:100%;position:absolute;top:0px;left:0px;height:'+_this.height()+'px" >').append(_this.data('myhd-obj-val').replace(/</g,'&lt;').replace(/>/g,'&gt;')).appendTo(_this);
		    });
	    el_func_s.cxlselected.trigger(MY_CLICK);
	  }else{
	    context_menu.el_edit_mode.html('start');
	    $('.'+CLASS_ON_EDIT + ' > .'+CLASS_EDIT_DATA, nowPage.screen)
		    .each(function(idx,obj){
		      var _this = $(this);
		      var conv = _this.val().replace(/\n/g,'<br>');
		      var parent = _this.parent();
		      preserve_destroy_remove_recovery_position(parent, conv, _this, call_safe_html);
		    }).removeClass(CLASS_ON_EDIT);
	  }
  });

  var history_counter = 0;
  function refresh_save_history(){
	  var appender = '';
	  var save_s = orDefault(MY_STORAGE.select('save_s'), []);
	  var already = {};
	  var alreadyList = el_explorerSpace.children('.HDScreenSaved.explorerContainer');
	  if(alreadyList !== undefined){
	    alreadyList.map(function(idx, obj){
		    already[$(obj).data('explorerShim')] = obj;
	    });
	  }
	  history_counter = 0;
	  var alreadyLength = Object.keys(already).length;
	  for(var key in save_s) if(save_s.hasOwnProperty(key) && key.startsWith('save')){ // TODO fixed saved file name
	    if(already[key] === undefined){
		    var pageObj = createPageDOM(key, CLASS_SCREEN_SAVE, page_save_s, '100%', '100%');
		    putInExplorer(CLASS_SCREEN_SAVE, pageObj.screen, 'save');
		    loadRawData2Screen(save_s[key], pageObj.screen);
		    var tmp = parseInt(key.split(MY_NODE_SEP)[1],10);
		    history_counter = history_counter < tmp ? tmp : history_counter;
	    }else if(alreadyLength > 0){
		    delete already[key];
	    }
	  }
	  Object.keys(already).forEach(function(x,i,a){
	    $(already[x]).remove();
	  });
  }
  refresh_save_history();

  /**
   * saveされる対象はdata-myhd-node-idが付与されているもの
   */
  el_func_s.save.on(MY_CLICK, function(){
	  /* get selected or root */
	  var save = getSelectedOrRoot();
	  /* delete old */
	  var save_s = orDefault(MY_STORAGE.select('save_s'), {});
	  ++history_counter;
	  var tmp_counter = 0;
	  while(history_counter - tmp_counter > MAX_SAVE_SLOT_S
	        && tmp_counter++ < 10000){
	    if(save_s.hasOwnProperty('save'+MY_NODE_SEP+tmp_counter)){
		    delete save_s['save'+MY_NODE_SEP+tmp_counter];
	    }
	  }
    // get all pages without quick saves
    var save_page_s = {};
    Object.keys(page_s).forEach(function(pageName){
      var targetPage = page_s[pageName];
      var mother_id = targetPage.screen.attr('data-myhd-node-id');//attrだと文字, dataだとobj
	    var child_tree = get_child_tree_select_dom(mother_id);
      save_page_s[pageName] = {
        page: child_tree.child_s(),
        detail: {} // TODO for userId, create date, mod date, history
      };
    });

	  /* save this */
	  save_s['save'+MY_NODE_SEP+history_counter] = save;
	  MY_STORAGE
	    .transaction()
	    .replace('save_s', save_s)
      .replace('save_page_s', save_page_s)
	    .commit();

	  /* refresh */
	  refresh_save_history();
  });
  /**
   * load rawdata to screen
   * @param rawData
   * @param target screen
   */
  function loadRawData2Screen(parsed, tgtScreen){
	  if( ! $.isArray(parsed)){
	    parsed = [parsed];
	  }
	  parsed.forEach(function(x,i,a){
	    display_onscreen('appendTo', tgtScreen, x);
	  });
	  draw_arrow_s();
  }
  el_func_s.load.on(MY_CLICK, function(){
	  // 選択したものから抽出
	  var selectedList = el_explorerSpace.find('.explorerShim.HDScreenSaved.explorerSelected');
	  if(selectedList != null){
	    selectedList.each(function(i, obj){
		    var mother_id = $(this).siblings('.HDScreenSaved').attr('data-myhd-node-id');
		    var child_tree = get_child_tree_select_dom(mother_id);
		    var saved = child_tree.child_s();
		    loadRawData2Screen(saved, nowPage.screen);
	    });
	  }
  });

  el_func_s.register_part.on(MY_CLICK, function(){
	  /* get selected or root */
	  var save = getSelectedOrRoot();
	  $('.p_list_child:last-child > .val', el_some_list.part_list).val(JSON.stringify(save));
  });

  el_func_s.positionFix.on(MY_CLICK, function(){
	  var NOW_OFF_DS = $('.'+CLASS_POSITION+'.'+CLASS_SELECTED, nowPage.screen)
		    .removeClass(CLASS_POSITION)
		    .each(function(obj, idx){
		      var _this = $(this);
		      removeSelected(_this);
		      recovery_position(_this);
		    });
	  var NOW_SELECTED = $('.'+CLASS_SELECTED+':not(.'+CLASS_POSITION+')', nowPage.screen)
		  .addClass(CLASS_POSITION)
		  .each(function(obj, idx){
		    var _this = $(this);
		    removeSelected(_this);
		    preserve_destroied(_this);
		  });
  });

  var relativeTopBottom = $('#positionRelativeTopBottom');//敢えてstopPropagationしない
  var relativeTopBottomValue = $('#positionRelativeTopBottomValue');
  var relativeLeftRight = $('#positionRelativeLeftRight');
  var relativeLeftRightValue = $('#positionRelativeLeftRightValue');
  $('.positionRelative > *').on(MY_CLICK+' '+MY_KEYUP, function(){
	  var NOW_SELECTED = getSelectedDomsOn();
	  NOW_SELECTED.each(function(){
	    var _this = $(this);
	    var position = {};
	    var tb = relativeTopBottom.val();
	    if(tb === 'center'){
		    position['top'] = 0;
		    position['bottom'] = 0;
		    position['margin'] = 'auto';
		    relativeTopBottomValue.val(0);
	    }else{
		    var bt = tb === 'top' ? 'bottom' : 'top';
		    position[tb] = relativeTopBottomValue.val();
		    position[bt] = 'auto';
	    }
	    var lr = relativeLeftRight.val();
	    if(lr === 'center'){
		    position['left'] = 0;
		    position['right'] = 0;
		    position['margin'] = 'auto';
		    relativeLeftRightValue.val(0);
	    }else{
		    var rl = lr === 'left' ? 'right' : 'left';
		    position[lr] = relativeLeftRightValue.val();
		    position[rl] = 'auto';
	    }

	    _this.css(position);
	  });
  });

  el_func_s.undo.on(MY_CLICK, function(){
	  var cmd = command_undo_history.pop();
	  if(cmd !== undefined){
	    cmd.undo();
	    command_redo_history.push(cmd);
	  }
  });

  el_func_s.redo.on(MY_CLICK, function(){
	  var cmd = command_redo_history.pop();
	  if(cmd !== undefined){
	    cmd.execute();
	    command_undo_history.push(cmd);
	  }
  });

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

  // Global Key bind
  $(document).on('keydown',function(ev, _this ){
	  switch(ev.keyCode){
	  case 27 ://ESC
	    $('[class*="hide_mode_target"][data-fire-key-code="escape"]').toggle('clip',null,500);
	    el_explorerSpace.height(el_explorer.children('section').innerHeight() - el_explorer.find('.menuHandler').outerHeight());
	    break;
	  case 66:
	    if(ev.ctrlKey){ fn_ctrlB();}
	    ev.stopPropagation();
	    break;
	  case 80:
	    if(ev.ctrlKey){ fn_ctrlP();}
	    ev.stopPropagation();
	    break;
	  case 70:
	    if(ev.ctrlKey){ fn_ctrlF();}
	    ev.stopPropagation();
	    break;
	  case 78:
	    if(ev.ctrlKey){ fn_ctrlN();}
	    ev.stopPropagation();
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
		        , ['merge',{"prop_list":{"latest_example":{"table":{"cellspacing":0, "style":"border-collapse:separate;background-color:white;table-layout:fixed;"},"td,th":{"style":"border:1px solid black;"},"th":{"style":"color:red;"},"svg":{"xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","style":"height:800px;width:1200px;"},"path":{"fill":"black","stroke":"black","stroke-width":1,"d":""}}}}]
		        ,[]
	         )
	  .commit();

  //part_list, prop_list, style_list
  $.each(el_some_key_s, function(idx, some_key){
	  var el_some = {};
	  var length_el_some_func_suffix_s = el_some_func_suffix_s.length;
	  el_some_func_suffix_s.forEach(function(suffix,i,a){
	    el_some[suffix] = $('#'+some_key+'_'+suffix, el_basic_menu);
	  });
	  var tmp_el_list = el_some_list[some_key].sortable();
	  var tagName = tmp_el_list.get(0).localName;
	  var tmp_el_input = el_some_input[some_key];
	  var is_add_button = some_key === 'part_list'? true : false;//TODO
	  //pull down
	  refresh_select_list(some_key, el_some.select);
	  //pull donw init
	  var name_in_storage = orDefault(MY_STORAGE.select(some_key+'_selected'), []);
	  if( !isEmpty(name_in_storage)){
	    el_some.name.val(name_in_storage);
	    el_some.select.val(name_in_storage);
	  }

	  if(tagName === 'ul' || tagName === 'ol'){
	    el_some.select.on(MY_CHANGE+' '+MY_CLICK,function(){
		    var some_name = this.value;
		    var input_name = el_some.name.val();
		    var list_s_in_storage = orDefault(MY_STORAGE.select(some_key), []);
		    if(isEmpty(list_s_in_storage)){return false;}
		    var keys_list_s = Object.keys(list_s_in_storage);
		    if(keys_list_s.length <= 0){return false;}
		    if(!isEmpty(some_name)){
		      el_some.name.val(some_name);
		      el_some.select.val(some_name);
		      if( name_in_storage !== some_name){
			      MY_STORAGE.transaction().replace(some_key+'_selected', some_name).commit();
			      name_in_storage = some_name;
		      }
		    }
		    var list_in_storage = list_s_in_storage[el_some.name.val()];
		    if(typeof list_in_storage === 'undefined'){return false;}
		    tmp_el_list.empty();//clear
		    Object.keys(list_in_storage).forEach(function(key,idx,a){
		      new_empty_line(tmp_el_list, key, force_stringify(list_in_storage[key]), is_add_button);
		    });
		    // for new empty input
		    new_empty_line (tmp_el_list,'','', is_add_button);

		    tmp_el_list
		      .on(MY_CHANGE,'input.key',function(){
			      $('input.key', tmp_el_list).each(function(){
			        var _this = myWrapElement(this);
			        if(_this.val().trim().length === 0){
				        _this.parent().remove();
			        }
			      });
			      new_empty_line(tmp_el_list,'','', is_add_button);
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
	  }else if(tagName === 'textarea' || tagName === 'intput'){
	    el_some.select.on(MY_CHANGE+' '+MY_CLICK,function(){
		    var some_name = this.value;
		    if(isEmpty(some_name)){return false;}
		    var input_name = el_some.name.val();
		    var data_instorage = orDefault(MY_STORAGE.select(some_key), []);
		    if(isEmpty(data_instorage)){return false;}
		    var script = data_instorage[some_name];
		    el_some_list[some_key].val(script);
		    el_some.name.val(some_name);
		    el_some.select.val(some_name);
	    }).trigger(MY_CHANGE);//end el_some.select
	  }
    // register style, script, parts
	  el_some.reg.on(MY_CLICK,function(){
	    var some_name = el_some.name.val();
	    var tmp_el_list = el_some_list[some_key];
	    var list_s_in_storage = MY_STORAGE.select(some_key);
	    if(isEmpty(list_s_in_storage) || ! $.isPlainObject(list_s_in_storage)){
		    list_s_in_storage = {};
	    }
	    var saveValue = null;
	    var tagName = tmp_el_list.get(0).localName.toLowerCase();
	    if(tagName === 'ul' || tagName === 'ol'){
		    saveValue = collect_some_list(tmp_el_list);
	    }else if(tagName === 'textarea' || tagName === 'input'){
		    saveValue = tmp_el_list.val();
	    }else{
		    saveValue = tmp_el_list.html();
	    }
	    list_s_in_storage[some_name] = saveValue;
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

  // Implement_s
  function select_element(raw_selector, append_css_selector){
	  var rtn = [];
	  var _these;
	  var selector = '';
	  var type_raw_selector = typeof raw_selector;
	  if(type_raw_selector === undefined){
	    return rtn;
	  }else if(type_raw_selector !== 'string'){
	    _these = raw_selector;
	  }else{
	    if(raw_selector.startsWith(nowPage.screen.attr('data-myhd-node-id')+'-')){//case my_id
		    var idx_aster = raw_selector.lastIndexOf(MY_NODE_SEP+'*');
		    if(idx_aster > 0 && raw_selector.length - 2 === idx_aster){
		      selector = '*[data-myhd-node-id^="'+raw_selector.substring(0,raw_selector.length - 1)+'"]';
		    }else{
		      selector = '*[data-myhd-node-id='+raw_selector+']';
		    }
	    }else{//case css
		    selector = raw_selector;
	    }
	    selector = selector.trim();
	    if(typeof append_css_selector === 'string' && append_css_selector !== '' ){
		    append_css_selector = append_css_selector.trim();
		    var pool = '';
		    var target = append_css_selector;
		    css結合子.forEach(function(cc,i,a){//TODO bug:case: nth-child(2n+1)
		      var lastIndex = target.lastIndexOf(cc);
		      if(lastIndex < 0){return true;}
		      ++lastIndex;
		      pool += target.substr(0, lastIndex);
		      target = target.substring(lastIndex);
		    });
		    var indexPsuedo = target.indexOf(':');
		    if(indexPsuedo > -1){
		      target = target.substr(0, indexPsuedo) + '.htmlize' + target.substring(indexPsuedo);
		    }
		    selector += ' ' + pool+target;
	    }
	    _these = $(selector, nowPage.screen);
	  }
	  _these.each(function(idx, in_this){
	    var _this = myWrapElement(in_this);
	    if(_this.hasClass(CLASS_COPY) || _this.hasClass(CLASS_CUT)){return ;}//TODO List
	    var my_obj_id = _this.attr('data-myhd-node-id');
	    var is_my_selected = _this.data('my-selected');
	    if(typeof is_my_selected === 'undefined' || is_my_selected === false){
		    addSelected(_this);
		    rtn.push(_this);
	    }else{
		    removeSelected(_this);
	    }
	  });
	  return rtn;
  }

  function removeSelected(jq_tgt){
	  var my_obj_id = jq_tgt
		  .data('my-selected', false)
		  .removeClass(CLASS_SELECTED)
		  .data('myhd-obj-id');
	  delete el_now_selected[my_obj_id];
	  return jq_tgt;
  }
  function addSelected(jq_tgt){
	  var my_obj_id = jq_tgt
		    .data('my-selected', true)
		    .addClass(CLASS_SELECTED)
		    .data('myhd-obj-id');
	  el_now_selected[my_obj_id] = jq_tgt;
	  return jq_tgt;
  }

  /**
   * 単一要素やJSONや､"hogehoge"などのraw_val_sに対応
   * @return null => null
   */
  function format_raw_val_s(raw_val_s){
	  var formatted_val_s = [];
	  if(!isEmpty(raw_val_s)){
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
	  // guard
	  if(str == null || typeof str !== 'string')	throw new TypeError(str + ' is not valid.');

	  var ign_pair_map = {};
	  ignore_nest_parenthesis_s.forEach(function(pair,idx,a){
	    if($.isArray(pair) && pair.length === 2) {
		    ign_pair_map[pair[0]] = pair[1];
	    } else {
		    console.log('error pair :' + JSON.stringify(pair));
	    }
	  });
	  var splitByIgnore = ignore_nest_parenthesis_s.some(function(pair,i,a){
	    return pair.indexOf(splitter) > -1;
	  });
	  var length_str = str.length;
	  var result = [];
	  var tmp_str = '';
	  var nested_char_stack = [];
	  var now_close_char = '';

	  for(var i=0;i<length_str;++i){
	    var char = str[i];
	    //nestを$nest$ など単階層同一文字もサポートするため
	    if(char === now_close_char){
		    now_close_char = nested_char_stack.pop();
		    if (splitByIgnore && nested_char_stack.length === 0){
		      // nothing
          console.log('nothing');// TODO rm test log
		    }else{
		      tmp_str += char;
		      continue;
		    }
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
	  raw_tag_s.split(TAG_LAYER_SEP).forEach(function(tag, idx){
	    var trimed_tag = tag.trim();
	    var pooled_tag_s = [];
	    split_ignore_nest(trimed_tag,SBL_HLD,[["(",")"]]).forEach(function(sbl, cIdx){//sibling
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
		      if( loop_num < 0 ){throw new Error('loop num : '+loop_num +' should be >= 0 ');}
		    }
		    var tag = tag_num[0];
		    //[] と {}の処理
		    for(var l_idx=0;l_idx < loop_num;++l_idx){
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
		    return rtn;
	    }
	    Object.keys(prop_s).forEach(function(key){
		    var tmp_prop_s = prop_s[key];
		    if(!$.isPlainObject(tmp_prop_s)){
		      console.log('error prop : ' + JSON.stringify(tmp_prop_s));
		      throw new TypeError('Error : props should be JSON Object!! ');
		    }
		    var tag = key.trim();
		    var selector_s = tag.indexOf(',') > -1 ? tag.split(',') : [tag];
		    selector_s.forEach(function(tmp_key,i,a){
		      tmp_key = tmp_key.trim();
		      var kept = {};
		      var tmp_kept_key = '';
		      kept['style'] = {};//TODO Classにまとめよう･･･
		      kept['class'] = '';
		      if(!rtn.hasOwnProperty(tmp_key)){
			      rtn[tmp_key] = {};
			      $.extend(rtn[tmp_key],tmp_prop_s);
			      return true;
		      }
		      kept_element_s.forEach(function(tmp_kept_key,i,a){
			      if(rtn[tmp_key].hasOwnProperty(tmp_kept_key)){
			        if(tmp_kept_key === 'style'){
				        rtn[tmp_key][tmp_kept_key] = merge_css(rtn[tmp_key][tmp_kept_key], tmp_prop_s[tmp_kept_key]);
			        }else if(tmp_kept_key === 'class'){
				        rtn[tmp_key][tmp_kept_key] += ' ' + tmp_prop_s[tmp_kept_key];
			        }
			      }
		      });
		    });
	    }); // Important position : absoluteが必須だが､ここで設定してもdraggableで上書きされるため無駄
	    return rtn;
	  }catch(e){
	    console.log(e);
	    return null;
	  }
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
	  for(var idx=0;idx < length_input_tag;++idx){
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
	    for(var p=0;p<length_raw_param_split;++p){
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

  /**
   * @return {tag:, id:, }
   */
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
	  var tag;
	  for(var ic=0;ic <= length_input_tag;++ic){
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
	  return {"tag":tag,"id":tmp_id, "class":tmp_cl_s,"attr":tmp_attr_s};
  }

  /**
   * @return
   */
  function extract_css_selector(input_tag, prop_map){
	  var analized_result = analisys_css_selector(input_tag);
	  var cls_s = analized_result['class'];
	  var tag = null;
	  var prop_s = {};

	  if(prop_map.hasOwnProperty('*')){$.extend(true,prop_s, prop_map['*']);}
	  var concat_cl_s = '';
	  for(var cl=0;cl < cls_s.length;++cl){
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
	  // for(var i=0;i < length_forbidden;++i){
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
	  var isResolevdByPartMap = false;
	  for(var i=length_tag_s2 - 1;i >= 0;--i){
	    tag_size_s.push(counter);
	    counter *= tag_s2[i].tag_s.length;
	  };
	  tag_size_s = tag_size_s.reverse();

	  $.each(tag_s2, function(page_idx, tag_s ){
	    var new_parent_s = [];
	    $.each(parent_s, function(pIdx, parent){
		    for(var i=0;i < tag_s.tag_s.length;++i){
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
		      var zIndex = set_default_size(tag, prop_s, tag_size_s, page_idx, i);
		      if(part_map.hasOwnProperty(tag)){//part nest route
			      isResolevdByPartMap = true;
			      //error check
			      check_input_data(tag, prop_s, infinite_loop_check);
			      infinite_loop_check.push(tag);//new

			      var resolve_tag = part_map[tag];
			      var stringified_tag = resolve_tag;
			      if(typeof resolve_tag !== 'string'){stringified_tag = JSON.stringify(resolve_tag);}
			      var child_last = null;
			      if(stringified_tag.startsWith('[') || stringified_tag.startsWith('{')){
			        child_last = {"child_s":resolve_tag};
			        var last_child_s = [];
			        recursive_collect_last_child(resolve_tag, last_child_s);
			        child_last.last_child_s = last_child_s;
			      }else{
			        child_last = convert_lineardata_to_child_s(format_raw_tag_s(resolve_tag, param_s), prop_map, part_map, param_map, param_s, infinite_loop_check)[0];
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
			        if(! child.prop_s.hasOwnProperty('class')){	child.prop_s['class'] = '';}
			        child.prop_s['class'] += ' wrapped';
			        child = my_apply('div',{"class":"wrapper","style":"background-color:transparent;padding-top:0px !important;padding-left:0px !important;padding-bottom:12px;padding-right:12px;z-index:"+zIndex+';'}, [child] );//wrapper
			      }
			      parent.child_s.push(child);
		      }
		    }
	    });
	    parent_s = new_parent_s;
	  });
	  root_s.last_child_s = parent_s;
	  return [root_s, isResolevdByPartMap];
  };

  /**
   * 1pxサイズの操作不能オブジェクトを産まないために､
   * Defaultサイズを設定する
   * TODO ユーザー指定CSSの設定も調査対象にする
   * @return z-index
   */
  function set_default_size(tag, temp_prop_s, tag_size_s, my_page_idx, my_idx){
	  var zIndex = get_z_index(my_page_idx);
	  if($.inArray(tag, サイズを持たせないタグ) > -1){
	    if( typeof temp_prop_s.style === 'undefined'){
		    temp_prop_s.style = 'z-index:'+zIndex+';';
	    }else if( temp_prop_s.style.indexOf('z-index') === -1){
		    temp_prop_s.style +='z-index:'+zIndex+';';
	    }
	    return zIndex;
	  }
	  var my_height = DEFAULT_HEIGHT  ;
	  var my_width = DEFAULT_WIDTH + 10 * (tag_size_s.length - my_page_idx + tag_size_s[my_page_idx]);
	  // default size
	  if( 各タグ毎の初期サイズ[tag] !== undefined ){
	    var default_style = 各タグ毎の初期サイズ[tag];
	    my_height = default_style['height'];
	    my_width = default_style['width'];
	  }

	  if( typeof temp_prop_s.style === 'undefined'){
	    temp_prop_s.style = 'z-index: '+zIndex+';height:'+my_height+'px;width:'+my_width+'px;top:'+get_top(tag_size_s, my_page_idx, my_idx)+'px;left:'+get_left(tag_size_s, my_page_idx, my_idx)+'px;';
	  }else {
	    if( temp_prop_s.style.indexOf('z-index') === -1){
		    temp_prop_s.style +='z-index:'+zIndex+';';
	    }
	    if( temp_prop_s.style.indexOf('width') === -1){
		    temp_prop_s.style +='width:'+my_width+'px;';
	    }
	    if( temp_prop_s.style.indexOf('height') === -1){
		    temp_prop_s.style +='height:'+my_height+'px;';
	    }
	    if( temp_prop_s.style.indexOf('top') === -1){
		    if( temp_prop_s.style.indexOf('bottom') === -1){
		      temp_prop_s.style +='top:'+get_top(tag_size_s, my_page_idx, my_idx)+'px;';
		      temp_prop_s.style +='bottom:auto;';
		    }else{
		      temp_prop_s.style +='top:auto;';
		    }
	    }
	    if( temp_prop_s.style.indexOf('left') === -1){
		    if( temp_prop_s.style.indexOf('right') === -1){
		      temp_prop_s.style +='left:'+get_left(tag_size_s, my_page_idx, my_idx)+'px;';
		      temp_prop_s.style +='right:auto;';
		    }else{
		      temp_prop_s.style +='left:auto;';
		    }
	    }
	  }
	  return zIndex ;
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
	    // processing > + *, not tag preset resolved
	    var linear_data = format_raw_tag_s(raw_tag_s, [], length_val_s);//return [[tag#hoge.fuga.hage($col=4,5,0)*3]]
	    var param_map = {};
	    var infinite_loop_check = [];//再帰を使用しているため無限ループや無限トランポリン対策
	    // resolving tag preset
	    var root_isResolevedByPartMap = convert_lineardata_to_child_s(linear_data, prop_map, part_map, param_map, [], infinite_loop_check);
	    var root = root_isResolevedByPartMap[0];
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
	    if(root_isResolevedByPartMap[1] === false){
		    adjustSize(root.child_s);
	    }
	    return root;
	  }catch(e){
	    throw e;
	  }
  }

  function adjustSize(myApply){
	  return innerObserveNumChilds(myApply);
  }

  function innerObserveNumChilds(app_s){
	  var newPoolW = 0;
	  var newPoolH = 0;
	  var page = 1;
	  app_s.forEach(function(app,i,a){
	    if(app.child_s.length === 0){
		    var style = analysisCss(app.prop_s.style, {});
		    newPoolW += parseInt(style.width,10);
		    newPoolH += parseInt(style.height,10) + DISTANT_HEIGHT;
	    }else{
		    var pools = innerObserveNumChilds(app.child_s);
		    page = pools[2];
		    var app_style = analysisCss(app.prop_s.style, {});
		    //if(parseInt(app_style.width,10) < pools[0]){
		    //	poolW = pools[0] + 4;
		    //	app_style.width = pools[0]+'px';
		    //}
		    if(parseInt(app_style.height,10) < pools[1]){
		      newPoolH += pools[1] + DISTANT_HEIGHT * 2;
		      app_style.top = DISTANT_HEIGHT * i * 2 * page + parseInt(app_style.top, 10) + 'px';
		      app_style.height = pools[1] + DISTANT_HEIGHT +'px';
		    }
		    app.prop_s.style = cssStringify(app_style);
	    }
	  });
	  return [newPoolW, newPoolH, page * 2];
  }

  function myCreateElement(tag, is_svg){
	  var raw, elm ;
	  if(is_svg){
	    raw = document.createElementNS(SVG_NS, tag);
	    elm = $(raw);
	    elm.data('my-is-svg',true);
	    elm.attr = function(key,val){
		    if( arguments.length === 1 ){
		      if( $.isPlainObject(key) ){
			      Object.keys(key).forEach(function(objKey){
			        raw.setAttribute(objKey, key[objKey]);
			      });
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
				        rtn += node.textContent + ' ';//TODO test note => node
			        }
			      });
			      return rtn;
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
		    };
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

  /**
   *
   */
  function myWrapElement(raw){
	  var elm;
	  if(raw instanceof jQuery){
	    if(raw.length > 1){	throw new TypeError('myWrapElement doesnot accepts array.');}
	    raw = raw[0];
	    elm = $(raw);
	  }else{
	    elm = $(raw);
	  }

	  if(elm.data('my-is-svg')){
	    elm.attr = function(key,val){
		    if( arguments.length === 1 ){
		      if( $.isPlainObject(key) ){
            Object.keys(key).forEach(function(objKey){
			        raw.setAttribute(objKey, key[objKey]);
			      });
			      return this;
		      }else{
			      var rtn = raw.getAttribute(key);
			      if( rtn != null){
			        return rtn;
			      }
		      }
		    }else if( arguments.length >= 2 ){
		      raw.setAttribute(key,val);
		      return this;
		    }
		    return elm;
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
   *
   * @param add_method ex appendTo
   * @param target_s ex page.screen
   * @param _this self ex {tag:, prop_s:, child_s:}
   * @param _is_draggable
   * @param is_svg
   * @return new roots
   */
  function display_onscreen(add_method, target_s, parsedData, _is_draggable, is_svg){
    if (!parsedData){
      return ;
    }else if ($.isArray(parsedData)){
      parsedData.forEach(function(parsed){
        display_onscreen(add_method, target_s, parsed, _is_draggable, is_svg);
      });
      return ;
    }else if (!parsedData['tag']){
      return ;
    }
	  var is_default_draggable = _is_draggable || typeof _is_draggable === 'undefined' ;
	  var tag = parsedData['tag'].trim().toLowerCase();
	  var prop_s = parsedData['prop_s'];
	  var child_s = parsedData['child_s'];
	  if( ! $.isArray(child_s)){
	    console.log('Error this is not Array:'+JSON.stringify(child_s));
	  }
	  if(tag毎の入力規則.hasOwnProperty(tag)){
	    var setting = tag毎の入力規則[tag];
	    var require_s = setting['require_s'];
	    var default_val_s = setting['default'];
	    $.each(require_s, function(page_idx, require){
		    if( ! prop_s.hasOwnProperty(require)){
		      if( default_val_s.hasOwnProperty(require)){
			      prop_s[require] = default_val_s[require];
		      }else{
			      throw new Error("This "+tag+" tag requires a "+require+" prop.");
		      }
		    }
	    });
	  }

	  var length_target_s = target_s.length;
	  var parent_is_svg = false;
	  var rtn_work_jq_s = [];
	  for(var idx_tgt=0;idx_tgt < length_target_s;++idx_tgt){
	    var target = myWrapElement(target_s[idx_tgt]);
	    var parent_tag = target[0].localName.toLowerCase();
	    var isParentRelative禁止タグ = position_relative禁止タグ.indexOf(parent_tag) >= 0;
	    var amRelative禁止タグ =  position_relative禁止タグ.indexOf(tag) >= 0;
	    var is_resizable = true;

	    if( !isParentRelative禁止タグ && is_default_draggable){
		    var is_draggable = true;
	    }
	    if( tag === 'svg'){
		    is_svg = true;
		    is_draggable = false;
	    }else if( tag === 'th' || tag === 'td'){
		    if(parent_tag !== 'tr') throw new Error(' td,th should be under tr.');
		    is_draggable = false;
	    }else if( tag === 'li'){
		    if(parent_tag !== 'ol' && parent_tag !== 'ul') throw new Error('li should be under ul or ol.');
		    is_draggable = false;
	    }else if( tag === 'tr' || tag === 'tbody' || tag === 'thead'){
		    is_draggable = false;
		    is_resizable = false;
	    }else if( typeof is_svg === 'undefined'){
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
		      work_jq.data('myhd-obj-val', prop_s[prop]);
		    }else if( prop === 'value' ){
		      if( tag === 'textarea' ){
			      work_jq.html(prop_s[prop]);
		      }else{
			      work_jq.val(prop_s[prop]);
		      }
		      work_jq.data('myhd-obj-val', prop_s[prop]);
		    }else{
		      work_jq.attr(prop,prop_s[prop]);
		    }
	    }
	    if(typeof work_jq.data('myhd-obj-val') === 'undefined'){work_jq.data('myhd-obj-val','');}

	    work_jq.data({"my-org-prop_s": prop_s, "prop-history": {}});//TODO saveから復元
	    if( work_jq === target){
		    continue;
	    }
	    var my_obj_id = orDefault(prop_s['data-myhd-obj-id'], STATUS.getNewMyObjId());
	    var parent_id = target.attr('data-myhd-node-id');
	    var my_node_id = parent_id+MY_NODE_SEP+ my_obj_id;
	    var user_input_id = work_jq.attr('id');
	    if( typeof user_input_id === 'undefined' || user_input_id.length === 0 ){
		    user_input_id = my_node_id;//TODO
	    }else{
		    work_jq.attr({"id":user_input_id});
	    }
	    work_jq
		    .addClass(CLASS_HTMLIZE)
	    	.data({'myhd-obj-id': my_obj_id, 'myhd-node-id': my_node_id})
	      .attr({'data-myhd-obj-id': my_obj_id, 'data-myhd-node-id': my_node_id})
		    .on(MY_CLICK,select_handler_factory(true))
      // if there are selected doms, contextmenu Sel has last selected dom'id.
	    	.on('contextmenu', select_handler_factory(false, display_contextmenu))// on dom
		    .on(MY_CHANGE,function(ev){
		      var _this = myWrapElement(this);
		      _this.data('myhd-obj-val', _this.val());
		    });
	    var length_child_s = child_s.length;
	    for(var idx_child=0;idx_child < length_child_s;++idx_child){
		    display_onscreen('appendTo', [work_jq], child_s[idx_child], is_draggable, is_svg);
	    }

	    var is_table_cell = false;
	    var original_coord = null;
	    var x_sibl = null;
	    var y_sibl = null;
	    var resizableOption = {
		    "stop":function(ev, ui){
		      is_table_cell = false;
		      draw_arrow_s(cached_arrow_factory, _this);
		      // TODO サイズ合わせオブザーバー
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
		      var my_id = _this.attr('data-myhd-node-id');
		      cached_arrow_factory = draw_arrow_s_factory(null, my_id);
		      var tag = _this[0].localName;
		      x_sibl = null;y_sibl = null;
		      if(tag === 'td' || tag === 'th'){
			      var parent = _this.parent();
			      var parent_id = parent.attr('data-myhd-node-id');
			      is_table_cell = true;
			      original_coord = {"x": _this.width() - ev.pageX  ,"y":_this.height() - ev.pageY};
			      $(' > td, > th',parent).each(function(idx,obj){
			        var _id = $(this).attr('data-myhd-node-id');
			        if(my_id === _id){
				        ++idx;
				        x_sibl = $(' tr[data-myhd-node-id!="'+parent_id+'"] > *:nth-child('+idx+')', parent.parent().parent());
				        return false;
			        }
			      });
			      x_sibl.width(10);
			      y_sibl = _this.siblings().height(10);
			      // x_sibl.each(function(){
			      //     var _this = $(this);
			      // });
		      }else{
			      original_coord = null;
			      is_table_cell = false;
		      }
		    },
		    "autoHide":true, "handles":"e,s,se", "cancel":"option","minWidth":"10","minHeight":"10"
		    //TODO , "containment":page.screen bugるため範囲内に収める独自処理を
	    };
	    var draggableOption ={"snap":".snap","snapTolerance":"8","distance":"4","containment":nowPage.screen, "delay":150,
				                    "stop":function(ev, ui){
				                      var _this = $(this);
				                      _this.removeClass('snap_border')
					                      .parent().removeClass('snap_border')
					                      .children('.snap').removeClass('snap_border');
				                      if(this.localName === 'table' || this.localName === 'ol'){//TODO sizeを持たせないタグ
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
					                      .parent(':not(.screen)').addClass('snap_border')
					                      .children('.snap').addClass('snap_border');
				                      var my_id = _this.attr('data-myhd-node-id');
				                      cached_arrow_factory = draw_arrow_s_factory(null, my_id);
				                    }
				                   };
	    var wrapped_is_true = typeof prop_s['class'] !== 'undefined' && prop_s['class'].indexOf('wrapped') !== -1;
	    var i_am_wrapper = typeof prop_s['class'] !== 'undefined' && prop_s['class'].indexOf('wrapper') !== -1;
	    if( i_am_wrapper ){
		    resizableOption["alsoResize"] = '[data-myhd-node-id^="'+my_node_id+MY_NODE_SEP+'"]';
		    resizableOption["stop"] = function(ev, ui){
		      var tmp = $('> *',work_jq);
		      work_jq.height(tmp.height() + 32).width(tmp.width() + 32);
		    };
	    }

	    removeSelected(work_jq)
	    [add_method]( target )
		    .data('myhd-htmlize-target',true)
		    .attr('data-myhd-htmlize-target',true);
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
		      if(!isParentRelative禁止タグ){
			      work_jq.draggable(draggableOption)
			        .data('draggableOption', draggableOption);
		      }else{
			      work_jq.css({"top":0, "left":0});
		      }
		    }else{
		      if(!isParentRelative禁止タグ){
			      work_jq.css('position','relative');//子要素のpositionがabsoluteになり得るため
		      }else{
			      work_jq.css({"top":0, "left":0});
		      }
		    }
		    if(!isParentRelative禁止タグ){
		      work_jq.css('position','absolute');
		    }else{
		      work_jq.css('position','relative');
		    }
		    work_jq
		      .resizable(resizableOption)
		      .data('resizableOption', resizableOption)
		      .addClass('snap');
	    }
	    if(amRelative禁止タグ){
		    work_jq.css({"top":0, "left":0});
	    }
	    rtn_work_jq_s.push(work_jq);
	  }//	for(var idx_tgt=0;idx_tgt < length_target_s;++idx_tgt)
	  return rtn_work_jq_s;
  }// function display_onscreen

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
	  if(!isEmpty(operated) && operated.attr !== undefined){
	    my_id = operated.attr('data-myhd-node-id');
	  }
	  cache = orDefault(cache,  draw_arrow_s_factory(null, my_id));
	  var arrow_s = cache['arrows'];
	  arrow_s.forEach(function(arrow,i,a){
	    var svg_cmd = LinePathCmdFactory();//BezierPathCmdFactory();//
	    var path_d_array = arrow[1];// 1 means path_d.
	    var path_d = '';
	    for(var p_idx=0;p_idx < path_d_array.length;++p_idx){
		    path_d += svg_cmd(get_center_abs_coord(get_offset_width_height(path_d_array[p_idx])));
	    }
	    arrow[0].attr('d',path_d);
	  });
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
	  if(typeof target_s === 'undefined' || target_s == null || ! target_s.hasOwnProperty('member_s')){
	    target_s = {"member_s":$('svg.data-conns > *[data-conns]', nowPage.screen)};
	  }
	  if(typeof op_my_id !== 'undefined' && op_my_id != null && op_my_id !== ''){
	    target_s['my_id'] = op_my_id;
	  }else{
	    op_my_id = null;
	  }

	  var arrow_func_s = [];
	  $.each(target_s.member_s,function(mIdx, obj){
	    var arrow = $(this);
	    var selector_s = arrow.attr('data-conns').split(' ');
	    var length_selector_s = selector_s.length;
	    var path_d = [];
	    var path_d_idx = 0;
	    for(var idx = 0;idx < length_selector_s;++idx){
		    var node_selector = selector_s[idx].trim();
		    if(node_selector.indexOf('#') === -1 && node_selector.indexOf('.') === -1){
		      if(node_selector.indexOf('-') > -1){
			      node_selector = '[data-myhd-node-id='+node_selector+']';
		      }else{
			      node_selector = '[data-myhd-obj-id='+node_selector+']';
		      }
		    }
		    var node_s = $(node_selector,nowPage.screen);
		    if(typeof node_s === 'undefined' || node_s == null || node_s.length === 0){
		      continue;
		    }
		    for(var node_idx = 0;node_idx < node_s.length;++node_idx){
		      var node = $(node_s[node_idx]);
		      var ch_my_id = node.attr('data-myhd-node-id');
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

  /**
   * process of selecting dom
   */
  function select_handler_factory(isAddSelected, callbacks){
	  return function (ev){// 選択処理実装
	    if(is_suspend) return;
	    ev.preventDefault();
	    ev.stopPropagation();
	    var _this = myWrapElement(this);
	    var my_node_id = _this.attr('data-myhd-node-id');
	    if( not_click ){
		    //TODO dragとclickが被るための対処策｡jquery内で解決策あれば･･･ => dragの閾値を設定
		    not_click = false;
		    return;
	    }

	    if(isEvaluated(isAddSelected, true)) {
        select_element(_this);
      }
	    setProps(_this, true);

	    // position relative
	    var posi_name_s = ["top", "left", "bottom", "right"];
	    var pool = analysisCss(_this.attr('style'));
	    var position = {};
	    posi_name_s.forEach(function(name,i,a){
		    position[name] = pool[name] === undefined  ? 'auto' : pool[name];
	    });
	    if(position['top'] !== 'auto'){
		    relativeTopBottom.val('top');
		    relativeTopBottomValue.val( position['top']);
	    }else{
		    relativeTopBottom.val('bottom');
		    relativeTopBottomValue.val( position['bottom']);
	    }
	    if(position['left'] !== 'auto'){
		    relativeLeftRight.val('left');
		    relativeLeftRightValue.val( position['left']);
	    }else{
		    relativeLeftRight.val('right');
		    relativeLeftRightValue.val( position['right']);
	    }

      // 選択されていない場合はcontextmenuのselectorの値を、右クリック時のDOMにする
      if (isAddSelected || getSelectedDomsOn().length === 0){
        context_menu.el_selector.val(my_node_id);
	      //parent_list
	      var parent_id_list = my_node_id.split(MY_NODE_SEP);
	      var concat_id = '';
	      var parentDomListHtml = '';
	      parent_id_list.forEach(function(my_id, idx){
		      concat_id += my_id;
		      var tmp = $('*[data-myhd-node-id='+concat_id+']', nowPage.screen).get(0);
		      if(typeof tmp !== 'undefined'){
		        parentDomListHtml += '<option value="'+concat_id+'">'+tmp.localName+'</option>';
		      }
		      concat_id += MY_NODE_SEP;
	      });
	      concat_id = concat_id.substring(0, concat_id.length - MY_NODE_SEP.length);
	      context_menu.parent_list.empty().append(parentDomListHtml).val(concat_id);
      }
      functionList(callbacks).forEach(function(callback){
        callback(ev);
      });
	  };
  }

  var commands = {};
  commands.append = function(){
	  function func_append(){
	    var kept_new = [];
	    var el_selected_s = getSelectedDomsOn();
	    var kept_target_s =  el_selected_s.length > 0 ? el_selected_s : [nowPage.screen];//追加先のデフォルトはscreen
	    var rtn = {
		    "execute":function(){
		      try{
			      if( kept_new.length !== 0){
			        $.each(kept_target_s, function(idx, target){
				        kept_new.forEach(function(obj,i,a){
				          $(target).append(obj);
				        });
			        });
			      }else{
			        var raw_tag_s = el_val_tag.val().trim();//Preset Name. not resolved
			        if( typeof raw_tag_s !== 'undefined' && raw_tag_s != ''){
				        var root = convert_data_to_display(raw_tag_s , el_val_array_json.val(), el_some_input.prop_list.val(), el_some_input.part_list.val());
				        kept_new = [];
				        $.each(root.child_s, function(cIdx, child){
				          kept_new.push(display_onscreen('appendTo', kept_target_s, child));
				        });
			        }
			      }
			      draw_arrow_s();
		      }catch(e){
			      console.log(e);
		      }
		    },
		    "undo":function(){
		      var tmp_new = [];
		      kept_new.forEach(function(objs,i,a){
			      var tmp_child = [];
			      objs.forEach(function(x,i,a){
			        tmp_child.push(x.detach());
			      });
			      tmp_new.push(tmp_child);
		      });
		      kept_new = tmp_new;
		    },
		    "getMyNodeId":function(){
		      return kept_new;
		    },
		    "displayName":function(){
		      return "Copy&Paste";
		    }
	    };
	    command_redo_history = [];
	    command_undo_history.push(rtn);
	    return rtn;
	  }
	  return new func_append();
  };

  /**
   * DOMを削除する。但し現スクリーンのみ
   */
  commands.delete = function(my_node_id){
	  function func_delete(my_node_id){
	    var kept = $('[data-myhd-node-id='+my_node_id+']');
	    var kept_my_node_id = my_node_id;
	    var rtn = {
		    "execute":function(){
		      kept.detach();
		    },
		    "undo":function(){
		      var parent_node_id = parentNodeId(my_node_id).parent_node_id;
		      $('[data-myhd-node-id='+parent_node_id+']').append(kept);
		    },
		    "getMyNodeId":function(){
		      return kept_my_node_id;
		    },
		    "displayName":function(){
		      return "Del";
		    }
	    };
	    command_redo_history = [];
	    command_undo_history.push(rtn);
	    return rtn;
	  }
	  return new func_delete(my_node_id);
  };

  commands.cut_paste = function(add_method, src_s, added_candidate_s){
	  function func_cut_paste(add_method, src_s, added_candidate_s){
	    var kepts = [];
	    var kept_src_node_id_s = [];
	    var kept_src_parend_id_s = [];
	    var kept_target_node_id_s = [];

	    src_s.each(function(){//copy,move,etc 元は全ページ対象
		    var _src = myWrapElement(this);
		    var src_node_id = _src.attr('data-myhd-node-id');
		    if(typeof src_node_id !== 'undefined'){
		      kepts.push(_src);
		      kept_src_node_id_s.push(src_node_id);
		      kept_src_parend_id_s.push(parentNodeId(src_node_id));
		    }
	    });
	    var target_s = added_candidate_s.filter(function(){
		    var rtn = true;
		    try{
		      var _target = $(this);
		      var target_node_id = _target.attr('data-myhd-node-id');
		      if(typeof target_node_id !== 'undefined'){
			      kept_src_node_id_s.forEach(function(src_node_id,i,a){
			        rtn &= ! (target_node_id+'-').startsWith(src_node_id+'-');
			        if(rtn === false){console.log('ウロボロス検知 :' + src_node_id +' : '+target_node_id);}
			      });
		      }
		    }catch(e){console.log(e);}
		    if(rtn === true){
		      kept_target_node_id_s.push(target_node_id);
		    }
		    return rtn;
	    });

	    var kept_new_copy;
	    var rtn = {
		    "execute":function(){
		      if(target_s.length !== 0){
			      kept_new_copy = [];
			      kepts.forEach(function(src,i,a){
			        var src_node_id = src.attr('data-myhd-node-id');
			        var source = get_child_tree_select_dom(src_node_id).raw()[src_node_id];
			        src.detach();
			        kept_new_copy.push(display_onscreen(add_method, target_s, source));
			      });
		      }
		    },
		    "undo":function(){
		      if(target_s.length !== 0){
			      kept_new_copy.forEach(function(new_copy,i,a){
			        new_copy.forEach(function(x,i,a){
				        x.detach();
			        });
			      });
			      kepts.forEach(function(src,i,a){
			        var src_node_id = kept_src_node_id_s[i];
			        var parent_node_id = kept_src_parend_id_s[i].parent_node_id;
			        $('[data-myhd-node-id='+parent_node_id+']').append(src);
			      });
		      }
		    },
		    "getMyNodeId":function(){
		      return kept_src_node_id_s;
		    },
		    "displayName":function(){
		      return "Cut&Paste";
		    }
	    };
	    command_redo_history = [];
	    command_undo_history.push(rtn);
	    return rtn;
	  };
	  return new func_cut_paste(add_method, src_s, added_candidate_s);
  };

  commands.copy_paste = function(add_method, src_s, added_candidate_s){
	  function func_copy_paste(add_method, src_s, added_candidate_s){
	    var kepts = [];
	    var kept_src_node_id_s = [];
	    var kept_src_parend_id_s = [];
	    var kept_target_node_id_s = [];

	    src_s.each(function(){//copy,move,etc 元は全ページ対象
		    var _src = myWrapElement(this);
		    var src_node_id = _src.attr('data-myhd-node-id');
		    if(typeof src_node_id !== 'undefined'){
		      kepts.push(_src);
		      kept_src_node_id_s.push(src_node_id);
		      kept_src_parend_id_s.push(parentNodeId(src_node_id));
		    }
	    });
	    var target_s = added_candidate_s.filter(function(){
		    var rtn = true;
		    try{
		      var _target = $(this);
		      var target_node_id = _target.attr('data-myhd-node-id');
		      if(typeof target_node_id !== 'undefined'){
			      kept_src_node_id_s.forEach(function(src_node_id,i,a){
			        rtn &= ! (target_node_id+'-').startsWith(src_node_id+'-');
			        if(rtn === false){console.log('ウロボロス検知 :' + src_node_id +' : '+target_node_id);}
			      });
		      }
		    }catch(e){console.log(e);}
		    if(rtn === true){
		      kept_target_node_id_s.push(target_node_id);
		    }
		    return rtn;
	    });

	    var kept_new_copy;
	    var rtn = {
		    "execute":function(){
		      if(target_s.length !== 0){
			      kept_new_copy = [];
			      kepts.forEach(function(src,i,a){
			        var src_node_id = src.attr('data-myhd-node-id');
			        var source = get_child_tree_select_dom(src_node_id).raw()[src_node_id];
		          //	    src.detach();
			        kept_new_copy.push(display_onscreen(add_method, target_s, source));
			      });
		      }
		    },
		    "undo":function(){
		      if(target_s.length !== 0){
			      kept_new_copy.forEach(function(new_copy,i,a){
			        new_copy.forEach(function(x,i,a){
				        x.detach();
			        });
			      });
		      }
		    },
		    "getMyNodeId":function(){
		      return kept_src_node_id_s;
		    },
		    "displayName":function(){
		      return "Copy&Paste";
		    }
	    };
	    command_redo_history = [];
	    command_undo_history.push(rtn);
	    return rtn;
	  };
	  return new func_copy_paste(add_method, src_s, added_candidate_s);
  };

  //TODO コードの共通化
  commands.copy_paste_dev = function(add_method, src_s, added_candidate_s){
	  function func_copy_paste(add_method, src_s, added_candidate_s){
	    var kepts = [];
	    var kept_src_node_id_s = [];
	    var kept_src_parend_id_s = [];
	    var kept_target_node_id_s = [];

	    src_s.each(function(){//copy,move,etc 元は全ページ対象
		    var _src = myWrapElement(this);
		    var src_node_id = _src.attr('data-myhd-node-id');
		    if(typeof src_node_id !== 'undefined'){
		      kepts.push(_src);
		      kept_src_node_id_s.push(src_node_id);
		      kept_src_parend_id_s.push(parentNodeId(src_node_id));
		    }
	    });
	    var target_s = added_candidate_s.filter(function(){
		    var rtn = true;
		    try{
		      var _target = $(this);
		      var target_node_id = _target.attr('data-myhd-node-id');
		      if(typeof target_node_id !== 'undefined'){
			      kept_src_node_id_s.forEach(function(src_node_id,i,a){
			        rtn &= ! (target_node_id+'-').startsWith(src_node_id+'-');
			        if(rtn === false){console.log('ウロボロス検知 :' + src_node_id +' : '+target_node_id);}
			      });
		      }
		    }catch(e){console.log(e);}
		    if(rtn === true){
		      kept_target_node_id_s.push(target_node_id);
		    }
		    return rtn;
	    });

	    var kept_new_copy = [];
	    var rtn = {
		    "execute":function(){
		      if(target_s.length !== 0){
			      if(kept_new_copy.length !== 0){
			        $.each(target_s, function(idx, target){
				        kept_new_copy.forEach(function(objs,i,a){
				          objs.forEach(function(x,i,a){
					          target_s.append(x);
				          });
				        });
			        });
			      }else{
			        kept_new_copy = [];
			        kepts.forEach(function(src,i,a){
				        var src_node_id = src.attr('data-myhd-node-id');
				        var source = get_child_tree_select_dom(src_node_id).raw()[src_node_id];
				        kept_new_copy.push(display_onscreen(add_method, target_s, source));
			        });
			      }
		      }
		    },
		    "undo":function(){
		      if(target_s.length !== 0){
			      var tmp_new = [];
			      kept_new_copy.forEach(function(new_copy,i,a){
			        var tmp_child = [];
			        new_copy.forEach(function(x,i,a){
				        tmp_child.push(x.detach());
			        });
			        tmp_new.push(tmp_child);
			      });
			      kept_new_copy = tmp_new;
		      }
		    },
		    "getMyNodeId":function(){
		      return kept_src_node_id_s;
		    },
		    "displayName":function(){
		      return "Copy&Paste";
		    }
	    };
	    command_redo_history = [];
	    command_undo_history.push(rtn);
	    return rtn;
	  };
	  return new func_copy_paste(add_method, src_s, added_candidate_s);
  };

  function parentNodeId(my_node_id){
	  var split = my_node_id.split(MY_NODE_SEP);
	  var my_obj_id = split.pop();
	  var parent_node_id = split.join(MY_NODE_SEP);
	  return {"my_obj_id":my_obj_id, "parent_node_id":parent_node_id};
  }

  function getStatus(){
	  var obj_id = 0;
	  var prop_id = 0;
	  var tree_growth_id = 0;
	  return {
	    "getNewMyObjId":function(){
		    return obj_id++;
	    },
	    "getNewProp":function(){
		    return prop_id++;
	    },
	    "getNewGrowth":function(){
		    return tree_growth_id++;
	    }
	  };
  }

  function preserve_destroied(obj){
	  var resizableOption = obj.data('resizableOption');
	  var draggableOption = obj.data('draggableOption');
	  if(typeof resizableOption !== 'undefined'){obj.data('resizableOption', resizableOption).resizable('destroy');}
	  if(typeof draggableOption !== 'undefined'){obj.draggable('destroy');}
	  return {"resizableOption":resizableOption, "draggableOption":draggableOption};
  }
  function recovery_position(obj, resizableOption, draggableOption){
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
  function preserve_destroy_remove_recovery_position(obj, conv, removed, callback){
	  var d_r_opt_s = preserve_destroied(obj);
	  callback(obj, conv);
	  removed.remove();
	  recovery_position(obj, d_r_opt_s.resizableOption);//, d_r_opt_s.draggableOption);
  }

  function getSelectedOrRoot(){
	  var NOW_SELECTED = getSelectedDomsOn();
	  var save = null;
	  /* create new */
	  if(NOW_SELECTED.length === 0){
	    var mother_id = nowPage.screen.attr('data-myhd-node-id');//attrだと文字, dataだとobj
	    var child_tree = get_child_tree_select_dom(mother_id);
	    save = child_tree.child_s();
	  }else{
	    save = [];
	    NOW_SELECTED.each(function(){
		    var _this = $(this);
		    var mother_id = _this.attr('data-myhd-node-id');
		    var child_tree = get_child_tree_select_dom(mother_id);
		    save.push(child_tree.self());
	    });
	  }
	  return save;
  }

  function refresh_select_list(some_key, el_some_select){
	  // creating option in select
	  var list_s_in_storage = orDefault(MY_STORAGE.select(some_key), []);
	  if(isEmpty(list_s_in_storage)){
	    return;
	  }
	  var keys_list_s = Object.keys(list_s_in_storage);
	  var length_keys_list_s = keys_list_s.length;
	  el_some_select.empty();
	  for(var i=0;i < length_keys_list_s;++i){
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

  /**
   * Tar preset 行追加
   */
  function new_empty_line(parent, key, val, is_add_button){
	  var part_list_func_s = [">","+"];
	  var new_li = $('<li>',{"style":"white-space:nowrap;","class":"p_list_child"});
	  if(is_add_button){
	    for(var idx=0;idx < part_list_func_s.length;++idx){
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
			      var counter = {};
			      var startDoller = false;
			      var pool = '';
			      expression.split('').forEach(function(x,i,a){
			        if( x === '$' ) startDoller = true;
			        if(startDoller){
				        if(x === ')' || x === ' ' || x === ','){
				          startDoller = false;
				          counter[pool] = true;
				          pool = '';
				          return;
				        }
				        pool += x;
			        }
			      });
			      counter = Object.keys(counter).length;
			      var params = counter > 0 ? '(,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,'.substring(0, counter) +')' : '';
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

  function setNowPage(btn, tgtPage){
	  $('.func_page_change', el_pageSpace).removeClass(CLASS_SELECTED_BTN_PAGE);// 既存の選択のアクティブを解除
	  btn.addClass(CLASS_SELECTED_BTN_PAGE);
	  if(!isEmpty(nowPage)){
	    nowPage.screen.removeClass('nowPage');
	  }
	  tgtPage.screen.addClass('nowPage');
	  nowPage = tgtPage;
  }

  function getSelectedDomsOn(_screen){
    var screen = _screen || nowPage.screen;
    return $('.'+CLASS_SELECTED, screen);
  }

  // angular
  // if(angular){
	//   var el_angular_boot = $('#HDangular_boot').on(MY_CLICK,function(){
	//     //save
  //     return publish('Angular');
	//   });
  // }

  function publish(name){
    el_sandbox_screen.empty();
	  var mother_ids = ROOT_BTN_PAGE.page.screen.siblings('.HDpageClass').map(function(idx, obj){
		  return $(obj).attr('data-myhd-node-id');
	  }).get();
	  mother_ids.unshift(ROOT_BTN_PAGE.page.screen.attr('data-myhd-node-id'));
	  var html = mother_ids.flatMap(function(mother_id,i,a){
      return get_child_tree_select_dom(mother_id).child_s();
	  });
	  return openWindowAndWrite('./HtmlDeveloping.htm', name, html);
	}

	function openWindowAndWrite(uri, name, parsedForHtmlize){
	  var newWindow = window.open(uri, name);
	  newWindow.document.open();
	  newWindow.document.write(htmlize(parsedForHtmlize));
	  newWindow.document.close();
    windows[name] = newWindow;
    return newWindow;
	}

  // publish
  var el_publish = $('#HDpublish').on(MY_CLICK,function() {
    var otherWindowNameOrUri = el_otherSite.val();
    if (!otherWindowNameOrUri){
      return ;
    }
    publish(otherWindowNameOrUri);
  });

  // including for ver server
  // var el_uriOtherSite = $('#HDuriOtherSite');
  var el_scanOtherSite = $('#HDscanOtherSite');
  // var el_openOtherSite = $('#HDopenOtherSite').on(MY_CLICK, function(){
  //   var uri = el_uriOtherSite.val();
  //   if (uri){
  //     var win = window.open(uri, 'otherSite', 'menubar=yes, toolbar=yes, location=yes, directories=yes, status=yes, resizable=yes, scrollbars=yes');

  var el_otherSite = $('#HDotherSite');
  el_scanOtherSite.off(MY_CLICK).on(MY_CLICK, function(){
    var otherWindowNameOrUri = el_otherSite.val();
    var root = [];
    if (!otherWindowNameOrUri){
      return ;
    }
    var otherWindow = windows[otherWindowNameOrUri];
    var el_html = $('html', otherWindow.document);
    var el_head = el_html.find(' > head');
    var el_body = el_html.find(' > body');

    // @tailrec
    function go(els, acc){
      els.each(function(){
        var _this = $(this);
        var tag = this.localName;
        var prop_s = {};
        var child_s = [];

        var attrs = attributes(_this);
        Object.keys(attrs).forEach(function(attr){
          prop_s[attr] = attrs[attr];
        });
        if (tag === 'script') {
          prop_s.html = _this.html();
        } else {
          prop_s.html = call_safe_html(_this);//  孫要素退避し、直接値を取得
        }
        var newDom = my_apply(tag, prop_s, child_s);
        acc.push(newDom);

        go(_this.find(' > *'), child_s);
      });
    }
    go(el_body, root);

    console.log('root : ' + JSON.stringify(root));
    display_onscreen('appendTo', nowPage.screen, root);
    return ;
  });

  //Util start
  function htmlTag2escape(htmlStr){
	  return htmlStr.replace(/></g,'>\n<').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function escape2htmlTag(htmlStr){
	  return htmlStr.replace(/></g,'>\n<').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  }
  function call_val(obj, set_val){
	  obj.data('myhd-obj-val', set_val);
	  obj.val(set_val);
  }
  /**
   * 上書き方式　子要素以下は削除される
   */
  function call_html(obj, set_val){
	  obj.data('myhd-obj-val', set_val);
	  obj.html(set_val);
  }
  /**
   * 孫要素を退避して追記する方式
   */
  function call_safe_text(obj, set_val){
	  var kept = $(' > *',obj).detach();
    var rtn = null;
    if (set_val){
	    obj.data('myhd-obj-val', set_val);
	    obj.text(set_val);
    }else{
      rtn = obj.text();
    }
	  kept.appendTo(obj);
    return rtn;
  }
  /**
   * 孫要素を退避して追記する方式
   */
  function call_safe_html(obj, set_val){
	  var kept = $(' > *',obj).detach();
    var rtn = null;
    if (set_val){
      rtn = set_val;
	    obj.data('myhd-obj-val', set_val);
	    obj.empty().html(set_val);
    }else{
      rtn = obj.html();
    }
	  kept.appendTo(obj);
    return rtn;

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
   * 後勝ちoverride
   */
  function merge_css(){
	  var pool = {};
	  var length_arguments = arguments.length;
	  for(var i=0;i < length_arguments;++i){
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
	  for(var css_key in pool)if(pool.hasOwnProperty(css_key)){
	    if(!isEmpty(pool[css_key])){
		    rtn += css_key+':'+pool[css_key]+';';
	    }
	  }
	  return rtn;
  }
  /**
   * styleがpoolを上書き
   */
  function analysisCss(style, pool){
	  if(typeof pool === 'undefined'){pool = {};}
	  style.split(';').forEach(function(x){
	    var key_val = x.trim().split(':');
	    if( key_val.length >= 2){
		    var val = key_val[1].trim();
		    if( typeof val === 'undefined' || val == null || val === 'null'){
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
		    var parent_obj_id = my_obj_id.substring(0,my_obj_id.toString().lastIndexOf(MY_NODE_SEP));
		    var pooled_parent = pool[parent_obj_id];
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
		    if(pool[mother_id] == null){
		      return [];
		    }
		    return pool[mother_id].child_s;
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

  function constructor_storage(FUNC_ID, targetStorage){
	  var uncommit_pool = {};
	  var is_locked = false;
	  if(!targetStorage){
	    targetStorage = localStorage;
	  }
	  return {
	    "raw":function(){
		    var raw = targetStorage[FUNC_ID];
		    if(typeof raw === 'undefined'){	raw = '{}';}
		    return raw;
	    },
	    "transaction":function(){
		    if(is_locked){throw new Error('transaction has opened.');
			               }else{
				               var raw = this.raw();
				               try{	uncommit_pool = JSON.parse(raw);
				                  }catch(e){
					                  targetStorage[FUNC_ID] = '{}';
				                  }
				               is_locked = true;
				               return this;
			               }
	    },
	    "commit":function(){
		    targetStorage[FUNC_ID] = JSON.stringify(uncommit_pool);
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
		      var raw = targetStorage[FUNC_ID];
		      if(typeof raw === 'undefined' || raw == null){return null;}
		      raw = JSON.parse(raw);
		      var saved = raw[key];
		      if(typeof saved === 'undefined'){	return null;
						                              }else{return saved;
							                                 }
		    }else{
		      try{pooled = JSON.parse(pooled);
		         }catch(e){console.log('JSON parse Error:' + e);}
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
		    for(var i=0;i <= loop;++i){
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
		    delete targetStorage[FUNC_ID];
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
		    param_s = orDefault(param_s, []);
		    if(param_s.length > 0){
		      func_name = param_s.shift();
		      this[func_name].apply(this, param_s);
		    }
		    return this;
	    }
	  };
  };

  function extract_from_dom(tree, raw_user_add_content_s){
	  if(raw_user_add_content_s == null || raw_user_add_content_s.length === 0){ return tree;}
	  var user_add_content_s = raw_user_add_content_s.filter(function(obj){
	    return obj != null;
	  });
	  if(user_add_content_s == null || user_add_content_s.length === 0){ return tree;}
	  $.each(user_add_content_s, function(i, content){
	    var target = my_apply();
	    var _content = $(content);
	    var my_obj_id = _content.attr('data-myhd-node-id');
	    for(var key in content) if(typeof _content.attr(key) !== 'undefined'){
		    target.prop_s[key] = _content.attr(key);
	    }
	    //TODO XXX	    target.prop_s['data-myhd-node-id'] = my_obj_id;
	    // console.log('user_add_content_s : ' + JSON.stringify(user_add_content_s));
	    var tagName = content.localName;
	    target.tag = tagName;

	    var raw_my_obj_val = _content.data('myhd-obj-val');
	    var my_obj_val ;
	    if(typeof raw_my_obj_val === 'undefined' || raw_my_obj_val === ''){
		    if ( tagName === 'input'){
		      my_obj_val = _content.val();
		    }else if(tagName === 'textarea'){
		      my_obj_val = _content.text();
		    }else if(tagName === 'path'){
		      my_obj_val = content.getAttribute('d');
		    }else{
		      my_obj_val = "";
		    }
	    }else{
		    my_obj_val = raw_my_obj_val;
	    }
	    var new_prop_s = {};
	    $.extend(true, new_prop_s, _content.data('my-org-prop_s'), target.prop_s);
	    target.prop_s = new_prop_s;
	    if( tagName === 'input'){//TODO 関数化
		    target.prop_s['value'] = my_obj_val;
	    }else if( tagName === 'path'){
		    target.prop_s['d'] = my_obj_val;
	    }else{
		    target.prop_s['html'] = my_obj_val;
	    }
	    tree.upsert(my_obj_id, target);
	  });
	  return tree;
  }

  function get_child_tree_select_dom(mother_id, _targetDocument){
    var targetDocument = _targetDocument || document;
	  var user_add_content_s = $(' *[data-myhd-node-id^='+mother_id+MY_NODE_SEP+']', targetDocument);
	  var root_dom = $('*[data-myhd-node-id='+mother_id+']')[0];
	  var tree = extract_from_dom(_tree(mother_id), [root_dom]);
	  var rtn = extract_from_dom(tree, user_add_content_s);
	  return rtn;
  };

  function get_z_index(parent_page_idx){
	  return 110 + parseInt(parent_page_idx,10);
  };
  function get_top(tag_size_s, parent_page_idx, my_idx){
	  if( parent_page_idx === 0){
	    return 100;
	  }else{
	    return 10 + (DEFAULT_HEIGHT + (DISTANT_HEIGHT - 10) * (tag_size_s.length - parent_page_idx) ) * (tag_size_s[parent_page_idx] * (my_idx));//TODO
	  }
  };
  function get_left(tag_size_s, parent_page_idx, my_idx){
	  if( parent_page_idx === 0){
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
	  ,genCalcFunction(1)
	  ,genCalcFunction(2)
	  ,genCalcFunction(3)
	  ,genCalcFunction(4)
	  ,genCalcFunction(5)
  ];
  function genCalcFunction(operatorIndex){
      switch(operatorIndex) {
      case 0:
	      throw new TypeError('operatorIndex shouldn\'t be 0.');
      case 1:// +
        return function(a0, a1){
	        if($.isNumeric(a0) && $.isNumeric(a1)){
            return a1 + a0;;
          } else if(a0 && a1){
            return a1.toString() + a0.toString() ;
          } else {
            return null;
          }
        };
      case 2:// -
        return function(a0, a1){
	        if($.isNumeric(a0) && $.isNumeric(a1)){
            return a1 - a0;;
          } else {
            return null;
          }
        };
      case 3:// *
        return function(a0, a1){
          var a0IsNumeric = $.isNumeric(a0);
          var a1IsNumeric = $.isNumeric(a1);
	        if(a0IsNumeric && a1IsNumeric){
            return a1 * a0;;
          } else if(a0 && a1){
            if(a0IsNumeric) {
              return Array(a0).fill(a1).join('');
            } else if(a1IsNumeric) {
              return Array(a1).fill(a0).join('');
            } else {
              return null;
            }
          } else {
            return null;
          }
        };
      case 4:// /
        return function(a0, a1){
	        if($.isNumeric(a0) && $.isNumeric(a1)){
            return a1 / a0;;
          } else {
            return null;;
          }
        };
      case 5:// %
        return function(a0, a1){
	        if($.isNumeric(a0) && $.isNumeric(a1)){
            return a1 % a0;;
          } else {
            return null;
          }
        };
      default:
        return NOP;
      }

  }


  function reverse_porlish_notation(formula, _param_s){
	  var param_s = arguments.length < 2 ? {} : orDefault(_param_s, {});
	  return reverse_porlish_notation_logic(formula, param_s, {})[0];
  }
  function reverse_porlish_notation_logic(_formula, _param_s, _resolved_param_s){
	  var param_s = {};$.extend(true,param_s, _param_s);
	  var resolved_param_s = {};$.extend(true,resolved_param_s, _resolved_param_s);
	  var formula = _formula;
	  var _parent_counter = 0;
	  if($.isArray(formula)){ formula = formula.join(' ');}
	  if(typeof formula === 'string'){ formula = formula.replace(/\s+/g,' ').trim();}
	  if(typeof formula !== 'undefined' && formula != null){
	    var stack = [];
	    var pool = '';
	    var num = 0;
	    var length_formula = formula.length;
	    for(var i=0;i<length_formula;++i){
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
              if (!$.isNumeric(num)){
                num = pool;
              }
			        pool = '';
			        stack.push(num);
			      }
		      }
		    }else if(IDX_MULTI <= op_idx && op_idx < IDX_PAREN
			           || ((i+1 === length_formula || formula.charAt(i+1) === ' ') && 0 < op_idx && op_idx < IDX_MULTI)){//(+3 -1 +)への対応
          var a0 = stack.pop();
          var a1 = stack.pop();
          if ($.isNumeric(a0)){

          }
		      stack.push(operator_s[op_idx] (a0, a1));
		    }else if( op_idx === IDX_PAREN){
		      ++i;
		      ++_parent_counter;
		      var pool_formula = "";
		      for(;i<length_formula;++i){
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
      console.log('stack : ' + JSON.stringify(stack));
	    throw new Error("Error formula is illegal : " + formula + ' : param_s : ' + JSON.stringify(param_s));
	  }
	  var rtn = stack[0];
	  if($.isNumeric(rtn) ){
	    rtn = parseInt(rtn,10);
	  }
	  return [rtn,param_s,resolved_param_s];
  }

  function orDefault(param, init){
	  if(isEmpty(param)){
	    return init;
	  }else{
	    return param;
	  }
  }

  function isEmpty(val){
	  return typeof val === 'undefined' || val === null || val === '';
  }

  function colorHex2Decimals(hex){
	  if(arguments.length < 1 || hex == null){
	    return [0, 0, 0];
	  }
	  var result = [];
	  while(hex.length >= 2){
	    result.push(parseInt(hex.substring(0, 2), 16));
	    hex = hex.substring(2);
	  }
	  return result;
  }

  function isEvaluated(bool_of_func, bool){
    return bool_of_func === bool
      || typeof bool_of_func === 'function' && bool_of_func() === bool;
  }

  function functionList(funcs){
    // guard
    if (!funcs){
      return [];
    }
    if ($.isArray[funcs]){
      return funcs.filter(function(func){
        return typeof func === 'function';
      });
    }else if (typeof funcs === 'function'){
      return [funcs];
    }else{
      return [];
    }
  }

  function attributes(jq){
    var rtn = {};
    var attrs = jq.get(0).attributes;
    for(var i = 0; i < attrs.length; ++i){
      var name_val = attrs[i];
      switch(name_val.name){
      // case 'class':
      //   rtn['class'] = name_val.value.split(' ').filter(function(obj){return !!obj;});
      //   break;
      // case 'style':
      //   rtn['style'] = name_val.value.split(' ').filter(function(obj){return !!obj;});
      //   break;
      default:
        rtn[name_val.name] = name_val.value;
      }
    }
    return rtn;;
  }
  /* console.log('reverse_porlish_notation: (abc hij +)' + JSON.stringify(reverse_porlish_notation('(abc hij +)')));
   * console.log('reverse_porlish_notation: ((abc 2 =) abc * hij +)'+ JSON.stringify(reverse_porlish_notation('((abc 2 =) abc * hij +)')));
   * console.log('reverse_porlish_notation: ((abc 2 =) abc * dfg *)' + JSON.stringify(reverse_porlish_notation('((abc 2 =) abc * dfg *)')));*/

  //Util end
});

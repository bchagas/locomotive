/*
* Aloha Image Plugin - Allow image manipulation in Aloha Editor
*
* Author & Copyright (c) 2011 Gentics Software GmbH
* aloha-sales@gentics.com
* Contributors
*       Johannes SchÃ¼th - http://jotschi.de
*     Nicolas karageuzian - http://nka.me/
*     Benjamin Athur Lupton - http://www.balupton.com/
*     Thomas Lete
*     Nils Dehl
*     Christopher Hlubek
*     Edward Tsech
*     Haymo Meran
*
* Licensed under the terms of http://www.aloha-editor.com/license.html
*/
define(["aloha/jquery","aloha/plugin","aloha/floatingmenu","i18n!aloha/nls/i18n","i18n!image/nls/i18n","jquery-plugin!image/vendor/ui/jquery-ui-1.8.10.custom.min","jquery-plugin!image/vendor/jcrop/jquery.jcrop.min","jquery-plugin!image/vendor/mousewheel/mousewheel","css!image/css/image.css","css!image/vendor/ui/ui-lightness/jquery-ui-1.8.10.cropnresize.css","css!image/vendor/jcrop/jquery.jcrop.css"],function(t,n,r,i,s){var o=t,u=t,a=window.GENTICS,f=window.Aloha;return String.prototype.toInteger=String.prototype.toInteger||function(){return parseInt(String(this).replace(/px$/,"")||0,10)},String.prototype.toFloat=String.prototype.toInteger||function(){return parseFloat(String(this).replace(/px$/,"")||0,10)},Number.prototype.toInteger=Number.prototype.toInteger||String.prototype.toInteger,Number.prototype.toFloat=Number.prototype.toFloat||String.prototype.toFloat,o.extend(!0,o.fn,{increase:o.fn.increase||function(e){var t=o(this),n,r;return t.length?(n=t.css(e).toFloat(),r=Math.round((n||1)*1.2),n==r&&r++,t.css(e,r),t):t},decrease:o.fn.decrease||function(e){var t=o(this),n,r;return t.length?(n=t.css(e).toFloat(),r=Math.round((n||0)*.8),n==r&&r>0&&r--,t.css(e,r),t):t}}),n.create("image",{languages:["en","fr","de","ru","cz"],defaultSettings:{maxWidth:1600,minWidth:3,maxHeight:1200,minHeight:3,autoCorrectManualInput:!0,fixedAspectRatio:!1,autoResize:!1,ui:{oneTab:!1,insert:!0,reset:!0,aspectRatioToggle:!0,align:!0,resize:!0,meta:!0,margin:!0,crop:!0,resizable:!0,handles:"ne, se, sw, nw"},onCropped:function(e,t){f.Log.info("Default onCropped invoked",e,t)},onReset:function(e){return f.Log.info("Default onReset invoked",e),!1},onResize:function(e){f.Log.info("Default onResize invoked",e)},onResized:function(e){f.Log.info("Default onResized invoked",e)}},_onCropped:function(e,t){u("#"+this.imgResizeHeightField.id).val(e.height()),u("#"+this.imgResizeWidthField.id).val(e.width()),u("body").trigger("aloha-image-cropped",[e,t]),this.onCropped(e,t)},_onReset:function(e){return u("#"+this.imgResizeHeightField.id).val(e.height()),u("#"+this.imgResizeWidthField.id).val(e.width()),u("body").trigger("aloha-image-reset",e),this.onReset(e)},_onResize:function(e){u("#"+this.imgResizeHeightField.id).val(e.height()),u("#"+this.imgResizeWidthField.id).val(e.width()),u("body").trigger("aloha-image-resize",e),this.onResize(e)},_onResized:function(e){u("#"+this.imgResizeHeightField.id).val(e.height()),u("#"+this.imgResizeWidthField.id).val(e.width()),u("body").trigger("aloha-image-resized",e),this.onResized(e)},imageObj:null,jcAPI:null,keepAspectRatio:!1,startAspectRatio:!1,restoreProps:[],objectTypeFilter:[],init:function(){var e=this,t=f.getPluginUrl("image");this.startAspectRatio=this.settings.fixedAspectRatio,this.config=this.defaultSettings,this.settings=o.extend(!0,this.defaultSettings,this.settings),e.initializeButtons(),e.bindInteractions(),e.subscribeEvents()},initializeButtons:function(){var e=this,t=i.t("floatingmenu.tab.insert"),n=s.t("floatingmenu.tab.img"),o=s.t("floatingmenu.tab.formatting"),u=s.t("floatingmenu.tab.crop"),a=s.t("floatingmenu.tab.resize");r.createScope(this.name,"Aloha.empty");if(this.settings.ui.insert){var f=this.settings.ui.oneTab?n:t;e._addUIInsertButton(f)}if(this.settings.ui.meta){var f=this.settings.ui.oneTab?n:n;e._addUIMetaButtons(f)}if(this.settings.ui.reset){var f=this.settings.ui.reset?n:n;e._addUIResetButton(f)}if(this.settings.ui.align){var f=this.settings.ui.oneTab?n:o;e._addUIAlignButtons(f)}if(this.settings.ui.margin){var f=this.settings.ui.oneTab?n:o;e._addUIMarginButtons(f)}if(this.settings.ui.crop){var f=this.settings.ui.oneTab?n:u;e._addUICropButtons(f)}if(this.settings.ui.resize){var f=this.settings.ui.oneTab?n:a;e._addUIResizeButtons(f)}if(this.settings.ui.aspectRatioToggle){var f=this.settings.ui.oneTab?n:a;e.__addUIAspectRatioToggleButton(f)}},__addUIAspectRatioToggleButton:function(e){var t=this,n=new f.ui.Button({size:"small",tooltip:s.t("button.toggle.tooltip"),toggle:!0,iconClass:"cnr-ratio",onclick:function(e,n){t.toggleKeepAspectRatio()}});this.settings.fixedAspectRatio!=0&&(n.pressed=!0,this.keepAspectRatio=!0),r.addButton(t.name,n,e,20)},_addUIResetButton:function(e){var t=this,n=new f.ui.Button({size:"small",tooltip:s.t("Reset"),toggle:!1,iconClass:"cnr-reset",onclick:function(e,n){t.reset()}});r.addButton(t.name,n,e,2)},_addUIInsertButton:function(e){var t=this;this.insertImgButton=new f.ui.Button({name:"insertimage",iconClass:"aloha-button aloha-image-insert",size:"small",onclick:function(){t.insertImg()},tooltip:s.t("button.addimg.tooltip"),toggle:!1}),r.addButton("Aloha.continuoustext",this.insertImgButton,e,1)},_addUIMetaButtons:function(e){var t=this,n=new f.ui.Button({label:s.t("field.img.src.label"),tooltip:s.t("field.img.src.tooltip"),size:"small"});this.imgSrcField=new f.ui.AttributeField({name:"imgsrc"}),this.imgSrcField.setObjectTypeFilter(this.objectTypeFilter);var i=new f.ui.Button({label:s.t("field.img.title.label"),tooltip:s.t("field.img.title.tooltip"),size:"small"});this.imgTitleField=new f.ui.AttributeField,this.imgTitleField.setObjectTypeFilter(),r.addButton(this.name,this.imgSrcField,e,1)},_addUIAlignButtons:function(e){var t=this,n=new f.ui.Button({iconClass:"aloha-img aloha-image-align-left",size:"small",onclick:function(){var e=o(t.findImgMarkup());e.add(e.parent()).css("float","left")},tooltip:s.t("button.img.align.left.tooltip")});r.addButton(t.name,n,e,1);var i=new f.ui.Button({iconClass:"aloha-img aloha-image-align-right",size:"small",onclick:function(){var e=o(t.findImgMarkup());e.add(e.parent()).css("float","right")},tooltip:s.t("button.img.align.right.tooltip")});r.addButton(t.name,i,e,1);var u=new f.ui.Button({iconClass:"aloha-img aloha-image-align-none",size:"small",onclick:function(){var e=o(t.findImgMarkup());e.add(e.parent()).css({"float":"none",display:"inline-block"})},tooltip:s.t("button.img.align.none.tooltip")});r.addButton(t.name,u,e,1)},_addUIMarginButtons:function(e){var t=this,n=new f.ui.Button({iconClass:"aloha-img aloha-image-padding-increase",toggle:!1,size:"small",onclick:function(){o(t.findImgMarkup()).increase("padding")},tooltip:s.t("padding.increase")});r.addButton(t.name,n,e,2);var i=new f.ui.Button({iconClass:"aloha-img aloha-image-padding-decrease",toggle:!1,size:"small",onclick:function(){o(t.findImgMarkup()).decrease("padding")},tooltip:s.t("padding.decrease")});r.addButton(t.name,i,e,2)},_addUICropButtons:function(e){var t=this;r.createScope("Aloha.img",["Aloha.global"]),this.cropButton=new f.ui.Button({size:"small",tooltip:s.t("Crop"),toggle:!0,iconClass:"cnr-crop",onclick:function(e,n){e.pressed?t.crop():t.endCrop()}}),r.addButton(this.name,this.cropButton,e,3)},_addUIResizeButtons:function(e){var t=this;this.imgResizeHeightField=new f.ui.AttributeField,this.imgResizeHeightField.maxValue=t.settings.maxHeight,this.imgResizeHeightField.minValue=t.settings.minHeight,this.imgResizeWidthField=new f.ui.AttributeField,this.imgResizeWidthField.maxValue=t.settings.maxWidth,this.imgResizeWidthField.minValue=t.settings.minWidth,this.imgResizeWidthField.width=50,this.imgResizeHeightField.width=50;var n=new f.ui.Button({label:s.t("width"),tooltip:s.t("width"),size:"small"});r.addButton(this.name,n,e,30),r.addButton(this.name,this.imgResizeWidthField,e,40);var i=new f.ui.Button({label:s.t("height"),tooltip:s.t("height"),size:"small"});r.addButton(this.name,i,e,50),r.addButton(this.name,this.imgResizeHeightField,e,60)},_addNaturalSizeButton:function(){var e=this,t=new f.ui.Button({iconClass:"aloha-img aloha-image-size-natural",size:"small",toggle:!1,onclick:function(){var t=new Image;t.onload=function(){var n=e.findImgMarkup();e.settings.ui.resizable&&e.endResize(),o(n).css({width:t.width+"px",height:t.height+"px","max-width":"","max-height":""}),e.settings.ui.resizable&&e.resize()},t.src=e.findImgMarkup().src},tooltip:s.t("size.natural")});r.addButton(this.name,t,tabResize,2)},bindInteractions:function(){var e=this;if(this.settings.ui.resizable)try{document.execCommand("enableObjectResizing",!1,!1)}catch(t){f.Log.error(t,"Could not disable enableObjectResizing")}this.settings.ui.meta&&(this.imgSrcField.addListener("keyup",function(t,n){e.srcChange()}),this.imgSrcField.addListener("blur",function(e,t){var n=o(e.getTargetObject());n.attr("src")===""&&n.remove()})),this.settings.onCropped&&typeof this.settings.onCropped=="function"&&(this.onCropped=this.settings.onCropped),this.settings.onReset&&typeof this.settings.onReset=="function"&&(this.onReset=this.settings.onReset),this.settings.onResized&&typeof this.settings.onResized=="function"&&(this.onResized=this.settings.onResized),this.settings.onResize&&typeof this.settings.onResize=="function"&&(this.onResize=this.settings.onResize)},subscribeEvents:function(){var e=this,t=this.settings;o("img").filter(t.globalselector).unbind(),o("img").filter(t.globalselector).click(function(t){e.clickImage(t)}),f.bind("aloha-drop-files-in-editable",function(t,n){var r,i=n.filesObjs.length,s,u;while(--i>=0)s=n.filesObjs[i],s.file.type.match(/image\//)&&(u=e.getEditableConfig(n.editable),r=o("<img/>"),r.css({"max-width":e.maxWidth,"max-height":e.maxHeight}),r.attr("id",s.id),typeof s.src=="undefined"?r.attr("src",s.data):r.attr("src",s.src),a.Utils.Dom.insertIntoDOM(r,n.range,o(f.activeEditable.obj)))}),f.bind("aloha-selection-changed",function(t,n,i){var s,u;i&&i.target&&e.settings.ui.resizable&&!o(i.target).hasClass("ui-resizable-handle")&&e.endResize();if(f.activeEditable!==null){u=e.findImgMarkup(n),s=e.getEditableConfig(f.activeEditable.obj);if(e.settings.ui.insert){if(typeof s=="undefined"){e.insertImgButton.hide();return}e.insertImgButton.show()}u?(e.insertImgButton.hide(),r.setScope(e.name),e.settings.ui.meta&&(e.imgSrcField.setTargetObject(u,"src"),e.imgTitleField.setTargetObject(u,"title")),e.imgSrcField.focus(),r.activateTabOfButton("imgsrc")):e.settings.ui.meta&&e.imgSrcField.setTargetObject(null),r.doLayout()}}),f.bind("aloha-editable-created",function(t,n){try{document.execCommand("enableObjectResizing",!1,!1)}catch(r){f.Log.error(r,"Could not disable enableObjectResizing")}n.obj.delegate("img","mouseup",function(t){e.clickImage(t),t.stopPropagation()})}),e._subscribeToResizeFieldEvents()},autoResize:function(){var e=this,t=e.imageObj.width(),n=e.imageObj.height();return t<e.settings.minWidth||t>e.settings.maxWidth||n<e.settings.minHeight||n>e.settings.maxHeight?(e._setNormalizedFieldValues("width"),e.setSizeByFieldValue(),!0):!1},toggleKeepAspectRatio:function(){this.keepAspectRatio=!this.keepAspectRatio,this.endResize();if(!this.keepAspectRatio)this.startAspectRatio=!1;else if(typeof this.settings.fixedAspectRatio!="number"){var e=this.imageObj.width()/this.imageObj.height();this.startAspectRatio=e}else this.startAspectRatio=this.settings.fixedAspectRatio;this.startResize()},_subscribeToResizeFieldEvents:function(){function t(t,n,r,i){typeof i=="undefined"&&(i=0),typeof r=="undefined"&&(r=8e3);var s=parseInt(t.val());if(isNaN(s))return t.css("background-color","red"),!1;var o=s+n;return n>=0&&o>r?e.settings.autoCorrectManualInput?(t.val(r),!0):(t.css("background-color","red"),!1):n<=0&&o<i?e.settings.autoCorrectManualInput?(t.val(i),!0):(t.css("background-color","red"),!1):(t.css("background-color",""),t.val(s+n),!0)}function n(n){var r=n.data.minValue,i=n.data.maxValue,s=n.data.fieldName;if(n.keyCode==8||n.keyCode==46)u(this).val()>=r&&(typeof e.jcAPI!="undefined"&&e.jcAPI!=null?e.setCropAreaByFieldValue():(e._setNormalizedFieldValues(s),e.setSizeByFieldValue()));else if(n.keyCode<=57&&n.keyCode>=48||n.keyCode<=105&&n.keyCode>=96)u(this).val()>=r&&(typeof e.jcAPI!="undefined"&&e.jcAPI!=null?e.setCropAreaByFieldValue():(e._setNormalizedFieldValues(s),e.setSizeByFieldValue()));else{var o=0;if(n.keyCode==38||n.keyCode==107)o=1;else if(n.keyCode==40||n.keyCode==109)o=-1;if(n.shiftKey||n.metaKey||n.ctrlKey)o*=10;t(u(this),o,i,r)&&(typeof e.jcAPI!="undefined"&&e.jcAPI!=null?e.setCropAreaByFieldValue():(e._setNormalizedFieldValues(s),e.setSizeByFieldValue()))}return n.preventDefault(),!1}function r(n,r){var i=n.data.minValue,s=n.data.maxValue,o=n.data.fieldName;if(n.shiftKey||n.metaKey||n.ctrlKey)r*=10;return t(u(this),r,s,i)&&(typeof e.jcAPI!="undefined"&&e.jcAPI!=null?e.setCropAreaByFieldValue():(e._setNormalizedFieldValues(o),e.setSizeByFieldValue())),!1}var e=this,i=u("#"+e.imgResizeHeightField.id),s={fieldName:"height",maxValue:e.imgResizeHeightField.maxValue,minValue:e.imgResizeHeightField.minValue};i.live("keyup",s,n),i.live("mousewheel",s,r);var o=u("#"+e.imgResizeWidthField.id),a={fieldName:"width",maxValue:e.imgResizeWidthField.maxValue,minValue:e.imgResizeWidthField.minValue};o.live("keyup",a,n),o.live("mousewheel",a,r)},_setNormalizedFieldValues:function(e){var t=this,n=o("#"+t.imgResizeWidthField.id),r=o("#"+t.imgResizeHeightField.id),i=n.val(),s=r.val(),u=t._normalizeSize(i,s,e);n.val(u.width),r.val(u.height)},setSize:function(e,t){var n=this;this.imageObj.width(e),this.imageObj.height(t);var r=this.imageObj.closest(".Aloha_Image_Resize");r.height(t),r.width(e),this._onResize(this.imageObj),this._onResized(this.imageObj)},clickImage:function(e){var t=this;t.imageObj=o(e.target);var n=t.imageObj;r.setScope(t.name);var i=n.closest(".aloha-editable");o(i).contentEditable(!1),this.restoreProps.push({obj:e.srcElement,src:t.imageObj.attr("src"),width:t.imageObj.width(),height:t.imageObj.height()}),u("#"+t.imgResizeHeightField.id).val(t.imageObj.height()),u("#"+t.imgResizeWidthField.id).val(t.imageObj.width()),this.settings.ui.resizable&&this.startResize(),this.settings.autoResize&&this.autoResize()},findImgMarkup:function(e){var t=this,n=this.config,r,i;typeof e=="undefined"&&(e=f.Selection.getRangeObject()),i=o(e.startContainer);try{if(f.activeEditable)return typeof e.startContainer!="undefined"&&typeof e.startContainer.childNodes!="undefined"&&typeof e.startOffset!="undefined"&&typeof e.startContainer.childNodes[e.startOffset]!="undefined"&&e.startContainer.childNodes[e.startOffset].nodeName.toLowerCase()==="img"&&e.startOffset+1===e.endOffset||i.hasClass("Aloha_Image_Resize")?(r=i.find("img")[0],r.css||(r.css=""),r.title||(r.title=""),r.src||(r.src=""),r):null}catch(s){f.Log.debug(s,"Error finding img markup.")}return null},_normalizeSize:function(e,t,n){function i(n){if(t>r.settings.maxHeight){var i={org:t,"new":r.settings.maxHeight};u("body").trigger("aloha-image-resize-outofbounds",["height","max",i]),t=r.settings.maxHeight}else if(t<r.settings.minHeight){var i={org:t,"new":r.settings.minHeight};u("body").trigger("aloha-image-resize-outofbounds",["height","min",i]),t=r.settings.minHeight}r.keepAspectRatio&&(e=t*o,n&&s(!1))}function s(n){if(e>r.settings.maxWidth){var s={org:e,"new":r.settings.maxWidth};u("body").trigger("aloha-image-resize-outofbounds",["width","max",s]),e=r.settings.maxWidth}else if(e<r.settings.minWidth){var s={org:e,"new":r.settings.minWidth};u("body").trigger("aloha-image-resize-outofbounds",["width","min",s]),e=r.settings.minWidth}r.keepAspectRatio&&(t=e/o,n&&i(!1))}var r=this;e=parseInt(e),t=parseInt(t);var o=1.33333;return typeof r.startAspectRatio=="number"&&(o=r.startAspectRatio),n=="width"&&s(!0),n=="height"&&i(!0),{width:Math.floor(e),height:Math.floor(t)}},setSizeByFieldValue:function(){var e=this,t=u("#"+e.imgResizeWidthField.id).val(),n=u("#"+e.imgResizeHeightField.id).val();e.setSize(t,n)},setCropAreaByFieldValue:function(){var e=this,t=e.jcAPI.tellSelect(),n=u("#"+e.imgResizeWidthField.id).val();n=parseInt(n);var r=u("#"+e.imgResizeHeightField.id).val();r=parseInt(r);var i=[t.x,t.y,t.x+n,t.y+r];e.jcAPI.setSelect(i)},insertImg:function(){var e=f.Selection.getRangeObject(),t=this.getEditableConfig(f.activeEditable.obj),n=f.getPluginUrl("image"),r,i,s;e.isCollapsed()?(r="max-width: "+t.maxWidth+"; max-height: "+t.maxHeight,i='<img style="'+r+'" src="'+n+'/img/blank.jpg" title="" />',s=o(i),a.Utils.Dom.insertIntoDOM(s,e,o(f.activeEditable.obj))):f.Log.error("img cannot markup a selection")},srcChange:function(){this.imageObj.attr("src",this.imgSrcField.getQueryValue())},positionCropButtons:function(){var e=o(".jcrop-tracker:first"),t=e.offset(),n=t.top,r=t.left,i=e.height(),s=e.width(),u=0,a=0,f=o("#aloha-CropNResize-btns");n==0&&r==0&&f.hide(),n=parseInt(n+i+3,10),r=parseInt(r+s/2-f.width()/2+10,10),(u!=r||a!=n)&&f.offset({top:n,left:r}),u=r,a=n},initCropButtons:function(){var e=this,t;o("body").append('<div id="aloha-CropNResize-btns" display="none"><button class="cnr-crop-apply" title="'+s.t("Accept")+'"></button>'+'<button class="cnr-crop-cancel" title="'+s.t("Cancel")+'"></button>'+"</div>"),t=o("#aloha-CropNResize-btns"),t.find(".cnr-crop-apply").click(function(){e.acceptCrop()}),t.find(".cnr-crop-cancel").click(function(){e.endCrop()}),this.interval=setInterval(function(){e.positionCropButtons()},10)},destroyCropButtons:function(){o("#aloha-CropNResize-btns").remove(),clearInterval(this.interval)},_disableSelection:function(e){e.find("*").attr("unselectable","on").css({"-moz-user-select":"none","-webkit-user-select":"none","user-select":"none"})},crop:function(){var e=this,t=this.config;this.initCropButtons(),this.settings.ui.resizable&&this.endResize(),this.jcAPI=o.Jcrop(this.imageObj,{onSelect:function(){e._onCropSelect(),setTimeout(function(){r.setScope(e.name)},10)}}),e._disableSelection(u(".jcrop-holder")),e._disableSelection(u("#imageContainer")),e._disableSelection(u("#aloha-CropNResize-btns")),u("body").trigger("aloha-image-crop-start",[this.imageObj])},_onCropSelect:function(){var e=this;o("#aloha-CropNResize-btns").fadeIn("slow"),o(".jcrop-handle").mousedown(function(){o("#aloha-CropNResize-btns").hide()}),o(".jcrop-tracker").mousedown(function(){o("#aloha-CropNResize-btns").hide()});if(typeof e.jcAPI!="undefined"&&e.jcAPI!=null){e.positionCropButtons();var t=e.jcAPI.tellSelect(),n=o("#"+e.imgResizeWidthField.id).val(t.w),r=o("#"+e.imgResizeHeightField.id).val(t.h)}},endCrop:function(){this.jcAPI&&(this.jcAPI.destroy(),this.jcAPI=null),this.destroyCropButtons(),this.cropButton.extButton.toggle(!1),this.settings.ui.resizable&&this.startResize();if(this.keepAspectRatio){var e=this.imageObj.width()/this.imageObj.height();this.startAspectRatio=e}u("body").trigger("aloha-image-crop-stop",[this.imageObj])},acceptCrop:function(){this._onCropped(this.imageObj,this.jcAPI.tellSelect()),this.endCrop()},startResize:function(){var e=this,t=this.imageObj;t=this.imageObj.css({height:this.imageObj.height(),width:this.imageObj.width(),position:"relative","max-height":"","max-width":""}),t.resizable({maxHeight:e.settings.maxHeight,minHeight:e.settings.minHeight,maxWidth:e.settings.maxWidth,minWidth:e.settings.minWidth,aspectRatio:e.startAspectRatio,handles:e.settings.handles,grid:e.settings.grid,resize:function(t,n){e._onResize(e.imageObj)},stop:function(t,n){e._onResized(e.imageObj),this.enableCrop&&setTimeout(function(){r.setScope(e.name),e.done(t)},10)}}),t.css("display","inline-block"),o(".ui-wrapper").attr("contentEditable",!1).addClass("aloha-image-box-active Aloha_Image_Resize aloha").css({position:"relative",display:"inline-block","float":e.imageObj.css("float")}).bind("resizestart",function(e){e.preventDefault()}).bind("mouseup",function(e){e.originalEvent.stopSelectionUpdate=!0})},endResize:function(){if(this.imageObj){var e=this.imageObj.closest(".aloha-editable");o(e).contentEditable(!0)}this.imageObj&&this.imageObj.resizable("destroy").css({top:0,left:0})},reset:function(){this.settings.ui.crop&&this.endCrop(),this.settings.ui.resizable&&this.endResize();if(this._onReset(this.imageObj))return;for(var e=0;e<this.restoreProps.length;e++)if(this.imageObj.get(0)===this.restoreProps[e].obj){this.imageObj.attr("src",this.restoreProps[e].src),this.imageObj.width(this.restoreProps[e].width),this.imageObj.height(this.restoreProps[e].height);return}}})});
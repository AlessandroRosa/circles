//v.3.6 build 130416

/*
Copyright Dinamenta, UAB http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/
function dhtmlxSlider(a,b,c,d,e,i,h,j,l){if(_isIE)try{document.execCommand("BackgroundImageCache",!1,!0)}catch(l){}var f;if(a&&typeof a=="object"&&!a.nodeName)f=a.parent,c=a.skin,e=a.min,i=a.max,j=a.step,d=a.vertical,h=a.value,b=a.size;if(a)f=typeof a!="object"?document.getElementById(a):a;else{var k="slider_div_"+(new Date).valueOf()+Math.random(1E3);f=document.createElement("div");f.setAttribute("id",k);for(var g=document.body.lastChild;g.lastChild&&g.lastChild.nodeType==1;)g=g.lastChild;g.parentNode.insertBefore(f,
g)}if(typeof b=="object")c=b.skin,e=b.min,i=b.max,j=b.step,d=b.vertical,h=b.value,b=b.size;this.label=l;this.size=b;this.vMode=d||!1;this.skin=dhtmlx.skin||c||"default";this.parent=f;this.disabled=this.isInit=!1;this.value=h=="undefined"?e||0:h;this.inputPriority=!0;this.stepping=!1;this.imgURL=window.dhx_globalImgPath||dhtmlx.image_path||"";this._skinsImgs={"default":{ls:1,lz:1,rz:1,rs:1},ball:{ls:1,lz:1,rz:1,rs:1},zipper:{bg:1,lz:1,rz:1},arrow:{bg:1,ls:1,rs:1},arrowgreen:{bg:1,ls:1,rs:1},simplesilver:{lz:1,
ls:1,rs:1,rz:1},simplegray:{lz:1,ls:1,rs:1,rz:1},bar:{bg:1,ls:1,rs:1},dhx_skyblue:{bg:1}};this._def=[e-0||0,i-0||100,j-0||1,h-0||0,b-0];dhtmlxEventable(this);return this}
dhtmlxSlider.prototype.createStructure=function(){if(this.con)this.con.parentNode.removeChild(this.con),this.con=null;if(this.vMode){this._sW="height";this._sH="width";this._sL="top";this._sT="left";var a=this.imgURL+"skins/"+this.skin+"/vertical/"}else this._sW="width",this._sH="height",this._sL="left",this._sT="top",a=this.imgURL+"skins/"+this.skin+"/";this.con=document.createElement("DIV");this.con.onselectstart=function(){return!1};this.con._etype="slider";this.con.className="dhtmlxSlider"+(this.skin!=
"default"?"_"+this.skin:"");if(this._skinsImgs[this.skin].bg)this.con.style.backgroundImage="url("+a+"bg.gif)";this.drag=document.createElement("DIV");this.drag._etype="drag";this.drag.className="selector";this.drag.style.backgroundImage="url("+a+"selector.gif)";var b=document.createElement("DIV");b.className="leftSide";if(this._skinsImgs[this.skin].ls)b.style.background="url("+a+"leftside_bg.gif)";this.leftZone=document.createElement("DIV");this.leftZone.className="leftZone";if(this._skinsImgs[this.skin].lz)this.leftZone.style.background=
"url("+a+"leftzone_bg.gif)";var c=document.createElement("DIV");c.className="rightSide";if(this._skinsImgs[this.skin].rs)c.style.background="url("+a+"rightside_bg.gif)";this.rightZone=document.createElement("DIV");this.rightZone.className="rightZone";if(this._skinsImgs[this.skin].rz)this.rightZone.style.background="url("+a+"rightzone_bg.gif)";this.con.appendChild(b);this.con.appendChild(this.leftZone);this.con.appendChild(this.rightZone);this.con.appendChild(c);this.con.appendChild(this.drag);this.parent.appendChild(this.con);
(!this.parent.parentNode||!this.parent.parentNode.tagName)&&document.body.appendChild(this.parent);if(this.vMode){this._sW="height";this._sH="width";this._sL="top";this._sT="left";this.con.style.width=this.con.offsetHeight+"px";for(var d=0;d<this.con.childNodes.length;d++){this.con.childNodes[d].style.fontSize="0";var e=this.con.childNodes[d].offsetWidth;this.con.childNodes[d].style.width=this.con.childNodes[d].offsetHeight+"px";this.con.childNodes[d].style.height=e+"px";e=this.con.childNodes[d].offsetLeft;
this.con.childNodes[d].style.left=this.con.childNodes[d].offsetTop+"px";this.con.childNodes[d].style.top=e+"px"}c.style.top=this.size-c.offsetHeight+"px";this.zoneSize=this.size-c.offsetHeight;this.dragLeft=this.drag.offsetTop;this.dragWidth=this.drag.offsetHeight;this.rightZone.style.height=this.zoneSize+"px"}else this.zoneSize=this.size-c.offsetWidth,this.dragLeft=this.drag.offsetLeft,this.dragWidth=this.drag.offsetWidth,this.rightZone.style.width=this.zoneSize+"px";this.con.style[this._sW]=this.size+
"px";this.con.onmousedown=this._onMouseDown;this.con.onmouseup=this.con.onmouseout=function(){clearInterval(this.that._int)};this.con.that=this;this._aCalc(this._def)};
dhtmlxSlider.prototype._aCalc=function(a){if(this.isInit){this.shift=a[0];this.limit=a[1]-this.shift;this._mod=(a[4]-this.dragLeft*2-this.dragWidth)/this.limit;this._step=a[2];this.step=this._step*this._mod;this._xlimit=a[4]-this.dragLeft*2-this.dragWidth;if(!this.posX)this.posX=this._xlimit*(a[3]-this.shift)/this.limit;this._applyPos(!0);return this}};dhtmlxSlider.prototype.setMin=function(a){this._def[0]=a-0;this._aCalc(this._def)};dhtmlxSlider.prototype.setMax=function(a){this._def[1]=a-0;this._aCalc(this._def)};
dhtmlxSlider.prototype.setStep=function(a){this._def[2]=a-0;this._aCalc(this._def)};
dhtmlxSlider.prototype._applyPos=function(a){if(this.isInit){if(this.step!=1&&this.step)this.posX=Math.round(this.posX/this.step)*this.step;if(this.posX<0)this.posX=0;if(this.value<(this._def[0]||0))this.value=this._def[0]||0;if(this.value>this._def[1])this.value=this._def[1];if(this.posX>this._xlimit)this.posX=this._xlimit;var b=this.drag.style[this._sL];this.drag.style[this._sL]=this.posX+this.dragLeft*1+"px";this.leftZone.style[this._sW]=this.posX+this.dragLeft*1+"px";this.rightZone.style[this._sL]=
this.posX+this.dragLeft*1+1+"px";this.rightZone.style[this._sW]=this.zoneSize-(this.posX+this.dragLeft*1)+"px";var c=this.getValue();if(this._link)this._linkBoth?this._link.value=c:this._link.innerHTML=c;!a&&b!=this.drag.style[this._sL]&&this.callEvent("onChange",[c,this]);this.value=this.getValue();this._dttp||this._setTooltip(c)}};dhtmlxSlider.prototype._setTooltip=function(a){this.con.title=a};dhtmlxSlider.prototype.setSkin=function(a){this.skin=a||"default";this.isInit&&this.createStructure()};
dhtmlxSlider.prototype.startDrag=function(a){if(!this._busy&&(a.button===0||a.button===1)){this.drag_mx=a.clientX;this.drag_my=a.clientY;this.drag_cx=this.posX;this.d_b_move=document.body.onmousemove;this.d_b_up=document.body.onmouseup;var b=this;document.body.onmouseup=function(a){b.stopDrag(a||event);b=null};document.body.onmousemove=function(a){b.onDrag(a||event)};this._busy=!0}};
dhtmlxSlider.prototype.onDrag=function(a){if(this._busy)this.posX=this.vMode?this.drag_cx+a.clientY-this.drag_my:this.drag_cx+a.clientX-this.drag_mx,this._applyPos()};dhtmlxSlider.prototype.stopDrag=function(){document.body.onmousemove=this.d_b_move?this.d_b_move:null;document.body.onmouseup=this.d_b_up?this.d_b_up:null;this.d_b_move=this.d_b_up=null;this._busy=!1;this.callEvent("onSlideEnd",[this.getValue()])};
dhtmlxSlider.prototype.getValue=function(){return!this._busy&&this.inputPriority?(Math.round(this.value/this._step)*this._step).toFixed(6)-0:Math.round((Math.round(this.posX/this._mod/this._step)*this._step+this.shift*1)*1E4)/1E4};dhtmlxSlider.prototype.setValue=function(a,b){if(!isNaN(a))this._def[3]=this.value=a-0,this.posX=Math.round(((a||0)-this.shift)*this._mod),this._applyPos(b==null?!0:b)};
dhtmlxSlider.prototype._getActionElement=function(a){return a._etype?a:a.parentNode?this._getActionElement(a.parentNode):null};
dhtmlxSlider.prototype._onMouseDown=function(a){if(!this.that.disabled){var a=a||event,b=this.that,c=b._getActionElement(_isIE?a.srcElement:a.target);switch(c._etype){case "slider":var d=b.vMode?a.clientY-(getAbsoluteTop(b.con)-document.body.scrollTop):a.clientX-(getAbsoluteLeft(b.con)-document.body.scrollLeft),e=b.posX;b.posX=d-b.dragLeft-b.dragWidth/2;b.direction=b.posX>e?1:-1;b.stepping?(clearInterval(b._int),b.setValue(b.value+b._step*b.direction,!1),b._int=setInterval(function(){b.setValue(b.value+
b._step*b.direction,!1)},600)):(b._busy=!0,b._applyPos(),b._busy=!1);break;case "drag":b.startDrag(a||event)}return!1}};dhtmlxSlider.prototype.setOnChangeHandler=function(a){this.attachEvent("onChange",a)};dhtmlxSlider.prototype._linkFrom=function(){this.disabled||this.setValue(parseFloat(this._link.value),!1)};
dhtmlxSlider.prototype.linkTo=function(a){this._link=a=typeof a!="object"?document.getElementById(a):a;var b=a.tagName.toString().toLowerCase();if(this._linkBoth=b=="input"||b=="select"||b=="textarea"?1:0){var c=this,d=function(){this._nextSlider&&window.clearTimeout(this._nextSlider);this._nextSlider=window.setTimeout(function(){c._linkFrom()},500)};a.onblur=a.onkeypress=a.onchange=d}this._applyPos()};
dhtmlxSlider.prototype.enableTooltip=function(a){this._dttp=!convertStringToBoolean(a);this._setTooltip(this._dttp?"":this.getValue())};
dhtmlxSlider.prototype.setImagePath=function(a){this.imgURL=a};dhtmlxSlider.prototype.init=function(){this.isInit=!0;this.createStructure()};dhtmlxSlider.prototype.setInputPriority=function(a){this.inputPriority=a};dhtmlxSlider.prototype.setSteppingMode=function(a){this.stepping=a};dhtmlxSlider.prototype.disable=function(a){this.disabled=a};
(function(){dhtmlx.extend_api("dhtmlxSlider",{_init:function(a){return[a.parent,a.size,a.skin,a.vertical,a.min,a.max,a.value,a.step]},link:"linkTo"},{})})();

//v.3.6 build 130416

/*
CopyrigDinamenta, UABTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/
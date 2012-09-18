;/**
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.3.1
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,e,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
;(function($) {

	$.fn.replaceholder = function(options) {

		var $placeholder;

		(this.length > 0) ? $this = $(this) : $this = $('input[placeholder]');
		return $this.each(function() {

			settings = jQuery.extend(options);

			var $placeholder = $(this);

			if ($placeholder.length > 0) {

				var attrPh = $placeholder.attr('placeholder');

				$placeholder.attr('value', attrPh);
				$placeholder.bind('focus', function() {

					var $this = $(this);

					if($this.val() === attrPh)
						$this.val('').removeClass('placeholder');

				}).bind('blur', function() {

					var $this = $(this);

					if($this.val() === '')
						$this.val(attrPh).addClass('placeholder');

				});

			}

		});

	};

})(jQuery);

jQuery(function($){
  $(document).ready(function(){
    if (!Modernizr.input.placeholder) { $("input[placeholder], textarea[placeholder]").replaceholder() }
  })
})

;$(function(){
  $('span.color').each(function(i,e){
   e = $(e);
   e.after('<span class="swatch" style="background-color:'+e.text()+';"></span>');
  });
  $('span.arg[data-default-value]').each(function(i,e){
    e = $(e);
    e.attr("title", "Defaults to: " + e.attr("data-default-value"))
  });
});

/*;(function()
{
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;
	function Brush(){};
	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['sass', 'scss', 'css', 'html'];

	SyntaxHighlighter.brushes.Sass = Brush;

	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();*/



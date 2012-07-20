(function($){
	jQuery.fn.isValidImg = function(options) {
		var defaults = {
			errorimg: jQuery("#spacerImage").html(),
			errortext: "NO IMAGE",
			displaystyle: "none"
		};
		var options = jQuery.extend(defaults, options);	
		var elementCount = jQuery(this).size();
		return this.each(function(){
			if(jQuery(this).is("img")) {
				var img = new Image();
				var sender = jQuery(this);
				var src=jQuery(this).attr("src");

				jQuery(img).load(function() {		
					jQuery(sender).show();
					elementCount--; //decrease counter

					jQuery(sender).removeClass('invalidImg');
					jQuery(sender).addClass('validImg');
					if(elementCount == 0){
						if(options.onFinishedValidation){					
							options.onFinishedValidation.call();
						}
					 }
				}).error(function (){
					switch(options.displaystyle){
						case "text":
							jQuery(sender).replaceWith("<span class='error'>"+options.errortext+"</span>");
						break;
						case "img":
							this.src=options.errorimg;
							jQuery(sender).replaceWith(this);
							//jQuery(sender).addClass('invalidImg');
						break;
						default:
							//jQuery(sender).remove();
							jQuery(sender).attr('src','/content/ebiz/anthropologie/resources/images/spacer.gif');
							jQuery(sender).removeClass('validImg');
							jQuery(sender).addClass('invalidImg');
					}// end switch

					elementCount--; //decrease counter
					if(elementCount == 0){
						if(options.onFinishedValidation){							
							options.onFinishedValidation.call();
						}
					}
				}).attr('src', src); //end jQuery(img).load
			}// end if(jQuery(this).is("img"))
		});//end this.each
	};
})(jQuery);
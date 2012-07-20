var selected;


function selectThis(num) {
		var fadeboxAR = $$('div.fadebox');
		var tabAR = $$('div.tab');
		var thumbAR = $$('a.thumbnail img');
		for(var t=0; t < fadeboxAR.length; t++) {
			if(t == num) {
				selected =thumbAR[t];
				Effect.Appear($(fadeboxAR[t]), { duration: .6 });
				$(tabAR[t]).show();
				$(thumbAR[t]).style.border = '2px solid #727272';

			} else {
				$(fadeboxAR[t]).hide();
				$(tabAR[t]).hide();
				$(thumbAR[t]).style.border = '2px solid transparent';

			}
		}
}


Event.observe(window, 'load', function(){
									   
		var thumbAR = $$('a.thumbnail img');
		$(thumbAR[0]).style.border = '2px solid #727272';
		selected = $(thumbAR[0]);
		var fadeboxAR = $$('div.fadebox');
		var tabAR = $$('div.tab');
		
		Effect.Appear($(fadeboxAR[0]), { duration: .6 });
		Effect.Appear($(tabAR[0]), { duration: .6 });
		
     	thumbAR.each(function(el){
              el.onmouseover  = function(){
			  	if(this == selected) {
				} else {
			  		this.style.border = '2px solid #727272';
				}
			   }
              el.onmouseout  = function() {
			  	if(this == selected) {
				} else {
			  		this.style.border = '2px solid transparent';
				}
				
			  }
        });
		
		
		$$('area.outitem').each( function(input) {
			new Tooltip(input, {backgroundColor: "#FFF", borderColor: "#999", 
		textColor: "#333", textShadowColor: "#FFF", delay:"0", opacity:"1", appearDuration:"0", hideDuration:"0"});
			});
		
									
    });


// JavaScript Document
	var popups;
	
	
	Event.observe(window, 'load', function(){		
	
		var screenWidth = getBrowserWidth();
		var screenHeight = getBrowserHeight();
		
		var ie = (navigator.userAgent.indexOf("MSIE") > 0) ? true:false;
					   
		popups = $$('div.popup');
		
			if( window.innerHeight && window.scrollMaxY ) // Firefox
			{
				pageWidth = window.innerWidth + window.scrollMaxX;
				pageHeight = window.innerHeight + window.scrollMaxY;
			}
			else if( document.body.scrollHeight > document.body.offsetHeight ) // all but Explorer Mac
			{
				pageWidth = document.body.scrollWidth;
				pageHeight = document.body.scrollHeight;
			}
			else // works in Explorer 6 Strict, Mozilla (not FF) and Safari
			{
				pageWidth = document.body.offsetWidth + document.body.offsetLeft;
				pageHeight = document.body.offsetHeight + document.body.offsetTop;
			}
			$('popupWrapper').style.height = pageHeight + "px";	
			if (ie) {
				$('popupWrapper').style.width = screenWidth + "px";	
				$('popupWrapper').style.height = screenHeight + "px";	
			}  
    });
	
	function popup(num) {
		
		for(var t=0; t < $$('div.popup').length; t++) {
			var arr = $($$('div.popup')[t]).childElements();
			if(t == num) {
				Effect.Appear($($$('div.popup')[t]), { duration: .3 });
				for(var u=0; u < arr.length; u++) {
					if(u == 0) {
						$(arr[u]).show();
					} else {
						$(arr[u]).hide();
					}
				}
			} else {
				Effect.Fade($($$('div.popup')[t]), { duration: .3 });
			}
			
		}
		
		
		$('popupWrapper').style.display = 'block';
	}
	
	function closeThis(num) {
		Effect.Fade($(popups[num]), { duration: .3 });
		$('popupWrapper').hide();
		
	}
	
	function hidePopup() {
		for(var t=0; t < $$('div.popup').length; t++) {
			Effect.Fade($($$('div.popup')[t]), { duration: .3 });
		}
		$('popupWrapper').hide();
	}
	
	function openPage(num1,num2) {



		for(var t=0; t < $$('div.popup').length; t++) {
			var arr = $($$('div.popup')[t]).childElements();
			for(var u=0; u < arr.length; u++) {
				if(t == num1 && u == num2) {
					$(arr[u]).show();
				} else { 
					$(arr[u]).hide();
				}
			}
		}


	}
	
	function getBrowserWidth() {
		var val = 0;
		if ((document.documentElement) && (document.documentElement.clientWidth != 0)) {
			val = document.documentElement.clientWidth;
		} else if (document.body) {
			val = document.body.clientWidth;
		} else if (window.innerWidth) {
			val = window.innerWidth;
		}
		return val;
	};

	// return browser height
	function getBrowserHeight() {
		var val = 0;
		if ((document.documentElement) && (document.documentElement.clientWidth != 0)) {
			val = document.documentElement.clientHeight;
		} else if (window.innerHeight) {
			val = window.innerHeight;
		} else if (document.body) {
			val = document.body.clientHeight;
		}	
		return val;
	};

/*
 * Author: John Norris - johnanthonynorris@googlemail.com
 * 
 * Description: Accepts imageData - array of objects containing image urls and ids (see example below) and 
 * creates a main image with alternate clickable views and a popup handler for the main image
 * 
 *  [
 *		{
 *		  imageid: "7122600940133_042_b",
 *		  alternateviewlinkid:"alternatelink_" + Math.floor(Math.random()*110),
 *		  url:"http://images.anthropologie.eu/is/image/Anthropologie/7122600940133_042_b"
 *		}
 *	]
 * 
 * Requires:
 * jquery
 * jquery valid image plugin
 * yui 2
 * jqzoom evolution
 * 
 * <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.9.0/build/container/assets/skins/sam/container.css">
 * <!-- Dependencies -->
 * <script src="http://yui.yahooapis.com/2.9.0/build/yahoo-dom-event/yahoo-dom-event.js"></script>
 * <script src="http://yui.yahooapis.com/2.9.0/build/container/container-min.js"></script>
 * <script src="jquery.js" type="text/javascript"></script>
 * <script src="jquery.isValidImg.js" type="text/javascript"></script>
 * <script src="jquery.jqzoom-core.js" type="text/javascript"></script>
 * <link rel="stylesheet" type="text/css" href="jquery.jqzoom.css"> 
 */


alternateView = function(options) {
	
	this.defaultOptions = {
					popupLoadingImageSrc: "http://anthropologie.uat.venda.com/content/ebiz/anthropologie/resources/images/loading_bar.gif",
					mainImageLoadingSrc: "http://anthropologie.uat.venda.com/content/ebiz/anthropologie/resources/images/loading.gif'",
					popupLoadingText:"",
					productName:"",
					mainImageHolder:"mainImageHolder",
					imageData:[],
					popupLinks:[]
	}
	
	/* merge object2 into object1 */
	jQuery.extend(this.defaultOptions, options);
	
	//set up the loading panel straight away...
	this.setLoadingPanel();
	
	//set product name text 
	this.setProductName(this.defaultOptions.productName);
	
	//the image data - array of objects containing urls and stuff for each image alternate view
	this.setAlternateViewImageUrls(this.defaultOptions.imageData);
	
	
	jQuery("#" + this.defaultOptions.mainImageHolder).after( this.getAlternateViewHTML(this.imageUrls) );
	this.hideSmallImages();
	this.checkForInvalidSmallImages();
	
};




alternateView.prototype.setZoom = function() {

	var options = {
		zoomWidth: 370,
		zoomHeight: 435,
		xOffset: 40,
		yOffset: 0,
		position: "right",
		title: false
	};

	jQuery('.avJqzoom').jqzoom(options);
};


alternateView.prototype.setLoadingPanel = function(){
	
	//create pop-up
    var mainImagexPosition = (document.documentElement.clientWidth - 511) / 2;
    this.loadingImageContainer =  new YAHOO.widget.Panel("loading_panel",{ fade:0.24, y:10, x:mainImagexPosition, modal:true, fixedcenter: false ,close: true,draggable: false,zindex:4,visible: false});
   	this.loadingImageContainer.showEvent.subscribe(function(e){});
   	this.loadingImageContainer.setHeader("<div class=\"tl\"></div><span>" +  this.defaultOptions.popupLoadingText+ "</span><div class=\"tr\"></div>");
    this.loadingImageContainer.setBody('<img src="' + this.popupLoadingImageSrc + '" alt="" />');	 
    this.loadingImageContainer.render(document.body);
	
}


/*
 * Show loading panel while large image is loading
 */
alternateView.prototype.showLoadingPanel = function(){
	
	this.loadingImageContainer.show();
}

/*
 * Hide loading panel when large image is loading
 */
alternateView.prototype.hideLoadingPanel = function(){
	
	this.loadingImageContainer.hide();
	
}


/*
 * show main image
 */
alternateView.prototype.setProductName = function(name) {
	
	if(typeof name != "string"){ return false;}
	this.productName = name;
	
};


/*
 * changes the main image (not the popup image) to that which matches the 
 * imageid parameter given.
 */

alternateView.prototype.changeMainImage = function(imageid) {
	
	var newImage = this.getMainImageHtml(imageid);
	
};


/*
 * removes event listeners 
 */

alternateView.prototype.addPopupEventListeners = function(imageid) {
	
	var _this = this;
	
	for(var i=0; i< this.defaultOptions.popupLinks.length; i++){
		
		try{ 
			
			//get the element
			var el  = jQuery(this.defaultOptions.popupLinks[i]);
			
			//remove the event listeners
			el[0].onclick = null;
			
			
			
			  if (el[0].addEventListener) {
				  
				  //add event listener for current main image
					el[0].addEventListener("click", function(event){

						event.preventDefault ? event.preventDefault() : event.returnValue = false;
						_this.showImagePopup(imageid);
						
					}, false);
				    
				    
				}else if (el[0].attachEvent) {
					
					el[0].attachEvent("onclick", function(event){
						
						event.preventDefault ? event.preventDefault() : event.returnValue = false;
						_this.showImagePopup(imageid);
						
					});    
				    
				}
			  
			
			
		
			
			
		}catch(e){
			
			//cannot find the el?
		}
	}
	
};


/*
 * change main image
 */
alternateView.prototype.getMainImageHtml = function(imageid) {
	
	_this = this;
	
	
	for( var i=0 ; i< this.imageUrls.length; i++){
		
		if( this.imageUrls[i].imageid == imageid ){
		
			var iddata =  this.imageUrls[i];
			
		}
		
	}
	
	    document.getElementById(this.defaultOptions.mainImageHolder).innerHTML = "";
	
		var newdiv = document.createElement('div'); 
		newdiv.setAttribute('id', 'loadingMain');
		
		var loadingImg = document.createElement('img');
		    //loadingImg.setAttribute('src',this.defaultOptions.mainImageLoadingSrc);
		
		    if( loadingImg.setAttribute){
		    	 loadingImg.setAttribute('src',this.defaultOptions.mainImageLoadingSrc);
				}else{
					loadingImg.src = this.defaultOptions.mainImageLoadingSrc;
				}
		    
		newdiv.appendChild(loadingImg); 
		
	
	    
	var mediumImageLink = document.createElement('a');
		mediumImageLink.setAttribute('id','medium|'+iddata.imageid);
		mediumImageLink.setAttribute('href',iddata.url+"?$uk-zoom-5x$");
		mediumImageLink.className += " avJqzoom";
		
		mediumImageLink.setAttribute('className', "avJqzoom") ||
		mediumImageLink.setAttribute('class', "avJqzoom")

		
		/*mediumImageLink.addEventListener("click", function(event){
			
														event.preventDefault();
														_this.showImagePopup(imageid);
														
													}, false); */
		
		
		
		  if (mediumImageLink.addEventListener) {
			  
			  
			  //add event listener for current main image
			  mediumImageLink.addEventListener("click", function(event){
					
				  event.preventDefault ? event.preventDefault() : event.returnValue = false;
					_this.showImagePopup(imageid);
					
				}, false); 
			    
			    
			}else if (mediumImageLink.attachEvent) {
				
				 mediumImageLink.attachEvent("onclick", function(event){
						
					 event.preventDefault ? event.preventDefault() : event.returnValue = false;
						_this.showImagePopup(imageid);
					
				});    
			    
			}
		
		
		this.addPopupEventListeners(iddata.imageid);
		
		
	var mediumImage = document.createElement('img');
		//mediumImage.setAttribute('src',iddata.url);
		
		 if(mediumImage.setAttribute){
			 mediumImage.setAttribute('src',iddata.url+'?$uk_pdt_medium$&'+new Date().getTime());
			}else{
				mediumImage.src = iddata.url;
			}
		
		/*mediumImage.addEventListener("load", function(event){
			
											event.preventDefault();
											//alert('Loaded medium image so hiding loading image');
											
											if (document.getElementById("loadingMain")) {
												document.getElementById("loadingMain").style.display = "none";
											}
											
											this.style.display = "block";
											_this.setZoom();
											//Venda.ProductDetail.activejQzoom();
			
		}, false);*/
		
		
		
		 if (mediumImage.addEventListener) {
			  
					mediumImage.addEventListener("load", function(event){
										
						    			event.preventDefault ? event.preventDefault() : event.returnValue = false;
										//alert('Loaded medium image so hiding loading image');
										
										if (document.getElementById("loadingMain")) {
											document.getElementById("loadingMain").style.display = "none";
										}
										
										_this.setZoom();
										
										
										this.style.display = "block";
										//Venda.ProductDetail.activejQzoom();
					
					}, false);
			    
			    
			}else if (mediumImage.attachEvent) {
				
				 mediumImage.attachEvent("onload", function(event){
						
					  	event.preventDefault ? event.preventDefault() : event.returnValue = false;
						//alert('Loaded medium image so hiding loading image');
						
						if (document.getElementById("loadingMain")) {
							document.getElementById("loadingMain").style.display = "none";
						}
						
						

						
						setTimeout(function(){_this.setZoom()},1000);
						
						//this.style.display = "block";
						event.srcElement.display = "block";
						//Venda.ProductDetail.activejQzoom();
					
				});
				  
			}
		
		
		
		
		mediumImageLink.appendChild(mediumImage);

    var container = document.getElementById(this.defaultOptions.mainImageHolder);
    
 
    container.appendChild(newdiv);
    container.appendChild(mediumImageLink);
	
	return container;
	
};


/*
 * create image object - older browser compatible
 */
alternateView.prototype.createNewImageElement = function(src, alt, title) {

	var img;
	
    if( new Image()){
    	
    	img = new Image();
    	
    }else{ 
    	
    	 img = document.createElement('img') 
    	}
    
    img.src= src;
    if (alt!=null) img.alt= alt;
    if (title!=null) img.title= title;
    return img;
}


/*
 * gets the first image which has been validated
 */
alternateView.prototype.showImagePopup = function(imageid) {
	
	
	var _this = this;
	
	for( var i=0 ; i< this.imageUrls.length; i++){
		
		if( this.imageUrls[i].imageid == imageid ){
		
			var iddata =  this.imageUrls[i];
			
		}
		
	}
	
	//create pop-up
    var mainImagexPosition = (document.documentElement.clientWidth - 511) / 2;
    
 
    
    if(this.popupContainerExists){ 
    	
    	this.oufitImageContainer.setHeader("<div class=\"tl\"></div><span>"+ _this.defaultOptions.productName +"</span><div class=\"tr\"></div>");
   	 	this.oufitImageContainer.setBody('<img width="100%" src="'+ iddata.url  +'?$uk-zoom-5x$" alt="" />');
   	 	this.oufitImageContainer.render(document.body);
   	 	this.oufitImageContainer.show();
    	
    }else{
        	
    	 this.oufitImageContainer =  new YAHOO.widget.Panel("enlarge_panel",{ fade:0.24, y:10, x:mainImagexPosition, modal:true, fixedcenter: false ,close: true,draggable: false,zindex:4,visible: false});
    	 this.oufitImageContainer.showEvent.subscribe(function(e){});
    	 this.oufitImageContainer.setHeader("<div class=\"tl\"></div><span>"+ _this.defaultOptions.productName +"</span><div class=\"tr\"></div>");
    	 
    	//"http://anthropologie.uat.venda.com/content/ebiz/anthropologie/resources/images/loading_bar.gif
    	 
    	 
    	 
    	 
    	 //var productImage = document.createElement('img');
    	// var productImage = this.createNewImageElement(iddata.url  +'?$uk-zoom-5x$', this.defaultOptions.productName, this.defaultOptions.productName);
    	 //productImage.setAttribute('width','100%');
    	 //productImage.src = iddata.url  +'?$uk-zoom-5x$'
    	 //productImage.setAttribute('src',iddata.url  +'?$uk-zoom-5x$');
    	 
    
    	
    	 /*if(productImage.setAttribute){
    		 productImage.setAttribute('src',iddata.url  +'?$uk-zoom-5x$');
			}else{
				productImage.src = iddata.url  +'?$uk-zoom-5x$'
			}*/
    	 
    	 
    	 
    	/* productImage.addEventListener("load", function(event){
				event.preventDefault();
				_this.loadingImageContainer.hide();
				_this.oufitImageContainer.show();	
		}, false); */
    	 
    	 
    	 
    	 
    	 
    	 //enlarge_panel_av
    	 
    	 
    	 
    	 var productImageContainer = document.createElement('div');
    	 productImageContainer.setAttribute('id','av_product_popup_image_container');
	productImageContainer.setAttribute('width','100%');
    	 
    	 this.oufitImageContainer.setBody(productImageContainer);
    	 this.oufitImageContainer.render(document.body);
    	 
    	 jQuery("#av_product_popup_image_container").append('<img width="100%" src="'+iddata.url  +'?$uk-zoom-5x$'+'" alt="'+ this.defaultOptions.productName+'" title="'+ this.defaultOptions.productName+'">');
    	 jQuery("#av_product_popup_image_container img").load(function(event){
    		 
    		    event.preventDefault ? event.preventDefault() : event.returnValue = false;
				_this.loadingImageContainer.hide();
				_this.oufitImageContainer.show();	
    		 
    	 });
    	 
 
    	 this.loadingImageContainer.show();
    	 
    	 this.popupContainerExists = true;
    	 
    }
    
   
    	
    	
    	
    
    
   
	
};


/*
 * checks for invalid images using jquery image valid plugin
 */
alternateView.prototype.checkForInvalidSmallImages = function() {
	 
	altDiv = "#alternateViewParent";
	_this = this;
	
	
	if( jQuery(altDiv + " img").isValidImg({onFinishedValidation:function(){
		
		var current = 0, current_imageid;
		
		// to find the 1st alternate image
		jQuery(altDiv).find("a").each(function(index) {
			
			if(jQuery(this).find("img.validImg").length != 0) {
				current = index;
				//current_imageid = this.firstChild.id.slice(  (this.firstChild.id.indexOf("|") +1) ); 
				current_imageid = this.id.slice(  (this.id.indexOf("|") +1) ); 
				return false;
			}
			
		});
		
		// need to call these 2 func. after all images have completely validated
		_this.changeMainImage(current_imageid); //id?
		
		
	}}) ){
		
		return true;
		
	}
	
}; 

/*
 * set up the image paths
 */ 
alternateView.prototype.setAlternateViewImageUrls = function(arrayOfImageUrls){
	 
	if(arguments.length != 1){return false;} 
	
	if( Object.prototype.toString.call( arrayOfImageUrls ) != '[object Array]' ) {
	  return false;
	}
	
	if( arrayOfImageUrls.length < 1 ){ return false;};
	
	var t = arrayOfImageUrls.toString();
	
	this.imageUrls = arrayOfImageUrls;
	
	return true;
	
};

/*
 * hides the small alternate view images 
 */
alternateView.prototype.hideSmallImages = function() {
	if( jQuery("#alternateViewParent img").hide()){return true;}else{return false;}
}; 

/*
 * Gets the alternate view html 
 */
alternateView.prototype.getAlternateViewHTML = function(alternateImagePathArray) {
	
	
	var newdiv = document.createElement('div'); 
		newdiv.setAttribute('id', 'alternateViewParent');
		
	for(var i = 0; i< alternateImagePathArray.length; i++){
		
		var link = document.createElement('a');
		link.setAttribute('id', alternateImagePathArray[i].alternateviewlinkid);
		link.setAttribute('href','#');
		/*link.addEventListener("click", function(event){
															event.preventDefault();
															//change image!!
															_this.changeMainImage( this.firstChild.id.slice(  (this.firstChild.id.indexOf("|") +1) ) ); //id?
															
													}, false); */
		
		
		
		
		
		if (link.addEventListener) {
			  
			  //add event listener for current main image
			link.addEventListener("click", function(event){
					
						event.preventDefault ? event.preventDefault() : event.returnValue = false;
						//change image!!
						//_this.changeMainImage( this.firstChild.id.slice(  (this.firstChild.id.indexOf("|") +1) ) ); //id?
						//_this.changeMainImage( this.event.srcElement.id.slice(  (this.event.srcElement.id.indexOf("|") +1) ) ); //id?
						
					
						var id = this.id.slice(  (this.id.indexOf("|") +1) );
						
						_this.changeMainImage(id); 
				}, false);
			    
			    
			}else if (link.attachEvent) {
				
				link.attachEvent("onclick", function(event,other){
					
					event.preventDefault ? event.preventDefault() : event.returnValue = false;
					//change image!!
					//_this.changeMainImage( this.firstChild.id.slice(  (this.firstChild.id.indexOf("|") +1) ) ); //id?
					//_this.changeMainImage( this.event.srcElement.id.slice(  (this.event.srcElement.id.indexOf("|") +1) ) ); //id?/id?
					
					
					var id = event.srcElement.id.slice(  (event.srcElement.id.indexOf("|") +1) );
					
					_this.changeMainImage(id); 
					
				});    
			    
		}
		
		
		
		
		
		
		
		var image = document.createElement('img');
			image.setAttribute('id','thumb|'+ alternateImagePathArray[i].imageid);
			
			if(image.setAttribute){
				image.setAttribute('src',alternateImagePathArray[i].url + '?$uk_pdt_thumb$');
			}else{
				image.src = alternateImagePathArray[i].url + '?$uk_pdt_thumb$'
			}
			
			
	
		link.appendChild(image);
		newdiv.appendChild(link);
	}
	
	return newdiv;
	
}; 
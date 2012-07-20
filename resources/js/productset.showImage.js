
//helper class
function showMainImage(){
	
	this.productInstance = false;
	
	this.imgObj = null;
	
	this.doIt = function(instanceObject) {
		    
		   var imgId = "mainImage" + instanceObject.productInstance.configObjArea["objProductUniqueId"];
		    //var self = this;
		   
		   var contextObj = instanceObject;
		   
		   var min = 700;
            var max = 900;
            // and the formula is:
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
		    //jQuery(document).ready(function(){
		    	
		    	//YAHOO.util.Event.onContentReady ( imgId , instanceObject.hideLoading , instanceObject , instanceObject );
		    	
		   // });
		    
		    
		    
			setTimeout(function(){
					
					//set to chain?
					//YAHOO.util.Event.addListener( window.document , "load", this.hideLoading, "otherArg", instanceObject );				
				 	//instanceObject.hideLoading()
				 	
				 	
				    //YAHOO.util.Event.onContentReady ( "mainImage" + instanceObject.configObjArea["objProductUniqueId"] , fn , obj , overrideContext );
				    
				      
				    
				   // YAHOO.util.Event.onDOMReady(function(obj){
				    	
				    	/*YAHOO.util.Event.onContentReady(imgId , function(contextObj){
				    		
				    			jQuery("#loadingMain" + contextObj.productInstance.configObjArea["objProductUniqueId"]).css("display","none");
								jQuery("#mainImageView" + contextObj.productInstance.configObjArea["objProductUniqueId"]).css("display","block"); 
								
								//this.imgObj.style.display = "block";
								
								contextObj.productInstance.activejQzoom();
				    		
				    	}, contextObj , contextObj );*/
				    	
				    //}, instanceObject , instanceObject );
				
				   instanceObject.hideLoading(contextObj);
				
				 }, random);
		};
	
	this.hideLoading = function(obj) {
	
			/*if (document.getElementById("loadingMain" + this.productInstance.configObjArea["objProductUniqueId"])) {
				document.getElementById("loadingMain" + this.productInstance.configObjArea["objProductUniqueId"]).style.display = "none";
			}*/	
			
			jQuery("#loadingMain" + obj.productInstance.configObjArea["objProductUniqueId"]).css("display","none");
			jQuery("#mainImageView" + obj.productInstance.configObjArea["objProductUniqueId"]).css("display","block"); 
			
			//this.imgObj.style.display = "block";
			
			this.productInstance.activejQzoom();
			
			};
			
	this.setImg = function(imgObj) {
			this.imgObj = imgObj;
	};

};
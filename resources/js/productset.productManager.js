
function MultiProductDetailManager(){
	

	
	this.productDetailObjects = [];
	
	this.getProductObjectByUniqueId = function( productId ){
		
		var productInstance = false;
		
		for(var i=0; i<this.productDetailObjects.length;i++){
			
			if( this.productDetailObjects[i].configObjArea["objProductUniqueId"] == productId ){
				
				productInstance = this.productDetailObjects[i];
				
			};
		};
		
		return productInstance;
		
	};
	
	this.addProductObject = function( productDetailObject ){
		
		//check if it exists:
		//if( !this.getProductObjectByUniqueId( productDetailObject.configObjArea["objProductUniqueId"] ) ){
			
			//return instance
			this.productDetailObjects.push( productDetailObject );
			
		//}else{
			
			//add to array of instances
		//	return this.getProductObjectByUniqueId( productDetailObject.configObjArea["objProductUniqueId"] );
		//}
		
	};

};



genericProductSetDetailFunctions = {};

genericProductSetDetailFunctions.createDialog = function(popupid,title,content) {
	
    var container, conn, callback, loadingPanel;
    
   
            var xPosition = (document.documentElement.clientWidth - 750) / 2; 
   
               container =  new YAHOO.widget.Panel(popupid,  
                                                { width: "750px",
                                                  fixedcenter: false, 
                                                  close: true, 
                                                  draggable: false, 
                                                  zindex:4,
                                                  modal: true,
                                                  visible: false,
                                                  x:xPosition,
							 y:10
                                                } 
                                            );

                container.showEvent.subscribe(function(e){ 
                		productTab = new YAHOO.widget.TabView("productdetail-tab"); 
                	});	
               
                container.setHeader(title);
                container.setBody(content);
                container.render(document.body);
                container.show();
               
  
}


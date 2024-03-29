

function MultiProductDetailClass(){
	
	
	
	
	
	this.showMainImage = false;
	 
	this.flighted   = true;  // Default for all Birds
	this.isFlighted = function () { return this.flighted };
	
	/**
	*  Alternate Views
	*/
	this.allImages = [];
	
	
	this.setProductAttributeSwatch = function(attributeSwatchInstance){
		
		this.attributeSwatchInstance = attributeSwatchInstance;
		this.doXPosition();
	};
	
	this.test = function(){
		
		alert("MultiProductDetailClass..check");
		
	};
	
	this.configObjArea = {
		objDropdown: null,
		objDefaultImage: null,
		objProduct: null,
		objMediumArea: null,
		objLinkArea: null,
		objAlternateViewArea: null,
	    objProductUniqueId: null
	};
	
	this.configDefault = {
		productName: "",
		mediumAltText: "",
		mediumTitleText: "",
		viewLargeTitle: "",
		viewLargeText: "",
		downloadText: "",
		largeNotAvailText: "",
		largeNotAvailAltText: "",
		loadingImage: "",
		noImage: ""
	};
	
	this.configImageware = {
		enableImageware: "",
		zoomableText: "",
		zoomableImagelink: "",
		zoomableTextlink: ""
	};
	
	this.configAlternateView = {
		alternateViewPagedStyle: "",
		alternateViewBehavior: "",
		alternateViewAltText: "",
		alternateViewTitleText: "",
		alternateViewHeaderText: ""
	};
	
	this.configPopupPanel = {
		popupHeader: "",
		loadingHeader: "",
		loadingPanel: "",	
		closePanel: "",
		closePanelTitle: "",
		closeTextLink: ""
	};
	
	/**
	* Sets the config values to each config type
	* @param {string} configType this is an configuration type name
	* @param {array} settings this is the value of each configuration type
	*/
	this.init = function(configType,settings) {
		
		for (var eachProp in settings) {
			this[configType][eachProp] = settings[eachProp];
		}
		
		//set up the add to cart button to work with minicartpop (if there quantity on hand is > 0)
		var thisObject = this;
		YAHOO.util.Event.addListener(window, "load", this.overideMinicartPopupAddProductEvent, {}, this);
		
	};
	
	
	this.loadImage = function(attValue,imgSources) {
		this.allImages[attValue] = imgSources;
	};
	/**
	* Change
	* @param {string} attValue - attribute 1 (color) value
	*/
	this.changeSet = function(attValue) {
		this.changeAlternateViewSet({attValue:attValue,no:0});
		this.checkValidImage(attValue);
	};
	
	this.checkValidImage = function(attValue) {
		var largeDiv = "#"+jQuery(this.configObjArea["objLinkArea"]).attr("id");
		var mediumDiv = "#"+jQuery(this.configObjArea["objMediumArea"]).attr("id");
		var altDiv = "#"+jQuery(this.configObjArea["objAlternateViewArea"]).attr("id");
		var thisProductDetailInstance = this;
		
		jQuery(altDiv+" img").hide();
		jQuery(altDiv+" img").isValidImg({onFinishedValidation:function(){
			var current = 0;
			// to find the 1st alternate image
			jQuery(altDiv).find("a").each(function(index) {
				if(jQuery(this).find("img.validImg").length != 0) {
					current = index;
					return false;
				}
			});
			
			// need to call these 2 func. after all images have completely validated
			thisProductDetailInstance.changeMainImage({attValue:attValue,no:current});
			thisProductDetailInstance.changeViewLargeLink({attValue:attValue,no:current});
			
			// preselect the 1st alternate image by default
			jQuery(altDiv+" a").eq(current).addClass("selected");
			
			// replace main image with 'spacer.gif' if alternate image is empty
			if (jQuery(altDiv).find("img.validImg").length == 0) {	
				jQuery(mediumDiv+" .jqzoomevo").remove();
				
				jQuery(mediumDiv+" #loadingMain" + thisProductDetailInstance.configObjArea["objProductUniqueId"]).after("<img src=\"" + thisProductDetailInstance.configDefault["noImage"]["medium"] + " style=\"display:none\" onload=\"var instance = " + thisProductDetailInstance.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + thisProductDetailInstance.configObjArea["objProductUniqueId"] + "'); instance.showMainImage.setImg(this); instance.showMainImage.doIt(instance.showMainImage);\">");
				
				jQuery(largeDiv).hide();
			} else {
				jQuery(largeDiv).show();
			}
		}});
	};
	
	/**
	 * Active jQzoom
	**/
	this.activejQzoom = function (){
		var options = {
			zoomWidth: 328,
			zoomHeight: 215,
			xOffset: 173,
			yOffset: 0,
			position: "right",
			zoomType:"standard",
			title:false
		};
		
		jQuery('.jqzoomevo').jqzoom(options);//?? only for one dom element instance??
	};
	
	
	/**
	* Puts loading image during the time that main image is loaded to show
	* @param {object} imgObj - 
	* @returns {function} imgTag - HTMLCollection of an image tag
	*/
	
	this.showMainImage = null;
	
	/**
	* Get the attribute 
	* @param {object} objArray - 
	* @param {object} value - 
	* @returns {object}  - 
	*/
	this.findExistingElement = function(objArray,value) {
		for(var i = 0;i< objArray.length; i++){
			if(objArray[i].colour === value)
				return {found:true,elementId:i};
		}
		return {found:false};
	};
	
	/**
	* Gets the image HTML tag
	* @param {object} mappingData - properties collection of each image
	* @returns {string} imgTag - HTMLCollection of an image tag
	*/
	this.getImageTag = function(mappingData) {
		var imgTag = "";
		var imgTagSuffix = "";
		
		// get image tag for 'Alternative images'
		if (mappingData.isAltImage && mappingData.imgChange) {
			if (this.configAlternateView["alternateViewBehavior"] == "onmouseover") { imgTagSuffix = " onclick=\"return false;\">"; } else { imgTagSuffix = ">";}
		
			// define classname for each image
			if (mappingData.countData == 0) {
				imgTag = "<div class=\"isFirst\"><a href=\""+mappingData.imgChange+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "');  instance.changeMainImage({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); instance.changeViewLargeLink({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); instance.highlightAltView('#MultiProductDetail-altview" + this.configObjArea["objProductUniqueId"] + "',this); return false;\" title=\""+mappingData.imgTitle+"\""+imgTagSuffix+"<img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\"></a></div>";
			
			} else if (mappingData.isLastImage == "") {
				imgTag = "<div class=\"isLast\"><a href=\""+mappingData.imgChange+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.changeMainImage({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); instance.changeViewLargeLink({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); instance.highlightAltView('#MultiProductDetail-altview" + this.configObjArea["objProductUniqueId"] + "',this); return false;\" title=\""+mappingData.imgTitle+"\""+imgTagSuffix+"<img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\"></a></div>";
			
			} else if ((mappingData.countData%2) == 0) {
				imgTag = "<div class=\"isOdd\"><a href=\""+mappingData.imgChange+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.changeMainImage({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); instance.changeViewLargeLink({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); instance.highlightAltView('#MultiProductDetail-altview" + this.configObjArea["objProductUniqueId"] + "',this); return false;\" title=\""+mappingData.imgTitle+"\""+imgTagSuffix+"<img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\"></a></div>";			
			
			} else {
				imgTag = "<div class=\"isEven\"><a href=\""+mappingData.imgChange+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.changeMainImage({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); instance.changeViewLargeLink({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); instance.highlightAltView('#MultiProductDetail-altview" + this.configObjArea["objProductUniqueId"] + "',this); return false;\" title=\""+mappingData.imgTitle+"\""+imgTagSuffix+"<img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\"></a></div>";			
			}
		}
		
		// get image tag for 'Main images'
		if (mappingData.isMainImage) {
			// if 'no image' is shown at the 1st page load when user click any places and back to the main image it should be the same result as 1st time
			if ((mappingData.imgSource == "") && (mappingData.noImage != "")) {
				mappingData.imgSource = mappingData.noImage;
			}
			
			if (this.configImageware["enableImageware"] != "") {
				//use imageware
				if (this.allImages[mappingData.attValue].clicked[mappingData.currentImage] == true) {
					
					imgTag = this.configImageware["zoomableImagelink"]+"<img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\"></a>";
				
				} else {
					
					imgTag =  this.configImageware["zoomableImagelink"]+this.configDefault["loadingImage"]+"<img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\" style=\"display:none\" onload=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.showMainImage.setImg(this); instance.showMainImage.doIt(instance.showMainImage);\"></a>";				
				}
			} else {
				//does not use imageware - find out more about image ware - is this lightbox plugin??
				if (mappingData.imgPopup != "") {
						imgTag = this.configDefault["loadingImage"]+"<a id=\"tehee\"  href=\""+mappingData.imgPopup+"\"  class=\"jqzoomevo mainImage\" onclick=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.doPopup('"+mappingData.attValue+"',this.href, "+mappingData.currentImage+"); return false;\" title=\""+mappingData.imgTitle+"\"><img id=\"mainImageView" + this.configObjArea["objProductUniqueId"] + "\" class=\"mainImage\" src=\""+mappingData.imgSource+"\" style=\"display:none\" onload=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.showMainImage.setImg(this); instance.showMainImage.doIt(instance.showMainImage);\"></a>";
				} else {
					if (this.allImages[mappingData.attValue].clicked[mappingData.currentImage] == true) {
						imgTag = "<img src=\""+mappingData.imgSource+"\" alt=\""+this.configDefault["largeNotAvailAltText"]+"\">";
					} else {
						imgTag = this.configDefault["loadingImage"]+"<img src=\""+mappingData.imgSource+"\" alt=\""+this.configDefault["largeNotAvailAltText"]+"\" style=\"display:none\" onload=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.showMainImage.setImg(this); instance.showMainImage.doIt(instance.showMainImage);\">";				
					}
				}
			}
		}
	
		return imgTag;
	};
	
	this.displaySwatch = function() {	
		var allSwatch = "";
	
		for (var eachData in this.allImages) {		
			if (this.isClickable(this.allImages[eachData].settsideview) && eachData != "" && this.allImages[eachData].setswatch != "") {
				allSwatch = allSwatch + "<a href=\"#\" onclick=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.changeSet('"+eachData+"'); return false;\" title=\""+this.config["swatchTitle"]+" - "+eachData+"\"><img src=\""+this.allImages[eachData].setswatch+"\" alt=\" "+eachData+"\"></a>";
				
			} else if(eachData!="" && this.allImages[eachData].setswatch) {
				allSwatch = allSwatch + "<img src=\""+this.allImages[eachData].setswatch+"\">";		
			}
		}
		
		this.config["objSwatchArea"].innerHTML = allSwatch;
	};
	
	/**
	* Sets the image HTML tag and update main image
	* @param {object} mappingData - properties collection of each image
	* 
	*/
	this.changeMainImage = function(mappingData) {
		var attValue = mappingData.attValue;
		var currentImage = mappingData.no;
		var imgSource = this.allImages[attValue].setmalt[currentImage];
		var imgPopup = this.allImages[attValue].setlalt[currentImage];
		
		var mainImage = this.getImageTag({
											noImage: this.configDefault["noImage"]["medium"],
											imgSource: imgSource,
											imgPopup: imgPopup,
											attValue: attValue,
											imgAlt: this.configDefault["mediumAltText"],
											imgTitle: this.configDefault["mediumTitleText"],
											currentImage: currentImage,
											isMainImage: true
										});
		this.configObjArea["objMediumArea"].innerHTML = mainImage;
		this.allImages[attValue].clicked[mappingData.no] = true;
		if (this.configImageware["enableImageware"] != "") {YAHOO.util.Event.addListener(["zoom_img2"  + this.configObjArea["objProductUniqueId"] ],"click", Venda.Widget.Lightbox.showImageware);}
	};
	
	/**
	* Sets the image HTML tag to view large link
	* @param {object} mappingData - properties collection of each image
	*/
	this.changeViewLargeLink = function(mappingData) {
		var viewLarge = "";
		var attValue = mappingData.attValue;
		var currentImage = mappingData.no || 0;
		var imgPopup = this.allImages[attValue].setlalt[mappingData.no];
	
		if (this.configImageware["enableImageware"] != "") {
		 	// use imageware to see large image
		 	viewLarge = this.configImageware["zoomableTextlink"]+this.configImageware["zoomableText"]+"</a>";
		} else {
		 	// does not use imageware to see large image
			if (imgPopup != "") {
			 	viewLarge = "<a href=\""+imgPopup+"\" onclick=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.doPopup('"+attValue+"',this.href, "+currentImage+"); return false;\" title=\""+this.configDefault["viewLargeTitle"]+"\">"+this.configDefault["viewLargeText"]+"</a>";
		 	} else {
				viewLarge = "&nbsp;";
			}
		}
		
		this.configObjArea["objLinkArea"].innerHTML = "<div class=\"viewlarge\">"+viewLarge+"</div>";
		if (this.configImageware["enableImageware"] != "") {YAHOO.util.Event.addListener(["zoom_link2" + this.configObjArea["objProductUniqueId"] ],"click", Venda.Widget.Lightbox.showImageware);}
	};
	
	/**
	* Generate entire images inside alternative view area
	* @param {string} attValue - attribute 1 (color) value
	* 
	*/
	this.changeAlternateViewSet = function(mappingData) {
		var attValue = mappingData.attValue;
		var currentImage = mappingData.no || 0;
		var altviewData = "";
		var isLastImage = "";
		var iNum = 0;
		
		//product name - attribute value (if it does) - Additional view [no.]  is used to define a short description of the image in 'alt' and 'title' attribute
		var imgAlt = (attValue) ? this.configDefault["productName"] + " - " + attValue + " - " + this.configAlternateView["alternateViewAltText"] : this.configDefault["productName"] + " - " + this.configAlternateView["alternateViewAltText"];
	
		for (var i = 0; i < this.allImages[attValue].setmalt.length; i++) {
			if (this.allImages[attValue].setxsalt[i] != "" && this.allImages[attValue].setmalt[i] != "") {
				altviewData = altviewData + this.getImageTag({
																currentImage: i,
																imgSource: this.allImages[attValue].setxsalt[i],
																imgChange: this.allImages[attValue].setmalt[i],
																isLastImage: this.allImages[attValue].setxsalt[i+1],
																attValue: attValue,
																imgAlt: imgAlt,
																imgTitle: imgAlt,
																countData: iNum, // To find a real number of data that available to view (must have both 'xsalt' and 'malt' image key)
																isAltImage: true
															});
					iNum++;
			} 
		}
		
		if (iNum != 0) {
			altviewData = "<p class=\"altviewHeader\">"+this.configAlternateView["alternateViewHeaderText"]+"</p>" + altviewData;
		} 
		if (iNum == 1) {
			// add class if there is only 1 alternate image.
			this.configObjArea["objAlternateViewArea"].className = "isOne";
		}
		
		this.configObjArea["objAlternateViewArea"].innerHTML = altviewData;
	};
	
	/**
	* Hightlight current image to make user know which one is viewing
	* @param {object} objLink - An element id (or object) representing the list of items in the alternative images
	* @param {string} parentId - An element id to specific alternative images area
	*/
	this.highlightAltView = function (parentId,objLink) {
		jQuery(parentId).find("a").removeClass("selected");
		jQuery(objLink).addClass("selected");
	};
	
	/**
	* Change attribute 1 association (colour attribute) dropdown
	* @param {string} attValue - attribute 1 (color) value
	
	MultiProductDetailClass.changeDropdown = function(attValue) {
		for (var i = 0; i < this.configObjArea["objDropdown"].options.length; i++) {
			if (this.configObjArea["objDropdown"].options[i].value == attValue) {
				this.configObjArea["objDropdown"].selectedIndex = i;
			}
		}
		this.configObjArea["objProduct"].changeAttributes(this.configObjArea["objDropdown"]);
	};*/
	
	/**
	* Generate group of alternate views
	* @param {string} attValue - attribute 1 (color) value
	* @param {interger} number - A number of current image by ordering
	* @returns {string} alternateView - HTMLCollection of Alternative view images
	*/
	this.createPopupPage = function(attValue,number) {
		var newDataLarge = new Array();
		var	newDataXSmall = new Array();
		var countData = 0;
		var alternateView = "";	// define entire images as pagination style
		// product name - attribute value (if it does) - Additional view [no.]  is used to define a short description of the image in 'alt' attribute
		var imgAlt = (attValue) ? this.configDefault["productName"] + " - " + attValue + " - " + this.configAlternateView["alternateViewAltText"] : this.configDefault["productName"] + " - " + this.configAlternateView["alternateViewAltText"];
	
		if (this.configAlternateView["alternateViewPagedStyle"] != "") {
			for (var i = 0; i < this.allImages[attValue].setxsalt.length; i++) {
				if (this.allImages[attValue].setxsalt[i] != "" && this.allImages[attValue].setlalt[i] != "") {
					if (countData <=5 ) { // Note: a condition will be removed in the future
					if (this.configAlternateView["alternateViewPagedStyle"] == "image") {
						// Start image list
						if (i == number) {
							alternateView = alternateView + "<a href=\""+this.allImages[attValue].setlalt[i]+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.changePopup(this); instance.highlightAltView('#alternateViewList" + this.configObjArea["objProductUniqueId"] + "',this); return false;\" class=\"selected\" title=\""+imgAlt+"\""; 								
						} else {
							alternateView = alternateView + "<a href=\""+this.allImages[attValue].setlalt[i]+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.changePopup(this); instance.highlightAltView('#alternateViewList" + this.configObjArea["objProductUniqueId"] + "',this); return false;\" title=\""+imgAlt+"\"";	
						}
						if (this.configAlternateView["alternateViewBehavior"] == "onmouseover") {alternateView = alternateView + " onclick=\"return false;\"><img src=\""+this.allImages[attValue].setxsalt[i]+"\" alt=\""+imgAlt+"\"></a>";} else {alternateView = alternateView + "><img src=\""+this.allImages[attValue].setxsalt[i]+"\" alt=\""+imgAlt+"\"></a>";}
						// End image list
					} else {
						// Start number list
						if (i == number) {
							alternateView = alternateView + "<a href=\""+this.allImages[attValue].setlalt[i]+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.changePopup(this); instance.highlightAltView('#alternateViewList" + this.configObjArea["objProductUniqueId"] + "',this); return false;\" class=\"selected\" title=\""+imgAlt+"\"";
						} else {
							alternateView = alternateView + "<a href=\""+this.allImages[attValue].setlalt[i]+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.changePopup(this); instance.highlightAltView('#alternateViewList" + this.configObjArea["objProductUniqueId"] + "',this); return false;\" title=\""+imgAlt+"\"";
						}
						if (this.configAlternateView["alternateViewBehavior"] == "onmouseover") { alternateView = alternateView + " onclick=\"return false;\"><span>"+((i+1))+"</span></a>"; } else { alternateView = alternateView + "><span>"+(i+1)+"</span></a>";}
						// End number list
					}
					countData++;
					}
				}
			}
		}
		
		if (countData != 0 && countData != 1) {
			alternateView = "<div class=\"popupMainImageAltView\" id=\"alternateViewList"  + this.configObjArea["objProductUniqueId"] + "\"><div class=\"alternateHeader\"><p class=\"altviewHeader\">"+this.configAlternateView["alternateViewHeaderText"]+"</p><p class=\"download\">"+this.configDefault["downloadText"]+"</p></div>"+alternateView+"</div>";
		}
		if (countData == 1) {
			// add class if there is only 1 alternate image.
			alternateView = "<div class=\"popupMainImageAltView\" id=\"alternateViewList"  + this.configObjArea["objProductUniqueId"] + "\" class=\"isOne\"><div class=\"alternateHeader\"><p class=\"altviewHeader\">"+this.configAlternateView["alternateViewHeaderText"]+"</p><p class=\"download\">"+this.configDefault["downloadText"]+"</p></div>"+alternateView+"</div>";
		}
		if (countData == 0) {
			// when alternative has not been selected yet.
			alternateView = "<div class=\"popupMainImageAltView\" id=\"alternateViewList"  + this.configObjArea["objProductUniqueId"] + "\"><div class=\"alternateHeader\"><p class=\"download\">"+this.configDefault["downloadText"]+"</p></div>"+alternateView+"</div>";
		}
		return alternateView;
	};
	
	/**
	* Represent the lightbox for large image also displays the available xsmall thumbs to choose. 
	* @param {string} attValue - attribute 1 (color) value
	* @param {string} sLink - URLs to the current Large key size image of selected alt-img
	* @param {interger} number - A number of current image by ordering
	*/
	this.doPopup = function(attValue,sLink,number) {
		var alternateView = this.createPopupPage(attValue,number);
		
		// Main image in 'popupContents' area
		var mainImage = "<div class=\"popupMainImage\" id=\"mainImage"  + this.configObjArea["objProductUniqueId"] + "\"><a onclick=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.enlargePanel.hide(); return false;\" href=\"#\" title=\""+this.configPopupPanel["closePanelTitle"]+"\"><img src=\""+sLink+"\" id=\"enlargedpopup"  + this.configObjArea["objProductUniqueId"] + "\" name=\"enlargedpopup\" onload=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.setWidthPanel(instance.enlargePanel, this); instance.loadingPanel.hide(); instance.enlargePanel.show();\"></a></div>";
		var strCloseText = "<div id=\"closeWindow"  + this.configObjArea["objProductUniqueId"] + "\"><a href=\"#\" onclick=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId('" + this.configObjArea["objProductUniqueId"] + "'); instance.enlargePanel.hide(); return false;\">"+this.configPopupPanel["closeTextLink"]+"</a></div>";
		this.loadingPanel.setHeader("<div class=\"tl\"></div><span>"+this.configPopupPanel.loadingHeader+"</span><div class=\"tr\"></div>");
		this.loadingPanel.setBody("<img src=\""+this.configPopupPanel.loadingPanel+"\"/>");
		this.loadingPanel.render(document.body);
		this.loadingPanel.show();
		this.loadingPanel.doCenterOnDOMEvent();
		
		this.enlargePanel.setHeader("<div class=\"tl\"></div><span>"+this.configPopupPanel.popupHeader+"</span><div class=\"tr\"></div>");
		this.enlargePanel.setBody( "<div class=\"popupContents popupProductSet\">"+mainImage + alternateView + strCloseText+"</div>");
		this.enlargePanel.render(document.body);
		jQuery("#alternateViewList" + this.configObjArea["objProductUniqueId"] + " img").hide();
		jQuery("#alternateViewList" + this.configObjArea["objProductUniqueId"] + " img").isValidImg();
		
	
		
	};
	
	/**
	* Change
	* @param {string} objLink - URLs to the current Large key size image of selected alt-img
	*/
	this.changePopup = function(objLink) {
		jQuery("#enlargedpopup" + this.configObjArea["objProductUniqueId"]).attr({src:objLink.href});
	};
	
	/**
	* Set panel dimension
	* @param {object} panel - 
	* @param {object} objImage - 
	*/
	this.setWidthPanel = function (panel,objImage) {
		document.getElementById("tag-invtname" + this.configObjArea["objProductUniqueId"]).style.display = "inline";
		if (this.panelWidth=null) {
			var widthValue = (objImage.width > (document.getElementById("tag-invtname" + this.configObjArea["objProductUniqueId"]).offsetWidth + 100)) ? objImage.width + 20: document.getElementById("tag-invtname" + this.configObjArea["objProductUniqueId"]).offsetWidth + 130;
		} else {
			var widthValue = this.panelWidth;
		}
		panel.cfg.setProperty("width", widthValue + "px");
		document.getElementById("tag-invtname" + this.configObjArea["objProductUniqueId"]).style.display = "none";
	};
	
	
	
	
	this.doXPosition = function(){
		
		
		var xPosition = (document.documentElement.clientWidth - 511) / 2; 
		var yPosition = jQuery("#image"+this.configObjArea["objProductUniqueId"]).offset();		

		this.loadingPanel = new YAHOO.widget.Panel("loading_panel",  
															{ 
																width:"511px", 
																fixedcenter:true, 
																close:true, 
																draggable:false,
																zindex:3,
																modal:true,
																visible:false,
																x:xPosition,
																y:10
															}
														);
														
		this.loadingPanel.showMaskEvent.unsubscribe();
	    this.loadingPanel.hideMaskEvent.unsubscribe();	
	    
	    
	    this.enlargePanel = new YAHOO.widget.Panel("enlarge_panel",  
															{ 
																fade: 0.24,			
																fixedcenter:false,
																draggable: false,
																zindex:4,
																modal:true,
																visible:false,
																x:xPosition,
																y:yPosition.top
															}
														);
							
		var self = this;					
														
		this.enlargePanel.showMaskEvent.subscribe(function(e){ self.loaded(); },this);												
		this.enlargePanel.hideMaskEvent.unsubscribe();										
		
	};
	
	
	this.loaded = function(e) {
		
		 //get the main image top value
		 var offset = jQuery("#productdetail"+this.configObjArea["objProductUniqueId"]).offset();
		 var panelwidth = jQuery("#enlarge_panel_c").width();
		 var docwidth = jQuery(document).width()
		 var width = (docwidth/2) - (panelwidth/2);
			
		//make the pop-up contaioner the same level as the product detail
		var contTop = jQuery("#comp-name"+this.configObjArea["objProductUniqueId"]).offset().top;
		jQuery('#enlarge_panel_c').css('top',contTop+"px");
		
		 
	};
	
	
	this.preloadImage = function(imgSource) {
		if (imgSource != "") {
			new Image().src = imgSource;
		}
	};
	
	this.preloadAllImage = function() {
		for (var eachAttrValue in this.allImages) {
			var allImageData = this.allImages[eachAttrValue];
			
			this.preloadImage(allImageData.setswatch);
			for (var eachImage in allImageData.setxsalt) {
				this.preloadImage(allImageData.setmalt[eachImage]);			
			}
			for (var eachImage in allImageData.setmalt) {
				this.preloadImage(allImageData.setmalt[eachImage]);			
			}
			for (var eachImage in allImageData.setlalt) {
				this.preloadImage(allImageData.setlalt[eachImage]);	
			}
		}
	};
	
	/**
	* To select the first colour attribute
	*/
	this.selectFirstAtt = function () {
		var attValue = jQuery("ul.attribute_att1_"+this.configObjArea["objProductUniqueId"]+" li a:first").attr("title");
		var swId = jQuery("ul.attribute_att1_"+this.configObjArea["objProductUniqueId"]+" li a:first").addClass("selected");
		/*the first att. colour must be selected */
		this.attributeSwatchInstance.actionSet('att1',attValue);
		this.changeSet(attValue);
	};
	
	this.getScrollTop = function(){
		
	    if(typeof pageYOffset!= 'undefined'){
	        //most browsers
	        return pageYOffset;
	    }
	    else{
	        var B= document.body; //IE 'quirks'
	        var D= document.documentElement; //IE with doctype
	        D= (D.clientHeight)? D: B;
	        return D.scrollTop;
	    }

	};
	
	/*
	 * Check if the product attribute 1 and 2 have been selected and ready to add to cart
	 */
	this.productAttributesFiltersAreSelected = function(){
				
		if((this.attributeSwatchInstance.filters["att1"]!="") && (this.attributeSwatchInstance.filters["att2"]!="") && (this.attributeSwatchInstance.filters["att1"]!=undefined) && (this.attributeSwatchInstance.filters["att2"]!=undefined)){
			return true;	
		}else{
			return false;
		}
		
	}
	
	/*
	 * Animates the alert message for swatch
	 */
	this.animateProductSwatchAlertMessage = function(){

		var animOut = new YAHOO.util.Anim("alertmessage" + this.configObjArea["objProductUniqueId"], { opacity: { from: 1, to:0 }}, 1, YAHOO.util.Easing.easeOut); 
		var animIn = new YAHOO.util.Anim("alertmessage" + this.configObjArea["objProductUniqueId"], { opacity: { from: 0, to:1 }}, 1, YAHOO.util.Easing.easeOut); 
		animOut.onComplete.subscribe(function() {animIn.animate();});	
		animOut.animate();
		 
	};
	
	/**
	  * Overide the event for the add to cart button
	  * 
	  * @type function
	  * @author John Norris 
	  */
	
	this.overideMinicartPopupAddProductEvent = function(){
		
		//get the add to cart input for this object, clear it and add a new onclick
		var thisProdObject = this, addtoCartInput = document.getElementById("addproduct" + this.configObjArea["objProductUniqueId"] );
		
		YAHOO.util.Event.removeListener ( addtoCartInput , "click" );
		YAHOO.util.Event.addListener( addtoCartInput, "click", this.MinicartPopupAddProduct, {}, thisProdObject );
		
	};
	
	
	 
	 /**
	  * Check if the selected input qty value is greater than items available 
	  * on hand</br>
	  * 
	  * @type object
	  * @param {string} att1
	  * @param {string} att2
	  * @author John Norris 
	  */
	
	this.checkQuantityOnHand = function(att1,att2){
		
		var attCol = att1+att2;
		var userQuantity = dodument.getElementById("qty7531602000912").value; 
		
		if( this.productInstance.attributeValues[attCol].data["atronhand"] <= userQuantity ){
			
			return true;
			
		}else{
			
			return false;
		}   
	
	};
	
	
	/**
	  * Overide function for the minicart add to cart functionality
	  * 
	  * @type function
	  * @param event
	  * @author John Norris 
	  */
	
	this.MinicartPopupAddProduct = function(e){
					
		if(Venda.Widget.MinicartPopup != "undefined"){
		
		
		
				YAHOO.util.Event.stopEvent(e); // suppress form submit
		
		
		
		
				
				var productAttObj, productObj, invtId;
		
		
		
				
				invtId = this.configObjArea["objProductUniqueId"];
		
				
				//check if the selected product..
				if( !this.productAttributesFiltersAreSelected() ){
					this.animateProductSwatchAlertMessage();
					return false;
				}
				
				//check if the quiantity
				
		
				
				
				// animation variables to send to UpdateMinicart.js
				// if this variable is blank, then no colour animation will occur
				if (Venda.Widget.MinicartPopup.tags.fromcolor != "" && Venda.Widget.MinicartPopup.tags.frombgrcolor == ""){
					var minicartColors = {
				        color: { from: Venda.Widget.MinicartPopup.tags.fromcolor, to: Venda.Widget.MinicartPopup.tags.tocolor }
				    };
				}else if (Venda.Widget.MinicartPopup.tags.fromcolor == "" && Venda.Widget.MinicartPopup.tags.frombgrcolor != ""){
					var minicartColors = {
				        backgroundColor: { from: Venda.Widget.MinicartPopup.tags.frombgrcolor, to: Venda.Widget.MinicartPopup.tags.tobgrcolor }
				    };
				}else if (Venda.Widget.MinicartPopup.tags.fromcolor != "" && Venda.Widget.MinicartPopup.tags.frombgrcolor != ""){
					var minicartColors = {
				        color: { from: Venda.Widget.MinicartPopup.tags.fromcolor, to: Venda.Widget.MinicartPopup.tags.tocolor },
						backgroundColor: { from: Venda.Widget.MinicartPopup.tags.frombgrcolor, to: Venda.Widget.MinicartPopup.tags.tobgrcolor }
				    };
				}else {var minicartColors = "";}
				
				highlightItems = new YAHOO.util.ColorAnim('updateItems', minicartColors, Venda.Widget.MinicartPopup.tags.fromtoduration);
				highlightTotal = new YAHOO.util.ColorAnim('updateTotal', minicartColors, Venda.Widget.MinicartPopup.tags.fromtoduration);
				
				// find out which form ID was submitted
				if (this.id="qty"+invtId) { this.id = "addproduct"+invtId;}
				clickedID = this.id
				formID = 'addproductform'+invtId;
				
				// find original source so you can restore it, make this variable global so UpdateMinicart.js can use it
				var buttonID = document.getElementById(clickedID);
				originalsrc = buttonID.src;
				buttonID.src='/content/ebiz/'+ Venda.Widget.MinicartPopup.tags.bsref +'/resources/images/'+ Venda.Widget.MinicartPopup.tags.seslang +'/bt_pleasewait.gif'; // change the add to basket image so the user knows something is happening
				
				// change layout field so that the response loaded in the div shows the relevant message
				document.getElementById(formID).layout.value = 'cartresponse';
				if(typeof document.getElementById(formID).curlayout != 'undefined'){
					// if there is a curlayout field change the value to cartresponse
					document.getElementById(formID).curlayout.value = 'cartresponse';
				};
				Venda.Widget.MinicartPopup.panelHeight = document.getElementById('popupcart_panel').offsetHeight; // original height of popup before cart updated
			
				Venda.Ebiz.ajaxFunction(Venda.Widget.MinicartPopup.tags.formaction,'addedmsg',formID, function() {
					//leave this as an inserted script as it relies on loaded IDs from invt/addtocart_response
					insertScript('/venda-support/js/Venda/Widget/UpdateMinicart.js',formID);
					// now update and open the minicart, in that order
					
					//scroll to the top of the page
					jQuery('html,body').animate({scrollTop: jQuery("#wrapper").offset().top}, 1000);
					
					
					ajaxFunction('/page/home&layout=minicart_detail','popupcart', undefined, function() { //we update cartwrapper so that static minicart detail will update
						
							
							
							
							if (Venda.Widget.MinicartPopup.windowsettings.milliseconds != ""){
							// reset the timer if automatic close is enabled
							clearTimeout(popupTimerId);
						};
						Venda.Widget.MinicartPopup.openAnim();
						Venda.Widget.MinicartPopup.highlightAdded();
						// reset form fields that were set by JS
						document.getElementById(formID).layout.value = '';
						document.getElementById(formID).ex.value = 'co_wizr-shopcart';
						if (typeof Venda.Widget.CurrencyConverter != "undefined" || Venda.Widget.CurrencyConverter) {
							Venda.Widget.CurrencyConverter.GetCookie();
						};
						
						
						
						
						
						
					});
				});
		
		
		}
		
	};

};
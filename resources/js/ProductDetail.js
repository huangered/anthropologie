/**
* @fileoverview ProductDetail.js: A module used for client specific functionality
*
* This module defines a single symbol named "Venda.ebiz"
* all ebiz utility functions are stored as properties of this namespace
* functions that are spacific this site shoudl be added to this file only.
*/

//declare namespace for ebiz
Venda.namespace("ProductDetail");

/**
 * Stub function is used to support JSDoc.
 * @class Venda.
 * @constructor
 */
 
/**
*  Alternate Views
*/
Venda.ProductDetail.allImages = [];

Venda.ProductDetail.configObjArea = {
	objDropdown: null,
	objDefaultImage: null,
	objProduct: null,
	objMediumArea: null,
	objLinkArea: null,
	objAlternateViewArea: null
};

Venda.ProductDetail.configDefault = {
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

Venda.ProductDetail.configImageware = {
	enableImageware: "",
	zoomableText: "",
	zoomableImagelink: "",
	zoomableTextlink: ""
};

Venda.ProductDetail.configAlternateView = {
	alternateViewPagedStyle: "",
	alternateViewBehavior: "",
	alternateViewAltText: "",
	alternateViewTitleText: "",
	alternateViewHeaderText: ""
};

Venda.ProductDetail.configPopupPanel = {
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
Venda.ProductDetail.init = function(configType,settings) {
	for (var eachProp in settings) {
		this[configType][eachProp] = settings[eachProp];
	}
};

Venda.ProductDetail.loadImage = function(attValue,imgSources) {
	this.allImages[attValue] = imgSources;
};
/**
* Change
* @param {string} attValue - attribute 1 (color) value
*/
Venda.ProductDetail.changeSet = function(attValue) {
	this.changeAlternateViewSet({attValue:attValue,no:0});
	this.checkValidImage(attValue);
};

Venda.ProductDetail.checkValidImage = function(attValue) {
	var largeDiv = "#"+jQuery(this.configObjArea["objLinkArea"]).attr("id");
	var mediumDiv = "#"+jQuery(this.configObjArea["objMediumArea"]).attr("id");
	var altDiv = "#"+jQuery(this.configObjArea["objAlternateViewArea"]).attr("id");
	var self = this;
	
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
		self.changeMainImage({attValue:attValue,no:current});
		self.changeViewLargeLink({attValue:attValue,no:current});
		
		// preselect the 1st alternate image by default
		jQuery(altDiv+" a").eq(current).addClass("selected");
		
		// replace main image with 'spacer.gif' if alternate image is empty
		if (jQuery(altDiv).find("img.validImg").length == 0) {	
			jQuery(mediumDiv+" .jqzoom").remove();
			jQuery(mediumDiv+" #loadingMain").after("<img src=\""+self.configDefault['noImage']['medium']+"\" style=\"display:none\" onload=\"Venda.ProductDetail.showMainImage.setImg(this); Venda.ProductDetail.showMainImage.doIt();\">");
			jQuery(largeDiv).hide();
		} else {
			jQuery(largeDiv).show();
		}
	}});
};

/**
 * Active jQzoom
**/
Venda.ProductDetail.activejQzoom = function (){
	var options = {
		zoomWidth: 370,
		zoomHeight: 435,
		xOffset: 52,
		yOffset: 0,
		position: "right",
		title: false
	};
	jQuery('.jqzoom').jqzoom(options);
};


/**
* Puts loading image during the time that main image is loaded to show
* @param {object} imgObj - 
* @returns {function} imgTag - HTMLCollection of an image tag
*/
Venda.ProductDetail.showMainImage = {
	imgObj: null,
	doIt: function() {
		setTimeout("Venda.ProductDetail.showMainImage.hideLoading()", 500);
	},
	hideLoading: function() {
		if (document.getElementById("loadingMain")) {
			document.getElementById("loadingMain").style.display = "none";
		}	
		Venda.ProductDetail.showMainImage.imgObj.style.display = "block";
		Venda.ProductDetail.activejQzoom();
	},
	setImg: function(imgObj) {
		this.imgObj = imgObj;
	}
};

/**
* Get the attribute 
* @param {object} objArray - 
* @param {object} value - 
* @returns {object}  - 
*/
Venda.ProductDetail.findExistingElement = function(objArray,value) {
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
Venda.ProductDetail.getImageTag = function(mappingData) {
	var imgTag = "";
	var imgTagSuffix = "";
	
	// get image tag for 'Alternative images'
	if (mappingData.isAltImage && mappingData.imgChange) {
		if (this.configAlternateView["alternateViewBehavior"] == "onmouseover") { imgTagSuffix = " onclick=\"return false;\">"; } else { imgTagSuffix = ">";}
	
		// define classname for each image
		if (mappingData.countData == 0) {
			imgTag = "<div class=\"isFirst\"><a href=\""+mappingData.imgChange+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"Venda.ProductDetail.changeMainImage({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); Venda.ProductDetail.changeViewLargeLink({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); Venda.ProductDetail.highlightAltView('#productdetail-altview',this); return false;\" title=\""+mappingData.imgTitle+"\""+imgTagSuffix+"<img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\"></a></div>";
		
		} else if (mappingData.isLastImage == "") {
			imgTag = "<div class=\"isLast\"><a href=\""+mappingData.imgChange+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"Venda.ProductDetail.changeMainImage({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); Venda.ProductDetail.changeViewLargeLink({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); Venda.ProductDetail.highlightAltView('#productdetail-altview',this); return false;\" title=\""+mappingData.imgTitle+"\""+imgTagSuffix+"<img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\"></a></div>";
		
		} else if ((mappingData.countData%2) == 0) {
			imgTag = "<div class=\"isOdd\"><a href=\""+mappingData.imgChange+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"Venda.ProductDetail.changeMainImage({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); Venda.ProductDetail.changeViewLargeLink({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); Venda.ProductDetail.highlightAltView('#productdetail-altview',this); return false;\" title=\""+mappingData.imgTitle+"\""+imgTagSuffix+"<img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\"></a></div>";			
		
		} else {
			imgTag = "<div class=\"isEven\"><a href=\""+mappingData.imgChange+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"Venda.ProductDetail.changeMainImage({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); Venda.ProductDetail.changeViewLargeLink({attValue: '"+mappingData.attValue+"', no: "+mappingData.currentImage+"}); Venda.ProductDetail.highlightAltView('#productdetail-altview',this); return false;\" title=\""+mappingData.imgTitle+"\""+imgTagSuffix+"<img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\"></a></div>";			
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
				imgTag =  this.configImageware["zoomableImagelink"]+this.configDefault["loadingImage"]+"<img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\" style=\"display:none\" onload=\"Venda.ProductDetail.showMainImage.setImg(this); Venda.ProductDetail.showMainImage.doIt();\"></a>";				
			}
		} else {
			//does not use imageware
			if (mappingData.imgPopup != "") {
					imgTag = this.configDefault["loadingImage"]+"<a href=\""+mappingData.imgPopup+"\"  class=\"jqzoom\" onclick=\"Venda.ProductDetail.doPopup('"+mappingData.attValue+"',this.href, "+mappingData.currentImage+"); return false;\" title=\""+mappingData.imgTitle+"\"><img src=\""+mappingData.imgSource+"\" style=\"display:none\" onload=\"Venda.ProductDetail.showMainImage.setImg(this); Venda.ProductDetail.showMainImage.doIt();\"></a>";
			} else {
				if (this.allImages[mappingData.attValue].clicked[mappingData.currentImage] == true) {
					imgTag = "<img src=\""+mappingData.imgSource+"\" alt=\""+this.configDefault["largeNotAvailAltText"]+"\">";
				} else {
					imgTag = this.configDefault["loadingImage"]+"<img src=\""+mappingData.imgSource+"\" alt=\""+this.configDefault["largeNotAvailAltText"]+"\" style=\"display:none\" onload=\"Venda.ProductDetail.showMainImage.setImg(this); Venda.ProductDetail.showMainImage.doIt();\">";				
				}
			}
		}
	}

	return imgTag;
};

Venda.ProductDetail.displaySwatch = function() {	
	var allSwatch = "";

	for (var eachData in this.allImages) {		
		if (this.isClickable(this.allImages[eachData].settsideview) && eachData != "" && this.allImages[eachData].setswatch != "") {
			allSwatch = allSwatch + "<a href=\"#\" onclick=\"Venda.ProductDetail.changeSet('"+eachData+"'); return false;\" title=\""+this.config["swatchTitle"]+" - "+eachData+"\"><img src=\""+this.allImages[eachData].setswatch+"\" alt=\" "+eachData+"\"></a>";
			
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
Venda.ProductDetail.changeMainImage = function(mappingData) {
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
	if (this.configImageware["enableImageware"] != "") {YAHOO.util.Event.addListener(["zoom_img2"],"click", Venda.Widget.Lightbox.showImageware);}
};

/**
* Sets the image HTML tag to view large link
* @param {object} mappingData - properties collection of each image
*/
Venda.ProductDetail.changeViewLargeLink = function(mappingData) {
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
		 	viewLarge = "<a href=\""+imgPopup+"\" onclick=\"Venda.ProductDetail.doPopup('"+attValue+"',this.href, "+currentImage+"); return false;\" title=\""+this.configDefault["viewLargeTitle"]+"\">"+this.configDefault["viewLargeText"]+"</a>";
	 	} else {
			viewLarge = "&nbsp;";
		}
	}
	
	this.configObjArea["objLinkArea"].innerHTML = "<div class=\"viewlarge\">"+viewLarge+"</div>";
	if (this.configImageware["enableImageware"] != "") {YAHOO.util.Event.addListener(["zoom_link2"],"click", Venda.Widget.Lightbox.showImageware);}
};

/**
* Generate entire images inside alternative view area
* @param {string} attValue - attribute 1 (color) value
* 
*/
Venda.ProductDetail.changeAlternateViewSet = function(mappingData) {
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
Venda.ProductDetail.highlightAltView = function (parentId,objLink) {
	jQuery(parentId).find("a").removeClass("selected");
	jQuery(objLink).addClass("selected");
};

/**
* Change attribute 1 association (colour attribute) dropdown
* @param {string} attValue - attribute 1 (color) value

Venda.ProductDetail.changeDropdown = function(attValue) {
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
Venda.ProductDetail.createPopupPage = function(attValue,number) {
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
						alternateView = alternateView + "<a href=\""+this.allImages[attValue].setlalt[i]+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"Venda.ProductDetail.changePopup(this); Venda.ProductDetail.highlightAltView('#alternateViewList',this); return false;\" class=\"selected\" title=\""+imgAlt+"\""; 								
					} else {
						alternateView = alternateView + "<a href=\""+this.allImages[attValue].setlalt[i]+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"Venda.ProductDetail.changePopup(this); Venda.ProductDetail.highlightAltView('#alternateViewList',this); return false;\" title=\""+imgAlt+"\"";	
					}
					if (this.configAlternateView["alternateViewBehavior"] == "onmouseover") {alternateView = alternateView + " onclick=\"return false;\"><img src=\""+this.allImages[attValue].setxsalt[i]+"\" alt=\""+imgAlt+"\"></a>";} else {alternateView = alternateView + "><img src=\""+this.allImages[attValue].setxsalt[i]+"\" alt=\""+imgAlt+"\"></a>";}
					// End image list
				} else {
					// Start number list
					if (i == number) {
						alternateView = alternateView + "<a href=\""+this.allImages[attValue].setlalt[i]+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"Venda.ProductDetail.changePopup(this); Venda.ProductDetail.highlightAltView('#alternateViewList',this); return false;\" class=\"selected\" title=\""+imgAlt+"\"";
					} else {
						alternateView = alternateView + "<a href=\""+this.allImages[attValue].setlalt[i]+"\" "+this.configAlternateView["alternateViewBehavior"]+"=\"Venda.ProductDetail.changePopup(this); Venda.ProductDetail.highlightAltView('#alternateViewList',this); return false;\" title=\""+imgAlt+"\"";
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
		alternateView = "<div id=\"alternateViewList\"><div class=\"alternateHeader\"><p class=\"altviewHeader\">"+this.configAlternateView["alternateViewHeaderText"]+"</p><p class=\"download\">"+this.configDefault["downloadText"]+"</p></div>"+alternateView+"</div>";
	}
	if (countData == 1) {
		// add class if there is only 1 alternate image.
		alternateView = "<div id=\"alternateViewList\" class=\"isOne\"><div class=\"alternateHeader\"><p class=\"altviewHeader\">"+this.configAlternateView["alternateViewHeaderText"]+"</p><p class=\"download\">"+this.configDefault["downloadText"]+"</p></div>"+alternateView+"</div>";
	}
	if (countData == 0) {
		// when alternative has not been selected yet.
		alternateView = "<div id=\"alternateViewList\"><div class=\"alternateHeader\"><p class=\"download\">"+this.configDefault["downloadText"]+"</p></div>"+alternateView+"</div>";
	}
	return alternateView;
};

/**
* Represent the lightbox for large image also displays the available xsmall thumbs to choose. 
* @param {string} attValue - attribute 1 (color) value
* @param {string} sLink - URLs to the current Large key size image of selected alt-img
* @param {interger} number - A number of current image by ordering
*/
Venda.ProductDetail.doPopup = function(attValue,sLink,number) {
	var alternateView = this.createPopupPage(attValue,number);
	
	// Main image in 'popupContents' area
	var mainImage = "<div id=\"mainImage\"><a onclick=\"Venda.ProductDetail.enlargePanel.hide(); return false;\" href=\"#\" title=\""+this.configPopupPanel["closePanelTitle"]+"\"><img src=\""+sLink+"\" id=\"enlargedpopup\" name=\"enlargedpopup\" onload=\"Venda.ProductDetail.setWidthPanel(Venda.ProductDetail.enlargePanel, this); Venda.ProductDetail.loadingPanel.hide(); Venda.ProductDetail.enlargePanel.show();\"></a></div>";
	var strCloseText = "<div id=\"closeWindow\"><a href=\"#\" onclick=\"Venda.ProductDetail.enlargePanel.hide(); return false;\">"+this.configPopupPanel["closeTextLink"]+"</a></div>";
	Venda.ProductDetail.loadingPanel.setHeader("<div class=\"tl\"></div><span>"+Venda.ProductDetail.configPopupPanel.loadingHeader+"</span><div class=\"tr\"></div>");
	Venda.ProductDetail.loadingPanel.setBody("<img src=\""+Venda.ProductDetail.configPopupPanel.loadingPanel+"\"/>");
	Venda.ProductDetail.loadingPanel.render(document.body);
	Venda.ProductDetail.loadingPanel.show();
	Venda.ProductDetail.loadingPanel.doCenterOnDOMEvent();
	
	Venda.ProductDetail.enlargePanel.setHeader("<div class=\"tl\"></div><span>"+Venda.ProductDetail.configPopupPanel.popupHeader+"</span><div class=\"tr\"></div>");
	Venda.ProductDetail.enlargePanel.setBody( "<div class=\"popupContents\">"+mainImage + alternateView + strCloseText+"</div>");
	Venda.ProductDetail.enlargePanel.render(document.body);
	jQuery("#alternateViewList img").hide();
	jQuery("#alternateViewList img").isValidImg();
};

/**
* Change
* @param {string} objLink - URLs to the current Large key size image of selected alt-img
*/
Venda.ProductDetail.changePopup = function(objLink) {
	jQuery("#enlargedpopup").attr({src:objLink.href});
};

/**
* Set panel dimension
* @param {object} panel - 
* @param {object} objImage - 
*/
Venda.ProductDetail.setWidthPanel = function (panel,objImage) {
	document.getElementById("tag-invtname").style.display = "inline";
	if (this.panelWidth=null) {
		var widthValue = (objImage.width > (document.getElementById("tag-invtname").offsetWidth + 100)) ? objImage.width + 20: document.getElementById("tag-invtname").offsetWidth + 130;
	} else {
		var widthValue = this.panelWidth;
	}
	panel.cfg.setProperty("width", widthValue + "px");
	document.getElementById("tag-invtname").style.display = "none";
};

var xPosition = (document.documentElement.clientWidth - 511) / 2;
//var yPosition = document.documentElement.scrollTop;
Venda.ProductDetail.loadingPanel = new YAHOO.widget.Panel("loading_panel",  
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
Venda.ProductDetail.loadingPanel.showMaskEvent.unsubscribe();
Venda.ProductDetail.loadingPanel.hideMaskEvent.unsubscribe();

Venda.ProductDetail.enlargePanel = new YAHOO.widget.Panel("enlarge_panel",  
														{ 
															fade: 0.24,			
															fixedcenter:false,
															draggable: false,
															zindex:4,
															modal:true,
															visible:false,
															x:xPosition,
															y:10
														}
													);
Venda.ProductDetail.enlargePanel.showMaskEvent.unsubscribe();
Venda.ProductDetail.enlargePanel.hideMaskEvent.unsubscribe();

Venda.ProductDetail.preloadImage = function(imgSource) {
	if (imgSource != "") {
		new Image().src = imgSource;
	}
};

Venda.ProductDetail.preloadAllImage = function() {
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
Venda.ProductDetail.selectFirstAtt = function () {
	var attValue = jQuery("ul.attribute_att1 li a:first").attr("title");
	var swId = jQuery("ul.attribute_att1 li a:first").addClass("selected");
	/*the first att. colour must be selected */
	Venda.Ebiz.AttributeSwatch.actionSet('att1',attValue);
	this.changeSet(attValue);
};

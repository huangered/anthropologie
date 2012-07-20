/**
 * @fileoverview Venda.ColourSwatch - Display colour swatch onto product list/ search result.
 *
 * This script provides us with the ability to change a main image colour by clicking on a colour swatch below the image.
 * The information displayed in the colour swatch div. 
 *
 * @requires jQuery	/venda-support/js/external/jquery-1.2.2.js
 * @author Issawararat Chumchinda <bowc@venda.com>
 */

//create ColourSwatch namespace
Venda.namespace("ColourSwatch");

/**
 * Stub function is used to support JSDoc.
 * @class Venda.ColourSwatch
 * @constructor
 */
 
 /**
 * Sets up the object in preparation for rendering.
 *
 * @constructor
 * @class 
 * @param {Object} config - An object representing the Colour swatch's config
 *
 */
Venda.ColourSwatch = function(config){
	var conf = config || {};
	this.init(conf);
};

/**
* Assign the config values
*
*/
Venda.ColourSwatch.prototype = {
	allImages: [],
	init: function(config) {
		this.allImages = [];
		for(var eachProp in config){
			this[eachProp] = config[eachProp];
		}
	},
	
	loadImage: function(attValue,imgSources) {
		this.allImages[attValue] = imgSources;
	},
	
	/**
	* To change relevant object behaviour after colour swatch is selected
	* @param {String} attValue - attribute 1 (color) value
	* @param {String} self - attribute value
	* @param {Boolean} isFirstLoad -
	*/
	changeSet: function(attValue,self,isFirstLoad) {
		var divID = "#"+jQuery(this.configObjArea["objProductArea"]).attr("id");
		
		this.changeMainImage({attValue: attValue});
		if (!isFirstLoad) { this.updateSelected(self); }
		jQuery(divID+" img").hide();
		jQuery(divID+" img").isValidImg({displaystyle: "img"});
		
		/* comment out if you need to remove <a> around an image
		jQuery(divID+" img").isValidImg({onFinishedValidation:function() {
			if(jQuery(divID).find("img").length == 0) {
				jQuery(divID).html("<img src=\""+this.configProduct["noimage"]["defaultImage"]+"\">");
			}
		}});*/
	},
	
	/**
	* To replace slash(/) and space character
	* @param {String}	swName - an actual name of swatch colour which is the same value as you put in VCP
	* @returns {String} dispName - a name of swatch without slash(/) and space character that will be given for an id
	*/
	replaceSpecialChars: function(swName) {
		var reg = new RegExp("[/| |]", "gi");
        var dispName = swName.replace(reg, "");

		return dispName;
	},
	
	/**
	* Create an image source and return an image link
	*
	* @param {Object}	mappingData		properties collection of each image
	* @returns {String} imgTag		HTMLcollection of main image
	*/
	getImageTag: function(mappingData) {
		var imgTag = "";

		/* MAIN IMAGE */
		if(mappingData.isMain) {
			if (mappingData.imgSource != "") {
				imgTag = "<a href=\""+mappingData.imgLinkTo+"\" title=\""+mappingData.imgTitle+"\"><img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.imgAlt+"\"></a>";
			}
		}
		
		/* SWATCH COLOR IMAGES */
		if(mappingData.isSwatch) {
			var newSwName = this.replaceSpecialChars(mappingData.swName);
			if (mappingData.imgSource != "") {
				imgTag = "<a id=\"sw"+newSwName+"\" href=\"#\" onclick=\"allItems['"+this.id+"'].changeSet('"+mappingData.swName+"',this); return false;\" title=\""+mappingData.swName+"\"><img src=\""+mappingData.imgSource+"\" alt=\""+mappingData.swName+"\"></a> ";
			} else {
				imgTag = "<a id=\"sw"+newSwName+"\" class=\"sw_noimage\" href=\"#\" onclick=\"allItems['"+this.id+"'].changeSet('"+mappingData.swName+"',this); return false;\" title=\""+mappingData.swName+"\"><span>"+mappingData.swName+"</span></a> ";
			}
		}
		return imgTag;
	},

	/**
	* Sets the image HTML tag and update main image
	* @param {object} mappingData - properties collection of each image
	* 
	*/
	changeMainImage: function(mappingData) {
		var attValue = mappingData.attValue;
		if (attValue != null){
			var imgSource = this.allImages[attValue].setimage;
			var mainImage = this.getImageTag({
											imgSource: imgSource,
											attValue: attValue,
											noimage: this.configProduct["noimage"]["defaultImage"],
											imgLinkTo: this.configProduct["productLink"]+'&colour='+escape(attValue),
											imgAlt: this.configProduct["productAlt"],
											imgTitle: this.configProduct["productTitle"],
											isMain: true
										});
		jQuery(this.configObjArea["objProductArea"]).html(mainImage);
		jQuery(this.configObjArea["objProductArea"]).parent().find("h2").find("a").attr("href",this.configProduct["productLink"]+'&colour='+attValue);
		}
	},
	
	/**
	* Matching attribute 1 name with the possible value
	* @returns {Boolean} isMatch	Return true if attribute 1 is colour
	* 
	*/
	checkAttr1Filter: function () {
		var attname = this.att1.toLowerCase();
		var synonym = ["color","colors","colour","colours","currency"];
		var isMatch = false;
		
		for (var each in synonym) {
			if (typeof synonym[each] != "function") {
				if (attname.match(synonym[each]) != null) {
					isMatch = true;
				}
			}
		}
		return isMatch;
	},
	
	/**
	* To display all available swatch colour for each product
	*
	*/
	displaySwatch: function() {
		var allSwatch = "";
		var i = 0;
		var isAttr1Color = this.checkAttr1Filter();
		if (isAttr1Color) {
			for (var eachData in this.allImages) {
				if (eachData != "" && eachData != "filter") {
					i++;
					allSwatch = allSwatch + this.getImageTag({
																imgSource: this.allImages[eachData].setswatch,
																swName: eachData,
																noimage: this.configSwatch["noimageText"],
																imgTitle: this.configSwatch["swatchTitle"],
																isSwatch: true
															});
				}
			}
			if (i > 1) {
				jQuery(this.configObjArea["objSwatchArea"]).html(allSwatch);
			}
		}
	},
	
	/**
	* To hightlight a colour swatch which is selecting
	* @param {Object} self	Object collection value
	*/
	updateSelected: function (self) {
		var parent = "#"+self.parentNode.id;
		jQuery(parent).find("a").removeClass("sw_selected");
		jQuery(parent).find("a#"+self.id).addClass("sw_selected");
	},
	
	/**
	* To display a notify message if there is no main image has set up
	* @param {String} attValue	attribute colour is selecting
	*/
	showMessage: function (attValue) {
		var whereId = "#"+this.configObjArea["objProductArea"].id;
		var msg = "<div class=\"notavailable\"><div class=\"msgnotify\">"+this.configProduct["noimageText"]+"<span> "+attValue+"</span></div></div>";
		
		jQuery(whereId).find(".notavailable").remove();
		jQuery(whereId).find("a").after(msg);
		jQuery(whereId).find(".notavailable").fadeOut(this.configProduct["fadeOutTime"]);
	},

	/**
	* To select the first colour attribute
	* @param {Object} an uniqueID of each product
	*/
	selectFirstAtt: function (parent) {
		var isFirstLoad = true;
		var attValue = jQuery("#" + parent.configObjArea.objSwatchArea.id + " a:first").attr("title");
		var defColCode = parent.configObjArea.objColourDefault;
		var defColName = jQuery("#" + parent.configObjArea.objSwatchArea.id + ' img[src*="' + defColCode + '.png"]').parent().attr('title');
		var defId = "sw" + defColName;
		var swId = jQuery("#" + parent.configObjArea.objSwatchArea.id + " a:first").attr("id");
		if (!defColName) {
			jQuery("#" + parent.configObjArea.objSwatchArea.id + " a:first").addClass("sw_selected");
			this.changeSet(attValue,swId,isFirstLoad);
		} else {
			defId = defId.replace(/ /g,'');
			jQuery("#" + parent.configObjArea.objSwatchArea.id + " #" + defId).addClass("sw_selected");
			jQuery("#" + parent.configObjArea.objProductArea.id + " a").attr("href", function(i, href) {
				return href + '?colour=' + defColName;
  		});
			this.changeSet(defColName,defId,isFirstLoad);
		}
	}
};
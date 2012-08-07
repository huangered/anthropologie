/**
* @fileoverview ebiz.js: A module used for client specific functionality
*
* This module defines a single symbol named "Venda.Ebiz"
* all ebiz utility functions are stored as properties of this namespace
* functions that are spacific this site shoudl be added to this file only.
*/

//Declare namespace for ebiz
Venda.namespace("Ebiz");

 /**
 * The following global variables (directly below) are NEEDED to support legacy javascript functions - DO NOT REMOVE! see RT#113376 for more details.
 * 1. shown
 * 2. hidden
 */

var shown = new Image();
shown.src = "/venda-support/images/bulleton.gif";
var hidden = new Image();
hidden.src = "/venda-support/images/bulletoff.gif";

 /**
 * Split a string so it can be displayed on multiple lines so it does not break display layout - used on order confirmation and order receipt page
 * @param {string} strToSplit string that needs to be split 
 * @param {Integer} rowLen length of row which will hold the string
 * @param {string} displayElem the html container which will display the splitted string
 */
Venda.Ebiz.splitString = function(strToSplit, rowLen, dispElem) {
	var stringlist = new Array();
	while (strToSplit.length > rowLen) {
	   stringlist.push( strToSplit.slice(0,rowLen));
	   strToSplit=strToSplit.substr(rowLen);
	}
	if (strToSplit.length) {
		stringlist.push(strToSplit);
	}
	document.getElementById(dispElem).innerHTML = stringlist.join('<br>');
};

 /**
 * A skeleton function for validating user extened fields - needs to be amended by the build team
 * @param {object} frmObj HTML form containing user extended field elements
 */
Venda.Ebiz.validateUserExtendedFields = function(frmObj) {
	if(frmObj) {
		/*
		if ( (frmObj.usxtexample1.checked==false) && (frmObj.usxtexample2.checked==false) && (frmObj.usxtexample3.checked==false))  {	
			alert("Please tick at least one checkbox");
			return false;
		}
		*/
		return true;		
	} 
	return false;
};

/* Description: Returns the value of a specified URL parameter 
* Parameters:
* 1. currURL = this is the URL which you wish to get the URL parameter value from
* 2. urlParam = this is the name of the URL parameter you want to get the value for
* Returns: value for parameter specified urlParam.  */
var grabURL=function (currURL,urlParam) {
	/* find out a value where is passed from current url */
	var url = unescape(currURL);
	var spliter = '&';
	var sField = spliter+urlParam+'=';
	
	if (url.search(sField) == -1) {               
		sField = '?'+urlParam+'=';         
	}
	
	var urlArray = url.split(sField);
	if (urlArray[1]) {
		/* get url param value */
		var paramArray = urlArray[1].split(spliter);
		return(paramArray[0]);
	}
};


 /**
 * Switch currency on current page
 * @param {string} target currency
 * @param {string} current currency
 * @param {string} base URL http://domainname.dot
 * @param {string} alert message
 */
Venda.Ebiz.currencySwitch=function(target,current,baseURL,message){
	jQuery("#"+target).attr("href",function(){
		var URL=unescape(location.href);
		var Path=URL.replace(baseURL,"");	
		Path=Path.replace("&setlocn="+target+"&log=4","");
		URL=URL.replace(baseURL+"/"+current,baseURL+"/"+target);
		if(Path.search(/(page|pcat|scat|stry|invt|icat)/ig)==1){
			/* not used dispview: invt,icat, stry,scat,pcat,page */
			URL=baseURL+"/"+target+Path;
			return URL+"&log=4";
		}
		if(URL.indexOf(baseURL+"/"+current)==0){ 
			/* used dispview: invt,icat, stry,scat,pcat,page */
			URL=URL.replace(baseURL+"/"+current,baseURL+"/"+target);
			return URL+"&log=4";
		}else if(URL.indexOf("ex=co_wizr-locayta")>0){
			/* search -- ex=co_wizr-locayta*/
			if(URL.indexOf("&setlocn="+current)>0){
				URL=URL.replace("&setlocn="+current,"&setlocn="+target);
			}else{
				URL+="&setlocn="+target;
			}
			if(URL.indexOf("&log=4")==-1){URL+="&log=4";}
			return URL;
		}else if(URL.indexOf("ex=co_disp-shopc") > 0 & URL.indexOf("mode=add") > 0){
			/* after add to basket */
			if(URL.indexOf("searchparameters=")>0){
				/* add to basket on search result */
				var searchparameters=Venda.Platform.getUrlParam(location.href,"searchparameters");
				var bklist=Venda.Platform.getUrlParam(location.href,"bklist");
				if(bklist){searchparameters+="&bklist="+bklist}
				URL=baseURL+"/bin/venda?ex=co_wizr-locayta&"+searchparameters;
				if(URL.indexOf("&setlocn="+current)>0){
					URL=URL.replace("&setlocn="+current,"&setlocn="+target);
				}else{
					URL+="&setlocn="+target;
				}
				if(URL.indexOf("&log=4")==-1){URL+="&log=4";}
			}else if(document.referrer&&document.referrer!=""){
				/* add to basket on other page --- invt,icat ... etc. */
				URL=unescape(document.referrer);
				URL=URL.replace(baseURL+"/"+current,baseURL+"/"+target);
			}else{
				/* unable to handle back to home */
				URL=baseURL+"/"+target+"/page/home";
			}
			if(URL.indexOf("&log=4")==-1){URL+="&log=4";}
			return URL;			
		}else{
			if(URL.indexOf(baseURL+"/"+target)>=0){
				if(URL.indexOf("&log=4")==-1){URL+="&log=4";}
				return URL;
			}else{
				return baseURL+"/"+target+"/page/home"+"&log=4";
			}
		}		
	});
	if(message!=""){
		jQuery("#"+target).click(function(){
			return confirm(message);
		});
	}
};

/* ----- Attribute Swatch Function : support up to 2 attributes (ie. colour and size) -----*/
Venda.namespace("Ebiz.AttributeSwatch");
Venda.Ebiz.AttributeSwatch.ListAttributes = new Array();
Venda.Ebiz.AttributeSwatch.filters = new Array();
Venda.Ebiz.AttributeSwatch.existingAttributes = new Array();
Venda.Ebiz.AttributeSwatch.availAttributes = new Array();
Venda.Ebiz.AttributeSwatch.defaultprice = "";
Venda.Ebiz.AttributeSwatch.defaultwasprice = "";

Venda.Ebiz.AttributeSwatch.initListAttributes = function(attrColumn, attrName) {
	for (var eachKey in product.attributeValues) {
		if (typeof product.attributeValues[eachKey] != "function") {
			this.addToListAttributes(attrColumn,product.attributeValues[eachKey].values[attrColumn]);		
		}
	}
	Venda.Ebiz.AttributeSwatch.displayListAttributes(attrColumn, attrName);
	if(this.attrNum==1){Venda.Ebiz.AttributeSwatch.checkAvailOneAttributes(attrColumn, attrName);}
};

Venda.Ebiz.AttributeSwatch.addToListAttributes = function(attrColumn, attrValue) {
	if (!this.isExistInListAttributes(attrColumn,attrValue)) {
		if (!this.ListAttributes[attrColumn]) {
			this.ListAttributes[attrColumn] = new Array();
		}
		this.ListAttributes[attrColumn].push(attrValue);

	}
};

Venda.Ebiz.AttributeSwatch.isExistInListAttributes = function(attrColumn, attrValue) {
	var found = false;
	if (this.ListAttributes[attrColumn]) {
		for (var eachValue in this.ListAttributes[attrColumn]) {
			if (this.ListAttributes[attrColumn][eachValue] == attrValue) { 			
				found = true; 
				break; 
			}
		}
	}
	return found;
};

Venda.Ebiz.AttributeSwatch.createListAttributes=function(attrColumn,attrName,ddObj){
	this.ListAttributes[attrColumn] = new Array();
	for(i=0; i < ddObj.options.length ; i++){
		this.ListAttributes[attrColumn].push(ddObj.options[i].value);
	}
	Venda.Ebiz.AttributeSwatch.displayListAttributes(attrColumn, attrName);
	if(this.attrNum==1){Venda.Ebiz.AttributeSwatch.checkAvailOneAttributes(attrColumn, attrName);}
}

Venda.Ebiz.AttributeSwatch.displayListAttributes = function (attrColumn, attrName){
	var str = "<ul class=attribute_"+attrColumn+">";
	var chkString = "";
	
	for(var i=0; i < this.ListAttributes[attrColumn].length; i++){
		// if att=color use image for swatch
		if (attrName == this.attrDisplayName[0] || attrName.toLowerCase() == "currency") {
			if (!Venda.ProductDetail.allImages[this.ListAttributes[attrColumn][i]] ||  Venda.ProductDetail.allImages[this.ListAttributes[attrColumn][i]].setswatch == "") {

			str += "<li class=\"swatch\"><a class=available id='swatch"+this.ListAttributes[attrColumn][i]+"' title=\""+this.ListAttributes[attrColumn][i]+"\" onmouseover=\"Venda.Ebiz.AttributeSwatch.showTooltipMessage('swatch"+this.ListAttributes[attrColumn][i]+"');\" onmouseout=\"Venda.Ebiz.AttributeSwatch.hideTooltipMessage();\" onmouseup=\"Venda.Ebiz.AttributeSwatch.hideTooltipMessage();\" onclick=\"Venda.Ebiz.AttributeSwatch.actionSet('"+attrColumn+"','"+this.ListAttributes[attrColumn][i]+"'); Venda.Ebiz.AttributeSwatch.changePrice('attr-sellprice','attr-wasprice'); Venda.ProductDetail.changeSet('"+this.ListAttributes[attrColumn][i]+"'); return false;\"><span class=\"swatchattribute\">"+this.ListAttributes[attrColumn][i]+"</span></a></li>";					
			} else {
				// has swatch image
				str += "<li class=\"swatch\"><a class=available id='swatch"+this.ListAttributes[attrColumn][i]+"' title=\""+this.ListAttributes[attrColumn][i]+"\" onmouseover=\"Venda.Ebiz.AttributeSwatch.showTooltipMessage('swatch"+this.ListAttributes[attrColumn][i]+"');\" onmouseout=\"Venda.Ebiz.AttributeSwatch.hideTooltipMessage();\" onmouseup=\"Venda.Ebiz.AttributeSwatch.hideTooltipMessage();\" onclick=\"Venda.Ebiz.AttributeSwatch.actionSet('"+attrColumn+"','"+this.ListAttributes[attrColumn][i]+"'); Venda.Ebiz.AttributeSwatch.changePrice('attr-sellprice','attr-wasprice'); Venda.ProductDetail.changeSet('"+this.ListAttributes[attrColumn][i]+"'); return false;\"><img class=\"swatchimage\" src=\""+Venda.ProductDetail.allImages[this.ListAttributes[attrColumn][i]].setswatch+"\" alt=\""+this.ListAttributes[attrColumn][i]+"\"></a></li>";
			}

		} else {
			str += "<li><a class=available id='swatch"+this.ListAttributes[attrColumn][i]+"' title=\""+this.ListAttributes[attrColumn][i]+"\" onmouseover=\"Venda.Ebiz.AttributeSwatch.showTooltipMessage('swatch"+this.ListAttributes[attrColumn][i]+"');\" onmouseout=\"Venda.Ebiz.AttributeSwatch.hideTooltipMessage();\" onmouseup=\"Venda.Ebiz.AttributeSwatch.hideTooltipMessage();\" onclick=\"Venda.Ebiz.AttributeSwatch.actionSet('"+attrColumn+"','"+this.ListAttributes[attrColumn][i]+"'); Venda.Ebiz.AttributeSwatch.changePrice('attr-sellprice','attr-wasprice'); return false;\">"+this.ListAttributes[attrColumn][i]+"</a></li>";		
		}
	}
	str = str + "</ul>";
	document.getElementById("productdetail-"+attrColumn).innerHTML = str;
};


Venda.Ebiz.AttributeSwatch.addFilter = function(attrColumn,attrValue) {
	var filterString="";
	this.filters[attrColumn] = attrValue;
	// clear background alert message
	document.getElementById("alertmessage").className = "normal";
	// update alert message
	Venda.Ebiz.AttributeSwatch.updateMessage();
};

Venda.Ebiz.AttributeSwatch.updateMessage = function(){
	if(this.attrNum==1){
		if(this.filters["att1"]!=""){
			document.getElementById("alertmessage").innerHTML = "<span class=labelAttr>" + this.attrDisplayName[0] + ":</span> <span class=colorselected>" + this.filters["att1"]+"</span>";
		}
	}else{
		if(this.filters["att1"]=="" || this.filters["att1"]==undefined){
			document.getElementById("alertmessage").innerHTML = "<span class=notselectedmsg>"+this.defaultTextSelectAtt + this.attrDisplayName[0] + "</span> <span class=labelAttr>" + this.attrDisplayName[1] + ":</span> <span class=sizeselected>"+ this.filters['att2'] + "</span>";
		}else if(this.filters["att2"]=="" || this.filters["att2"]==undefined){
			document.getElementById("alertmessage").innerHTML = "<span class=labelAttr>" + this.attrDisplayName[0] + ":</span> <span class=colorselected>" + this.filters['att1'] + "</span> <span class=notselectedmsg>"+this.defaultTextSelectAtt + this.attrDisplayName[1] + "</span>";
		}
		if((this.filters["att1"]!="") && (this.filters["att2"]!="") && (this.filters["att1"]!=undefined) && (this.filters["att2"]!=undefined)){
			document.getElementById("alertmessage").innerHTML = "<span class=labelAttr>" + this.attrDisplayName[0] + ":</span> <span class=colorselected>" + this.filters["att1"]+"</span> <span class=labelAttr>" + this.attrDisplayName[1] +":</span> <span class=sizeselected>" + this.filters["att2"] + "</span>";
		}
	}
};

Venda.Ebiz.AttributeSwatch.validateAttributes = function(){
	var isSelected = true;
	if(this.attrNum==1){
		if(this.filters["att1"]==undefined || this.filters["att1"]==""){
			document.getElementById("alertmessage").className = "warning";
			isSelected = false;
		}
	}else{
		if(this.filters["att1"]==undefined || this.filters["att2"]==undefined || this.filters["att1"]=="" || this.filters["att2"]==""){
			document.getElementById("alertmessage").className = "warning";
			isSelected = false;
		}
	}
	return isSelected;
};

// Check if attribute exist and has onhand
Venda.Ebiz.AttributeSwatch.checkAvailAttributes = function(attrColumn,attrValue) {
	this.existingAttributes = new Array();
	this.availAttributes = new Array();
	var attrColumnSelect="";
	switch(attrColumn){
		case "att1": attrColumn="att2";attrColumnSelect="att1";break;
		case "att2": attrColumn="att1";attrColumnSelect="att2";break;
	}
	a=0;	
	var str="<ul class=attribute_"+attrColumn+">";
	for (var eachAttrSet in product.attributeValues) {
		if(product.attributeValues[eachAttrSet].values[attrColumnSelect]==attrValue && (product.attributeValues[eachAttrSet].data["atronhand"]>0)){
			this.existingAttributes[a]=product.attributeValues[eachAttrSet].values[attrColumn]; 
			a++;
		}
	}
	this.updateListAttributes(attrColumn,attrColumnSelect);	
};

Venda.Ebiz.AttributeSwatch.checkAvailOneAttributes = function(attrColumn, attrName) {
	this.existingAttributes = new Array();
	this.availAttributes = new Array();
	a=0;	
	var str="<ul class=attribute_"+attrColumn+">";
	for (var eachAttrSet in product.attributeValues) {
		if(product.attributeValues[eachAttrSet].data["atronhand"]>0){
			this.existingAttributes[a]=product.attributeValues[eachAttrSet].values[attrColumn]; 
			a++;
		}
	}
	this.updateListAttributes(attrColumn);
};

Venda.Ebiz.AttributeSwatch.updateListAttributes = function(attrColumn,attrColumnSelect) {
	//compare existingAttributes with the full range
	for(i=0; i < this.ListAttributes[attrColumn].length; i++){
		// if there is no any existingAttributes (ie. all out of stock)
		if(this.existingAttributes.length==0){this.availAttributes[i] = false;}
		for(j=0; j < this.existingAttributes.length; j++){
			if(this.ListAttributes[attrColumn][i]==this.existingAttributes[j]){
				this.availAttributes[i] = this.existingAttributes[j];
				break;
			}else{
				this.availAttributes[i] = false;
			}
		}		
		if(this.availAttributes[i] != false){
			if(this.ListAttributes[attrColumn][i]==this.filters[attrColumn]){
				document.getElementById("swatch"+this.ListAttributes[attrColumn][i]).className="selected";
			}else{
				document.getElementById("swatch"+this.ListAttributes[attrColumn][i]).className="available";
			}
			/* case: has 1 value of attribute one or two - select this one */
			if(attrColumnSelect && this.ListAttributes[attrColumn].length==1){
				document.getElementById("swatch"+this.ListAttributes[attrColumn][0]).className="selected";
				Venda.Ebiz.AttributeSwatch.addFilter(attrColumn,this.ListAttributes[attrColumn][0]);
				document.form.elements[attrColumn].value = this.ListAttributes[attrColumn][0];
			}
		}else{
			document.getElementById("swatch"+this.ListAttributes[attrColumn][i]).className="notavail";
			if(this.attrNum==1){
				// if has only one attr - unclickable out of stock attribute
				document.getElementById("swatch"+this.ListAttributes[attrColumn][i]).attributes["onclick"].value="";
				document.getElementById("swatch"+this.ListAttributes[attrColumn][i]).style.cursor="default";
			}
			if(this.ListAttributes[attrColumn][i]==this.filters[attrColumn]){
				// clear if no combination
				this.filters[attrColumn]="";
				Venda.Ebiz.AttributeSwatch.addFilter(attrColumn,"");
				document.form.elements[attrColumn].value = "";
				if(attrColumnSelect){
					/*case: if attrColumn was reset - add available to another attribute and if it was selected also add class selected  */
					for(ii=0; ii < this.ListAttributes[attrColumnSelect].length; ii++){
						if(this.ListAttributes[attrColumnSelect][ii]==this.filters[attrColumnSelect]){
							document.getElementById("swatch"+this.ListAttributes[attrColumnSelect][ii]).className="selected";
						}else{
							document.getElementById("swatch"+this.ListAttributes[attrColumnSelect][ii]).className="available";
						}
					}
				}
			}
		}
	}
};

// Highlight selected option
Venda.Ebiz.AttributeSwatch.highlightSelection = function(attrColumn,id){
	for(i=0; i < this.ListAttributes[attrColumn].length; i++){
		if(this.ListAttributes[attrColumn][i] == id){
			document.getElementById("swatch"+this.ListAttributes[attrColumn][i]).className = "selected";

		}else{
			if(document.getElementById("swatch"+this.ListAttributes[attrColumn][i]).className != "notavail"){
				document.getElementById("swatch"+this.ListAttributes[attrColumn][i]).className = "available";
			}
		}
	}
};

Venda.Ebiz.AttributeSwatch.changePrice = function(id, wasid){
	var price = "";
	var wasprice = "";

	if (this.attrNum == 1) {
		for (var eachAttrSet in product.attributeValues) {
			if(product.attributeValues[eachAttrSet].values["att1"]==this.filters["att1"]){
				if (product.attributeValues[eachAttrSet].data["atrsell"]!="" && product.attributeValues[eachAttrSet].data["atrsell"]!=undefined) {
					price = parseFloat(product.attributeValues[eachAttrSet].data["atrsell"]).toFixed(2);
				}
				if (product.attributeValues[eachAttrSet].data["atrwas"]!="" && product.attributeValues[eachAttrSet].data["atrwas"]!=undefined){
					wasprice = parseFloat(product.attributeValues[eachAttrSet].data["atrwas"]).toFixed(2);
				}
			}
		}	
	} else if (this.attrNum == 2) {
		for (var eachAttrSet in product.attributeValues) {
			if(product.attributeValues[eachAttrSet].values["att1"]==this.filters["att1"] && product.attributeValues[eachAttrSet].values["att2"]==this.filters["att2"]){
				if (product.attributeValues[eachAttrSet].data["atrsell"]!="" && product.attributeValues[eachAttrSet].data["atrsell"]!=undefined) {
					price = parseFloat(product.attributeValues[eachAttrSet].data["atrsell"]).toFixed(2);
				}
				if (product.attributeValues[eachAttrSet].data["atrwas"]!="" && product.attributeValues[eachAttrSet].data["atrwas"]!=undefined){
					wasprice = parseFloat(product.attributeValues[eachAttrSet].data["atrwas"]).toFixed(2);
				}
			}
		}		
	}
	
	if (price == "") { price = this.defaultprice;}
	if (wasprice == "") { wasprice = this.defaultwasprice; }
	if (price != "") {
		document.getElementById(id).innerHTML = product.labels['currsym'] + price;
	}
	if (wasprice!="" && (parseFloat(wasprice)>parseFloat(price))) {
		//support case normal product type and product type Family with valid Size and Colour
		document.getElementById(wasid).innerHTML = this.waslabel + product.labels['currsym'] + wasprice;	
	}else{
		if(wasprice==this.defaultwasprice && this.defaultwasprice>price && this.producttype=="family") {
			//support case product type Family with invalid Size and Colour
			document.getElementById(wasid).innerHTML = this.waslabel + product.labels['currsym'] + wasprice;	
		} else {
			document.getElementById(wasid).innerHTML = "";
		}
	}
};

Venda.Ebiz.AttributeSwatch.actionSet = function(attrColumn,attrValue){
	document.form.elements[attrColumn].value = attrValue;
	this.addFilter(attrColumn,attrValue);
	this.highlightSelection(attrColumn,attrValue);
	// do checkAvailAttributes only if has more than one attributes
	if(this.attrNum>1){this.checkAvailAttributes(attrColumn,attrValue)}
	Venda.Ebiz.AttributeSwatch.etaDate();
};

Venda.Ebiz.AttributeSwatch.mediapath="";
Venda.Ebiz.AttributeSwatch.addtobasketbt="bt_addtobasket.gif";
Venda.Ebiz.AttributeSwatch.backorderbt="bt_comingsoon.gif";
Venda.Ebiz.AttributeSwatch.today="";
Venda.Ebiz.AttributeSwatch.etaDate=function(){
	/* if not has add to basket button exit fn */
	if(jQuery("#addproduct").length<1) return ;
	/* set media path */
	jQuery(".link_btm p.eta").remove();
	if(Venda.Ebiz.AttributeSwatch.mediapath==""){
		Venda.Ebiz.AttributeSwatch.mediapath=jQuery("#addproduct").attr("src");
		Venda.Ebiz.AttributeSwatch.mediapath=Venda.Ebiz.AttributeSwatch.mediapath.substr(0,Venda.Ebiz.AttributeSwatch.mediapath.lastIndexOf('/')+1);
		Venda.Ebiz.AttributeSwatch.backorderbt=Venda.Ebiz.AttributeSwatch.mediapath+Venda.Ebiz.AttributeSwatch.backorderbt;
		Venda.Ebiz.AttributeSwatch.addtobasketbt=Venda.Ebiz.AttributeSwatch.mediapath+Venda.Ebiz.AttributeSwatch.addtobasketbt;
		Venda.Ebiz.AttributeSwatch.today=new Date(jQuery("#today").text());
	}
	if (this.attrNum == 1) {
		for (var eachAttrSet in product.attributeValues) {
			if(product.attributeValues[eachAttrSet].values["att1"]==this.filters["att1"]){
				if (product.attributeValues[eachAttrSet].data["atretady"]!="" && product.attributeValues[eachAttrSet].data["atretady"]!=undefined && 
					product.attributeValues[eachAttrSet].data["atretamn"]!="" && product.attributeValues[eachAttrSet].data["atretamn"]!=undefined &&
					product.attributeValues[eachAttrSet].data["atretayr"]!="" && product.attributeValues[eachAttrSet].data["atretayr"]!=undefined) {
					
					var etaday=new Date();
					etaday.setFullYear(product.attributeValues[eachAttrSet].data["atretayr"],product.attributeValues[eachAttrSet].data["atretamn"]-1,product.attributeValues[eachAttrSet].data["atretady"]);
					if(Venda.Ebiz.AttributeSwatch.today<etaday){
						ETA = product.attributeValues[eachAttrSet].data["atretady"]+"/"+product.attributeValues[eachAttrSet].data["atretamn"]+"/"+product.attributeValues[eachAttrSet].data["atretayr"];
						jQuery("#addproduct, .qtymessage").hide();
						jQuery(".preorder").show();
						jQuery(".link_btm").append('<p class="eta">'+this.availableText+ETA+'</p>');						
						return ;
					}
				}
			}
		}
	} else if (this.attrNum == 2) {
		for (var eachAttrSet in product.attributeValues) {
			if(product.attributeValues[eachAttrSet].values["att1"]==this.filters["att1"] && product.attributeValues[eachAttrSet].values["att2"]==this.filters["att2"]){
				if (product.attributeValues[eachAttrSet].data["atretady"]!="" && product.attributeValues[eachAttrSet].data["atretady"]!=undefined && 
					product.attributeValues[eachAttrSet].data["atretamn"]!="" && product.attributeValues[eachAttrSet].data["atretamn"]!=undefined &&
					product.attributeValues[eachAttrSet].data["atretayr"]!="" && product.attributeValues[eachAttrSet].data["atretayr"]!=undefined) {
					var today=new Date();
					var etaday=new Date();
					etaday.setFullYear(product.attributeValues[eachAttrSet].data["atretayr"],product.attributeValues[eachAttrSet].data["atretamn"]-1,product.attributeValues[eachAttrSet].data["atretady"]);
					if(Venda.Ebiz.AttributeSwatch.today<etaday){
						ETA = product.attributeValues[eachAttrSet].data["atretady"]+"/"+product.attributeValues[eachAttrSet].data["atretamn"]+"/"+product.attributeValues[eachAttrSet].data["atretayr"];
						jQuery("#addproduct, .qtymessage").hide();
						jQuery(".preorder").show();
						jQuery(".link_btm").append('<p class="eta">'+this.availableText+ETA+'</p>');						
						return ;
					}
				}
			}
		}
	}
	jQuery("#addproduct").attr("src",Venda.Ebiz.AttributeSwatch.addtobasketbt);
	jQuery(".preorder").hide();
	jQuery("#addproduct, .qtymessage").show();
};

/* Show tooltip for unavailable options */
Venda.Ebiz.AttributeSwatch.showTooltipMessage = function (id){
	if(document.getElementById(id).className=="notavail"){
		document.getElementById("swatchUnavailTooltip").className = "show";
		var posLeft = document.getElementById(id).offsetLeft-(document.getElementById("swatchUnavailTooltip").offsetWidth/2)+(document.getElementById(id).offsetWidth/2);
		var posTop = document.getElementById(id).offsetTop-document.getElementById("swatchUnavailTooltip").offsetHeight-document.getElementById("swatchUnavailTooltipArrow").offsetHeight;
		document.getElementById("swatchUnavailTooltip").style.left = posLeft+"px";
		document.getElementById("swatchUnavailTooltip").style.top = posTop+"px";
	}
};

Venda.Ebiz.AttributeSwatch.hideTooltipMessage = function (){
	document.getElementById("swatchUnavailTooltip").className = "hide";
};

Venda.namespace('Ebiz.BKList');
Venda.Ebiz.BKList = function(){};
Venda.Ebiz.BKList.jq = jQuery;

Venda.Ebiz.BKList.init = function(bklist) {
	this.bklist = bklist;
};

Venda.Ebiz.BKList.jq(document).ready(function() {
	var bklist = Venda.Ebiz.BKList.bklist || Venda.Platform.getUrlParam(document.location.href, "bklist") || "";
	if (bklist != "") {
		// change link in product list section
		Venda.Ebiz.BKList.jq("#productlist a").attr("href", function() {
			return Venda.Ebiz.BKList.jq(this).attr("href") + "&bklist=" + bklist; 
		});
		
		// change next/previous link in product detail section
		if (document.getElementById("productdetail")){
		Venda.Ebiz.BKList.jq("#buttons a").attr("href", function() {
			return Venda.Ebiz.BKList.jq(this).attr("href") + "&bklist=" + bklist; 
		});
		}
		Venda.Ebiz.BKList.jq("#searchresults .pagn a").attr("href", function() {
			return Venda.Ebiz.BKList.jq(this).attr("href") + "&bklist=" + bklist; 
		});	
		if(Venda.Ebiz.BKList.jq(".sort option").attr("value")){
               Venda.Ebiz.BKList.jq(".sort option").attr("value", function() {        
               return Venda.Ebiz.BKList.jq(this).attr("value") + "&bklist=" + bklist;
			});                             

		}		
		/* Breadcrumb not available on this site.
		// remove bklist out of the breadcrumb
		Venda.Ebiz.BKList.jq(".categorytree a").attr("href", function() {
			var currentLink = Venda.Ebiz.BKList.jq(this).attr("href");
			var newLink = currentLink;
			if (newLink.length > 2) {
				if (currentLink.indexOf("&bklist=") != -1) {
					newLink = currentLink.substring(0, currentLink.indexOf("&bklist="));
				}
				if (newLink.indexOf("&view=") != -1) {
					newLink = newLink.substring(0, newLink.indexOf("&view="));
				}
			}
			return newLink;
		});
		*/
	}
});

 /**
 * The function is to originally created to visually remove one of the item from crumtrail to make it like that one is skipped.
 * It is also created in to be selected which item of crumtail would be removed by providing index of crumtrail.
 * Please note that this function requires jQuery in order to make it work.
 */
Venda.namespace("Ebiz.RecreateCrumtrail");
Venda.Ebiz.RecreateCrumtrail = {};

Venda.Ebiz.RecreateCrumtrail.jq = jQuery;	// Reference to jQuery.
Venda.Ebiz.RecreateCrumtrail.crumtrail = {};	// Crumtrail object in a form of array to be manipulated.
Venda.Ebiz.RecreateCrumtrail.crumtrailSelectorString = "";	// jQuery selector string.
Venda.Ebiz.RecreateCrumtrail.splitString = "";	// String contains crumtrail seperator.
Venda.Ebiz.RecreateCrumtrail.joinString = "";	// String contains crumtrail seperator that will be used to put back crumtrail items together.

 /**
 * Function that initial all required properties
 * @param {string} crumtrail	Set jQuery crumtrail selector string
 * @param {string} splitString	Set crumtrail seperator
 */
Venda.Ebiz.RecreateCrumtrail.init = function(crumtrail,splitString){
	Venda.Ebiz.RecreateCrumtrail.crumtrailSelectorString = crumtrail;
	Venda.Ebiz.RecreateCrumtrail.splitString = splitString;
	Venda.Ebiz.RecreateCrumtrail.joinString = splitString
};

 /**
 * Function that retrieve crumtrail into Venda.Ebiz.RecreateCrumtrail.crumtrail in a form of array
 */
Venda.Ebiz.RecreateCrumtrail.getCrumtrail = function(){
	this.crumtrail = this.jq(this.crumtrailSelectorString).html().split(this.splitString);
};

 /**
 * Function that get crumtrail object and remove an item of crumtrail
 * @param {integer} index	An index item number of crumtrail to be removed.
 */
Venda.Ebiz.RecreateCrumtrail.removeIndex = function(index){
	this.getCrumtrail();
	this.crumtrail.splice(index,1);
};

 /**
 * Function that put back crumtrail
 */
Venda.Ebiz.RecreateCrumtrail.rewrite = function(){
	this.jq(this.crumtrailSelectorString).html(this.crumtrail.join(this.joinString));
};
 
Venda.Ebiz.serialize = function(formSelector){
	var serializeStr = '';
	jQuery(formSelector).find("input, select, textarea").each(function(){
		if(this.name!=""){serializeStr+="&"+this.name+"="+escape(this.value);}
	});
	return serializeStr;
 };
 
 
/**
* ajaxFunction using jQuery
* @param {string} target url
* @param {string} output id
* @param {string} formID if not null > set type=post and require form param
* @param {string} callback function
*/
Venda.Ebiz.ajaxFunction = function(ajaxurl,whichDiv,formID,fnAfterLoading) {	
	var ajaxtype = (formID!="")?"POST":"GET";
	var ajaxdata=(formID!="")?Venda.Ebiz.serialize("#"+formID):"";
	jQuery.ajax({type: ajaxtype,
		url: ajaxurl,
		data: ajaxdata,
		success: function(data){
			jQuery("#"+whichDiv).html(data);
			fnAfterLoading();
		},
		dataType: "html"});
};

/* Add class "first" to order detail table in order to create background line in the middle only */
jQuery(document).ready(function(){
	jQuery(".orderitems .wizrtable tbody tr:first").addClass("first");
});
// Item Backorder show Stock ETA date  (RT146433) Display dd/mm/yyyy //
Venda.namespace("Ebiz.DisplayPreordersMsg");
Venda.Ebiz.DisplayPreordersMsg=function(){};
Venda.Ebiz.DisplayPreordersMsg.monthName=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
Venda.Ebiz.DisplayPreordersMsg.today=new Date();
Venda.Ebiz.DisplayPreordersMsg.show=function(eta,msg){
	if(eta.atretady!="" && eta.atretamn!="" && eta.atretayr!=""){
		var etaDate=new Date();
		var yearstr=etaDate.getFullYear()+"";
		//eta.atretamn=eta.atretamn-1;
		etaDate.setFullYear(eta.atretayr,eta.atretamn,eta.atretady);
		etaDate.setHours(0,0,0);
		Venda.Ebiz.DisplayPreordersMsg.today.setHours(0,0,0);
		var etaDateFloor=Math.floor(etaDate.getTime()/86400000);
		var todayFloor=Math.floor(Venda.Ebiz.DisplayPreordersMsg.today.getTime()/86400000);
		if(etaDateFloor>todayFloor){
			//yearstr=yearstr.substr(2,2)
			//msg[0]=msg[0].replace("[date]",etaDate.getDate()+"-"+Venda.Ebiz.DisplayPreordersMsg.monthName[eta.atretamn]+"-"+yearstr);
			msg[0]=msg[0].replace("[date]",eta.atretady+"/"+eta.atretamn+"/"+eta.atretayr);
			document.write(msg[0]);
		}else {
			document.write(msg[1]);
		}
	}
};

Venda.Ebiz.CookieJar = new CookieJar({expires: 3600 * 24 * 7, path: '/'});
jQuery.fn.popupIframe = function(){
	if ( jQuery.browser.msie && /6.0/.test(navigator.userAgent) ) {
	var src   = 'javascript:false;';
	  html = '<iframe class="popupIframe" src="'+src+'" style="-moz-opacity: .10;filter: alpha(opacity=1);height:expression(this.parentNode.offsetHeight+\'px\');width:expression(this.parentNode.offsetWidth+\'px\');'+'"></iframe>';
		if (jQuery('.popupIframe').length == 0 ){
			this.prepend(html);
		}
	 }
};

/* ELV payment option */
jQuery(function() {
	var cccntry = jQuery('#cccntry').html();
	if (cccntry==="de"){
		if ($("#contactdetails").length > 0){
			//if pay by paypal radio is selected hide other payment options
			if(jQuery("input:radio[name=ohpaytype]:checked").val()==="12"){
				jQuery("#cctoggle,#elvtoggle").css("display", "none");
			}
			//check if any ohpaytype radios are checked
			var paytypeChecked = true;
			jQuery("input:radio[name=ohpaytype]").each(function(){
			   paytypeChecked = paytypeChecked && jQuery(this).is(':checked');
			});
			//if cardtype anything but elv, user has credit card payment details stored or none so disable and blank fields from elv section, enable fields in cc section, select credit card radio and make sure ohpaytype 0 is checked
			if ((jQuery("#cardtype").val()!=="directdebitsde" && jQuery("input:radio[name=ohpaytype]:checked").val()==="0")||(jQuery("#cardtype").val()!=="directdebitsde" && !paytypeChecked)){
				jQuery("#elv #ohccnum,#elv #ohccname").val("").attr('disabled', true);
				jQuery("#cc #ohccnum,#cc #ohccname").removeAttr('disabled');
				jQuery("#elvtoggle,#pptoggle").css("display", "none"); 		
				jQuery("#dummycreditcard").attr("checked", "checked");
				jQuery("#creditcard").attr("checked", "checked");
				jQuery("#cardtype").val(jQuery("#dummycardtype").val());
			}
			//if cardtype elv, disable and blank fields from credit card section, enable fields in elv section, select elv radio, set cardtype to elv and make sure ohpaytype 0 is checked
			if (jQuery("#cardtype").val()==="directdebitsde" && jQuery("input:radio[name=ohpaytype]:checked").val()==="0"){
				jQuery("#cc #ohccnum,#cc #ohccname").val("").attr('disabled', true);
				jQuery("#elv #ohccnum,#elv #ohccname").removeAttr('disabled');
				jQuery("#cctoggle,#pptoggle").css("display", "none"); 
				jQuery("#dummyelv").attr("checked", "checked");
				jQuery("#cardtype").val("directdebitsde");
				jQuery("#creditcard").attr("checked", "checked");
			}
			//if click pay by elv set cardtype to elv and make sure ohpaytype 0 is checked
			jQuery("#dummyelv").click(function() {
				jQuery("#cctoggle,#pptoggle").slideUp("fast", function () {
					jQuery("#cc #ohccnum,#cc #ohccname").attr('disabled', true);
					jQuery("#elv #ohccnum,#elv #ohccname, #sortcode").removeAttr('disabled');
					jQuery("#elvtoggle").slideDown("fast");
				});
				jQuery("#cardtype").val("directdebitsde");
				jQuery("#creditcard").attr("checked", "checked");
			});
			//if click pay by card set cardtype to match dummy carttype option
			jQuery("#dummycreditcard").click(function() {
				jQuery("#elvtoggle,#pptoggle").slideUp("fast", function () {
					jQuery("#elv #ohccnum,#elv #ohccname, #sortcode").attr('disabled', true);
					jQuery("#cc #ohccnum,#cc #ohccname").removeAttr('disabled');
					jQuery("#cctoggle").slideDown("fast");
				});
				jQuery("#cardtype").val(jQuery("#dummycardtype").val());
			});
			//if click pay by paypal
			jQuery("#formpaypal").click(function() {
				jQuery("input:radio[name=dummypaytype]").removeAttr("checked");//uncheck other radios
				jQuery("#cctoggle,#elvtoggle").slideUp("fast", function () {
					jQuery("#pptoggle").slideDown("fast");
				});
			});
			//if click elv fields set cardtype to elv and make sure ohpaytype 0 is checked
			jQuery("#elv input").click(function() {
				jQuery("#cardtype").val("directdebitsde");
				jQuery("#creditcard").attr("checked", "checked");
				jQuery("#dummyelv").attr("checked", "checked");
			});
			//if click credit cart fields set cardtype to match dummy carttype option and make sure ohpaytype 0 is checked
			jQuery(jQuery("#cc input,#cc select").not("#dontsavecc")).click(function() {
				jQuery("#creditcard").attr("checked", "checked");
				jQuery("#dummycreditcard").attr("checked", "checked");
				jQuery("#cardtype").val(jQuery("#dummycardtype").val());
			});
		}else{
			//if pay by paypal radio is selected hide other payment options
			if(jQuery("input:radio[name=ohpaytype]:checked").val()==="12"){
				jQuery("#elvtoggle").css("display", "none");
			}
			//check if any ohpaytype radios are checked
			var paytypeChecked = true;
			jQuery("input:radio[name=ohpaytype]").each(function(){
			   paytypeChecked = paytypeChecked && jQuery(this).is(':checked');
			});
			//if cardtype anything but elv, user has credit card payment details stored or none so disable and blank fields from elv section, enable fields in cc section, select credit card radio and make sure ohpaytype 0 is checked
			if ((jQuery("#cardtype").val()!=="directdebitsde" && jQuery("input:radio[name=ohpaytype]:checked").val()==="0")||(jQuery("#cardtype").val()!=="directdebitsde" && !paytypeChecked)){
				jQuery("#elv #ohccnum,#elv #ohccname").val("").attr('disabled', true);
				jQuery("#cc #ohccnum,#cc #ohccname").removeAttr('disabled');
				jQuery("#elvtoggle,#pptoggle").css("display", "none"); 		
				jQuery("#dummycreditcard").attr("checked", "checked");
				jQuery("#creditcard").attr("checked", "checked");
				jQuery("#cardtype").val(jQuery("#dummycardtype").val());
			}
			//if cardtype elv, disable and blank fields from credit card section, enable fields in elv section, select elv radio, set cardtype to elv and make sure ohpaytype 0 is checked
			if (jQuery("#cardtype").val()==="directdebitsde" && jQuery("input:radio[name=ohpaytype]:checked").val()==="0"){
				jQuery("#cc #ohccnum,#cc #ohccname").val("").attr('disabled', true);
				jQuery("#elv #ohccnum,#elv #ohccname").removeAttr('disabled');
				jQuery("#cctoggle,#pptoggle").css("display", "none"); 
				jQuery("#dummyelv").attr("checked", "checked");
				jQuery("#cardtype").val("directdebitsde");
				jQuery("#creditcard").attr("checked", "checked");
			}
			//if click pay by elv set cardtype to elv and make sure ohpaytype 0 is checked
			jQuery("#dummyelv").click(function() {
				jQuery("#cctoggle,#pptoggle").slideUp("fast", function () {
					jQuery("#cc #ohccnum,#cc #ohccname").attr('disabled', true);
					jQuery("#elv #ohccnum,#elv #ohccname, #sortcode").removeAttr('disabled');
					jQuery("#elvtoggle").slideDown("fast");
				});
				jQuery("#cardtype").val("directdebitsde");
				jQuery("#creditcard").attr("checked", "checked");
			});
			//if click pay by card set cardtype to match dummy carttype option
			jQuery("#dummycreditcard").click(function() {
				jQuery("#elvtoggle,#pptoggle").slideUp("fast", function () {
					jQuery("#elv #ohccnum,#elv #ohccname, #sortcode").attr('disabled', true);
					jQuery("#cc #ohccnum,#cc #ohccname").removeAttr('disabled');
					jQuery("#cctoggle").slideDown("fast");
				});
				jQuery("#cardtype").val(jQuery("#dummycardtype").val());
			});
			//if click pay by paypal
			jQuery("#formpaypal").click(function() {
				jQuery("input:radio[name=dummypaytype]").removeAttr("checked");//uncheck other radios
				jQuery("#cctoggle,#elvtoggle").slideUp("fast", function () {
					jQuery("#pptoggle").slideDown("fast");
				});
			});
			//if click elv fields set cardtype to elv and make sure ohpaytype 0 is checked
			jQuery("#elv input").click(function() {
				jQuery("#cardtype").val("directdebitsde");
				jQuery("#creditcard").attr("checked", "checked");
				jQuery("#dummyelv").attr("checked", "checked");
			});
			//if click credit cart fields set cardtype to match dummy carttype option and make sure ohpaytype 0 is checked
			jQuery(jQuery("#cc input,#cc select").not("#dontsavecc")).click(function() {
				jQuery("#creditcard").attr("checked", "checked");
				jQuery("#dummycreditcard").attr("checked", "checked");
				jQuery("#cardtype").val(jQuery("#dummycardtype").val());
			});
		}
	}else{
		//check if any ohpaytype radios are checked
		var paytypeChecked = true;
		jQuery("input:radio[name=ohpaytype]").each(function(){
		   paytypeChecked = paytypeChecked && jQuery(this).is(':checked');
		});
		//if cardtype anything but elv, user has credit card payment details stored or none so disable and blank fields from elv section, enable fields in cc section, select credit card radio and make sure ohpaytype 0 is checked
		if ((jQuery("#cardtype").val()!=="directdebitsde" && jQuery("input:radio[name=ohpaytype]:checked").val()==="0")||(jQuery("#cardtype").val()!=="directdebitsde" && !paytypeChecked)){
			jQuery("#cc #ohccnum,#cc #ohccname").removeAttr('disabled');
			jQuery("#dummycreditcard").attr("checked", "checked");
			jQuery("#creditcard").attr("checked", "checked");
		}
		//animate
		jQuery("#formpaypal").click(function() {
			jQuery("input:radio[name=dummypaytype]").removeAttr("checked");//uncheck other radios
			jQuery("#cctoggle").slideUp("fast");
		});
		//if click pay by card set cardtype to match dummy carttype option
		jQuery("#dummycreditcard").click(function() {
			jQuery("#cc #ohccnum,#cc #ohccname").removeAttr('disabled');
			jQuery("#cctoggle").slideDown("fast");
		});
		//if click credit cart fields set cardtype to match dummy cardtype option and make sure ohpaytype 0 is checked
		jQuery(jQuery("#cc input,#cc select").not("#dontsavecc")).click(function() {
			jQuery("#creditcard").attr("checked", "checked");
			jQuery("#dummycreditcard").attr("checked", "checked");
		});
	}
});

/**
* validate attribute color from url parameter in attributeData
**/
Venda.Ebiz.validateColour = function(colour){
	var validColor = false;
	for (var obj in attributeData) {
		if (typeof attributeData[obj] != "function") {
			if(attributeData[obj].attr.att1 === colour){
				validColor = true;
				break;
			}
		}
	}
	return validColor;
};
/**
* validate postal codes against regex
**/
Venda.Ebiz.europePostalCheck = function (country) {
			var	postalCode = jQuery('#zipc').val()
			if (countries[country] != null) {
				var	countryCache = (countries[country]), 
						validate = new RegExp(countryCache.regex.validate, "i"),
						format = new RegExp(countryCache.regex.format, "i"),
						deliminate = countryCache.deliminate || "",
						prefix = countryCache.prefix || ""
				if (postalCode.search(validate) != 0) {
					alert('Please enter a valid postcode for your selected country e.g. ' + countryCache.example);
					return false;
				} else if (postalCode.search(validate) == 0) {
					if (countryCache.regex.format != null) {
						jQuery('#zipc').val(postalCode.replace(format, "$1" + deliminate + "$2").toUpperCase());
					} else if (prefix != "") {
						jQuery('#zipc').val(postalCode.replace(validate, prefix + "$2"));
					} else {
						jQuery('#zipc').val(postalCode.replace(validate, "$1"));
					}
					return true;
				}
				return true;
			}
			return true;
	} 
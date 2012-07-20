var loaderWheel = new Image(32,32);
loaderWheel.src = "http://anthropologie.uat.venda.com/content/ebiz/anthropologie/resources/images/wlprSwatches/rqSwchLoader.gif"; 

var myARR = new Array();
var selectedARR = new Array();
var blanksNeeded;
var rqSwchPageID;
var swatchType;

function init(){
   swatchType = window.location.href.split("swchType=");
   swatchType = swatchType[1]
	setPageID();
	setArray(swatchType);
	setLayout(swatchType);
	findGCD(myARR.length);
	var tempHTML = "";
	var tempID;
	for(var x = 0; x < myARR.length; x++){
	   tempID = "wlprSwch" + myARR[x][0];
		tempHTML += "<div name=\"" + tempID + "\" id=\"" + tempID + "\" class=\"rqSwchScrollerItem\">";
		tempHTML += "<div class=\"rqSwchScrollerItemSelectLabel\" onClick=\"toggleSelect('" + tempID + "');\">selected</div>";
		tempHTML += "<div class=\"rqSwchScrollerItemSelect\" onClick=\"toggleSelect('" + tempID + "');\"></div>";
		tempHTML += "<div class=\"rqSwchScrollerItemData\"><img src=\"http://anthropologie.uat.venda.com/content/ebiz/anthropologie/resources/images/wlprSwatches/swatches/" + myARR[x][2] + "\" title=\"Select Swatch\" alt\"" + myARR[x][1] + "\" onClick=\"toggleSelect('" + tempID + "');\" onMouseOver=\"toggleHover(this);\" onMouseOut=\"toggleHover(this);\"/>";
		tempHTML += "<div class=\"rqSwchScrollerItemLabel\" onClick=\"showProductPage('" + myARR[x][0] + "');\" title=\"View Full Details\">" + myARR[x][1] + "</div></div>";
		tempHTML += "</div>";
	}
	for(var y = 0; y < blanksNeeded; y++){tempHTML += "<div class=\"rqSwchScrollerItem\"></div>";}
	$('rqSwchBodyScroller').innerHTML = tempHTML;
	updateStateProv("0000");
	clearAllSelected();
	if (window.location.href.split("&style") != -1) { configParams();}
}
function setPageID(){
	if(getVariable("id") == "wlpr"){rqSwchPageID = "HOME-SWATCHREQUEST-WALLPAPER";}
	else{rqSwchPageID = "HOME-SWATCHREQUEST-UPHOLSTERY";}
}
function setArray(swatchType){
	if(swatchType == "wlpr"){myARR = wlprARR;}
	else{myARR = upstryARR;}
	myARR.sort(function(a,b){
		if(a[1] < b[1]){return -1;}
		else if(a[1] > b[1]){return 1;}
		else{return 0;}
	});
}
function setLayout(swatchType){
	var tempHTML = "";
	if(swatchType == "wlpr"){
		document.title = "Request Wallpaper Swatches - Anthropologie.eu";
		$('rqSwchHeaderSwatch').style.backgroundImage = "url('http://anthropologie.uat.venda.com/content/ebiz/anthropologie/resources/images/wlprSwatches/bg_rqSwchHeaderSwatch_wlpr.png')";
		tempHTML = "<div class=\"rqSwchBodyParagraph\">Prints, patterns, motifs galore! With so much to choose from, we’ll gladly send swatches to assist making your decision. You’ll receive an approximate 10cm x 15cm sample on an information card about ten business days after submitting your request. </div>";
	}
	else{
		document.title = "Request Upholstery Swatches - Anthropologie.eu";
		$('rqSwchHeaderSwatch').style.width = "262px";
		$('rqSwchHeaderSwatch').style.marginRight = "180px";
		$('rqSwchHeaderSwatch').style.backgroundImage = "url('http://anthropologie.uat.venda.com/content/ebiz/anthropologie/resources/images/wlprSwatches/bg_rqSwchHeaderSwatch_upstry.png')";
		tempHTML = "<div class=\"rqSwchBodyParagraph\">Getting ready to take the plunge? We'll gladly send fabric swatches to assist in making your choice. Swatches will arrive about 10 business days after submitting a request.<br><br><span class=\"rqSwchBodyParagraphItalics\">Please note: not all fabrics are available as swatches and not all frames are available in all fabrics. Additionally, swatches cannot be sent internationally.</span></div>";
	}
	tempHTML += "<div id=\"rqSwchCounter\">select swatches below</div><div id=\"rqSwchBodyScroller\"></div>";
	$('rqSwchBodySwatch').innerHTML = tempHTML;
}
function configParams(){
	if(getVariable("style") != undefined){
		var myStyle = getVariable("style");
		var totalSwatchesARR = $$(".rqSwchScrollerItem");
		for(var x = 0; x < totalSwatchesARR.length; x++){
			var tempSwatchID = totalSwatchesARR[x].id;
			if(tempSwatchID.indexOf("wlprSwch") != -1){
				if(tempSwatchID.substring(8,tempSwatchID.length) == myStyle){
					toggleSelect(totalSwatchesARR[x].id);
					window.location.href = "#wlprSwch" + myStyle;
				}
			}
		}
	}
	else if(getVariable("receipt") != undefined){
		var myARR = getVariable("receipt");
		myARR = myARR.split(",");
		showReceipt(myARR);
	}
}
function findGCD(tempTotalItems){
	var tempRemainder = 0;
	var tempResult = (tempTotalItems/3) + "";
	if(tempResult.indexOf(".") != -1){tempTotalItems++;findGCD(tempTotalItems);}
	else{tempRemainder = parseInt(tempTotalItems - myARR.length);blanksNeeded = tempRemainder;}
}
function toggleSelect(myDIV){
	var tempARR1 = $$("#" + myDIV + " .rqSwchScrollerItemSelect");
	var tempARR2 = $$("#" + myDIV + " .rqSwchScrollerItemSelectLabel");
	if(tempARR1[0].style.display == "none"){
		tempARR1[0].style.display = "block";
		tempARR2[0].style.display = "block";
		selectedARR.push(myDIV);
	}
	else{
		tempARR1[0].style.display = "none";
		tempARR2[0].style.display = "none";
		for(var x = 0; x < selectedARR.length; x++){if(selectedARR[x] == myDIV){selectedARR.splice(x,1);}}
	}
	updateSelectedCount();
}
function showProductPage(myID){
	if(myID.indexOf("G") != -1 || myID.indexOf("N") != -1){myID = myID.substring(0,myID.length -1);}
	if(window.opener){window.opener.location = "/invt/" + myID;window.opener.focus();}
	else{window.location = "/invt/" + myID;if(parseNavOBJ("userAgent","MSIE")){return false;}}
}
function clearAllSelected(){
	var totalItemsARR = $$("#rqSwchBodyScroller div.rqSwchScrollerItem");
	for(var x = 0; x < totalItemsARR.length; x++){
		if(totalItemsARR[x].id != ""){
			var tempARR1 = $$("#" + totalItemsARR[x].id + " .rqSwchScrollerItemSelect");
			var tempARR2 = $$("#" + totalItemsARR[x].id + " .rqSwchScrollerItemSelectLabel");
			tempARR1[0].style.display = "none";
			tempARR2[0].style.display = "none";
		}
	}
}
function toggleHover(myIMG){
	if((myIMG.style.borderColor == "")||(myIMG.style.borderColor == "#f8f7f1")||(myIMG.style.borderColor == "rgb(248, 247, 241)")||(myIMG.style.borderColor == "rgb(248, 247, 241) rgb(248, 247, 241) rgb(248, 247, 241) rgb(248, 247, 241)")){
		myIMG.style.borderColor = "#999";
	}
	else {
		myIMG.style.borderColor = "#f8f7f1";
	}
}
function updateSelectedCount(){
	switch(selectedARR.length){
		case 0:$('rqSwchCounter').innerHTML = "select swatches below";break;
		case 1:$('rqSwchCounter').innerHTML = selectedARR.length + " item selected";break;
		default:$('rqSwchCounter').innerHTML = selectedARR.length + " items selected";break
	}
}
function validateForm(){
	var currentSwatchType = getVariable("type");
	if(isFieldValid("rqSwchForm_first-name")){
		if(isFieldValid("rqSwchForm_last-name")){
			if(isFieldValid("rqSwchForm_street-addr1")){
				if(isFieldValid("rqSwchForm_city")){
					//if(isFieldValid("rqSwchForm_state")){
						if(isFieldValid("rqSwchForm_zip-code")){
							if(isFieldValid("rqSwchForm_country")){
								if(isEmailValid()){
									if(selectedARR.length < 1){selectFocusForm("","Please select at least one swatch to continue.");}
									else{
										if(currentSwatchType == undefined){currentSwatchType = "upstry";}
										$('rqSwchForm_swatches').value = getSelectedARR();
										$('rqSwchForm').from.value = $('rqSwchForm').emailAddress.value;
										if(parseNavOBJ("userAgent","MSIE")){
											if($('stateProvince').value != $('rqSwchForm_state').value){$('stateProvince').value = $('rqSwchForm_state').value}
											$('rqSwchIeFrameFix').style.display = "block";
										}
										showLoader();
									}
								}
								else{selectFocusForm("rqSwchForm_email","Please enter a valid email address.");}
							}
							else{selectFocusForm("rqSwchForm_country","Please enter a country name.");}
						}
						else{selectFocusForm("rqSwchForm_zip-code","Please enter a valid postcode.");}
					}
					//else{selectFocusForm("rqSwchForm_state","Please select a state/province.");}
				//}
				else{selectFocusForm("rqSwchForm_city","Please enter a city name.");}
			}
			else{selectFocusForm("rqSwchForm_street-addr1","Please enter an address.");}
		}
		else{selectFocusForm("rqSwchForm_last-name","Please enter a last name.");}
	}
	else {selectFocusForm("rqSwchForm_first-name","Please enter a first name.");}
}
function resetAlert(){
	if($("rqSwchFormAlert").style.visibility == "visible"){$("rqSwchFormAlert").style.visibility = "hidden";}
}
function isFieldValid(myOBJ){
	var tempValue = $(myOBJ).value;
	//if(myOBJ == "rqSwchForm_zip-code"){
		//tempValue = parseInt(tempValue);
		//if(isNaN(tempValue)){return false;}
	//}
	if($(myOBJ).value != ""){return true;}
	else { return false; }
}
function isEmailValid(){
	var tempValue = $("rqSwchForm_email").value;
	var tempExt = tempValue.substring((tempValue.length - 4),tempValue.length);
	if(tempValue.indexOf("@") == -1){return false;}
	if(tempValue.indexOf(".") == -1){return false;}
	if(tempValue.length < 4){return false;}
	return true;

}
function selectFocusForm(myOBJ,myMSG){
	$("rqSwchFormAlert").innerHTML = "*&nbsp;" + myMSG;
	$("rqSwchFormAlert").style.visibility = "visible";
	if(myOBJ != ""){$(myOBJ).focus();if(myOBJ != "rqSwchForm_state"){$(myOBJ).select();}}
}
function updateStateProv(myCountry){
	var tempHTML = "";
	if(myCountry == "0000"){$("rqSwchForm_country").value = "0000";tempHTML = "<option value=\"\">select a state</option><option value=\"AL\">AL - Alabama</option><option value=\"AK\">AK - Alaska</option><option value=\"AS\">AS - American samoa</option><option value=\"AZ\">AZ - Arizona</option><option value=\"AR\">AR - Arkansas</option><option value=\"CA\">CA - California</option><option value=\"CO\">CO - Colorado</option><option value=\"CT\">CT - Connecticut</option><option value=\"DE\">DE - Delaware</option><option value=\"DC\">DC - District of Columbia</option><option value=\"FM\">FM - Federated States of Micronesia</option><option value=\"FL\">FL - Florida</option><option value=\"GA\">GA - Georgia</option><option value=\"GU\">GU - Guam</option><option value=\"HI\">HI - Hawaii</option><option value=\"ID\">ID - Idaho</option><option value=\"IL\">IL - Illinois</option><option value=\"IN\">IN - Indiana</option><option value=\"IA\">IA - Iowa</option><option value=\"KS\">KS - Kansas</option><option value=\"KY\">KY - Kentucky</option><option value=\"LA\">LA - Louisiana</option><option value=\"ME\">ME - Maine</option><option value=\"MH\">MH - Marshall Islands</option><option value=\"MD\">MD - Maryland</option><option value=\"MA\">MA - Massachusetts</option><option value=\"MI\">MI - Michigan</option><option value=\"MN\">MN - Minnesota</option><option value=\"MS\">MS - Mississippi</option><option value=\"MO\">MO - Missouri</option><option value=\"MT\">MT - Montana</option><option value=\"NE\">NE - Nebraska</option><option value=\"NV\">NV - Nevada</option><option value=\"NH\">NH - New Hampshire</option><option value=\"NJ\">NJ - New Jersey</option><option value=\"NM\">NM - New Mexico</option><option value=\"NY\">NY - New York</option><option value=\"NC\">NC - North Carolina</option><option value=\"ND\">ND - North Dakota</option><option value=\"MP\">MP - Northern Mariana Islands</option><option value=\"OH\">OH - Ohio</option><option value=\"OK\">OK - Oklahoma</option><option value=\"OR\">OR - Oregon</option><option value=\"PW\">PW - Palau</option><option value=\"PA\">PA - Pennsylvania</option><option value=\"PR\">PR - Puerto Rico</option><option value=\"RI\">RI - Rhode Island</option><option value=\"SC\">SC - South Carolina</option><option value=\"SD\">SD - South Dakota</option><option value=\"TN\">TN - Tennessee</option><option value=\"TX\">TX - Texas</option><option value=\"UT\">UT - Utah</option><option value=\"VT\">VT - Vermont</option><option value=\"VI\">VI - Virgin Islands</option><option value=\"VA\">VA - Virginia</option><option value=\"WA\">WA - Washington</option><option value=\"WV\">WV - West Virginia</option><option value=\"WI\">WI - Wisconsin</option><option value=\"WY\">WY - Wyoming</option>";}
	else{$("rqSwchForm_country").value = "CA";tempHTML = "<option value=\"\">select a province</option><option value=\"AB\">AB - Alberta</option><option value=\"BC\">BC - British Columbia</option><option value=\"MB\">MB - Manitoba</option><option value=\"NB\">NB - New Brunswick</option><option value=\"NL\">NL - Newfoundland and Labrador</option><option value=\"NT\">NT - Northwest Territories</option><option value=\"NS\">NS - Nova Scotia</option><option value=\"NU\">NU - Nunavut</option><option value=\"ON\">ON - Ontario</option><option value=\"PE\">PE - Prince Edward Island</option><option value=\"QC\">QC - Quebec</option><option value=\"SK\">SK - Saskatchewan</option><option value=\"YT\">YT - Yukon</option>";}

	if(parseNavOBJ("userAgent","MSIE")){$("rqSwchForm_state").outerHTML = "<select id=\"rqSwchForm_state\" class=\"rqSwchFormInputLong\" onKeyPress=\"resetAlert();\">" + tempHTML + "</select>";}
	else{$("rqSwchForm_state").innerHTML = tempHTML;}
}
function handleEnterKey(eventOBJ,formOBJ){
	var key;
	if(window.event){key = window.event.keyCode;}
	else{key = eventOBJ.which;}
	if(key == 13){
		switch(formOBJ.id){
			case "rqSwchForm":validateForm();return false;
			default:return false;
		}
	}
}
function getSwatchAttribs(myDIV){
	var tempID = myDIV;
	var tempSKU = tempID.substring(8,tempID.length);
	var tempItemDataARR = $$("#" + tempID + " .rqSwchScrollerItemData .rqSwchScrollerItemLabel");
	var tempARR = new Array(tempSKU,tempItemDataARR[0].innerHTML);
	return tempARR;
}
function getSelectedARR(){
	var tempSTR = "";
	var tempID;
	for(var x = 0; x < selectedARR.length; x++){
		tempID = selectedARR[x].substring(selectedARR[x].indexOf("Swch") + 4, selectedARR[x].length);
		for(var y = 0; y < myARR.length; y++){if(tempID == myARR[y][0]){tempSTR += myARR[y][0] + "-" + myARR[y][1] + ",";}}
	}
	tempSTR = tempSTR.substring(0,tempSTR.length -1);
	return tempSTR;
}
function showReceipt(myARR){
	var tempARR;
	var totalSwatchesARR = myARR;
	var tempHTML = "<div id=\"rqSwchReceiptNotes\"><div>Your request for swatches has been processed; they will arrive in about 10 business days. Keep your eyes peeled!</div></div>";
	tempHTML += "<div id=\"rqSwchReceiptCTNR\">";
	tempHTML += "<div id=\"rqSwchReceiptHeader\"></div>";
	
	for(var x = 0; x < totalSwatchesARR.length; x++){
		tempARR = getSwatchAttribs(totalSwatchesARR[x]);
		tempHTML += "<div class=\"";
		if(x%2){tempHTML += "rqSwchReceiptDarkCol"}
		else{tempHTML += "rqSwchReceiptLightCol"}
		tempHTML += "\">" + tempARR[1] + "</div>";
	}
	tempHTML += "</div>";
	tempHTML += "<div class=\"rqSwchFormBtn\" onClick=\"continueShopping();\">continue shopping</div>";

	$('rqSwchReceipt').innerHTML = tempHTML;
	$('rqSwchReceiptWrapper').style.backgroundColor = "#E0E3E1";
	$('rqSwchReceiptWrapper').style.border = "1px solid #e5e0d6";
	if(parseNavOBJ("userAgent","MSIE")){$('rqSwchReceiptWrapper').style.zIndex = "5";}
	$('rqSwchReceipt').style.display = "block";
	$('rqSwchReceiptWrapper').style.display = "block";
	$('rqSwchLoader').style.backgroundImage = "none";
	$('rqSwchLoader').style.height = "auto";
	$('rqSwchLoader').style.display = "block";
	$('rqSwchReceiptCurtain').style.display = "block";
	if(parseNavOBJ("userAgent","MSIE")){$('rqSwchIeFrameFix').style.display = "block";}
}
function showLoader(){
	$('rqSwchReceiptWrapper').style.backgroundColor = "transparent";
	$('rqSwchReceiptWrapper').style.border = "none";
	$('rqSwchReceiptWrapper').style.top = "239px";
	$('rqSwchReceiptWrapper').style.left = "406px";
	if(!parseNavOBJ("userAgent","Chrome")){$('rqSwchLoader').style.zIndex = "5";}
	if(parseNavOBJ("appVersion","AppleWebKit")){$('rqSwchLoader').innerHTML = "<img src=\"" + loaderWheel.src + "\"/>";}
	else{$('rqSwchLoader').style.backgroundImage = "url('" + loaderWheel.src + "')";}
	$('rqSwchLoader').style.display = "block";
	$('rqSwchReceiptWrapper').style.display = "block";
	$('rqSwchReceiptCurtain').style.display = "block";
	$('rqSwchReceiptWrapper').style.backgroundColor = "transparent";
	
	//uncomment the window.location line below for debugging purposes
	//window.location = "rqSwch.jsp?type=" + currentSwatchType + "&receipt=" + selectedARR;
	$('rqSwchForm').submit();
}
function parseNavOBJ(index,value,response){
	var myNavARR = new Array();
	for(attribs in navigator){myNavARR[attribs] = navigator[attribs];}
	if(myNavARR[index].indexOf(value) != -1){if(response != 1){return myNavARR[index];}else{return true;}}
	else{return false;}
}
function getVariable(myKey){
	var fullURL = window.location.toString();
	var startPoint = fullURL.indexOf("?");
	var queryString = fullURL.substr(startPoint+1,fullURL.length);
	var keyValuePairs = queryString.split("&");
	var myValue;
	for(var x = 0; x < keyValuePairs.length; x++){if(keyValuePairs[x].indexOf(myKey) != -1){myValue = keyValuePairs[x].substr(keyValuePairs[x].indexOf("=")+1,keyValuePairs[x].length);}}
	return myValue;
}
function continueShopping(){
	if(window.opener){window.close();}
	else{location.href = "rqSwch.jsp?type=" + getVariable("type");}
}
function updateStateProvince(){
	$('stateProvince').value = $('rqSwchForm_state').value;
}
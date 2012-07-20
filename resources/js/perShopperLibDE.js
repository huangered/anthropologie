var loaderWheel = new Image(32,32);
loaderWheel.src = "http://anthropologie.uat.venda.com/content/ebiz/anthropologie/resources/images/wlprSwatches/rqSwchLoader.gif"; 

function validateForm(){
	if(isFieldValid("rqSwchForm_first-name")){
		if(isFieldValid("rqSwchForm_last-name")){
				if(isFieldValid("rqSwchForm_phone")){
					//if(isFieldValid("rqSwchForm_dob")){
						if(isFieldValid("rqSwchForm_country")){
							//if(isFieldValid("rqSwchForm_enquiry")){
								if(isEmailValid()){
										$('rqSwchForm').from.value = $('rqSwchForm').emailAddress.value;
										showLoader();
								}
								else{selectFocusForm("rqSwchForm_email","Eine gültige Email-adresse eingeben bitte.");}
								//}
								//else{selectFocusForm("rqSwchForm_enquiry","Please select your enquiry.");}
							}
							else{selectFocusForm("rqSwchForm_country","Wählen Sie bitte Ihr Land.");}
						//}
						//else{selectFocusForm("rqSwchForm_dob","Please enter you date of birth.");}
					}
					else{selectFocusForm("rqSwchForm_phone","Einen gültigen telefonnummer bitte eingeben.");}
			}
		else{selectFocusForm("rqSwchForm_last-name","Geben Sie bitte Ihren Nachname ein.");}
		}
	else {selectFocusForm("rqSwchForm_first-name","Geben Sie bitte Ihren Vorname ein.");}
}

function resetAlert(){
	if($("rqSwchFormAlert").style.visibility == "visible"){$("rqSwchFormAlert").style.visibility = "hidden";}
}

function isFieldValid(myOBJ){
	var tempValue = $(myOBJ).value;
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
	if(myOBJ != ""){$(myOBJ).focus();}
}

function parseNavOBJ(index,value,response){
	var myNavARR = new Array();
	for(attribs in navigator){myNavARR[attribs] = navigator[attribs];}
	if(myNavARR[index].indexOf(value) != -1){if(response != 1){return myNavARR[index];}else{return true;}}
	else{return false;}
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
	$('rqSwchForm').submit();
}

function showMoreInfo(objContactMethod) {
	if (objContactMethod.value == "byEmail") {
		$('emailsection').style.visibility = "visible";
		$('emailsection').style.display = "block";
		$('phonesection').style.visibility = "hidden";
		$('phonesection').style.display = "none";
		//$('descsection').style.visibility = "hidden";
		//$('descsection').style.display = "none";
	}
	if (objContactMethod.value == "byPhone") {
		$('emailsection').style.visibility = "hidden";
		$('emailsection').style.display = "none";
		$('phonesection').style.visibility = "visible";
		$('phonesection').style.display = "block";
		//$('descsection').style.visibility = "hidden";
		//$('descsection').style.display = "none";
	}
	/*if (objContactMethod.value == "byDesc") {
		$('emailsection').style.visibility = "hidden";
		$('emailsection').style.display = "none";
		$('phonesection').style.visibility = "hidden";
		$('phonesection').style.display = "none";
		$('descsection').style.visibility = "visible";
		$('descsection').style.display = "block";
	}*/
}
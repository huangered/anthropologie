/* these params sets options for the datepicker specifically for personal shopper form */
var today     = new Date(),
rangeLow  = new Date(today.getFullYear(), today.getMonth(), today.getDate() +1);
var rangeLow2 = rangeLow.getFullYear() + "" + pad(rangeLow.getMonth()+1) + "" + pad(rangeLow.getDate()+1);

function showStoreInfo(objStoreLoc) {
	var x=$("selectStore").selectedIndex;
	var y=$("selectStore").options;
	var storename = y[x].value;

	if (storename == 'Regent Street') {
	   //RegentStPS@anthropologie.com
	   $('tomail').innerHTML += "<input value=\"RegentStPS@anthropologie.com\" type=\"hidden\" name=\"to\">";
	}
	if (storename == 'Kings Road') {
	   //KingsRoadPS@anthropologie.com
	   $('tomail').innerHTML += "<input value=\"KingsRoadPS@anthropologie.com\" type=\"hidden\" name=\"to\" >";
  }
  if (storename == 'George Street') {
     //EdinburghPS@anthropologie.com
     $('tomail').innerHTML += "<input value=\"EdinburghPS@anthropologie.com\" type=\"hidden\" name=\"to\" >";
  }
}

function showMoreInfo(objContactMethod) {
	if (objContactMethod.value == "byEmail") {
		$('emailsection').style.visibility = "visible";
		$('emailsection').style.display = "block";
		$('phonesection').style.visibility = "hidden";
		$('phonesection').style.display = "none";
		$('descsection').style.visibility = "hidden";
		$('descsection').style.display = "none";
	}
	if (objContactMethod.value == "byPhone") {
		$('emailsection').style.visibility = "hidden";
		$('emailsection').style.display = "none";
		$('phonesection').style.visibility = "visible";
		$('phonesection').style.display = "block";
		$('descsection').style.visibility = "hidden";
		$('descsection').style.display = "none";
	}
	if (objContactMethod.value == "byDesc") {
		$('emailsection').style.visibility = "hidden";
		$('emailsection').style.display = "none";
		$('phonesection').style.visibility = "hidden";
		$('phonesection').style.display = "none";
		$('descsection').style.visibility = "visible";
		$('descsection').style.display = "block";
	}
}

var loaderWheel = new Image(32,32);
loaderWheel.src = "http://anthropologie.uat.venda.com/content/ebiz/anthropologie/resources/images/wlprSwatches/rqSwchLoader.gif"; 

function validateForm(){
if(isFieldValid("selectStore")){
	if(isFieldValid("first-name")){
		if(isFieldValid("last-name")){
				if(isFieldValid("phone")){
					if(isFieldValid("selectFirst-dd")){
						if(isFieldValid("selectFirst-mm")){
							if(isFieldValid("selectFirst-time")){
							if(isFieldValid("selectSecond-dd")){
								if(isFieldValid("selectSecond-mm")){
									if(isFieldValid("selectSecond-time")){
									 if(isEmailValid()){
											$('rqSwchForm').from.value = $('rqSwchForm').emailAddress.value;
											showLoader();
										  }
										  else{selectFocusForm("rqSwchForm_email","Eine gültige Email-adresse eingeben bitte.");}
										  }
							 	 		else{selectFocusForm("selectSecond-time","Wählen Sie bitte eine alternative Zeit.");}
										 }
							 	 else{selectFocusForm("selectSecond-mm","Wählen Sie bitte einen alternativen Monat.");}
									}
							  else{selectFocusForm("selectSecond-dd","Wählen Sie bitte einen alternativen Tag.");}
							  }
							  else{selectFocusForm("selectFirst-time","Wählen Sie bitte Ihre bevorzugte Zeit.");}
							}
							else{selectFocusForm("selectFirst-mm","Wählen Sie bitte Ihren bevorzugten Monat.");}
						}
						else{selectFocusForm("selectFirst-dd","Wählen Sie bitte Ihren bevorzugten Tag .");}
					}
					else{selectFocusForm("phone","Einen gültigen telefonnummer bitte eingeben.");}
			}
		else{selectFocusForm("last-name","Geben Sie bitte Ihren Nachname ein.");}
		}
	else {selectFocusForm("first-name","Geben Sie bitte Ihren Vorname ein.");}
	}
	else {selectFocusForm("selectStore","Wählen Sie bitte Ihren bevorzugten Laden.");}
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

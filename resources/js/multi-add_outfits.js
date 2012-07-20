jQuery.noConflict();

jQuery(function() {

   jQuery('.onoff').attr('checked', false);
   jQuery('#addall').attr('checked', false);
   jQuery('.qtylist').hide();
  
   //set buy now button to disabled by default
   jQuery('#multiaddbuynow').attr('disabled', 'disabled').attr('value', '');
   jQuery('#multiaddbuynow2').attr('disabled', 'disabled').attr('value', '').hide();
   jQuery('#multiaddbuynow').attr('disabled', 'disabled').attr('value', '').show();
   jQuery('#multiaddbuynow2').attr('disabled', 'disabled').attr('value', '').hide();
   jQuery('.productset #color-error').hide();
   jQuery('.productset #size-error').hide();
   jQuery('select').attr('selectedIndex', 0);
   jQuery('.onoff').bind('click',
		function() {

		   var attr1 = jQuery(this).parent().parent().find(".widthdropdown .att1 select[name='att1']").val();
		   var attr2 = jQuery(this).parent().parent().find(".widthdropdown .att2 select[name='att2']").val();
   
		   //uncheck add all if any 1 product is unchecked
		   if (jQuery('#addall').is(":checked")) {
		      jQuery('#addall').attr("checked", false);
		   }

		   if (jQuery(this).is(':checked')) {
		      jQuery(this).next().next('.qtylist').show().attr('value', this.checked + 0);
			  /*if(!attr1)
			  {
				jQuery(this).parent().parent().find("span#color-error").css({'color':'red','padding-left':'85px'}).html('Please select a color');
				jQuery(this).parent().parent().find("span#color-error").show();
			  }	
			  if(!attr2)
			  {
				jQuery(this).parent().parent().find("span#size-error").css({'color':'red','padding-left':'85px'}).html('Please select a size');
				jQuery(this).parent().parent().find("span#size-error").show();
			  }*/
			  var set_oldval = jQuery(this).parent().parent().parent().find("input[name^=set_oitemxoixtaddedproduct_]").val();
			  var attimgchk = set_oldval.match( /_b$/ig );
			  if( attimgchk == null )
			  {
				var set_newval = set_oldval + jQuery(this).parent().parent().find(".widthdropdown .att1 select[name='att1']").val().toLowerCase() + '_b';
				jQuery(this).parent().parent().parent().find("input[name^=set_oitemxoixtaddedproduct_]").val(set_newval);
			  }
		   }
		   else {
		      jQuery(this).next().next('.qtylist').hide().attr('value', this.checked + 0);

				/*jQuery(this).parent().parent().find("span#color-error").html('');
				jQuery(this).parent().parent().find("span#color-error").hide();
				jQuery(this).parent().parent().find("span#size-error").html('');
				jQuery(this).parent().parent().find("span#size-error").hide();*/
		   }

			toggleBuyBtn();
		}
	);

	jQuery('#addall').bind('click',
		function() {

		   //set text for checkboxes depending on state of add/remove checkbox
		   if (jQuery(this).is(':checked')) {
		      //jQuery('.qtylist').show().attr('value', this.checked + 0);
			  //if(jQuery('.onoff').attr("disabled", false)){
				// jQuery('.onoff').attr('checked', true);
			  //}
			  var all_onoff = jQuery('.onoff').each(function(){
				  /*var attr1 = jQuery(this).parent().parent().find(".widthdropdown .att1 select[name='att1']").val();
				  var attr2 = jQuery(this).parent().parent().find(".widthdropdown .att2 select[name='att2']").val();
				  if(!attr1)
				  {
					jQuery(this).parent().parent().find("span#color-error").css({'color':'red','padding-left':'85px'}).html('Please select a color');
					jQuery(this).parent().parent().find("span#color-error").show();
				  }
				  if(!attr2)
				  {
					jQuery(this).parent().parent().find("span#size-error").css({'color':'red','padding-left':'85px'}).html('Please select a size');
					jQuery(this).parent().parent().find("span#size-error").show();
				  }*/
				  var set_oldval = jQuery(this).parent().parent().parent().find("input[name^=set_oitemxoixtaddedproduct_]").val();
				  var attimgchk = set_oldval.match( /_b$/ig );
				  if( attimgchk == null )
				  {
					var set_newval = set_oldval + jQuery(this).parent().parent().find(".widthdropdown .att1 select[name='att1']").val().toLowerCase() + '_b';
					jQuery(this).parent().parent().parent().find("input[name^=set_oitemxoixtaddedproduct_]").val(set_newval);
				  }				  
			  });
		   } else {
		      //jQuery('.onoff').attr('checked', false);
		      //jQuery('.qtylist').hide().attr('value', this.checked + 0);
		      jQuery('select').attr('selectedIndex', 0);
			 /* var all_onoff = jQuery('.onoff').each(function(){
				  var attr1 = jQuery(this).parent().parent().find(".widthdropdown .att1 select[name='att1']").val();
				  var attr2 = jQuery(this).parent().parent().find(".widthdropdown .att2 select[name='att2']").val();
				  if(!attr1)
				  {
					jQuery(this).parent().parent().find("span#color-error").html('');
					jQuery(this).parent().parent().find("span#color-error").hide();
				  }
				  if(!attr2)
				  {
					jQuery(this).parent().parent().find("span#size-error").html('');
					jQuery(this).parent().parent().find("span#size-error").hide();
				  }					  
			  });*/
		   }

		}
	);

   //set buy now button value/disabled depending on how many add/remove checkboxes are ticked
});

toggleBuyBtn = function() {
	var checked_status = jQuery(".alreadyAdd[value='add']").length;
	//alert(checked_status);
	if (checked_status >= 1) {
		jQuery('#multiaddbuynow').removeAttr('disabled').attr('value', '').hide();
		jQuery('#multiaddbuynow2').removeAttr('disabled').attr('value', '').show();
	} else {
		jQuery('#multiaddbuynow').attr('disabled', 'disabled').attr('value', '').show();
		jQuery('#multiaddbuynow2').attr('disabled', 'disabled').attr('value', '').hide();
	}
}

var buynowsubmit = function() {
   var atrvalue = jQuery('.attrproduct:has(input:checked) select[selectedIndex]').length;
   if (atrvalue < 1) {
      alert('<venda_text id=site.please.select.size.colour>');
      return false;
   }
   else {
      return true;
   }
};

//check attr
var submittobag = function() {
   	    var isCheck = jQuery('.onoff') .attr( 'checked' );
		var hasQty = [];
		var i = 0;
		jQuery(".productset").find(".onoff").each(function(){	
		var attrId = jQuery(this).attr("id");
			var att1 = jQuery("#attr_"+ attrId).find('select[name=att1]').val();
			var att2 = jQuery("#attr_"+ attrId).find('select[name=att2]').val();

			if((jQuery(this).attr('checked')) && ((att1 == "") || (att2 == ""))){
				hasQty[i] = jQuery(this).attr( 'checked' );
			}			
			i++
		});

if(hasQty.length > 0){
			alert('<venda_text id=site.please.select.size.colour>');
			return false;
		} 

		var color_error = jQuery('.productset').find('#color-error:visible').length;
		var size_error = jQuery('.productset').find('#size-error:visible').length;
		if(color_error || size_error) {
			return false;
		}
		else {
			return true;
		}
};
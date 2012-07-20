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
   jQuery('select').attr('selectedIndex', 0);
   jQuery('.onoff').bind('click',
		function() {

		   //uncheck add all if any 1 product is unchecked
		   if (jQuery('#addall').is(":checked")) {
		      jQuery('#addall').attr("checked", false);
		   }

		   if (jQuery(this).is(':checked')) {

		      jQuery(this).next().next('.qtylist').show().attr('value', this.checked + 0);
		   }
		   else {
		      jQuery(this).next().next('.qtylist').hide().attr('value', this.checked + 0);
		   }

		   toggleBuyBtn();

		}
	);

   jQuery('#addall').bind('click',
		function() {

		   //set text for checkboxes depending on state of add/remove checkbox
		   if (jQuery(this).is(':checked')) {
		      jQuery('.qtylist').show().attr('value', this.checked + 0);
		      jQuery('.onoff').attr('checked', true);
		   } else {
		      jQuery('.onoff').attr('checked', false);
		      jQuery('.qtylist').hide().attr('value', this.checked + 0);
		      jQuery('select').attr('selectedIndex', 0);
		   }

		   toggleBuyBtn();

		}
	);

   //set buy now button value/disabled depending on how many add/remove checkboxes are ticked
   function toggleBuyBtn() {
      var checked_status = jQuery('input:checked').length;
      if (checked_status >= 1) {
         jQuery('#multiaddbuynow').removeAttr('disabled').attr('value', '').hide();
         jQuery('#multiaddbuynow2').removeAttr('disabled').attr('value', '').show();
      } else {
         jQuery('#multiaddbuynow').attr('disabled', 'disabled').attr('value', '').show();
         jQuery('#multiaddbuynow2').attr('disabled', 'disabled').attr('value', '').hide();
      }
   }
});

var buynowsubmit = function() {
   var atrvalue = jQuery('.attrproduct:has(input:checked) select[selectedIndex]').length;
   if (atrvalue < 1) {
      alert('<venda_text id=site.please.select.variant>');
      return false;
   }
   else {
      return true;
   }
};
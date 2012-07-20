prod_stats_send_params = function(event_type, params_str)
{
	var host = 'feedcommerce.venda.com';
	//var host = 'cms2.poligon.idegp.priv';
	var docLocation = new String(document.location);
	var isHttps = docLocation.search( /https\:\/\// );
	var sc = document.createElement('script');
	sc.type = 'text/javascript';
	//sc.id = "_external_counter_js";
	if (isHttps == -1)
		{
			sc.src='http://'+host+'/index.php?action=products_stats/track_conversion&e_type='+event_type+'&params='+params_str+'&'+Math.random();
		}
	else 
		{
			sc.src='https://'+host+'/index.php?action=products_stats/track_conversion&e_type='+event_type+'&params='+params_str+'&'+Math.random();
		}
	document.getElementsByTagName('head')[0].appendChild(sc); 
};
prod_stats_count = function()
{
	var ProductView_ta = document.getElementById('productView');
	var ProductAdd_ta = document.getElementById('productAdd');
	//var OrderReceipt_ta = document.getElementById('orderReceipt');
	var OrderReceiptTotals_ta = document.getElementById('orderReceiptTotal');
	var OrderReceiptItems_ta = document.getElementById('orderReceiptItems');
	
	var params_arr;
	
	if(ProductView_ta != null)
	{
		params_arr = ProductView_ta.value.split("\n");
		for(var i = 0; i < params_arr.length; i++)
		{
			if(params_arr[i] != '') {prod_stats_send_params('ProductView', encodeURIComponent(params_arr[i]));}
		}
	}
	
	if(ProductAdd_ta != null)
	{
		params_arr = ProductAdd_ta.value.split("\n");
		for(var i = 0; i < params_arr.length; i++)
		{
			if(params_arr[i] != '') {prod_stats_send_params('ProductAdd', encodeURIComponent(params_arr[i]));}
		}
	}
	
	if((OrderReceiptTotals_ta != null) && (OrderReceiptItems_ta != null))
	{
		var items = OrderReceiptItems_ta.value.split("\n");
		if(OrderReceiptTotals_ta.value != '')
		{
			for(var i = 0; i < items.length; i++)
			{
				if(items[i] != '') {prod_stats_send_params('OrderReceipt', encodeURIComponent(items[i]) + "|" + OrderReceiptTotals_ta.value);}
			}
		}
	}
	/*
	if(OrderReceiptTotals_ta != null)
	{
		params_arr = OrderReceiptTotals_ta.value.split("\n");
		for(var i = 0; i < params_arr.length; i++)
		{
			if(params_arr[i] != '') {prod_stats_send_params('OrderReceiptTotals', encodeURIComponent(params_arr[i]));}
		}
	}
	
	if(OrderReceiptItems_ta != null)
	{
		params_arr = OrderReceiptItems_ta.value.split("\n");
		for(var i = 0; i < params_arr.length; i++)
		{
			if(params_arr[i] != '') {prod_stats_send_params('OrderReceiptItems', encodeURIComponent(params_arr[i]));}
		}
	}
	*/
	
};


if (window.addEventListener) {
	window.addEventListener('load', prod_stats_count, false); 
} else if (window.attachEvent) { 
	window.attachEvent('onload', prod_stats_count);
}
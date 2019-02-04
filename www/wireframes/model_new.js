$(document).ready(function(){
	//hide the model results initially
	$('#model_out').hide();
	
	//hide the interstitial initially
	$('#building_inter').hide();
	$('#oem_results').hide();
	
	var model_persist = "";
	//on-input function to display data split message
	$("#data-split").on("input", function() {
		var train_split = $("#data-split").val();
		var test_split = 100 - train_split;
		$(".split_msg_out").html("")
		$(".split_msg_out").append("Your data will be split in the ratio " + train_split +"% training & "+test_split+ "% test");
	});
	
	//$( "#data-split" ).on("keydown", function( event ) {
	//	$(".split_msg_out").html("");
	//});
	
	$("#data-split").keyup(function(event) {
		if(event.keyCode == 8)
		{
			$(".split_msg_out").html("");
		}
	});
	
	//hide the model list and show the model results on click
	$("#show_perf").click(function() {
		$('#model_opt').hide();
		
		##Add function code
		
		$("#building_inter").show().delay(1000).fadeOut(100,showModelResults);
	});
	
	function showModelResults()
	{
		var model = $("input[name='radio']:checked").val();
		model_persist = model;
		$('#mod_nm').html('');
		//get the value from radio to display in the table
		$('#mod_nm').append(model);
		$('#model_out').show();
		if(model == "OEM")
		{
			$('#normal_results').hide()
			$('#oem_results').show()
		}
	}
	
	//hide the performance metrics and show the model selection
	$('#show_model_sel').click(function() {
		$('#model_opt').show();
		$('#model_out').hide();
		if(model_persist == "OEM")
		{
			$('#oem_results').hide()
			$('#normal_results').show()
			model_persist = "";
		}
	});
	
	$("#swap_right").click(function() {
		var left_selected =[];
		left_selected = $( "#left_box" ).val();
		console.log(left_selected);
		
		for (each in left_selected){
			var ele = left_selected[each]
			$("#right_box").append(new Option("Var "+ele, ele));
			$("#left_box option[value='"+ele+"']").remove();
		}
	});
	$("#swap_left").click(function() {
		var right_selected =[]
		right_selected = $( "#right_box" ).val();
		console.log(right_selected);
		
		for (each in right_selected){
			var ele1 = right_selected[each]
			$("#left_box").append(new Option("Var "+ele1, ele1));
			$("#right_box option[value='"+ele1+"']").remove();
		}
	});

	$(function () { 
		$('#varSel').multiselect({ 
			buttonText: function(options, select) {
				if (options.length === 0) {
					return 'None selected';
				}
				if (options.length === select[0].length) {
					return 'All selected ('+select[0].length+')';
				}
				else if (options.length >= 4) {
					return options.length + ' selected';
				}
				else {
					var labels = [];
					console.log(options);
					options.each(function() {
						labels.push($(this).val());
					});
					return labels.join(', ') + '';
				}
			}
		
		});
	});

});
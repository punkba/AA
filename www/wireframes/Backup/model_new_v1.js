$(document).ready(function(){
	
	$('#model_out').hide();
	$('#building_inter').hide();
	$('#oem_results').hide();
	
	$("#data-split").on("input", function() {
		var train_split = $("#data-split").val();
		var test_split = 100 - train_split;
		$(".split_msg_out").html("")
		$(".split_msg_out").append("Your data will be split in the ratio " + train_split +"% training & "+test_split+ "% test");
	});
	
	$("#data-split").keyup(function(event) {
		if(event.keyCode == 8)
		{
			$(".split_msg_out").html("");
		}
	});
	
	$(function () { 
		$('#varSel').multiselect({ 
			buttonText: function(options, select) {
				console.log(select[0].length);
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
	
	var model_persist = "";
	
	$("#show_perf").click(function() {
		$('#model_opt').hide();
		$("#building_inter").show().delay(1000).fadeOut(100,showModelResults);
	});
	
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
});
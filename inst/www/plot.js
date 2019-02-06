$(document).ready(function(){
	
	var selectedVar = '';
	
	$("#varProfileOptions a").on('click',function(){
		console.log($(this).text());
		selectedVar = $(this).text();
		$('#varDropdownMenuButton').html(selectedVar);
		
		/*
		var req = $('#plotdiv1').rplot('variable_profiling_function',{dv:dvname,var:selectedVar});
		
		req.fail(function(){
				alert("Server error: " + req.responseText);
		}); */
	});
});


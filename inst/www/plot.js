$(document).ready(function(){
	var dropDownSelect ='';
	
	$("#varProfileOptions a").on('click',function(){
		console.log($(this).text());
		dropDownSelect = $(this).text();
		$('#varDropdownMenuButton').html(dropDownSelect);
	});
});


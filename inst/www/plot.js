$(document).ready(function(){
	var dropDownSelect ='';
	
	$("#varProfileOptions").on('click','a',function(){
		console.log($(this).text());
		dropDownSelect = $(this).text();
		$('#varDropdownMenuButton').html(dropDownSelect);
	});
});


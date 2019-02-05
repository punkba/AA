$(document).ready(function(){
$('#varChangeLnk').hide();
//Get the variable list after uploading the data

function getUpdatedVariableList(){
	var checkBoxes = document.getElementById('discreteBox').elements;
	var elementList = new Array();
	
	for(var i=0;checkBoxes.length;i++)
	{
		var checkBoxObj = document.getElementById('Variable'+i);
		if(checkBoxObj.checked == true)
		{
			elementList.push(checkBoxObj.value);
		}
	}
	
	return elementList;
}

$('#varChangeBtn').on('click',function(){
	//Disable the button for the user
	$('#varChangeBtn').prop("disabled",true);
	//Get the list of variable names after updation by user for passing it to R

	/*var req = ocpu.call("fileName",
						{variable:getUpdatedVariableList()},
						function(session){
								session.getObject(function(full_output){
									document.getElementById('varChangeLnk').href = session.getFileURL(full_output[1]['fileName']);
								}).fail(
									function(){
										alert("Server error: " + req.responseText);
									}
								);
						});*/
	$('#varChangeLnk').show();
});

});
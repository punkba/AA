$(document).ready(function(){
$('#varChangeLnk').hide();
//Get the variable list after uploading the data



$('#varChangeBtn').on('click',function(){
	//Disable the button for the user
	$('#varChangeBtn').prop("disabled",true);
	//Get the list of variable names after updation by user for passing it to R
	
});

function initiatePreProcess(sessionData){
	var req = ocpu.call("preprocessing",
						{conv_var_names:checkedVars,
						fileContainer:sessionData},
						function(session){
								session.getObject(function(full_output){
									//document.getElementById('varChangeLnk').href = session.getFileURL(full_output[1]['fileName']);
									if(full_output[0] == 0)
									{
									$('#varChangeLnk').show();
									}
								}).fail(
									function(){
										alert("Server error: " + req.responseText);
									}
								);
						});
}
	
});
$(document).ready(function(){
$('#varChangeLnk').hide();
//Get the variable list after uploading the data



$('#varChangeBtn').on('click',function(){
	//Disable the button for the user
	$('#varChangeBtn').prop("disabled",true);
	initiatePreProcess();
	//Get the list of variable names after updation by user for passing it to R
	
});
});

function initiatePreProcess(){
	/*var req = ocpu.call("preprocessing",
						{conv_var_names:checkedVars},
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
						});*/
						$('#varChangeLnk').show();
						
						var reqVarImp = $("#plotdiv").rplot('top_var_graph',{'target.var.name':dvname,
																			 'ds': ds}
													       )
													 .fail(function()
														    {
																alert("Server error: " + reqVarImp.responseText);
															})
													  .always(function(){
														  console.log('plotted varImp');
													  });
						var reqVarList = ocpu.call('imp_var_list',
												   {'target.var.name':dvname},
												   function(session){
														session.getObject(function(output){
														tempOut1 = output;
														populateDropList(output);   
													   }).fail(function()
														    {
																alert("Server error: " + reqVarImp.responseText);
															}).always(function(){
																console.log('plotted varImp');
															})
												   });
}

var tempOut1='';
var dropDownSelect ='';
function populateDropList(dataInput){
	for (var i=0; i < dataInput.length;++i)
	{
		$("#varProfileOptions").append('<a class="dropdown-item" href="#" onclick="updateSelectDropdown()">'+dataInput[i]+"</a>");
	}
}

function updateSelectDropdown(){
	console.log($(this).text());
	dropDownSelect = $(this).text();
	$('#varDropdownMenuButton').html(dropDownSelect);
}
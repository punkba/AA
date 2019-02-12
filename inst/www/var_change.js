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
														/* Plot the variable profile by default for the first variable  in 
															the dropdown*/
														plotProfilingGraph(output[0]);
														populateDropList(output);
													   }).fail(function()
														    {
																alert("Server error: " + reqVarImp.responseText);
															}).always(function(){
																console.log('populateDropList');
															})
												   });
}

var tempOut1='';

function populateDropList(dataInput){
	for (var i=0; i < dataInput.length;++i)
	{
		$("#varProfileOptions").append("<a class='dropdown-item' href='#'>"+dataInput[i]+"</a>");
	}
}

function plotProfilingGraph(variableName){
	var reqProfileInitGraph = $('#plotdiv1').rplot('variableProfilingFunction',
												  {'dv':dvname,'vars':variableName})
											.fail(
												function()
													{
														alert("Server error: " + reqVarImp.responseText);
													}
											)
											.always(
												function(){
													console.log('plotted varImp');
												}
											);
}
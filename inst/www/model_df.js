$(document).ready(function(){	

	//hide the model results initially
	$('#model_out').hide();
	
	//hide the interstitial initially
	$('#building_inter').hide();
	$('#oem_results').hide();
	$('#modelDownload').hide();
	$('#lrEqn').hide();
	
	var model_persist = "";
	var varImpData = "";
    var modelLink = "";
	var output = "";
	var modelSummaryPath="";
	
$("#show_perf").on("click", function(){
    
	//alert("inside Ensemble Model....");
	
	    $("#show_perf").attr("disabled", "disabled");  
		
		$('#model_opt').hide();
		
		$('#building_inter').show();
	  
	   $("#building_inter").text("Setting up Train & Test...");
	   
	   
	
	//Check which model is selected
	var dvname=$("#dvname").val()
	var preddv=$("#preddv").val()
	
	var isChecked="";
	
	if($('#LR').prop('checked')==true)
		{
		 isChecked="LR"
		} else if($('#RF').prop('checked')==true)
		{
		 isChecked="RF"
		} else if($('#SVM').prop('checked')==true)
		{
		 isChecked="SVM"
		} else if($('#GBM').prop('checked')==true)
		{
		 isChecked="GBM"
		} else if($('#NB').prop('checked')==true)
		{
		 isChecked="NB"
		} else if($('#NNET').prop('checked')==true)
		{
		 isChecked="NNET"
		}
		else if($('#OEM').prop('checked')==true)
		{
		 isChecked="OEM"
		}
		
		$('#building_inter').show();
	    $("#building_inter").text("Training the Model... Will be ready in a jiffy!");
		
		//alert(isChecked);		
		//$('#building_inter').hide();
		//$('#model_out').show();
		//$('#normal_results').show();
		//var table = document.getElementById("results_table").tBodies[0];
		//alert("1");
		//table.rows[0].cells[0].innerHTML=isChecked;
		//table.rows[0].cells[1].innerHTML=output[1];
		//table.rows[0].cells[2].innerHTML=output[2];
		//table.rows[0].cells[3].innerHTML=output[3];
		//table.rows[0].cells[4].innerHTML=output[4];
		
			//Signififcant Variable List
			
			//sig_var=["hi","hello"]
			//for (var i=0; i < sig_var.length;++i)
			//	{	
			//		var node = document.createElement("LI");           		// create the a <li> node			
			//		var textnode = document.createTextNode(sig_var[i]);         // Create a text node
			//		node.appendChild(textnode);                              // Append the text to <li>
			//		document.getElementById("sig_list").appendChild(node);     // Append <li> to <ul> with id="myList"
			//	}
				
		
		
		//alert(isChecked);

//alert(dvname);	alert(isChecked);alert(preddv);
    //perform the request
	function prepareVarImpData(listInp){
		
		varImpData = [['Variable Name','Variable Importance']];
		
		for(var i =0;i<listInp.length;i++){
			var obsArray = [];
			obsArray.push(listInp[i]["var_names"],listInp[i]["Overall"]);
			varImpData.push(obsArray);
		}
	}
	
	function drawVarImpPlot(chartData)
	{
		google.charts.load("current", {packages:["corechart"]});
		google.charts.setOnLoadCallback(drawChart);
		function drawChart(){
			var data = google.visualization.arrayToDataTable(chartData);
			var options = {
				title: "Variable Importance",
				width:600,
				height:400,
				bar: {groupWidth: "15%"},
				legend: {position:"none"},
			};
			var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
			chart.draw(data, options);
		}
	}
	
	
	
	function contructLREQN(eqnData){
		
		var eqn = "logit(p) = ";
		
		for(var i =0;i<eqnData.length;i++){	
			eqn = eqn + eqnData[i]["Estimate"] +' * '+ eqnData[i]["vars"] +' + ' 
		}
		eqn = eqn.slice(0,-2);
		document.getElementById('eqnBox').innerHTML = eqn;
		$('#lrEqn').show();
	}
	
	function processLROutput(lists){
		modelLink = lists[1]["modelSaveLocation"].toString();
		output = lists[4]["metricOutput"].flat();
		prepareVarImpData(lists[3]["variables"]);
		modelSummaryPath = lists[5]["summaryPath"].toString();
		
		document.getElementById('modelLk').innerHTML= 'Find your saved model @ '+modelLink;
		
		//call functions to populate the results
		drawVarImpPlot(varImpData);
		$('#modelDownload').show();
		contructLREQN(lists[2]["modelCoeff"]);
	}
	
    var req = ocpu.call("modelling_module", {
      "DV" : dvname, "model_selection" :  isChecked, "predictorClass" : preddv
    }, function(session){
		session.getObject(function(full_output){	
			$("#building_inter").show().delay(1000).fadeOut(100,showModelResults);
			
			console.log(full_output);
			if(full_output[0]["modelName"] == 'lr')
			{
				processLROutput(full_output);
			}
			
			console.log(modelLink);
			console.log(output);
			console.log(varImpData);
			console.log(modelSummaryPath);
			
			/*var sig_var=full_output[0]
			var output=full_output[1]
			
			alert(isChecked);
			alert(full_output);
			
			if(isChecked=="OEM")
			{	
				var table = document.getElementById("results_table").tBodies[1];
				var cur_op=output[1];
				table.rows[0].cells[1].innerHTML=cur_op[0];
				table.rows[0].cells[2].innerHTML=cur_op[1];
				table.rows[0].cells[3].innerHTML=cur_op[2];
				table.rows[0].cells[4].innerHTML=cur_op[3];
				table.rows[0].cells[5].innerHTML=cur_op[4];
				var cur_op=output[2];
				table.rows[0].cells[1].innerHTML=cur_op[0];
				table.rows[0].cells[2].innerHTML=cur_op[1];
				table.rows[0].cells[3].innerHTML=cur_op[2];
				table.rows[0].cells[4].innerHTML=cur_op[3];
				table.rows[0].cells[5].innerHTML=cur_op[4];
				var cur_op=output[3];
				table.rows[0].cells[1].innerHTML=cur_op[0];
				table.rows[0].cells[2].innerHTML=cur_op[1];
				table.rows[0].cells[3].innerHTML=cur_op[2];
				table.rows[0].cells[4].innerHTML=cur_op[3];
				table.rows[0].cells[5].innerHTML=cur_op[4];
				var cur_op=output[4];
				table.rows[0].cells[1].innerHTML=cur_op[0];
				table.rows[0].cells[2].innerHTML=cur_op[1];
				table.rows[0].cells[3].innerHTML=cur_op[2];
				table.rows[0].cells[4].innerHTML=cur_op[3];
				table.rows[0].cells[5].innerHTML=cur_op[4];
			}
			else
			{	*/
				var table = document.getElementById("results_table").tBodies[0];
				//alert(isChecked,table.rows[0].cells[0].innerHTML);
				console.log(isChecked)
				table.rows[0].cells[0].innerHTML=isChecked;
				
				table.rows[0].cells[1].innerHTML=output[0];
				table.rows[0].cells[2].innerHTML=output[1];
				table.rows[0].cells[3].innerHTML=output[2];
				table.rows[0].cells[4].innerHTML=output[3];
				table.rows[0].cells[5].innerHTML=output[4];
				//var row = table.insertRow(0);
				//var cell1 = row.insertCell(0);
				//var cell2 = row.insertCell(1);
				//cell1.innerHTML = "NEW CELL1";
				//cell2.innerHTML = "NEW CELL2";
			//}
			
			/*alert(sig_var.length);
			//Signififcant Variable List
			for (var i=0; i < sig_var.length;++i)
				{					
					var node = document.createElement("LI");           		// create the a <li> node
					var textnode = document.createTextNode(sig_var[i]);         // Create a text node
					node.appendChild(textnode);                              // Append the text to <li>
					document.getElementById("sig_list").appendChild(node);     // Append <li> to <ul> with id="myList"
				}*/
				
				
			//plot_rocr_graph();
			
		
			//get results and display
			$("#building_inter").text("Model Completed! Go check the results now");
		    }).fail(function(){
			alert("Server error: " + req.responseText);
			});  
    });
    
    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    
    //after request complete, re-enable the button 
    req.always(function(){
      $("#show_perf").removeAttr("disabled")
    });   

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
  
  
			//Adding Code for ROCR
				function plot_rocr_graph()
			{
				//alert("inside Plot graph");
				
				//var req = $("#plotdiv1").rplot("randomplot", {	nfield : 100, distfield : "normal"})
				
				var req = $("#plotdiv2").rplot("load_graph");
				
				alert("plotted");
				
				//if R returns an error, alert the error message
				req.fail(function(){
				alert("Server error: " + req.responseText);
				});
				
				//after request complete, re-enable the button 
				req.always(function(){
				$("#submitbutton").removeAttr("disabled")
				});
				//alert("plotted");
			}
  

  });


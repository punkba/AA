output='';
sessionS='';
$(document).ready(function(){

	//hide the model results initially
	$('#show_model_sel').hide();
	$('#ResultsTab').hide();


	//hide the interstitial initially
	$('#building_inter').hide();

	var model_persist = "";
	var varImpData = "";
    var modelLink = "";
	var modelSummaryPath="";

	$("#show_perf").on("click", function(){
		$("#show_perf").attr("disabled", "disabled");
		$('#model_opt').hide();
		$('#building_inter').show();
		$("#building_inter").text("Setting up Train & Test...");

		//Check which model is selected
		var dvname=$("#dvname").val();
		var preddv=$("#preddv").val();

		var isChecked="";

		if($('#LR').prop('checked')==true)
		{
		 isChecked="LR"
		}
		else if($('#RF').prop('checked')==true)
		{
	 		isChecked="RF"
		}
		else if($('#SVM').prop('checked')==true)
		{
			isChecked="SVM"
		}
		else if($('#GBM').prop('checked')==true)
		{
			isChecked="GBM"
		}
		else if($('#NB').prop('checked')==true)
		{
	 		isChecked="NB"
		}
		else if($('#NNET').prop('checked')==true)
		{
	 		isChecked="NNET"
		}
		else if($('#OEM').prop('checked')==true)
		{
	 		isChecked="OEM"
		}

		$('#building_inter').show();
    	$("#building_inter").text("Training the Model... Will be ready in a jiffy!");

		var modelReq = ocpu.call("modelling_module",
								{
									"DV" : dvname,
							 		"model_selection" : isChecked,
									"predictorClass" : preddv
    							},
								function(session)
								{
									sessionS = session;
									getResultChartsAndDisplay(session);
									session.getObject(function(dataOutput){
										$("#building_inter").text('Model Trained !! Check next page for results');
										console.log(dataOutput);
										populateResults(dataOutput);
										$('#show_model_sel').show();
										$('#building_inter').removeClass('lds-dual-ring');
										$('#ResultsTab').show();
									}).fail(function(){});
								}).fail(function(){
									alert("Server error: " + modelReq.responseText);
								}).always(function(){
									$("#show_perf").removeAttr("disabled")
								});

		function populateResults(sessionData){
			populateConfusionMatrix(sessionData[3]['metricOutput'].flat());
			drawVarImpPlot(prepareVarImpData(sessionData[2]['variables']));
		}

		function getResultChartsAndDisplay(session){
			var base_url = session.getLoc();
			var url = base_url +'graphics/2';
			$("#liftChart").attr('src',url);
		}

		function populateConfusionMatrix(ConfuseData){
			$('#TP').html(ConfuseData[0]*100+' %');
			$('#FP').html(ConfuseData[1]*100+' %');
			$('#TN').html(ConfuseData[2]*100+' %');
			$('#FN').html(ConfuseData[3]*100+' %');
		}

		function prepareVarImpData(listInp){
			varImpData = [['Variable Name','Variable Importance', {type: 'string', role: 'annotation'}]];

			for(var i =0;i<listInp.length;i++){
				var obsArray = [];
				obsArray.push(listInp[i]["var_names"],listInp[i]["Overall"],''+listInp[i]["Overall"]);
				varImpData.push(obsArray);
			}

			return varImpData;
		}

		function drawVarImpPlot(chartData)
		{
			google.charts.load("current", {packages:["corechart",'bar']});
			google.charts.setOnLoadCallback(drawChart);
			function drawChart(){
				var data = google.visualization.arrayToDataTable(chartData);
				var options = {
					title: "Variable Importance",
					annotations: {
          				alwaysOutside: true,
          				textStyle: {
			            	fontSize: 12,
			            	auraColor: 'none',
			            	color: '#555'
			        	},
						boxStyle: {
			            	stroke: '#ccc',
			            	strokeWidth: 1,
			            	gradient: {
			            		color: '#f3e5f5',
			                	x: '0%', y: '0%'
			            	}
			        	},
						hAxis: {
          					title: 'Importance Score'
        				},
			        	vAxis: {
			          		title: 'Variables'
				  		},
						width:700,
						height:500,
						bar: {groupWidth: "50%"},
						legend: {position:"none"}
					}
				};
				var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
				chart.draw(data, options);
			}
		}


		function processLROutput(lists){
			modelLink = lists[1]["modelSaveLocation"].toString();
			output = lists[4]["metricOutput"].flat();
			prepareVarImpData(lists[3]["variables"]);
			modelSummaryPath = lists[5]["summaryPath"].toString();

			//call functions to populate the results
			drawVarImpPlot(varImpData);
			$('#modelDownload').show();
			contructLREQN(lists[2]["modelCoeff"]);
			constructVarOdds(lists[2]["modelCoeff"]);
		}

		//hide the performance metrics and show the model selection
		$('#show_model_sel').click(function() {
			$('#model_opt').show();
			$('#building_inter').hide();
		});
  	});
});

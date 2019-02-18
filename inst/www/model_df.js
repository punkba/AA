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
									"model_selection" : isChecked,
									"predictorClass" : preddv,
									"dv" : dvname
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
			populateConfusionMatrix(sessionData[2]['metricOutput'].flat());
			$('#modelDownloadLink').attr('href',session.getFileURL(sessionData[1]['modelSaveLocation'][0]));
			/*drawVarImpPlot(prepareVarImpData(sessionData[2]['variables']));*/
		}

		function getResultChartsAndDisplay(session){
			var base_url = session.getLoc();
			var url = base_url +'graphics/2';
			$("#liftChart").attr('src',url);
		}

		function populateConfusionMatrix(ConfuseData){
			$('#TP').html((ConfuseData[0]*100).toPrecision(4));
			$('#FP').html((ConfuseData[1]*100).toPrecision(4));
			$('#TN').html((ConfuseData[2]*100).toPrecision(4));
			$('#FN').html((ConfuseData[3]*100).toPrecision(4));
		}

		/*function prepareVarImpData(listInp){
			varImpData = [['Variable Name','Variable Importance', {type: 'string', role: 'annotation'}]];

			for(var i =0;i<listInp.length;i++){
				var obsArray = [];
				obsArray.push(listInp[i]["var_names"],listInp[i]["Overall"],''+listInp[i]["Overall"]);
				varImpData.push(obsArray);
			}

			return varImpData;
		}*/

		/*function drawVarImpPlot(chartData)
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
						chartArea:{
						    left:10,
						    top: 5,
						    width: '100%',
						    height: '100%'
						},
						bar: {groupWidth: "50%"},
						legend: {position:"none"}
					}
				};
				var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
				chart.draw(data, options);
			}
		}*/

		//hide the performance metrics and show the model selection
		$('#show_model_sel').click(function() {
			$('#model_opt').show();
			$('#building_inter').hide();
		});
  	});
});

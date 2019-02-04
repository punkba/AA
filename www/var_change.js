$(document).ready(function(){
$('#varChangeLnk').hide();
//Get the variable list after uploading the data


var categorical = ;
var continuous = '';
var discrete = '';

function getAndDisplayVariables(listInput){
	categorical = listInput[1]['categorical'];
	continuous = listInput[2]['continuous'];
	discrete = listInput[3]['discrete'];
	
	//create the lsit elements to display continuous variables
	for(elem = 0;elem < categorical.length;elem++){
		createList(categorical[elem],'#cate-list');
	}
	
	//create the lsit elements to display continuous variables
	for(elem = 0;elem < continuous.length;elem++){
		createList(continuous[elem],'#conte-list');
	}
	
	//create checkbox to convert discrete to categorical
	for(elem = 0;elem < discrete.length;elem++){
		createCheckBox(discrete[elem],elem);
	}
}

function createList(value,locToCreate){
	var node = document.createElement("LI");           		
	var textnode = document.createTextNode(sig_var[i]);
	node.appendChild(textnode);
	document.getElementById(locToCreate).appendChild(node);
}

function createCheckBox(value,elem){
	var chk = document.createElement('input');  // CREATE CHECK BOX.
    chk.setAttribute('type', 'checkbox');       // SPECIFY THE TYPE OF ELEMENT.
    chk.setAttribute('id', 'Variable'+elem);     // SET UNIQUE ID.
    chk.setAttribute('value', value);
    chk.setAttribute('name', 'variables');
	
	var lbl = document.createElement('label');  // CREATE LABEL.
    lbl.setAttribute('for', value + ' Box');

    // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
    lbl.appendChild(document.createTextNode(obj.value));
	
	discreteBox.appendChild(chk);
	discreteBox.appendChild(lbl);
	
	value = '';
}

function getUpdatedVariableList(){
	var checkBoxes = document.getElementById('discreteBox').elements;
	var updatedDiscrete = '';
	
	for(var i=0;checkBoxes.length;i++)
	{
		var checkBoxObj = document.getElementById('Variable'+i);
		if(checkBoxObj.checked == true)
		{
			categorical.push(checkBoxObj.value);
		}
		else
		{
			updatedDiscrete.push(checkBoxObj.value)
		}
	} 
		
	var finalOutput  = finalOutput.push(continuous);
	finalOutput.push(categorical);
	finalOutput.push(updatedDiscrete);
}

$('#varChangeBtn').on('click',function(){
	//Disable the button for the user
	$('#varChangeBtn').prop("disabled",true);
	
	//Get the list of variable names after updation by user for passing it to R
	
	
	var req = ocpu.call("fileName",{},function(session){});
	$('#varChangeLnk').show();
});

});
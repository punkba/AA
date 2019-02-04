('#varChangeLnk').hide();
//Get the variable list after uploading the data

function getAndDisplayVariables(listInput){
	categorical = listInput[1]['categorical']
	continuous = listInput[2]['continuous']
	discrete = listInput[3]['discrete']
	
	//create the lsit elements to display continuous variables
	for(elem = 0;elem < categorical.length;elem++){
		createCheckBox(categorical[elem],'#cate-list');
	}
	
	//create the lsit elements to display continuous variables
	for(elem = 0;elem < continuous.length;elem++){
		createCheckBox(continuous[elem],'#conte-list');
	}
	
	//create checkbox to convert discrete to categorical
	for(elem = 0;elem < discrete.length;elem++){
		createCheckBox(discrete[elem]);
	}
	
}

function createList(value,locToCreate){
	var node = document.createElement("LI");           		
	var textnode = document.createTextNode(sig_var[i]);
	node.appendChild(textnode);
	document.getElementById(locToCreate).appendChild(node);
}

function createCheckBox(value){
	var chk = document.createElement('input');  // CREATE CHECK BOX.
    chk.setAttribute('type', 'checkbox');       // SPECIFY THE TYPE OF ELEMENT.
    chk.setAttribute('id', value + ' Box');     // SET UNIQUE ID.
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


('#varChangeBtn').on('click',function(){
	('#varChangeBtn').
	
});
/*
var req = ocpu.call("fileName",{
	
})*/
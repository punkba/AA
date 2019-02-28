$(document).ready(function(){

    console.log('In scoring');
    $('#scoreDownloadLink').hide();

    $('#submitbutton2').on('click',function(){
        scoreFileName = $("#uploadFile2")[0].files[0];

        if(!scoreFileName){
            alert("No file selected.");
            return;
        }
        console.log('In scoring clicked');
        $("#status2").text("Reading the CSV...")
        $("#status2").addClass("lds-dual-ring");

        uploadcsv2(scoreFileName);
    });

    function uploadcsv2(inputFileName){

        $("#submitbutton2").attr("disabled", "disabled");

        var req = ocpu.call("scoringmodule", {
            filename : inputFileName
        }, function(session){
            $('#scoreDownloadLink').attr('href',session.getFileURL('scoredData.csv'));
            $('#scoreDownloadLink').show();
        }).fail(function(){
          alert("Server error: " + req.responseText);
        }).always(function(){
          $("#submitbutton").removeAttr("disabled");
        });
    }
});

$(document).ready(function(){

    console.log('In scoring');
    $('#scoreDownloadLink').addClass('disabled');

    $('#submitbutton2').on('click',function(){
        scoreFileName = $("#uploadFile2")[0].files[0];

        if(!scoreFileName){
            alert("No file selected.");
            return;
        }
        console.log('In scoring clicked');
        $("#status1").text("Reading the CSV...")
        $("#status1").addClass("lds-dual-ring");

        uploadcsv2(scoreFileName);
    });

    function uploadcsv2(inputFileName){

        $("#submitbutton2").attr("disabled", "disabled");

        var req = ocpu.call("scoringmodule", {
            filename : inputFileName
        }, function(session){
            $('#scoreDownloadLink').attr('href',session.getFileURL('scoredData.csv'));
            $('#scoreDownloadLink').removeClass('disabled');
            $("#status1").text("Dataset Scored, Click to Download !!")
            $("#status1").removeClass("lds-dual-ring");
        }).fail(function(){
          alert("Server error: " + req.responseText);
        }).always(function(){
          $("#submitbutton").removeAttr("disabled");
        });
    }
});

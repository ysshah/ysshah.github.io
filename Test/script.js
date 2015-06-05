$(document).ready(function(){

    $.ajax({
        type: "GET",
        url: "file.txt",
        dataType: "text",
        success: function(data) {alert(data);}
     });
    
//    console.log(xmldoc);
    
});

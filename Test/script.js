$(document).ready(function(){

    xmlhttp = new XMLHttpRequest()
    xmlhttp.open("GET", "file.txt", true);
    xmlhttp.send();
    xmldoc = xmlhttp.responseXML;
    
    console.log(xmldoc);
    
});

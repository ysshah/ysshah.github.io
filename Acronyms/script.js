$(document).ready(function(){

    for (var i = 0; i < acronyms.length; i++) {
        var acr = acronyms[i];
        var sep = definitions[acr].split("|");
        var name = sep[0], desc = sep[1];
        var link_address = sep[2], link_name = sep[3] ? sep[3] : "More Info";
        var link = link_address ?
            "<a href='"+link_address+"' target='_blank'>"+link_name+"</a>"
            : "";

        $("#results").text(acronyms.length + " results");

        $("#output").append(
            "<div class='container'><div class='acronym'>"
            +acr+"</div><div class='definition'><div class='title'>"
            +name+"</div><div class='link'>"+link+"</div><div class='description'>"
            +desc+"</div></div></div>");
    };
    
    $("div#output").on("click", "div.inlink", function(){
        $("html, body").animate({
            scrollTop: "0px"
        }, "fast");
        $("#input").val($(this).text());
        query();
        $("#input").focus();
    });
    
    function query(){
        first = null;
        $("#output").empty();
        var q = $("#input").val();
        var regex = new RegExp(
            q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");
        var acr_matches = $.grep(acronyms, function(n, i){
            return n.match(regex) != null;
        });
        var title_matches = $.grep(acronyms, function(n, i){
            return definitions[n].split("|")[0].match(regex) != null
                && n.match(regex) == null;
        });
        var desc_matches = $.grep(acronyms, function(n, i){
            return definitions[n].split("|")[1].replace(/<.+?>/g," ")
                .match(regex) != null && n.match(regex) == null
                && definitions[n].split("|")[0].match(regex) == null;
        });

        var numResults = acr_matches.length + title_matches.length
                         + desc_matches.length
        var resString = (numResults == 1) ? " result" : " results"
        $("#results").text(numResults + resString);

        if (numResults == 0) {
            $("#output").append("<a class='search' target='_blank' href='http://en.wikipedia.org/w/index.php?search=" + q + "'>Search Wikipedia for \""+q+"\"?</a><a class='search' target='_blank' href='https://www.google.com/search?q="+q+"'>Search Google for \""+q+"\"?</a>");
        };

        highlightAndAppend(acr_matches, q, regex, "acr");
        highlightAndAppend(title_matches, q, regex, "title");
        highlightAndAppend(desc_matches, q, regex, "desc");
    };

    $("#input").keyup(function(e){
        if (e.keyCode != 13 && e.keyCode != 16) {
            query();
        };
    });

    function highlightAndAppend(matches, q, regex, s) {
        for (var i = 0; i < matches.length; i++) {
            var acr = matches[i];
            var sep = definitions[acr].split("|");
            var title = sep[0], desc = sep[1];
            var link_address = sep[2], link_name = sep[3] ? sep[3] : "More Info";

            switch(s) {
                case "acr":
                    acr = highlight(regex, acr, q);
                    break;
                case "title":
                    title = highlight(regex, title, q);
                    break;
                case "desc":
                    desc = highlight(regex, desc, q);
                    break;
            }

            append(acr, title, link_address, link_name, desc);
        };
    };

    function highlight(regex, part, q) {
        var j = regex.exec(part).index;
        return part.slice(0, j) + "<div class='highlight'>"
            + part.slice(j, j + q.length)
            + "</div>" + part.slice(j + q.length);
    }

    function append(acr, title, link_address, link_name, desc) {
        var link = link_address ?
            "<a href='"+link_address+"' target='_blank'>"+link_name+"</a>"
            : "";

        $("#output").append(
            "<div class='container'><div class='acronym'>"
            +acr+"</div><div class='definition'><div class='title'>"
            +title+"</div><div class='link'>"+link+"</div><div class='description'>"
            +desc+"</div></div></div>");
    };

    var first = null;

    $("#input").keydown(function(e){
        if (e.keyCode == 13) {
            if (!e.shiftKey && first && first.is(".container:last-child")
                || e.shiftKey && !first) {
                return;
            } else if (!e.shiftKey && !first) {
                first = $(".container:first-child");
            } else if (!e.shiftKey) {
                first = first.next();
            } else if (e.shiftKey && first.is(".container:first-child")) {
                first = null;
            } else if (e.shiftKey) {
                first = first.prev();
            };
            var offset = first ? first.offset().top : 0;
            $("html, body").animate({
                scrollTop: offset + "px"
            }, "fast");
        };
    });
    
    $("#menu").click(function(){
        $("#dimmer").fadeIn(400, function(){
            $("#submit-wrapper").fadeIn(400, function() {
                $("#submit-acr").focus();
            });
        });
    });
    
    $("#cancel, #close").click(function(){
        closeAndClear();
    });
    
    function closeAndClear() {
        $("#submit-acr, #submit-name").css("border-color", "rgba(0,0,0,0.1)");
        $("#submit-wrapper").fadeOut(400, function(){
            $("#dimmer").fadeOut(400);
            $(".submit").val("");
            $("#submit-content").show();
            $("#thanks-content").hide();
            $("#submit-wrapper").css({
                "margin-top":"-270px",
                "height":"540px"
            });
        });
    };
    
    $("#submit-acr, #submit-name").focusout(function(){
        if ($(this).val()) {
            $(this).css("border-color", "rgba(0,0,0,0.1)");
        } else {
            $(this).css("border-color", "rgb(255,0,0)");
        }
    });

    $("#submit-acr, #submit-name").focusin(function(){
        $(this).css("border-color", "rgba(0,0,0,0.1)");
    });

    $("#submit-link, #submit-link-desc").focusout(function(){
        if ($("#submit-link").val() && !$("#submit-link-desc").val()) {
            $("#submit-link-desc").css("border-color","red");
        } else if ($("#submit-link-desc").val() && !$("#submit-link").val()) {
            $("#submit-link").css("border-color","red");
        };
    });
    
    $("#submit-link, #submit-link-desc").focusin(function(){
        $("#submit-link, #submit-link-desc").css("border-color", "rgba(0,0,0,0.1)");
    });

    $("#submit").click(function(){
        var error = false;
        if (!$("#submit-acr").val()) {
            $("#submit-acr").css("border-color","red");
            error = true;
        };
        if (!$("#submit-name").val()) {
            $("#submit-name").css("border-color","red");
            error = true;
        };
        if ($("#submit-link").val() && !$("#submit-link-desc").val()) {
            $("#submit-link-desc").css("border-color","red");
            error = true;
        } else if ($("#submit-link-desc").val() && !$("#submit-link").val()) {
            $("#submit-link").css("border-color","red");
            error = true;
        };
        if (!error) {
            var email = "acronymsubmissions@gmail.com";
            
            var acr = $("#submit-acr").val();
            var name = $("#submit-name").val();
            var desc = $("#submit-desc").val();
            var link = $("#submit-link").val();
            var link_desc = $("#submit-link-desc").val();
            
            var mailto = "mailto:" + email + "?subject=NewTerm&body="
                + encodeURIComponent(acr + "\n" + name + "\n"
                                     + desc + "\n" + link + "\n"
                                     + link_desc);
            document.location.href = mailto;
            $("#submit-content").fadeOut();
            $("#submit-wrapper").animate({
                height: "200px",
                marginTop: "-100px",
            }, 400, function() {
                $("#thanks-content").fadeIn();
            });
        };
    });

});

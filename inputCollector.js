// Process to collect deep linking strings from a user and parse them into JSON
// In the future this may be replaced by something that extracts the strings from the Word Doc directly.

'use strict';



var NUC;
var qstringTitle;
var qstringAuthor;
var qstringAuthorTitle;
var qstringISSN;
var qstringISBN;
var stringset = {};


//main
$(document).ready(function(){
    $('#announce-header').text("query strings plz").fadeIn().delay(500).fadeOut();
    $('#queryStringForm').fadeIn();

    $("#extractBaseURL").click(function(){
        stringset.Title = $('#titleQueryField').val();
        var authorTitle = $('#authortitleQueryField').val();
        if(authorTitle !=="optional" && authorTitle.trim() !== "") {
            stringset.AuthorTitle = authorTitle;
        }
        stringset.ISBN = $('#isbnQueryField').val(); // (C) I can see why even this would be much faster done as a template.
        stringset.ISSN = $('#issnQueryField').val();
        //$("#queryStringForm").delay(10).fadeOut();
        //$("#announce-header").text("KTHNX").fadeIn().delay(50).fadeOut.text("");
        // Fade in post check form
        $("#extractBaseURL").before('<div id="baseURLcontainer" hidden><label style="font">BaseURL</label></br> \n  <input id="computedBaseURL" type="text"> </div>');
        $("#computedBaseURL").val(extractBaseURL(stringset)).parent().fadeIn(); // this reference may need to be unmade at some stage
        $("#processISBN").fadeIn();

    });

    $("#processISBN").click(function(){
        $('#isbnQueryField').val(subOutISBN(stringset));
    })

});




    // Helper function that checks for empty strings.
function stringIsEmpty(a) {
    return (a.length === 0 || !a.trim());
};



    function TestMockStringSet() {
        window.mockstringset = {
            Title: "https://www.afishwithahat/search?&title=gone+fishing",
            AuthorTitle: "https://www.afishwithahat/search?&title=gone+fishing&author=barry+drake",
            ISBN: "https://www.afishwithahat/search?&IBSN=1234167899",
            ISSN: "https://www.afishwithahat/search?&ISSN=1234-144x"
        }
    }

    //0.1 collect the strings supplied by the user


         // bring in query string forms





    // 1.x  Extract first common substring from provided query strings; Most likely the Base URL **WORKS**

    function extractBaseURL(stringset) {
        var lastcommonindex = Infinity;
        var keys = Object.values(stringset);
        var i = 0;
        var j = 0;
        var k;
        var lCI = Infinity;
        for (i=0; i < keys.length; i++) {
            var currcheck = keys[i];
            for (j=0; j < keys.length; j++) {
                if ((i !== j)&&(keys[i] && keys[j]) && !(stringIsEmpty(currcheck) || stringIsEmpty(keys[j]))) {
                    k = findFirstDiffPos(currcheck, keys[j])
                    if (k < lCI) lCI = k;
                }
            }
        }

        for (i = 0; i < keys.length; i++){
            if(!stringIsEmpty(keys[i])){
                return keys[i].substring(0, lCI);
            }
         // If you reach this point, every string submitted was blank
            return "";
        }

// TODO: Optimize by preventing the same string from being checked twice.
    }


    //2.x Process IBSN string by replacing any sequence of 10 or more  digits with $$ISBN$$  **WORKS**
    function subOutISBN(stringset){
        if(stringset.ISBN){
          var s = stringset.ISBN;
          s = s.replace(/%20\d{13}/,'%20$$$ISBN$$$');
            s = s.replace(/%20\d{10}/,'%20$$$ISBN$$$');
          s = s.replace(/\d{13}/g,'$$$ISBN$$$');
          s = s.replace(/\d{10}/g,'$$$ISBN$$$');
            return s;
        }
        return stringset.ISBN;
}

    //3.x Process ISSN string by replacing any sequence of 4 digits joined by a dash to 4 other digits. OR 4 digits joined by a dash to 3 digits followed by an 'x';

    function subOutISSN(stringset){
        if(stringset.ISSN){
            var s = stringset.ISSN;
            s = s.replace(/\d{4}-\d{4}/g,'$$$ISSN$$$');
            s = s.replace(/\d{4}-\d{3}x/g,'$$$ISBN$$$');
            return s;
        }
    }

    //4.x Process the title string by asking the user to find the title.



    //5.x Process the title+author string by asking the user to find the title and author strings respectively.



    function findFirstDiffPos(a, b) {
        var i = 0;
        if (a === b) return -1;
        while (a[i] === b[i]) i++;
        return i;
    }


//})();


//(function() {  // Main


function borrowSpaceCodes(str){ // currently horrendously tightly coupled
        var indicies = [];
        var index = str.indexOf("%20");
        var i=0;
        var result = {};
        while(index !== -1){
            indicies.push(index + i*3);
            str = str.replace("%20","");
        }
        result.string = str;
        result.indicies = indicies;
        return result;
}





//})();

// Remember to put this behavior back into a function call when you want to start.



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

    stepOnePrompts();
    // stepTwoPrompts(); - not implemented yet
    //stepThreePrompts();
    //stepFourPrompts(); - not implemented yet


});

function stepOnePrompts(){

    var $step1UI = $("#Step1UI").fadeIn().find("i").fadeOut();

  $("#NUCsubmitButton").click(function () {
      NUC = $("#NUCinput").val();
      var NUCholder = {NUC_symbol:NUC};
      var NUCExists;
      $.get("/someendpoint",NUCholder).done(function (response) {
          NUCExists = true;
          $step1UI.find(".tick").fadeIn();
          // IF NUC EXISTS BACKEND WILL RETURN AN OK STATUS, OTHERWISE IT WILL RETURN 404 NOT FOUND
      }).fail(function () { NUCExists = false;
          $step1UI.find(".cross").fadeIn();});
  });
}


function stepThreePrompts() {
    // Ask user for Query strings - needs improvement
    $('#announce-header').text("query strings plz").fadeIn().delay(500).fadeOut();
    // First UI elements appear
    $('#queryStringForm').delay(900).fadeIn();

    // STEP 3-1: To be fired after all strings are populated(not currently enforced) Populates a new form field with the first common substring of the other fields.
    // This triggers the harvesting of the queryStrings from the fields and into the stringset object.
        $("#extractBaseURL").click(function(){
            stringset.Title = $('#titleQueryField').val();
            var authorTitle = $('#authortitleQueryField').val();
            if(authorTitle !=="optional" && authorTitle.trim() !== "") {
                stringset.AuthorTitle = authorTitle;
            }
            stringset.ISBN = $('#isbnQueryField').val();
            stringset.ISSN = $('#issnQueryField').val();
            stringset.BaseURL = extractBaseURL(stringset);
            // fades in base URL container added in the previous line.
            $("#computedBaseURL").val(stringset.BaseURL).parent().fadeIn(); // this reference may need to be unmade at some stage
            // Meant to change colour of next button.  Not currently working.
            $("#processISBN").addClass("blue-boi").fadeIn();

        });

    // STEP 3-2 Process ISBN
        $("#processISBN").click(function(){
            stringset.ISBN = subOutISBN(stringset);
            $('#isbnQueryField').animate({color:"rgba(0,0,0,0)"},100).val(stringset.ISBN).animate({color:"black"},100);
            $("#processISBN").removeClass("blue-boi");
            $("#processISSN").addClass("blue-boi").fadeIn();
        });

    // STEP 3-2 Process ISSN
        $("#processISSN").click(function(){
            $('#issnQueryField').animate({color:"rgba(0,0,0,0)"},100).val(subOutISSN(stringset)).animate({color:"black"},100);
            //$("#processISBN").removeClass("blue-boi");
            //$("#processISSN").fadeIn();
            $("#titleStringHelp1").delay(1000).fadeIn();
            $("#titleStringHelp2").delay(2800).fadeIn();
            $("#titleTestBtn").fadeIn();
            $("#titleResetBtn").fadeIn();
            $("#titleSubmitBtn").fadeIn();
            $("#titleStringTitleField").fadeIn();
        });

    /// this function is hard wired to the interface, there is a reason for that. This part cannot be accomplished without
    /// user intervention.

    var $titleTestBtn = $("#titleTestBtn");
    var $titleSubmitBtn = $("#titleSubmitBtn");
    var $titleStringTitleField = $("#titleStringTitleField");
    var $titleQueryField = $("#titleQueryField");
    var title;
    var testURL;
    var testWindow;

    // STEP 3-4 Process title.
    $titleTestBtn.click(function(){
        //1. Gather replacement string from the replacement field.
        title = $titleStringTitleField.val();
        //2. Perform replacement operation on URL
        testURL = $titleQueryField.val().replace(title,"fish");
        //3. Open a new tab to the replaced title string.
        testWindow = window.open(testURL,"_blank");
    });

    $titleSubmitBtn.click(function () {
        stringset.Title = $titleQueryField.val().replace(($titleStringTitleField.val()),"fish").replace(stringset.BaseURL,"");
        $titleSubmitBtn.find("svg").animate({color:"green"},400);
        $("#titleStringHelp3").fadeIn();
        $("#authortitleValidationDiv").delay(800).fadeIn();
    });


    // ---- Author title string processing.
    // This functionality isn't strictly neccesary, so I'm slightly reluctant to test it.

    var $authortitleStringTitleField = $("#authortitleStringTitleField");
    var $authortitleStringAuthorField = $("#authortitleStringAuthorField");
    var $authortitleTestBtn = $("#authortitleTestBtn");
    var $authortitleSubmitBtn = $("#authortitleSubmitBtn");
    var $authortitleQueryField = $("#authortitleQueryField");
    // STEP 3-5 Process Author title
    $authortitleTestBtn.click(function () {
        var testURL = $authortitleQueryField.val().replace(($authortitleStringAuthorField.val()),"Barry Drake").replace(($authortitleStringTitleField),"Fish");
        var testWindow = window.open(testURL,"_blank");
    });

    $authortitleSubmitBtn.click(function () {
        if(stringset.AuthorTitle) stringset.AuthorTitle = $authortitleQueryField.val().replace(($authortitleStringAuthorField.val()),"$$AUTHOR$$").replace(($authortitleStringTitleField),"$$TITLE$$").replace(stringset.BaseURL,"");
        $authortitleSubmitBtn.find("svg").animate({color:"green"},400);
        $('[id^="titleStringHelp"]').fadeOut();
        $("#titleStringHelp4").delay(800).fadeIn();
        $("#queryStringsSubmit").delay(1200).fadeIn();
    });

    function resolveSystemID(stringset){
        $.get("localhost:3400/querystringSubmit?",stringset); // CALLBACK TO BE ADDED TO THIS
        // BUT FIRST WE NEED AN API FOR IT TO CALL BACK FROM.
    }
};




// HELPER FUNCTIONS
// Helper function that checks for empty strings.
function stringIsEmpty(a) {
    return (a.length === 0 || !a.trim());
}



    function TestMockStringSet() {
        window.mockstringset = {
            Title: "https://www.afishwithahat/search?&title=gone+fishing",
            AuthorTitle: "https://www.afishwithahat/search?&title=gone+fishing&author=barry+drake",
            ISBN: "https://www.afishwithahat/search?&IBSN=1234167899",
            ISSN: "https://www.afishwithahat/search?&ISSN=1234-144x"
        }
    }


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


        function findFirstDiffPos(a, b) {
            var i = 0;
            if (a === b) return -1;
            while (a[i] === b[i]) i++;
            return i;
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
          s = s.replace(stringset.BaseURL,"");
            return s;
        }
        return stringset.ISBN;
}

    //3.x Process ISSN string by replacing any sequence of 4 digits joined by a dash to 4 other digits. OR 4 digits joined by a dash to 3 digits followed by an 'x';
    function subOutISSN(stringset){
        if(stringset.ISSN){
            var s = stringset.ISSN;
            s = s.replace(/%20\d{4}-\d{4}/g,'%20$$$ISSN$$$');
            s = s.replace(/%20\d{4}-\d{3}X/g,'%20$$$ISSN$$$');
            s = s.replace(/\d{4}-\d{4}/g,'$$$ISSN$$$');
            s = s.replace(/\d{4}-\d{3}/g,'$$$ISSN$$$');
            s = s.replace(stringset.BaseURL,"");
            return s;
        }
    }




//})();

//})();

// Remember to put this behavior back into a function call when you want to start.



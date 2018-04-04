// Process to collect deep linking strings from a user and parse them into JSON
// In the future this may be replaced by something that extracts the strings from the Word Doc directly.

var NUC;
var qstringTitle;
var qstringAuthor;
var qstringAuthorTitle;
var qstringISSN;
var qstringISBN;

var stringset;


//(function() {  // Main


String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};



function collectString(){ // todo: Only once the parsing functionality is completed


}

function TestMockStringSet(){
 window.mockstringset = {Title: "https://www.afishwithahat/search?&title=gone+fishing", AuthorTitle : "https://www.afishwithahat/search?&title=gone+fishing&author=barry+drake", IBSN: "https://www.afishwithahat/search?&IBSN=1234167899", ISSN: "https://www.afishwithahat/search?&ISSN=1234-144x"}
}


function extractBaseURL(stringset){

    var lastcommonindex = Infinity;
    var keys = stringset.keys();
    var i,j = 0;
    var k = Infinity;
    var lCI = Infinity;
    for (i;keys.length;i++){
        var currcheck = keys[i];
        for(j;keys.length;j++){
            if(!(keys[i].isEmpty()||keys[j].isEmpty())) {
                k = findFirstDiffPos(currcheck, keys[j])
                if (k < lCI) lCI = k;
            }
        }
    }
return keys[0].substring(0,lCI);

}

    function findFirstDiffPos(a, b) {
        var i = 0;
        if (a === b) return -1;
        while (a[i] === b[i]) i++;
        return i;
    }







//})();

// Remember to put this behavior back into a function call when you want to start.



var clickbait_phrases = [
    "Bernie Sanders",
    "(will|may) surprise you",

    "find out why",

    "chick-fil-a",
    "\\d+ things",
    "ranked",
    "ranking",
    "will surprise you",
    "find out why",
    "this common",
    "\\d+ surprising",
    "\\d+ of the best",
    "most insane",
    "the only\\w*you need",
    "\\d+ facts",
    "\\d+ ways",
    "you have to watch"
];

var ADJECTIVES = [
    'stupid',
    'dumb',
    'crazy'
];

//chrome.storage.sync.get(function (data) {
//    var isToggled = data.toggle;
//    if (isToggled){
//        remove_clickbait()
//    }
//});



// Regex should contain "NUMBER", signifying a numeral.  This method adds spelled-out numbers 0-20 as regex keywords.
// Final regex will be in the format "(one|two|three|\d)-*"
// The hyphen should account for numbers in the form "twenty-two"
String.prototype.spell_numbers = function(){
    var numbers = [
        'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
        'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
    ];
    var number_string = "(";
    for (var i=0; i<numbers.length; i++){
        number_string += numbers[i];
        if (i != numbers.length-1) {
            number_string += "|"
        } else {
            number_string += "|\\d)-*"
        }
    }
    return this.replace("NUMBER", number_string);
};


// Regex should contain "KEY", signifying the keyword to be replaced.
// Final regex will be in the format "(synonym|alternative|substitute)"
String.prototype.synonyms = function(synonyms, key) {
    var synonym_string = "(";
    for (var i=0; i<synonyms.length; i++){
        synonym_string += synonyms[i];
        if (i != synonyms.length -1) {
            synonym_string += "|"
        } else {
            synonym_string += ")"
        }
    }
    return this.replace(key, synonym_string);
};


function filter_and_push(regex){
    regex = regex.spell_numbers();
    regex = regex.synonyms(ADJECTIVES, "ADJ");
    clickbait_phrases.push(regex);
}


filter_and_push("NUMBER (ADJ\\s)*reason(s)*");
remove_clickbait();

function remove_clickbait(){
    $("a").each(function(i, item) {
        var link_text = item.text;

        for (var i=0; i<clickbait_phrases.length; i++){
            if (link_text.match(new RegExp(clickbait_phrases[i], 'i')) != null){
                $(this).text("Clickbait Blocked");
                $(this).addClass("clickbait");
            }
        }

    });
}
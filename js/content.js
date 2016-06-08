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

//chrome.storage.sync.get(function (data) {
//    var isToggled = data.toggle;
//    if (isToggled){
//        remove_clickbait()
//    }
//});



clickbait_phrases.push(spell_numbers("NUMBER ((stupid|dumb)\\s)*reason(s)*"));


// Regex should contain "NUMBER", signifying a numeral.  This method adds spelled-out numbers 0-20 as regex keywords.
// Final regex will be in the format "(one|two|three|\d)-*"
// The hyphen should account for numbers in the form "twenty-two"
function spell_numbers(regex){

    var numbers = [
        'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 
        'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
    ];

    var number_string = "(";

    for (var n=0; n<numbers.length; n++){
        number_string += numbers[n];
        if (n != numbers.length -1) {
            number_string += "|"
        } else {
            number_string += "|\\d)-*"
        }
    }

    return regex.replace("NUMBER", number_string);
}






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
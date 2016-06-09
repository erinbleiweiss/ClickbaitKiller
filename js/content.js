var clickbait_regex = [];

var clickbait_phrases = [
    "t_DEM_PRONOUN t_ADJ",
    "t_NUM t_ADJ",
    "t_NUM t_SUPER",
    "t_SUPER t_ADJ",
    // Number, 0-1 words, Noun
    "t_NUM\\s(?:\\w*\\s)?(\\b(t_NOUN)s*\\b)",
    "t_INTER!",
    "t_ONE_LINE",
    "t_MOD_VERB t_VERB_PHRASE"
];

//var clickbait_phrases = [
//    "Bernie Sanders",
//    "(will|may) surprise you",
//
//    "find out why",
//
//    "chick-fil-a",
//    "\\d+ things",
//    "ranked",
//    "ranking",
//    "will surprise you",
//    "find out why",
//    "this common",
//    "\\d+ surprising",
//    "\\d+ of the best",
//    "most insane",
//    "the only\\w*you need",
//    "\\d+ facts",
//    "\\d+ ways",
//    "you have to watch"
//];


var ADJECTIVES = [
    'stupid',
    'dumb',
    'crazy',
    'insane',
    'weird',
    'strange',
    'surprising',
    'amazing',
    'unbelievable',
    'breathtaking',
    'shocking',
    'funny',
    'hilarious',
    'common',
    'simple'
];

var NOUNS = [
    'thing',
    'time',
    'moment',
    'fact',
    'fail',
    'way',
    'reason',
    'trick'
];

var MODAL_VERBS = [
    'can',
    'could',
    'may',
    'might',
    'must',
    'shall',
    'should',
    'will',
    'would'
];

var DEMONSTRATIVE_PRONOUNS = [
    'this',
    'that',
    'these',
    'those'
];

var SUPERLATIVES = [
    'most',
    'greatest',
    'least',
    'best',
    'worst'
];

var INTERJECTIONS = [
    'whoa',
    'woah',
    'wow',
    'incredible',
    'unbelievable'
];

var ONE_LINERS = [
    'blow your mind',
    'you have to watch',
    'have you seen',
    'what happen'
];

var VERB_PHRASES = [
    'surprise you',
    'shock you',
    'make you'
];

var ADVERBS = [
    'really',
    'very',
    'extremely'
];


var keys = {
    't_ADJ': ADJECTIVES,
    't_NOUN': NOUNS,
    't_MOD_VERB': MODAL_VERBS,
    't_DEM_PRONOUN': DEMONSTRATIVE_PRONOUNS,
    't_SUPER': SUPERLATIVES,
    't_INTER': INTERJECTIONS,
    't_ONE_LINE': ONE_LINERS,
    't_VERB_PHRASE': VERB_PHRASES,
    't_ADV': ADVERBS
};

var WHITELIST = [
    'New York Times',
    'nytimes'
];


//chrome.storage.sync.get(function (data) {
//    var isToggled = data.toggle;
//    if (isToggled){
//        remove_clickbait()
//    }
//});


function whitelist(regex){
    var whitelist_string = "(";
    $.each(WHITELIST, function(i, synonym){
        whitelist_string += synonym;
        if (i != WHITELIST.length - 1) {
            whitelist_string += "|"
        } else {
            whitelist_string += ")"
        }
    });
    return "(?!.*" + whitelist_string + ")" + regex; //(?!.*t_WHITELIST)
}

// Regex should contain "NUMBER", signifying a numeral.  This method adds spelled-out numbers 0-20 as regex keywords.
// Final regex will be in the format "(one|two|three|\d)-*"
// The hyphen should account for numbers in the form "twenty-two"
// Regex optionally includes "of the" (ex: 10 of the best ____ of all time)
function spell_numbers(regex){
    var key_test = new RegExp('t_NUM', 'i');
    if((key_test).test(regex)) {
        var numbers = [
            'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
            'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
            'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
        ];
        var number_string = "(?!.*(#|am|pm))(";
        $.each(numbers, function(i, number){
            number_string += number;
            if (i != numbers.length - 1) {
                number_string += "|"
            } else {
                number_string += "|\\d)-*(\\sof the)*"
            }
        });
        return regex.replace("t_NUM", number_string);
    } else {
        return regex;
    }
}


// Parameters:
//    - synonyms: Global array of synonyms used to populate regex
//    - key: String signifying keyword to be replaced (in format "KEY")
// Returns: regex will be in the format "(synonym|alternative|substitute)"
function synonyms(regex, synonyms, key){
    var key_test = new RegExp(key, 'i');
    if((key_test).test(regex)){
        var synonym_string = "(";
        $.each(synonyms, function(i, synonym){
            synonym_string += synonym;
            if (i != synonyms.length - 1) {
                synonym_string += "|"
            } else {
                synonym_string += ")"
            }
        });
        return regex.replace(key, synonym_string);
    } else {
        return regex;
    }
}


function filter_and_push(regex){
    regex = whitelist(regex);
    regex = spell_numbers(regex);
    $.each(keys, function(token, arr){
        regex = synonyms(regex, arr, token);
    });
    clickbait_regex.push(regex);
    //console.log(clickbait_regex);
}


function remove_clickbait(){
    var matched = false;
    $("a").each(function(i, item) {
        matched = false;
        var link_text = item.text;
        for (var i=0; i<clickbait_regex.length; i++){
            if (link_text.match(new RegExp(clickbait_regex[i], 'i')) != null && !matched){
                matched = true;
                $(this).attr('cKiller', $(this).text());
                $(this).text("Clickbait Blocked");
                $(this).addClass("clickbait");

                $(this).mouseenter(function() {
                    var cKiller = $(this).attr('cKiller');
                    $(this).text(cKiller);
                    $(this).removeClass('clickbait');
                });
                $(this).mouseleave(function(){
                    $(this).text("Clickbait Blocked");
                    $(this).addClass('clickbait');
                });
            }
        }

    });
}


for (var i=0; i<clickbait_phrases.length; i++){
    filter_and_push(clickbait_phrases[i]);
}
remove_clickbait();


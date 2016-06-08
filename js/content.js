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
    "\\d+\\w*reason",
    "this common",
    "\\d+ surprising",
    "\\d+ of the best",
    "most insane",
    "the only\\w*you need",
    "\\d+ facts",
    "\\d+ ways",
    "you have to watch"
];

chrome.storage.sync.get(function (data) {
    var isToggled = data.toggle;
    if (isToggled){
        remove_clickbait()
    }
});


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
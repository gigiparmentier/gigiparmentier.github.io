

$(document).ready(function(){
    $.get(
        "https://www.googleapis.com/youtube/v3/search",{
            part:'snippet',
            type:'video',
            maxResults:'1',
            order:'ViewCount',
            key:' AIzaSyCDNfY7UqzxsFXCabZNPTxwcvQnyT__UbU '},
            function(data){
                $.each(data.items, function(i,item){
                    console.log(item);
                })
            }
    );
});
var titre = result.snippet.title;
// 'Modern' browsers (IE8+, use CSS-style selectors)
document.querySelector('.results').innerHTML = titre;

// Using the jQuery library
$('.results').html(titre);
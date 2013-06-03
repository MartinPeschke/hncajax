define(["tools/hash", "tools/ajax"], function(hashlib, ajax){
    var setUpPlayer = function(root){
        var currentVideo;
        root.find('.you-tube-container').each(function(idx, elem){
            var elemId = 'youtube-'+hashlib.UUID()
                , initial = root.find(".active").find("a").data("videoId");
            $(elem).append('<div id="'+elemId+'"></div>');
            currentVideo = new YT.Player(elemId, {
                height: $(elem).width() * 0.5625,
                width: $(elem).width(),
                videoId: initial,
                suggestedQuality: "hd720",
                playerVars : {controls:1, autohide:1, modestbranding :1, theme :'dark', wmode: "opaque"},
                events: {
                    onReady: function(event){event.target.setPlaybackQuality("hd720")}
                }
            });
        });
        root.find('[data-toggle="video"]').on({click:function(e){
            var $elem = $(e.target)
                , resumeTime = parseFloat($(e.target).data("resumeTime") || 0);
            $elem.parent().addClass("active").siblings(".active").removeClass("active").find('[data-toggle="video"]').data({resumeTime: currentVideo.getCurrentTime()});
            currentVideo.cueVideoById($elem.data("videoId"), resumeTime, "hd720");
            e.preventDefault();
            e.stopPropagation();
            return false;
        }});
    }, loaded = $.Deferred();
    window.onYouTubePlayerAPIReady = function () {
        loaded.resolve();
    };
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    return {
        onLoad: function(root){
            loaded.done(_.bind(setUpPlayer, this, root));
        }
    }
});


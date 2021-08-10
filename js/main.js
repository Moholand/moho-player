var audio;
var shuffle_counter = 0;
var songs_array

//Initialize Audio
initAudio($('.play-list li:first-child'));

//Initializer function
function initAudio(element) {
    var song = element.attr('data-song');
    var title = element.text();
    var cover = element.attr('data-cover');
    var artist = element.attr('data-artist');

    //Cover
    $('#cover').css('background', 'url(img/covers/' + cover + ') no-repeat');

    //Create audio object
    // audio = new Audio('media/' + song);
    var audiotag = $('#player-audio').attr('src', 'media/' + song);
    audio = audiotag[0];

    if(!audio.currentTime) {
        $('#current-time').html('0.00');
    }

    $('.play-list li').removeClass('active');
    element.addClass('active');

    $('#play-back-rate button').removeClass('active-speed');
    $('#normal-speed').addClass('active-speed');
    audio.playbackRate = 1.0;
}

$('#play-pause').click(function() {
    if(audio.paused) {
        audio.play();
        $('#play').css({opacity: 0, transform: 'scale(0.7, 0.7)'});
        $('#pause').css({opacity: 1, transform: 'scale(1, 1)'});
        showDuration();
    } else {
        audio.pause();
        $('#pause').css({opacity: 0, transform: 'scale(0.7, 0.7)'});
        $('#play').css({opacity: 1, transform: 'scale(1, 1)'});
    }
});

// $('#play').click(function() {
//     audio.play();
//     $('#play').css({opacity: 0, transform: 'scale(0.7, 0.7)'});
//     $('#pause').css({opacity: 1, transform: 'scale(1, 1)'});
//     showDuration();
// });

// $('#pause').click(function() {
//     audio.pause();
//     $('#pause').css({opacity: 0, transform: 'scale(0.7, 0.7)'});
//     $('#play').css({opacity: 1, transform: 'scale(1, 1)'});
// });

$('#next').click(function() {
    audio.pause();

    //Shuffle mode or not
    var next
    if(!$('#shuffle-mode').hasClass('active-shuffle')) {
        next = $('.play-list li.active').next();
        if(next.length == 0) {
            next = $('.play-list li:first-child');
        }
    } else {
        $('.play-list li').removeClass('active');
        $(songs_array[shuffle_counter]).addClass('active');
        shuffle_counter += 1;
        shuffle_counter = (shuffle_counter<songs_array.length) ? shuffle_counter : 0;
        next = $('.play-list li.active');
    }
    
    initAudio(next);
    audio.play();
    $('#play').css({opacity: 0, transform: 'scale(0.7, 0.7)'});
    $('#pause').css({opacity: 1, transform: 'scale(1, 1)'});
    showDuration();
});

$('#prev').click(function() {
    audio.pause();

    //Shuffle mode or not
    var prev
    if(!$('#shuffle-mode').hasClass('active-shuffle')) {
        prev = $('.play-list li.active').prev();
        if(prev.length == 0) {
            prev = $('.play-list li:last-child');
        }
    } else {
        shuffle_counter -= 1;
        shuffle_counter = (shuffle_counter>=0) ? shuffle_counter : ((songs_array.length)-1);
        $('.play-list li').removeClass('active');
        $(songs_array[shuffle_counter]).addClass('active');
        prev = $('.play-list li.active');
    }

    initAudio(prev);
    audio.play();
    $('#play').css({opacity: 0, transform: 'scale(0.7, 0.7)'});
    $('#pause').css({opacity: 1, transform: 'scale(1, 1)'});
    showDuration();
});

function showDuration() {
    $(audio).bind('timeupdate', function(){
        //Get hours and minutes
        var s = parseInt(audio.currentTime % 60);
        var m = parseInt((audio.currentTime / 60) % 60);
        //Add 0 if seconds less than 10
        if (s < 10) {
            s = '0' + s;
        }
        $('#current-time').html(m + ':' + s);
        //Calcuting the left time
        var leftTime = audio.duration - audio.currentTime;
        var sl = parseInt(leftTime % 60);
        var ml = parseInt((leftTime / 60) % 60);
        //Add 0 if seconds less than 10
        if (sl < 10) {
            sl = '0' + sl;
        }
        if (audio.currentTime > 0) {
            $('#total-time').html('-' + ml + ':' + sl);
        }
        //Progress Bar
        var value = 0;
        if (audio.currentTime > 0) {
            value = parseFloat((100 / audio.duration) * audio.currentTime);
        }
        $('#elapsed-time-line').css('width',value + '%');
        $('#time-line-pointer').css('left',value + '%');

        //Playing next after audio ended
        if(audio.ended) {
            var next
            if(!$('#shuffle-mode').hasClass('active-shuffle')) {
                next = $('.play-list li.active').next();
                if(next.length == 0) {
                    next = $('.play-list li:first-child');
                }
            } else {
                $('.play-list li').removeClass('active');
                $(songs_array[shuffle_counter]).addClass('active');
                shuffle_counter += 1;
                shuffle_counter = (shuffle_counter<songs_array.length) ? shuffle_counter : 0;
                next = $('.play-list li.active');
            }
        
            initAudio(next);
            audio.play();
            showDuration();
        }
    });
}

//Add animation to buttons
$('#play-back-rate button, #next, #prev').click(function() {
    //Animate
    $(this).addClass('button-animate');
    var that = this;
    setTimeout(function() {
        $(that).removeClass('button-animate');
    }, 400);
});

//Timeline clicked event
$('#time-line').click(function(e) {
    var abs_pos = e.pageX;
    var el_pos = $('#time-line').offset().left;
    var pos = abs_pos - el_pos;
    var new_pos = (pos/500) * 100;

    $('#elapsed-time-line').css('width',new_pos + '%');
    $('#time-line-pointer').css('left',new_pos + '%');

    audio.currentTime = (new_pos/100) * audio.duration;
    showDuration();
});

//Mute icon event
$('#volume-icon').click(function() {
    var volume_value = parseFloat(audio.volume * 100).toFixed(2);
    if(!audio.muted) {
        audio.muted = true;
        $('#unmute_icon').css({opacity: 0, transform: 'scale(0.7, 0.7)'});
        $('#mute_icon').css({opacity: 1, transform: 'scale(1, 1)'});
        $('#volume-bar-pointer').css('left',0 + "%");
        $('#on-volume-bar').css('width',0 + "%");

    } else {
        audio.muted = false;
        $('#mute_icon').css({opacity: 0, transform: 'scale(0.7, 0.7)'});
        $('#unmute_icon').css({opacity: 1, transform: 'scale(1, 1)'});
        $('#volume-bar-pointer').css('left',volume_value + "%");
        $('#on-volume-bar').css('width',volume_value + "%");
    }
});

//Volume change with click
$('#volume-bar-container').click(function(e) {
    var abs_pos = e.pageX;
    var el_pos = $('#volume-bar-container').offset().left;
    var pos = abs_pos - el_pos;
    var pos_p = (pos/($('#main-volume-bar').width()))*100;

    if(pos_p < 0) {
        pos_p = 0;
    }

    $('#on-volume-bar').css('width',pos_p + '%');
    $('#volume-bar-pointer').css('left',pos_p + '%');

    audio.volume = parseFloat(pos_p/100);

    //Volume icon decoration
    if((0.75 < audio.volume) && (audio.volume < 1)) {
        $('.fa-volume-up').css('opacity', 1);
        $('.fa-volume').css('opacity', 1);
        $('.fa-volume-down').css('opacity', 1);
    }else if((0.5 < audio.volume) && (audio.volume < 0.75)) {
        $('.fa-volume-up').css('opacity', 0);
        $('.fa-volume').css('opacity', 1);
        $('.fa-volume-down').css('opacity', 1);
    } else if ((0.1 < audio.volume) && (audio.volume < 0.5)) {
        $('.fa-volume-up').css('opacity', 0);
        $('.fa-volume').css('opacity', 0);
        $('.fa-volume-down').css('opacity', 1);
    } else if ((0 < audio.volume) && (audio.volume < 0.1)) {
        $('.fa-volume-up').css('opacity', 0);
        $('.fa-volume').css('opacity', 0);
        $('.fa-volume-down').css('opacity', 0);
    }
});

//Song will play when clicked on 
$('.play-list li').click(function() {
    audio.pause();
    initAudio($(this));
    audio.play();
    $('#play').css({opacity: 0, transform: 'scale(0.7, 0.7)'});
    $('#pause').css({opacity: 1, transform: 'scale(1, 1)'});
    showDuration();
});

// Make the timeline elements draggable:
dragElement($('#time-line-pointer'));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0;
    var audio_pause

    $(elmnt).mousedown(dragMouseDown);

    function dragMouseDown(e) {
        e.preventDefault();
        pos2 = e.clientX;

        // $(document).mouseup(closeDragElement);
        $(document).on('mouseup',closeDragElement);
        // $(document).mousemove(elementDrag);
        $(document).on('mousemove',elementDrag);

        audio_pause = (audio.paused) ? true : false;
    }

    function elementDrag(e) {
        e.preventDefault();

        audio.pause();
        $('#pause').css({opacity: 0, transform: 'scale(0.7, 0.7)'});
        $('#play').css({opacity: 1, transform: 'scale(1, 1)'});
        
        // calculate the new cursor position:
        pos1 = pos2 - e.clientX;
        pos2 = e.clientX;
        // set the element's new position:
        var el_pos = ($(elmnt).offset().left) - ($('#time-line').offset().left);
        var new_pos_px = el_pos - pos1;

        new_pos_px = (new_pos_px>0) ? new_pos_px : 0;
        new_pos_px = (new_pos_px<$('#time-line').width()) ? new_pos_px : $('#time-line').width();

        $(elmnt).css('left',new_pos_px + "px");
        $('#elapsed-time-line').css('width',new_pos_px + "px");

        var new_pos = ((el_pos - pos1)/($('#base-time-line').width())) * 100;
        audio.currentTime = (new_pos/100) * audio.duration;
        showDuration();
    }

    function closeDragElement() {
        // $(document).mouseup(null);
        $(document).off('mouseup');
        // $(document).mousemove(null);
        $(document).off('mousemove');

        if(!audio_pause) {
            audio.play();
            $('#play').css({opacity: 0, transform: 'scale(0.7, 0.7)'});
            $('#pause').css({opacity: 1, transform: 'scale(1, 1)'});
        }
    }
}

// Make the volume bar elements draggable:
dragElementVolume($('#volume-bar-pointer'));

function dragElementVolume(elmnt) {
    var pos1 = 0, pos2 = 0;

    $(elmnt).mousedown(dragMouseDown);

    function dragMouseDown(e) {
        e.preventDefault();
        pos2 = e.clientX;
        // console.log(pos2)

        // $(document).mouseup(closeDragElement);
        $(document).on('mouseup',closeDragElement);
        // $(document).mousemove(elementDrag);
        $(document).on('mousemove',elementDrag);
    }

    function elementDrag(e) {
        e.preventDefault();
        
        // calculate the new cursor position:
        pos1 = pos2 - e.clientX;
        // console.log(pos1);
        pos2 = e.clientX;

        // set the element's new position:
        // var el_pos = ($(elmnt).offset().left) - ($('#volume-bar-container').offset().left);
        var left_pos = parseFloat(($(elmnt).css('left')));
        var new_pos = ((left_pos - pos1)/($('#main-volume-bar').width()))*100;
        
        new_pos = (new_pos >= 0) ? (new_pos) : (new_pos = 0);
        new_pos = (new_pos <= 100) ? (new_pos) : (new_pos = 100);

        $(elmnt).css('left',new_pos + "%");
        $('#on-volume-bar').css('width',new_pos + "%");

        audio.volume = new_pos/100;
        
        //Volume icon decoration
        if((0.75 < audio.volume) && (audio.volume < 1)) {
            $('.fa-volume-up').css('opacity', 1);
            $('.fa-volume').css('opacity', 1);
            $('.fa-volume-down').css('opacity', 1);
        }else if((0.5 < audio.volume) && (audio.volume < 0.75)) {
            $('.fa-volume-up').css('opacity', 0);
            $('.fa-volume').css('opacity', 1);
            $('.fa-volume-down').css('opacity', 1);
        } else if ((0.1 < audio.volume) && (audio.volume < 0.5)) {
            $('.fa-volume-up').css('opacity', 0);
            $('.fa-volume').css('opacity', 0);
            $('.fa-volume-down').css('opacity', 1);
        } else if ((0 < audio.volume) && (audio.volume < 0.1)) {
            $('.fa-volume-up').css('opacity', 0);
            $('.fa-volume').css('opacity', 0);
            $('.fa-volume-down').css('opacity', 0);
        }
    }

    function closeDragElement() {
        // $(document).mouseup(null);
        $(document).off('mouseup');
        // $(document).mousemove(null);
        $(document).off('mousemove');
    }
}

//Player speed events
$('#high-speed').click(function() {
    $('#play-back-rate button').removeClass('active-speed');
    $(this).addClass('active-speed');
    audio.playbackRate = 1.5;
});

$('#normal-speed').click(function() {
    $('#play-back-rate button').removeClass('active-speed');
    $(this).addClass('active-speed');
    audio.playbackRate = 1.0;
});

$('#half-speed').click(function() {
    $('#play-back-rate button').removeClass('active-speed');
    $(this).addClass('active-speed');
    audio.playbackRate = 0.5;
});

//Shuffle mode active/disactive
$('#shuffle-mode').click(function() {
    if ($('#shuffle-mode').hasClass('active-shuffle')) {
        $('#shuffle-mode').removeClass('active-shuffle');
    } else {
        $('#shuffle-mode').addClass('active-shuffle');

        //Shuffle function
        songs_array = $('.play-list li');
        shuffle(songs_array);

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
            
                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }
    }
});
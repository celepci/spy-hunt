$('.js-open-settings-modal').on('click', function () {
    $('#settingsModal').addClass('active');
});
$('.js-open-how-play-modal').on('click', function () {
    $('#howPlay').addClass('active');
});

var time = $('.game__timer').text();
var arrTime = time.split(':');
var min = arrTime[0];
var sec = arrTime[1];
console.log(min);
console.log(sec);

function timeCountdown(min, sec) {
    var time = $('.game__timer').text();
    var arrTime = time.split(':');
    var min = arrTime[0];
    var sec = arrTime[1];

    if (sec == 00) {
        min -= 1;
        sec = 59;
    } else {
        sec -= 1;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }
    $('.game__timer').text(min + ':' + sec);

}

window.setInterval(function () {
    timeCountdown(min, sec);
}, 1000)
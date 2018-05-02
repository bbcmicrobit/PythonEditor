// JavaScript source code
$(document).ready(function () {

    var thermSlid = $('#thermo-slider'), paramBox = $('div#sim-parameters');
    var answBox = $('.value span');

    answBox.text(thermSlid.val());

    thermSlid.on('change', function () {
        answBox.text(thermSlid.val());
    });

    // Adjust style of thermometer for frame
    var top = thermSlid.width() / 2;
    var right = paramBox.width() / 2;
    thermSlid.css({
        'top': top + 'px',
        'transform': 'rotate(-90deg)',
        'right': -right + 'px'
    });
});
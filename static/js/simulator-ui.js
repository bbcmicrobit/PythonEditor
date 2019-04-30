// JavaScript source code
$(document).ready(function () {
    $('#sim-parameters').children().hide();

    $("#accel-toggle").on('click', function(e) {
        $('#sim-parameters').children().hide();
        $('.mb_pin').css('opacity', '0');
        
        $('#accelerometer').fadeIn();
        $('#accelerometer').children().fadeIn();
        e.stopPropagation();
        console.log('accel');
    });

    $('#thermo-toggle').on('click', function(e) {
        $('#sim-parameters').children().hide();
        $('.mb_pin').css('opacity', '0');
        
        $('#thermometer').fadeIn();
        $('#thermometer').children().fadeIn();
        e.stopPropagation();
        console.log('thermo');
    });
    
    $('#pin-toggle').on('click', function(e) {
        $('#sim-parameters').children().hide();
        $('.mb_pin').css('opacity', '0');
        
        $('#pins').fadeIn();
        $('#pins').children().fadeIn();
        e.stopPropagation();
        console.log('pins');
    });
    
    $('#accelerometer-buttons').hide();

    var sGMHeight = 0;
    $('#sim-btns a').each(function() {
        sGMHeight += $(this).outerHeight() + 4;
        console.log(sGMHeight);
    });

    var simBtnsOpened = false;
    
    $('#sim-btns-toggle').on('click', function(e) {
        e.preventDefault();

        var simGroup = $('#sim-btns'),
            tglBtn = $('#sim-btns-toggle');
        
        if (simBtnsOpened) {
            simGroup.hide();
            tglBtn.html('<i class="fa fa-chevron-up"></i>');
            simBtnsOpened = false;
            console.log('closed');
        } else {
            simGroup.show();
            tglBtn.html('<i class="fa fa-chevron-down"></i>');
            simBtnsOpened = true;
            console.log('opened');
        }

    });

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
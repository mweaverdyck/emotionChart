/*
 * Author: Meng Du
 * Date: Jun 17, 2016
 */


var id;

function valid_id(uid) {
    if (uid === 'test' || uid.length === ID_LENGTH) {
        return true;
    }
    return false;
}

function id_submission() {
    id = $("#uid-input").val();
    if (valid_id(id)) {
        $("#id-dialog").modal('hide');
        $('#pages').show();
        show_example();
    } else {
        $("#uid-field").addClass("has-error");
    }
}

function set_buttons(pracFrame) {
    $('#next-btn').click(function() {
        if (!$('#page-1').is(':hidden')) {  // on page 1
            window.scrollTo(0, 0);
            $('#page-1').hide();
            show_page($('#page-2'));
            $('#prev-btn').show();
        }
        else if (page_is_shown($('#page-2'))) {  // on page 2
            // hit the hidden next button of inner frame
            pracFrame.contentWindow.postMessage('next', '*');
            // instruction-msg-handler.js will do the rest
        }
    });

    $('#prev-btn').click(function() {
        window.scrollTo(0, 0);
        if (page_is_shown($('#page-2'))) {  // on page 2
            hide_page($('#page-2'));
            $('#page-1').show();
            $('#prev-btn').hide();
        }
        else if (!$('#page-3').is(':hidden')) {  // on page 3
            $('#page-3').hide();
            show_page($('#page-2'));
            $('#next-btn').show();
        }
    });

    $('#start-btn').click(function() {
        location.href = 'experiment.html?id=' + id;
    });
}

function show_example() {
    $('#surprise').highcharts({
        chart: {
            type: 'line',
            height: 500,
        },
        title: {
            text: 'Surprise',
        },
        xAxis: xAxisSettings,
        yAxis: yAxisSettings,
        tooltip: tooltipSettings,
        plotOptions: plotSeriesSettings,
        credits: false,
        series: [
            {
                data: [0, 0, 0, 0, 0, 95, 50, 20, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                pointStart: -4,
                animation: {
                    duration: 5000
                },
            }
        ]
    });

    $('#surprise').highcharts().xAxis[0].addPlotBand(plotBand);
}


$(function () {
    $('#prev-btn').hide();
    hide_page($('#page-2'));
    $('#page-3').hide();
    $('#page').hide();
    $("#id-dialog").modal('show');

    var pracFrame = document.getElementById('practice-frame');
    set_buttons(pracFrame);
});

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
        $('#pages').removeClass('hidden');
        show_example();
    } else {
        $("#uid-field").addClass("has-error");
    }
}

function set_buttons(pracFrame) {
    $('#next-btn').click(function() {
        if (!$('#page-1').hasClass("hidden")) {  // on page 1
            $('#page-1').addClass("hidden");
            $('#page-2').removeClass("hidden");
            $('#prev-btn').removeClass("hidden");
        }
        else if (!$('#page-2').hasClass("hidden")) {  // on page 2
            // hit the hidden next button of inner frame
            pracFrame.contentWindow.postMessage('next', '*');
            // instruction-msg-handler.js will do the rest
        }
    });

    $('#prev-btn').click(function() {
        if (!$('#page-2').hasClass("hidden")) {  // on page 2
            $('#page-2').addClass("hidden");
            $('#page-1').removeClass("hidden");
            $('#prev-btn').addClass("hidden");
        }
        else if (!$('#page-3').hasClass("hidden")) {  // on page 3
            $('#page-3').addClass("hidden");
            $('#page-2').removeClass("hidden");
            $('#next-btn').removeClass("hidden");
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
    $("#id-dialog").modal('show');

    var pracFrame = document.getElementById('practice-frame');
    set_buttons(pracFrame);
});

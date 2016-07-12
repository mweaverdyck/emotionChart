/*
 * Author: Meng Du
 * Date: Jun 17, 2016
 */


// GLOBALS
var emotion_index = 0;  // index of EMOTIONS array

/* Historical data is returned in this format
    [{
        time: <ms since trial start>,
        event: <'new' | 'move' | 'delete' | 'reset' | 'next-invalid' | 'next'>,
        point: <[x, y] | null>
    }]
 */
var startTime = Date.now();
var userHistory = [];
var hookWindow = false;

/* HELPER FUNCTIONS */

function shuffle_array(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function num2time(num, showZero) {
    // convert numbers to reasonable time
    if (num === 0) {
        if (showZero) {
            return 0;
        } else {
            return '';
        }
    }
    if (num <= 1) {
        return num + ' sec';
    }
    switch (num) {
        case 2: return '2 sec';
        case 3: return '7 sec';
        case 4: return '20 sec';
        case 5: return '1 min';
        case 6: return '2 min';
        case 7: return '7 min';
        case 8: return '20 min';
        case 9: return '1 hr';
        case 10: return '2 hr';
        case 11: return '7 hr';
        case 12: return '20 hr';
        case 13: return '2 day';
        case 14: return '1 week';
        case 15: return '1 month';
        case 16: return '2 month';
        default: return '';
    }
}

function find_point_in_series(x, series) {
    // Given an X value, return the point if found or null if not
    for (var pt in series.data) {
        if (series.data[pt].x == x) {
            unique = false;
            return series.data[pt];
        }
    }
    return null;
}

function validate_chart(userChart, userHistory) {
    var series = userChart.get('user-data');
    var lastPt = find_point_in_series(16, series);
    if (lastPt) {
        return true;
    }
    // invalid
    userChart.xAxis[0].addPlotLine({
        id: 'warning-line',
        value: 16,
        color: 'red',
        width: 1.5,
    });

    alert(INCOMPLETE_ALERT);

    setTimeout(function () {
        userChart.xAxis[0].removePlotLine('warning-line');
    }, 1500);

    userHistory.push({
        time: Date.now() - startTime,
        event: 'next-invalid',
        point: null
    });
    return false;
}

/* END OF HELPER FUNCTIONS */

/* CHART SETTINGS */

var xAxisPlotLines = [
    {  // line at 0
        color: '#adadad',
        width: 3,
        value: 0,
        label: {
            useHTML: true,
            text: '<span style="font-size:18px">START</span><span style="font-size:25px">&#8595;</span>',
            verticalAlign: 'bottom',
            textAlign: 'left',
            rotation: -90,
            y: -5
        }
    }
];

var logTickPositions = [2.387, 2.613, 2.774, 2.898];
for (var i = 0; i < 14; ++i) {
    for (var j = 0; j < 4; ++j) {
        var newlogTick = {
            color: '#e5e5e5',
            width: 0.8
        };
        newlogTick.value = logTickPositions[j];
        newlogTick.value += i;
        xAxisPlotLines.push(newlogTick);
    }
};

var xAxisSettings = {
    title: {
        text: 'Time',
        style: {
            color: '#384755',
            fontSize: '13px',
            fontWeight: 'bold'
        }
    },
    crosshair: true,
    gridLineWidth: 1,
    gridLineColor: '#a8a8a8',
    tickInterval: 1,
    tickColor: '#adadad',
    labels: {
        formatter: function() { return num2time(this.value, false); },
        style: {
            color: '#384755',
            fontSize: '13px'
        }
    },
    min: -3.5,
    max: 16.3,
    plotLines: xAxisPlotLines
};

var yAxisSettings = {
    title: {
        text: 'Intensity',
        style: {
            color: '#384755',
            fontSize: '13px',
            fontWeight: 'bold'
        }
    },
    gridLineWidth: 1,
    gridLineColor: '#d8d8d8',
    tickColor: '#adadad',
    labels: {
        formatter: function() {
            return (this.value >= 0) ? this.value + '%' : '';
        },
        style: {
            color: '#384755',
            fontSize: '13px'
        }
    },
    min: MIN_Y,
    max: MAX_Y,
    tickInterval: 10,
    plotLines: [{
        color: '#adadad',
        width: 3,
        value: 0
    }],
};

var tooltipSettings = {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 0,
    shadow: false,
    headerFormat: '',
    pointFormatter: function () {
        return '<b>'+ num2time(this.x, true) + ': ' + Highcharts.numberFormat(this.y, 1) +'%</b><br/>';
    },
    hideDelay: 0
};

var plotSeriesSettings = {
    series: {
        stickyTracking: false,
        showInLegend: false
    }
};

var plotBand = {
    from: -5,
    to: 0,
    color: '#e6e6e6',
};

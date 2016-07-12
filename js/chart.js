/*
 * Author: Meng Du
 * Date: Jun 17, 2016
 */


// GLOBALS
var index = 0;  // index in EMOTIONS

/* Historical data is returned in this format
    [{
        time: <ms since trial start>,
        event: <'new' | 'move' | 'delete' | 'reset' | 'next-invalid' | 'next'>,
        point: <[x, y] | null>
    }]
 */
var startTime = Date.now();
var userHistory = [];

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
    var series = userChart.get('user-data'),
        data = [];
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

var xAxisSettings, yAxisSettings, tooltipSettings, plotSeriesSettings, plotBand;

/* END OF GLOBALS */

$(function () {
    // INITIALIZE FIREBASE
    var config = {
        apiKey: "AIzaSyBMrJXC5YQaPTdcGrcLXdxlzStYjsMgiAU",
        authDomain: "emotion-dynamics.firebaseapp.com",
        databaseURL: "https://emotion-dynamics.firebaseio.com",
        storageBucket: "",
    };
    firebase.initializeApp(config);

    //   Anonymous Authentication
    var userId;
    firebase.auth().signInAnonymously().then(function(user) {
        userId = user.uid;
        console.log('Signed in as ' + userId);
    });

    // EXPERIMENT SETTINGS
    if (RANDOMIZE) {
        shuffle_array(EMOTIONS);
    }

    var chartClickFunc = function (e) {
        // find the clicked values and the series
        var x = Math.round(e.xAxis[0].value),
            y = e.yAxis[0].value;
        var series;
        if ($('#container').highcharts()) {
            series = $('#container').highcharts().get('user-data');
        } else {
            series = $('#practice').highcharts().get('user-data');
        }

        var point = find_point_in_series(x, series);
        if (point) {
            point.update(y);
        } else if (x > 0 && y <= MAX_Y && y >= MIN_Y) {
            series.addPoint([x, y]);
        }

        userHistory.push({
            time: Date.now() - startTime,
            event: point ? 'move' : 'new',
            point: [x, y]
        });
    }


    /* HIGHCHARTS SERIES AND SETTINGS*/
    var chartSettings = {
        type: 'line',
        animation: false,
        marginTop: 90,   // Should match the Y value subtracted from trace
        marginLeft: 80,  // Should match the X value subtracted from trace
        backgroundColor:'rgba(255, 255, 255, 0.002)',
        events: {
            click: chartClickFunc
        }
    };

    var userDataSeries = {
        id: 'user-data',
        // data: [[0, 0]],
        data: [0, 0, 0, 0, 0],
        pointStart: -4,
        draggableY: true,
        dragMaxY: MAX_Y,
        dragMinY: MIN_Y,
        dragSensitivity: 1,
        marker: {
            symbol: 'circle',
        },
        color: 'rgba(124,181,236, 1)',
        animation: {
            duration: 2000
        },
        point: {
            events: {
                click: function () {
                    userHistory.push({
                        time: Date.now() - startTime,
                        event: 'delete',
                        point: [this.x, this.y]
                    });

                    if (this.series.data.length > 1 && this.x > 0) {
                        this.remove();
                    }
                }
            }
        },
        events: {
            mouseOver: function () {
                if (typeof container != 'undefined')
                    container.mouseOverUserData = true;
            },
            mouseOut: function () {
                if (typeof container != 'undefined')
                    container.mouseOverUserData = false;
            }
        },
    };

    var traceSeries = {
        id: 'trace',
        data: [[-7, 0], [-6, 0]],  // invisible
        enableMouseTracking: false,
        draggableX: true,
        dragMaxX: 16,
        dragMinX: -3.5,
        draggableY: true,
        dragMaxY: MAX_Y,
        dragMinY: MIN_Y,
        marker: {
            symbol: 'circle',
        },
        color: 'rgba(124,181,236, 0.4)',
    };

    /* X AXIS PLOT LINES */
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

    plotSeriesSettings = {
        series: {
            stickyTracking: false,
            showInLegend: false
        }
    };

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

    xAxisSettings = {
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

    plotBand = {
        from: -5,
        to: 0,
        color: '#e6e6e6',
    };

    yAxisSettings = {
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

    /* TOOLTIP */
    tooltipSettings = {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderWidth: 0,
        shadow: false,
        headerFormat: '',
        pointFormatter: function () {
            return '<b>'+ num2time(this.x, true) + ': ' + Highcharts.numberFormat(this.y, 1) +'%</b><br/>';
        },
        hideDelay: 0
    };

    /* HIGHCHARTS OPTIONS */
    $('#container').highcharts({
        chart: chartSettings,
        title: {
            text: EMOTIONS[index][0],
            style: {
                fontSize: '25px'
            }
        },
        subtitle: {
            text: EMOTIONS[index][1]
        },
        xAxis: xAxisSettings,
        yAxis: yAxisSettings,
        tooltip: tooltipSettings,
        plotOptions: plotSeriesSettings,
        credits: false,
        series: [
            userDataSeries
        ]
    });

    var userChart = $('#container').highcharts();

    /* CHART OF TRACE */
    var traceChartSettings = {
        chart: {
            type: 'line',
            animation: false,
            marginTop: 90,   // Should match the Y value subtracted from trace
            marginLeft: 80,  // Should match the X value subtracted from trace
            backgroundColor:'rgba(255, 255, 255, 0.002)'
        },
        title: {
            text: ''
        },
        xAxis: {    // matches the margin of the other chart
            title: {
                text: 'Time',
                style: {
                    color: 'rgba(255, 255, 255, 0.002)',
                    fontSize: '13px',
                    fontWeight: 'bold'
                }
            },
            labels: {
                formatter: function() { return num2time(this.value, false); },
                style: {
                    color: 'rgba(255, 255, 255, 0.002)',
                    fontSize: '13px'
                }
            },
            gridLineWidth: 0,
            tickInterval: 1,
            min: -3.5,
            max: 16.3,
            plotBands: [plotBand]
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 0,
            min: MIN_Y,
            max: MAX_Y,
            tickInterval: 10
        },
        series: [
            traceSeries
        ],
        plotOptions: {
            series: {
                stickyTracking: false,
                showInLegend: false
            }
        },
        tooltip: tooltipSettings,
        credits: false,
    };

    $('#trace-container').highcharts(traceChartSettings, function(chart) {
        // This callback function executes after the charts are loaded
        startTime = Date.now();  // reset time
    });

    /* END OF HIGHCHARTS OPTIONS*/


    /* BUTTONS */

    function reset_data() {
        container.userSeries.setData([0, 0, 0, 0, 0]);
        userChart.get('user-data').remove();
        userChart.addSeries(userDataSeries);

        container.userSeries = userChart.get('user-data');
    }


    $('#resetBtn').click(function() {
        reset_data();
        userHistory.push({
            time: Date.now() - startTime,
            event: 'reset',
            point: null
        });
    });


    $('#nextBtn').click(function () {

        // Validate
        if (!validate_chart(userChart, userHistory)) {
            return;
        }

        // Get data
        for (var pt in series.data) {
            var x = series.data[pt].x;
            data.push([x, series.data[pt].y, num2time(x)]);
        }

        // Test adding missing points
        // var pts = get_all_points(data);
        // for (var i in pts) {
        //     if (!find_point_in_series(pts[i][0], series)) {
        //         series.addPoint([pts[i][0], pts[i][1]]);
        //     }
        // }
        // return;

        userHistory.push({
            time: Date.now() - startTime,
            event: 'next',
            point: null
        });

        // Save data to firebase
        var newDataKey = firebase.database().ref().child(userId).push().key;
        var path = '/' + userId + '/' + newDataKey + '/';
        var updates = {};
        updates[path + 'emotion'] = userChart.options.title.text;
        updates[path + 'original_data'] = data;
        updates[path + 'full_data'] = get_all_points(data);
        updates[path + 'history'] = userHistory;
        firebase.database().ref().update(updates).then(function() {
            // After saving, go to next or finish
            index += 1;
            if (index < EMOTIONS.length) {
                userChart.setTitle({ text: EMOTIONS[index][0] }, { text: EMOTIONS[index][1] });
                reset_data();
                // reset history and time
                userHistory.length = 0;
                startTime = Date.now();
            } else {
                // Show the final page
                $('#experiment-page').addClass("hidden");
                $('#finish-page').removeClass("hidden");
            }
        });
    });
});

var index = 0;


/* HELPER FUNCTIONS */

function shuffleArray(array) {
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

function findPointInSeries(x, series) {
    // Given an X value, return the point if found or null if not
    for (var pt in series.data) {
        if (series.data[pt].x == x) {
            unique = false;
            return series.data[pt];
        }
    }
    return null;
}

/* END OF HELPER FUNCTIONS */


$(function () {
    if (RANDOMIZE) {
        shuffleArray(EMOTIONS);
    }


    /* HIGHCHARTS SERIES */

    var userDataSeries = {
        id: 'user-data',
        // data: [[0, 0]],
        data: [0, 0, 0, 0, 0],
        pointStart: -4,
        draggableY: true,
        dragMaxY: 50,
        dragMinY: -50,
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
                    if (this.series.data.length > 1 && this.x > 0) {
                        this.remove();
                    }
                }
            }
        },
        events: {
            mouseOver: function () {
                chart.mouseOverUserData = true;
            },
            mouseOut: function () {
                chart.mouseOverUserData = false;
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
        dragMaxY: 79.9,
        dragMinY: -19.9,
        marker: {
            symbol: 'circle',
        },
        color: 'rgba(124,181,236, 0.4)',
    };

    /* X AXIS LINES */
    var xAxisPlotLines = [
        {
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
    }

    /* HIGHCHARTS OPTIONS */

    $('#container').highcharts({
        chart: {
            type: 'line',
            animation: false,
            marginTop: 90,   // Should match the Y value subtracted from trace
            marginLeft: 80,  // Should match the X value subtracted from trace
            events: {
                click: function (e) {
                    // find the clicked values and the series
                    var x = Math.round(e.xAxis[0].value),
                        y = e.yAxis[0].value,
                        series = $('#container').highcharts().get('user-data');

                    var point = findPointInSeries(x, series);
                    if (point) {
                        point.update(y);
                    } else if (x > 0) {
                        series.addPoint([x, y]);
                    }
                }
            }
        },
        title: {
            text: EMOTIONS[index][0],
            style: {
                fontSize: '25px'
            }
        },
        subtitle: {
            text: EMOTIONS[index][1]
        },
        xAxis: {
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
            plotBands: [{
                from: -5,
                to: 0,
                color: '#e6e6e6',
            }],
            plotLines: xAxisPlotLines
        },
        yAxis: {
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
                style: {
                    color: '#384755',
                    fontSize: '13px'
                }
            },
            min: -20,
            max: 80,
            plotLines: [{
                color: '#adadad',
                width: 3,
                value: 0
            }],
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            borderWidth: 0,
            shadow: false,
            headerFormat: '',
            pointFormatter: function () {
                return '<b>'+ num2time(this.x, true) + ': ' + Highcharts.numberFormat(this.y, 1) +'</b><br/>';
            },
            hideDelay: 500
        },
        plotOptions: {
            series: {
                stickyTracking: false,
                showInLegend: false
            }
        },
        credits: false,
        series: [
            userDataSeries,
            traceSeries
        ]
    });

    
    var chart = $('#container').highcharts();


    /* END OF HIGHCHARTS OPTIONS*/


    /* BUTTONS */

    function resetData() {
        chart.userSeries.setData([0, 0, 0, 0, 0]);
        chart.get('user-data').remove();
        chart.addSeries(userDataSeries);

        chart.userSeries = chart.get('user-data');
    }


    $('#resetBtn').click(resetData);


    $('#nextBtn').click(function () {
        // Validate
        var series = chart.get('user-data'),
            data = [];
        var lastPt = findPointInSeries(16, series);
        if (!lastPt) {
            chart.xAxis[0].addPlotLine({
                id: 'warning-line',
                value: 16,
                color: 'red',
                width: 1.5,
            });

            alert('Please rate the emotional intensity in the second month.');

            setTimeout(function () {
                chart.xAxis[0].removePlotLine('warning-line');
            }, 1000);
            return;
        }

        // save data
        for (var pt in series.data) {
            var x = series.data[pt].x;
            data.push([num2time(x), x, series.data[pt].y]);
        }
        console.log(EMOTIONS[index][0]);
        console.log(data);

        // Go to next or finish
        index += 1;
        if (index < EMOTIONS.length) {
            chart.setTitle({ text: EMOTIONS[index][0] }, { text: EMOTIONS[index][1] });
            resetData();
        } else {
            alert('Finished!');
        }
    });
});

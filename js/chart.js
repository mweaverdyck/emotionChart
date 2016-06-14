index = 0;


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

function num2time(num) {
    // convert numbers to reasonable time
    if (num === 0) {
        return 0;
    }
    if (num < 2) {
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
        default: return num;
    }
}

/* END OF HELPER FUNCTIONS */


$(function () {
    if (RANDOMIZE) {
        shuffleArray(EMOTIONS);
    }


    /* HIGHCHARTS OPTIONS */

    userDataSeries = {
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
        // events: {
        //     mouseOver: function () {
        //         console.log('over');
        //     },
        //     mouseOut: function () {
        //         console.log('out');
        //     }
        // }
    };


    $('#container').highcharts({
        chart: {
            type: 'line',
            animation: false,
            events: {
                click: function (e) {
                    // find the clicked values and the series
                    var x = Math.round(e.xAxis[0].value),
                        y = e.yAxis[0].value,
                        series = $('#container').highcharts().get('user-data');

                    var unique = true;
                    for (var pt in series.data) {
                        if (series.data[pt].x == x) {
                            unique = false;
                            series.data[pt].update(y);
                            break;
                        }
                    }
                    if (unique && x > 0) {
                        series.addPoint([x, y]);
                    }
                }
            }
        },
        title: {
            text: EMOTIONS[index][0]
        },
        subtitle: {
            text: EMOTIONS[index][1]
        },
        xAxis: {
            crosshair: true,
            gridLineWidth: 1,
            title: {
                text: 'Time'
            },
            tickInterval: 1,
            labels: {
                formatter: function() { return num2time(this.value); },
            },
            minPadding: 0.2,
            maxPadding: 0.2,
            min: -3.5,
            max: 16,
            plotBands: [{
                from: -5,
                to: 0,
                color: '#e6e6e6',
            }]
        },
        yAxis: {
            title: {
                text: 'Intensity'
            },
            crosshair: true,
            gridLineWidth: 1,
            minPadding: 0.2,
            maxPadding: 0.2,
            min: -50,
            max: 50,
            plotLines: [{
                color: '#d3d3d3',
                width: 3,
                value: 0
            }],
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 0,
            shadow: false,
            headerFormat: '',
            pointFormatter: function () {
                return '<b>'+ num2time(this.x) + ': ' + Highcharts.numberFormat(this.y, 1) +'</b><br/>';
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
        {
            id: 'trace',
            data: [[-7, 0], [-6, 0], [-5, 0]],  // invisible
            enableMouseTracking: false,
            draggableX: true,
            dragMaxX: 16,
            dragMinX: 0,
            draggableY: true,
            dragMaxY: 49.9,
            dragMinY: -49.9,
            marker: {
                symbol: 'circle',
            },
            color: 'rgba(124,181,236, 0.3)'
        }/*, {
            data: [0, 0, 0, 0, 0, 0],
            pointStart: -5,
            marker: {
                symbol: 'circle',
            },
            color: '#7CB5EC',
            animation: {
                duration: 2000
            }
        }*/]
    });

    
    var chart = $('#container').highcharts();

    /* END OF HIGHCHARTS OPTIONS*/


    /* BUTTONS */

    function resetData() {
        var series = chart.get('user-data');
        series.remove();
        userDataSeries.data = [0, 0, 0, 0, 0];
        chart.addSeries(userDataSeries);
    }


    $('#resetBtn').click(resetData);


    $('#nextBtn').click(function () {
        // Save current data,
        var series = chart.get('user-data'),
            data = [];
        for (var pt in series.data) {
            // console.log([pt, num2time(series.data[pt].x), series.data[pt].x]);
            data.push([num2time(series.data[pt].x), series.data[pt].x]);
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

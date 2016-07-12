/*
 * Author: Meng Du
 * Date: Jun 17, 2016
 */

$(function () {
    // PREVENT CLOSING WINDOW
    window.onbeforeunload = function() {
        if (hookWindow) {
            return "Do you want to leave this page? Changes you made will not be saved.";
        }
    }

    // INITIALIZE FIREBASE
    var config = {
        apiKey: "AIzaSyBMrJXC5YQaPTdcGrcLXdxlzStYjsMgiAU",
        authDomain: "emotion-dynamics.firebaseapp.com",
        databaseURL: "https://emotion-dynamics.firebaseio.com",
        storageBucket: "",
    };
    firebase.initializeApp(config);

    //   Anonymous Authentication
    var firebaseUid;
    firebase.auth().signInAnonymously().then(function(user) {
        firebaseUid = user.uid;
        console.log('Signed in as ' + firebaseUid);


        // save participant id to firebase user
        var parameters = window.location.search.substring(1);
        if (parameters.length > 0) {
            hookWindow = true;
            var userId = parameters.split("=")[1];  // get id from url parameter
            firebase.database().ref('/' + firebaseUid).set({
                id: userId
            });
        } else {
            // no parameter, assume it's practice (surprise)
            // hide title and next button
            $('#container').highcharts().setTitle({
                text: 'Surprise',
                style: {
                    color: 'rgba(255, 255, 255, 0.002)'
                }
            });
            $('#nextBtn').hide();
            // reset index
            emotion_index = 0;
        }
    });

    // EXPERIMENT SETTINGS
    if (RANDOMIZE) {
        shuffle_array(EMOTIONS);
    }

    var chartClickFunc = function (e) {
        // find the clicked values and the series
        var x = Math.round(e.xAxis[0].value),
            y = e.yAxis[0].value;
        var series = $('#container').highcharts().get('user-data');

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


    /* HIGHCHARTS OPTIONS */
    $('#container').highcharts({
        chart: chartSettings,
        title: {
            text: EMOTIONS[emotion_index][0],
            style: {
                fontSize: '25px'
            }
        },
        subtitle: {
            text: EMOTIONS[emotion_index][1]
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
        var data = [];
        var series = $('#container').highcharts().get('user-data');
        for (var pt in series.data) {
            var x = series.data[pt].x;
            data.push([x, series.data[pt].y, num2time(x, true)]);
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
        var newDataKey = firebase.database().ref().child(firebaseUid).push().key;
        var path = '/' + firebaseUid + '/' + newDataKey + '/';
        var updates = {};
        updates[path + 'emotion'] = userChart.options.title.text;
        updates[path + 'original_data'] = data;
        updates[path + 'full_data'] = get_all_points(data);
        updates[path + 'history'] = userHistory;
        firebase.database().ref().update(updates).then(function() {
            // After saving, go to next or finish
            emotion_index += 1;
            if (emotion_index < EMOTIONS.length) {
                userChart.setTitle({ text: EMOTIONS[emotion_index][0] }, { text: EMOTIONS[emotion_index][1] });
                reset_data();
                // reset history and time
                userHistory.length = 0;
                startTime = Date.now();
            } else {
                // Show the final page
                $('#experiment-page').addClass("hidden");
                $('#finish-page').removeClass("hidden");
                hookWindow = false;
            }
        });
    });
});

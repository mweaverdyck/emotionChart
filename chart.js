$(function () {
    $('#container').highcharts({
        chart: {
            type: 'line',
            animation: false,
            events: {
                click: function (e) {
                    // find the clicked values and the series
                    var x = e.xAxis[0].value,
                        y = e.yAxis[0].value,
                        series = this.series[0];

                    // var unique = true;
                    // for (var pt in series.data) {
                    //     if (series.data[pt].x == x) {
                    //         unique = false;
                    //         break;
                    //     }
                    // }
                    // if (unique) {

                    if (x > 0) {
                        series.addPoint([x, y]);
                    }
                }
            }
        },
        title: {
            text: 'Surprise'
        },
        subtitle: {
            text: 'Draw it'
        },
        xAxis: {
            gridLineWidth: 1,
            tickInterval: 1,
            title: {
                text: 'Time'
            },
            minPadding: 0.2,
            maxPadding: 0.2,
            min: -4.5,
            max: 50,
            plotBands: [{
                from: -5,
                to: 0,
                color: '#e6e6e6',
            }]
        },
        yAxis: {
            gridLineWidth: 1,
            minPadding: 0.2,
            maxPadding: 0.2,
            min: -50,
            max: 50,
            plotLines: [{
                color: '#d3d3d3',
                width: 3,
                value: 0
            }]
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderWidth: 0,
            shadow: false,
            headerFormat: '',
            pointFormat: '<b>{point.y}</b><br/>',
            pointFormatter: function () { return '<b>'+ Highcharts.numberFormat(this.y, 1) +'</b><br/>'; },
            hideDelay: 50
        },
        plotOptions: {
            series: {
                stickyTracking: false,
                showInLegend: false,
            },
            // line: {
                // cursor: 'ns-resize'
            // }
        },
        series: [{
            name: 'Value',
            data: [0],
            draggableY: true,
            dragMaxY: 50,
            dragMinY: -50,
            pointStart: 0,
            marker: {
                symbol: 'circle',
            },
            color: '#7CB5EC',
            point: {
                events: {
                    click: function () {
                        if (this.series.data.length > 1) {
                            this.remove();
                        }
                    }
                }
            },
        }, {
            name: 'Value',
            data: [0, 0, 0, 0, 0, 0],
            pointStart: -5,
            marker: {
                symbol: 'circle',
            },
            color: '#7CB5EC'
        }]
    });
});
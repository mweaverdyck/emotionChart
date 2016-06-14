(function (Highcharts) {

    function findNeighbors(x) {
        // Given an x value, return one or two neighbor points in user data
        var userSeries = $('#container').highcharts().get('user-data'),
            left = null,
            right = null;

        for (var pt in userSeries.data) {
            ptX = userSeries.data[pt].x;
            if (ptX < x && (!left || x - ptX < x - left.x)) {
                left = userSeries.data[pt];
            }
            if (ptX > x && (!right || ptX - x < right.x - x)) {
                right = userSeries.data[pt];
            }
        }
        return [left, right];
    }

    Highcharts.Chart.prototype.callbacks.push(function (chart) {

        // Get points and boundaries
        var traceSeries = $('#container').highcharts().get('trace'),
            dragPoint = traceSeries.data[1],
            leftPoint = traceSeries.data[0],
            rightPoint = traceSeries.data[2];
            minX = Highcharts.pick(traceSeries.options['dragMinX'], undefined),
            maxX = Highcharts.pick(traceSeries.options['dragMaxX'], undefined),
            minY = Highcharts.pick(traceSeries.options['dragMinY'], undefined),
            maxY = Highcharts.pick(traceSeries.options['dragMaxY'], undefined);


        function mouseMove(e) {
            e.preventDefault();

            var originalEvent = e.originalEvent || e,
                dragX = originalEvent.changedTouches ? originalEvent.changedTouches[0].pageX : e.pageX,
                dragY = originalEvent.changedTouches ? originalEvent.changedTouches[0].pageY : e.pageY;

            // console.log([dragX, dragY]);
            // console.log([dragPoint.plotX, dragPoint.plotY]);
            // dragX = dragPoint.plotX, dragY = dragPoint.plotY;
            console.log(e);

            var newX = /*Math.round(*/traceSeries.xAxis.toValue(e.offsetX, true),
                newY = /*Math.round(*/traceSeries.yAxis.toValue(e.offsetY, true);

            // console.log([newX, newY]);
            // console.log([(newX < minX || newX > maxX), (newY < minY || newY > maxY)]);

            var invalid = (newX < minX || newX > maxX) || (newY < minY || newY > maxY);

            var evtArgs = {
                    invalid: invalid,
                    x: invalid ? -6 : newX,
                    y: invalid ? 0 : newY,
                    left: leftPoint,
                    right: rightPoint
                };

            dragPoint.firePointEvent(
                'drag',
                evtArgs,
                function () {
                    var kdTree,
                        series = dragPoint.series;

                    dragPoint.update(evtArgs, false);

                    neighbors = findNeighbors(evtArgs.x);
                    // Left
                    if (evtArgs.invalid) {
                        evtArgs.left.update({x: -7, y: 0}, false);  // invisible
                    } else {
                        evtArgs.left.update({x: neighbors[0].x, y: neighbors[0].y}, false);
                    }
                    // Right
                    if (evtArgs.invalid) {
                        evtArgs.right.update({x: -5, y: 0}, false);  // invisible
                    } else {
                        if (neighbors[1]) {
                            evtArgs.right.update({x: neighbors[1].x, y: neighbors[1].y}, false);
                        } else {
                            evtArgs.right.update({x: neighbors[0].x, y: neighbors[0].y}, false);    // same as left
                        }
                    }

                    if (chart.tooltip && !evtArgs.invalid) {
                        chart.tooltip.refresh(chart.tooltip.shared ? [dragPoint] : dragPoint);
                    }

                    if (series.stackKey) {
                        chart.redraw();
                    } else {
                        kdTree = series.kdTree;
                        series.redraw();
                        series.kdTree = kdTree;
                    }
                }
            );
        }

        Highcharts.addEvent(container, 'mousemove', mouseMove);
        Highcharts.addEvent(container, 'touchmove', mouseMove);
    });
}(Highcharts));
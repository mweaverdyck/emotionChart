(function (Highcharts) {

    function findNeighbors(x,userSeries) {
        // Given an x value, return one or two neighbor points in user data
        var left = null,
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
        chart.userSeries = $('#container').highcharts().get('user-data'),
        chart.traceSeries = $('#container').highcharts().get('trace'),
        chart.dragPoint = chart.traceSeries.data[1],
        chart.leftPoint = chart.traceSeries.data[0],
        chart.rightPoint = chart.traceSeries.data.length > 2 ? traceSeries.data[2] : null;
        chart.minX = Highcharts.pick(chart.traceSeries.options['dragMinX'], undefined),
        chart.maxX = Highcharts.pick(chart.traceSeries.options['dragMaxX'], undefined),
        chart.minY = Highcharts.pick(chart.traceSeries.options['dragMinY'], undefined),
        chart.maxY = Highcharts.pick(chart.traceSeries.options['dragMaxY'], undefined),
        chart.mouseOverUserData = false;


        function mouseMove(e) {
            e.preventDefault();

            var originalEvent = e.originalEvent || e,
                dragX = originalEvent.changedTouches ? originalEvent.changedTouches[0].clientX : e.clientX,
                dragY = originalEvent.changedTouches ? originalEvent.changedTouches[0].clientY : e.clientY,
                userSeries = chart.userSeries,
                traceSeries = chart.traceSeries,
                dragPoint = chart.dragPoint,

                newX = Math.round(traceSeries.xAxis.toValue((e.clientX-70), true)),  // matches marginLeft(70)
                newY = traceSeries.yAxis.toValue((e.clientY-70), true);              // matches marginTop(70)

            chart.rightPoint = traceSeries.data.length > 2 ? traceSeries.data[2] : null;

            var invalid = chart.mouseOverUserData || (newX < chart.minX || newX > chart.maxX) || (newY < chart.minY || newY > chart.maxY);

            var evtArgs = {
                invisible: invalid,
                x: newX,
                y: newY,
                left: chart.leftPoint,
                right: chart.rightPoint
            };

            dragPoint.firePointEvent(
                'drag',
                evtArgs,
                function () {
                    if (evtArgs.invisible && traceSeries.visible) {
                        traceSeries.hide();
                    } else if (!evtArgs.invisible && !traceSeries.visible) {
                        traceSeries.show();
                    }
                    var kdTree;

                    dragPoint.update(evtArgs, false);

                    neighbors = findNeighbors(evtArgs.x, userSeries);
                    // Left
                    if (neighbors[0]) {
                        evtArgs.left.update({x: neighbors[0].x, y: neighbors[0].y}, false);
                    } else {
                        evtArgs.left.update({x: -99, y: 0}, false);
                    }
                    // Right
                    if (neighbors[1]) {
                        if (evtArgs.right) {
                            evtArgs.right.update({x: neighbors[1].x, y: neighbors[1].y}, false);
                        } else {
                            traceSeries.addPoint([neighbors[1].x, neighbors[1].y]);
                        }
                    } else if (evtArgs.right) {
                        evtArgs.right.remove();
                    }

                    if (chart.tooltip && !evtArgs.invisible) {
                        chart.tooltip.refresh(chart.tooltip.shared ? [dragPoint] : dragPoint);
                    }

                    if (traceSeries.stackKey) {
                        chart.redraw();
                    } else {
                        kdTree = chart.traceSeries.kdTree;
                        traceSeries.redraw();
                        traceSeries.kdTree = kdTree;
                    }
                }
            );
        }

        Highcharts.addEvent(container, 'mousemove', mouseMove);
        Highcharts.addEvent(container, 'touchmove', mouseMove);
    });
}(Highcharts));
/*
 * Author: Meng Du
 * Date: Jun 17, 2016
 */

(function (Highcharts) {

    function findNeighbors(x, userSeries) {
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
        if (Highcharts.charts.length < 2) {
            return;  // skip it unless both charts are ready
        }

        // Get points and boundaries
        var userSeries = $('#container').highcharts().get('user-data'),
            traceSeries = $('#trace-container').highcharts().get('trace'),
            dragPoint = traceSeries.data[1],
            leftPoint = traceSeries.data[0],
            rightPoint = traceSeries.data.length > 2 ? traceSeries.data[2] : null,
            minX = Highcharts.pick(traceSeries.options['dragMinX'], undefined),
            maxX = Highcharts.pick(traceSeries.options['dragMaxX'], undefined),
            minY = Highcharts.pick(traceSeries.options['dragMinY'], undefined),
            maxY = Highcharts.pick(traceSeries.options['dragMaxY'], undefined);
        container.mouseOverUserData = false;


        function mouse_move(e) {
            e.preventDefault();

            var originalEvent = e.originalEvent || e,
                dragX = originalEvent.changedTouches ? -98 : e.clientX,
                dragY = originalEvent.changedTouches ? 0 : e.clientY,
                newX = Math.round(traceSeries.xAxis.toValue((e.clientX-80), true)),  // matches marginLeft
                newY = traceSeries.yAxis.toValue((e.clientY-90), true);              // matches marginTop

            rightPoint = traceSeries.data.length > 2 ? traceSeries.data[2] : null;

            var invalid = container.mouseOverUserData || (newX < minX || newX > maxX) || (newY < minY || newY > maxY);

            var evtArgs = {
                invisible: invalid,
                x: newX,
                y: newY,
                left: leftPoint,
                right: rightPoint
            };

            dragPoint.firePointEvent(
                'drag',
                evtArgs,
                function () {
                    if (evtArgs.invisible && traceSeries.visible) {
                        traceSeries.hide();
                        chart.tooltip.hide();
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
                        kdTree = traceSeries.kdTree;
                        traceSeries.redraw();
                        traceSeries.kdTree = kdTree;
                    }
                }
            );
        }

        Highcharts.addEvent(container, 'mousemove', mouse_move);
    });
}(Highcharts));

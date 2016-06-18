function get_missing_points(x1, y1, y2, num) {
    // Given x1, y1, y2 (assuming x1 < x2) and number of missing points,
    // return an array of the missing points
    var missingPts = [];
    for (var i = 1; i <= num; ++i) {
        missingPts.push([x1 + i, y1 + (y2 - y1) * i/(num + 1)]);
    }
    return missingPts;
}

function get_all_points(points) {
    // Given an array of at least two points [[x1, y1, ...], [x2, y2, ...], ...]
    // ordered by X, calculate the missing ones
    var results = [points[0]];
    for (var i = 1; i < points.length; ++i) {
        var current = points[i],
            last = points[i-1];
        if (current[0] > last[0] + 1) {
            var missingPts = get_missing_points(last[0], last[1], current[1], current[0] - last[0] - 1);
            for (var j in missingPts) {
                results.push(missingPts[j]);
            }
        }
        results.push(current);
    }
    return results;
}
/*
 * Author: Meng Du
 * Date: Jun 17, 2016
 */

$(document).ready(function() {
    window.addEventListener('message', function(event) {
        // if (event.origin.indexOf(DOMAIN) === -1) {  // Unknown data origin
        //     return;
        // }

        if (event.data === 'next') {
            // trigger the next button
            var valid = validate_chart($('#container').highcharts(), userHistory);
            // return results to parent
            window.parent.postMessage(valid ? 'true' : 'false', '*');
        }
    });
});
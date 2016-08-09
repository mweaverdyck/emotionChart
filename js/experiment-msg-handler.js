/*
 * Author: Meng Du
 * Date: Jun 17, 2016
 */

$(document).ready(function() {
    window.addEventListener('message', function(event) {
        console.log([event.origin, DOMAIN]);
        if (event.origin.indexOf(DOMAIN) === -1) {  // Unknown data origin
            console.log('?');
            return;
        }

        if (event.data === 'next') {
            // trigger the next button
            var valid = validate_chart($('#container').highcharts(), userHistory);
            // return results to parent
            window.parent.postMessage(valid ? 'true' : 'false', '*');
        }
    });
});

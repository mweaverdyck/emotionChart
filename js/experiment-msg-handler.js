$(document).ready(function() {
    window.addEventListener('message', function(event) {
        // if (event.origin.indexOf(DOMAIN) === -1) {  // Unknown data origin
        //     return;
        // }

        if (event.data === 'hide') {
            // Chart is on instruction page: remove title and next button
            $('#container').highcharts().setTitle({
                text: 'Surprise',
                style: {
                    color: 'rgba(255, 255, 255, 0.002)'
                }
            });
            $('#nextBtn').hide();
            index = 0;
        }
        else if (event.data === 'next') {
            // trigger the next button
            var valid = validate_chart($('#container').highcharts(), userHistory);
            // return results to parent
            window.parent.postMessage(valid ? 'true' : 'false', '*');
        }
    });
});
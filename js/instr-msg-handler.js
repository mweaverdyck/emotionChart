$(document).ready(function() {
    window.addEventListener('message', function(event) {
        // if (event.origin.indexOf('') === -1) {  // Unknown data origin TODO
        //     return;
        // }

        if (event.data === 'instruction') {
            // Chart is on instruction page: remove title and next button
            $('#container').highcharts().setTitle({ text: '' });
            $('#nextBtn').hide();
            index = 0;
        }
    });
});
/*
 * Author: Meng Du
 * Date: Jun 17, 2016
 */

$(document).ready(function() {
    window.addEventListener('message', function(event) {
        if (event.origin.indexOf(DOMAIN) === -1) {  // Unknown data origin
            return;
        }

        if (event.data === 'true') {
            window.scrollTo(0, 0);
            $('#page-2').hide();
            $('#page-3').show();
            $('#next-btn').hide();
        }
    });
});

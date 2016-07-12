/*
 * Author: Meng Du
 * Date: Jun 17, 2016
 */

$(document).ready(function() {
    window.addEventListener('message', function(event) {
        // if (event.origin.indexOf(DOMAIN) === -1) {  // Unknown data origin
        //     return;
        // }

        if (event.data === 'true') {
            $('#page-2').addClass("hidden");
            $('#page-3').removeClass("hidden");
            $('#next-btn').addClass("hidden");
        }
    });
});

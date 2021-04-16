/*jshint browser:true */
/*!
* ResponsiveVideos 1.1
*
* Copyright 2017, Mozello
*
*/

;(function( $ ){

    'use strict';

    $.fn.responsiveVideos = function( options ) {
        var settings = {
        };

        if ( options ) {
            $.extend( settings, options );
        }

        return this.each(function(){
            var selectors = [
                'iframe[src*="player.vimeo.com"]',
                'iframe[src*="youtube.com"]',
                'iframe[src*="youtube-nocookie.com"]',
                'iframe[src*="kickstarter.com"][src*="video.html"]',
                'iframe[src*="facebook.com"][src*="video.php"]',
                'object',
                'embed'
            ];

            if (settings.customSelector) {
                selectors.push(settings.customSelector);
            }

            var ignoreList = '.responsivevideosignore';

            if(settings.ignore) {
                ignoreList = ignoreList + ', ' + settings.ignore;
            }

            var $allVideos = $(this).find(selectors.join(','));
            $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
            $allVideos = $allVideos.not(ignoreList); // Disable on this video.

            $allVideos.each(function() {
                if ($(this).attr('height') && $(this).attr('width')) {
                    var width_s = $(this).attr('width');
                    var height_s = $(this).attr('height');
                    var width = (width_s.indexOf('%') === -1) ? parseInt(width_s, 10) : 0;
                    var height = (height_s.indexOf('%') === -1) ? parseInt(height_s, 10) : 0;
                    var ratio = 0;
                    try {
                        ratio = height / width;
                    } catch(e) {
                        ratio = 0;
                    }
                    if (ratio && width && height) {
                        $(this)
                            .data('aspectRatio', ratio)
                            .data('maxWidth', width)
                            // and remove the hard coded width/height
                            .removeAttr('height')
                            .removeAttr('width');
                    }
                }
            });

            function resizeVideos() {
                $allVideos.each(function() {
                    var $el = $(this);
                    // Get parent width of this video
                    var newWidth = $el.parent().width();
                    if ($el.data('maxWidth')) {
                        if (newWidth > $el.data('maxWidth')) {
                            newWidth = $el.data('maxWidth');
                        }
                    }
                    if ($el.data('aspectRatio')) {
                        $el
                            .width(newWidth)
                            .height(newWidth * $el.data('aspectRatio'));
                    }
                });
            }

            // When the window is resized
            $(window).resize(function() {
                // Resize all videos according to their own aspect ratio
                resizeVideos()

            // Kick off one resize to fix all videos on page load
            });

            resizeVideos();
        });
    };

})( window.jQuery );
$(document).ready(function () {

    if (isSmallTouchDevice()) {
        createMobileMenu();
        initMobileShopCategories();
    } else {
        initRegularShopCategories();
        enableCascadingMenuTouch();
        if (document.fonts) {
            document.fonts.ready.then(function () {
                initHeaderLayoutHelper();
                initFixedMenu();
            });
        } else {
            initHeaderLayoutHelper();
            initFixedMenu();
        }
    }

    var fancyButtons = [
              //'slideShow',
              //'fullScreen',
              'thumbs',
              'close'
    ];

    // Opens online store pictures in fancy box

    if (typeof $.fancybox != 'undefined') {
        $('.mz_catalog a.fancy').fancybox({
            buttons : fancyButtons
        });
    }

    if (!$('body').hasClass('backend')) {

        // Opens Gallery Pictures in a Fancybox.
        if (typeof $.fancybox != 'undefined') {
            $('ul.moze-gallery.pictures li a').fancybox({
                buttons : fancyButtons
            });
        }

        // Removes overlay if it is empty
        var olay = $('#bigbar-overlay:not(.persistent)');
        if (olay.length) {
            if ($.trim(olay.find('.moze-wysiwyg-editor:visible').text()) == '') {
                olay.css('background-color', 'transparent');
            }
        }
    }

    // On RTL languages swaps sidebar position

    if ($('body').hasClass('mz_rtl')) {
        $('#sidebar-wrap').toggleClass('sidebar-reverse');
    }

    // Detect thumbnail image layout

    $('.mz_catalog .cat-thumb-pic img').one('load', function() {
        if ($(this).width() < $(this).height()) {
            $(this).addClass('portrait');
        }
        if ($(this).height() / $(this).width() < 0.66) {
            $(this).addClass('wider');
        } else if ($(this).height() / $(this).width() > 1.5) {
            $(this).addClass('taller');
        }
    }).each(function() {
        if (this.complete && typeof $(this).attr('src') != 'undefined') {
            $(this).trigger('load');
        }
    });

    // Adjusts the title font size for images.

    var adjustFont = function () {
        var fontSize = $('.moze-gallery-overlay').width();
        var maxSize = parseInt($('body').css('font-size'));
        fontSize = Math.min(fontSize * 0.09, maxSize);
        $('.moze-gallery-overlay').css('font-size', fontSize);
    };

    adjustFont();
    $(window).resize(function () {
        adjustFont();
    });

    // Color specific adjustments

    colorSchemeUpdated();

    // Add Google Maps.

    function processMaps() {
        if ($('.moze-maps').length > 0) {
            var doc_lang = $('body').attr('lang');
            if (!doc_lang) {
                doc_lang = 'en';
            }
            //$.getScript("//maps.google.com/maps/api/js?key=AIzaSyCbQd3r9wS61hmQYZrv4ZdbDJo2Q0h3k7g&v=3.exp&callback=DynamicMapApiLoaded&language=" + doc_lang, function () { });
            doProcessMaps(doc_lang);
        }
    }

    function doProcessMaps(lang) {
        $('.moze-maps').each(function () {
            initializeEmbedMap($(this), lang);
        });
    }

    if (!$('body').hasClass('backend')) {
        processMaps();
    }

    // Loads MozBanner.

    if (!$('body').hasClass('backend')) {
        $('.mz_banner').mozbannerplay({});
    }

    // Fixes IE flexbox bug

    if (isIE() && $('.bigbar-overlay-container').length) {
        $('.bigbar-overlay-container').css('height', $('.bigbar-overlay-container').outerHeight());
    }

    initCart();
    initSearchbox();
    loadSocialIcons();

});

// Mobile detection

function isTouchDevice() {
    return 'ontouchstart' in window;
};

function isSmallScreen() {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (w <= 750 || h <= 500);
}

function isSmallTouchDevice() {
    return (isTouchDevice() && isSmallScreen());
}

function isMobileDevice() {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i) ||
        navigator.userAgent.match(/IEMobile/i)
    ) {
        return true;
    } else {
        return false;
    }
}

function isIE() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");
    // If IE, return version number.
    if ((Idx > 0) || !!navigator.userAgent.match(/Trident\/7\./)) {
        return true;
    } else {
        return false;
    }
}

// Google Maps stuff.

function initializeEmbedMap(jqelem, lang) {
    var query = jqelem.data('query');
    var zoom = jqelem.data('zoom');

    // legacy customers and custom locations
    if (!query || query == '') {
        query = jqelem.data('lat') + ',' + jqelem.data('lng');
    }

    var src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCbQd3r9wS61hmQYZrv4ZdbDJo2Q0h3k7g&q=' + query + '&zoom=' + zoom + '&language=' + lang;
    map = $('<iframe frameborder="0" style="border:0" allowfullscreen>');
    map.addClass('moze-maps');
    map.css('height', jqelem.css('height'));
    map.css('width', jqelem.css('width'));
    map.attr('src', src);
    jqelem.replaceWith(map);
}

// Img to svg

function loadInlineSvg(filter) {
    // Load necessary svg icons
    jQuery(filter).each(function(){
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');
            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            // Replace image with new SVG
            $img.replaceWith($svg);
        }, 'xml');
    });
}

// Inject CSS

function injectCssCode(cssCode, cssMedia, cssId) {
    if (cssId) {
        $('#' + cssId).remove();
        var css_output = '<style id="' + cssId + '">';
    } else {
        var css_output = '<style>';
    }
    if (cssMedia) {
        css_output =  css_output + cssMedia + ' {';
    }
    css_output =  css_output + cssCode;
    if (cssMedia) {
        css_output =  css_output + '}';
    }
    css_output = css_output + '</style>';
    // Append color styles
    $('head').append(css_output);
}

// Color processing

function colorToHex(color)
{
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    if (color == "transparent" || color === false) {
        return "#FFFFFF";
    }
    if (color.search("rgb") == -1) {
        return color;
    }
    else {
        color = color.match(/^rgb(?:a)?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)$/);
        if (color == null || (color.length > 4 && color[4] == "0")) {
            return "#FFFFFF";
        }
        return "#" + hex(color[1]) + hex(color[2]) + hex(color[3]);
    }
}

function getColorOpacity(color) {
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    if (color == "transparent" || color === false) {
        return 0;
    }
    if (color.search("rgb") == -1) {
        return 1;
    }
    else {
        color = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)$/);
        if (color != null) {
            return color[4];
        } else {
            return 1;
        }
    }
}

function getElementColor(elem, text) {
    if (text) {
        colortype = text;
    } else {
        colortype = 'background-color';
    }
    if (elem.length) {
        var color = elem.css(colortype);
        if (color != 'transparent' && color != 'rgba(0, 0, 0, 0)' && color != 'rgba(0,0,0,0)') {
            return color;
        }
    }
    return false;
}

function isGoodContrast(hexcolor1, hexcolor2) {
    return (Math.abs(getColorLightness(hexcolor1) - getColorLightness(hexcolor2)) >  70);
}

function getColorLightness(hexcolor)  // 0 - 255
{
    if (hexcolor.charAt(0) != '#')
        return false;
    hexcolor = hexcolor.substr(1, 6);
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq;
    //return yiq >= 128;
}

/* Color detection from design */

function getDirectHeaderBackground() {
    var headerBackgroundColor = getElementColor($('#header'));
    if (!headerBackgroundColor) headerBackgroundColor = getElementColor($('#header').parents('#top'));
    if (!$('body').hasClass('transparent-header')) {
        if (!headerBackgroundColor) headerBackgroundColor = getElementColor($('#header').parents('#wrap'));
        if (!headerBackgroundColor) headerBackgroundColor = getElementColor($('body'));
        if (!headerBackgroundColor) headerBackgroundColor = '#FFFFFF';
    }
    return headerBackgroundColor;
}

function getDirectMenuBackground() {
    var menuBackgroundColor = getElementColor($('#menu > ul'));
    if (!menuBackgroundColor) menuBackgroundColor = getElementColor($('#menu'));
    if (!menuBackgroundColor) menuBackgroundColor = getElementColor($('#menubox'));
    return menuBackgroundColor;
}

function colorSchemeUpdated() {
    // Removes or adds banner overlay padding for transparency
    // if overlay exists and this is small square overlay (not full-width) and it is transparent
    if ($('#bigbar-overlay').length && $('.overlay-with-buttons').length && $('#header').length) {
        if (!getElementColor($('#bigbar-overlay')) && ($('#bigbar-overlay').outerWidth() < ($('#header').outerWidth() - 200)) ) {
            $('#bigbar-overlay').css('padding-left', '0').css('padding-right', '0');
        } else {
            $('#bigbar-overlay').css('padding-left', '').css('padding-right', '');
        }
    }

    // Updates floating menu colors - transitions should be disabled at this moment
    initFixedMenuColors();

    // put other color customization related refresh stuff here
}
window.colorSchemeUpdated = colorSchemeUpdated;

/* Menu logic */

function menuAddOpenerLogic(menuBox, menuOpenerElement) {
    menuOpenerElement.on('click', function () {
        $(menuBox).css('top', $('body').css('margin-top'));
        $(menuBox).removeClass('visible');
        $(menuBox).show();
        setTimeout(function(){
            $(menuBox).addClass('visible');
        }, 5);
    });
}

function menuAddCloseLogic(menuBox, ulElement) {
    var menu_closer = $('<li><a><img src="' + FRONTEND_CDN + '/designs/_shared/css/icons/icon-close.svg"></a></li>');
    menu_closer.addClass('mobile-menu-closer');
    $(ulElement).prepend(menu_closer);
    menu_closer.on('click', function () {
        $(menuBox).hide();
    });
}

function menuMakeFoldable(ulContainer) {

    var arrow_unfold = $('<span><img src="' + FRONTEND_CDN + '/designs/_shared/css/icons/icon-unfold.svg"></span>').addClass('mobile-menu-arrow').addClass('unfold');
    var arrow_fold = $('<span><img src="' + FRONTEND_CDN + '/designs/_shared/css/icons/icon-fold.svg"></span>').addClass('mobile-menu-arrow').addClass('fold');
    arrow_unfold.on('click', function(e) {
        e.preventDefault();
        $(this).parent().parent().addClass('expanded');
    });
    arrow_fold.on('click', function(e) {
        e.preventDefault();
        $(this).parent().parent().removeClass('expanded');
    });

    $(ulContainer + ' > ul > li > a').each(function(e){
        if ($(this).siblings('ul').length) {
            $(this).append(arrow_unfold.clone(true, true));
            $(this).append(arrow_fold.clone(true, true));
        }
    });

    /*** Lastmost selected class ***/
    $(ulContainer + ' ul li.selected').each(function(e){
        if ($(this).find('.selected').length == 0) {
            $(this).addClass('current-item');
        }
    });

}

// Normal menu helper for touch devices

function enableCascadingMenuTouch() {

    // opens submenus on single tap, default action happens on second tap
    $('#menu ul li a').on('touchend', function(e) {
        var submenu = $(this).parent().children('ul');
        if (!$('body').hasClass('mobile-header') && submenu.length) {
            // can not use is(:visible) due to iOS bug firing CSS hover and setting visible before any events
            if (!submenu.hasClass('touch-opened')) {
                e.preventDefault();
                // hide all
                $('#menu ul ul').css('display', '').removeClass('touch-opened');
                // show this branch
                $(this).parents('#menu ul ul').show().addClass('touch-opened');
                submenu.show().addClass('touch-opened');
            }
        }
    });

    // closes menu on touch outside
    $(document).on('touchstart', function(e) {
        if (!$(e.target).parents('#menu > ul').length) {
            $('#menu ul ul').css('display', '').removeClass('touch-opened');
        }
    });

}

// Mobile menu loader

function createMobileMenu() {

    /*** Add menu and language menu buttons ***/

    var hasMenu = ($('#menu ul').length > 0);
    var hasLanguages = ($('#languages ul').length > 0);

    // Create languages button
    var languages_opener = $('<div id="languages-opener"><img src="' + FRONTEND_CDN + '/designs/_shared/css/icons/icon-globe.svg"></div>');
    languages_opener.addClass('mobile-menu-opener');
    $('#header').append(languages_opener);


    if (hasLanguages) {

        // Menu logic
        menuAddOpenerLogic('#languages', languages_opener);
        menuAddCloseLogic('#languages', '#languages ul');

    } else {
        languages_opener.css('visibility', 'hidden');
    }

    // Create menu button
    var menu_opener = $('<div id="menu-opener"><img src="' + FRONTEND_CDN + '/designs/_shared/css/icons/icon-menu.svg"></div>');
    menu_opener.addClass('mobile-menu-opener');
    $('#header').append(menu_opener);


    if (hasMenu) {

        // Menu logic
        menuAddOpenerLogic('#menu', menu_opener);
        menuAddCloseLogic('#menu', '#menu > ul');
        menuMakeFoldable('#menu');

    } else {
        menu_opener.css('visibility', 'hidden');
    }

    /*** Adjust logo ***/

    $('#top #title img').one('load', function() {
        if ($(this).width()/$(this).height() < 1.75) {
            $(this).addClass('tall');
        }
    }).each(function() {
        if (this.complete && typeof $(this).attr('src') != 'undefined') {
            $(this).trigger('load');
        }
    });

    /*** Add scroll events ***/


    if (document.fonts) {
        document.fonts.ready.then(function () {
            var last_known_scroll_position = 0;
            var elem = $('#header').parent();
            var floating_top = $('body').css('margin-top');
            var header_height = null; // Due to iOS specifics, calculate header height only after scrolling has begin and not here

            $(window).scroll(function(e) {
                if (!header_height) header_height = $('#header').outerHeight();
                if ((window.scrollY > 3) && (last_known_scroll_position > window.scrollY)) {
                    $('#header').addClass('floating').css('top', floating_top);
                    elem.css('padding-top', header_height);
                } else {
                    $('#header').removeClass('floating').css('top', 0);
                    elem.css('padding-top', '');
                }
                last_known_scroll_position = window.scrollY;
            });
        });
    }


    /*** IMG to SVG conversion ***/

    // Load necessary svg icons
    loadInlineSvg('.mobile-menu-opener img, .mobile-menu-closer img, .mobile-menu-arrow img');

    if (hasMenu || hasLanguages) {

        $('#header').append($('<div id="mobile-menu-bar">').addClass('mobile-menu-opener'));

        // Get burger icon color
        var burgerIconColor;
        var directMenuBackgroundColor = getDirectMenuBackground();
        var headerBackgroundColor = getDirectHeaderBackground();

        // Try to get from menu, if menu has no background
        if (!directMenuBackgroundColor) {
            burgerIconColor = getElementColor($('#menu > ul > li:not(.selected) > a'), 'color');
        }

        // If burger icon not set, try to get it from title and make sure contrast is ok
        if (!burgerIconColor) {
            // Get from title only if title has no background
            var titleBgColor = getElementColor($('#title .mz_wysiwyg'));
            if (!titleBgColor) titleBgColor = getElementColor($('#title'));
            if (!titleBgColor) burgerIconColor = getElementColor($('#title .mz_wysiwyg'), 'color');
            // Only do the smart-ass detection if we are not over image where we obviously can do nothing
            if (!$('#title').parents('#bigbar-overlay').length) {
                // We must have header background and title color
                if (headerBackgroundColor && burgerIconColor) {
                    // Now let's check if detected contrast is ok
                    if (!isGoodContrast(colorToHex(headerBackgroundColor), colorToHex(burgerIconColor))) {
                        // Depending on results we either enforce light or dark icons
                        if (getColorLightness(colorToHex(burgerIconColor)) < 128) {
                            burgerIconColor = '#FFFFFF';
                        } else {
                            burgerIconColor = '#222222';
                        }
                    }
                }
            }
        }

        // If not, get from languages
        if (!burgerIconColor) {
            burgerIconColor = getElementColor($('#languages li:not(.selected) > a'), 'color');
        }

        // If all else failed, black
        if (!burgerIconColor) burgerIconColor = '#222222';

        // Get menu colors
        var itemColor = getElementColor($('#menu > ul > li > a'), 'color');;
        var itemSelectedColor = getElementColor($('#menu > ul > li.selected > a'), 'color');
        var itemSelectedBackgroundColor = getElementColor($('#menu > ul > li.selected > a'));
        var menuBackgroundColor = directMenuBackgroundColor;
        if (!menuBackgroundColor) menuBackgroundColor = headerBackgroundColor;
        if (menuBackgroundColor) menuBackgroundColor = colorToHex(menuBackgroundColor); // To drop the opacity of transparent color detected

        // Looks like menu is on image background, pickt darg or light background then for floating menu
        if (!menuBackgroundColor) {
            if (getColorLightness(colorToHex(itemColor)) < 128) {
                menuBackgroundColor = '#FFFFFF';
            } else {
                menuBackgroundColor = '#222222';
            }
        }

        // Poor contrast detected, fallback to default scheme
        if (!isGoodContrast(menuBackgroundColor, colorToHex(itemColor))) {
            menuBackgroundColor = '#FFFFFF';
            itemColor = '#8F8F8F';
            itemSelectedColor = '#222222';
            itemSelectedBackgroundColor = 'transparent';
        }

        // Build CSS

        var css_output =
        '.mobile-header #menu, .mobile-header #languages { background-color: ' + menuBackgroundColor + '}' +
        '.mobile-header #menu ul li a, .mobile-header #languages ul li a { color: ' + itemColor + ' !important; background-color: transparent !important}' +
        '.mobile-header #menu ul li.current-item > a, .mobile-header #languages ul li.selected > a { color: ' + itemSelectedColor + ' !important}' +
        '#menu .mobile-menu-closer svg *, #languages .mobile-menu-closer svg *, #menu .mobile-menu-arrow svg * { fill: ' + itemColor + '}' +
        '.mobile-menu-opener svg * { fill: ' + burgerIconColor + '}';
        // If original background not known or too transparent, pick a matching background
        if (!headerBackgroundColor || getColorOpacity(headerBackgroundColor) < 0.5) {
            if (getColorLightness(colorToHex(burgerIconColor)) < 128) {
                headerBackgroundColor = '#FFFFFF';
            } else {
                headerBackgroundColor = '#222222';
            }
            // Override title color to match already known safe burger color
            css_output = css_output + '.mobile-header #header.floating #title .mz_wysiwyg { color: ' + burgerIconColor + '}';
        }
        css_output = css_output + '.mobile-header #header.floating { background-color: ' + headerBackgroundColor + '}';
        if (itemSelectedBackgroundColor) {
            css_output = css_output + '.mobile-header #menu ul li.current-item > a, .mobile-header #languages ul li.selected > a { background-color: ' + itemSelectedBackgroundColor + ' !important}';
            css_output = css_output + '.mobile-header #menu ul li.current-item svg *, .mobile-header #languages ul li.selected svg * { background-color: ' + itemSelectedColor + '}';
        } else if (itemColor == itemSelectedColor) {
            css_output = css_output + '.mobile-header #menu ul li.current-item > a, .mobile-header #languages ul li.selected > a { outline: 1px solid ' + itemColor + ' !important}';
        }
        injectCssCode(css_output, '@media screen and (max-width:750px), screen and (max-height:500px)');

        /*** General preparations ***/

        $('body').addClass('mobile-header');
        $('#menu li.selected').addClass('expanded');

    }

}

// Initialize regular shop categories

function initRegularShopCategories() {
    var submenuSubcats = $('#submenu ul li.selected ul');
    if (submenuSubcats.length) {
        $('#submenu').append(submenuSubcats);
    } else {
        submenuSubcats = $('#submenu ul li ul li.selected');
        if (submenuSubcats.length) {
            $('#submenu').append(submenuSubcats.parent());
        }
    }
}

// Initialize online store category browser

function initMobileShopCategories() {

    function getDirectSubmenuBackground() {
        var submenuBackground = getElementColor($('#submenu'), 'background-color');
        if (!submenuBackground) submenuBackground = getElementColor($('#submenu').parents('#wrap'));
        if (!submenuBackground) submenuBackground = getElementColor($('body'));
        if (!submenuBackground) submenuBackground = '#FFFFFF';
        return submenuBackground;
    }

    var sideCategories = $('.mz_catalogcategories > ul');
    var doShow = false;

    // Move side categories to #submenu
    if (sideCategories.length) {

        if ($('#submenu > ul').length) {
            $('#submenu > ul').replaceWith(sideCategories);
        } else {
            $('#submenu').append(sideCategories);
        }
        $('.mz_catalogcategories').remove();

        doShow = true;
    }

    // Show sublevels
    $('#submenu ul ul li.selected').parent().show();

    if ($('#submenu > ul > li').length) {

        // Get breadcrumb text for opener
        var selectedCategory = $('#submenu li.selected > a');

        var breadCrumb = 'Menu';
        if ($('#menu li.selected > a').length) breadCrumb = $('#menu li.selected > a').text();

        if (selectedCategory.length) {
            breadCrumb = selectedCategory.text();
            selectedCategory = selectedCategory.parents('#submenu > ul > li:not(.selected)');
            if (selectedCategory.length) {
                breadCrumb = selectedCategory.children('a').text() + ' &gt; ' + breadCrumb;
            }
        }

        // Create opener
        var iconFolder =  FRONTEND_CDN + '/designs/_shared/css/icons/';
        var submenuOpener = $('<div id="submenu-opener"><span>' + breadCrumb + '</span><img src="' + iconFolder + 'icon-unfold.svg"></div>');
        $('#submenu').prepend(submenuOpener);

        // Make foldable
        menuAddOpenerLogic('#submenu > ul', submenuOpener);
        menuAddCloseLogic('#submenu > ul', '#submenu > ul');
        menuMakeFoldable('#submenu');

        // Load icons inline
        loadInlineSvg('#submenu img');

        // Detect colors
        var menuBackgroundColor = getDirectSubmenuBackground();
        var itemColor = getElementColor($('#submenu ul li:not(.selected) > a'), 'color');
        var itemSelectedColor = getElementColor($('#submenu ul li.selected > a'), 'color');
        var itemSelectedBackgroundColor = getElementColor($('#submenu ul li.selected > a'), 'background-color');

        // Fallback if something failed
        if (!itemColor || !menuBackgroundColor || !isGoodContrast(colorToHex(menuBackgroundColor), colorToHex(itemColor))) {
            menuBackgroundColor = '#FFFFFF';
            itemColor = '#8F8F8F';
            itemSelectedColor = '#222222';
            itemSelectedBackgroundColor = '#FFFFFF';
        }

        $('#submenu-opener').css('border-color', itemColor);
        $('#submenu-opener').css('color', itemColor);
        $('#submenu-opener').css('fill', itemColor);

        // Build color CSS
        var css_output =
        '.mobile-header #submenu ul { background-color: ' + menuBackgroundColor + '}' +
        '.mobile-header #submenu ul li a { color: ' + itemColor + '}' +
        '.mobile-header #submenu ul li.selected > a { color: ' + itemSelectedColor + '}' +
        '#submenu svg * { fill: ' + itemColor + '}';
        if (itemSelectedBackgroundColor) {
            css_output = css_output + '.mobile-header #submenu ul li.selected > a { background-color: ' + itemSelectedBackgroundColor + '}';
            css_output = css_output + '.mobile-header #submenu li.selected svg * { fill: ' + itemSelectedColor + '}';
        } else if (itemColor == itemSelectedColor) {
            css_output = css_output + '.mobile-header #submenu ul li.selected > a { outline: 1px solid ' + itemColor + '}';
        }
        injectCssCode(css_output, '@media screen and (max-width:750px), screen and (max-height:500px)');

        if (doShow) {
            $('#submenu').show();
        }

    }

}

// Internal Mozello stuff

if (window.addEventListener) {
    window.addEventListener("message", receiveMessage, false);
}


function isExternalLinkOrImage(url) {
    var general_urls = new RegExp("(http|https)\:\/\/[^\.]+.[^\.]+", "g");
    var exclude_urls = new RegExp("^(http|https)\:\/\/(www\.)?(mozello|youtube|facebook|twitter)\.[a-z]{2,3}(\/|$)", "g");
    var content_urls = new RegExp("^(http|https)\:\/\/site\-[0-9]+\.mozfiles\.com", "g");
    if (url.match(general_urls) && !url.match(exclude_urls) && !url.match(content_urls)) {
        return true;
    }
    return false;
}

function isExternalScript(script) {

    if (typeof script == 'undefined' || script == '') {
        return false;
    }

    var link = document.createElement("a"),
        hostname = '';

    link.href = script;
    hostname = link.hostname;

    var generalUrls = new RegExp('(http|https)\:\/\/[^\.]+.[^\.]+', 'g');
    var excludeUrls = new RegExp('(mozello.com|mozfiles.com|dss4hwpyv4qfp.cloudfront.net|youtube.com|facebook.com|twitter.com|googleapis.com)$', 'g');

    if (typeof hostname != 'undefined' && hostname != '') {
        return script.match(generalUrls) && !hostname.match(excludeUrls);
    }
    else {
        return false;
    }
}

function receiveMessage(event)
{
    var knownOrigins = [
        'http://mozello.local',
        'http://www.mozello.com',
        'https://www.mozello.com'
    ];

    if (knownOrigins.indexOf(event.origin) != -1) {
        if (event.data == 'highlight-links') {
            $('.mz_editable img').each(function () {
                var url = $(this).attr('src').trim();
                if (isExternalLinkOrImage(url)) {
                    $(this).css('border', '4px dotted blue');
                }
            });
            $('.mz_editable a').each(function () {
                var url = $(this).attr('href').trim();
                if (isExternalLinkOrImage(url)) {
                    $(this).css('border-bottom', '4px dotted red');
                    $(this).find('img').css('border-bottom', '4px dotted red');
                }
            });
        }
        if (event.data == 'detect-scripts') {
            var detected = false;
            $('script, iframe').each(function() {
                var script = $(this).attr('src');
                if (isExternalScript(script)) {
                    console.log('External script detected: ', script);
                    if (!detected) {
                        var guruEyesOnly = $('#guruEyesOnly');
                        if (guruEyesOnly.length == 0) {
                            guruEyesOnly = $('<div id="guruEyesOnly">').html('Scripts detected.&nbsp;');
                            $('body').append(guruEyesOnly);
                        }
                        else {
                            guruEyesOnly.html(guruEyesOnly.html() + '<br>Scripts detected.&nbsp;');
                        }
                    }
                    detected = true;
                }
            });
        }
    }
}

/**
 * Cart
 */

// Show side widget loader

function initShopWidget()
{
    var cartCode = $('#shopbar');

    // Search action

    $('#shopbar-search').click(function() {
        if ($('#shopbar-search .open').is(':visible')) {
            $('#shopbar-search .open').hide();
            $('#shopbar-search .close').css('display', 'block');
            $('#shopbar-searchform').show();
            $('#shopbar-searchform input').focus();
        } else {
            $('#shopbar-search .open').show();
            $('#shopbar-search .close').hide();
            $('#shopbar-searchform').hide();
        }
    });

    // Load icons inline

    loadInlineSvg('#shopbar img');

    // Set colors

    $('#shopbar').addClass('moze-button-large'); // Add button class for color testing
    var backgroundColor = getElementColor($('#shopbar'), 'background-color');
    var foregroundColor = getElementColor($('#shopbar'), 'color');
    var borderRadius = $('#shopbar').css('border-radius');
    $('#shopbar').removeClass('moze-button-large'); // Remove button class

    if (!backgroundColor || !foregroundColor) {
        backgroundColor = '#000000';
        foregroundColor = '#FFFFFF';
    }
    $('#shopbar').css('border-radius', borderRadius);
    $('#shopbar, #shopbar-searchform').css('background-color', backgroundColor);
    $('#shopbar .separator').css('background-color', foregroundColor);
    $('#shopbar').css('color', foregroundColor);
    $('#shopbar').css('fill', foregroundColor);

    // Show processed widget

    $('#shopbar').show();
}

// Initialize sliding out side cart for shop

function initShopSidecart()
{
    var sidecartPanel = $('#shopbar-sidecart');

    // Add opening and close logic

    menuAddOpenerLogic('#shopbar-sidecart', $('#shopbar-cart'));
    $('#shopbar-sidecart-close').on('click', function () {
        sidecartPanel.hide();
    });

    // Load icons inline

    loadInlineSvg('#shopbar-sidecart .close');

    // Set colors

    var foregroundColor = getElementColor($('div.mz_catalogcart td'), 'color');
    var backgroundColor = getElementColor($('.container'), 'background-color');
    if (!backgroundColor) backgroundColor = getElementColor($('#main'), 'background-color');
    if (!backgroundColor) backgroundColor = getElementColor($('#wrap'), 'background-color');
    if (backgroundColor) {
        sidecartPanel.css('background-color', backgroundColor);
    }
    $('#shopbar-sidecart-close').css('fill', foregroundColor);
}

// Initializes cart action buttons

function initCart()
{
    if (typeof typeof mozCatItem !== 'undefined' && typeof mozCatItemVariants !== 'undefined') {

        mozCatItem.stock = mozCatItem.stock_total;
        mozCatItemVariants.forEach(function(variant) {
            variant.stock = variant.stock_total;
        });

        var cartSource = $('.mz_catalogcart[data-type="catalogcart"] form.moze-form input[name^="cart_item_"]');
        if (cartSource.length == 0) {
            cartSource = $('.mz_catalogcart[data-type="catalogcartside"] form.moze-form input[name^="cart_item_"]');
        }

        cartSource.each(function() {

            var catItemID = $(this).attr('data-id');
            var catItemVariantID = $(this).attr('data-variant-id');
            var count = $(this).val();

            if (mozCatItem.id == catItemID) {

                if (catItemVariantID == 0 && mozCatItem.stock !== null) {
                    mozCatItem.stock = mozCatItem.stock - count;
                    toggleAddToCartButton(mozCatItem.stock > 0);
                }

                else if (catItemVariantID > 0) {
                    mozCatItemVariants.forEach(function(variant) {
                        if (variant.id == catItemVariantID && variant.stock !== null) {
                            variant.stock = variant.stock - count;
                            var selection = getSelectedVariant();
                            if (selection && selection.id == variant.id) {
                                toggleAddToCartButton(variant.stock > 0);
                            }
                        }
                    });
                }
            }
        });
    }

    var cartUpdateMozLiveFx = function(parameters, callback) {

        new mozLive3({
            source: {
                name: 'maincatalog',
                superglobal: 1
            },
            action: 'catalog-update-cart',
            parameters: parameters,
            response: {
                html: [
                    { name: 'maincatalogcart' },
                    { name: 'maincatalogcartside', target: '#shopbar-sidecart-base' }
                ]
            },
            errors: {
                maintenance: '{{ "erInMaintenanceMode" | saywl }}'
            },
            onComplete: function() {
                initCart();
                if (typeof callback == "function") {
                    callback();
                }
                syncCartToLocalStorage();
            }
        });
    };

    $('form.moze-form input[name^="cart_item_"]')
        .off()
        .on('change', function() {
            cartUpdateMozLiveFx({
                    cat_item_id: $(this).attr('data-id'),
                    cat_item_variant_id: $(this).attr('data-variant-id'),
                    count: Math.max(1, Math.floor($(this).val())),
                    cart_name: 'maincatalogcart'
                }
            );
            syncCartToLocalStorage();
        })
        .on('keypress', function(e) {
            if (e.keyCode == 13) {
                $('#moze-checkout-button').focus();
                return false;
            }
        });

    $('form.moze-form div.delete a')
        .off()
        .on('click', function() {

            var input = $(this).parents('td.qty').find('input[name^="cart_item_"]');
            var catItemID = input.attr('data-id');
            var catItemVariantID = input.attr('data-variant-id');

            new mozLive3({
                source: {
                    name: 'maincatalog',
                    superglobal: 1
                },
                action: 'catalog-delete-from-cart',
                parameters: {
                    cat_item_id: catItemID,
                    cat_item_variant_id: catItemVariantID,
                    cart_name: 'maincatalogcart'
                },
                response: {
                    html: [
                        { name: 'maincatalogcart' },
                        { name: 'maincatalogcartside', target: '#shopbar-sidecart-base' }
                    ]
                },
                errors: {
                    maintenance: '{{ "erInMaintenanceMode" | saywl }}'
                },
                onComplete: function() {
                    initCart();
                    var total = 0;
                    $('#shopbar-sidecart').find('input[name^="cart_item_"]').each(function() {
                        total = total + parseInt($(this).val());
                    });
                    if (total == 0) {
                        $('#shopbar-sidecart').hide();
                    }
                    syncCartToLocalStorage();
                }
            });

            if (typeof mozCatItem !== 'undefined' && typeof mozCatItemVariants !== 'undefined') {

                if (catItemID > 0 && catItemVariantID == 0) {
                    mozCatItem.stock = mozCatItem.stock_total;
                    toggleAddToCartButton(mozCatItem.stock === null || mozCatItem.stock > 0);
                }

                if (catItemID > 0 && catItemVariantID > 0) {
                    mozCatItemVariants.forEach(function(variant) {
                        if (variant.id == catItemVariantID) {
                            variant.stock = variant.stock_total;
                            var selection = getSelectedVariant();
                            if (selection.id == variant.id) {
                                toggleAddToCartButton(variant.stock === null || variant.stock > 0);
                            }
                        }
                    });
                }
            }
        });

    var lastInputInFocus = null;

    $('form.moze-form input[name^="cart_item_"]')
        .on("focusin", function() {
            lastInputInFocus = $(this);
        });

    $("#moze-checkout-button")
        .off()
        .on("click", function(e) {
            var checkoutButton = $(this);
            if (lastInputInFocus) {
                e.preventDefault();
                cartUpdateMozLiveFx({
                        cat_item_id: lastInputInFocus.attr('data-id'),
                        cat_item_variant_id: lastInputInFocus.attr('data-variant-id'),
                        count: Math.max(1, Math.floor(lastInputInFocus.val())),
                        cart_name: 'maincatalogcart'
                    },
                    function() {
                        window.location.href = checkoutButton.attr('href');
                    }
                );
                return false;
            }
        });

    // Counts the total number of products in the cart.

    var total = 0;

    $('#shopbar-sidecart').find('input[name^="cart_item_"]').each(function() {
        total = total + parseInt($(this).val());
    });

    $('#shopbar-cart span').html(total);

    // Manages showing and hiding of the sidecart.
    // Additionally, PHP does not output the sidesearch if the user is not eligible to search.

    var pageType = $('.mz_catalogsidecart').attr('data-page-type'),
        catalogLayout = $('.mz_catalogsidecart').attr('data-catalog-layout'),
        isCatalog = (pageType == 6),
        hasProductsInCart = (total > 0);

    var showSidecart = hasProductsInCart,
        showSidesearch = isCatalog;

    if (isMobileDevice()) {
        if (showSidecart) {
            $('#sidebar .mz_catalogcart').remove();
        }
        if (showSidesearch) {
            $('#sidebar .mz_catalogsearchbox').remove();
        }
    }
    else {
        if (isCatalog && catalogLayout != 'top') {
            showSidecart = false;
            showSidesearch = false;
        }
    }

    $('#shopbar-search').toggle(showSidesearch);
    $('#shopbar-cart').toggle(showSidecart);
    $('#shopbar .separator').toggle(showSidesearch && showSidecart);
}

function createUid()
{
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
        return (Math.random() * 16 | 0).toString(16);
    });
}

function isLocalStorageAvailable()
{
    if (typeof localStorage !== "undefined") {
        try {
            localStorage.setItem("featureTest", "yes");
            if (localStorage.getItem("featureTest") === "yes") {
                localStorage.removeItem("featureTest");
                return true;
            }
        }
        catch (e) {

        }
    }
    return false;
}

function setCartUID(uid)
{
    $("div.mz_catalogcart").attr("data-cart-id", uid);
    if (isLocalStorageAvailable()) {
        window.localStorage.setItem("mozCartID", uid);
    }

    new mozLive3({
        source: {
            name: 'maincatalog',
            superglobal: 1
        },
        action: 'catalog-set-cart-uid',
        parameters: {
            cart_uid: uid,
        },
        response: {},
        errors: {},
        onComplete: function () {}
    });
}

function getSessionCartUID()
{
    var sessionCartUID = $("div.mz_catalogcart").first().attr("data-cart-id");
    if (typeof sessionCartUID !== "undefined" && sessionCartUID !== "" && sessionCartUID) {
        return sessionCartUID;
    }

    return "";
}

function getLocalStorageCartUID()
{
    if (isLocalStorageAvailable()) {
        var localStorageCartUID = window.localStorage.getItem("mozCartID");
        if (typeof localStorageCartUID !== "undefined" && localStorageCartUID !== "" && localStorageCartUID) {
            return localStorageCartUID;
        }
    }

    return "";
}

function clearLocalStorageCart()
{
    if (isLocalStorageAvailable()) {
        window.localStorage.removeItem("mozCart");
        window.localStorage.removeItem("mozCartID");
    }
}

function setLocalStorageCart(cart, uid)
{
    if (isLocalStorageAvailable()) {
        window.localStorage.setItem("mozCart", JSON.stringify(cart));
        window.localStorage.setItem("mozCartID", uid);
    }
}

function getLocalStorageCart()
{
    if (isLocalStorageAvailable()) {

        var mozCart = window.localStorage.getItem("mozCart"),
            mozLocalStorageCartUID = getLocalStorageCartUID(),
            mozSessionCartUID = getSessionCartUID();

        if (mozSessionCartUID == mozLocalStorageCartUID && mozCart != null) {
            try {
                mozCart = JSON.parse(mozCart);
            }
            catch (e) {
                mozCart = [];
            }
        }
        else {
            mozCart = [];
        }

        return mozCart;
    }

    return [];
}

function getCartDataFromHtml()
{
    var mozCart = [];

    $("#shopbar-sidecart form.moze-form input[name^='cart_item_']")
        .each(function() {
            var mozCartItem = {
                id: $(this).attr("data-id"),
                text: $(this).attr("data-pref-title"),
                variant_id: $(this).attr("data-variant-id"),
                variant_text: $(this).attr("data-pref-variant"),
                count: $(this).val()
            };
            mozCart.push(mozCartItem);
        });

    return mozCart;
}

function syncCartToLocalStorage()
{
    if (isLocalStorageAvailable()) {
        setLocalStorageCart(getCartDataFromHtml(), getSessionCartUID());
    }
}

function syncLocalStorageToCart()
{
    if (isLocalStorageAvailable()) {

        var sessionCartUID = getSessionCartUID(),
            localStorageCartUID = getLocalStorageCartUID(),
            sessionCart = getCartDataFromHtml(),
            localStorageCart = getLocalStorageCart();

        if (sessionCartUID == localStorageCartUID &&
            sessionCart.length == 0 &&
            localStorageCart.length > 0) {

            new mozLive3({
                source: {
                    name: 'maincatalog',
                    superglobal: 1
                },
                action: 'catalog-add-to-cart-multi',
                parameters: {
                    cart: localStorageCart,
                    cart_name: 'maincatalogcart',
                    cart_uid: sessionCartUID,
                },
                response: {
                    callback: [
                        function(response) {
                            var json = JSON.parse(response);
                            if (json.is_valid_uid) {
                                $('.mz_component[data-name="maincatalogcart"]').html(json.output);
                                $('#shopbar-sidecart-base').html(json.output);
                            }
                            else {
                                var newCartUID = createUid();
                                setCartUID(newCartUID);
                            }
                        }
                    ]
                },
                errors: {
                    maintenance: '{{ "erInMaintenanceMode" | saywl }}'
                },
                onComplete: function () {
                    initCart();
                    if ($('#shopbar-cart').is(':visible')) {
                        $('#shopbar-cart').trigger('click');
                    }
                    syncCartToLocalStorage();
                }
            });
        }
        else {

            new mozLive3({
                source: {
                    name: 'maincatalog',
                    superglobal: 1
                },
                action: 'catalog-check-cart-uid',
                parameters: {
                    cart_uid: sessionCartUID,
                },
                response: {
                    callback: [
                        function(response) {
                            var json = JSON.parse(response);
                            if (json.result == 'invalid') {
                                var newCartUID = createUid();
                                setCartUID(newCartUID);
                            }
                        }
                    ]
                },
                errors: {},
                onComplete: function () {
                    syncCartToLocalStorage();
                }
            });
        }
    }
}

$(document).ready(function() {

    if ($(".mz_component.mz_catalog").length == 1) {

        var sessionCartUID = getSessionCartUID(),
            localStorageCartUID = getLocalStorageCartUID();

        // New cart.

        if (sessionCartUID === "" && localStorageCartUID === "") {
            setCartUID(createUid());
        }

        // Using the session cart UID, the Local Storage might be disabled.

        if (sessionCartUID !== "" && localStorageCartUID === "") {
            setCartUID(sessionCartUID);
        }

        // The cart is in the local storage.

        if (sessionCartUID === "" && localStorageCartUID !== "") {
            setCartUID(localStorageCartUID);
        }

        // Prefers the session cart UID over the Local Storage.

        if (sessionCartUID !== "" && localStorageCartUID !== "") {
            if (sessionCartUID != localStorageCartUID) {
                clearLocalStorageCart();
                setCartUID(sessionCartUID);
            }
        }

        syncLocalStorageToCart();
    }
});

/**
 * Searchbox
 */

function initSearchbox()
{
    function submitSearchbox()
    {
        var query = $('.moze-catalog-searchbox-form .search-query').val();
        query = $.trim(query);
        if (query != '') {
            window.location =
                $('.moze-catalog-searchbox-form').attr('action') +
                'params/search/' + encodeURIComponent(query.replace('/', ' ')) + '/';
        }
    }

    function submitSideSearchbox()
    {
        var query = $('.moze-catalog-searchbox-sideform .search-query').val();
        query = $.trim(query);
        if (query != '') {
            window.location =
                $('.moze-catalog-searchbox-sideform').attr('action') +
                'params/search/' + encodeURIComponent(query.replace('/', ' ')) + '/';
        }
    }

    $('.moze-catalog-searchbox-form, .moze-catalog-searchbox-sideform').submit(function(e) {
        e.preventDefault();
    });

    $('.moze-catalog-searchbox-form .search-query').keyup(function(e) {
        if (e.keyCode == 13) {
            submitSearchbox();
        }
    });

    $('.moze-catalog-searchbox-sideform .search-query').keyup(function(e) {
        if (e.keyCode == 13) {
            submitSideSearchbox();
        }
    });

    $('.moze-catalog-searchbox-form .search-btn').click(function() {
        submitSearchbox();
    });

    $('.moze-catalog-searchbox-sideform .search-btn').click(function() {
        submitSideSearchbox();
    });
}

/**
 * Fixed menu
 */

function initFixedMenuColors() {
    var isStickyNow = $('#top').hasClass('sticky');

    // temporarily remove class for proper detection
    if (isStickyNow) $('#top').removeClass('sticky');

    // get unselected menu item color
    var itemColor = getElementColor($('#menu > ul > li:not(.selected) > a'), 'color');
    // set colors for floating menu where necessary
    var bgColor = getDirectMenuBackground();
    // if no direct menu background, get it from header
    if (!bgColor) {
        bgColor = getDirectHeaderBackground();
    }

    // restore class if it was set
    if (isStickyNow) $('#top').addClass('sticky');

    // if not set or very transparent, fallback to black or white background
    if (itemColor && (!bgColor || getColorOpacity(bgColor) < 0.5)) {
        if (getColorLightness(colorToHex(itemColor)) < 128) {
            bgColor = '#FFFFFF';
        } else {
            bgColor = '#222222';
        }
    } else {
        if (bgColor) {
            bgColor = colorToHex(bgColor);
        }
    }
    // prepare color CSS
    var css_output =
    '#top.sticky:not(.legacy-sticky-menu), #top.sticky.legacy-sticky-menu #menu { background-color: ' + bgColor + '}';
    injectCssCode(css_output, '@media screen and (min-width:751px) and (min-height:501px)', 'fixed-menu-colors');
}

function initFixedMenu() {

    function analyzeLogo(logo) {
        if (logo.height() > 50) {
            $('#top').addClass('resize-logo');
        }
    }

    $('body.backend #title').on('mousedown touchstart', function() {
        if ($('#top').hasClass('sticky')) {
            window.scrollTo(0, 0);
        }
    });

    if ($('#menu').length && $('body').not('.mobile-header').length && ($('#menu').outerHeight() < 75)) {

        if ($('#header > #header-main > #menu, .legacy-sticky-menu, #header + #menubox').length) {

            // Updates floating menu colors
            initFixedMenuColors();

            var scrollThreshold, marginSize, shrinkDelta;
            var absoluteTop = ($('#top').css('position') == 'absolute');
            var isBackend = $('body').hasClass('backend');
            var legacyMenu = ($('#top.legacy-sticky-menu').length);

            if (legacyMenu) {
                $('#menu').after($('<div id="menu-placeholder"></div>'));
            }

            if (!isBackend) {
                $('#top #title img').on('load', function() {
                    analyzeLogo($(this));
                }).each(function() {
                    if(this.complete && typeof $(this).attr('src') != 'undefined') {
                        $(this).trigger('load');
                    }
                });
            }

            /* Calculates when to engage fixed mode and how much to offset body */

            function setScrollLimits() {

                if ($('#top').hasClass('sticky')) return; // do not run if scrolled

                var topOffset = $('#top').offset().top;

                // set some defaults
                scrollThreshold = topOffset;
                marginSize = topOffset + $('#top').outerHeight();
                shrinkDelta = $('#header').outerHeight() - $('#header').height(); // avoid background flicker

                var isFat = ($('body').hasClass('header-menu-centered') || $('body').hasClass('header-menu-down') || $('#top').hasClass('menu-wrapped'));
                var isSemiFat = (!isFat && $('#header-main').length && ($('#header-main').offset().top + 1 >= $('#languages').offset().top + $('#languages').outerHeight()));
                var hasMenubox = ($('#header + #menubox').length);

                $('#top').removeClass('is-fat');
                $('#top').removeClass('is-semifat');

                if (legacyMenu) {
                    scrollThreshold = $('#menu').offset().top;
                    marginSize = $('#menu').outerHeight(true);
                } else if (hasMenubox) {
                    $('#top').addClass('has-menubox');
                    scrollThreshold = topOffset + $('#header').outerHeight();
                } else if (isFat) {
                    $('#top').addClass('is-fat');
                    scrollThreshold = topOffset + $('#header').height() - $('#menu').outerHeight(true);
                } else if (isSemiFat) {
                    $('#top').addClass('is-semifat');
                    scrollThreshold = topOffset + $('#languages').outerHeight(true);
                } else if (absoluteTop) { // impress, image
                    scrollThreshold = topOffset;
                    marginSize = 0;
                } else {
                    if ($('#top').outerHeight() > 200) return false; // mission abort if the menu too big
                }

                if ($('#wrap #bigbar + #top').length) { // creator design
                    marginSize = $('#top').outerHeight();
                }

                return true;

            }

            /* initial calculations, some images may not have loaded
            and thus we recalculate later whenever stickyness state changes */

            if (!setScrollLimits()) return;

            /* this is where change to menu stickiness state happens */

            $(window).on('resize scroll', function () {

                var elem = $('#top').nextAll('div').first();
                var scrollTop = $(window).scrollTop();
                var isSticky = $('#top').hasClass('sticky');
                var becameNormal = false;

                if (elem.length) {
                    if ((scrollTop > scrollThreshold) && !isSmallScreen()) {
                        // stick
                        if (!isSticky) {
                            /* if during initial calculations some images were not loaded
                            the thresholds might not be accurate, try to recalculate
                            them here */
                            setScrollLimits();
                            if (scrollTop <= scrollThreshold)
                                return true;
                        }
                        $('#top').addClass('sticky');
                        if (legacyMenu) {
                            $('#menu-placeholder').css('height', marginSize);
                        } else if (!absoluteTop) {
                            elem.css('margin-top', marginSize);
                        }
                        if (isBackend) {
                            analyzeLogo($('#top #title img'));
                        }
                    } else {
                        // unstick
                        becameNormal = isSticky;
                        $('#top').removeClass('sticky');
                        elem.css('margin-top', '');
                        if (legacyMenu) {
                            $('#menu-placeholder').css('height', '');
                        }
                    }
                }

                if (scrollTop > (scrollThreshold + shrinkDelta)) {
                    $('#top').addClass('scrolled-deep');
                } else {
                    $('#top').removeClass('scrolled-deep');
                }

                /* if menu is no more sticky, we can recalculate thresholds
                as they might have changed (e.g. page was loaded scrolled and
                due to unloaded images we did not get a chance to get final
                calculations) */
                if (becameNormal) {
                    setScrollLimits();
                }

            });

            /* If page is already scrolled on load and our scroll event was attached
            after browser-fired onscroll already passed, let's fire our own onscroll
            to show the fixed menu */

            if ($(window).scrollTop() > 0) {
                $(window).trigger('scroll');
            }

        }

    }

}

function initHeaderLayoutHelper() {

    function manageClasses() {
        if ($('#title').length) {
            if ($('#menu').offset().top + 1 >= ($('#title').offset().top +  $('#title').outerHeight())) {
                $('#top').addClass('menu-wrapped');
            } else {
                $('#top').removeClass('menu-wrapped');
            }
        }
    }

    if ($('body').not('.mobile-header').length) {
        // determine after fonts loaded
        manageClasses();
        $(window).on('resize', function () {
            manageClasses();
        });
    }

}

function loadSocialIcons() {

    var networks = [
        'twitter',
        'facebook',
        'pinterest',
        'linkedin',
        'rss',
        'draugiem',
        'vk',
        'instagram',
        'youtube'
    ]

    networks.forEach(function (item, index) {
        var elem = $('.icon-' + item);
        if (elem.length) {
            var imgURL = FRONTEND_CDN + '/designs/_shared/css/social-icons/' + item + '.svg';
            jQuery.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');
                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');
                // Replace image with new SVG
                elem.append($svg);
            }, 'xml');
        }
    });

}

/* End */
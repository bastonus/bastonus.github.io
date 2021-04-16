/**
 *
 * MozBannerPlay
 * Represents the Mozello Banner component slideshow player.
 *
 */

(function(window, $) {

   /* Plugin Constructor */

   var MozBannerPlay = function(element, options) {
      this.element = $(element);
      this.options = options;
   };

   /* Plugin Prototype */

   MozBannerPlay.prototype = {

      /**
       * Initializes the Plugin.
       */
      init: function()
      {
         var base = this;

         base.pics         = $(base.element).find('.moze-banner.slide');
         base.currPic      = 0;
         base.fadeInSpeed  = 1000;
         base.fadeOutSpeed = 1000;
         base.images       = [];
         base.autoplay     = true;

         // Sets the initial picture.

         $(base.element).find('.moze-banner').hide();

         // Initializes buttons.

         base.initButtons();

         // Displays the default picture.

         if (base.pics.length < 1)
         {
            $(base.element).find('.moze-banner.default').show();
         }

         // Displays the only one picture in the banner.

         else if (base.pics.length == 1)
         {
            $(base.pics).first().show();
         }

         // Plays the slideshow.

         else if (base.pics.length > 1)
         {
            base.actionBannerGoTo(0);
            base.preloader = setInterval(function() { base.preloadPics(); }, 250);
            base.actionPlaySlideshow();
         }
      },

      /**
       * Initializes button actions.
       */
      initButtons: function()
      {
         var base = this;

         if (base.pics.length > 1)
         {
            $(base.element)
               .find('a.moze-banner-slide-left')
               .unbind()
               .show()
               .click(function() { base.autoplay = false; base.actionBannerGoTo(base.currPic - 1); });

            $(base.element)
               .find('a.moze-banner-slide-right')
               .unbind()
               .show()
               .click(function() { base.autoplay = false; base.actionBannerGoTo(base.currPic + 1); });
         }
         else
         {
            $(base.element)
               .find('a.moze-banner-slide-left, a.moze-banner-slide-right')
               .unbind()
               .hide();
         }
      },

      /**
       * Preloads banner pictures.
       */
      preloadPics: function()
      {
         var base = this;
         var pic  = $(base.element).find('.moze-banner.slide[data-pic]').first();

         if (pic.length > 0)
         {
            var picSrc = pic.attr('data-pic');

            var image  = new Image();
            image.src = picSrc;

            pic
               .removeAttr('data-pic')
               .css('background-image', 'url("' + image.src + '")');
         }
         else
         {
            clearInterval(base.preloader);
         }
      },

      /**
       * Slides in the specified slide.
       */
      actionBannerGoTo: function(i)
      {
         var base = this;

         if (base.pics.length > 0)
         {
            if (i > base.pics.length - 1) i = 0;
            if (i < 0) i = base.pics.length - 1;

            $(base.pics[base.currPic]).fadeOut(base.fadeOutSpeed);
            $(base.pics[i]).fadeIn(base.fadeInSpeed);

            base.currPic = i;
         }
      },

      /**
       * Plays the slideshow.
       */
      actionPlaySlideshow: function()
      {
         var base = this;
         setInterval(function() {
            if (base.autoplay) {
               base.actionBannerGoTo(base.currPic + 1);
            }
         }, 5000);
      }

   };

   /* Main Entry Point */

   $.fn.mozbannerplay = function(options) {
      return this.each(function() {
         new MozBannerPlay(this, options).init();
      });
   };

   /* End */

})(window, jQuery);
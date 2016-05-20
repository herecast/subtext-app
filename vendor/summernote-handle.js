(function(factory){
  if(typeof define==='function'&&define.amd){
    define(['jquery'],factory);
  }else if(typeof module==='object'&&module.exports){
    module.exports=factory(require('jquery'));
  }else{
    factory(window.jQuery);
  }
}(function($){
  // Copied the original Summernote "Handle.js" function
  // to extend its functionality
  $.extend($.summernote.plugins, {
    handle: function (context) {
      var self = this;

      var $document = $(document);
      var $editingArea = context.layoutInfo.editingArea;
      var options = context.options;

      this.events = {
        'summernote.mousedown': function (we, e) {
          if (self.update(e.target)) {
            e.preventDefault();
          }
        },
        'summernote.keyup summernote.scroll summernote.change summernote.dialog.shown': function () {
          self.update();
        }
      };

      this.initialize = function () {
        this.$handle = $([
          '<div class="note-handle">',
          '<div class="note-control-selection">',
          '<div class="note-control-selection-bg"></div>',
          '<div class="note-control-holder note-control-nw"></div>',
          '<div class="note-control-holder note-control-ne"></div>',
          '<div class="note-control-holder note-control-sw"></div>',
          '<div class="',
          (options.disableResizeImage ? 'note-control-holder' : 'note-control-sizing'),
          ' note-control-se"></div>',
          (options.disableResizeImage ? '' : '<div class="note-control-selection-info"></div>'),
          '</div>',
          '</div>'
        ].join('')).prependTo($editingArea);

        this.$handle.on('mousedown', function (event) {

          // Remove width25 and width50 classes from image parent to prevent restriction on scaling image
          $(context.invoke('editor.restoreTarget'))
            .parent()
            .removeClass('width25 width50');

          if ($(event.target).hasClass('note-control-sizing')) {
            event.preventDefault();
            event.stopPropagation();

            var $target = self.$handle.find('.note-control-selection').data('target'),
              posStart = $target.offset(),
              scrollTop = $document.scrollTop();

            $document.on('mousemove', function (event) {
              context.invoke('editor.resizeTo', {
                x: event.clientX - posStart.left,
                y: event.clientY - (posStart.top - scrollTop)
              }, $target, !event.shiftKey);

              self.update($target[0]);
            }).one('mouseup', function (e) {
              e.preventDefault();
              $document.off('mousemove');
              context.invoke('editor.afterCommand');
            });

            if (!$target.data('ratio')) { // original ratio.
              $target.data('ratio', $target.height() / $target.width());
            }
          }
        });
      };

      this.destroy = function () {
        this.$handle.remove();
      };

      this.update = function (target) {
        var isImage = target && target.nodeName.toUpperCase() === 'IMG';
        var $selection = this.$handle.find('.note-control-selection');

        context.invoke('imagePopover.update', target);

        if (isImage) {
          var $image = $(target);
          var pos = $image.position();

          // include margin
          var imageSize = {
            w: $image.outerWidth(true),
            h: $image.outerHeight(true)
          };

          $selection.css({
            display: 'block',
            left: pos.left,
            top: pos.top,
            width: imageSize.w,
            height: imageSize.h
          }).data('target', $image); // save current image element.

          var sizingText = imageSize.w + 'x' + imageSize.h;
          $selection.find('.note-control-selection-info').text(sizingText);
          context.invoke('editor.saveTarget', target);
        } else {
          this.hide();
        }

        return isImage;
      };

      /**
       * hide
       *
       * @param {jQuery} $handle
       */
      this.hide = function () {
        context.invoke('editor.clearTarget');
        this.$handle.children().hide();
      };
    }
  });
}));


(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function ($) {

  // Extends plugins for adding hello.
  //  - plugin is external module for customizing.
  $.extend($.summernote.plugins, {
    /**
     * @param {Object} context - context object has status of editor.
     */
    imgCaption: function (context) {
      var self = this;

      // ui has renders to build ui elements.
      //  - you can create a button with `ui.button`
      var ui = $.summernote.ui;

      // add hello button
      context.memo('button.imgCaption', function () {
        // create button
        var button = ui.button({
          contents: '<i class="fa fa-tag"/>',
          tooltip: 'Insert Caption',
          click: function () {
            let caption = document.createElement('div');
            caption.className = 'image-caption';
            caption.textContent = 'caption content here';
            context.invoke('editor.insertNode', caption);
          }
        });

        // create jQuery object from button instance.
        return button.render();
      });
    
    }
  });
}));
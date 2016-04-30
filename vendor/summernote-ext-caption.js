(function(factory){
    if(typeof define==='function'&&define.amd){
        define(['jquery'],factory);
    }else if(typeof module==='object'&&module.exports){
        module.exports=factory(require('jquery'));
    }else{
        factory(window.jQuery);
    }
}(function($){
   // Extends plugins for adding hello.
   //  - plugin is external module for customizing.
   $.extend($.summernote.plugins, {
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
             var caption = document.createElement('div');
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

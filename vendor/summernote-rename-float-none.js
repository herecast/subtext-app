(function(factory){
    if(typeof define==='function'&&define.amd){
        define(['jquery'],factory);
    }else if(typeof module==='object'&&module.exports){
        module.exports=factory(require('jquery'));
    }else{
        factory(window.jQuery);
    }
}(function($){
   $.extend(true, $.summernote.lang, {
     'en-US': {
       image: {
         floatNone: 'Center Image'
       }
     }
   });
}));
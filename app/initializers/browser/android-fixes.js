export function initialize() {
  //Fix scrolling issues with soft keyboard, input focus
  if(/Android/.test(navigator.appVersion)) {
    window.addEventListener("resize", function() {
       if(document.activeElement.tagName==="INPUT" || document.activeElement.tagName==="TEXTAREA") {
          window.setTimeout(function() {
             document.activeElement.scrollIntoView();
          },0);
       }
    });
  }

}

export default {
  name: 'android-fixes',
  initialize: initialize
};

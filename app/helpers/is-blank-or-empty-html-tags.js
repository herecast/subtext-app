import Ember from 'ember';


export function isBlankOrEmptyHtmlTags(params) {
  //params is the string, typically wrapped in <p></p> tags so never empty
  //check to see if wrapped
  let children = Ember.$("<div>" + params[0] + "</div>").children();
  //if no wraps, is the content there?
  if( children.length <= 0 && params[0].length > 0 ) { return false; }
  //if children exist, we need to make sure at least one is non empty
  var inside;
  var full = true;
  Ember.$.each(children, function(index, el){
    inside = Ember.$(el).text();
    if(inside.length > 0) {
      full = false;
      return;//out of each loop only
    }
  });
  return full;
}

export default Ember.Helper.helper(isBlankOrEmptyHtmlTags);
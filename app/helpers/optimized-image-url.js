import Ember from 'ember';
import makeOptimizedImageUrl from 'subtext-ui/utils/optimize-image-url';

export function optimizedImageUrl(params) {
  var url    = params[0];
  var width  = params[1];
  var height = params[2];
  var doCrop = params[3];

  return makeOptimizedImageUrl(url, width, height, doCrop);
}

export default Ember.Helper.helper(optimizedImageUrl);

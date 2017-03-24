import Ember from 'ember';
import makeOptimizedImageUrl from 'subtext-ui/utils/optimize-image-url';

export function optimizedImageUrl(params) {
  const url    = params[0];
  const width  = params[1];
  const height = params[2];
  const doCrop = params[3];

  return makeOptimizedImageUrl(url, width, height, doCrop);
}

export default Ember.Helper.helper(optimizedImageUrl);

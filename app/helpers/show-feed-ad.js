import Ember from 'ember';

export function showFeedAd(params) {
  const feedIndexValue = params[0];
  const showAfterIndex = 2;
  const forEachSetOf = 20;

  return feedIndexValue % forEachSetOf === showAfterIndex;
}

export default Ember.Helper.helper(showFeedAd);

import Ember from 'ember';

/**
 ** Display logic:
 ** Show the first ad in in position #4,
 ** and then every 10th position after that (ie, 4, 14, 24, etc)
**/
const offset = 3;
const showAfterEvery = 9;

export function showFeedAd(params) {
  const feedIndexValue = params[0];
  const feedPlacement = feedIndexValue + 1;

  return (feedPlacement - offset) % showAfterEvery === 0;
}

export default Ember.Helper.helper(showFeedAd);

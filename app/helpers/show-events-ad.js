import Ember from 'ember';

export function showEventsAd(params) {
  const runningIndex = params[0];

  return (runningIndex > 0 && (runningIndex === 3 || (runningIndex - 3) % 8 === 0));
}

export default Ember.Helper.helper(showEventsAd);

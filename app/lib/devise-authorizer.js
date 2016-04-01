import DeviseAuth from 'simple-auth-devise/authorizers/devise';
import Ember from 'ember';
import config from 'subtext-ui/config/environment';

export default DeviseAuth.extend({
  mixpanel: Ember.inject.service('mixpanel'),

  authorize(jqXHR, requestOptions) {
    jqXHR.setRequestHeader('Consumer-App-Uri', config['consumer-app-uri']);
    const mixpanel = this.get('mixpanel');
    const d_id = mixpanel.getDistinctId();
    // if mixpanel is not initialized yet, getDistinctId() returns undefined
    // rather than try to wait for mixpanel to finish initializing, I'm just
    // allowing a potential request to go untracked. It should -- at most -- 
    // be the user's direct visit to the site, all interactions after that
    // will be tracked according to their distinct ID
    if (typeof(d_id) !== 'undefined') {
      jqXHR.setRequestHeader('Mixpanel-Distinct-Id', d_id);
    }

    this._super(jqXHR, requestOptions);
  }
});

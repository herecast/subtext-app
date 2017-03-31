import Ember from 'ember';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';
import NoHttpCache from 'subtext-ui/mixins/routes/no-http-cache';

const { get, inject } = Ember;

export default Ember.Route.extend(NavigationDisplay, NoHttpCache, {
  intercom: inject.service('intercom'),
  hideHeader: true,
  hideFooter: true,

  activate: function() {
    this._super();
    get(this, 'intercom').doNotTrack();
  },

  deactivate: function() {
    this._super();
    get(this, 'intercom').doTrack();
  },
});

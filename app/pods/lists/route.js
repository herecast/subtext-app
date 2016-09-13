import Ember from 'ember';
import NavigationDisplay from 'subtext-ui/mixins/routes/navigation-display';

const { get, inject } = Ember;

export default Ember.Route.extend(NavigationDisplay, {
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

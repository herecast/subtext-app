import Ember from 'ember';
import TrackEvent from 'subtext-ui/mixins/track-event';

export default Ember.Controller.extend(TrackEvent, {
  queryParams: {
    scrollToAnchor: 'scrollTo'
  },
  scrollToAnchor: null,

  actions: {
    trackEventInfoClick(type) {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Event Info',
        navControl: type
      });
    },

    trackMapClick() {
      this.trackEvent('selectNavControl', {
        navControlGroup: 'Event Info',
        navControl: 'Event Map'
      });
    },

    closeEventDetailPage() {
      this.transitionToRoute('events.all');
    }
  }
});

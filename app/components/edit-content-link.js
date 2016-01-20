import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

export default Ember.Component.extend(trackEvent, {
  contentId: null,
  route: '',
  text: '',

  _getTrackingArguments(text) {
    let section = '';

    if(text.match(/Event$/)) {
      section = 'Event';
    } else if (text.match(/Listing$/)) {
      section = 'Market';
    }

    return {
      navControlGroup: 'Edit Content',
      navControl: `Edit ${section}`
    };
  }
});

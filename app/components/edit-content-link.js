import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

export default Ember.Component.extend(trackEvent, {
  contentId: null,
  route: '',
  text: '',

  _getTrackingArguments(text) {
    let section = '';
    let alias = '';

    if(text.match(/Event$/)) {
      section = 'Event';
      alias = section;
    } else if (text.match(/Listing$/)) {
      section = 'Market';
      alias = 'Listing';
    }

    return {
       navigationProperties: [section, `${section.toLowerCase()}.index`, 1],
       navigationControlProperties: ['Edit Content', `Edit ${alias}`]
    };
  }
});

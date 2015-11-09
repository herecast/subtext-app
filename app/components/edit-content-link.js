import Ember from 'ember';

export default Ember.Component.extend({
  contentId: null,
  route: '',
  text: '',
  mixpanel: Ember.inject.service('mixpanel'),
  
  actions: {
   trackEditClick(text) {
    let section = '';
    const mixpanel = this.get('mixpanel');
    const currentUser = this.get('session.currentUser');
    const props = {};
    let alias = '';
  
    if(text.endsWith('Event')) {
      section = 'Event';
      alias = section;
    } else if (text.endsWith('Listing')) {
      section = 'Market';
      alias = 'Listing';
    }
    
    Ember.merge(props, mixpanel.getUserProperties(currentUser));
    Ember.merge(props, 
       mixpanel.getNavigationProperties(section, section.toLowerCase() + '.index', 1));
    Ember.merge(props, mixpanel.getNavigationControlProperties('Edit Content', 'Edit ' + section));
    mixpanel.trackEvent('selectNavControl', props);       
   }
  }
});

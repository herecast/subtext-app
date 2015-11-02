import Ember from 'ember';

// I think we should be able to use string.startsWith() as part of ES6, but
// the tests were breaking when I ran `ember test` so I'm using this instead.
function startsWith(path, searchString) {
  const position = 0;
  return path.indexOf(searchString) === position;
}

export default Ember.Component.extend({
  mixpanel: Ember.inject.service('mixpanel'),
  path: '', // override with the application controller's currentPath

  buttonClass: function() {
    const klass = 'Button SectionNavigation-contentCreateButton btn btn-default';
    const path = this.get('path');

    if (startsWith(path, 'events')) {
      return `${klass} Button--event`;
    } else if (startsWith(path, 'market')) {
      return `${klass} Button--market`;
    } else if (startsWith(path, 'talk')) {
      return `${klass} Button--talk`;
    }
  }.property('path'),

  showButton: function() {
    const path = this.get('path');

    return startsWith(path, 'events') || startsWith(path, 'talk') ||
      startsWith(path, 'market');
  }.property('path'),

  route: function() {
    const path = this.get('path');

    return `${path.split('.')[0]}.new.details`;
  }.property('path'),

  redirectTo: function() {
    const path = this.get('path');

    return `/${path.split('.')[0]}/new/details`;
  }.property('path'),

  linkText: function() {
    const path = this.get('path');
    let contentType = '';

    if (startsWith(path, 'events')) {
      contentType = 'Event';
    } else if (startsWith(path, 'market')) {
      contentType = 'Listing';
    } else if (startsWith(path, 'talk')) {
      contentType = 'Talk';
    }

    if (this.get('media.isTablet')) {
      return `+ ${contentType}`;
    } else {
      return `Create ${contentType}`;
    }

  }.property('path', 'media.isTablet'),

  click: function(){
    const mixpanel = this.get('mixpanel');
    const currentUser = this.get('session.currentUser');
    const props = {};
    const linkText = this.get('linkText');
    let section = '';

    if (linkText.endsWith('Events')) {
      section = 'Event';
    } else if (linkText.endsWith('Listing')) {
      section = 'Market';
    } else if (linkText.endsWith('Talk')) {
      section = 'Talk';
    }
    
    Ember.merge(props, mixpanel.getUserProperties(currentUser));
    Ember.merge(props, 
       mixpanel.getNavigationProperties(section, section.toLowerCase() + '.index', 1));
    Ember.merge(props, mixpanel.getNavigationControlProperties('Create Content', 'Create ' + section));
    mixpanel.trackEvent('selectNavControl', props);       
  }
});

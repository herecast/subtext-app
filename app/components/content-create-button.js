import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

// I think we should be able to use string.startsWith() as part of ES6, but
// the tests were breaking when I ran `ember test` so I'm using this instead.
function startsWith(path, searchString) {
  const position = 0;
  return path.indexOf(searchString) === position;
}

export default Ember.Component.extend(trackEvent, {
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

    if (this.get('media.isTabletOrSmallDesktop')) {
      return `+ ${contentType}`;
    } else {
      return `Create ${contentType}`;
    }

  }.property('path', 'media.isTabletOrSmallDesktop'),

  _getTrackingArguments(linkText) {
    let section = '';
    let alias = '';

    if (linkText.match(/Event$/)) {
      section = 'Event';
      alias = section;
    } else if (linkText.match(/Listing$/)) {
      section = 'Market';
      alias = 'Listing';
    } else if (linkText.match(/Talk$/)) {
      section = 'Talk';
      alias = section;
    }

    return {
      // carrying over the route error from the original implementation
      navigationProperties: [section, `${section.toLowerCase()}.index`, 1],
      navigationControlProperties: ['Create Content', `Create ${alias}`]
    };
  }
});

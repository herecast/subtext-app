import Ember from 'ember';
import trackEvent from 'subtext-ui/mixins/track-event';

const { computed, get } = Ember;

// I think we should be able to use string.startsWith() as part of ES6, but
// the tests were breaking when I ran `ember test` so I'm using this instead.
function startsWith(path, searchString) {
  const position = 0;
  return path.indexOf(searchString) === position;
}

export default Ember.Component.extend(trackEvent, {
  path: '', // override with the application controller's currentPath

  buttonClass: computed('path', function() {
    const klass = 'Button SectionNavigation-contentCreateButton btn btn-default';
    const path = this.get('path');

    if (startsWith(path, 'news')) {
      return `${klass} Button--news`;
    } else if (startsWith(path, 'events')) {
      return `${klass} Button--event`;
    } else if (startsWith(path, 'market')) {
      return `${klass} Button--market`;
    } else if (startsWith(path, 'talk')) {
      return `${klass} Button--talk`;
    }
  }),

  showButton: computed('path', function() {
    const path = this.get('path');

    return startsWith(path, 'news') || startsWith(path, 'events') || startsWith(path, 'talk') ||
      startsWith(path, 'market');
  }),

  route: computed('path', function() {
    const path = get(this, 'path');

    if (startsWith(path, 'news')) {
      return 'news.new';
    } else {
      return `${path.split('.')[0]}.new.details`;
    }
  }),

  redirectTo: computed('path', function() {
    const path = this.get('path');

    return `/${path.split('.')[0]}/new/details`;
  }),

  linkText: computed('path', 'media.isTabletOrSmallDesktop', function() {
    const path = this.get('path');
    let contentType = '';

    if (startsWith(path, 'news')) {
      contentType = 'News';
    } else if (startsWith(path, 'events')) {
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

  }),

  _getTrackingArguments(linkText) {
    let navControlText = '';

    if (linkText.match(/News/)) {
      navControlText = 'Create News';
    } else if (linkText.match(/Event$/)) {
      navControlText = 'Create Event';
    } else if (linkText.match(/Listing$/)) {
      navControlText = 'Create Market Listing';
    } else if (linkText.match(/Talk$/)) {
      navControlText = 'Create Talk';
    }

    return {
      navControlGroup: 'Create Content',
      navControl: navControlText
    };
  }
});

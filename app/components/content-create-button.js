import Ember from 'ember';
import TestSelector from 'subtext-ui/mixins/components/test-selector';

const { computed, get } = Ember;

// I think we should be able to use string.startsWith() as part of ES6, but
// the tests were breaking when I ran `ember test` so I'm using this instead.
function startsWith(path, searchString) {
  const position = 0;
  return path.indexOf(searchString) === position;
}

export default Ember.Component.extend(TestSelector, {
  'data-test-component': "content-create-button",

  path: '', // override with the application controller's currentPath
  canPublishNews: null,

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

    return get(this, 'canPublishNews') || startsWith(path, 'events') || startsWith(path, 'talk') ||
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

  })
});

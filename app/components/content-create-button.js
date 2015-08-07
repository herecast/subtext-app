import Ember from 'ember';

// I think we should be able to use string.startsWith() as part of ES6, but
// the tests were breaking when I ran `ember test` so I'm using this instead.
function startsWith(path, searchString) {
  const position = 0;
  return path.indexOf(searchString) === position;
}

export default Ember.Component.extend({
  classNames: ['SectionNavigation-contentCreateButton'],
  session: Ember.inject.service('session'),
  path: '', // override with the application controller's currentPath

  buttonClass: function() {
    const klass = 'Button btn btn-default';
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

    return startsWith(path, 'events') || startsWith(path, 'talk');
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

    if (startsWith(path, 'events')) {
      return 'Create Event';
    } else if (startsWith(path, 'market')) {
      return 'Create Listing';
    } else if (startsWith(path, 'talk')) {
      return 'Create Talk';
    }
  }.property('path')
});

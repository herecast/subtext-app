import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-Title',
  classNameBindings: ['sold:sold-tag-active'],

  postedTime: false,
  title: null,
  sold: false,
  isLoggedIn: false,
  contentType: computed.reads('model.normalizedContentType'),

  useLink: computed('isLoggedIn', 'contentType', function() {
    if ( !get(this, 'isLoggedIn') && get(this, 'contentType') === 'talk') {
      return false;
    }

    return true;
  })
});

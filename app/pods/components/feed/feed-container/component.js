import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['FeedContainer'],
  classNameBindings: ['noMargin:FeedContainer-no-margin'],
  'data-test-component': 'feed-container',

  noMargin: false
});

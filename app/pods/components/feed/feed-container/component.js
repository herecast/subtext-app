import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['FeedContainer'],
  classNameBindings: ['noMargin:FeedContainer-no-margin'],

  noMargin: false
});

import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['FeaturedContent'],
  classNameBindings: ['horizontal:FeaturedContent--horizontal'],

});

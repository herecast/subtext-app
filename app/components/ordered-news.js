import Ember from 'ember';
import ExpandableContent from '../mixins/components/expandable-content';

export default Ember.Component.extend(ExpandableContent, {
  news: [],

  content: function () {
    return this.get('news').sortBy('publishedAt');
  }.property('news.@each.publishedAt'),

  firstItem: function() {
    return this.get('contentToDisplay')[0];
  }.property('contentToDisplay.[]'),

  restOfContent: function() {
    return this.get('contentToDisplay').slice(1);
  }.property('contentToDisplay.[]')


});
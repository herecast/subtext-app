import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['Card', 'NewsCard', 'u-flexColumn'],
  classNameBindings: ['missingContent:hidden'],
  hasImage: Ember.computed.notEmpty('item.imageUrl'),

  missingContent: Ember.computed.empty('item'),

  date: function() {
    return moment(this.get('item.publishedAt')).format('L');
  }.property('item.publishedAt'),

  content: function() {
    const text = this.get('item.content');
    const tmp = document.createElement("div");

    tmp.innerHTML = text;

    return tmp.textContent;
  }.property('item.content')
});

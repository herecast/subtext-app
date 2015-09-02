import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['Card', 'NewsCard', 'u-flexColumn'],
  showImage: true,
  displayImage: Ember.computed.and('hasImage', 'showImage'),
  hasImage: Ember.computed.notEmpty('item.imageUrl'),
  refreshParam: Ember.inject.service('refresh-param'),

  date: function() {
    return moment(this.get('item.publishedAt')).format('L');
  }.property('item.publishedAt'),

  backgroundImage: function() {
    const url = this.get('item.imageUrl');
    const styles = `background-image: url(${url})`;

    return new Ember.Handlebars.SafeString(styles);
  }.property('item.imageUrl'),

  content: function() {
    const text = this.get('item.content');
    const tmp = document.createElement("div");

    tmp.innerHTML = text;

    return tmp.textContent;
  }.property('item.content')
});

import Ember from 'ember';

const { get } = Ember;

export default Ember.Component.extend({
  classNames: 'FeedCard-Title',
  classNameBindings: ['sold:sold-tag-active', 'showToggleSold:sold-tag-active'],

  model: null,
  postedTime: false,
  title: null,
  sold: false,
  showToggleSold: false,
  isLoggedIn: false,
  linkToDetailIsActive: true,
  onContentClick() {},

  actions: {
    toggleSold() {
      this.toggleProperty('sold');
      get(this, 'model').save();
    }
  }
});

import Ember from 'ember';

export default Ember.Mixin.create({
  showAll: false,
  limit: 3,
  content: [],

  contentToDisplay: function() {
    const allContent = this.get('content');

    if (this.get('showAll')) {
      return allContent;
    } else {
      return allContent.slice(0, this.get('limit'));
    }
  }.property('content.[]', 'showAll'),

  actions: {
    toggleMore() {
      this.toggleProperty('showAll');
    }
  }
});

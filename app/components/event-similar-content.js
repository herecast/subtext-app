import Ember from 'ember';

export default Ember.Component.extend({
  showAll: false,

  contentToDisplay: function() {
    const allContent = this.get('similarContent');

    if (this.get('showAll')) {
      return allContent;
    } else {
      return allContent.slice(0,3);
    }
  }.property('similarContent.[]', 'showAll'),

  actions: {
    toggleMore() {
      this.toggleProperty('showAll');
    }
  }
});

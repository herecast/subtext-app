import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Mixin.create({
  showAll: false,
  limit: 3,
  content: [],

  contentToDisplay: computed('content.[]', 'showAll', function() {
    const allContent = this.get('content');

    if (this.get('showAll')) {
      return allContent;
    } else {
      return allContent.slice(0, this.get('limit'));
    }
  }),

  hasMore: computed('content.[]', 'limit', function() {
    return get(this, 'content.length') > get(this, 'limit');
  }),

  actions: {
    toggleMore() {
      this.toggleProperty('showAll');
    }
  }
});

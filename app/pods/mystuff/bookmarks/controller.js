import Ember from 'ember';

const { get, inject:{service} } = Ember;

export default Ember.Controller.extend({
  queryParams: ['bookmarked'],
  bookmarked: true,

  bookmarkService: service('bookmarks'),

  init() {
    this._super(...arguments);
    get(this, 'bookmarkService').on('bookmarkRemoved', this, '_removeItemFromModel');
  },

  _removeItemFromModel(item) {
    const { contentId } = item;

    let model = get(this, 'model');

    let modelToRemove = model.find((modelItem) => {
      const content = get(modelItem, 'content');
      const modelItemContentId = get(content, 'contentId');

      return parseInt(contentId) === parseInt(modelItemContentId);
    });

    if (modelToRemove) {
      model.removeObject(modelToRemove);
    }
  }
});

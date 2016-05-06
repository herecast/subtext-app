import Ember from 'ember';

const {
  get,
  set
} = Ember;

export default Ember.Component.extend({
  contents: [],
  items: null,

  _setupItems() {
    const contents = get(this, 'contents').toArray(),
          arrangedContent = Ember.Object.create();
    let newsItem;

    // set up the news items
    for (let i = 1; i <= 6; i++) {
      newsItem = contents.findBy('contentType', 'news');
      contents.removeObject(newsItem);
      arrangedContent[`newsItem${i}`] = newsItem;
    }

    // set up the non-news items
    for (let i = 1; i <= 8; i++) {
      arrangedContent[`item${i}`] = contents.shiftObject();
    }

    return arrangedContent;
  },

  willInsertElement() {
    set(this, 'items', this._setupItems());
  }
});

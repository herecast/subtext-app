import Ember from 'ember';

const {
  get,
  setProperties
} = Ember;

export default Ember.Component.extend({
  contents: [],
  items: null,

  _setupItems() {
    const contents = get(this, 'contents').toArray();

    const newsItems   = contents.filterBy('contentType', 'news').sortBy('publishedAt').toArray().reverse(),
          eventItems  = contents.filterBy('contentType', 'event-instance').reject(function(item) { return !get(item, 'imageUrl'); }).slice(0, 5),
          talkItems   = contents.filterBy('contentType', 'talk').slice(0, 6),
          marketItems = contents.filterBy('contentType', 'market-post').slice(0, 5);

    setProperties(this, {
      newsItems: newsItems,
      eventItems: eventItems,
      talkItems: talkItems,
      marketItems: marketItems
    });
  },

  willInsertElement() {
    this._setupItems();
  }
});

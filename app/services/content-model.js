import Ember from 'ember';

const { isBlank } = Ember;

// This is not an Ember Data model, but more of a factory class.
// We are getting an array of content "models" from the API where each one is
// polymorphic, and we use the "content_type" attribute to identify what
// model it is. The problem is that this attribute does not match the
// models we have on the ember side, so we need to "normalize" them to
// match the model. After that we push them into the store one at a time
// so that Ember data converts it to an actual Ember model.
export default Ember.Service.extend({
  convert(record) {
    const type = record.content_type;
    const views = record.view_count;
    const comments = record.comment_count;
    let modelName = '';

    if (type === 'news' || type === 'News') {
      modelName = 'news';
    } else if (type === 'event' || type === 'Event') {
      modelName = 'event-instance';
    } else if (type === 'market' || type === 'MarketPost') {
      modelName = 'market-post';
    } else if (type === 'talk_of_the_town' || type === 'Comment') {
      modelName = 'talk';
    }

    // We depend on the content id to be set for all content. If it is not set
    // we can assume that it is the same as the id attribute.
    if (!record.content_id) {
      record.content_id = record.id;
    }

    // Do not push the item into the store if its type is unrecognized
    if (isBlank(modelName)) {
      return false;
    } else {
      const item = this.store.push(modelName, this.store.normalize(modelName, record));

      item.set('contentType', modelName);
      item.set('views', views);
      item.set('comments', comments);

      return item;
    }

  }
});

import Ember from 'ember';

const { get, set, isBlank, isPresent } = Ember;

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
    const parentContentType = this.convertType(record.parent_content_type);
    const parentId = record.parent_content_id;
    const parentEventInstanceId = record.parent_event_instance_id;

    let modelName = this.convertType(type, parentContentType);

    // We depend on the content id to be set for all content. If it is not set
    // we can assume that it is the same as the id attribute.
    if (!record.content_id) {
      record.content_id = record.id;
    }

    // Do not push the item into the store if its type is unrecognized
    if (isBlank(modelName)) {
      return false;
    } else {
      const item = this.store.push(this.store.normalize(modelName, record));

      item.set('contentType', modelName);
      item.set('views', views);
      item.set('comments', comments);
      item.set('parentContentType', parentContentType);
      item.set('parentId', parentId);
      item.set('parentEventInstanceId', parentEventInstanceId);

      if (isBlank(get(item, 'publishedAt')) && isPresent(get(record, 'publishedAt'))) {
        set(item, 'publishedAt', get(record, 'publishedAt'));
      }

      return item;
    }

  },

  convertType(type, parentContentType) {
    parentContentType = parentContentType ? parentContentType : null;

    if (type === 'news' || type === 'News') {
      return 'news';
    } else if (type === 'event' || type === 'Event') {
      return 'event-instance';
    } else if (type === 'market' || type === 'MarketPost') {
      return 'market-post';
    } else if (type === 'Comment' && parentContentType !== null) {
      return 'comment';
    } else if (type === 'talk_of_the_town' || ( type === 'Comment' && parentContentType === null) ) {
      return 'talk';
    } else {
      return null;
    }
  }


});

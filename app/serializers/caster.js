import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,
  attrs: {
    location: {
      embedded: 'always'
    },
    likes: {
      serialize: false,
      deserialize: 'records'
    },
    casterHides: {
      serialize: false,
      deserialize: 'records'
    },
    casterFollows: {
      serialize: false,
      deserialize: 'records'
    }
  },

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {

    if (Object.keys(payload).includes('feed_items')) {
      primaryModelClass = this.store.modelFor('feed-item');
    }

    if (Object.keys(payload).includes('likes')) {
      primaryModelClass = this.store.modelFor('like');
    }

    return this._super(store, primaryModelClass, payload, id, requestType);
  },

  serialize(snapshot, options) {
    const json = this._super(snapshot, options);

    if (json.location) {
      json.location_id = json.location.id;
      delete json.location;
    }

    delete json.active_followers_count;
    delete json.avatar_image_url;
    delete json.background_image_url;

    delete json.likes;
    delete json.caster_follows;
    delete json.caster_hides;

    delete json.total_comment_count;
    delete json.total_like_count;
    delete json.total_post_count;
    delete json.total_view_count;
    delete json.user_hide_count;
    delete json.user_id;

    return json;
  }
});

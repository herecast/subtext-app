import DS from 'ember-data';
import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,
  primaryKey: 'content_id',

  attrs: {
    images: { embedded: 'always' },
  },

  serialize(snapshot, options) {
    const json = this._super(snapshot, options);

    // Remove read only attributes that should not be sent to the API
    delete json.can_edit;
    delete json.content_id;
    delete json.has_contact_info;
    delete json.image_url;
    delete json.images;
    delete json.published_at;
    delete json.author_name
    delete json.author_email

    return json;
  }
});

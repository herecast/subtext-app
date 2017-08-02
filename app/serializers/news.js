import DS from 'ember-data';
import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,
  attrs: {
    images: { embedded: 'always' },
    contentLocations: { embedded: 'always' }
  },
  serialize(snapshot, options) {
    const json = this._super(snapshot, options);

    // Remove read only attributes that should not be sent to the API
    delete json.admin_content_url;
    delete json.author_id;
    delete json.comment_count;
    delete json.content_id;
    delete json.image_url;
    delete json.images;
    delete json.updated_at;
    delete json.can_edit;
    delete json.split_content;
    delete json.base_location_names;

    return json;
  }
});

import { ActiveModelSerializer } from 'active-model-adapter';
import DS from 'ember-data';

export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,
  attrs: {
    contentLocations: { embedded: 'always' }
  },
  serialize(snapshot, options) {
    const json = this._super(snapshot, options);

    // Remove read only attributes that should not be sent to the API
    delete json.content_id;
    delete json.image_url;
    delete json.author_name;
    delete json.author_image_url;
    delete json.view_count;
    delete json.commenter_count;
    delete json.parent_content_id;
    delete json.published_at;
    delete json.organization_id;
    delete json.initialCommentAuthor;
    delete json.initialCommentAuthorImageUrl;
    delete json.base_location_names;

    return json;
  }
});

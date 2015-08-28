import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend({
  serialize(snapshot, options) {
    const json = this._super(snapshot, options);

    // Remove read only attributes that should not be sent to the API
    delete json.image_url;
    delete json.author_name;
    delete json.author_image_url;
    delete json.pageviews_count;
    delete json.commenter_count;
    delete json.published_at;

    return json;
  }
});

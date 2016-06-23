import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend({
  isNewSerializerAPI: true,

  serialize() {
    let result = this._super(...arguments);

    // Remove read only attributes that should not be sent to the API
    delete result.can_publish_news;
    delete result.logo_url;
    delete result.background_image_url;
    delete result.name;

    return result;
  }
});

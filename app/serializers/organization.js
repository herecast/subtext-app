import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend({
  isNewSerializerAPI: true,

  serialize() {
    let result = this._super(...arguments);

    // Remove read only attributes that should not be sent to the API
    delete result.can_publish_news;
    delete result.logo_url;
    delete result.biz_feed_active;
    delete result.business_profile_id;
    delete result.org_type;
    delete result.profile_ad_override;
    delete result.subtext_certified;
    delete result.can_edit;
    delete result.profile_image_url;
    delete result.background_image_url;

    if (!result.remove_desktop_image) {
      delete result.remove_desktop_image;
    }

    return result;
  }
});

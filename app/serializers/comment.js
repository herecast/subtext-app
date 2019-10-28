import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  serialize() {
    const json = this._super(...arguments);

    delete json.caster_avatar_image_url;
    delete json.caster_handle;
    delete json.caster_name;
    delete json.caster_id;
    delete json.content_id;
    delete json.published_at;

    return json;
  }
});

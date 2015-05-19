import DS from 'ember-data';
import ajax from 'ic-ajax';
import config from '../config/environment';
import BaseEvent from '../mixins/models/base-event';

export default DS.Model.extend(BaseEvent, {
  category: DS.attr('string'),
  eventInstances: DS.hasMany('event-instance'),
  listservIds: DS.attr('raw', {defaultValue: []}),

  publish() {
    const url = `${config.API_NAMESPACE}/events/${this.get('id')}/publish`;
    return ajax(url, {type: 'POST'});
  },

  uploadImage() {
    const url = `${config.API_NAMESPACE}/events/${this.get('id')}`;
    const data = new FormData();

    if (this.get('image')) {
      data.append('event[image]', this.get('image'));

      return ajax(url, {
        data: data,
        type: 'PUT',
        contentType: false,
        processData: false
      });
    }
  }
});

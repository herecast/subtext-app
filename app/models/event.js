import DS from 'ember-data';
import moment from 'moment';
import ajax from 'ic-ajax';
import config from '../config/environment';
import BaseEvent from '../mixins/models/base-event';

export default DS.Model.extend(BaseEvent, {
  category: DS.attr('string'),
  eventInstances: DS.hasMany('event-instance'),

  spansDays: function() {
    const start = this.get('startsAt');
    const end = this.get('endsAt');

    return moment().diff(start, end) > 0;
  }.property('startsAt', 'endsAt'),

  timeRange: function() {
    const startTime = this.get('startsAt').format('LT');
    const endTime = this.get('endsAt').format('LT');

    return `${startTime} - ${endTime}`;
  }.property('startsAt', 'endsAt'),

  longTimeRange: function() {
    const start = this.get('startsAt').format('dddd, MMMM Do LT');
    let endFormat = 'LT';

    if (this.get('spansDays')) {
      endFormat = 'dddd, MMMM Do LT';
    }

    const end = this.get('endsAt').format(endFormat);

    return `${start} to ${end}`;
  }.property('startsAt', 'endsAt'),

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

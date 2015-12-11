import DS from 'ember-data';
import ajax from 'ic-ajax';
import Ember from 'ember';
import config from '../config/environment';
import BaseEvent from '../mixins/models/base-event';
import moment from 'moment';

/* global _ */

const {
  computed,
  get
} = Ember;

export default DS.Model.extend(BaseEvent, {
  category: DS.attr('string'),
  firstInstanceId: DS.attr('number'),
  listservIds: DS.attr('raw', {defaultValue: []}),
  schedules: DS.hasMany('schedule'),

  categoryEnabled: Ember.computed.notEmpty('category'),
  listsEnabled: Ember.computed.notEmpty('listservIds'),
  subtitle: Ember.computed.oneWay('eventInstances.firstObject.subtitle'),
  timeRange: Ember.computed.oneWay('eventInstances.firstObject.timeRange'),

  // This is used to create temporary event instances so they can be displayed
  // on the event preview page in the "other event dates" section.
  eventInstances: computed('schedules.@each.{startsAt,endsAt,subtitle}', function() {
    const schedules = get(this, 'schedules');

    const dates = schedules.map((schedule) => {
      const endsAt = schedule.get('endsAt');
      const subtitle = schedule.get('subtitle');

      return get(schedule, 'dates').map((date) => {
        const startsAt = moment(date);

        return this.store.createRecord('event-instance', {
          startsAt: startsAt,
          endsAt: endsAt,
          subtitle: subtitle
        });
      });
    });

    return _.flatten(dates);
  }),

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

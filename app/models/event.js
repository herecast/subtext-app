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
  // Cannot use defaultValue: [] here.
  // See: https://github.com/emberjs/ember.js/issues/9260
  listservIds: DS.attr('raw', {defaultValue: function() { return []; }}),
  schedules: DS.hasMany('schedule'),

  categoryEnabled: Ember.computed.notEmpty('category'),
  listsEnabled: Ember.computed.notEmpty('listservIds'),
  subtitle: Ember.computed.oneWay('eventInstances.firstObject.subtitle'),
  presenterName: Ember.computed.oneWay('eventInstances.firstObject.presenterName'),
  timeRange: Ember.computed.oneWay('eventInstances.firstObject.timeRange'),

  // This is used to create temporary event instances so they can be displayed
  // on the event preview page in the "other event dates" section.
  eventInstances: computed('schedules.@each.{startsAt,endsAt,subtitle,_remove,hasExcludedDates}', function() {
    const schedules = get(this, 'schedules').rejectBy('_remove');

    const dates = schedules.map((schedule) => {
      const scheduleStartsAt = get(schedule, 'startsAt');
      const endsAt = get(schedule, 'endsAt');
      const subtitle = get(schedule, 'subtitle');
      const dates = get(schedule, 'dates');
      const overrides = get(schedule, 'overrides');
      const presenterName = get(schedule, 'presenterName');

      if (dates) {
        return get(schedule, 'dates').reject((date) => {
          const momentDate = moment(date);

          if (get(schedule, 'hasExcludedDates')) {
            return overrides.any((override) => {
              return momentDate.isSame(override.date);
            });
          } else {
            return false;
          }
        }).map((date) => {
          const startsAt = moment(date);
          startsAt.hour(scheduleStartsAt.hour());
          startsAt.minute(scheduleStartsAt.minute());

          return this.store.createRecord('other-event-instance', {
            startsAt: startsAt,
            endsAt: endsAt,
            subtitle: subtitle,
            presenterName: presenterName
          });
        });
      } else {
        return [];
      }
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
  },

  rollbackSchedules() {
    get(this, 'schedules').forEach(schedule => schedule.rollbackAttributes());
  }
});

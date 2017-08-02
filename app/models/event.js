/* global _ */

import DS from 'ember-data';
import Ember from 'ember';
import BaseEvent from '../mixins/models/base-event';
import moment from 'moment';
import ContentLocationsMixin from 'subtext-ui/mixins/models/content-locations';

const { flatten } = _;

const {
  computed,
  inject,
  get,
  isEmpty
} = Ember;

export default DS.Model.extend(BaseEvent, ContentLocationsMixin, {
  api: inject.service('api'),
  category: DS.attr('string'),
  firstInstanceId: DS.attr('number'),
  canEdit: DS.attr('boolean', {defaultValue: false}),
  // Cannot use defaultValue: [] here.
  // See: https://github.com/emberjs/ember.js/issues/9260
  listservIds: DS.attr('raw', {defaultValue: function() { return []; }}),
  schedules: DS.hasMany('schedule'),
  organization: DS.belongsTo('organization'),
  ownerName: DS.attr('string'),
  promoteRadius: DS.attr('number'),

  categoryEnabled: computed.notEmpty('category'),
  listsEnabled: computed.notEmpty('listservIds'),
  subtitle: computed.oneWay('eventInstances.firstObject.subtitle'),
  presenterName: computed.oneWay('eventInstances.firstObject.presenterName'),
  timeRange: computed.oneWay('eventInstances.firstObject.timeRange'),

  formattedDate: computed('startsAt', 'endsAt', function() {
    const date = get(this, 'startsAt').format('MMM D');
    const startTime = get(this, 'startsAt').format('h:mmA');

    if (isEmpty(get(this, 'endsAt'))) {
      return `${date} | ${startTime}`;
    } else {
      const endTime = get(this, 'endsAt').format('h:mmA');

      return `${date} | ${startTime}-${endTime}`;
    }
  }),
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

    return flatten(dates);
  }),

  uploadImage() {
    const event_id = get(this, 'id');
    const api = get(this, 'api');
    const data = new FormData();

    if (this.get('image')) {
      data.append('event[image]', this.get('image'));

      return api.updateEventImage(event_id, data);
    }
  },

  rollbackSchedules() {
    get(this, 'schedules').forEach(schedule => schedule.rollbackAttributes());
  },

  save() {
    return this._super().then((savedEvent) => {
      return new Ember.RSVP.Promise((resolve, reject) => {
        savedEvent.get('schedules').filterBy('isNew').forEach((schedule) => {
          schedule.destroyRecord();
        });
        if(savedEvent.get('image')) {
          savedEvent.uploadImage().then(()=>{
            resolve(savedEvent);
          }, reject);
        } else {
          resolve(savedEvent);
        }
      });
    });
  }
});

/* global _ */

import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';

import BaseEvent from 'subtext-ui/mixins/models/base-event';
import Content from 'subtext-ui/mixins/models/content';

const { flatten } = _;

const {
  computed,
  inject: {service},
  get
} = Ember;

export default DS.Model.extend(BaseEvent, Content, {
  // TAG:NOTE: events don't have authorName
  // TAG:NOTE: events don't have authorId
  // TAG:NOTE: events don't have publishedAt
  // TAG:NOTE: events don't have updatedAt
  // TAG:NOTE: events don't have listservId
  // ugcJob: DS.attr('string'), // TAG:MOVED
  // organization: DS.belongsTo('organization'), //TAG:MOVED
  // listservIds: DS.attr('raw', {defaultValue: function() { return []; }}), //TAG:MOVED
  comments: DS.hasMany('comment'), //TAG:RESTORED
  subtitle: computed.oneWay('eventInstances.firstObject.subtitle'),

  api: service(),
  schedules: DS.hasMany('schedule'),

  /* NOT USED */
  ownerName: DS.attr('string'), // TAG:NOTE: this field is not present on other models
  category: DS.attr('string'), // TAG:DELETE
  categoryEnabled: computed.notEmpty('category'), //TAG:DELETE from here and preview page
  /* END NOT USED */

  firstInstanceId: DS.attr('number'), //TAG:NOTE we need this for teh redirect after creating events

  listsEnabled: computed.notEmpty('listservIds'),

  // This is used to create temporary event instances so they can be displayed
  // on the event preview page in the "other event dates" section.
  //
  // TAG:TODO move to preview component ~Nik
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
  timeRange: computed.oneWay('eventInstances.firstObject.timeRange'),
  futureInstances: computed('eventInstances.@each.startsAt', function() {
    const currentDate = new Date();

    return get(this, 'eventInstances').filter((inst) => {
      return get(inst, 'startsAt') > currentDate;
    });
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

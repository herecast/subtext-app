import Ember from 'ember';
import Scroll from '../../mixins/routes/scroll-to-top';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import ShareCaching from '../../mixins/routes/share-caching';
import Editable from 'subtext-ui/mixins/routes/editable';

const { get } = Ember;

export default Ember.Route.extend(Scroll, Authorized, ShareCaching, Editable, {
  model(params) {
    return this.store.findRecord('event', params.id, {reload: true});
  },

  redirect() {
    this.transitionTo('events.edit.details');
  },

  // Ember data doesn't automatically rollback relationship records, so we
  // need to do that manually if the event is rolled back.
  discardRecord(model) {
    const recordDiscarded = this._super(...arguments);

    if (recordDiscarded) {
      get(model, 'schedules').forEach(schedule => schedule.rollbackAttributes());
    }

    return recordDiscarded;
  },

  hasDirtyAttributes(event) {
    const eventHasDirtyAttrs = get(event, 'hasDirtyAttributes');

    // Ember data doesn't detect dirty attributes on relationship records,
    // so we need to do that manually.
    const scheduleHasDirtyAttrs = get(event, 'schedules').any((schedule) => {
      return get(schedule, 'hasDirtyAttributes');
    });

    return eventHasDirtyAttrs || scheduleHasDirtyAttrs;
  },

  actions: {
    afterDetails() {
      this.transitionTo('events.edit.promotion');
    },

    afterPromotion() {
      this.transitionTo('events.edit.preview');
    },

    afterPublish(event) {
      const firstInstanceId = event.get('firstInstanceId');

      this.transitionTo('events.show', firstInstanceId).then(this.prerenderRecache.bind(this));
    },

    backToDetails() {
      this.transitionTo('events.edit.details');
    }
  }
});

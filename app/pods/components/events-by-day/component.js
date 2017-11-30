import Ember from 'ember';
import moment from 'moment';
import momentComputed from 'ember-moment/computeds/moment';
import format from 'ember-moment/computeds/format';

const {
  inject: {service},
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['EventsByDay'],
  classNameBindings: ['expanded'],
  modals: service(),
  tracking: service(),
  session: service(),
  windowLocation: service(),
  selectDay: null,
  maxDisplay: 5,
  expanded: false,
  events: [],

  buttonDisplayDate: format(momentComputed('day', 'dddd, MMMM D'), 'MMMM D'),

  eventsToDisplay: computed('events.[]', 'expanded', 'maxDisplay', function() {
    const maxDisplay = get(this, 'maxDisplay');
    const expanded = get(this, 'expanded');
    const events = get(this, 'events');

    if(expanded) {
      return events;
    } else {
      return events.slice(0, maxDisplay);
    }
  }),

  actions: {
    openCalendarWidget () {
      const selectedDay = moment(get(this, 'dayValue'), 'YYYY-MM-DD').toDate();
      const updateEnabledEventDays = get(this, 'updateEnabledEventDays');

      updateEnabledEventDays(selectedDay).then(() => {
        const enabledDays = get(this, 'enabledEventDays').mapBy('date').uniq();

        get(this, 'modals').showModal('modals/date-picker', { enabledDays, selectedDay, updateEnabledEventDays }).then((date) => {
          this._gtmTrackEvent('events-jumped-to-date', date);
          get(this, 'selectDay')(date);
        });
      });

      this._gtmTrackEvent('events-clicked-calendar-icon');
    },

    toggleExpanded() {
      this.toggleProperty('expanded');
    }
  },

  _gtmTrackEvent(name, content='') {
    get(this,'session').incrementEventSequence('events-interactions')
      .then((eventSequenceIndex) => {
        get(this, 'tracking').push({
          'event': name,
          'content': content,
          'url': get(this, 'windowLocation').href(),
          'event-sequence': eventSequenceIndex,
          'event_day': moment().format('YYYY-MM-DD')
        });
      });
  },
});

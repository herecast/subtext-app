import Ember from 'ember';
import moment from 'moment';

const {
  on,
  computed,
  get,
  set
} = Ember;

export default Ember.Component.extend({
  schedule: null,
  classNames: ['full-calendar'],
  calendar: null,

  initCalendar: Ember.on('didInsertElement', function() {
    const events = get(this, 'calendarEvents');

    const fc = this.$().fullCalendar({
      timezone: 'local',
      eventRender: (event, element) => {
        const content = (event.hidden === true) ? '<i class="fa fa-times"></i>': '<i class="fa fa-check"></i>';

        element.on('click', () => {
          if (event.hidden) {
            this.attrs.includeEvent('eventClick', event);
            this.reloadCalendar();
          } else {
            this.attrs.excludeEvent('eventClick', event);
            this.reloadCalendar();
          }
        });

        element.find('.fc-content').html(content);
      }
    });

    fc.fullCalendar('addEventSource', {
      events: events,
      color: '#F6D73F',
      textColor: '#000000'
    });

    set(this, 'calendar', fc);
  }),

  _isOverRidden(event, overrides) {
    const start = moment(event.start);

    return overrides.any((override) => {
      return start.isSame(override.date);
    });
  },

  reloadCalendar() {
    const fc = get(this, 'calendar');
    const calendarEvents = get(this, 'calendarEvents');
    const overrides = get(this, 'schedule.overrides') || [];

    const decoratedEvents = calendarEvents.map((event) => {
      if (this._isOverRidden(event, overrides)) {
        event.color = '#dddddd';
        event.hidden = true;
      }
      return event;
    });

    if (fc) {
      fc.fullCalendar('removeEvents');
      fc.fullCalendar('addEventSource', {
        events: decoratedEvents,
        color: '#F6D73F',
        textColor: '#000000'
      });
    }
  },

  refreshCalendarEvents: on('didReceiveAttrs', function() {
    this.reloadCalendar();
  }),

  calendarEvents: computed('schedule.dates.[]','schedule.overrides.[]', function() {
    const dates = get(this, 'schedule.dates');

    // The schedule returns 0 if no dates fall within the selected start/end
    if (dates) {
      return dates.map((date) => {
        return {
          title: 'test',
          start: date,
          end: moment(date).format('YYYY-MM-DD'),
          allDay: false
        };
      });
    } else {
      return [];
    }
  })
});

import Ember from 'ember';

const {
  get,
  getWithDefault,
  set,
  computed
} = Ember;

function  _ordinal(d) {
  if(d>3 && d<21) {
    return 'th';
  } else {
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }
}

export default Ember.Component.extend({
  changeset: null,
  repeatTypes: [
    { key: 'Daily', value: 'daily' },
    { key: 'Weekly', value: 'weekly' },
    { key: 'Bi-Weekly', value: 'bi-weekly' },
    { key: 'Monthly', value: 'monthly' }
  ],

  weeklyOrBiWeekly: computed('changeset.repeats', function() {
    const repeats = get(this, 'changeset.repeats');

    return repeats === 'weekly' || repeats === 'bi-weekly';
  }),

  textSummary: computed('changeset.repeats','changeset.daysOfWeek','changest.weeksOfMonth', function() {
    const changeset = get(this, 'changeset');
    const repeats = get(changeset, 'repeats');
    const daysOfWeek = get(changeset, 'daysOfWeek') || [];

    const dayMap = { 1: 'Sunday', 2: 'Monday', 3: 'Tuesday', 4: 'Wednesday',
      5: 'Thursday', 6: 'Friday', 7: 'Saturday'};

    const readableDays = daysOfWeek.map((day) => { return dayMap[day]; });

    let message = '';

    switch(repeats) {
      case 'daily':
        message = 'Repeats every day'; break;
      case 'weekly':
        message = `Repeats Weekly on ${readableDays}.`; break;
      case 'monthly':
        const weekOfMonth = get(changeset, 'weeksOfMonth')[0]+1;

        if (weekOfMonth) {
          const ordinal = _ordinal(weekOfMonth);

          message = `Repeats Monthly on the ${weekOfMonth}${ordinal} ${readableDays[0]}.`;
        }

        break;
      case 'bi-weekly':
        message = `Repeats Bi-weekly on ${readableDays}.`; break;
      default: break;
    }

    return message;
  }),


  actions: {
    selectRepeatType(repeatChoice) {
      const changeset = get(this, 'changeset');
      set(changeset, 'repeats', repeatChoice);

      const hasDaysOfWeek = (repeatChoice === 'weekly' || repeatChoice === 'bi-weekly');
      if(!hasDaysOfWeek) {
        set(changeset, 'daysOfWeek', []);
      }
    },
  }
});


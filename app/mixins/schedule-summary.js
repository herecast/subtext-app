import Mixin from '@ember/object/mixin';
import { get, computed } from '@ember/object';

export default Mixin.create({
  textSummary: computed('repeats','daysOfWeek','weeksOfMonth', function() {
    const repeats = get(this, 'repeats');
    const daysOfWeek = (get(this, 'daysOfWeek') || []).sort();

    const dayMap = { 1: 'Sunday', 2: 'Monday', 3: 'Tuesday', 4: 'Wednesday',
      5: 'Thursday', 6: 'Friday', 7: 'Saturday'};

    const readableDays = daysOfWeek.map((day) => { return dayMap[day]; }).join(', ');

    let message = '';

    switch(repeats) {
      case 'daily': {
        message = 'Repeats every day';
        break;
      }
      case 'weekly': {
        message = `Repeats Weekly on ${readableDays}.`;
        break;
      }
      case 'monthly': {
        const weekOfMonth = get(this, 'weeksOfMonth')[0]+1;

        if (weekOfMonth) {
          const ordinal = this._ordinal(weekOfMonth);

          message = `Repeats Monthly on the ${weekOfMonth}${ordinal} ${readableDays[0]}.`;
        }

        break;
      }
      case 'bi-weekly': {
        message = `Repeats Bi-weekly on ${readableDays}.`;
        break;
      }
      default: {
        break;
      }
    }

    return message;
  }),

  _ordinal(d) {
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
});

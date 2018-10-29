import Component from '@ember/component';
import { set, get } from '@ember/object';
import { isPresent } from '@ember/utils';
import { run } from '@ember/runloop';

export default Component.extend({
  organization: null,
  calendarViewFirst: false,

  didReceiveAttrs() {
    this._super(...arguments);
    const organization = get(this, 'organization');

    if (isPresent(organization)) {
      set(this, 'calendarViewFirst', get(organization, 'calendarViewFirst'));
    }
  },
  formUpdated() {
    this.onFormUpdate(true, get(this, 'organization'));
  },

  actions: {
    formUpdated(calendarViewFirst) {
      set(this, 'organization.calendarViewFirst', calendarViewFirst);
      run.debounce(this, this.formUpdated, 100);
    }
  }
});

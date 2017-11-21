import Ember from 'ember';

const {get, set, isPresent, isBlank, run} = Ember;

export default Ember.Component.extend({

  organization: null,
  model: {},
  onFormUpdate() {},

  didReceiveAttrs() {
    this._super(...arguments);

    if (isBlank(get(this, 'model'))) {
      set(this, 'model', {});
    }

    const organization = get(this, 'organization');

    if (isPresent(organization)) {
      set(this, 'model.hours', get(organization, 'hours'));
    }
  },

  formUpdated() {
    this.onFormUpdate(true, get(this, 'model'));
  },

  actions: {
    formUpdated(hours) {
      set(this, 'model.hours', hours);
      run.debounce(this, this.formUpdated, 100);
    }
  }
});

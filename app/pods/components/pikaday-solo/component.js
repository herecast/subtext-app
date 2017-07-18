import Ember from 'ember';
/* global Pikaday */

const { get, set, isPresent } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-component'],
  "data-test-component": 'pickadaySolo',
  pikaday : null,
  // this value must be an instance of Date
  defaultDate: null,

  _initPikaday() {
    const that = this;
    const defaultDate = get(this, 'defaultDate');
    const opts = {
      bound: false,
      theme: 'PikadaySolo',
      defaultDate: defaultDate,
      setDefaultDate: isPresent(defaultDate),
      onSelect() {
        that.attrs.updateSelected(this.getMoment().format('YYYY-MM-DD'));

        // hack needed to get the iOS select picker to close
        Ember.$('.pika-select-month').focus().blur();
      }
    };

    return new Pikaday(opts);
  },

  init() {
    this._super(...arguments);

    set(this, 'pikaday', this._initPikaday());
  },

  didRender() {
    this.$().append(get(this, 'pikaday').el);
  },

  willDestroyElement() {
    get(this, 'pikaday').destroy();
  }
});

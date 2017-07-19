import Ember from 'ember';
/* global Pikaday */

const { get, set } = Ember;

export default Ember.Component.extend({
  attributeBindings: ['data-test-component'],
  "data-test-component": 'pickadaySolo',
  pikaday : null,

  _initPikaday() {
    const that = this;
    const opts = {
      bound: false,
      theme: 'PikadaySolo',

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

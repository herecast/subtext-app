import $ from 'jquery';
import Component from '@ember/component';
import { set, get } from '@ember/object';
/* global Pikaday */

export default Component.extend({
  attributeBindings: ['data-test-component'],
  "data-test-component": 'pickadaySolo',
  pikaday : null,

  _initPikaday() {
    const disableDay = get(this, 'disableDay') || (() => { return false; });
    const initialDay = get(this, 'selectedDate') || null;
    const that = this;
    const opts = {
      bound: false,
      theme: 'PikadaySolo',
      showDaysInNextAndPreviousMonths: true,
      defaultDate: initialDay,
      setDefaultDate: true,

      onSelect() {
        that.attrs.updateSelected(this.getMoment().format('YYYY-MM-DD'));

        // hack needed to get the iOS select picker to close
        $('.pika-select-month').focus().blur();
      },

      disableDayFn(date) {
        return disableDay(date);
      }
    };

    return new Pikaday(opts);
  },

  init() {
    this._super(...arguments);

    set(this, 'pikaday', this._initPikaday());
  },

  didRender() {
    $(this.element).append(get(this, 'pikaday').el);
  },

  willDestroyElement() {
    get(this, 'pikaday').destroy();
  }
});

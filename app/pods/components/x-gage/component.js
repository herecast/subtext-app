import Ember from 'ember';
/* global JustGage */

const { set, get } = Ember;

let counter = 0;

export default Ember.Component.extend({
  cssId: null,
  value: null,
  gauge: null,
  feedback_num: null,
  title: null,
  titlePosition: 'below',

  init() {
    this._super();

    set(this, 'cssId', `gauge-${counter}`);
    counter++;
  },

  didInsertElement() {
    const cssId = get(this, 'cssId');
    let title = get(this, 'title');
    const value = (get(this, 'value') * 100) || 0;

    if (typeof title === 'function') {
      title = title(get(this, 'record'));
    } else {
      title = get(this, 'title') || '';
    }

    set(this, 'gauge', new JustGage({
      id: cssId,
      // value: (Math.random() * 100), // uncomment to simulate data
      value: value,
      min: 0,
      max: 100,
      symbol: '%',
      title: title,
      titlePosition: get(this, 'titlePosition'),
      levelColors: ["#ff0000", "#f9c802", "#a9d70b"],
      startAnimationTime: 300,
      startAnimationType: '<>',
      width: get(this, 'width'),
      height: get(this, 'height') || get(this, 'width'),
      gaugeWidthScale: 0.625,
      hideMinMax: true
    }));
  },

  didUpdateAttrs() {
    const gauge = get(this, 'gauge');
    const newValue = this.attrs.value.value;

    gauge.refresh(newValue);
  }
});


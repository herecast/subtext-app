import Ember from 'ember';
import PikadayInputComponent from 'ember-pikaday/components/pikaday-input';

const { get, run } = Ember;

export default PikadayInputComponent.extend({
  bindAttributes: ['data-test-field'],
  onPikadayOpen() {
    Ember.$('body, html').css('overflow', 'hidden');
  },

  onPikadayClose() {
    Ember.$('body, html').css('overflow', 'visible');
  },

  onPikadayRedraw() {
    const pikaday = get(this, 'pikaday');

    run.later(() => {
      pikaday.adjustPosition();
    }, 300);
  },

  willDestroyElement() {
    Ember.$('body, html').css('overflow', 'visible');
  }
});

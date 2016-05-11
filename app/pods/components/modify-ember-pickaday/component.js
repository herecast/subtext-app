import Ember from 'ember';
import PikadayInputComponent from 'ember-pikaday/components/pikaday-input';

const { get, run } = Ember;

export default PikadayInputComponent.extend({
  onPikadayOpen() {
    Ember.$('body, html').css('overflow', 'hidden');
  },
  onPikadayClose() {
    Ember.$('body, html').css('overflow', 'visible');
  },
  onPikadayRedraw() {
    const pikaday = get(this, 'pikaday', pikaday);

    run.later(() => {
      return pikaday.adjustPosition();
    });
  },
  willDestroyElement() {
    Ember.$('body, html').css('overflow', 'visible');
  }
});

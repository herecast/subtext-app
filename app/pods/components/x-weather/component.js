import Ember from 'ember';
import ajax from 'ic-ajax';
import config from 'subtext-ui/config/environment';

const { get, set } = Ember;

export default Ember.Component.extend({
  classNames: ['Weather'],
  autoload: false,

  init() {
    this._super(...arguments);

    const autoload = get(this, 'autoload');

    if (autoload) {
      this._getWeather();
    }
  },

  _getWeather() {
    const url = `${config.API_NAMESPACE}/weather`;

    ajax(url).then((response) => {
      set(this, 'weatherHTML', response);
    });
  }
});

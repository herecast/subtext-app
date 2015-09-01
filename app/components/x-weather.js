import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Component.extend({
  classNames: ['Weather'],
  autoload: false,

  getSimilarContent: function() {
    const autoload = this.get('autoload');

    if (autoload) {
      const url = `${config.API_NAMESPACE}/weather`;

      ajax(url).then((response) => {
        this.set('weatherHTML', response);
      });
    }
  }.on('init')
});

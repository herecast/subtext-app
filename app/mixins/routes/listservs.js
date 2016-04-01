import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../../config/environment';

export default Ember.Mixin.create({
  setupController(controller, model) {
    this._super(controller, model);

    const url = `${config.API_NAMESPACE}/listservs`;

    ajax(url).then((response) => {
      controller.set('listservs', response.listservs);
    });
  }
});

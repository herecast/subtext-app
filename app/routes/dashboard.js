import Ember from 'ember';
import Authorized from 'simple-auth/mixins/authenticated-route-mixin';
import config from '../config/environment';
import ajax from 'ic-ajax';

export default Ember.Route.extend(Authorized, {
  contentModel: Ember.inject.service('content-model'),

  model: function() {
    return this.get('session.currentUser');
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    const contentModel = this.get('contentModel');

    ajax(`${config.API_NAMESPACE}/dashboard`).then((response) => {
      const contents = response.contents.map((record) => {
        return contentModel.convert(record);
      });

      controller.set('dashboardContents', contents);
    });

  }
});

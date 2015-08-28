import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';
import PaginatedFilter from '../mixins/routes/paginated-filter';

export default Ember.Route.extend(PaginatedFilter, {
  contentModel: Ember.inject.service('content-model'),

  model(params) {
    const url = `${config.API_NAMESPACE}/contents`;
    return ajax(url, {
      data: {
        page: params.page,
        per_page: params.per_page
      }
    });
  },

  setupController(controller, model) {
    const contentModel = this.get('contentModel');

    const contents = model.contents.map((record) => {
      return contentModel.convert(record);
    });

    controller.set('model', contents);
  }
});

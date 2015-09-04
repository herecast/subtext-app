import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';
import PaginatedFilter from '../mixins/routes/paginated-filter';
import History from '../mixins/routes/history';

export default Ember.Route.extend(PaginatedFilter, History, {
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

    const contents = model.contents.reject((record) => {
      // Filter out any events that do not have a start date. These are events
      // that have been imported and do not have event instances associated
      // with them.
      return record.content_type === 'event' && Ember.isBlank(record.starts_at);
    }).map((record) => {
      return contentModel.convert(record);
    });

    controller.set('model', contents);
  }
});

import Ember from 'ember';
import PaginatedFilter from '../mixins/routes/paginated-filter';
import History from '../mixins/routes/history';

const { get, inject } = Ember;

export default Ember.Route.extend(PaginatedFilter, History, {
  api: inject.service('api'),
  contentModel: Ember.inject.service('content-model'),

  model(params) {
    const api = get(this, 'api');

    return api.getContents({
      page: params.page
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

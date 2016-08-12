import Ember from 'ember';
import PaginatedFilter from 'subtext-ui/mixins/routes/paginated-filter';
import History from 'subtext-ui/mixins/routes/history';

const {
  get,
  inject
} = Ember;

export default Ember.Route.extend(PaginatedFilter, History, {
  api: inject.service('api'),
  session: inject.service('session'),
  contentModel: Ember.inject.service('content-model'),

  model(params) {
    const api = get(this, 'api');

    const query = {
      page: params.page,
      per_page: 100,
      news_per_page: 5
    };

    return api.getContents(query);
  },

  setupController(controller, model) {
    const contentModel = get(this, 'contentModel');

    const contents = model.contents.reject(record => {
      const {content_type : type} = record;
      // Filter out any events that do not have a start date. These are events
      // that have been imported and do not have event instances associated
      // with them.
      return (type === 'event' && Ember.isBlank(record.starts_at));
    }).map(record => {
      return contentModel.convert(record);
    });

    controller.set('model', contents);
  }
});

import Ember from 'ember';
import PaginatedFilter from '../mixins/routes/paginated-filter';
import History from '../mixins/routes/history';

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
      // api returns 8 non-news and 6 news items
      per_page: 8,
      news_per_page: 6
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

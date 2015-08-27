import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';
import PaginatedFilter from '../mixins/routes/paginated-filter';

export default Ember.Route.extend(PaginatedFilter, {
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
    const contents = [];

    // We are getting an array of "models" from the API where each one is
    // polymorphic, and we use the "content_type" attribute to identify what
    // model it is. The problem is that this attribute does not match the
    // models we have on the ember side, so we need to "normalize" them to
    // match the model. After that we push them into the store one at a time
    // so that Ember data converts it to an actual Ember model that we can
    // pass to the UI card.
    model.contents.forEach((record) => {
      const type = record.content_type;
      let modelName = '';

      if (type === 'news') {
        modelName = 'news';
      } else if (type === 'event') {
        modelName = 'event-instance';
      } else if (type === 'market') {
        modelName = 'market-post';
      } else if (type === 'talk_of_the_town') {
        modelName = 'talk';
      }

      const item = this.store.push(modelName, this.store.normalize(modelName, record));

      item.set('contentType', modelName);

      contents.push(item);
    });

    controller.set('model', contents);
  }
});

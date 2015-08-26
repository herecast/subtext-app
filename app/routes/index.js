import Ember from 'ember';
import ajax from 'ic-ajax';
import config from '../config/environment';

export default Ember.Route.extend({
  model() {
    const url = `${config.API_NAMESPACE}/contents`;
    return ajax(url);
  },

  setupController(controller, model) {
    const contents = [];

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

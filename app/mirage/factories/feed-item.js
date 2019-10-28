import { isPresent } from '@ember/utils';
import { Factory, association } from 'ember-cli-mirage';

export default Factory.extend({
  modelType(id) {
    if (id % 20 === 0 && id <= 100) {
      return 'carousel';
    } else {
      return 'content';
    }
  },

  carousel: association(),
  content: association(),

  afterCreate(item, server) {
    const modelType = item.modelType;
    const feedItemContent = isPresent(item[modelType]) ? item[modelType] : server.create(modelType);

    if (modelType === 'content' && item.id % 4 === 0) {
      server.createList('comment', 4, {contentId: feedItemContent.id});
    }

    let options = {};
    options[`${modelType}Id`] = feedItemContent.id;

    item.update(options);
  }
});

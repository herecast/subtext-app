import { Factory, association } from 'ember-cli-mirage';
import Ember from 'ember';

const { isPresent } = Ember;

export default Factory.extend({
  modelType(id) {
    if (id % 20 === 0 && id <= 100) {
      return 'carousel';
    } else if (id <= 100){
      return 'feedContent';
    } else {
      return 'organization';
    }
  },

  carousel: association(),
  organization: association(),
  feedContent: association(),

  afterCreate(content, server) {
    const modelType = content.modelType;
    const feedItemContent = isPresent(content[modelType]) ? content[modelType] : server.create(modelType);

    if (modelType === 'feedContent' && content.id % 4 === 0) {
      server.createList('comment', 4, {feedContentId: feedItemContent.id});
    }

    let options = {};
    options[`${modelType}Id`] = feedItemContent.id;

    content.update(options);
  }
});

import { equal, alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import DS from 'ember-data';

export default DS.Model.extend({
  modelType: DS.attr('string'),

  carousel: DS.belongsTo({async: false}),
  content: DS.belongsTo({async: false}),
  organization: DS.belongsTo({async: false}),

  isCarousel: equal('modelType', 'carousel'),
  isContent: equal('modelType', 'content'),
  isOrganization: equal('modelType', 'organization'),

  viewStatus: alias('content.viewStatus'),

  feedItemModel: computed('modelType', function() {
    const modelType = get(this, 'modelType');

    return get(this, `${modelType}`);
  })
});

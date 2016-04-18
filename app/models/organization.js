import Ember from 'ember';
import DS from 'ember-data';

const { computed, get } = Ember;

export default DS.Model.extend({
  name: DS.attr('string'),
  logo: DS.attr('string'),
  backgroundImage: DS.attr('string'),
  description: DS.attr('string'),
  canPublishNews: DS.attr('boolean'),

  slug: computed('name', 'id', function() {
    const id = get(this, 'id');
    const name = get(this, 'name');
    const paramName = name.trim().dasherize();

    return `${id}-${paramName}`;
  })
});

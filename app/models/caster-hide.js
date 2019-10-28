import { alias } from '@ember/object/computed';
import DS from 'ember-data';

export default DS.Model.extend({
  casterId: DS.attr('number'),
  casterName: DS.attr('string'),
  casterHandle: DS.attr('string'),
  casterAvatarImageUrl: DS.attr('string'),
  contentId: DS.attr('number'),
  flagType: DS.attr('string'),

  name: alias('casterName'),
  handle: alias('casterHandle'),
  avatarImageUrl: alias('casterAvatarImageUrl')
});

import { alias } from '@ember/object/computed';
import DS from 'ember-data';

export default DS.Model.extend({
  casterName: DS.attr('string'),
  casterHandle: DS.attr('string'),
  casterAvatarImageUrl: DS.attr('string'),
  casterId: DS.attr('number'),

  name: alias('casterName'),
  handle: alias('casterHandle'),
  avatarImageUrl: alias('casterAvatarImageUrl')
});

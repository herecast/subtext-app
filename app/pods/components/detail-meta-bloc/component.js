import Component from '@ember/component';
import { get, computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  displayBlocAttribution: computed('avatarName', 'isDefaultOrganization', function(){
    return get(this, 'avatarName') && !get(this, 'isDefaultOrganization');
  })
});

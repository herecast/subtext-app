import Ember from 'ember';

const { computed, get } = Ember;

export default Ember.Component.extend({
  tagName: '',

  displayBlocAttribution: computed('avatarName', 'isDefaultOrganization', function(){
    return get(this, 'avatarName') && !get(this, 'isDefaultOrganization');
  })
});

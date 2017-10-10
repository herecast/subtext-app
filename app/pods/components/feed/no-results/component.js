import Ember from 'ember';

const {inject} = Ember;

export default Ember.Component.extend({
  fastboot: inject.service()
});

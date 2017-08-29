import Ember from 'ember';

const {inject, computed} = Ember;

export default Ember.Controller.extend({
  eventsNewController: inject.controller('events.new'),
  job: computed.oneWay('eventsNewController.job'),
  secondaryBackground: true,
  isPreview: true
});

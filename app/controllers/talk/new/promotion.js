import Ember from 'ember';

const {inject, computed} = Ember;

export default Ember.Controller.extend({
  talkNewController: inject.controller('talk.new'),
  job: computed.oneWay('talkNewController.job'),
  secondaryBackground: true
});

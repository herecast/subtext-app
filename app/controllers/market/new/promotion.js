import Ember from 'ember';

const {inject, computed} = Ember;

export default Ember.Controller.extend({
  marketNewController: inject.controller('market.new'),
  job: computed.oneWay('marketNewController.job'),
  secondaryBackground: true
});

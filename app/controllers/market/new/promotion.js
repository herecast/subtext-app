import { oneWay } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  marketNewController: controller('market.new'),
  job: oneWay('marketNewController.job'),
  secondaryBackground: true
});

import { oneWay } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  eventsNewController: controller('events.new'),
  job: oneWay('eventsNewController.job'),
  secondaryBackground: true
});

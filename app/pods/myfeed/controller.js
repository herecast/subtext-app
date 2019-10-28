import { gt, alias, readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  fastboot: service(),
  session: service(),

  currentUser: readOnly('session.currentUser'),

  queryParams: ['page', 'perPage'],
  page: 1,
  perPage: 5,

  isFastBoot: alias('fastboot.isFastBoot'),

  posts: alias('model'),

  hasPosts: gt('model.length', 0)
});

import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'OrganizationSubscribeStats',
  classNameBindings: ['noTopMargin:no-top-margin'],

  organization: null,
  noTopMargin: false,

  activeSubscriberCount: readOnly('organization.activeSubscriberCount'),
  postCount: readOnly('organization.postCount'),
  totalViewCount: readOnly('organization.totalViewCount'),
});

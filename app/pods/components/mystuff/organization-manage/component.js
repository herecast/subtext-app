import { get, set } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: 'Mystuff-OrganizationManage',

  organizationHidesService: service('organization-hides'),

  model: null,

  showSubscribeOptions: false,
  showHideOptions: false,

  wantsToUnhide: false,

  organizationId: oneWay('model.organizationId'),
  organizationName: oneWay('model.organizationName'),
  organizationProfileImageUrl: oneWay('model.organizationProfileImageUrl'),

  contentId: oneWay('model.contentId'),
  flagType: oneWay('model.flagType'),

  actions: {
    clickedUnhideButton() {
      set(this, 'wantsToUnhide', true);
    },

    unhide() {
      const organizationId = get(this, 'organizationId');

      get(this, 'organizationHidesService').unhide(organizationId);
    },

    cancelUnhide() {
      set(this, 'wantsToUnhide', false);
    }
  }
});

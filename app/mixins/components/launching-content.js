import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  floatingActionButton: service(),
  router: service(),

  model: null,
  showManageOverlay: false,
  justLaunchedContent: false,

  init() {
    this._checkIfLaunchingContent();
    this._super(...arguments);
  },

  _checkIfLaunchingContent() {
    const floatingActionButton = get(this, 'floatingActionButton');
    const launchingModel = get(floatingActionButton, 'launchingModel');

    const contentIdsMatch = isPresent(launchingModel) && parseInt(get(launchingModel, 'id')) === parseInt(get(this, 'model.id'));
    const eventInstanceIdsMatch = isPresent(launchingModel) && parseInt(get(launchingModel, 'eventInstanceId')) === parseInt(get(this, 'model.id'));
    if (contentIdsMatch || eventInstanceIdsMatch) {
      set(this, 'showManageOverlay', true);
      set(this, 'justLaunchedContent', true);
    }
  },

  actions: {
    openPromotionMenu() {
      set(this, 'showManageOverlay', true);
    },

    closePromotionMenu() {
      if (get(this, 'justLaunchedContent')) {
        get(this, 'floatingActionButton').didLaunchContent();
        set(this, 'justLaunchedContent', false);
      }

      set(this, 'showManageOverlay', false);
    },

    openOrangeButton() {
      get(this, 'router').transitionTo('feed');
      get(this, 'floatingActionButton').expand();
    }
  }
});

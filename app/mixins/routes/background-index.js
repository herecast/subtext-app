import Ember from 'ember';
import config from 'subtext-ui/config/environment';

const {
  run,
  get,
  $,
  inject
} = Ember;

export default Ember.Mixin.create({
  fastboot: inject.service(),
  defaultBackgroundIndex: 'location.index',
  history: inject.service(),

  _renderBackground(routeName, model, controller) {
    if (get(this, 'fastboot.isFastBoot')) {
      return;
    }

    if (controller === undefined) {
      controller = this.controllerFor(routeName);
    }

    this.render(routeName.replace('.', '/'), {
      controller: controller,
      model: model,
      outlet: 'background',
      into: 'application'
    });

    const scrollPosition = controller.get('scrollPosition');
    if (scrollPosition) {
      run.scheduleOnce('afterRender', this, function() {
        this._setBackgroundScroll(scrollPosition);
      });
    }
  },

  _renderDefaultIndex() {
    if (get(this, 'fastboot.isFastBoot')) {
      return;
    }

    const defaultIndex = get(this, 'defaultBackgroundIndex');
    const owner = Ember.getOwner(this);
    const route = owner.lookup(`route:${defaultIndex}`);
    const controller = this.controllerFor(defaultIndex);
    const queryParams = controller.getProperties(
      controller.get('queryParams')
    );

    // Assumes that there will be no url params
    const model = route.model(queryParams);

    if (model.then) {
      model.then((data) => {
        route.setupController(controller, data);

        this._renderBackground(defaultIndex, data, controller);
      });
    } else {
      route.setupController(controller, model);

      this._renderBackground(defaultIndex, model, controller);
    }
  },

  _setBackgroundScroll(pos) {
    if (!get(this, 'fastboot.isFastBoot') && pos) {
      $('#main > .BackgroundIndex').css('margin-top', `-${pos}px`);
    }
  },

  _unsetBackgroundScroll() {
    if (!get(this, 'fastboot.isFastBoot')) {
      $('#main > .BackgroundIndex').css('margin-top', '');
    }
  },

  actions: {
    didTransition() {
      this._super(...arguments);

      if (!get(this, 'fastboot.isFastBoot')) {
        run.scheduleOnce('afterRender', this, function() {
          const previousRouteName = get(this, 'history.previousRouteName');

          if (config.contentIndexRoutes.includes(previousRouteName)) {
            const indexModel = this.modelFor(previousRouteName);

            this._renderBackground(previousRouteName, indexModel);

          } else {
            this._renderDefaultIndex();
          }
        });
      }
      return true;
    },

    willTransition(transition) {
      this._super(...arguments);

      if (transition.targetName !== get(this, 'routeName')) {
        this._unsetBackgroundScroll();
      }

      return true;
    }
  }
});

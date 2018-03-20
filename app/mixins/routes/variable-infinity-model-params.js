import Ember from 'ember';
import InfinityModel from 'ember-infinity/lib/infinity-model';

const { get, isPresent } = Ember;

export default Ember.Mixin.create({
  ExtendedInfinityModel: InfinityModel.extend({
    hasInflected: false,

    infinityPageOptions: {
      perPageInitial: 5,
      perPageAfter: 15,
    },

    buildParams() {
      let params = this._super(...arguments);

      if (isPresent(get(this, 'infinityPageOptions'))) {
        const { perPageInitial, perPageAfter } = get(this, 'infinityPageOptions');

        const inflectionPage = perPageAfter / perPageInitial;
        const paramPageIsBeforeInflectionPage = parseInt(params['page']) <= parseInt(inflectionPage);
        const hasNotYetInflected = !get(this, 'hasInflected');

        if (paramPageIsBeforeInflectionPage && hasNotYetInflected) {
          params['per_page'] = perPageInitial;
        } else if (hasNotYetInflected) {
          this.setProperties({
            currentPage: 1,
            hasInflected: true
          });

          params['page'] = 2;
          params['per_page'] = perPageAfter;
        } else {
          params['per_page'] = perPageAfter;
        }
      }

      delete params.modelPath;

      return params;
    }
  })
});

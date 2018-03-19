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

        let inflectionPage = perPageAfter / perPageInitial;

        if (parseInt(params['page']) <= parseInt(inflectionPage)) {
          params['per_page'] = perPageInitial;
        } else if (!get(this, 'hasInflected')) {
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

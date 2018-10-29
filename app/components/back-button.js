import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  history: service('history'),

  routeName: computed('history.routeName', 'defaultRouteName', function() {
    return this.get('history.routeName') || this.get('defaultRouteName');
  }),

  routeModel: computed('history.routeModel', function() {
    return this.get('history.routeModel');
  })

});

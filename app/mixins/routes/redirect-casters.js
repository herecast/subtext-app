import Mixin from '@ember/object/mixin';

export default Mixin.create({
  beforeModel(transition) {
    const params = transition.params[this.routeName];
    
    if (params.id && params.id.startsWith('@')) {
      this.transitionTo('caster', params.id);
    } else {
      this._super(...arguments);
    }
  },
});

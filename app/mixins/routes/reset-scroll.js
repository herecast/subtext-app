import Mixin from '@ember/object/mixin';

export default Mixin.create({
  actions: {
    didTransition() {
      this.send('scrollTo', 0);
      return this._super(...arguments); //bubble
    }
  }
});

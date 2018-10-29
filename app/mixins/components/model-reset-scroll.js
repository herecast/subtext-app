import Mixin from '@ember/object/mixin';

export default Mixin.create({
  init() {
    this._super(...arguments);
    this._modelResetScrollValueCache = this.value
  },

  didUpdateAttrs() {
    this._super(...arguments);

    if (this.value !== this._modelResetScrollValueCache) {
      this.scrollTo(0);
    }
  }
});

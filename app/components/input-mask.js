import TextField from '@ember/component/text-field';

export default TextField.extend({
  didInsertElement() {
    this._super(...arguments);

    var mask = this.get('mask');

    this.$().mask(mask);
  },

});

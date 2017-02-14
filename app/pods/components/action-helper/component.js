import Ember from 'ember';

const {
  setProperties
} = Ember;

export default Ember.Component.extend({
  classNames: ['ActionHelper'],
  classNameBindings: ['pointClass', 'widthClass'],
  pointClass: "",
  widthClass: "",

  didReceiveAttrs() {
    this._super(...arguments);

    const baseClassName = 'ActionHelper';

    setProperties(this, {
      'pointClass': `${baseClassName}--point${Ember.String.classify(this.attrs.point)}`,
      'widthClass': `${baseClassName}--${(this.attrs.width) ? Ember.String.classify(this.attrs.width) : 'defaultWidth'}`
    });
  },
});

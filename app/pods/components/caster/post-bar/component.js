import { get } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Caster-PostBar'],
  classNameBindings: ['showYield:show-yield'],

  publishedOrDrafts: null,

  onChangeTab: function() {},

  showYield: false,

  publishedIsActive: true,
  draftsIsActive: false,

  actions: {
    changeTab(tab) {
      get(this, 'onChangeTab')(tab);
    }
  }
});

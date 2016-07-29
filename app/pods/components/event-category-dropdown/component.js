import Ember from 'ember';

const { set } = Ember;

export default Ember.Component.extend({
  classNames: ['dropdown EventCategoryDropdown'],

  category: null,
  categoryOptions: ['Everything', 'Arts', 'Movies', 'Live Music', 'Wellness'],

  actions: {
    setCategory(category) {
      set(this, 'category', category);
    }
  }
});

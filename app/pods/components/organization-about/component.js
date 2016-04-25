import Ember from 'ember';

const { get, computed } = Ember;

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['OrganizationAbout'],
  
  descriptionHtml: computed('model.description', function() {
    return new Ember.Handlebars.SafeString(get(this, 'model.description'));
  })
});

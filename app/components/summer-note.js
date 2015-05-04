import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['wysiwyg-editor'],
  height: 120,

  willDestroyElement: function() {
    this.$('textarea').destroy();
  },

  didInsertElement: function() {
    var height = this.get('height');

    this.$('textarea').summernote({
      height: height,
      toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']]
      ]
    });

    var content = this.get('content');
    this.$('textarea').code(content);
  },

  keyUp: function() {
    this.doUpdate();
  },

  click: function() {
    this.doUpdate();
  },

  doUpdate: function() {
    var content = this.$('.note-editable').html();
    this.set('content', content);
  }
});

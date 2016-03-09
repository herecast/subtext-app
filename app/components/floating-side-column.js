import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['FloatingSideColumn'],
  classNameBindings: ['enabled:is-enabled'],
  floatOffset: 30,
  minHeight: 550,
  bottomGap: 150,

  initContentAffixing: function() {
    const contentBody = this.$().closest('.row');
    const enabled = this.get('enabled');

    if (enabled && contentBody.outerHeight() > this.get('minHeight')) {
      this.affixContent();

      Ember.$(document).on('scroll.column', () => {
        Ember.run.debounce(this, this.affixContent, 8);
      });
    }
  }.on('didInsertElement'),

  affixContent() {
    const contentBody = this.$().closest('.row');
    contentBody.css('outline:3px solid red');
    const bottomOffset = contentBody.offset().top + contentBody.outerHeight() - this.$().outerHeight();
    const scrollHeight = document.body.scrollTop || window.scrollY;

    const topOffset = this.$().parent().offset().top + 20;
    const topBreakpoint = topOffset - this.get('floatOffset');

    const bottomBreakpoint = bottomOffset - this.get('floatOffset') - this.get('bottomGap');

    if (scrollHeight < topBreakpoint) {
      this.$().css('position', '');
      this.$().css('top', '');
    } else if (scrollHeight >= topBreakpoint && scrollHeight <= bottomBreakpoint) {
      this.$().css('position', 'fixed');
      this.$().css('top', '10px');
    } else if (scrollHeight > bottomBreakpoint) {
      this.$().css('position', 'relative');
      const relativePosition = contentBody.outerHeight() - this.$().outerHeight() - this.get('floatOffset') - this.get('bottomGap');
      this.$().css('top', relativePosition);
    }
  },

  removeContentAffixing: function() {
    this.$().css('position', '');
    this.$().css('top', '');
    Ember.$(document).off('scroll.column');
  }.on('willDestroyElement'),

  toggle: function() {
    if (this.get('enabled')) {
      this.removeContentAffixing();
      this.initContentAffixing();
    } else {
      this.removeContentAffixing();
    }
  }.observes('enabled')
});

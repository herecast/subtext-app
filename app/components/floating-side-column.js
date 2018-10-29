import { debounce } from '@ember/runloop';
import $ from 'jquery';
import Component from '@ember/component';
import { observer } from '@ember/object';

export default Component.extend({
  classNames: ['FloatingSideColumn'],
  classNameBindings: ['enabled:is-enabled', 'floating:is-floating'],
  floatOffset: 30,
  minHeight: 550,
  bottomGap: 150,
  floating: false,
  enabled: true,

  didInsertElement() {
    this._super(...arguments);

    const contentBody = this.$().closest('.row');
    const enabled = this.get('enabled');

    if (enabled && contentBody.outerHeight() > this.get('minHeight')) {
      this.affixContent();

      $(document).on('scroll.column', () => {
        debounce(this, this.affixContent, 8);
      });
    }
  },

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
      this.set('floating', false);
    } else if (scrollHeight >= topBreakpoint && scrollHeight <= bottomBreakpoint) {
      this.$().css('position', 'fixed');
      this.$().css('top', '10px');
      this.set('floating', true);
    } else if (scrollHeight > bottomBreakpoint) {
      this.$().css('position', 'relative');
      const relativePosition = contentBody.outerHeight() - this.$().outerHeight() - this.get('floatOffset') - this.get('bottomGap');
      this.$().css('top', relativePosition);
      this.set('floating', false);
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().css('position', '');
    this.$().css('top', '');
    $(document).off('scroll.column');
  },

  toggle: observer('enabled', function() {
    if (this.get('enabled')) {
      this.removeContentAffixing();
      this.initContentAffixing();
    } else {
      this.removeContentAffixing();
    }
  })
});

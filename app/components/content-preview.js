import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['ContentPreview'],

  didInsertElement() {
    this._super(...arguments);

    this.$('.ContentPreview-scrollButton').on('click.scroll-top', () => {
      $(window).animate({ scrollTop: 0 }, 'slow');
    });
  }
});

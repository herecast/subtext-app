import $ from 'jquery';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  scrollToComments() {
    const modalDialogClass = '.Modal-dialog-body';
    const parentModals = $(this.element).parents(modalDialogClass);
    const isInModal = parentModals.length > 0;

    let $containerToAnimate;

    if (isInModal) {
      $containerToAnimate = $(parentModals[0]);
    } else {
      $containerToAnimate = $('html,body');
    }
    
    $containerToAnimate.animate({
      scrollTop: $containerToAnimate.find('#CommentList').first().position().top - 50
    }, 1500);
  }
});

import ModalDialog from 'ember-modal-dialog/components/modal-dialog';

export default ModalDialog.extend({
  containerClassNames: 'ModalDialog-container',
  overlayClassNames: 'ModalDialog-overlay',
  wrapperClassNames: 'ModalDialog-wrapper',
  targetAttachment: "none",
  translucentOverlay: true
});

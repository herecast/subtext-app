import ModalInstance from 'subtext-ui/pods/components/modal-instance/component';

export default ModalInstance.extend({
  close() {
    this.ok();
  }
});

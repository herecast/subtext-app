import Ember from 'ember';

const {
  inject,
  set,
  get
} = Ember;

const RenderInModal = Ember.Component.extend({
  modals: inject.service(),
  tagName:"",
  modalWrapper: 'modals/headless-wrapper',
  component: null,
  _modal: null,

  onClose() {},
  onOk() {},
  onCancel() {},

  init() {
    this._super();

    const modals = get(this, 'modals');
    const modalWrapper = get(this, 'modalWrapper');
    const component = get(this, 'component');
    const onClose = get(this, 'onClose');
    const onOk = get(this, 'onOk');
    const onCancel = get(this, 'onCancel');

    const modal = modals.createModal(modalWrapper, component);

    modal.defer.promise.then(onOk).catch(onCancel).finally(onClose);

    set(this, '_modal', modal);
  },

  willDestroyElement() {
    get(this, 'modals').removeModal(
      get(this, '_modal')
    );
  }
});

RenderInModal.reopenClass({
  positionalParams: ['component']
});

export default RenderInModal;

import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['Feed-SourceChooser'],

  session: service(),

  currentUser: readOnly('session.currentUser'),

  useAvatar: readOnly('session.isAuthenticated')
});

import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';

const { get, computed, isPresent } = Ember;

export default DS.Model.extend({
  name: DS.attr('string'),
  nextDigestSendTime: DS.attr('date'),

  formattedDailyDigestSendTime: computed('nextDigestSendTime', function() {
    const sendTime = get(this, 'nextDigestSendTime');

    if(isPresent(sendTime)) {
      return moment(sendTime).format("LT");
    } else {
      return "";
    }
  })
});

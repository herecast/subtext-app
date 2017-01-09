import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
/* global dataLayer */

const {
	set,
	get
} = Ember;

export default Ember.Component.extend(InViewportMixin, {
	canSendImpression: true,

  didEnterViewport() {
  	if (get(this, 'canSendImpression')) {
  		if (typeof dataLayer !== "undefined") {
	  		dataLayer.push({
	  			'event': 'market-digest-cta-impression'
	  		});
	  	}
  		set(this, 'canSendImpression', false);
  	}
  },
});

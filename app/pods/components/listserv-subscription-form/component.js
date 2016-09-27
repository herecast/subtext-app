import Ember from 'ember';
import Validation from 'subtext-ui/mixins/components/validation';
import SilentRegistration from 'subtext-ui/mixins/silent-registration';

const { get, set, computed, on, inject } = Ember;
const { Promise } = Ember.RSVP;

export default Ember.Component.extend(Validation, SilentRegistration, {
  classNames: ['ListservSubscriptionForm'],

  model: null,

  api: inject.service(),
  session: inject.service(),
  toast: inject.service(),
  routing: inject.service('-routing'),

  windowLocation: inject.service(),
  forgotPasswordReturnUrl: computed(function(){
    return get(this, 'windowLocation').href();
  }),

  locations: [],

  hasSubscribed: false,
  hasRegistered: false,
  afterMessage: '',
  redirectInfo: {},

  user: computed.alias('session.currentUser'),

  isSignedIn: computed.notEmpty('user'),

  isRegistered: computed.notEmpty('model.userId'),

  listserv: computed.alias('model.listserv'),

  getLocations: on('init', function() {
    const api = get(this, 'api');

    api.getLocations().then(response => {
      if(!get(this, 'isDestroyed')) {
        set(this, 'locations', response.locations);
      }
    });

  }),

  formattedLocations: computed('locations', function() {
    return this.get('locations').map(function(location) {
      return {
        id: location.id,
        formattedLocation: `${location.city}, ${location.state}`
      };
    });
  }),
  //Validation mixin override
  validateForm() {
    //registered users require only password validation
    //unregistered users require password/name/location validation
    set(this, 'errors.password', null);
    delete get(this, 'errors')['password'];

    if ( !get(this, 'isRegistered') && !get(this,'isSignedIn') ) {
      this.validatePresenceOf('model.name');
      this.validatePresenceOf('model.location');
      this.hasValidPassword( get(this, 'model.password') );
    } else if (get(this, 'isRegistered') && !get(this, 'isSignedIn')) {
      this.hasValidPassword( get(this, 'model.password') );
    }
  },

  validatePassword() {
    set(this, 'errors.password', 'Checking password...');
    let data = {
      email: get(this, 'model.email'),
      password: get(this, 'model.password')
    };

    return this.signin(data)
    .then(
      () => {
        set(this, 'errors.password', null);
        delete get(this, 'errors')['password'];
        return Promise.resolve();
      },
      () => {
        set(this, 'errors.password', 'Wrong password');
        if (get(this, 'isRegistered')) {
          return Promise.reject();
        }
      });
  },

  subscribe() {
    const api = get(this, 'api');

    return api.confirmListservSubscription( get(this, 'model.id') )
    .then(
      () => {
        this.sendToIndex();
      });
  },

  register() {
    const api = get(this, 'api');
    const model = get(this, 'model');
    const data = {
      registration: {
        email: get(model, 'email'),
        password: get(model, 'password'),
        name: get(model,'name'),
        location_id: get(model,'location'),
        confirmation_key: `subscription/${model.id}`
      }
    };

    return api.confirmedRegistration(data)
      .then(
        (response) => {
          return this.signin(response);
        }, () => {
          const toast = get(this, 'toast');
          toast.error('Your registration failed. Please contact dailyUV.com');
          return Promise.reject();
        });
  },

  redirectTo(settings) {
    const toast = get(this, 'toast');
    let text = settings.text || '';
    let title = settings.title || '';
    let options = settings.options || {
      closeButton: true,
      positionClass: "toast-top-center afterSubscriptionToast",
      showDuration: 0,
      hideDuration: 1000,
      timeOut: 0,
      extendedTimeOut: 0
    };

    toast.info(text, title, options);
    window.scrollTo(0,0);
    get(this, 'routing').transitionTo(settings.route);
  },

  sendToIndex() {
    const listservName = get(this, 'listserv.name');
    const sendTime = get(this, 'listserv.formattedDailyDigestSendTime');
    this.redirectTo({
      route: 'index',
      text:   `You are subscribed to the ${listservName} and registered to dailyUV.com.<br />
              Your ${listservName} digest will be delivered daily around ${sendTime}.<br />
              You can also browse or post for free on dailyUV.com anytime!`,
      title: "YOU'RE OFFICIALLY IN!"
    });
  },

  actions: {
    subscribe() {
      const isRegistered = get(this, 'isRegistered');
      const isSignedIn = get(this, 'isSignedIn');

      if ( this.isValid() ) {
        //only need to run validatePassword if user is registered
        if (isRegistered && isSignedIn) {

          return this.subscribe();

        } else if (isRegistered && !isSignedIn) {

          this.validatePassword().then(
            () => {
              return this.subscribe();
            });

        } else {

          this.register().then(
            () => {
              return this.subscribe();
            });

        }
      }
      //for the async-button
      return Promise.reject();

  }
}
});

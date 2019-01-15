import $ from 'jquery';
import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
  fastboot: service(),

  model() {
    const controller = this.controllerFor('startablog');

    return get(this, 'store').createRecord('organization', {
      name: 'My New Blog',
      profileImageUrl:'https://s3.amazonaws.com/subtext-misc/startablog/generic-profile-picture.jpg',
      backgroundImageUrl: get(controller, 'avatarUrls.background'),
      description: "Welcome to My New Blog, where I'll be posting about the things that are important to me.",
      orgType: 'Blog',
      hoursCardActive: false
    });
  },

  actions: {
    didTransition() {
      if (!get(this, 'fastboot.isFastBoot')) {
        window.scrollTo(0, 0);
        $('body').addClass('modal-open');
      }
    },

    willTransition() {
      $('body').removeClass('modal-open');
    }
  }
});

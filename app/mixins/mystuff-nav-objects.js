import { setProperties } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  init() {
    this._super(...arguments);
    setProperties(this, {
      mystuffNavObjects: [
        {
          order: 0,
          routeName: 'mystuff.contents.index',
          title: 'Posts',
          iconActive: 'window-maximize',
          iconInactive: 'window-maximize'
        },
        {
          order: 1,
          routeName: 'mystuff.comments.index',
          title: 'Comments',
          iconActive: 'comments',
          iconInactive: 'comments-o'
        },
        {
          order: 2,
          routeName: 'mystuff.bookmarks',
          title: 'Likes',
          isLikes: true,
          iconActive: 'heart',
          iconInactive: 'heart-o'
        },
        {
          order: 3,
          routeName: 'mystuff.subscriptions',
          title: 'Subscriptions',
          iconActive: 'newspaper-o',
          iconInactive: 'newspaper-o'
        },
        {
          order: 4,
          routeName: 'mystuff.hides',
          title: 'Hides',
          iconActive: 'low-vision',
          iconInactive: 'low-vision'
        },
        {
          order: 5,
          routeName: 'mystuff.account',
          title: 'Account',
          iconActive: 'user',
          iconInactive: 'user-o'
        }
      ]
    });
  }

});

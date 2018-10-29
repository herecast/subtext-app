import Route from '@ember/routing/route';
import { get } from '@ember/object';
import RouteMetaMixin from 'subtext-ui/mixins/routes/social-tags';
import DocTitleFromContent from 'subtext-ui/mixins/routes/title-token-from-content';

export default Route.extend(RouteMetaMixin, DocTitleFromContent, {
  model(params)  {
    return this.store.findRecord('promotion-coupon', params.id);
  },

  afterModel(model) {
    const imageHeight = get(model, 'imageHeight') || 640;
    const imageWidth = get(model, 'imageWidth') || 360;
    const message = get(model, 'message') || 'DailyUV Promotional Coupon';

    model.setProperties({
      imageHeight: imageHeight,
      imageWidth: imageWidth,
      content: message
    });
  }
});

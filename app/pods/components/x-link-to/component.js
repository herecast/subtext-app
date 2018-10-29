import LinkComponent from '@ember/routing/link-component';
import EmberObject, { get } from '@ember/object';
import XButtonMixin from 'subtext-ui/mixins/components/x-button';

/**
 * Reusable button-styled `link-to` component supporting multiple button colors, sizes and styles.
 * Also see `x-button` component, for a `button` version with the same styling.
 */
export default LinkComponent.extend(XButtonMixin, {
  tagName: 'a',
  style: 'link',
  color: 'black',
  contentOrganizationId: false,
  onClick(){},

  click(e) {
    e.preventDefault();
    this.onClick();
  },

  didReceiveAttrs() {
    const contentOrganizationId = get(this, 'contentOrganizationId');

    if (contentOrganizationId) {
      let params = get(this, 'params');
       const queryParams = EmberObject.create({
         isQueryParams: true,
         values: {
           organization_id: contentOrganizationId
         }
       });

     params.push(queryParams);
    }

    this._super(...arguments);
  }
});

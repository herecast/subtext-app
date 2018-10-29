import { helper as buildHelper } from '@ember/component/helper';

export function dynamicParams([routeName, params]) {
  return [
    routeName,
    {
      isQueryParams: true,
      values: params
    }
  ];
}

export default buildHelper(dynamicParams);

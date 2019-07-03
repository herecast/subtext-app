import { get, computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['FirstVisit-Timer'],

  size: 200,
  rotationDegrees: 0, //0 - 360

  minBorderWidth: 2,
  borderRatio: 0.05,
  circleHidden: false,

  borderWidth: computed('size', function() {
    const size = parseInt(get(this, 'size'));
    const minBorderWidth =  parseInt(get(this, 'minBorderWidth'));
    const borderRatio = get(this, 'borderRatio');

    let calculatedBorderWidth = parseInt(borderRatio * size);

    if (calculatedBorderWidth < minBorderWidth) {
      return minBorderWidth;
    } else {
      return calculatedBorderWidth;
    }
  }),

  wrapStyle: computed('size', function() {
    const size = get(this, 'size');
    const borderWidth = get(this, 'borderWidth');
    const sideLength = parseInt(size + (borderWidth * 2));
    return htmlSafe(`height:${sideLength}px;width:${sideLength}px;`);
  }),

  halfCircleStyle: computed('size', function() {
    return htmlSafe(`border-width:${get(this, 'borderWidth')}px;`);
  }),

  circleClass: computed('rotationDegrees', function() {
    const rotationDegrees = get(this, 'rotationDegrees');

    let rotateText = '';

    if (rotationDegrees > 0 && rotationDegrees <= 180) {
      rotateText = `rotate-${rotationDegrees}`;
    } else if (rotationDegrees > 180){
      rotateText = 'rotate-180';
    }

    return htmlSafe(rotateText);
  }),

  sideClass: computed('rotationDegrees', function() {
    const rotationDegrees = get(this, 'rotationDegrees');

    let rotateText = '';

    if (rotationDegrees > 180 && rotationDegrees <= 360) {
      rotateText =  `rotate-${rotationDegrees-180}`;
    } else if (rotationDegrees > 360) {
      rotateText = 'rotate-180';
    }

    return htmlSafe(rotateText);
  }),

  showClipper: computed('rotationDegrees', 'circleHidden', function() {
    return !get(this, 'circleHidden') && parseInt(get(this, 'rotationDegrees')) <= 180;
  })
});

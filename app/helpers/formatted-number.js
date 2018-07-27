import Ember from 'ember';

function formatByMethod(rawNumber, type, digits) {
  var methods = {
    comma: function(num) {
      if (num) {
        let str = num.toString().split('.');

        if (str[0].length > 3) {
          str[0] = str[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        }

        return str.join('.');
      }
      return num;
    },
    dollars: function(num, digits) {
      if (!digits) {
        digits = 2;
      }

      const fixed = Number.parseFloat(num).toFixed(digits);

      return `$${fixed}`;
    }
  };

  if (typeof methods[type] === 'function') {
    return methods[type](rawNumber, digits);
  }

  return rawNumber;
}

export function formattedNumber(params) {
  const { length } = params;
  const rawNumber = params[0];
  const format = params[1] || false;
  const digits = params[2] || false;

  if (length >= 2) {
    return formatByMethod(rawNumber, format, digits);
  }

  return rawNumber;
}

export default Ember.Helper.helper(formattedNumber);

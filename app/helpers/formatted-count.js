import { helper } from '@ember/component/helper';

function formatWithComma(number) {
  return number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

export function formattedCount(params) {
  let rawNumber = params[0] || null;
  const ifZero = params[1] || false;

  if (rawNumber) {
    const countInt = parseInt(rawNumber);
    let countString = countInt.toString();
    let placeholder;

    if (countInt >= 1000 && countInt < 10000) {
      countString = formatWithComma(countString);
    } else if (countInt >=10000 && countInt < 100000) {
      placeholder = (countInt / 1000).toFixed(1);
      countString =  formatWithComma(placeholder) + ' K';
    } else if (countInt >= 100000 && countInt < 1000000) {
      countString =  (countInt / 1000).toFixed(0) + ' K';
    } else if (countInt >= 1000000 ) {
      placeholder = (countInt / 1000000).toFixed(2);
      countString = formatWithComma(placeholder) + ' M';
    }

    return countString
  } else if (ifZero) {
    return ifZero
  }

  return params;
}

export default helper(formattedCount);

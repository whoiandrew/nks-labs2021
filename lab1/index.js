//labwork1
//Adnrii Doroshenko, IO-71
//@whoiandrew 18.02.21

import {  srcArr, numberOfIntervals, gamma, t1, t2 } from "./data.js";


//validation
(() => {
  if (!srcArr.length || (gamma > 1 || gamma < 0) || !numberOfIntervals){
    console.log("Invalid input data");
    return process.kill(process.pid);
  } 
})();

Array.prototype.findAverage = function () {
  return this.reduce((acc, item) => acc + item) / this.length;
};

Number.prototype.toCertainPrecision = function (prec) {
  return Number(this.toPrecision(prec));
};

const maxVal = Math.max(...srcArr);
const intervalLength = maxVal / numberOfIntervals;

//array of arrays with corresponding values for each interval
const valuesInIntervals = new Array(numberOfIntervals)
  .fill(null)
  .map((_, index) =>
    srcArr.filter(
      (item) =>
        item >= index * intervalLength && item <= (index + 1) * intervalLength
    )
  );

const failureDistributionDensity = valuesInIntervals.map((item) =>
  (item.length / (srcArr.length * intervalLength)).toCertainPrecision(3)
);

const probabilities = failureDistributionDensity.map((item, index, arr) => {
  const reducer = (redArr, redIndex) =>
    redArr.slice(0, redIndex).reduce((acc, item) => acc + item);
  return Math.abs(
    Number((1 - reducer(arr, index + 1) * intervalLength).toFixed(2))
  );
});

const t_gamma = Number(
  (
    0 +
    intervalLength * Number(((1 - gamma) / (1 - probabilities[0])).toFixed(2))
  ).toFixed(2)
);

const valueInInterval = (value) => Math.ceil(value / intervalLength);

const nonFailureProbabilitiy =
  1 -
  new Array(valueInInterval(t1))
    .fill(null)
    .map((_, index, arr) => {
      return index === arr.length - 1
        ? failureDistributionDensity[index] *
            (t1 - intervalLength * (arr.length - 1))
        : failureDistributionDensity[index] * intervalLength;
    })
    .reduce((acc, item) => acc + item);

const failureIntensity =
  failureDistributionDensity[valueInInterval(t2) - 1] / nonFailureProbabilitiy;

(() => {
  console.group("Calcs result: ");
  console.log(`T_avg: ${srcArr.findAverage()}`);
  console.log(
    `\nMax value: ${maxVal}\nNumber of intervals: ${numberOfIntervals}\nLength: ${intervalLength}\n`
  );

  console.group("\nIntervals: ");
  valuesInIntervals.forEach((_, index) => {
    console.log(
      `Interval ${index + 1}: ${Number(index && index * intervalLength).toFixed(
        1
      )} - ${Number((index + 1) * intervalLength).toFixed(1)}`
    );
  });
  console.groupEnd();


  console.group("\nStatistic density values of failure probability:");

  failureDistributionDensity.forEach((item, index) => {
    console.log(`f${index + 1}: ${item}`);
  });
  console.groupEnd();

  console.group("\n Non-failure probablity for each interval:");
  probabilities.forEach((item, index) => {
    console.log(`P(${Number((index + 1) * intervalLength).toFixed(1)}): ${item}`);
  });
  console.groupEnd();

  console.log(`\nT(gamma) value: T(${gamma}): ${t_gamma}`);
  console.log(`\nNon-failure probability P(${t1}): ${nonFailureProbabilitiy}`);
  console.log(`\nFailure intensity \u03bb(${t2}): ${failureIntensity}`);
  console.groupEnd();
})();

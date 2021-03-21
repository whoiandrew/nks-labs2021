const linkTable = [
  [0, 1, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0],
];

//represents nodes that could be last ones, but also could has links
const lastInRowNodes = [2, 4, 5];

//starting nodes, according to the task could be not only 1
const firstInRowNodes = [0]

const probabilities = [0.59, 0.89, 0.55, 0.22, 0.7];

const hours = 1000;

export { linkTable, probabilities, lastInRowNodes, firstInRowNodes, hours};

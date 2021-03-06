//nks 2nd lw @whoiandrew
//Doroshenko Andrii
//IO-71
//4.03.21

"use strict";

import {
  linkTable,
  probabilities,
  lastInRowNodes,
  firstInRowNodes,
} from "./data.js";

//FIFO data structure
class Queue {
  constructor(...items) {
    this.queue = [...items];
  }

  push(...items) {
    this.queue.push(...items);
  }

  pop() {
    return this.queue.shift();
  }
}

class Graph {
  constructor(linkTable) {
    this.linkTable = linkTable;
  }

  get finalNodes() {
    return this.linkTable
      .map(
        (rowItem, index) =>
          rowItem.filter((item) => item === 0).length ===
            this.linkTable.length && index
      )
      .filter((item) => item);
  }

  get maxVertex() {
    return this.linkTable.length;
  }

  get simplifiedLinks() {
    return this.linkTable.map((rowItem) =>
      rowItem
        .map((item, index) => {
          if (item === 1) {
            return index;
          }
        })
        .filter((item) => item !== undefined)
    );
  }

  get edges() {
    const edges = [];
    this.linkTable.forEach((rowItem, rowIndex) => {
      rowItem.forEach((item, index) => {
        if (item === 1) {
          edges.push([rowIndex, index]);
        }
      });
    });
    return edges;
  }

  nextNodes(currentNode) {
    return this.edges
      .filter((item) => item[0] === currentNode)
      .map((item) => item[1]);
  }
}

//kinda dfs algorithm
const findAllPaths = (g, queue) => {
  const result = [];
  while (queue.queue.length) {
    const path = queue.pop();
    const lastNode = path[path.length - 1];
    const nextNodes = g.nextNodes(lastNode);
    if (g.finalNodes.includes(lastNode)) {
      result.push(path);
    } else {
      const newPaths = nextNodes.map((item) => [...path, item]);
      if (lastInRowNodes.includes(lastNode + 1)) {
        result.push(path);
      }
      queue.push(...newPaths);
    }
  }
  return result;
};

((linkTable, probabilities) => {
  let error = true;
  if ([linkTable, probabilities].every((item) => Array.isArray(item))) {
    error = ![
      linkTable.length === 0,
      linkTable.length > 100,
      probabilities.length !== linkTable.length,
      linkTable.length !==
        linkTable.filter((item) => item.length === linkTable.length).length,
      probabilities.filter((item) => item <= 1 && item >= 0).length !==
        probabilities.length,
    ].every((item) => item === false);
  }
  if (error) {
    console.log("Input data error, check it before the script running");
    process.exit(1);
  }
})(linkTable, probabilities);

const queue = new Queue(...firstInRowNodes.map((item) => [item])); //init queue for dfs, starting from 0th vertex
const graph = new Graph(linkTable); //init based on linkTable graph
const criticalPaths = findAllPaths(graph, queue);

const pathToBinary = (path) =>
  new Array(graph.maxVertex)
    .fill(0)
    .map((_, index) => (path.includes(index) ? 1 : 0));

const criticalBinaryPaths = criticalPaths.map((item) => pathToBinary(item));

const pathProbability = (binaryPath, probs) => {
  return probs.reduce(
    (acc, item, index) => (acc || 1) * (binaryPath[index] ? item : 1 - item)
  );
};

const removeArrDuplicates = (arr) => [...new Set(arr)];

const overPaths = [];

criticalBinaryPaths.forEach((itemBinPath) => {
  itemBinPath
    .filter((item) => item === 0)
    .reduce((prevState) => {
      const newState = [...prevState];
      newState[prevState.indexOf(0)] = 1;
      overPaths.push(newState);
      return newState;
    }, itemBinPath);
});

const allBinaryPaths = removeArrDuplicates(
  criticalBinaryPaths.concat(overPaths).map((item) => JSON.stringify(item))
).map((item) => JSON.parse(item));

const totalProbability = allBinaryPaths
  .map((item) => pathProbability(item, probabilities))
  .reduce((acc, item) => acc + item);

const drawPath = (binPath) => {
  const bufArr = new Array(graph.maxVertex).fill(null).map((_, index) => index);
  const nodes = bufArr
    .filter((_, index) => binPath[index])
    .map((item) => item + 1);
  return nodes.map((item) => `e${String(item)}`).join(", ");
};

(() => {
  console.group("\nAll possible working nodes for topology: \n");
  allBinaryPaths.forEach((pathItem) => {
    console.log(drawPath(pathItem));
    console.log(`P(state) = ${pathProbability(pathItem, probabilities)}\n`);
  });
  console.groupEnd();
  console.log(`\nNumber of possible paths: ${allBinaryPaths.length}`);
  console.log(`\nTotal probability: ${totalProbability}`);
})();

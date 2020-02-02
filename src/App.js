import React, {useEffect, useState} from 'react';
import {
  random as _random,
  times as _times,
  differenceWith as _differenceWith,
  isEqual as _isEqual,
  orderBy as _orderBy,
} from 'lodash';

import './App.css';

function App() {
  /*
   * Generate a random board of 10x10 blocks.​ A simple grid of colours (Done)
   * When you click on a block with one or more neighbours of the same colour, blocks with matching colour are removed and need to disappear (Done)
   * Blocks on the diagonal do not count as neighbours. (Done)
   * You should not be able to remove a single block. (Done)
   * Bonus: Can you think how you'd do scoring? (No need to implement this).
   * Answer: We can count the matched blocks and give score depending on that.
   * TODO After you remove the blocks, the remaining blocks above the ones that were removed need to fall down. (40% Done) switch on the "removeAndReplaceFlag" state
   * TODO The game ends when the grid is empty or when no more blocks can be removed. (Didn't have time to reach this point)
   * TODO Write tests. (Didn't have time to do that)
   * */
  useEffect(() => {
    createBlocksMatrix();
  }, []);

  const [gridBlocksArray, setGridBlocksArray] = useState([]);
  const [removeAndReplaceFlag, setRemoveAndReplaceFlag] = useState(false); //this feature is 40% finished.
  const gridData = {rowsLength: 10, columnsLength: 10, columnWidth: 50};
  const colorsArray = ['red', 'green', 'blue', 'yellow'];
  const blockObject = (rowIndex, columnIndex) => {
    return {
      rowIndex,
      columnIndex,
      color: colorsArray[_random(colorsArray.length - 1)],
    };
  };
  let matchedBlocksArray = [];

  const createBlocksMatrix = () => {
    const grid = _times(gridData.rowsLength, rowIndex => {
      return _times(gridData.columnsLength, columnIndex => blockObject(rowIndex, columnIndex));
    });

    setGridBlocksArray(grid);
  };
  const checkTheSiblings = (blockData, isCleanArray) => { //Get all the matched siblings of the selected block
    isCleanArray && (matchedBlocksArray = []); //Clean the array with every new click
    matchedBlocksArray.push(blockData);

    const result = getBlockSiblings(blockData); //Get the current block's matched siblings

    const uniqueBlocksArray = _differenceWith(result, matchedBlocksArray, _isEqual); //remove the duplicates that already been added to the array

    if (uniqueBlocksArray.length) {
      uniqueBlocksArray.map(block => checkTheSiblings(block));
    }
    else {
      if (matchedBlocksArray.length > 1) {
        removeMatchedBlocks();
        removeAndReplaceFlag && moveTopSiblings();
      }
    }
  };
  const getBlockSiblings = ({rowIndex, columnIndex}) => { //Get all the matched level1 siblings of the selected block
    const blockSiblingsArray = [];
    const currentBlockColor = gridBlocksArray[rowIndex][columnIndex].color;
    const leftBlockColor = (columnIndex - 1 >= 0) && gridBlocksArray[rowIndex][columnIndex - 1].color;
    const rightBlockColor = (columnIndex + 1 <= gridData.columnsLength - 1) && gridBlocksArray[rowIndex][columnIndex + 1].color;
    const topBlockColor = rowIndex - 1 >= 0 && gridBlocksArray[rowIndex - 1][columnIndex].color;
    const bottomBlockColor = (rowIndex + 1 <= gridData.rowsLength - 1) && gridBlocksArray[rowIndex + 1][columnIndex].color;

    if (currentBlockColor === leftBlockColor) {
      blockSiblingsArray.push({rowIndex, columnIndex: columnIndex - 1});
    }
    if (currentBlockColor === rightBlockColor) {
      blockSiblingsArray.push({rowIndex, columnIndex: columnIndex + 1});
    }
    if (currentBlockColor === topBlockColor) {
      blockSiblingsArray.push({rowIndex: rowIndex - 1, columnIndex});
    }
    if (currentBlockColor === bottomBlockColor) {
      blockSiblingsArray.push({rowIndex: rowIndex + 1, columnIndex});
    }

    return blockSiblingsArray;
  };
  const removeMatchedBlocks = () => {
    const gridBlocksArrayClone = [...gridBlocksArray];

    matchedBlocksArray.map(blockData => gridBlocksArrayClone[blockData.rowIndex][blockData.columnIndex].isHidden = true);
    setGridBlocksArray(gridBlocksArrayClone);
  };
  const moveTopSiblings = () => {
    const sortedArray = _orderBy(matchedBlocksArray, ['rowIndex', 'columnIndex'], 'desc');
    let gridBlocksArrayClone = [...gridBlocksArray];
    let selectedColumnsIndex = [];

    const lowestBlockColumns = sortedArray.filter(obj => {
      if (!selectedColumnsIndex.includes(obj.columnIndex)) {
        selectedColumnsIndex.push(obj.columnIndex);
        return obj;
      }
    });

    lowestBlockColumns.map(blockData => {
      let steps = 1;

      for (let i = 1; i <= blockData.rowIndex; i++) {
        let currentBlock = gridBlocksArrayClone[blockData.rowIndex - i][blockData.columnIndex];

        if (!currentBlock.isHidden) {
          gridBlocksArrayClone[blockData.rowIndex - i][blockData.columnIndex] = {...currentBlock, rowIndex: currentBlock.rowIndex + steps};

          console.log('steps', gridBlocksArrayClone[blockData.rowIndex - i][blockData.columnIndex], steps);
        }
        else {
          steps += 1;
        }
      }
    });

    setGridBlocksArray(gridBlocksArrayClone);
  };

  return (
      <div className="App">
        <div className='GameContainer'>
          <div className='GameContainer__title'>
            Candy Crush Game
          </div>
          <div className="GameContainer__body"
               style={{
                 width: gridData.columnsLength * gridData.columnWidth,
                 height: gridData.columnsLength * gridData.columnWidth,
               }}>
            {gridBlocksArray.map((rowArray, rowIndex) =>
                                     rowArray.map((blockData, columnIndex) =>
                                                      <div key={(rowIndex * gridData.rowsLength) + columnIndex}
                                                           className="GameContainer__block"
                                                           style={{
                                                             top: `${blockData.rowIndex * gridData.columnWidth}px`,
                                                             left: `${blockData.columnIndex * gridData.columnWidth}px`,
                                                             backgroundColor: blockData.color,
                                                             display: blockData.isHidden && 'none',
                                                           }}
                                                           onClick={() => checkTheSiblings({
                                                                                             rowIndex: blockData.rowIndex,
                                                                                             columnIndex: blockData.columnIndex,
                                                                                           }, true)}>
                                                        {(rowIndex * gridData.rowsLength) + columnIndex}
                                                      </div>,
                                     ),
            )}
          </div>
        </div>
      </div>
  );
}

export default App;

import React, {useEffect, useState} from 'react';
import {random as _random, times as _times, differenceWith as _differenceWith, isEqual as _isEqual} from 'lodash';

import './App.css';

function App() {
  useEffect(() => {
    createBlocksMatrix();
  }, []);

  const [gridBlocksArray, setGridBlocksArray] = useState([]);
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
  const checkTheSiblings = (blockData, isCleanArray) => {
    isCleanArray && (matchedBlocksArray = []); //Clean the array with every new click
    matchedBlocksArray.push(blockData);

    const result = getBlockSiblings(blockData); //Get the current block's matched siblings

    const uniqueBlocksArray = _differenceWith(result, matchedBlocksArray, _isEqual); //remove the duplicates that already been added to the array

    if (uniqueBlocksArray.length) {
      uniqueBlocksArray.map(block => checkTheSiblings(block));
    }
    else {
      (matchedBlocksArray.length > 1) && removeMatchedBlocks();
    }
  };
  const getBlockSiblings = ({rowIndex, columnIndex}) => {
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
    const tmp = [...gridBlocksArray];

    matchedBlocksArray.map(blockData => tmp[blockData.rowIndex][blockData.columnIndex].color = 'white');

    setGridBlocksArray(tmp);
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

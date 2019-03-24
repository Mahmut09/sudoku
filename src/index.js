//import { it } from "mocha";

module.exports = function solveSudoku(matrix) {
  const matrixOrigin = JSON.parse(JSON.stringify(matrix));
  let matrixCurrent = [...matrix];

  const first = [0, 1, 2];
  const second = [3, 4, 5];
  const third = [6, 7, 8]
  let unsolved = [];

  //console.log(matrixOrigin);

  function createUnsolved(i, j) {
    if (matrixCurrent[i][j] == 0) {
      let obj = {}
      obj.x = i;
      obj.y = j;
      obj.possibles = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      obj.sector = generateSector(i, j);
      unsolved.push(obj)
    }
  }

  function setColumn(y) {
    let column = []
    for (let i = 0; i < 9; i++) {
      column.push(matrixCurrent[i][y])
    }
    return column
  }

  function generateSector(rowIndex, colIndex) {
    let sector = {};
    const switchSectors = (index, place) => {
      switch (index) {
        case 0:
        case 1:
        case 2:

          sector.id = sector.id ? sector.id + 1 : 1;
          sector[place] = first
          break;

        case 3:
        case 4:
        case 5:

          sector.id = sector.id ? sector.id + 2 : 2;
          sector[place] = second
          break;

        case 6:
        case 7:
        case 8:

          sector.id = sector.id ? sector.id + 3 : 3;
          sector[place] = third
          break;

        default:
          break;
      }
    }
    switchSectors(rowIndex, 'row');
    switchSectors(colIndex, 'col');
    return sector
  }

  function iterateMatrix(func) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        func(i, j);
      }
    };
  }

  function iterateSector(obj, func) {
    for (i = obj.row[0]; i < obj.row[2]; i++) {
      for (j = obj.col[0]; j < obj.col[2]; j++) {
        func();
      }
    }
  }

  function getUniquesFromArrays(array) {
    if (array.length) {
      return array.reduce((accumulator, element) => {
        accumulator = accumulator.concat(element.filter(number => !accumulator.includes(number)));
        return accumulator
      })
    };
  };

  function checkIfSolved(array, x, y) {
    if (array.length === 1) {
      matrixCurrent[x][y] = array[0];
      return false
    } else return true
  }

  function singles(current) {
    let x = current.x;
    let y = current.y;
    let row = matrixCurrent[x];
    let col = setColumn(y);
    let sectorValues = [];
    let pushValues = () => {
      if (matrix[i][j] != 0) {
        sectorValues.push(matrixCurrent[i][j])
      }
    }

    iterateSector(current.sector, pushValues);
    current.possibles = current.possibles.filter(number => !row.includes(number) && !col.includes(number) && !sectorValues.includes(number));
    return checkIfSolved(current.possibles, x, y)

  }

  function hiddenSingles(current) {
    let x = current.x;
    let y = current.y;
    let rowUnsolved = unsolved.filter(element => element.x === x && element.y != y);
    let rowPossibles = rowUnsolved.map(element => element.possibles);
    let colUnsolved = unsolved.filter(element => element.y === y && element.x != x);
    let colPossibles = colUnsolved.map(element => element.possibles);
    let sectorUnsolved = unsolved.filter(element => element.sector.id === current.sector.id && (i != x || j != y));

    let sectorPossibles = sectorUnsolved.map(element => element.possibles);

    if (rowPossibles.length) {
      rowHidden = getUniquesFromArrays(rowPossibles);
    } else rowHidden = [];
    if (colPossibles.length) {
      colHidden = getUniquesFromArrays(colPossibles)
    } else colHidden = [];
    if (sectorPossibles) {
      sectorHidden = getUniquesFromArrays(sectorPossibles)
    } else sectorHidden = [];

    hidden = current.possibles.filter(number => !rowHidden.includes(number) && !colHidden.includes(number) && !sectorHidden.includes(number));

    return checkIfSolved(hidden, x, y);
  }


  function blockedCandidate(sectorID) {
    let sectorUnsolved = unsolved.filter(element => element.sector.id === sectorID);
    let otherUnsolved = unsolved.filter(element => element.sector.id != sectorID);

    let candidates = {};
    let coordinates = {};
    let blocked = {}
    let sectorPossibles = sectorUnsolved.reduce((acc, element) => {
      acc = acc.concat(element.possibles)
      return acc
    }, []);

    let sortedPossibles = {}
    sectorPossibles.forEach(number => {
      sortedPossibles[number] = sortedPossibles[number] ? sortedPossibles[number] + 1 : 1;
    });

    let possibleCandidates = Object.keys(sortedPossibles).filter(element => sortedPossibles[element] > 1)

    possibleCandidates.forEach(possible => {

      candidates[possible] = sectorUnsolved.filter(element => {

        return element.possibles.includes(Number(possible))
      });
    });
    possibleCandidates.forEach(possible => {
      coordinates[possible] = {};
      coordinates[possible].x = [];
      coordinates[possible].y = [];
      blocked[possible] = {};

      candidates[possible].forEach(candidate => {
        coordinates[possible].x.push(candidate.x);
        coordinates[possible].y.push(candidate.y);
      })
    });
    possibleCandidates.forEach(possible => {
      blocked[possible].x = coordinates[possible].x.reduce((accumulator, x) => accumulator == x ? accumulator : false);
      blocked[possible].y = coordinates[possible].y.reduce((accumulator, y) => accumulator == y ? accumulator : false);
    });

    let blockedFound = Object.keys(blocked).reduce((acc, key) => {
      if (blocked[key].x || blocked[key].y) {
        acc.push(Number(key));
      }
      return acc
    }, [])

    function deleteBlocked(blocked, coordinate) {
      let place = coordinates[blocked][coordinate][0];
      let lineBlocked = otherUnsolved.filter(element => element[coordinate] == place);
      lineBlocked.forEach(element => {
        toDeletionI = element.possibles.indexOf(blocked);
        if (toDeletionI >= 0) {
          element.possibles.splice(toDeletionI, 1)
        }
      });
    };
    if (blockedFound.length) {

      blockedFound.forEach(blocked => {
        if (coordinates[blocked].x) {
          deleteBlocked(blocked, 'x');
        } else deleteBlocked(blocked, 'y');
      });
    }
  }



  /* -----------main section-------------- */


  iterateMatrix(createUnsolved);
  let tried = 0;
  let f = 0;


  while (unsolved.length) {
    let unsolvedStart = JSON.stringify(unsolved);

    tried++;
    unsolved = unsolved.filter(element => singles(element));
    if (unsolved.length) {

      unsolved = unsolved.filter(element => hiddenSingles(element));
    } else return matrixCurrent;

    if (unsolved.length) {
      for (let i = 2; i < 7; i++) {
        blockedCandidate(i);
      }
    } else return matrixCurrent;



    if (unsolved.length) {
      let unsolvedEnd = JSON.stringify(unsolved);
      if (unsolvedStart == unsolvedEnd) {
        f++
        if (f > 5) {
          return console.log(`Nothing changed. Algorythms are insufficient or sudoku has no solvation `);
        }
      }
    } else return matrixCurrent;

  }

}

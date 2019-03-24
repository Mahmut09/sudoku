module.exports = function solveSudoku(matrix) {

  function SearchElement(matrixSudoku){

    const ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const LENGTH = ARRAY.length;

    let condition = true;

    

    for(let i = 0; i < LENGTH; i++){

      for(let j = 0; j < LENGTH; j++){

        if(matrixSudoku[i][j] == 0){

          for(let k = 0; k < LENGTH; k++){

            condition = true;

            for(let n = 0; n < LENGTH; n++){

              if(matrixSudoku[i][n] == ARRAY[k] || matrixSudoku[n][j] == ARRAY[k] || matrixSudoku[Math.floor(i / 3) * 3 + n % 3][Math.floor(j / 3) * 3 + Math.floor(n / 3)] == ARRAY[k]){

                condition = false;

              }

            }

            if(condition){

              matrixSudoku[i][j] = ARRAY[k];

              if(SearchElement(matrixSudoku)){

                return true;

              }

              else{

                matrixSudoku[i][j] = 0;

              }

            }

          }

          return false;

        }

      }

    }

    

    return true;

  }

  

  SearchElement(matrix);

  return matrix;

}
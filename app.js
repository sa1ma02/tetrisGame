let canvas;
let ctx;
let gBArrayHeight = 20; // Number of cells in array height
let gBArrayWidth = 12; // Number of cells in array width
let startX = 4; // Starting X position for Tetromino
let startY= 0; // Starting Y position for Tetromino
let score = 0; // Tracks the score
let level = 1; // Tracks current level
let winOrLose = "Playing";
let tetrisLogo;
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
let curTetromino = [[1,0], [0,1], [1,1], [2,1]];

let tetrominos = [];
let tetrominoColors = ['purple', 'cyan', 'red', 'blue', 'orange', 'green', 'yellow'];
let curTetrominoColor;
let gameBoardArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
let stoppedShappedArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let DIRECTION = {
    IDLE : 0,
    DOWN : 1,
    LEFT : 2, 
    RIGHT: 3
}

let direction;

class Coordinates {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

document.addEventListener('DOMContentLoaded', SetupCanvas);

function CreateCoordArray() {
    let i=0, j=0;
    for(let y=9; y<=446; y+=23) {
        for(let x=11; x<=264; x+=23) {
            coordinateArray[i][j] = new Coordinates(x, y);
            i++;
        }
        j++;
        i=0;
    }
}

function SetupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;
    ctx.scale(2, 2);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    tetrisLogo = new Image(161, 54);
    tetrisLogo.onload= DrawTetrisLogo;
    tetrisLogo.src="tetrislogo.png";

    ctx.fillStyle= 'black';
    ctx.font= '21px Arial';
    ctx.fillText("SCORE", 300, 98);

    ctx.strokeRect(300, 107,161, 24);

    ctx.fillText(score.toString(), 310, 127);

    ctx.fillText("LEVEL", 300, 157);
    ctx.strokeRect(300,171, 161, 24);
    ctx.fillText(level.toString(), 310, 190);

    ctx.fillText("WIN / LOSE", 300, 221);
    ctx.fillText(winOrLose, 310, 261);
    ctx.strokeRect(300, 232, 161, 95);

    ctx.fillText("CONTROLS", 300, 354);
    ctx.strokeRect(300, 366, 161, 104);
    ctx.font= '19px Arial';
    ctx.fillText("← : Move Left", 310, 388);
    ctx.fillText("→ : Move Right", 310, 413);
    ctx.fillText("↓ : Move Down", 310, 438);
    ctx.fillText("esp : Rotate ", 310, 463);


    document.addEventListener('keydown', HandleKeyPress);
    CreateTetrominos();
    CreateTetromino();
    CreateCoordArray();
    DrawTetromino();
}

function DrawTetrisLogo(){
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function DrawTetromino() {
    for(let i=0; i<curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function HandleKeyPress(Key) {
    if(winOrLose != "Game Over"){
        if (Key.keyCode === 37) {
            direction = DIRECTION.LEFT;
            if(!HittingTheWall() && !ChechForHorizontalCollision()){
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }
           
        } else if (Key.keyCode === 39) {
            direction = DIRECTION.RIGHT;
            if(!HittingTheWall() && !ChechForHorizontalCollision()){
                DeleteTetromino();
                startX++;
                DrawTetromino();
            }
        } else if (Key.keyCode === 40) {
            MoveTetrominoDown()
        }else if (Key.keyCode === 32){
            RotateTetromino();
        }
    }
   
}

function MoveTetrominoDown(){
    direction = DIRECTION.DOWN;
    if(!ChechForVerticalCollision()){
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
    
    
}

window.setInterval(function(){
    if(winOrLose != "Game Over"){
        MoveTetrominoDown();
    }
}, 1000);

function DeleteTetromino() {
    for(let i=0; i<curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function CreateTetrominos() {
    // Correctly pushing each tetromino as an array of coordinate pairs
 // Push T 
 tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
 // Push I
 tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
 // Push J
 tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
 // Push Square
 tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
 // Push L
 tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
 // Push S
 tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
 // Push Z
 tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    curTetromino = tetrominos[randomTetromino];
    curTetrominoColor = tetrominoColors[randomTetromino];
}

function HittingTheWall(){
    for(let i=0; i< curTetromino.length ; i++){
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }
    }
    return false;

}

function ChechForVerticalCollision(){
    let tetrominoCopy = curTetromino;
    let collision = false;
    for(let i = 0; i< tetrominoCopy.length; i++ ){
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if(direction === DIRECTION.DOWN){
            y++;
        }

        // if (y >= gBArrayHeight) {
        //     collision = true;
        //     break;
        // }
        // if(gameBoardArray[x][y+1] === 1){
            if(typeof stoppedShappedArray[x][y+1] === 'string'){
                DeleteTetromino();
                startY++;
                DrawTetromino();
                collision = true;
                break;

            }
        // }
        if (y >= 20){
            collision = true;
            break;
        }
    }
        
        if (collision){
            if(startY <= 2){
                winOrLose = "Game Over";
                ctx.fillStyle = 'White';
                ctx.fillRect(310, 242, 140, 30);
                ctx.fillStyle = 'red';
                ctx.fillText(winOrLose, 310, 261);

            }
            else{
                for(let i = 0 ; i< tetrominoCopy.length ; i++){
                    let square = tetrominoCopy[i];
                    let x = square[0] + startX;
                    let y = square[1] + startY;
                    stoppedShappedArray[x][y] = curTetrominoColor;
                }
                CheckForCompletedRows();
                CreateTetromino();
                direction = DIRECTION.IDLE;
                startX = 4;
                startY= 0;
                DrawTetromino();


                }
            }
        
    }

function ChechForHorizontalCollision(){
    let tetrominoCopy = curTetromino;
    let collision = false;
    for(let i = 0; i< tetrominoCopy.length; i++ ){
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        if(direction === DIRECTION.LEFT){
            x--;
        } else if(direction === DIRECTION.RIGHT){
            x++;
        }
        var stoppedShapeVal = stoppedShappedArray[x][y];
        if(typeof stoppedShapeVal === 'string'){
            collision = true;
            break;
        }

    }
    return collision;
}

function CheckForCompletedRows(){
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    for(let y = 0; y<gBArrayHeight; y++){
        let completed = true;
        for(let x=0 ; x< gBArrayWidth ; x++){
            let square = stoppedShappedArray[x][y];
            if(square === 0 || (typeof square === 'undefined')){
                completed =false;
                break;
            }
        }

        if(completed){
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            for(let i=0; i < gBArrayWidth; i++ ){
                stoppedShappedArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);

            }
        }
    }
    if(rowsToDelete > 0){
        score += 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140 , 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion){
    for(var i = startOfDeletion-1; i>=0; i--){
        for(var x=0; x< gBArrayWidth; x++){
            var y2 = i + rowsToDelete; // where there is a completed row
            var square = stoppedShappedArray[x][i];
            var nextSquare = stoppedShappedArray[x][y2];
            if(typeof square === 'string'){
                nextSquare = square;
                gameBoardArray[x][y2] = 1;
                stoppedShappedArray[x][y2] = square;
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0;
                stoppedShappedArray[x][i] = 0;
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);


            }
        }
    }
}

function RotateTetromino(){
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;
    for(let i =0; i<tetrominoCopy.length; i++){
        curTetrominoBU = [...curTetromino];
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);

    }
    DeleteTetromino();
    try{
       curTetromino = newRotation;
       DrawTetromino(); 
    }
    catch(e){
        if(e instanceof TypeError){
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }

}

function GetLastSquareX(){
    let lastX = 0;
    for(let i = 0; i<curTetromino.length; i++){
        let square = curTetromino[i];
        if(square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}



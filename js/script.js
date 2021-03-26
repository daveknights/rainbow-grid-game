class ColourGridGame {
    constructor(squareSize) {
        this.gameContainer = document.querySelector('.grid-game-container');
        this.canvasContainer = document.querySelector('.canvas-container');
        this.canvas = document.createElement('canvas');
        this.canvas.height = squareSize * 4;
        this.canvas.width = squareSize * 4;
        this.canvasCtx = this.canvas.getContext('2d');
        this.grid = [
            {coords: [0,0], hasSquare: false, colour: '', adjacentSquare: {left: null,right: 2,up: null,down: 5}},
            {coords: [squareSize,0], hasSquare: false, colour: '', adjacentSquare: {left: 1,right: 3,up: null,down: 6}},
            {coords: [squareSize*2,0], hasSquare: false, colour: '', adjacentSquare: {left: 2,right: 4,up: null,down: 7}},
            {coords: [squareSize*3,0], hasSquare: false, colour: '', adjacentSquare: {left: 3,right: null,up: null,down: 8}},
            {coords: [0,squareSize], hasSquare: false, colour: '', adjacentSquare: {left: null,right: 6,up: 1,down: 9},},
            {coords: [squareSize,squareSize], hasSquare: false, colour: '', adjacentSquare: {left: 5,right: 7,up: 2,down: 10}},
            {coords: [squareSize*2,squareSize], hasSquare: false, colour: '', adjacentSquare: {left: 6,right: 8,up: 3,down: 11}},
            {coords: [squareSize*3,squareSize], hasSquare: false, colour: '', adjacentSquare: {left: 7,right: null,up: 4,down: 12}},
            {coords: [0,squareSize*2], hasSquare: false, colour: '', adjacentSquare: {left: null,right: 10,up: 5,down: 13}},
            {coords: [squareSize,squareSize*2], hasSquare: false, colour: '', adjacentSquare: {left: 9,right: 11,up: 6,down: 14}},
            {coords: [squareSize*2, squareSize*2], hasSquare: false, colour: '', adjacentSquare: {left: 10,right: 12,up: 7,down: 15}},
            {coords: [squareSize*3, squareSize*2], hasSquare: false, colour: '', adjacentSquare: {left: 11,right: null,up: 8,down: 16}},
            {coords: [0,squareSize*3], hasSquare: false, colour: '', adjacentSquare: {left: null,right: 14,up: 9,down: null}},
            {coords: [squareSize,squareSize*3], hasSquare: false, colour: '', adjacentSquare: {left: 13,right: 15,up: 10,down: null}},
            {coords: [squareSize*2, squareSize*3], hasSquare: false, colour: '', adjacentSquare: {left: 14,right: 16,up: 11,down: null}},
            {coords: [squareSize*3, squareSize*3], hasSquare: false, colour: '', adjacentSquare: {left: 15,right: null,up: 12,down: null}},
        ];
        this.squareSize = squareSize;
        this.gold = '#ab9333';
        this.colours = ['#de2b35', '#f47f2a', '#fbe755', '#30a64f', '#3073de', '#7b39ca', '#bf4dbf', this.gold];
        this.bgColour = '#040333';
        this.playing = false;
    }

    clearGrid = () => {
        this.canvasCtx.fillStyle = this.bgColour;
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    restartGame = () => {
        document.querySelector('.try-again').removeEventListener('click', this.restartGame);
        document.querySelector('.end-screen').remove();

        this.clearGrid();

        this.grid.forEach(square => {
            square.hasSquare = false;
            square.colour = '';
        });


        this.startGame();
        window.addEventListener('keydown', this.moveDirection);
    }

    endScreen = (msg, btnValue) => `
        <div class="end-screen">
            <h2>${msg}</h2>
            <p>Do you want to play again?</P>
            <button class="try-again">${btnValue}</button>
        </div>
    `;

    endGame = result => {
        this.playing = false;
        window.removeEventListener('keydown', this.moveDirection);

        this.canvasContainer.insertAdjacentHTML('afterbegin', result === 'win' ? this.endScreen('You Win!', 'Play again') : this.endScreen('Game Over', 'Try again'));

        result === 'win' ? document.querySelector('.end-screen').classList.add('win') : '';
        document.querySelector('.try-again').addEventListener('click', this.restartGame);
    }

    createSquare = (coords, colour) => {
        const sqColour = colour === 'clear' ? this.bgColour : this.colours[colour];

        if (this.playing === true) {
            this.canvasCtx.fillStyle = sqColour;
            this.canvasCtx.fillRect(coords[0]+1, coords[1]+1, this.squareSize-1, this.squareSize-1);
            this.canvasCtx.strokeStyle = this.bgColour;
            this.canvasCtx.strokeRect(coords[0], coords[1], this.squareSize, this.squareSize);
        }
    }

    getRandomInt = num => Math.floor(Math.random() * Math.floor(num));

    newSquare = () => {
        let emptySquares = [];
        let randomNum = '';
        let squarePos = '';

        this.grid.forEach((item, i) => {
            if (item.hasSquare === false) {
                emptySquares.push(i);
            }
        });

        randomNum = this.getRandomInt(emptySquares.length);
        squarePos = emptySquares[randomNum];
        // Fake animation of a new square appearing by making a smaller one first
        this.canvasCtx.fillStyle = this.colours[0];
        this.canvasCtx.fillRect(this.grid[squarePos].coords[0]+40, this.grid[squarePos].coords[1]+40, this.squareSize-80, this.squareSize-80);
        this.grid[squarePos].hasSquare = true;
        this.grid[squarePos].colour = 0;
        // Create the full size square
        setTimeout(() => {
            this.createSquare(this.grid[squarePos].coords, 0);
        });
    }

    startGame = () => {
        this.playing = true;
        // Create 2 squares & add to grid
        this.newSquare();
        this.newSquare();
    }

    gridFull = square => square.hasSquare === true;

    reachedGold = square => parseInt(square.colour) === this.colours.length -1;

    moveSquares = directionChange => {
        this.clearGrid();

        const upDateGrid = [];

        this.grid.forEach((square, i) => {
            const squarePos = square.adjacentSquare[directionChange];

            // This checks if 2 adjacent squares are the same colour and merges them if true
            if (directionChange !== null && square.hasSquare === true && squarePos !== null && this.grid[squarePos-1].hasSquare === true &&
                square.colour === this.grid[squarePos-1].colour) {
                this.createSquare(this.grid[squarePos-1].coords, square.colour+1);
                upDateGrid.push({key: squarePos-1, hasSquare: true, colour: square.colour+1});
                upDateGrid.push({key:i, hasSquare: false, colour: ''});
                // This clears squares that should merge but have already rendered in the loop
                if (directionChange === 'left' && this.grid[i-2] !== undefined && this.grid[i-2].hasSquare === false && this.grid[i-2][directionChange] !== null) {
                    upDateGrid.push({key:i-2, hasSquare: false, colour: ''});
                    this.createSquare(this.grid[i-2].coords, 'clear');
                } else if (directionChange === 'up' && this.grid[i-8] !== undefined && this.grid[i-8].hasSquare === false && this.grid[i-8][directionChange] !== null) {
                    upDateGrid.push({key:i-8, hasSquare: false, colour: ''});
                    this.createSquare(this.grid[i-8].coords, 'clear');
                }

                this.grid[squarePos-1].hasSquare = false;
                this.grid[squarePos-1].colour = true;
            // This moves squares if the next adjacent square is empty
            } else if (directionChange !== null && square.hasSquare === true && squarePos !== null && this.grid[squarePos-1].hasSquare !== true) {
                this.createSquare(this.grid[squarePos-1].coords, square.colour);
                upDateGrid.push({key:i, hasSquare: false, colour: ''});
                upDateGrid.push({key: squarePos-1, hasSquare: true, colour: square.colour});
            // This re-renders a square in it's current space if it can't move
            } else if(directionChange !== null && square.hasSquare === true && squarePos !== null && this.grid[squarePos-1].hasSquare === true ||
                directionChange !== null && square.hasSquare === true && squarePos === null) {
                this.createSquare(this.grid[i].coords, square.colour);
                upDateGrid.push({key: i, hasSquare: true, colour: square.colour});
            }
        });

        upDateGrid.forEach((updatedSquare, i) => {
            this.grid[updatedSquare.key].hasSquare = updatedSquare.hasSquare;
            this.grid[updatedSquare.key].colour = updatedSquare.colour;
        });

        if (this.grid.some(this.reachedGold)) {
            this.canvasCtx.fillStyle = this.gold;
            this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            setTimeout(() => this.endGame('win'));
        } else if (this.grid.every(this.gridFull)) {
            this.endGame('lose');
        } else {
            this.newSquare();
        }
    }

    moveDirection = e => {
        const keyCode = e.keyCode;
        let directionChange = '';

        switch (keyCode) {
            case 37:
                directionChange = 'left';
                break;
            case 38:
                directionChange = 'up';
                break;
            case 39:
                directionChange = 'right';
                break;
            case 40:
                directionChange = 'down';
                break;
            default:
                directionChange = null;
        }

        directionChange ? this.moveSquares(directionChange) : null;
    }

    init = () => {
        this.gameContainer.style.width = `${(this.squareSize * 4) + 6}px`;
        this.canvasContainer.append(this.canvas);

        this.startGame();

        window.addEventListener('keydown', this.moveDirection);
    }
}

window.addEventListener('load', () => {
    const colourGrid = new ColourGridGame(120);
    colourGrid.init();
});

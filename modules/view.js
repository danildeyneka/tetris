'use strict'
import { SIZE_BLOCK, ROWS, COLUMNS } from '../script.js';

export class View {
    constructor (container) {
        this.container = container;

        this.preview();
    }

    colors = { 
        J: '#35adad',
        I: '#FF0500',
        O: 'Purple',
        L: 'Green',
        2: 'Red',
        T: 'Blue',
        S: 'Orange',
    };
    
    canvas = document.createElement('canvas');
    context = this.canvas.getContext('2d'); // позволяет рисовать в canvas. сам canvas - это полотно, использующее видеокарту а не браузер

    preview() {
        this.container.textContent = ''; // чистит контейнер
        const preview = document.createElement('div');
        preview.innerHTML = 'Press "ENTER" to start';
        preview.style.cssText = `
            border: 3px solid black;
            font-size: 18px;
            text-align: center;
            padding: 50px;
            grid-column: 1 / 3;
            letter-spacing: 1.5px;
        `;

        this.container.append(preview);
    }

    gameOver() {
        this.container.textContent = '';
        const gameOver = document.createElement('div');
        gameOver.innerHTML = '<h2>Game Over</h2><br><p>Press "ENTER" <br> to restart the game</p>';
        gameOver.style.cssText = `
            border: 2px solid black;
            margin-top: 10%;
            font-size: 18px;
            text-align: center;
            padding: 50px;
            grid-column: 1 / 3;
        `;

        this.container.append(gameOver);
    }

    init() {
        // document.querySelector('.preview').style.display = 'none';
        this.container.textContent = '';
        this.canvas.style.gridArea = 'game';
        this.canvas.classList.add('game-area');
        this.container.append(this.canvas);
        this.canvas.width = SIZE_BLOCK * COLUMNS;
        this.canvas.height = SIZE_BLOCK * ROWS;
    }
    
    createBlockScore() {
        const scoreBlock = document.createElement('div');
        scoreBlock.style.cssText = `
            border: 2px solid black;
            font-size: 18px;
            text-align: center;
            padding: 20px;
            grid-area: score;
            letter-spacing: 1.5px;
        `;

        const linesElem = document.createElement('p');
        const scoreElem = document.createElement('p');
        const levelElem = document.createElement('p');
        const recordElem = document.createElement('p');

        scoreBlock.append(linesElem, scoreElem, levelElem, recordElem);

        this.container.append(scoreBlock);

        return (lines, score, level, record) => {
            linesElem.textContent = `lines: ${lines}`;
            scoreElem.textContent = `score: ${score}`;
            levelElem.textContent = `level: ${level}`;
            recordElem.textContent = `record: ${record}`;
        }
    }

    createBlockNextObject() {
        const objectBlock = document.createElement('div');
        objectBlock.style.cssText = `
            width: ${SIZE_BLOCK * 5}px;
            height: ${SIZE_BLOCK * 5}px;
            border: 2px solid black;
            padding: 6px;
            grid-area: next;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        objectBlock.append(canvas);

        this.container.append(objectBlock);

        return (object) => {
            canvas.width = SIZE_BLOCK * object.length;
            canvas.height = SIZE_BLOCK * object.length;
            context.clearRect(0, 0, canvas.width, canvas.height); // очищает исходное место блока после его перемещения
        
            for (let y = 0; y < object.length; y++) {
                const line = object[y]; // перебираем линии по вертикали и присваиваем им значение у. длина массива = кол-во линий
        
                for (let x = 0; x < line.length; x++) {
                    const block = line[x];// перебираем ячейки по горизонтали и присваиваем им значение х. длина линии = кол-во ячеек
                    if (block !== 'o') { // если в ячейке содержится х - красим ее
                        context.fillStyle = this.colors[block]; // цвет ячейки
                        context.strokeStyle = 'white'; // цвет обводки
                        context.fillRect(x * SIZE_BLOCK, y * SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK); // заливаем ячейку основным цветом
                        context.strokeRect(x * SIZE_BLOCK, y * SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK); // заливка обводки
                    }
                }
            }
        }
    }

    showArea(area) { // показывает _отрисовывает_ игровое поле и все происходящее в нем
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // очищает исходное место блока после его перемещения
    
        for (let y = 0; y < area.length; y++) {
            const line = area[y]; // перебираем линии по вертикали и присваиваем им значение у. длина массива = кол-во линий
    
            for (let x = 0; x < line.length; x++) {
                const block = line[x];// перебираем ячейки по горизонтали и присваиваем им значение х. длина линии = кол-во ячеек
                if (block !== 'o') { // если в ячейке содержится х - красим ее
                    this.context.fillStyle = this.colors[block]; // цвет ячейки
                    this.context.strokeStyle = 'white'; // цвет обводки
                    this.context.fillRect(x * SIZE_BLOCK, y * SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK); // заливаем ячейку основным цветом
                    this.context.strokeRect(x * SIZE_BLOCK, y * SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK); // заливка обводки
                }
            }
        }
    };
}
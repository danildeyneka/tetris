'use strict'
import {figures} from './figures.js';
import { ROWS, COLUMNS } from '../script.js';

export class Game {
    score = 0;
    lines = 0;
    level = 1;
    record = localStorage.getItem('tetris-record') || 0;

    points = [0, 100, 300, 700, 1500];

    gameOver = false;

    area = [ // поле для игры. каждый блок имеет w30+h30
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
        ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o']
    ];

    activeObject = this.createObject();

    nextObject = this.createObject();

    createObject() {
        const keys = Object.keys(figures); // берет массив ключей объекта где лежат все виды фигур
        const letterObject = keys[Math.floor(Math.random() * keys.length)]; // рандомно выбирает фигуру
        const rotation = figures[letterObject];
        const rotationIndex = Math.floor(Math.random() * rotation.length); // рандомно выбирает вращение фигуры
        const block = rotation[rotationIndex];

        return {
            block,
            rotation,
            rotationIndex,
            x: 3,
            y: 0,
        }
    }

    changeObject() {
        this.activeObject = this.nextObject;
        this.nextObject = this.createObject();
    }

    moveLeft() {
        if (this.checkOutPosition(this.activeObject.x - 1, this.activeObject.y)) { // проверяет не у края ли блок
            this.activeObject.x -= 1; // функция, двигающая объект НАЛЕВО на 1 клетку по оси х
        }
    }

    moveRight() {
        if (this.checkOutPosition(this.activeObject.x + 1, this.activeObject.y)) {
            this.activeObject.x += 1;
        }
    }

    moveDown() {
        if (this.gameOver) return;
        if (this.checkOutPosition(this.activeObject.x, this.activeObject.y + 1)) {
            this.activeObject.y += 1;
        } else {
            this.stopMove();
        }
    }

    rotateObject() { // функция, вращающая объект направо
        this.activeObject.rotationIndex = 
        this.activeObject.rotationIndex < 3 ? 
        this.activeObject.rotationIndex + 1 : 0; // если блок != 3 индексу, он вращается
        this.activeObject.block = this.activeObject.rotation[this.activeObject.rotationIndex]; // присваивает изменившуюся фигуру после вращения блоку

        if (!this.checkOutPosition(this.activeObject.x, this.activeObject.y)) { // проверяет прижат ли объект к стенке, можно ли вращать
        this.activeObject.rotationIndex = 
        this.activeObject.rotationIndex > 0 ? 
        this.activeObject.rotationIndex - 1 : 3; 
        this.activeObject.block = this.activeObject.rotation[this.activeObject.rotationIndex];
        }
    }

    get viewArea() { // функция для отрисовки игровой области _get нужен для того чтобы не писать скобочки вызывая функцию_

        const area = JSON.parse(JSON.stringify(this.area)); // stringify превращает массив в объект, а parse превращает объект обратно в массив. spread не работает тк массив будет меняться
        const { x, y, block } = this.activeObject; // деструктуризация блока для работы с ним ниже

        for (let i = 0; i < block.length; i++) { // вертикаль блока
            const row = block[i];
            for (let j = 0; j < row.length; j++) { // горизонталь блока
                if (row[j] !== 'o') {
                    area[y + i][x + j] = block[i][j]; // добавляем значения х и у блока на поле, перезаписывая его
                }
            }
        }
        return area;
    }

    checkOutPosition(x, y) {
        const object = this.activeObject.block;
        for (let i = 0; i < object.length; i++) { // вертикаль блока
            for (let j = 0; j < object[i].length; j++) { // горизонталь блока
                if (object[i][j] === 'o') continue;

                if (!this.area[y + i] || 
                    !this.area[y + i][x + j] || 
                    this.area[y + i][x + j] !== 'o') {
                    return false;
                }
            }
        }
        return true
    }

    stopMove() {
        const { x, y, block } = this.activeObject;
        for (let i = 0; i < block.length; i++) { // вертикаль блока
            const row = block[i];
            for (let j = 0; j < row.length; j++) { // горизонталь блока
                if (row[j] !== 'o') {
                    this.area[y + i][x + j] = block[i][j]; // добавляем значения х и у блока на ЭТОМ поле, перезаписывая его
                }
            }
        }

        this.changeObject();
        const countRow = this.clearRow();
        this.calcScore(countRow);
        this.updatePanels();
        this.gameOver = !this.checkOutPosition(this.activeObject.x, this.activeObject.y);
    }

    clearRow() {
        const rows = [];
        for (let i = ROWS - 1; i >= 0; i--) {
            let countBlock = 0;

            for (let j = 0; j < COLUMNS; j++) {
                if (this.area[i][j] !== 'o') {
                    countBlock += 1;
                }
            }
            if (!countBlock) break;

            if (countBlock === COLUMNS) {
                rows.unshift(i)
            }
        }
        rows.forEach(i => {
            this.area.splice(i, 1);
            this.area.unshift(Array(COLUMNS).fill('o'))
        })
        return rows.length;
    }

    calcScore(lines) {
        this.score += this.points[lines];
        this.lines += lines;
        this.level = Math.floor(this.lines / 10) + 1;

        if (this.score > this.record) {
            this.record = this.score;
            localStorage.setItem('tetris-record', this.score);
        }
    }

    createUpdatePanels(showScore, showNextObject) {
        showScore(this.lines, this.score, this.level, this.record);
        showNextObject(this.nextObject.block);

        this.updatePanels = () => {
            showScore(this.lines, this.score, this.level, this.record);
            showNextObject(this.nextObject.block);
        }
    }

    restart() {
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.record = localStorage.getItem('tetris-record') || 0;

        this.gameOver = false;

        this.area = [
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
            ['o','o','o','o','o','o','o','o','o','o'],
        ];

        this.activeObject = this.createObject();

        this.nextObject = this.createObject();
    }
};
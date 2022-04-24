export class Controller{
    constructor (game, view) {
        this.game = game;
        this.view = view;
    }

    enterPressed = 0;

    init(codeKey) { // запуск игры на кнопку _энтер_
        window.addEventListener('keydown', event => {
            if (event.code === codeKey && this.enterPressed === 0) {
                this.enterPressed = 1;
                this.view.init();
                this.start();
            } else if (event.code === codeKey && this.enterPressed === 2) {
                this.enterPressed = 1;
                this.view.init();
                this.game.restart();

                this.view.showArea(this.game.viewArea);
                const showScore = this.view.createBlockScore();
                const showNextObject = this.view.createBlockNextObject();
                this.game.createUpdatePanels(showScore, showNextObject);
            }
        })
    }

    start() {
        this.view.showArea(this.game.viewArea); // вызываем фигурку на поле

        this.game.createUpdatePanels(this.view.createBlockScore(), this.view.createBlockNextObject());

        const tick = () => {
            const time = (1100 - 100 * this.game.level); // скорость увеличивается с каждым лвлом на 100 мс
            if (this.game.gameOver) {
                this.view.gameOver();
                this.enterPressed = 2;
            }
            setTimeout(() => {
                this.game.moveDown();
                this.view.showArea(this.game.viewArea);
                tick();
            }, time > 100 ? time : 100);
        };

        tick();

        window.addEventListener('keydown', event => { // добавляет слушатели на кнопки клавиатуры через свитч
            const key = event.code; // название кнопки в объекте window
        
            switch (key) {
                case 'ArrowLeft':
                    this.game.moveLeft(); // двигает блок влево
                    this.view.showArea(this.game.viewArea); // отрисовывает заново измененое поле
                break;
                case 'ArrowRight':
                    this.game.moveRight();
                    this.view.showArea(this.game.viewArea);
                break;
                case 'ArrowDown':
                    this.game.moveDown();
                    this.view.showArea(this.game.viewArea);
                break;
                case 'ArrowUp':
                    this.game.rotateObject();
                    this.view.showArea(this.game.viewArea);
                break;
            }
        });
    }
}
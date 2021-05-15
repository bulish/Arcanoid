/**
 * wall.js
 * bouncing balls - canvas demo by mozilla
 * extension - game wall (arkanoid)
 * https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_building_practice
 * https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Adding_bouncing_balls_features
 * 
 * changelog:
 * 2021-05-10 - libuse babickova - initial version (ball.js extension)
**/

// setup canvas
    var canvas = document.querySelector('canvas');
		var ctx = canvas.getContext('2d');

		var width = (canvas.width = window.innerWidth);
		var height = (canvas.height = window.innerHeight);

		// function to generate random number
		function random(min, max) {
			var num = Math.floor(Math.random() * (max - min)) + min;
			return num;
		}

		/**
		 * pohybujici se desticka hrace
		 */

		class Pad {
			constructor(x, y, sizeX, sizeY, color) {
				this.x = x;
				this.y = y;
				this.sizeX = sizeX;
				this.sizeY = sizeY;
				this.color = color;
			}

			setX(newX) {
				this.x = newX;
			}

			/**
			 * vykresleni desticky
			 */

			draw() {
				ctx.beginPath();
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
			}

			/**
			 * smazani - vykresleni v cerne barve
			 */

			erase() {
				ctx.beginPath();
				ctx.fillStyle = 'black';
				ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
			}
		}

		/**
		 * jedna cihla
		 */

		class Brick {
			constructor(x, y, sizeX, sizeY, color) {
				this.x = x;
				this.y = y;
				this.sizeX = sizeX;
				this.sizeY = sizeY;
				this.color = color;
			}

			/**
			 * vykresleni cihly
			 */

			draw() {
				ctx.beginPath();
				ctx.fillStyle = this.color;
				ctx.rect(this.x, this.y, this.sizeX, this.sizeY);
				ctx.fill();
			}
		}

		/**
		 * Micek v canvasu vc. operace pro kolizi s jinym mickem.
		 */
		class Ball {
			/**
			 * define Ball constructor
			 * @param x Pozice x
			 * @param y Pozice y
			 * @param velX rychlost na x
			 * @param velY rychlost na y
			 */
			constructor(x, y, velX, velY, color, size) {
				this.x = x;
				this.y = y;
				this.velX = velX;
				this.velY = velY;
				this.color = color;
				this.size = size;
			}

			/**
			 * define ball draw method
			 */
			draw() {
				ctx.beginPath();
				ctx.fillStyle = this.color;
				ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
				ctx.fill();
			}

			/**
			 * Nastavi velX (rychlost na souradnici X), resp. velY
			 * (na sour. Y) na opacnou (zapornou) hodnotu, pokud doslo
			 * k odrazu od kraje.
			 * Potom nove vypocitane velX, velY pricte k sour. x, y micku.
			 */
			update() {
				// odraz na x
				if (this.x + this.size >= width) {
					this.velX = -this.velX;
				}
				if (this.x - this.size <= 0) {
					this.velX = -this.velX;
				}

				// odraz na y
				if (this.y + this.size >= height) {
					this.velY = -this.velY;
				}
				if (this.y - this.size <= 0) {
					this.velY = -this.velY;
				}

				// nove souradnice pro pristi vykresleni micku
				this.x += this.velX;
				this.y += this.velY;
			}

			/**
			 * define ball collision detection
			 * TODO:
			 * 1) pri kolizi micku s cihlou smazat cihlu
			 *  + zapocitat skore (nova globalni promenna)
			 * 2) pri kolizi micku s destickou odraz
			 */

			collisionDetect() {
				if (this.y - this.size > height - 50) {
					this.color = '#3C3941';
					this.velX = 0;
					this.velY = 0;
					this.x = 0;
					this.y = 0;
				}
				if (
					this.x - pad.x >= 0 &&
					this.x - pad.x <= 100 &&
					this.y >= height - 50
				) {
					this.velY -= 10;
				}
				for (let i = 0; i < bricks.length; i++) {
					if (this.color != '#3C3941') {
						if (
							this.x - bricks[i].x <= 120 &&
							this.x - bricks[i].x >= 0 &&
							this.y - bricks[i].y <= 30 &&
							bricks[i].color != '#3C3941'
						) {
							this.velY += 10;
							bricks[i].color = '#3C3941';
							var scoreDiv = document.querySelector('.scoreNumber');
							var scoreNumber = scoreDiv.innerHTML;
							scoreNumber++;
							scoreDiv.innerHTML = scoreNumber;
                            if(scoreNumber == bricks.length){
                                document.querySelector("h1").innerHTML = 'Winner';
                            }
						}
					}
				}
			}
		} // end of class Ball

		// define loop that keeps drawing the scene constantly
		function loop() {
			// vymaz pole
			ctx.fillStyle = '#3C3941';
			ctx.fillRect(0, 0, width, height);

			//vykresleni micku
			for (var i = 0; i < balls.length; i++) {
				balls[i].draw();
				balls[i].update(); //aktualizovane souradnice
				balls[i].collisionDetect();
				if (balls[i].velX == 0) {
					balls[i].velX = 5;
				}
				if (balls[i].velY == 0) {
					balls[i].velY = 5;
				}
				if (balls[i].velX > 7) {
					balls[i].velX = 5;
				}
				if (balls[i].velY > 7) {
					balls[i].velY = 5;
				}
			}

			// vykresleni zdi (cihel)
			for (var i = 0; i < bricks.length; i++) {
				bricks[i].draw();
			}

			// vykresleni desticky
			pad.draw();

			requestAnimationFrame(loop); // obdoba setTimeout(), ale pro animace lepsi
		}

		// define array to store balls
		var balls = [];
		// define array to store bricks
		var bricks = [];
		// instance desticky
		var pad = new Pad(width / 2, height - 50, 100, 30, '#C75C3C');

		// init 3 balls
		while (balls.length < 3) {
			var size = 10; // random(10,20);
			var ball = new Ball(
				// ball position always drawn at least one ball width
				// away from the adge of the canvas, to avoid drawing errors
				random(0 + size, width - size), // x
				random(0 + size + 250, height - size - 250), // y
				random(-7, 7),
				random(-7, 7),
				//'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
				'#CBBDB9',
				size,
			);
			balls.push(ball);
		}

		// init wall (bricks 100x30 in 4 rows)
		// -> ball's y coord could be 100+4x30=220+

		var colors = [
			'#54092A',
			'#86052E',
			'#97012F',
			'#BE0034',
			'#E62538',
			'#F53D3B',
			'#E62538',
			'#FE5D39',
			'#FF7B30',
			'#FF991D',
			'#FFD401',
			'#FF9422',
			'#FF991B',
			'#FF8F20',
			'#C70333',
			'#FFC801',
			'#FEBA04',
			'#71082D',
			'#AE0033',
			'#FF6B37',
		];

		for (let j = 0; j < 4; j++) {
			for (let i = 0; i < width / 120; i++) {
				var brick = new Brick(
					i * 120,
					j * 30,
					120,
					30,
					colors[Math.floor(Math.random() * colors.length)],
				);
				brick.draw();
				bricks.push(brick);
			}
		}

		/**
		 * obsluha pohybu desticky mysi
		 * @param event predana udalost mysi
		 */

		function movePad(event) {
			var x = event.clientX;
			pad.erase();
			pad.setX(x);
			pad.draw();
		}

		// start looping
		loop();

		function newScore() {
			var livesDiv = document.querySelector('.livesNumber');
			var lives = 3;
			for (let i = 0; i < balls.length; i++) {
				if (balls[i].color != '#CBBDB9') {
					if (livesDiv.innerHTML != 0) {
						lives--;
						livesDiv.innerHTML = lives;
					}
				}
			}
            if (livesDiv.innerHTML == 0) {
				document.querySelector("h1").innerHTML = 'Game over';
			}
		}

		setInterval(newScore, 1000);


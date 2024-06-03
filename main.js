let boids = [];

let interactionRange = 20;

let m1 = 1;

function setup() {
	angleMode(DEGREES);
	createCanvas(500, 500);

	for (let i = 0; i < 800; i++) {
		boids.push(new Boid(random(width), random(height)));
	}
}

function draw() {
	background(10);

	fill(255);
	text(round(frameRate()), 5, 15);

	

	boids.forEach((boid) => {
		// let v1 = boid.coherence().getMult(m1)
		// let v2 = boid.seperation()
		// let v3 = boid.alignment()

		// boid.velocity.add(v1)
		// boid.velocity.add(v2)
		// boid.velocity.add(v3)

		// boid.velocity.add(new Vector(0, 1))

		// boid.velocity.add(new Vector(Math.cos(frameCount/100), Math.sin(frameCount/100)).getMult(0.1))

		boid.velocity.add(boid.getForces());

		if (mouseIsPressed) boid.velocity.add(boid.moveTowardsTarget(new Vector(mouseX, mouseY)))


		// if (mouseIsPressed) { 
		// 	// circle(mouseX, mouseY, 50)
		// 	// boid.velocity.add(boid.avoidTarget(new Vector(mouseX, mouseY).getMult(1)))
		// }
		let rX = 250
		let rY = 250
		let rW = 250
		let rH = 50
		fill(0)
		rect(rX, rY, rW, rH)
		boid.velocity.add(boid.avoidRect(new Vector(rX, rY), rW, rH))
		rX = 0
		rY = 250
		rW = 200
		rH = 50
		fill(0)
		rect(rX, rY, rW, rH)
		boid.velocity.add(boid.avoidRect(new Vector(rX, rY), rW, rH))
		// rX = 250
		// rY = 250
		// let rR = 200
		// fill(0)
		// circle(rX, rY, rR*2)
		// boid.velocity.add(boid.avoidCircle(new Vector(rX, rY), rR*2))

		boid.limitVelocity();

		boid.velocity.add(boid.boundPositions());

		boid.pos.add(boid.velocity.getMult(deltaTime / 100));
	});

	boids.forEach((boid) => {
		boid.draw();
	});
}



class Boid {
	constructor(x, y) {
		this.pos = new Vector(x, y);
		this.velocity = new Vector(0, 0);
		this.r = 1;
		this.posInGrid = [0, 0];
	}

	draw() {
		// if (this.pos.x > width - this.r) {
		// 	this.pos.x = width - this.r;
		// }
		// if (this.pos.x < this.r) {
		// 	this.pos.x = this.r;
		// }
		// if (this.pos.y > height - this.r) {
		// 	this.pos.y = height - this.r;
		// }
		// if (this.pos.y < this.r) {
		// 	this.pos.y = this.r;
		// }

		if (false == true) {
			// let newVel = new Vector(5 - random(10), 5- random(10))
			let newVel = new Vector(
				this.velocity.y * random(-1, 1),
				this.velocity.x * random(-1, 1)
			);
			if (this.pos.x >= width + this.r) {
				this.pos.x = this.r;
				this.velocity = newVel;
			}
			if (this.pos.x <= -this.r) {
				this.pos.x = width - this.r;
				this.velocity = newVel;
			}
			if (this.pos.y >= height + this.r) {
				this.pos.y = this.r;
				this.velocity = newVel;
			}
			if (this.pos.y <= -this.r) {
				this.pos.y = height - this.r;
				this.velocity = newVel;
			}
		}

		// fill(255)
		// fill(100 + this.velocity.x * 10, 100, 100 + this.velocity.y * 10);
		// fill(255*sin(this.velocity.y*10), 255*cos(this.velocity.x*10), 0)
		fill(255*cos(this.pos.x+frameCount), 255*sin(this.pos.y+frameCount), 120)
		noStroke();

		push();
		translate(this.pos.x, this.pos.y);
		rotate(vectorToAngle(this.velocity) - 90);
		triangle(-this.r, 0, 0, this.r * 2, this.r, 0);
		// triangle(this.pos.x-this.r, this.pos.y, this.pos.x, this.pos.y+this.r*2, this.pos.x+this.r, this.pos.y)
		pop();

		// circle(this.pos.x, this.pos.y, this.r * 2);
	}

	coherence() {
		let percivedCenter = new Vector(0, 0);

		let boidCount = boids.length;
		let n = 0;
		for (let i = 0; i < boidCount; i++) {
			if (this == boids[i]) {
				continue;
			}
			if (this.pos.getDist(boids[i].pos) > interactionRange) {
				continue;
			}
			percivedCenter.add(boids[i].pos);
			n += 1;
		}
		if (n == 0) {
			return percivedCenter;
		}
		percivedCenter = percivedCenter.getDiv(n);

		return percivedCenter.getSub(this.pos).getDiv(100);
	}

	seperation() {
		let c = new Vector(0, 0);

		let boidCount = boids.length;
		for (let i = 0; i < boidCount; i++) {
			if (this == boids[i]) {
				continue;
			}
			if (this.pos.getDist(boids[i].pos) > interactionRange) {
				continue;
			}

			let boidDissplacement = boids[i].pos.getSub(this.pos);

			let distBetweenBoids = boids[i].pos.getDist(this.pos);
			if (distBetweenBoids < 10) {
				c = c.getSub(boidDissplacement).getMult(10 / distBetweenBoids - 0.5);
			}
		}

		return c;
	}

	alignment() {
		let percivedVelocity = new Vector(0, 0);

		let boidCount = boids.length;
		let n = 0;
		for (let i = 0; i < boidCount; i++) {
			if (this == boids[i]) {
				continue;
			}
			if (this.pos.getDist(boids[i].pos) > interactionRange) {
				continue;
			}

			percivedVelocity.add(boids[i].velocity);
			n += 1;
		}

		if (n == 0) {
			return percivedVelocity;
		}
		percivedVelocity = percivedVelocity.getDiv(n);

		return percivedVelocity.getSub(this.velocity).getDiv(8);
	}

	moveTowardsTarget(target) {
		let dirToTarget = this.pos.getDir(target)
		return dirToTarget.getMult(1)
	}

	avoidTarget(target) {
		let vec = new Vector(0, 0)
		if (this.pos.getDist(target) < 50) {
			vec = target.getDir(this.pos)
		}
		return vec
	}
	avoidRect(target, w, h) {
		let vec = new Vector(0, 0)

		if (collideRectCircle(target.x, target.y, w, h, this.pos.x, this.pos.y, this.r*2+10)) {
			vec = new Vector(target.x + w/2, target.y + h/2).getDir(this.pos).getMult(10)
		}

		return vec
	}
	avoidCircle(target, r) {
		let vec = new Vector(0, 0)

		if (!collideCircleCircle(target.x, target.y, r-20, this.pos.x, this.pos.y, this.r*2+10)) {
			vec = this.pos.getDir(target).getMult(10)
		}

		return vec
	}

	getForces() {
		let percivedCenter = new Vector(0, 0);
		let c = new Vector(0, 0);
		let percivedVelocity = new Vector(0, 0);

		let boidCount = boids.length;
		let n = 0;
		for (let i = 0; i < boidCount; i++) {
			if (this == boids[i]) {
				continue;
			}
			let distBetweenBoids = boids[i].pos.getDist(this.pos);
			if (distBetweenBoids > interactionRange) {
				continue;
			}
			percivedCenter.add(boids[i].pos);
			percivedVelocity.add(boids[i].velocity);
			n += 1;

			let boidDissplacement = boids[i].pos.getSub(this.pos);

			if (distBetweenBoids < 3) {
				c = c.getSub(boidDissplacement).getMult(3 / distBetweenBoids - 0.5).getMult(m1);
			}
		}

        if (n != 0) {
            percivedCenter = percivedCenter.getDiv(n);
            percivedVelocity = percivedVelocity.getDiv(n);
        }

		return (percivedCenter
			.getSub(this.pos)
			.getDiv(100))
			.getAdd(c)
			.getAdd(percivedVelocity.getSub(this.velocity).getDiv(8));
	}

	limitVelocity() {
		let velLimit = 20;
		let velDist = this.velocity.getDist(new Vector(0, 0));
		if (velDist > velLimit) {
			this.velocity = this.velocity.getDiv(velDist).getMult(velLimit);
		}
	}

	boundPositions() {
		let v = new Vector(0, 0);

		let bounceV = 10;
		let buffer = 3

		if (this.pos.x > width - this.r*buffer) {
			v.x = -bounceV;
		}
		if (this.pos.x < this.r*buffer) {
			v.x = bounceV;
		}
		if (this.pos.y > height - this.r*buffer) {
			v.y = -bounceV;
		}
		if (this.pos.y < this.r*buffer) {
			v.y = bounceV;
		}
		return v;
	}
}

class Vector {
	constructor(x, y) {
		(this.x = x), (this.y = y);
	}

	add(b) {
		this.x += b.x;
		this.y += b.y;
	}
	getAdd(b) {
		return new Vector(this.x + b.x, this.y + b.y);
	}

	sub(b) {
		this.x -= b.x;
		this.y -= b.y;
	}
	getSub(b) {
		return new Vector(this.x - b.x, this.y - b.y);
	}

	getMult(b) {
		return new Vector(this.x * b, this.y * b);
	}

	getDiv(b) {
		return new Vector(this.x / b, this.y / b);
	}

	getDist(b) {
		// let dirVec = b.getSub(this)
		// dirVec.x = Math.sqrt(dirVec.x)
		// dirVec.y = Math.sqrt(dirVec.y)
		// let sum = dirVec.x + dirVec.y
		// return Math.sqrt(sum)

		let x = b.x - this.x;
		x = x ** 2;
		let y = b.y - this.y;
		y = y ** 2;
		return Math.sqrt(x + y);
	}

	getDir(b) {
		let dirVec = b.getSub(this);

		// get length of vector
		let lengthDirVec = Math.sqrt(dirVec.x ** 2 + dirVec.y ** 2);

		let normalizedDirVec = dirVec.getDiv(lengthDirVec);

		return normalizedDirVec;
	}
}

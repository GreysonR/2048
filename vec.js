class vec {
	constructor(x, y) {
		if (typeof x === "object") {
			this.x = x.x;
			this.y = x.y;
		}
		else if (typeof x === "string") {
			x = x.split(",");
			this.x = Number(x[0]);
			this.y = Number(x[1]);
		}
		else {
			this.x = x;
			this.y = y;
		}

		return this;
	}
	add(vec2) {
		if (typeof vec2 === "number") {
			return new vec(this.x + vec2, this.y + vec2);
		}
		else {
			return new vec(this.x + vec2.x, this.y + vec2.y);
		}
	}
	sub(vec2) {
		if (typeof vec2 === "number") {
			return new vec(this.x - vec2, this.y - vec2);
		}
		else {
			return new vec(this.x - vec2.x, this.y - vec2.y);
		}
	}
	mult(vec2) {
		if (typeof vec2 === "number") {
			return new vec(this.x * vec2, this.y * vec2);
		}
		else {
			return new vec(this.x * vec2.x, this.y * vec2.y);
		}
	}
	div(vec2) {
		if (typeof vec2 === "number") {
			return new vec(this.x / vec2, this.y / vec2);
		}
		else {
			return new vec(this.x / vec2.x, this.y / vec2.y);
		}
	}
	add2(vec2) {
		if (typeof vec2 === "number") {
			this.x += vec2;
			this.y += vec2;
			return this;
		}
		else {
			this.x += vec2.x;
			this.y += vec2.y;
			return this;
		}
	}
	sub2(vec2) {
		if (typeof vec2 === "number") {
			this.x -= vec2;
			this.y -= vec2;
			return this;
		}
		else {
			this.x -= vec2.x;
			this.y -= vec2.y;
			return this;
		}
	}
	mult2(vec2) {
		if (typeof vec2 === "number") {
			this.x *= vec2;
			this.y *= vec2;
			return this;
		}
		else {
			this.x *= vec2.x;
			this.y *= vec2.y;
			return this;
		}
	}
	div2(vec2) {
		if (typeof vec2 === "number") {
			this.x /= vec2;
			this.y /= vec2;
			return this;
		}
		else {
			this.x /= vec2.x;
			this.y /= vec2.y;
			return this;
		}
	}
	dot(vec2) {
		return this.x * vec2.x + this.y * vec2.y;
	}
	cross(vec2) {
		return this.x * vec2.y - this.y * vec2.x;
	}
	avg(vec2, weight = 0.5) {
		let weight2 = 1 - weight;
		return new vec(this.x * weight + vec2.x * weight2, this.y * weight + vec2.y * weight2);
	}
	get length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}
	normalize() {
		let len = this.length;
		if (len === 0) return this;
		this.x /= len;
		this.y /= len;
		return this;
	}
	normalized() {
		let len = this.length;
		if (len === 0) return new vec(this);
		else return new vec(this.x / len, this.y / len);
	}
	normal() {
		return new vec(this.y, -this.x);
	}
	inverse() {
		return new vec(-this.x, -this.y);
	}
	angle() {
		return Math.atan2(this.y, this.x);
	}
	round(x1 = 1) {
		return new vec(Math.round(this.x / x1) * x1, Math.round(this.y / x1) * x1);
	}
	abs() {
		return new vec(Math.abs(this.x), Math.abs(this.y));
	}
	equals(vec2) {
		if (vec2 && this.x === vec2.x && this.y === vec2.y) {
			return true;
		}
		return false;
	}
	set(vec2) {
		this.x = vec2.x;
		this.y = vec2.y;
	}

	toString(round = false) {
		if (round) {
			return `(${ Math.round(this.x) }, ${ Math.round(this.y) })`;
		}
		else {
			return `(${ this.x }, ${ this.y })`;
		}
	}
}
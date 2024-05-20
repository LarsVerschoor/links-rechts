const socket = io();

const images = {
	left: {on: '/images/arrow-left-on.svg', off: '/images/arrow-left-off.svg'},
	right: {on: '/images/arrow-right-on.svg', off: '/images/arrow-right-off.svg'}
};

class Blinker {
	constructor(imageLeft, imageRight, direction, maxBlinkCount, iconSources) {
		this.direction = direction;
		this.maxBlinkCount = maxBlinkCount;
		this.imageLeft = imageLeft;
		this.imageRight = imageRight;
		this.blinkCount = 0;
		this.blinking = false;
		this.iconSources = iconSources;
	}

	update(direction) {
		this.direction = direction;
		this.blinkCount = 0;
	}

	blink() {
		this.blinking = !this.blinking;
		if (this.blinkCount >= this.maxBlinkCount || !this.blinking || !this.direction) {
			this.imageLeft.src = this.iconSources.left.off;
			this.imageRight.src = this.iconSources.right.off;
			return;
		}
		if (this.direction === 'left') {
			this.imageLeft.src = this.blink ? this.iconSources.left.on : this.iconSources.left.off;
			this.blinkCount++;
			return;
		}
		this.imageRight.src = this.blink ? this.iconSources.right.on : this.iconSources.right.off;
		this.blinkCount++;
	}

	initialize() {
		let date = new Date();
		let milliSeconds = date.getSeconds() * 1000 + date.getMilliseconds();
		let remainingMilliSeconds = 1000 - (milliSeconds % 1000);

		setTimeout(() => {
			setInterval(() => {
				this.blink();
			}, 500);
		}, remainingMilliSeconds);
	}
}

const preLoadImages = () => {
	const sourcesArray = [images.left.on, images.left.off, images.right.on, images.right.off];
	sourcesArray.forEach((source) => {
		const img = new Image();
		img.src = source;
	});
};

const init = () => {
	const imageLeft = document.getElementById('image-left');
	const imageRight = document.getElementById('image-right');

	const blinker = new Blinker(imageLeft, imageRight, null, 5, images);

	socket.on('direction-update', (direction) => {
		blinker.update(direction);
	});

	window.addEventListener('click', () => {
		socket.emit('direction-request');
	});

	blinker.initialize();
};

preLoadImages();
window.addEventListener('load', init);

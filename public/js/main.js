const socket = io({transports: ['websocket']});

const images = {
	left: {on: '/images/arrow-left-on.svg', off: '/images/arrow-left-off.svg'},
	right: {on: '/images/arrow-right-on.svg', off: '/images/arrow-right-off.svg'}
};

const blinkerAudio = {
	blinkerOn: new Audio('/audio/blinker-on.mp3'),
	blinkerOff: new Audio('/audio/blinker-off.mp3')
};

class Blinker {
	constructor(imageLeft, imageRight, direction, maxBlinkCount, iconSources, audio) {
		this.direction = direction;
		this.maxBlinkCount = maxBlinkCount;
		this.imageLeft = imageLeft;
		this.imageRight = imageRight;
		this.blinkCount = 0;
		this.iconSources = iconSources;
		this.audio = audio;
	}

	update(direction) {
		this.direction = direction;
		this.blinkCount = 0;
	}

	blinkOn() {
		this.audio.blinkerOn.play();
		if (this.direction === 'left') {
			this.imageLeft.src = this.iconSources.left.on;
			return;
		}
		this.imageRight.src = this.iconSources.right.on;
	}

	blinkOff() {
		this.audio.blinkerOff.play();
		this.imageLeft.src = this.iconSources.left.off;
		this.imageRight.src = this.iconSources.right.off;
	}

	initialize() {
		let date = new Date();
		let milliSeconds = date.getSeconds() * 1000 + date.getMilliseconds();
		let remainingMilliSeconds = 800 - (milliSeconds % 800);

		setTimeout(() => {
			setInterval(() => {
				if (!this.direction || this.blinkCount >= this.maxBlinkCount) return;
				this.blinkCount++;
				this.blinkOn();
				setTimeout(() => {
					this.blinkOff();
				}, 400);
			}, 800);
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

	const blinker = new Blinker(imageLeft, imageRight, null, 6, images, blinkerAudio);

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

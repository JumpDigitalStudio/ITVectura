"use strict"

const page = document.querySelector('.page');
const menuBtn = document.querySelector('.header__burger');
const menuMobile = document.querySelector('.header__mobile');

let isMobile;
let animStart;
const windowHeight = document.documentElement.clientHeight;
const windowWidth = document.documentElement.clientWidth;
const deviceType = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			deviceType.Android() ||
			deviceType.BlackBerry() ||
			deviceType.iOS() ||
			deviceType.Opera() ||
			deviceType.Windows()
		);
	}
};


// Detect device
if (deviceType.any() || windowWidth <= 767) {
	isMobile = true;
	animStart = 8;
}
else {
	isMobile = false;
	animStart = 4;
};


// Modal windows
const myModal = new HystModal({
	linkAttributeName: "data-hystmodal",
});


// Navigation
if (document.querySelectorAll('.scr-list')) {
	const getSectionId = (link) => link.getAttribute('href').replace('#', '');

	const navLists = document.querySelectorAll('.scr-list');

	navLists.forEach(
		(lists) => lists.addEventListener('click', (event) => {

			if (event.target.classList.contains('scr-link')) {
				event.preventDefault();

				if (isMobile === true) {
					page.classList.remove('lock');
					menuBtn.classList.remove('active');
					menuMobile.classList.remove('active');

					window.scrollTo({
						top: document.getElementById(getSectionId(event.target)).offsetTop,
						behavior: 'smooth',
					});
				} else {
					window.scrollTo({
						top: document.getElementById(getSectionId(event.target)).offsetTop,
						behavior: 'smooth',
					});
				}
			}
		}),
	);
};


// Mobile menu
if (document.querySelector('.header__burger')) {
	menuBtn.addEventListener('click', function () {
		if (isMobile === true) {
			page.classList.toggle('lock');
			menuBtn.classList.toggle('active');
			menuMobile.classList.toggle('active');
		}
	})
};


// Lang switcher
if (document.querySelector('.select-lang')) {
	const selectHeader = document.querySelector('.select-lang__header');
	const selectBody = document.querySelector('.select-lang__body');

	selectHeader.addEventListener('click', function () {
		selectBody.classList.toggle('active');
	});
};


// Requisites
if (document.querySelector('.props')) {
	const propBtn = document.querySelector('.props__button');
	const propBody = document.querySelector('.props__body');

	propBtn.addEventListener('click', function () {
		propBtn.classList.toggle('active');
		propBody.classList.toggle('active');
	});
};


// Click effect for buttons
if (document.querySelectorAll('button')) {

	const btns = document.querySelectorAll('button');

	btns.forEach(btn => {
		btn.addEventListener('click', function () {
			btn.classList.add('click');
			setTimeout(() => btn.classList.remove('click'), 100);
		})
	})
};
// Click effect for links
if (document.querySelectorAll('.text_a')) {

	const links = document.querySelectorAll('.text_a');

	links.forEach(link => {
		link.addEventListener('click', function () {
			link.classList.add('click');
			setTimeout(() => link.classList.remove('click'), 100);
		})
	})
};


// Form send
document.addEventListener('DOMContentLoaded', () => {
	// Animations
	animOnScroll();

	// Form send
	document.querySelectorAll('.form').forEach(item => {
		item.addEventListener('submit', function (event) {
			event.preventDefault();
			const form = this;

			let error = formValidate(form);

			if (error === 0) {
				let th = $(this);

				const actionURL = form.getAttribute('action');
				const btnSend = form.querySelector('.form__btn');

				$.ajax({
					url: actionURL,
					type: 'POST',
					data: th.serialize(),
					success: function (data) {
						btnSend.innerHTML = data;
						th.trigger('reset');
					},
					error: function () {
						btnSend.innerHTML = 'Client error';
						th.trigger('reset');
					}
				})
			}

			function formValidate(form) {
				let error = 0;
				let formReq = form.querySelectorAll('._req');

				for (let i = 0; i < formReq.length; i++) {
					const input = formReq[i];
					formRemoveError(input);

					if (input.classList.contains('_email')) {
						if (emailTest(input)) {
							formAddError(input);
							error++;
						}
					} else {
						if (input.value === '') {
							formAddError(input);
							error++;
						}
					}
				}
				return error;
			}

			function formAddError(input) {
				input.classList.add('error');
			}

			function formRemoveError(input) {
				input.classList.remove('error');
			}

			function emailTest(input) {
				return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
			}
		});
	});
});


// Services carousel
if (document.querySelector('.carousel')) {
	const state = {};
	const carouselList = document.querySelector('.carousel__list');
	const carouselItems = document.querySelectorAll('.carousel__item');
	const elems = Array.from(carouselItems);

	carouselList.addEventListener('click', function (event) {
		var newActive = event.target;
		var isItem = newActive.closest('.carousel__item');

		if (!isItem || newActive.classList.contains('carousel__item_active')) {
			return;
		};

		update(newActive);
	});

	const update = function (newActive) {
		const newActivePos = newActive.dataset.pos;

		const current = elems.find((elem) => elem.dataset.pos == 0);
		const first = elems.find((elem) => elem.dataset.pos == -1);
		const last = elems.find((elem) => elem.dataset.pos == 1);

		current.classList.remove('carousel__item_active');

		[current, first, last].forEach(item => {
			var itemPos = item.dataset.pos;

			item.dataset.pos = getPos(itemPos, newActivePos)
		});
	};

	const getPos = function (current, active) {
		const diff = current - active;

		if (Math.abs(current - active) > 1) {
			return -current
		}

		return diff;
	};
};


// Animation
let animItems = document.querySelectorAll('._anim');
if (animItems.length > 0) {
	window.addEventListener('scroll', animOnScroll);
	animOnScroll();
};
function animOnScroll() {
	for (let i = 0; i < animItems.length; i++) {
		const animItem = animItems[i];
		const animItemHeight = animItem.offsetHeight;
		const animItemOffset = offset(animItem).top;

		let animItemPoint = window.innerHeight - animItemHeight / animStart;

		if (animItemHeight > window.innerHeight) {
			animItemPoint = window.innerHeight - window.innerHeight / animStart;
		}

		if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
			if (animItem.classList.contains('_anim_fade')) {
				animItem.classList.add('_anim-fadeIn');
			} else if (animItem.classList.contains('_anim_scale')) {
				animItem.classList.add('_anim-scaleIn');
			}
		}
	}
};
function offset(el) {
	const rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
};


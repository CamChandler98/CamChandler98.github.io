/*
	Forty by Pixelarity
	pixelarity.com | hello@pixelarity.com
	License: pixelarity.com/license
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
		breakpoints({
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (browser.name == 'ie' || browser.name == 'edge' || browser.mobile) ? function() { return $(this) } : function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				on, off;

			on = function() {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function() {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			breakpoints.on('<=medium', off);
			breakpoints.on('>medium', on);

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Clear transitioning state on unload/hide.
		$window.on('unload pagehide', function() {
			window.setTimeout(function() {
				$('.is-transitioning').removeClass('is-transitioning');
			}, 250);
		});

	// Fix: Enable IE-only tweaks.
		if (browser.name == 'ie' || browser.name == 'edge')
			$body.addClass('is-ie');

	// Scrolly.
		$('.scrolly').scrolly({
			offset: function() {
				return $header.height() - 2;
			}
		});

	// Tiles.
		var $tiles = $('.tiles > article');

		$tiles.each(function() {

			var $this = $(this),
				$image = $this.find('.image'), $img = $image.find('img'),
				$link = $this.find('.link'),
				x;

			// Image.

				// Set image.
					$this.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide original.
					$image.hide();

			// Link.
				if ($link.length > 0) {

					$x = $link.clone()
						.text('')
						.addClass('primary')
						.appendTo($this);

					$link = $link.add($x);

					$link.on('click', function(event) {
						
						// Prevent default.
						if(href = 'void' )
						{
							//console.log("void")
							// $this.removeClass('is-transitioning');
							// $wrapper.removeClass('is-transitioning');
							return
						}
						event.stopPropagation();
						event.preventDefault();

						
						var href = $link.attr('href');


						// Target blank?
							if ($link.attr('target') == '_blank') {

								// Open in new tab.
									window.open(href);

							}

						// Otherwise ...
							else {

								// Start transitioning.
									$this.addClass('is-transitioning');
									$wrapper.addClass('is-transitioning');

								// Redirect.
									window.setTimeout(function() {

										location.href = href;
									}, 500);

							}

					});

				}

		});

	// Header.
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() {
				$window.trigger('scroll');
			});

			$window.on('load', function() {

				$banner.scrollex({
					bottom:		$header.height() + 10,
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
				});

				window.setTimeout(function() {
					$window.triggerHandler('scroll');
				}, 100);

			});

		}

	// Banner.
		$banner.each(function() {

			var $this = $(this),
				$image = $this.find('.image'), $img = $image.find('img');

			// Parallax.
				$this._parallax(0.275);

			// Image.
				if ($image.length > 0) {

					// Set image.
						$this.css('background-image', 'url(' + $img.attr('src') + ')');

					// Hide original.
						$image.hide();

				}

		});

	// Menu.
		var $menu = $('#menu'),
			$menuInner;

		$menu.wrapInner('<div class="inner"></div>');
		$menuInner = $menu.children('.inner');
		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menuInner
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					window.setTimeout(function() {
						window.location.href = href;
					}, 250);

			});

		$menu
			.appendTo($body)
			.on('click', function(event) {

				event.stopPropagation();
				event.preventDefault();

				$body.removeClass('is-menu-visible');

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('click', function(event) {

				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});

			let colors = [
				 "#87a8eb",
				"#b374b3",
				 '#c6758c'
		]



			document.querySelectorAll('.motto-text').forEach((item,i) => {
				let color = colors[i]

				item.style.backgroundColor = color;

				let itemText = item.querySelector('p')

				itemText.style.textTransform = 'uppercase'
				itemText.style.opacity = 0

				let spans = itemText.innerText.replace(/\S/g, "<span class='letter'>$&</span>");

				itemText.innerHTML = spans
			})
			$('#aboutModal').on('shown.bs.modal', function (e) {
				// do something...
				let modal = e.currentTarget

				let item = modal.querySelector('.active')

				let itemText = item.querySelector('p')
				itemText.style.opacity = 0
				let letters = itemText.querySelectorAll('.letter')

				anime.timeline({loop: false})
				.add({
				  targets: [itemText, ...letters],
				  scale: [4,1],
				  opacity: [0,1],
				//   translateZ: 0,
				  easing: "easeOutExpo",
				  duration: 930,
				  delay: (el, i) => 70*i
				})
			  })
			  $('#aboutModal').on('hide.bs.modal', function (e) {

				console.log('hidden?')
				let modal = e.currentTarget

				let item = modal.querySelector('.active')

				let itemText = item.querySelector('p')
				itemText.style.opacity = 0
				let letters = itemText.querySelectorAll('.letter')

				letters.forEach(letter => {
					letter.style.opacity = 0
				})

				
			  })
			$('#aboutCarousel').on('slide.bs.carousel', function (e) {
				//console.log('slid')
				let item = e.relatedTarget
				let itemText = item.querySelector('p')
				itemText.style.opacity = 0
				let letters = itemText.querySelectorAll('.letter')

				anime.timeline({loop: false})
				.add({
				  targets: [itemText, ...letters],
				  scale: [4,1],
				  opacity: [0,1],
				//   translateZ: 0,
				  easing: "easeOutExpo",
				  duration: 930,
				  delay: (el, i) => 70*i
				})

			  })
	
			let gliders = document.querySelectorAll('.glide')
			let gliderInterfaces = []
			let gliderTracks = []

			// gliders.forEach((glider,i) => {
				

			// 	let glidehtml = glider
			// 	let glideTrack = glidehtml.querySelector('.glide__track')

			// 	gliderTracks.push(glideTrack)
			// 	// gliderInterfaces.push(newGlider)
	
			// 	let glideControls = glidehtml.querySelector('glide__bullets')
			// 	glideTrack.style.visibility = 'hidden';
			// 	glideTrack.setAttribute("visibility", 'none')

				
			// 	// newGlider.on("mount.after" , ()=> {
			// 	// 	//console.log('setting move slide')				
			// 	// 	setInterval(()=> {
			// 	// 		// //console.log('tick')
			// 	// 		glideTrack.dispatchEvent(new Event ('moveslide', {bubbles:true}))
			// 	// 	}, 100)	
			// 	// })
	
			// })


			const moveSlides = () => {
				gliders.forEach((glider,i) => {

					let gliderID = `glide${i}`
					glider.id = gliderID
	
					let newGlider = new Glide(`#${gliderID}`, {
						type: 'carousel',
						perView: 4,
						focusAt: 'center',
						// autoplay: 500,
						// animationDuration: 100,
						breakpoints: {
							800: {
								perView: 2
							},
							480: {
								perView: 1
							}
						}
					})
				let glidehtml = glider
				let glideTrack = glidehtml.querySelector('.glide__track')

				gliderTracks.push(glideTrack)
				gliderInterfaces.push(newGlider)
	
				let glideControls = glidehtml.querySelector('glide__bullets')
				glideTrack.style.visibility = 'hidden';
				glideTrack.setAttribute("visibility", 'none')

				
				
				
				const moveEvent = new CustomEvent("moveslide", {
					bubbles:true
				})
				
				
				
				// newGlider.on("mount.after" , ()=> {
					
				// //console.log('setting move slide')				
				// newGlider.disable()
				

			})

		}

		const getClone = (slide, trackPosition = false) => {

			let clone = slide.cloneNode(true)
			
			let slideImg = slide.querySelector('img')

			clone.classList.add('live__clone')

			if(trackPosition)
			{
				let rect = slide.getBoundingClientRect();

				let xPos = rect.left + window.scrollX;

				clone.dataset.targetPosition = xPos;
				clone.classList.add('tracker')

			}
			clone.innerHTML = slide.innerHTML

			let cloneImg = clone.querySelector('img')

			cloneImg.width = slideImg.width

			cloneImg.height = slideImg.height

			cloneImg.src = slideImg.src

			return clone
		}

		const cloneNode = (e) => {


			let slide = e.target


			let clone = getClone(slide)
			let parent = slide.parentElement


		
			parent.appendChild(clone)
			slide.remove()
						}


			function intersectionCallback(entries, observer) {
				entries.forEach((entry) => {
				  const slide = entry.target;


				  slide.style.border = "thick solid white"
				//   debugger

					let intersectionRatio = entry.intersectionRatio
					// debugger


					if(entry.intersectionRatio >= .9){

						
						slide.setAttribute('passed', true)
						slide.style.borderColor = "red"
						return
					  debugger
					}
					

					if(entry.intersectionRatio <= .1  ){
						// debugger
						slide.style.borderColor = 'green'
						////console.log('LEAVE')
						let passed = slide.getAttribute('passed')
						let parent = slide.parentElement;
						if(!parent)
						{
							return
						}

						////console.log(parent.children.length)
						if(passed == 'true'){
							// debugger
							let clone = slide.cloneNode(true)
							
							let slideImg = slide.querySelector('img')
	
							clone.classList.add('live__clone')
	
							clone.innerHTML = slide.innerHTML
	
							let cloneImg = clone.querySelector('img')
	
							cloneImg.width = slideImg.width
	
							cloneImg.height = slideImg.height
	
							cloneImg.src = slideImg.src
	
							clone.setAttribute('pos', 0)
							clone.setAttribute('passed', false) 
							
							let first = parent.firstElementChild
							parent.insertAdjacentElement("afterbegin", clone)
							// debugger
							slide.remove()
							observer.unobserve(slide)	


						// 	setInterval(()=> {
								
						// 		let pos = parseFloat(clone.getAttribute("pos")) || 0;
						// 		pos += .06
						// 		clone.setAttribute('pos', pos)
						// 		clone.style.left = pos + "%"
						// 		clone.style.right = pos + "auto"
						// }, 1)	
						observer.observe(clone)
						return
						}
					
						// parent.insertBefore(slide,first)
					
						// debugger

					}
					// slide.style.borderStyle = 'none'
					slide.style.border = "thick solid #0000FF"

				  
				});
			  }
		



			

			moveSlides()

			$('#skillsModal').on('shown.bs.modal', (e)=> {
				
				let slides = document.querySelectorAll('.glide__slide')

				let length = document.querySelector('.glide__slides').children.length

				
				if(!e.target.dataset.cloned){
					slides.forEach( (slide,i) => {
					
						let parentWidth = slide.parentElement.offsetWidth;
						
						let slideWidth = parentWidth / 5
						
						let index = Array.from(slide.parentElement.children).indexOf(slide)

						let text = slide.querySelector('p')

						text.classList.add('skill-text')
						
						//console.log(index,length)
						
						
						slide.style.width = `${slideWidth}px`
						
						let clone
						if(index == length - 2){
							clone = getClone(slide, true)
						}
						else{
							clone = getClone(slide)
						}
						
						slide.parentElement.appendChild(clone)
					})
				}
				

				e.target.dataset.cloned = true

				setTimeout(()=>{

					gliderTracks.forEach(glideTrack => {

						glideTrack.style.visibility = 'visible'
						let slides = glideTrack.querySelectorAll('.glide__slide')
						let skillDivs = glideTrack.querySelectorAll('.skill-slide')

						let interval
						
						let canMove = true

						let slideWrapper = glideTrack.querySelector('.glide__slides')
						let val = 0 
						if(slideWrapper.dataset.val){
							val += parseFloat(slideWrapper.dataset.val)
						}
						let tracker = glideTrack.querySelector('.tracker')
						let junmpThreshold = 0.5
						let step = 1.5	

						let initialRotation  = '20deg'
						let initialTranslateY

						
						let mqSmall = window.matchMedia('screen and (max-width: 736px)')

						if(mqSmall.matches)
						{
							initialTranslateY = '0px'
						}
						else
						{
							initialTranslateY = '-40px'
						}


						let moveTrack = () => {
							
							if(!canMove)
							{
								return
							}
							
							let rect = tracker.getBoundingClientRect();
							let xPos = rect.left + window.scrollX;
							
							let targetPosition = tracker.dataset.targetPosition
							
							//console.log("target", targetPosition)
							//console.log('position', xPos)
							
							if(xPos >= targetPosition){
								//console.log('bingo')
								val = -step
							}

							
							
							val += step
							slideWrapper.dataset.val = val


							const translate3d = `translate3d(${val}px, 0px, 0px)`
							
							slideWrapper.style.mozTransform = translate3d // needed for supported Firefox 10-15
							slideWrapper.style.webkitTransform = translate3d // needed for supported Chrome 10-35, Safari 5.1-8, and Opera 15-22
							slideWrapper.style.transform = translate3d
						}
						let stopTrack = () => {
							
						}

						anime({
							targets: '.skill-slide',
							translateY: [
								{ value: initialTranslateY, duration: 0, delay: 0}
							],
							rotate: [
								{ value: initialRotation, duration: 0, delay: 0}

							],
							autoplay: false,
							loop: false,
						})


						
						let swingSlides = anime({
							targets: skillDivs,
		
							rotate: 29,
							loop: true,
							direction: 'alternate',
							easing: 'easeInOutSine',
							duration: 800,
							autoplay: false,

						})

						let AnimEndDelay = 400
						slideWrapper.addEventListener('mouseover', () => {
							canMove = false
							
							console.log(swingSlides)

							let stopSwingInterval = setInterval(() => {

								
								if(swingSlides.progress < 70.0){
									clearInterval(stopSwingInterval)
									swingSlides.pause()
								}

							}, 1)

			
						})

						slideWrapper.addEventListener('mouseout', () => {
							canMove = true
							setTimeout(() => {
								
								swingSlides.play()
							}, 100)
						})

						swingSlides.play()
						interval = setInterval(moveTrack,1)

						window.addEventListener('keydown', e => {
							if (e.code === "Backspace")
							{
								clearInterval(interval)
							}
						})



						$("#skillsModal").on('hide.bs.modal', ()=> {
							if(interval)
							{
								clearInterval(interval)
							}
						})

						// slides.forEach(slide => {
						// 	slide.addEventListener('click', cloneNode)
						// })
					})
					
				}, 200)
			})

			// window.onload(()=>{
				
			// })


})(jQuery);
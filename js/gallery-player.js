YUI().add('gallery-player', function(Y) {

	function Player(config) {
		Player.superclass.constructor.apply(this, arguments);
	}

	Player.NAME = 'player';
	Player.ATTRS = {
		type: {
	        value: 'video',
	        validator: Y.Lang.isString
	    },
		sources: {
	        value: null,
	        validator: Y.Lang.isArray
	    },
		poster: {
	        value: null,
	        validator: Y.Lang.isString
	    },
		preload: {
	        value: false,
	        validator: Y.Lang.isBool
	    },
		autoplay: {
	        value: false,
	        validator: Y.Lang.isBool
	    },
		loop: {
	        value: false,
	        validator: Y.Lang.isBool
	    },
		standardControls: {
	        value: false,
	        validator: Y.Lang.isBool
	    },
		controlSet:	{
			value: ['play', 'rewind', 'forward', 'fullscreen', 'volume', 'scrubber', 'counters'],
			validator: Y.Lang.isArray
		},
		width: {
	        value: null,
	        validator: Y.Lang.isNumber
	    },
		height: {
	        value: null,
	        validator: Y.Lang.isNumber
	    },
		degrade: {
	        value: '<p>Your browser does not support this widget.</p>',
	        validator: Y.Lang.isString
	    },
		player: null,
		controls: {},
		scrubEvent: null,
		playEvent: null,
		rewindEvent : null,
		forwardEvent: null,
		volumeEvent: null,
		fullscreenEvent : null
	};

	Y.extend(Player, Y.Widget, {
			initializer: function() {
				// Enable all of the player events!
				if (!this.get('standardControls')) {
					Y.Node.DOM_EVENTS.abort = 1;
					Y.Node.DOM_EVENTS.canplay = 1;
					Y.Node.DOM_EVENTS.canplaythrough = 1;
					Y.Node.DOM_EVENTS.durationchange = 1;
					Y.Node.DOM_EVENTS.emptied = 1;
					Y.Node.DOM_EVENTS.ended = 1;
					Y.Node.DOM_EVENTS.error = 1;
					Y.Node.DOM_EVENTS.load = 1;
					Y.Node.DOM_EVENTS.loadeddata = 1;
					Y.Node.DOM_EVENTS.loadedmetadata = 1;
					Y.Node.DOM_EVENTS.loadstart = 1;
					Y.Node.DOM_EVENTS.pause = 1;
					Y.Node.DOM_EVENTS.play = 1;
					Y.Node.DOM_EVENTS.playing = 1;
					Y.Node.DOM_EVENTS.progress = 1;
					Y.Node.DOM_EVENTS.ratechange = 1;
					Y.Node.DOM_EVENTS.seeked = 1;
					Y.Node.DOM_EVENTS.seeking = 1;
					Y.Node.DOM_EVENTS.stalled = 1;
					Y.Node.DOM_EVENTS.suspend = 1;
					Y.Node.DOM_EVENTS.timeupdate = 1;
					Y.Node.DOM_EVENTS.volumechange = 1;
					Y.Node.DOM_EVENTS.waiting = 1;
				}
			},

			renderUI: function() {
				this._createPlayerTag(this.get('type'));
			},

			bindUI: function(){
				// Setup event handlers for all media events
				if (!this.get('standardControls')) {
					this.get('player').on('abort', this._eventAbort, this);
					this.get('player').on('canplay', this._eventCanPlay, this);
					this.get('player').on('canplaythrough', this._eventCanPlayThrough, this);
					this.get('player').on('durationchange', this._eventDurationChange, this);
					this.get('player').on('emptied', this._eventEmptied, this);
					this.get('player').on('ended', this._eventEnded, this);
					this.get('player').on('error', this._eventError, this);
					this.get('player').on('load', this._eventLoad, this);
					this.get('player').on('loadeddata', this._eventLoadedData, this);
					this.get('player').on('loadedmetadata', this._eventLoadedMetaData, this);
					this.get('player').on('loadstart', this._eventLoadStart, this);
					this.get('player').on('pause', this._eventPause, this);
					this.get('player').on('play', this._eventPlay, this);
					this.get('player').on('playing', this._eventPlaying, this);
					this.get('player').on('progress', this._eventProgress, this);
					this.get('player').on('ratechange', this._eventRateChange, this);
					this.get('player').on('seeked', this._eventSeeked, this);
					this.get('player').on('seeking', this._eventSeeking, this);
					this.get('player').on('stalled', this._eventStalled, this);
					this.get('player').on('suspend', this._eventSuspend, this);
					this.get('player').on('timeupdate', this._eventTimeUpdate, this);
					this.get('player').on('volumechange', this._eventVolumeXhange, this);
					this.get('player').on('waiting', this._eventWaiting, this);
					this.get('controls').volume_slider.on('valueChange', this.volume, this);
					this.get('boundingBox').on('mouseover', this.showControls, this);	
					this.get('boundingBox').on('mouseout', this.hideControls, this);
				}
			},

			syncUI: function(){},

			destructor: function(){},

			_createPlayerTag: function(type){
				var contentBox = this.get('contentBox');
				if (type == 'video') {
					var player = Y.Node.create('<video></video>', document);

					player.prepend(this.get('degrade'));
					if (this.get('sources').length > 1) {
						player.prepend(this._createSources(this.get('sources')));
					} else {
						player.setAttribute('src', this.get('sources')[0].title);
					}

					if (this.get('width') != null)
						player.setAttribute('width', this.get('width'));

					if (this.get('height') != null)
						player.setAttribute('height', this.get('height'));

					if (this.get('poster') != null)
						player.setAttribute('poster', this.get('poster'));

					player._node.autoplay = this.get('autoplay');
					player._node.controls = this.get('standardControls');
					player._node.loop = this.get('loop');
					player._node.autobuffer = this.get('preload');
					contentBox.prepend(player);

					if (!this.get('standardControls'))
						this._createCustomControls(player);
				}
				this.set('player', player);
				this.get('player')._node.volume = .75;
			},

			_createSources: function(sources) {
				var i, title, type, markup = '';
				for (i=0;i<sources.length;i++) {
					title = sources[i].title;
					type = sources[i].type;
					markup += '<source src="'+title+'" type="'+type+'" />';
				}

				return markup;
			},

			_createCustomControls: function(player) {
				var prefix, controls, play, rewind, forward, volume, fullscreen, scrubber_bar, progress, scrubber, length, x, y, volume_slider, scrubber_slider = '';

				prefix = 'yui-'+this.name+'-';
				// Create Nodes for Controls
				controls = Y.Node.create('<div class="'+prefix+'controls"><img src="images/volume_icons.png" width="92" height="14" alt="Volume Icons" class="volume_icons"></div>');
				play = Y.Node.create('<img src="images/play.png" class="'+prefix+'play" width="22" height="25" alt="Play">');
				rewind = Y.Node.create('<img src="images/rewind.png" class="'+prefix+'rewind" width="33" height="19" alt="Rewind">');
				forward = Y.Node.create('<img src="images/forward.png" class="'+prefix+'forward" width="33" height="19" alt="Forward">');
				volume = Y.Node.create('<div class="yui-widget yui-slider '+prefix+'volume"><div class="yui-slider-content"><div class="yui-slider-rail yui-slider-rail-x"><div class="yui-slider-thumb"></div></div></div></div>');

				if (player._node.webkitEnterFullScreen !== undefined) {
					fullscreen = Y.Node.create('<img src="images/fullscreen.png" class="'+prefix+'fullscreen" width="15" height="16" alt="Fullscreen">');
				}
				
				scrubber_bar = Y.Node.create('<div class="yui-widget yui-slider '+prefix+'scrubber_bar"><div class="yui-slider-content"><div class="yui-slider-rail yui-slider-rail-x"><div class="yui-slider-thumb"></div></div></div></div>');
				progress = Y.Node.create('<span class="'+prefix+'progress">00:00:00</span>');
				length = Y.Node.create('<span class="'+prefix+'length">00:00:00</span>');

				// Sliders
				volume_slider = new Y.Slider({railSize: '50px', height: '10px', axis: 'x', thumbImage: 'images/volume.png', boundingBox: volume, min: 0, max: 100, value: 75});
				scrubber_slider = new Y.Slider({railSize: '316px', height: '8px', axis: 'x', thumbImage: 'images/progress.png', boundingBox: scrubber_bar, min: 0, max: 100, value: 0});

				// Put a reference to our controls into ATTRS so we can use them later.
				this.set('controls', {'controls':controls, 'rewind':rewind, 'play':play,'forward':forward, 'volume':volume, 'fullscreen':fullscreen, 'scrubber_bar':scrubber_bar, 'progress':progress, 'scrubber':scrubber, 'length':length, 'volume_slider':volume_slider, 'scrubber_slider':scrubber_slider});

				// Add Nodes to Control Bar
				scrubber_bar.prepend(length);
				scrubber_bar.prepend(progress);
				scrubber_bar.prepend(scrubber);
				controls.prepend(scrubber_bar);
				controls.prepend(fullscreen);
				controls.prepend(volume);
				controls.prepend(forward);
				controls.prepend(rewind);
				controls.prepend(play);
				
				play.setStyle('opacity', .5);
				forward.setStyle('opacity', .5);
				rewind.setStyle('opacity', .5);
				scrubber_slider.get('contentBox').setStyle('opacity', .5);
				
				// Add basic events
				this.volumeEvent = this.get('controls').volume.on('click', this.volume, this);
				if (player._node.webkitEnterFullScreen !== undefined) {
					this.fullscreenEvent = this.get('controls').fullscreen.on('click', this.fullscreen, this);
				}
				
				// Add Controls to DOM
				player.ancestor().insert(controls);
				volume_slider.render();
				scrubber_slider.render();
				
				x = ((player.getStyle('width').replace('px','')) - 438) / 2 + player.getX();
				y = ((player.getStyle('height').replace('px','')) - 59) / 1 + player.getY() - 25;
				controls.setXY([x, y]);
			},

			play: function(e) {
				var player = this.get('player')._node;
				if (player.paused) {
					player.play();
				} else {
					player.pause();
				}

			},

			rewind: function(e) {
				this.get('player')._node.playbackRate = this.get('player')._node.playbackRate - 2;
			},

			forward: function(e) {
				this.get('player')._node.playbackRate = this.get('player')._node.playbackRate + 2;
			},

			volume: function(e) {
				if (parseInt(e.newVal)) {
					this.get('player')._node.volume = parseInt(e.newVal) / 100;
				}
			},
			
			scrub: function(e) {
				if (parseInt(e.newVal)) {
					var duration, newTime;
					duration = this.get('player')._node.duration;
					newTime = duration * (parseInt(e.newVal) / 100);
					if (newTime > duration)
						newTime = duration;
					
					if (newTime < 0)
						newTime = 0.0;
					
					this.get('player')._node.currentTime = newTime;
				}
			},
			
			beginScrub: function(e) {
				this.scrubEvent = this.get('controls').scrubber_slider.on('valueChange', this.scrub, this);
			},

			endScrub: function(e) {
				this.scrubEvent.detach();
			},

			fullscreen: function(e) {
				this.get('player')._node.webkitEnterFullScreen();
			},
			
			showControls: function() {
				var show = new Y.Anim({node: this.get('controls').controls, to: {opacity: 1}, duration: .25});
				show.run();
			},

			hideControls: function() {
				var hide = new Y.Anim({node: this.get('controls').controls, to: {opacity: 0}, duration: .25});
				hide.run();	
			},

			// Begin Event Handlers
			_eventAbort: function(e) {
				// Sent when the browser stops fetching the media data before the media resource was completely downloaded.
				// console.log(e.type);
			},

			_eventCanPlay: function(e) {
				// Sent when the browser can resume playback of the media data, but estimates that if playback is started now, the media resource could not be rendered at the current playback rate up to its end without having to stop for further buffering of content.
				// console.log(e.type);
				this.playEvent = this.get('controls').play.on('click', this.play, this);
				this.rewindEvent = this.get('controls').rewind.on('click', this.rewind, this);
				this.forwardEvent = this.get('controls').forward.on('click', this.forward, this);

				this.get('controls').scrubber_slider.on('slideStart', this.beginScrub, this);
				this.get('controls').scrubber_slider.on('slideEnd', this.endScrub, this);

				this.get('controls').play.setStyle('opacity', 1);
				this.get('controls').forward.setStyle('opacity', 1);
				this.get('controls').rewind.setStyle('opacity', 1);
				this.get('controls').scrubber_slider.get('contentBox').setStyle('opacity', 1);				
			},

			_eventCanPlayThrough: function(e) {
				// Sent when the browser estimates that if playback is started now, the media resource could be rendered at the current playback rate all the way to its end without having to stop for further buffering.
				// console.log(e.type);								
			},

			_eventDurationChange: function(e) {
				// Sent when the duration property changes.
				// console.log(e.type);
			},

			_eventEmptied: function(e) {
				// Sent when the media element network state changes to the NETWORK_EMPTY state.
				// console.log(e.type);
			},

			_eventEnded: function(e) {
				// Sent when playback has stopped at the end of the media resource and the ended property is set to true.
				// console.log(e.type);
			},

			_eventError: function(e) {
				// Sent when an error occurs while fetching the media data. Use the error property to get the current error.
				// console.log(e.type);
			},

			_eventLoad: function(e) {
				// Sent when the browser finishes downloading the media resource.
				// console.log(e.type);
			},

			_eventLoadedData: function(e) {
				// Sent when the browser can render the media data at the current playback position for the first time.
				//console.log(e.type);
			},

			_eventLoadedMetaData: function(e) {
				// Sent when the browser knows the duration and dimensions of the media resource.
				// console.log(e.type);
				var duration = this.get('player')._node.duration;
				this.get('controls').length.set('innerHTML', this._convertSecondsToTimeStamp(duration));
			},

			_eventLoadStart: function(e) {
				// Sent when the browser begins loading the media data.
				// console.log(e.type);
			},

			_eventPause: function(e) {
				// Sent when playback pauses after the pause method returns.
				// console.log(e.type);
				this.get('controls').play.removeClass('yui-player-pause');
				this.get('controls').play.addClass('yui-player-play');
				this.get('controls').play._node.src = 'images/play.png';
			},

			_eventPlay: function(e) {
				// Sent when playback starts after the play method returns.
				// console.log(e.type);
				this.get('controls').play.removeClass('yui-player-play');
				this.get('controls').play.addClass('yui-player-pause');
				this.get('controls').play._node.src = 'images/pause.png';
			},

			_eventPlaying: function(e) {
				// Sent when playback starts.
				//console.log(e.type);
			},

			_eventProgress: function(e) {
				// Sent when the browser stops playback because it is waiting for the next frame.
				// console.log(e.type);
				if (this.get('playEvent') != null)
					this.get('playEvent').detach();
					
				if (this.get('forwardEvent') != null)
					this.get('forwardEvent').detach();

				if (this.get('rewindEvent') != null)
					this.get('rewindEvent').detach();
				
			},

			_eventRateChange: function(e) {
				// Sent when either the defaultPlaybackRate or the playbackRate property changes.
				// console.log(e.type);
			},

			_eventSeeked: function(e) {
				// Sent when the seeking property is set to false.
				// console.log(e.type);
			},

			_eventSeeking: function(e) {
				// Sent when the seeking property is set to true and there is time to send this event.
				// console.log(e.type);
			},

			_eventStalled: function(e) {
				// Sent when the browser is fetching media data but it has stopped arriving.
				// console.log(e.type);
			},

			_eventSuspend: function(e) {
				// Sent when the browser suspends loading the media data and does not have the entire media resource downloaded.
				// console.log(e.type);
			},

			_eventTimeUpdate: function(e) {
				// Sent when the currentTime property changes as part of normal playback or because of some other condition.
				var curTime, duration;
				var duration = this.get('player')._node.duration;
				curTime = this.get('player')._node.currentTime;
				this.get('controls').progress.set('innerHTML', this._convertSecondsToTimeStamp(curTime));
				this.get('controls').scrubber_slider.setValue((curTime / duration) * 100);
				this.get('controls').scrubber_slider.syncUI();
			},

			_eventVolumeChange: function(e) {
				// Sent when either the volume property or the muted property changes.
				// console.log(e.type);
			},

			_eventWaiting: function(e) {
				// Sent when the browser stops playback because it is waiting for the next frame.
				// console.log(e.type);
			},

			_convertSecondsToTimeStamp: function(length) {
				var hours, minutes, seconds, timestamp;
				
				// Calculate the integer values of hours, minutes, & seconds
				hours = (length > 3600) ? (length / 60) / 60 : 0;
				if (hours === 0) {
					minutes = (length > 60) ? length / 60 : 0;
				} else {
					minutes = length - ((hours % 1) * 60 * 60);
				}
				if (minutes === 0) {
					seconds = (length < 60) ? length : 0;
				} else {
					seconds = (minutes % 1) * 60;
				}

				// Create the timestamp string
				hours = (Math.floor(hours).toString().length == 1) ? '0'+Math.floor(hours): Math.floor(hours);
				minutes = (Math.floor(minutes).toString().length == 1) ? '0'+Math.floor(minutes): Math.floor(minutes);
				seconds = (Math.floor(seconds).toString().length == 1) ? '0'+Math.floor(seconds): Math.floor(seconds);
				timestamp = hours+':'+minutes+':'+seconds;

				return timestamp;
			}
	});

	Y.Player = Player;
}, '3.0.0', {requires:['widget', 'node', 'slider', 'anim'], skinnable:true});
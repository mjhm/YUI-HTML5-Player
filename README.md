YUI HTML5 Player
================

YUI HTML5 Player is a YUI 3 widget that creates a video player using the HTML5 video tag and JavaScript that is based on YUI 3. It was started as entry to the YUI 3 Gallery Contest in March 2010.

__Features__

- Easy to Use
- Full Javascript/HTML/CSS UI
- Full Availability of HTML5 &lt;video&gt; attributes 
- Pass content to be displayed in browsers that do not support &lt;video&gt;
- Support for multiple formats for each video.
- Support for WebKit's fullscreen API
- Full Range of Video Controls
- Specify which controls you need
- Follows YUI practices (or at least tries too!)

__Features Coming Soon__

- Support for &lt;audio&gt;
- Better cross-browser compatibility
- Pseudo-Fullscreen capabilites (will size video to browser window)

__YUI Modules Used__

- Widget
- Node
- Slider
- Animation

__How To__

1. Include YUI3:

	<script src="http://yui.yahooapis.com/3.0.0/build/yui/yui-min.js" type="text/javascript" charset="utf-8"></script>

2. Include and Configure (__Note__: All options are listed here):

	YUI({
		modules: {
			'gallery-player': {
				fullpath:'js/gallery-player.js',
				requires: ['widget','node','slider', 'anim']
			}
		}
	}).use('gallery-player', function(Y){
		player = new Y.Player({
			contentBox: '#video',
			type: 'video',
			sources:[
				{title:'path/to/videp.mov', type:'video/mp4'},
				{title:'path/to/video.mp4', type:'video/mp4'},
				{title:'path/to/video.ogv', type:'video/ogg'}
			],
			poster: 'path/to/poster.png',
			preload: false,
			autoplay: false,
			loop: false,
			standardControls: false,
			controlSet: ['play','rewind', 'forward', 'fullscreen', 'volume', 'scrubber', 'counters'],
			width: 800,
			height: null,
			degrade: '<p>Please use Firefox, Safari, or Chrome</p>'
		});
		player.render();
		player.focus();
	});

	- __contentBox__: A &lt;div&gt; in which you'd like to place the player
	- __type__: This will always be 'video' until audio support is added
	- __sources__: A list of paths to source files and their MIME-Types. This is used to provide videos in various codecs in order to hit all platforms (e.g. Theora, MPEG-4, etc.).
	- __poster__: A path to a placeholder image file that is shown will the video is being downloaded
	- __autoplay__: [true|false] Whether or not the video should autoplay.
	- __loop__: [true|false] Whether or not the video should loop.
	- __standardControls__: [true|false] Whether or not the player should create its own controls or use the browser controls.
	- __controlSet__: An array of controls that should be available when using non-browser controls. __Availble controls are__:
		- _play_: Play/Pause button
		- _rewind_: Rewind button 
		- _forward_: Fast Forward button
		- _fullscreen_: Fullscreen button
		- _volume_: Volume Slider
		- _scrubber_: Scrubber Slider
		- _counters_: Progress/Length counters 
	- __width__: An integer representing the desire width of player in pixels. The video will be letter-boxed to preserve its aspect ratio.
	- __height__: An integer representing the desire width of player in pixels. The video will be letter-boxed to preserve its aspect ratio.
	- __degrade__: Content to be shown in browser that do not support &lt;video&gt;.
3. Be sure you have any empty div in your DOM with an ID matching what you put in contentBox

	<div id="video"></div>
	
4. Profit! (Not Guranteed :-))
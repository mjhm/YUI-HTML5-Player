YUI HTML5 Player
================

YUI HTML5 Player is a YUI 3 widget that creates a video player using the HTML5 video tag and JavaScript that is based on YUI 3. It was started as entry to the YUI 3 Gallery Contest in March 2010.

The 10/07/2010 version updated the code to YUI 3.2 standards and structure, added some new features, and fixed some bugs.  The primary goal of this revision was to adapt Josh's code to create a launching pad for others to dive into JavaScript programming of HTML5 video widgets.  Therefore the code was substantially reorganized and documented to make it more hackable and adaptable.  For example the code now has a facility for logging and tracking any HTML5 video events.

Original Features
--------

- Get a player in 3 easy steps
- Full Javascript/HTML5/CSS UI
- Full Availability of HTML5 &lt;video&gt; attributes 
- Support for multiple formats for each video.
- Full Range of Video Controls
- Specify which controls you need
- Follows YUI practices (or at least tries too!)

New Features
------------

- Loading progress indicator.
- Full screen mode (as triggered by browser e.g. F11)
- Scrubbing seamlessly while playing.


YUI Modules Use
---------------

- Widget
- Slider
- Animation
- AsyncQueue
- Event Simulation


How To
------

1. Include YUI3
	
		<script src="http://yui.yahooapis.com/3.0.0/build/yui/yui-min.js" type="text/javascript" charset="utf-8"></script>

2. Setup The YUI HTML5 Player

		var player;
		YUI({
			modules: {
				'gallery-player': {
					fullpath:'js/gallery-player-min.js',
					requires: ['widget','node','slider', 'anim', 'array']
				}
			}
		}).use('gallery-player', 'node-base', function(Y){
			player = new Y.Player({
				contentBox: '#video',
				type: 'video',
				stylesheet: 'false',
				images: 'images/',
				sources:[
					{title:'http://macinjosh.s3.amazonaws.com/video.mov', type:'video/mp4'},
					{title:'http://macinjosh.s3.amazonaws.com/video.mp4', type:'video/mp4'},
					{title:'http://macinjosh.s3.amazonaws.com/video.ogv', type:'video/ogg'}
				],
				poster: 'video/poster.png',
				preload: false,
				autoplay: true,
				loop: false,
				standardControls: false,
				controlSet: ['play','rewind', 'forward', 'fullscreen', 'volume', 'scrubber'],
				width: 800,
				height: 450,
				degrade: '<p>Please use Firefox, Safari, or Chrome</p>'
			});
			player.render();
			player.focus();
		});

	_Note: For illustrative purposes all available options were used in the example above._
	
	- stylesheet: path to the stylesheet or the string 'false' to not use any, if this property is omitted it defaults to: 'assets/gallery-player-core.css'
	- images: path to the folder of images used by the player, defaults to: 'assets/images/'
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
	- __width__: An integer representing the desire width of player in pixels. The video will be letter-boxed to preserve its aspect ratio.
	- __height__: An integer representing the desire width of player in pixels. The video will be letter-boxed to preserve its aspect ratio.
	- __degrade__: Content to be shown in browser that do not support &lt;video&gt;.
3. Be sure you have any empty div in your DOM with an ID matching what you put in contentBox

		<div id="video"></div>

Development of this project will be continuous. Please [report](http://github.com/macinjosh/YUI-HTML5-Player/issues) any issues you have on GitHub. Email me with any questions at [josh@macinjosh.net](mailto:josh@macinjosh.net).

Links
-----

- [GitHub Project](http://github.com/macinjosh/YUI-HTML5-Player)
- [Report Issue](http://github.com/macinjosh/YUI-HTML5-Player/issues)
- [Get Latest Source](http://github.com/macinjosh/YUI-HTML5-Player.git)

License
-------

The source code in this project is offered under [YUI's BSD License](http://developer.yahoo.com/yui/license.html).


The example video files in this project are used under the [Creative Commons Attribution-Noncommercial 2.0 Generic](http://creativecommons.org/licenses/by-nc/2.0/) license. The video was created by Flickr member [96dpi](http://www.flickr.com/photos/96dpi/). Royalty free music was added to the video by the owner of YUI HTML5 Player, Josh Brickner so that the player's audio capability could be shown. Any use of this video must follow the guidelines of the [Creative Commons Attribution-Noncommercial 2.0 Generic](http://creativecommons.org/licenses/by-nc/2.0/) license.
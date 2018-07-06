(function() {
    var s = Snap("#scene1");
    var g = s.group();
    var map;
    var isMapLoaded = false;
    var tux = Snap.load("world.svg", function ( loadedFragment ) {
        g.append( loadedFragment );
        console.log('loaded')
        isMapLoaded = true
        map = loadedFragment.paper
    })

    var width = 150
  // Define our constructor
  this.Clock = function() {

    // Create global element references
    this.svg = null;
    this.offset = null;
    this.hour = null;
    this.hourHand = null;
    this.minute = null;
    this.minuteHand = null;
    this.second = null;
    this.secondHand = null;
    this.timeoutId = null;
    this.showSeconds = null;
    //this.hasMouseMoved = null

    // Define option defaults
    var defaults = {
      svg: "clock",
      autoStart: false,
      showSeconds: true,
      offset: null,
      hour: null,
      minute: null,
      second: null,
      movement: "normal" // or bounce
    }

    // Create options by extending defaults with the passed in arugments
    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }

    // Init clock setup
    setupClock.call(this);

    if(this.options.autoStart === true) this.startClock();
  }

  // Public Methods

  Clock.prototype.startClock = function() {
    // Update clock every second
    var _this = this;
    this.timeoutId = setInterval(function(){
      _this.updateTime();
      animateHands.call(_this);
    }, 1000);
  };

  Clock.prototype.stopClock = function() {
    clearTimeout(this.timeoutId);
  };

  Clock.prototype.hideSecondHand = function() {
    this.showSeconds = false;
    this.secondHand.remove();
  };

  Clock.prototype.updateTime = function() {
    // Get time
    var now = new Date();

    // Do we have an offset?
    this.hour = now.getHours();
    this.hour += this.offset;

    // Normalise hours to 1-12
    if (this.hour > 23) {
      this.hour = this.hour - 24;
    } else if (this.hour < 0) {
      this.hour = 24 + this.hour;
    }

    if (this.hour > 12) {
      this.hour -= 12;
    }

    this.minute = now.getMinutes();
    this.second = now.getSeconds();
  };

  // Private Methods

  function setupClock() {
    if (this.options.hour !== null) {
      // Set time
      this.hour = this.options.hour;

      if (this.options.minute !== null) {
        this.minute = this.options.minute;
      } else {
        this.minute = 0;
      }

      if (this.options.second !== null) {
        this.second = this.options.second;
      } else {
        this.second = 0;
      }

    } else if (this.options.offset !== null) {
      // Set offset
      this.offset = this.options.offset;
      this.updateTime();
    } else {
      this.updateTime();
    }

    // draw snap svg clock
    drawClock.call(this);
  }

  function drawClock() {
    if (typeof this.options.svg === "string") {
      svgId = this.options.svg;
    } else {
      svgId = this.options.svg.id;
    }

    this.svg = new Snap("#" + svgId);
    //var clockFaceOuter = this.svg.circle(width, width, 141);
    var clockFaceInner = this.svg.circle(width, width, 130);

    //clockFaceOuter.attr({
    //  fill: "#fff",
   //   stroke: "#222",
   //   strokeWidth: 1.5
   // });
    clockFaceInner.attr({
      fill: "#fff",
      stroke: "#222",
      strokeWidth: 5
    });

    // Draw hours
    for (var x=1;x<=12;x++) {
      var hourStroke = this.svg.circle(70, 70, 3.5);
      hourStroke.attr({
        fill: "#222",
        stroke: "#222",
        strokeWidth: 0
      });

      var t = new Snap.Matrix();
      t.rotate((360/12)*x+45, width, width);
      hourStroke.transform(t);
    }

    this.hourHand = this.svg.line(width,width,150,85);
    this.hourHand.attr({
      stroke: "#222",
      strokeWidth: 3
    });

    this.minuteHand = this.svg.line(width,width,150,60);
    this.minuteHand.attr({
      stroke: "#222",
      strokeWidth: 3
    });

    if (this.options.showSeconds === true) {
      this.secondHand = this.svg.line(width,width,150,60);
      this.secondHand.attr({
        stroke: "#222",
        strokeWidth: 3
      });
    }

    // Centre point
    var clockCenter = this.svg.circle(width, width, 5);
    clockCenter.attr({
      fill: "#222"
    });

    // Set initial location of hands
    if (this.options.showSeconds === true) {
      var s = new Snap.Matrix();
      s.rotate(getSecondDegree.call(this, this.second), width, width);
      this.secondHand.transform(s);
    }

    var h = new Snap.Matrix();
    h.rotate(getHourDegree.call(this, this.hour, this.minute), width, width);
    this.hourHand.transform(h);

    var m = new Snap.Matrix();
    m.rotate(getMinuteDegree.call(this, this.minute), width, width);
    this.minuteHand.transform(m);
  }

  function animateHands() {
    // Move second hand
    if (this.options.showSeconds === true) {
      var s = new Snap.Matrix();
      s.rotate(getSecondDegree.call(this, this.second), width, width);

      if (this.movement === "bounce") {
        this.secondHand.animate({transform: s}, 400, mina.bounce);
      } else {
        this.secondHand.animate({transform: s}, 100);
      }
    }

    // Move hour & minute?
    if (this.second === 0) {
      var h = new Snap.Matrix();
      h.rotate(getHourDegree.call(this, this.hour, this.minute), width, width);

      if (this.movement === "bounce") {
        this.hourHand.animate({transform: h}, 400, mina.bounce);
      } else {
        this.hourHand.animate({transform: h}, 100);
      }

      var m = new Snap.Matrix();
      m.rotate(getMinuteDegree.call(this, this.minute), width, width);

      if (this.movement === "bounce") {
        this.minuteHand.animate({transform: m}, 400, mina.bounce);
      } else {
        this.minuteHand.animate({transform: m}, 100);
      }
    }
  }

  function getSecondDegree(second) {
    return (360/60) * second;
  };

  function getMinuteDegree(minute) {
    return (360/60) * minute;
  };

  function getHourDegree(hour, minute) {
    var increment = Math.round((30/60) * minute);
    return ((360/12) * hour) + increment;
  };

  // Utility method to extend defaults with user options
  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

var clocks = _.map([1,2,3,4,5], function(n){
var svg = document.getElementById('clock'+n);
var clock = new Clock({
	svg: svg,
	autoStart: true
});
    return clock
})


    var last_known_scroll_position = 0;
    var ticking = false;

    var end_of_scene1 = 300
    var beginning_of_scene2= 320
    var end_of_scene2 = 500
    var max_rotation = 80
    function doSomething(s) {
        console.log(s)
        if(!isMapLoaded){ return }
        var _progress = s / end_of_scene1
        var progress = _progress > 1 ? 1 : _progress
        map.attr({
            opacity: 1 - progress
        })
        _.each(clocks, function(c){
            c.svg.attr({
                style : "transform:rotateX("+max_rotation*progress+"deg) translateY("+progress*-600+"px)",
            });
        })
            var progress2 = (s - beginning_of_scene2) / (end_of_scene2 - beginning_of_scene2)

            document.body.style.backgroundColor = "rgb(131, 134, 140, "+ 1 * progress2+")"
        
    }

    window.addEventListener('scroll', function(e) {

        last_known_scroll_position = window.scrollY;

        if (!ticking) {

            window.requestAnimationFrame(function() {
                doSomething(last_known_scroll_position);
                ticking = false;
            });
            
            ticking = true;

        }
        
    });

}());

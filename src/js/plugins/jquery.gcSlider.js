// Simple jQuery Draggable Plugin
// https://plus.google.com/108949996304093815163/about
// Usage: $(selector).drags();
// Options:
// handle            => your dragging handle.
//                      If not defined, then the whole body of the
//                      selected element will be draggable
// cursor            => define your draggable element cursor type
// draggableClass    => define the draggable class
// activeHandleClass => define the active handle class
//
// Update: 26 February 2013
// 1. Move the `z-index` manipulation from the plugin to CSS declaration
// 2. Fix the laggy effect, because at the first time I made this plugin,
//    I just use the `draggable` class that's added to the element
//    when the element is clicked to select the current draggable element. (Sorry about my bad English!)
// 3. Move the `draggable` and `active-handle` class as a part of the plugin option
// Next update?? NEVER!!! Should create a similar plugin that is not called `simple`!

(function($) {
    function gcSlider($slider, options) {

        var self = this;

        // Start options
        self.html = {};
        self.html.$slider = $slider;
        self.options = options;

        self.init = function() {

            // Settigs
            self.options = $.extend({
                draggableClass: "draggable",
                activeHandleClass: "active-handle",
                name: $slider.data("name"),
                curLeft: $slider.data("left"),
                curRight: $slider.data("right"),
                onChange: function(values) {

                }
            }, self.options);
            //console.log(self.options);
			
            // States
            self.state = {
	            "prevAction": false,
                "left": 0, // Left dot pos
                "right": 0, // Right dot pos
                "min": 0,
                "max": self.html.$slider.width(),
                "minX": self.html.$slider.offset().left, // Minimal X
                "maxX": self.html.$slider.offset().left + self.html.$slider.width(), // Max X
            };
            self.state.buffer = (self.state.maxX - self.state.minX) / self.options.points.length * 0.2;
			//console.log(self.state);

            // Points
            if(self.options.points) {
                var point = false;
                for(var i = 0; i < self.options.points.length; i++) {
                    point = self.options.points[i];
                    point["posX"] = parseInt(point.pos) / 100 * self.html.$slider.width();
                    point["index"] = i;
                }
            }
            //console.log(self.options);

            self.build();
            self.actions();
            self.sync();
            
            self.html.$slider.data("gcslider", self);
        }
        
        self.trigger = function(action) {
	        switch(action) {
		        case "update":
		        	
		        	if(self.html.$inputFrom.val() != self.state.left.value) {
			        	for(var i = 0; i < self.options.points.length; i++) {
				        	if(self.options.points[i].value == self.html.$inputFrom.val()) {
					        	self.state.left = self.options.points[i];
					        	break;
				        	}
			        	}
		        	}
		        	self.setValue(self.html.$dotLeft, self.state.left, false);
		        	
		        	if(self.html.$inputTo.val() != self.state.right.value) {
			        	for(var i = 0; i < self.options.points.length; i++) {
				        	if(self.options.points[i].value == self.html.$inputTo.val()) {
					        	self.state.right = self.options.points[i];
					        	break;
				        	}
			        	}
		        	}
		        	self.setValue(self.html.$dotRight, self.state.right, false);
		        	
		        break;
		        
		        
				
				case "reset":
					
					self.setValue(self.html.$dotLeft, self.options.points[0], false);
					self.setValue(self.html.$dotRight, self.options.points[self.options.points.length - 1], false);
					self.sync();
					
				break;
	        }
        }

        self.build = function() {
            // Add input values

            self.html.$slider.append(
                '<input type="hidden" class="form-item form-item--hidden form-item--range" name="' + self.options.name + '_min" value="' + self.options.points[0].value + '" />' + 
                '<input type="hidden" class="form-item form-item--hidden form-item--range" name="' + self.options.name + '_max" value="' + self.options.points[self.options.points.length - 1].value + '" />'
            );
            self.html.$inputFrom = self.html.$slider.find("input:hidden[name*=min]");
            self.html.$inputTo = self.html.$slider.find("input:hidden[name*=max]");

            // Add dots
            self.html.$slider.append(
                '<div class="gc-slider-line">' + 
                    '<div data-left="true" class="gc-slider-line-dot gc-slider-line-dot--left"></div>' + 
                    '<div data-right="true" class="gc-slider-line-dot gc-slider-line-dot--right"></div>' + 
                '</div>'
            );
            self.html.$dots = self.html.$slider.find(".gc-slider-line-dot");
            self.html.$dotLeft = self.html.$slider.find(".gc-slider-line-dot--left");
            self.html.$dotRight = self.html.$slider.find(".gc-slider-line-dot--right");
            
            //console.log(self.options);
            if(self.options.curLeft !== undefined) {
                self.setValue(self.html.$dotLeft, self.options.points[self.options.curLeft]);
            }
            if(self.options.curRight !== undefined) {
                self.setValue(self.html.$dotRight, self.options.points[self.options.curRight]);
            }

            // Add marks
            var sliderPoints = '<div class="gc-slider-points">',
                point = false;
            for(var i = 0; i < self.options.points.length; i++) {
                point = self.options.points[i];
                sliderPoints += '<div data-info=\'{"index": "' + i + '", "posX": "' + point.posX + '"}\' style="left: ' + point.pos + '" data-value="' + point.value + '" class="gc-slider-point-item">' + point.title + '</div>';
            }
            sliderPoints += '</div>';
            self.html.$slider.append(sliderPoints);
            self.html.$points = self.html.$slider.find(".gc-slider-point-item");
			
			
        }

        self.actions = function() {

            var $selected = false;

            // Moveing dot
            self.html.$dots.on("mousedown touchstart", function(e) {
                $selected = $(this);
                $selected.addClass(self.options.draggableClass);

                var selectedWidth = $selected.outerWidth(),
                    selectedPos = parseInt($selected.css("left")) + selectedWidth - e.pageX;
                $(document).on("mousemove touchmove", function(e) {
                    var currentPos = ((e.type == "touchmove") ? e.originalEvent.touches[0].pageX : e.pageX) - self.state.minX;
//console.log(currentPos);
                    // Adge positions
                    if(currentPos <= self.state.min) {
                        currentPos = self.state.min;
                    } else if(currentPos >= self.state.max) {
                        currentPos = self.state.max;
                    }
                    
                    // Temporary fixing
                    self.setTempValue($selected, currentPos);
 
                    // Fixing position
                    var point = false;
                    for(var i = 0; i < self.options.points.length; i++) {
                        point = self.options.points[i];
                        if((currentPos + self.state.buffer >= point.posX) && (currentPos - self.state.buffer <= point.posX)) {
                            self.setValue($selected, point);
                        }
                    }
                }).on("mouseup touchend", function() {
	                //console.log("fuck");
                    $(this).off("mousemove touchmove"); // Unbind events from document
	                if($selected) {
						self.stopDrag($selected);
	                    $selected = null;
	                }
                });
                e.preventDefault(); // disable selection
            }).on("mouseup touchend", function() {
	            //console.log("fuck");
                if($selected) {
					self.stopDrag($selected);
                    $selected = null;
                }
            });
            
            
            // Dot click
            self.html.$points.on("click", function(e) {
	            var $point = $(this),
	            	info = $point.data("info");
	            
	            // Check right or left dot
	            var dl = Math.abs(self.state.left.index - info.index),
	            	dr = Math.abs(self.state.right.index - info.index),
	            	dot = false;
	            
	            //console.log(dl, dr);
	            
	            // Click on the current pos or one step difference
	            if((dl == 0 || dr == 0)) {
		            return false;
		            
		        // One difference
	            } else if(dl == dr) {
		            dot = "$" + ((self.state.prevAction) ? self.state.prevAction : "dotLeft");
		            
		        // More nearest
	            } else {
		            dot = (dl < dr ? "$dotLeft" : "$dotRight");
	            }
	            
	            //console.log(self.html[dot], info);
	            
	            self.setValue(self.html[dot], self.options.points[info.index], true);
	            self.sync();
	            
	            e.preventDefault(); 
            });
            
        },
        
        self.stopDrag = function($selected) {
	        $selected.removeClass(self.options.draggableClass);
	        self.clearTempValue($selected);
	        self.sync();
        }
        
        self.setTempValue = function($dot, posX) {
             $dot.css("left", posX);
        },

        self.clearTempValue = function($dot) {
            var dotType = ($dot.data("left") ? "left" : "right");
            if(self.state[dotType].posX != $dot.css("left")) {
                $dot.css("left", self.state[dotType].posX);
            }
        }

        self.setValue = function($dot, point, animation = false) {
            // Check position
            if(
                ($dot.data("left") && self.state.right && point.posX >= self.state.right.posX) ||
                ($dot.data("right") && self.state.left && point.posX <= self.state.left.posX)
            ) {
	            //console.log("bad position");
                return false;
            }
            
            self.state.prevAction = ($dot.data("left") ? "dotLeft" : "dotRight");
			
			//console.log(point.posX);
            if(animation) {
	            $dot.addClass("animation");
				setTimeout(function() {
					$dot.removeClass("animation");
				}, 500);
            }
            $dot.css({
                left: parseInt(point.posX) + "px"
            });
            
            if($dot.data("left")) {
                self.state.left = point;
            } else {
                self.state.right = point;
            }
            
        }

        self.sync = function() {
            self.html.$inputFrom.val(self.state.left.value);
            self.html.$inputTo.val(self.state.right.value);

            self.html.$inputFrom.trigger("change");
            self.options.onChange([self.state.left.value, self.state.right.value]);

        }
    }

    $.fn.gcSlider = function(options) {
	    var slider, $slider;	    
        $(this).each(function() {
            $slider = $(this);
		    if(!$slider.data("gcslider")) {
				slider = new gcSlider($slider, options);
				slider.init();
		    } else {
			    $slider.data("gcslider").trigger(options);
		    }
        });
    };

})(jQuery);
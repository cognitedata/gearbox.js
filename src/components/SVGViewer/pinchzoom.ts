// Copyright 2021 Cognite AS

// @ts-nocheck
/* eslint-disable */

const definePinchZoom = function() {
  /**
   * Pinch zoom
   * @param el
   * @param options
   * @constructor
   */
  const PinchZoom = function(el, options) {
      this.el = el;
      this.zoomFactor = 1;
      this.lastScale = 1;
      this.offset = {
        x: 0,
        y: 0,
      };
      this.initialOffset = {
        x: 0,
        y: 0,
      };
      this.options = Object.assign({}, this.defaults, options);
      this.setupMarkup();
      this.bindEvents();
      this.update();

      // The image may already be loaded when PinchZoom is initialized,
      // and then the load event (which trigger update) will never fire.
      if (this.isImageLoaded(this.el)) {
        this.updateAspectRatio();
        this.setupOffsets();
      }

      this.enable();
    },
    sum = function(a, b) {
      return a + b;
    },
    isCloseTo = function(value, expected) {
      return value > expected - 0.01 && value < expected + 0.01;
    };

  PinchZoom.prototype = {
    defaults: {
      tapZoomFactor: 2,
      zoomOutFactor: 1.3,
      animationDuration: 300,
      maxZoom: 4,
      minZoom: 0.5,
      draggableUnzoomed: true,
      lockDragAxis: false,
      setOffsetsOnce: false,
      use2d: true,
      verticalPadding: 0,
      horizontalPadding: 0,
      onZoomStart: null,
      onZoomEnd: null,
      onZoomUpdate: null,
      onDragStart: null,
      onDragEnd: null,
      onDragUpdate: null,
      onDoubleTap: null,
    },

    /**
     * Event handler for 'dragstart'
     * @param event
     */
    handleDragStart: function(event) {
      if (typeof this.options.onDragStart == 'function') {
        this.options.onDragStart(this, event);
      }
      this.stopAnimation();
      this.lastDragPosition = false;
      this.hasInteraction = true;
      this.handleDrag(event);
    },

    /**
     * Event handler for 'drag'
     * @param event
     */
    handleDrag: function(event) {
      const touch = this.getTouches(event)[0];
      this.drag(touch, this.lastDragPosition);
      this.offset = this.sanitizeOffset(this.offset);
      this.lastDragPosition = touch;
    },

    handleDragEnd: function() {
      if (typeof this.options.onDragEnd == 'function') {
        this.options.onDragEnd(this, event);
      }
      this.end();
    },

    /**
     * Event handler for 'zoomstart'
     * @param event
     */
    handleZoomStart: function(event) {
      if (typeof this.options.onZoomStart == 'function') {
        this.options.onZoomStart(this, event);
      }
      this.stopAnimation();
      this.lastScale = 1;
      this.nthZoom = 0;
      this.lastZoomCenter = false;
      this.hasInteraction = true;
    },

    /**
     * Event handler for 'zoom'
     * @param event
     * @param newScale
     */
    handleZoom: function(event, newScale) {
      // a relative scale factor is used
      const touchCenter = this.getTouchCenter(this.getTouches(event)),
        scale = newScale / this.lastScale;
      this.lastScale = newScale;

      // the first touch events are thrown away since they are not precise
      this.nthZoom += 1;
      if (this.nthZoom > 3) {
        this.scale(scale, touchCenter);
        this.drag(touchCenter, this.lastZoomCenter);
      }
      this.lastZoomCenter = touchCenter;
    },

    handleZoomEnd: function() {
      if (typeof this.options.onZoomEnd == 'function') {
        this.options.onZoomEnd(this, event);
      }
      this.end();
    },

    /**
     * Event handler for 'doubletap'
     * @param event
     */
    handleDoubleTap: function(event) {
      let center = this.getTouches(event)[0],
        zoomFactor = this.zoomFactor > 1 ? 1 : this.options.tapZoomFactor,
        startZoomFactor = this.zoomFactor,
        updateProgress = function(progress) {
          this.scaleTo(
            startZoomFactor + progress * (zoomFactor - startZoomFactor),
            center
          );
        }.bind(this);

      if (this.hasInteraction) {
        return;
      }

      this.isDoubleTap = true;

      if (startZoomFactor > zoomFactor) {
        center = this.getCurrentZoomCenter();
      }

      this.animate(this.options.animationDuration, updateProgress, this.swing);
      if (typeof this.options.onDoubleTap == 'function') {
        this.options.onDoubleTap(this, event);
      }
    },

    /**
     * Compute the initial offset
     *
     * the element should be centered in the container upon initialization
     */
    computeInitialOffset: function() {
      this.initialOffset = {
        x:
          -Math.abs(
            this.el.offsetWidth * this.getInitialZoomFactor() -
              this.container.offsetWidth
          ) / 2,
        y:
          -Math.abs(
            this.el.offsetHeight * this.getInitialZoomFactor() -
              this.container.offsetHeight
          ) / 2,
      };
    },

    /**
     * Reset current image offset to that of the initial offset
     */
    resetOffset: function() {
      this.offset.x = this.initialOffset.x;
      this.offset.y = this.initialOffset.y;
    },

    /**
     * Determine if image is loaded
     */
    isImageLoaded: function(el) {
      if (el.nodeName === 'IMG') {
        return el.complete && el.naturalHeight !== 0;
      } else {
        return Array.from(el.querySelectorAll('img')).every(this.isImageLoaded);
      }
    },

    setupOffsets: function() {
      if (this.options.setOffsetsOnce && this._isOffsetsSet) {
        return;
      }

      this._isOffsetsSet = true;

      this.computeInitialOffset();
      this.resetOffset();
    },

    /**
     * Max / min values for the offset
     * @param offset
     * @return {Object} the sanitized offset
     */
    sanitizeOffset: function(offset) {
      const elWidth =
        this.el.offsetWidth * this.getInitialZoomFactor() * this.zoomFactor;
      const elHeight =
        this.el.offsetHeight * this.getInitialZoomFactor() * this.zoomFactor;
      const maxX =
          elWidth - this.getContainerX() + this.options.horizontalPadding,
        maxY = elHeight - this.getContainerY() + this.options.verticalPadding,
        maxOffsetX = Math.max(maxX, 0),
        maxOffsetY = Math.max(maxY, 0),
        minOffsetX = Math.min(maxX, 0) - this.options.horizontalPadding,
        minOffsetY = Math.min(maxY, 0) - this.options.verticalPadding;

      return {
        x: Math.min(Math.max(offset.x, minOffsetX), maxOffsetX),
        y: Math.min(Math.max(offset.y, minOffsetY), maxOffsetY),
      };
    },

    /**
     * Scale to a specific zoom factor (not relative)
     * @param zoomFactor
     * @param center
     */
    scaleTo: function(zoomFactor, center) {
      this.scale(zoomFactor / this.zoomFactor, center);
    },

    /**
     * Scales the element from specified center
     * @param scale
     * @param center
     */
    scale: function(scale, center) {
      scale = this.scaleZoomFactor(scale);
      this.addOffset({
        x: (scale - 1) * (center.x + this.offset.x),
        y: (scale - 1) * (center.y + this.offset.y),
      });
      if (typeof this.options.onZoomUpdate == 'function') {
        this.options.onZoomUpdate(this, event);
      }
    },

    /**
     * Scales the zoom factor relative to current state
     * @param scale
     * @return the actual scale (can differ because of max min zoom factor)
     */
    scaleZoomFactor: function(scale) {
      const originalZoomFactor = this.zoomFactor;
      this.zoomFactor *= scale;
      this.zoomFactor = Math.min(
        this.options.maxZoom,
        Math.max(this.zoomFactor, this.options.minZoom)
      );
      return this.zoomFactor / originalZoomFactor;
    },

    /**
     * Determine if the image is in a draggable state
     *
     * When the image can be dragged, the drag event is acted upon and cancelled.
     * When not draggable, the drag event bubbles through this component.
     *
     * @return {Boolean}
     */
    canDrag: function() {
      return this.options.draggableUnzoomed || !isCloseTo(this.zoomFactor, 1);
    },

    /**
     * Drags the element
     * @param center
     * @param lastCenter
     */
    drag: function(center, lastCenter) {
      if (lastCenter) {
        if (this.options.lockDragAxis) {
          // lock scroll to position that was changed the most
          if (
            Math.abs(center.x - lastCenter.x) >
            Math.abs(center.y - lastCenter.y)
          ) {
            this.addOffset({
              x: -(center.x - lastCenter.x),
              y: 0,
            });
          } else {
            this.addOffset({
              y: -(center.y - lastCenter.y),
              x: 0,
            });
          }
        } else {
          this.addOffset({
            y: -(center.y - lastCenter.y),
            x: -(center.x - lastCenter.x),
          });
        }
        if (typeof this.options.onDragUpdate == 'function') {
          this.options.onDragUpdate(this, event);
        }
      }
    },

    /**
     * Calculates the touch center of multiple touches
     * @param touches
     * @return {Object}
     */
    getTouchCenter: function(touches) {
      return this.getVectorAvg(touches);
    },

    /**
     * Calculates the average of multiple vectors (x, y values)
     */
    getVectorAvg: function(vectors) {
      return {
        x:
          vectors
            .map(function(v) {
              return v.x;
            })
            .reduce(sum) / vectors.length,
        y:
          vectors
            .map(function(v) {
              return v.y;
            })
            .reduce(sum) / vectors.length,
      };
    },

    /**
     * Adds an offset
     * @param offset the offset to add
     * @return return true when the offset change was accepted
     */
    addOffset: function(offset) {
      this.offset = {
        x: this.offset.x + offset.x,
        y: this.offset.y + offset.y,
      };
    },

    sanitize: function() {
      if (this.zoomFactor < this.options.zoomOutFactor) {
        this.zoomOutAnimation();
      } else if (this.isInsaneOffset(this.offset)) {
        this.sanitizeOffsetAnimation();
      }
    },

    /**
     * Checks if the offset is ok with the current zoom factor
     * @param offset
     * @return {Boolean}
     */
    isInsaneOffset: function(offset) {
      const sanitizedOffset = this.sanitizeOffset(offset);
      return sanitizedOffset.x !== offset.x || sanitizedOffset.y !== offset.y;
    },

    /**
     * Creates an animation moving to a sane offset
     */
    sanitizeOffsetAnimation: function() {
      const targetOffset = this.sanitizeOffset(this.offset),
        startOffset = {
          x: this.offset.x,
          y: this.offset.y,
        },
        updateProgress = function(progress) {
          this.offset.x =
            startOffset.x + progress * (targetOffset.x - startOffset.x);
          this.offset.y =
            startOffset.y + progress * (targetOffset.y - startOffset.y);
          this.update();
        }.bind(this);

      this.animate(this.options.animationDuration, updateProgress, this.swing);
    },

    /**
     * Zooms back to the original position,
     * (no offset and zoom factor 1)
     */
    zoomOutAnimation: function() {
      if (this.zoomFactor === 1) {
        return;
      }

      const startZoomFactor = this.zoomFactor,
        zoomFactor = 1,
        center = this.getCurrentZoomCenter(),
        updateProgress = function(progress) {
          this.scaleTo(
            startZoomFactor + progress * (zoomFactor - startZoomFactor),
            center
          );
        }.bind(this);

      this.animate(this.options.animationDuration, updateProgress, this.swing);
    },

    /**
     * Updates the container aspect ratio
     *
     * Any previous container height must be cleared before re-measuring the
     * parent height, since it depends implicitly on the height of any of its children
     */
    updateAspectRatio: function() {
      this.unsetContainerY();
      this.setContainerY(this.container.parentElement.offsetHeight);
    },

    /**
     * Calculates the initial zoom factor (for the element to fit into the container)
     * @return {number} the initial zoom factor
     */
    getInitialZoomFactor: function() {
      const xZoomFactor = this.container.offsetWidth / this.el.offsetWidth;
      const yZoomFactor = this.container.offsetHeight / this.el.offsetHeight;

      return Math.min(xZoomFactor, yZoomFactor);
    },

    /**
     * Calculates the aspect ratio of the element
     * @return the aspect ratio
     */
    getAspectRatio: function() {
      return this.el.offsetWidth / this.el.offsetHeight;
    },

    /**
     * Calculates the virtual zoom center for the current offset and zoom factor
     * (used for reverse zoom)
     * @return {Object} the current zoom center
     */
    getCurrentZoomCenter: function() {
      const offsetLeft = this.offset.x - this.initialOffset.x;
      const centerX =
        -1 * this.offset.x - offsetLeft / (1 / this.zoomFactor - 1);

      const offsetTop = this.offset.y - this.initialOffset.y;
      const centerY =
        -1 * this.offset.y - offsetTop / (1 / this.zoomFactor - 1);

      return {
        x: centerX,
        y: centerY,
      };
    },

    /**
     * Returns the touches of an event relative to the container offset
     * @param event
     * @return array touches
     */
    getTouches: function(event) {
      const rect = this.container.getBoundingClientRect();
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollLeft =
        document.documentElement.scrollLeft || document.body.scrollLeft;
      const posTop = rect.top + scrollTop;
      const posLeft = rect.left + scrollLeft;

      return Array.prototype.slice.call(event.touches).map(function(touch) {
        return {
          x: touch.pageX - posLeft,
          y: touch.pageY - posTop,
        };
      });
    },

    /**
     * Animation loop
     * does not support simultaneous animations
     * @param duration
     * @param framefn
     * @param timefn
     * @param callback
     */
    animate: function(duration, framefn, timefn, callback) {
      var startTime = Date.now(),
        renderFrame = function() {
          if (!this.inAnimation) {
            return;
          }
          let frameTime = Date.now() - startTime,
            progress = frameTime / duration;
          if (frameTime >= duration) {
            framefn(1);
            if (callback) {
              callback();
            }
            this.update();
            this.stopAnimation();
            this.update();
          } else {
            if (timefn) {
              progress = timefn(progress);
            }
            framefn(progress);
            this.update();
            requestAnimationFrame(renderFrame);
          }
        }.bind(this);
      this.inAnimation = true;
      requestAnimationFrame(renderFrame);
    },

    /**
     * Stops the animation
     */
    stopAnimation: function() {
      this.inAnimation = false;
    },

    /**
     * Swing timing function for animations
     * @param p
     * @return {Number}
     */
    swing: function(p) {
      return -Math.cos(p * Math.PI) / 2 + 0.5;
    },

    getContainerX: function() {
      return this.container.offsetWidth;
    },

    getContainerY: function() {
      return this.container.offsetHeight;
    },

    setContainerY: function(y) {
      return (this.container.style.height = y + 'px');
    },

    unsetContainerY: function() {
      this.container.style.height = null;
    },

    /**
     * Creates the expected html structure
     */
    setupMarkup: function() {
      this.container = document.createElement('div');
      this.container.classList.add('pinch-zoom-container');

      this.el.parentNode.insertBefore(this.container, this.el);
      this.container.appendChild(this.el);

      this.container.style.overflow = 'hidden';
      this.container.style.position = 'relative';
      this.container.style.contain = 'strict';

      this.el.style.transformOrigin = '0% 0%';

      this.el.style.position = 'absolute';
    },

    end: function() {
      this.hasInteraction = false;
      this.sanitize();
      this.update();
    },

    /**
     * Binds all required event listeners
     */
    bindEvents: function() {
      const self = this;
      detectGestures(this.container, this);

      window.addEventListener('resize', this.update.bind(this));
      Array.from(this.el.querySelectorAll('img')).forEach(function(imgEl) {
        imgEl.addEventListener('load', self.update.bind(self));
      });

      if (this.el.nodeName === 'IMG') {
        this.el.addEventListener('load', this.update.bind(this));
      }
    },

    /**
     * Updates the css values according to the current zoom factor and offset
     */
    update: function(event) {
      if (event && event.type === 'resize') {
        this.updateAspectRatio();
        this.setupOffsets();
      }

      if (event && event.type === 'load') {
        this.updateAspectRatio();
        this.setupOffsets();
      }

      if (this.updatePlanned) {
        return;
      }
      this.updatePlanned = true;

      window.requestAnimationFrame(
       () => {
         this.updatePlanned = false;

         const zoomFactor = this.getInitialZoomFactor() * this.zoomFactor,
           offsetX = -this.offset.x / zoomFactor,
           offsetY = -this.offset.y / zoomFactor;
         this.el.style.transform = `scale(${zoomFactor}, ${zoomFactor}) translate(${offsetX}px, ${offsetY}px)`;
       }
      );
    },

    /**
     * Enables event handling for gestures
     */
    enable: function() {
      this.enabled = true;
    },

    /**
     * Disables event handling for gestures
     */
    disable: function() {
      this.enabled = false;
    },
  };

  var detectGestures = function(el, target) {
    let interaction = null,
      fingers = 0,
      lastTouchStart = null,
      startTouches = null,
      setInteraction = function(newInteraction, event) {
        if (interaction !== newInteraction) {
          if (interaction && !newInteraction) {
            switch (interaction) {
              case 'zoom':
                target.handleZoomEnd(event);
                break;
              case 'drag':
                target.handleDragEnd(event);
                break;
            }
          }

          switch (newInteraction) {
            case 'zoom':
              target.handleZoomStart(event);
              break;
            case 'drag':
              target.handleDragStart(event);
              break;
          }
        }
        interaction = newInteraction;
      },
      updateInteraction = function(event) {
        if (fingers === 2) {
          setInteraction('zoom');
        } else if (fingers === 1 && target.canDrag()) {
          setInteraction('drag', event);
        } else {
          setInteraction(null, event);
        }
      },
      targetTouches = function(touches) {
        return Array.from(touches).map(function(touch) {
          return {
            x: touch.pageX,
            y: touch.pageY,
          };
        });
      },
      getDistance = function(a, b) {
        let x, y;
        x = a.x - b.x;
        y = a.y - b.y;
        return Math.sqrt(x * x + y * y);
      },
      calculateScale = function(startTouches, endTouches) {
        const startDistance = getDistance(startTouches[0], startTouches[1]),
          endDistance = getDistance(endTouches[0], endTouches[1]);
        return endDistance / startDistance;
      },
      cancelEvent = function(event) {
        event.stopPropagation();
        event.preventDefault();
      },
      detectDoubleTap = function(event) {
        const time = new Date().getTime();

        if (fingers > 1) {
          lastTouchStart = null;
        }

        if (time - lastTouchStart < 300) {
          cancelEvent(event);

          target.handleDoubleTap(event);
          switch (interaction) {
            case 'zoom':
              target.handleZoomEnd(event);
              break;
            case 'drag':
              target.handleDragEnd(event);
              break;
          }
        } else {
          target.isDoubleTap = false;
        }

        if (fingers === 1) {
          lastTouchStart = time;
        }
      },
      firstMove = true;

    el.addEventListener(
      'touchstart',
      function(event) {
        if (target.enabled) {
          firstMove = true;
          fingers = event.touches.length;
          detectDoubleTap(event);
        }
      },
      { passive: false }
    );

    el.addEventListener(
      'touchmove',
      function(event) {
        if (target.enabled && !target.isDoubleTap) {
          if (firstMove) {
            updateInteraction(event);
            if (interaction) {
              cancelEvent(event);
            }
            startTouches = targetTouches(event.touches);
          } else {
            switch (interaction) {
              case 'zoom':
                if (startTouches.length == 2 && event.touches.length == 2) {
                  target.handleZoom(
                    event,
                    calculateScale(startTouches, targetTouches(event.touches))
                  );
                }
                break;
              case 'drag':
                target.handleDrag(event);
                break;
            }
            if (interaction) {
              cancelEvent(event);
              target.update();
            }
          }

          firstMove = false;
        }
      },
      { passive: false }
    );

    el.addEventListener('touchend', function(event) {
      if (target.enabled) {
        fingers = event.touches.length;
        updateInteraction(event);
      }
    });
  };

  return PinchZoom;
};

const PinchZoom = definePinchZoom();

export default PinchZoom;

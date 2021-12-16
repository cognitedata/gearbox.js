// Copyright 2021 Cognite AS

// original code is take from here https://github.com/manuelstofer/pinchzoom
// modified to optimize performance (removed root node cloning, some unused polyfils and vendor prefixes)
// also ported to TS

type Options = {
  tapZoomFactor: number;
  zoomOutFactor: number;
  animationDuration: number;
  maxZoom: number;
  minZoom: number;
  draggableUnzoomed: boolean;
  lockDragAxis: boolean;
  setOffsetsOnce: boolean;
  use2d: boolean;
  verticalPadding: number;
  horizontalPadding: number;
  onZoomStart?: ((...args: any) => unknown) | null;
  onZoomEnd?: ((...args: any) => unknown) | null;
  onZoomUpdate?: ((...args: any) => unknown) | null;
  onDragStart?: ((...args: any) => unknown) | null;
  onDragEnd?: ((...args: any) => unknown) | null;
  onDragUpdate?: ((...args: any) => unknown) | null;
  onDoubleTap?: ((...args: any) => unknown) | null;
};
type Coordinates = { x: number; y: number };
const defaultOptions: Options = {
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
};

export default class PinchZoom {
  // making everything public as it was all public originally and used by SVG viewer
  public el: HTMLElement;
  public container = document.createElement('div');
  public zoomFactor = 1;
  public lastScale = 1;
  public offset = {
    x: 0,
    y: 0,
  };
  public initialOffset = {
    x: 0,
    y: 0,
  };
  public options: Options;
  public isDoubleTap = false;
  public enabled = false;

  private lastDragPosition: Coordinates | null = null;
  private lastZoomCenter: Coordinates | null = null;
  private hasInteraction = false;
  private nthZoom = 0;
  private updatePlanned = false;
  private inAnimation = false;
  private _isOffsetsSet = false;

  constructor(el: HTMLElement, options: Partial<Options>) {
    this.el = el;

    this.options = Object.assign({}, defaultOptions, options);
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
  }

  public isCloseTo(value: number, expected: number) {
    return value > expected - 0.01 && value < expected + 0.01;
  }

  /**
   * Event handler for 'dragstart'
   * @param event
   */
  public handleDragStart(event: TouchEvent) {
    if (typeof this.options.onDragStart == 'function') {
      this.options.onDragStart(this, event);
    }
    this.stopAnimation();
    this.lastDragPosition = null;
    this.hasInteraction = true;
    this.handleDrag(event);
  }

  /**
   * Event handler for 'drag'
   * @param event
   */
  public handleDrag(event: TouchEvent) {
    const touch = this.getTouches(event)[0];
    this.drag(touch, this.lastDragPosition);
    this.offset = this.sanitizeOffset(this.offset);
    this.lastDragPosition = touch;
  }

  public handleDragEnd(event: TouchEvent) {
    if (typeof this.options.onDragEnd == 'function') {
      this.options.onDragEnd(this, event);
    }
    this.end();
  }

  /**
   * Event handler for 'zoomstart'
   * @param event
   */
  public handleZoomStart(event: TouchEvent) {
    if (typeof this.options.onZoomStart == 'function') {
      this.options.onZoomStart(this, event);
    }
    this.stopAnimation();
    this.lastScale = 1;
    this.nthZoom = 0;
    this.lastZoomCenter = null;
    this.hasInteraction = true;
  }

  /**
   * Event handler for 'zoom'
   * @param event
   * @param newScale
   */
  public handleZoom(event: TouchEvent, newScale: number) {
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
  }

  public handleZoomEnd(event: TouchEvent) {
    if (typeof this.options.onZoomEnd == 'function') {
      this.options.onZoomEnd(this, event);
    }
    this.end();
  }

  /**
   * Event handler for 'doubletap'
   * @param event
   */
  public handleDoubleTap(event: TouchEvent) {
    let center = this.getTouches(event)[0];
    const zoomFactor = this.zoomFactor > 1 ? 1 : this.options.tapZoomFactor;
    const startZoomFactor = this.zoomFactor;

    const updateProgress = (progress: number) => {
      this.scaleTo(
        startZoomFactor + progress * (zoomFactor - startZoomFactor),
        center
      );
    };

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
  }

  /**
   * Compute the initial offset
   *
   * the element should be centered in the container upon initialization
   */
  public computeInitialOffset() {
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
  }

  /**
   * Reset current image offset to that of the initial offset
   */
  public resetOffset() {
    this.offset.x = this.initialOffset.x;
    this.offset.y = this.initialOffset.y;
  }

  /**
   * Determine if image is loaded
   */
  public isImageLoaded(el: HTMLElement) {
    if (el.nodeName === 'IMG') {
      const imageEl = el as HTMLImageElement;
      return imageEl.complete && imageEl.naturalHeight !== 0;
    } else {
      return Array.from(el.querySelectorAll('img')).every(this.isImageLoaded);
    }
  }

  public setupOffsets() {
    if (this.options.setOffsetsOnce && this._isOffsetsSet) {
      return;
    }

    this._isOffsetsSet = true;

    this.computeInitialOffset();
    this.resetOffset();
  }

  /**
   * Max / min values for the offset
   * @param offset
   * @return {Object} the sanitized offset
   */
  public sanitizeOffset(offset: Coordinates) {
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
  }

  /**
   * Scale to a specific zoom factor (not relative)
   * @param zoomFactor
   * @param center
   */
  public scaleTo(zoomFactor: number, center: Coordinates) {
    this.scale(zoomFactor / this.zoomFactor, center);
  }

  /**
   * Scales the element from specified center
   * @param scale
   * @param center
   */
  public scale(scale: number, center: Coordinates) {
    scale = this.scaleZoomFactor(scale);
    this.addOffset({
      x: (scale - 1) * (center.x + this.offset.x),
      y: (scale - 1) * (center.y + this.offset.y),
    });
    if (typeof this.options.onZoomUpdate == 'function') {
      this.options.onZoomUpdate(this, event);
    }
  }

  /**
   * Scales the zoom factor relative to current state
   * @param scale
   * @return the actual scale (can differ because of max min zoom factor)
   */
  public scaleZoomFactor(scale: number) {
    const originalZoomFactor = this.zoomFactor;
    this.zoomFactor *= scale;
    this.zoomFactor = Math.min(
      this.options.maxZoom,
      Math.max(this.zoomFactor, this.options.minZoom)
    );
    return this.zoomFactor / originalZoomFactor;
  }

  /**
   * Determine if the image is in a draggable state
   *
   * When the image can be dragged, the drag event is acted upon and cancelled.
   * When not draggable, the drag event bubbles through this component.
   *
   * @return {Boolean}
   */
  public canDrag() {
    return (
      this.options.draggableUnzoomed || !this.isCloseTo(this.zoomFactor, 1)
    );
  }

  /**
   * Drags the element
   * @param center
   * @param lastCenter
   */
  public drag(center: Coordinates, lastCenter: Coordinates | null) {
    if (lastCenter) {
      if (this.options.lockDragAxis) {
        // lock scroll to position that was changed the most
        if (
          Math.abs(center.x - lastCenter.x) > Math.abs(center.y - lastCenter.y)
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
  }

  /**
   * Calculates the touch center of multiple touches
   * @param touches
   * @return {Object}
   */
  public getTouchCenter(touches: Coordinates[]) {
    return this.getVectorAvg(touches);
  }

  /**
   * Calculates the average of multiple vectors (x, y values)
   */
  public getVectorAvg(vectors: Coordinates[]) {
    const sum = (a: number, b: number) => {
      return a + b;
    };
    return {
      x: vectors.map(v => v.x).reduce(sum) / vectors.length,
      y: vectors.map(v => v.y).reduce(sum) / vectors.length,
    };
  }

  /**
   * Adds an offset
   * @param offset the offset to add
   * @return return true when the offset change was accepted
   */
  public addOffset(offset: Coordinates) {
    this.offset = {
      x: this.offset.x + offset.x,
      y: this.offset.y + offset.y,
    };
  }

  public sanitize() {
    if (this.zoomFactor < this.options.zoomOutFactor) {
      this.zoomOutAnimation();
    } else if (this.isInsaneOffset(this.offset)) {
      this.sanitizeOffsetAnimation();
    }
  }

  /**
   * Checks if the offset is ok with the current zoom factor
   * @param offset
   * @return {Boolean}
   */
  public isInsaneOffset(offset: Coordinates) {
    const sanitizedOffset = this.sanitizeOffset(offset);
    return sanitizedOffset.x !== offset.x || sanitizedOffset.y !== offset.y;
  }

  /**
   * Creates an animation moving to a sane offset
   */
  public sanitizeOffsetAnimation() {
    const targetOffset = this.sanitizeOffset(this.offset);
    const startOffset = {
      x: this.offset.x,
      y: this.offset.y,
    };
    const updateProgress = (progress: number) => {
      this.offset.x =
        startOffset.x + progress * (targetOffset.x - startOffset.x);
      this.offset.y =
        startOffset.y + progress * (targetOffset.y - startOffset.y);
      this.update();
    };

    this.animate(
      this.options.animationDuration,
      updateProgress.bind(this),
      this.swing
    );
  }

  /**
   * Zooms back to the original position,
   * (no offset and zoom factor 1)
   */
  public zoomOutAnimation() {
    if (this.zoomFactor === 1) {
      return;
    }

    const startZoomFactor = this.zoomFactor;
    const zoomFactor = 1;
    const center = this.getCurrentZoomCenter();
    const updateProgress = (progress: number) => {
      this.scaleTo(
        startZoomFactor + progress * (zoomFactor - startZoomFactor),
        center
      );
    };

    this.animate(
      this.options.animationDuration,
      updateProgress.bind(this),
      this.swing
    );
  }

  /**
   * Updates the container aspect ratio
   *
   * Any previous container height must be cleared before re-measuring the
   * parent height, since it depends implicitly on the height of any of its children
   */
  public updateAspectRatio() {
    this.unsetContainerY();
    if (this.container.parentElement) {
      this.setContainerY(this.container.parentElement.offsetHeight);
    }
  }

  /**
   * Calculates the initial zoom factor (for the element to fit into the container)
   * @return {number} the initial zoom factor
   */
  public getInitialZoomFactor() {
    const xZoomFactor = this.container.offsetWidth / this.el.offsetWidth;
    const yZoomFactor = this.container.offsetHeight / this.el.offsetHeight;

    return Math.min(xZoomFactor, yZoomFactor);
  }

  /**
   * Calculates the aspect ratio of the element
   * @return the aspect ratio
   */
  public getAspectRatio() {
    return this.el.offsetWidth / this.el.offsetHeight;
  }

  /**
   * Calculates the virtual zoom center for the current offset and zoom factor
   * (used for reverse zoom)
   * @return {Object} the current zoom center
   */
  public getCurrentZoomCenter() {
    const offsetLeft = this.offset.x - this.initialOffset.x;
    const centerX = -1 * this.offset.x - offsetLeft / (1 / this.zoomFactor - 1);

    const offsetTop = this.offset.y - this.initialOffset.y;
    const centerY = -1 * this.offset.y - offsetTop / (1 / this.zoomFactor - 1);

    return {
      x: centerX,
      y: centerY,
    };
  }

  /**
   * Returns the touches of an event relative to the container offset
   * @param event
   * @return array touches
   */
  public getTouches(event: TouchEvent): Coordinates[] {
    const rect = this.container.getBoundingClientRect();
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollLeft =
      document.documentElement.scrollLeft || document.body.scrollLeft;
    const posTop = rect.top + scrollTop;
    const posLeft = rect.left + scrollLeft;

    return Array.prototype.map.call(event.touches, touch => {
      return {
        x: touch.pageX - posLeft,
        y: touch.pageY - posTop,
      };
    }) as Coordinates[];
  }

  /**
   * Animation loop
   * does not support simultaneous animations
   * @param duration
   * @param framefn
   * @param timefn
   * @param callback
   */
  public animate(
    duration: number,
    framefn: (progress: number) => unknown,
    timefn: (progress: number) => number,
    callback?: () => unknown
  ) {
    const startTime = Date.now();
    const renderFrame = () => {
      if (!this.inAnimation) {
        return;
      }
      const frameTime = Date.now() - startTime;
      let progress: number = frameTime / duration;
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
    };
    this.inAnimation = true;
    requestAnimationFrame(renderFrame);
  }

  /**
   * Stops the animation
   */
  public stopAnimation() {
    this.inAnimation = false;
  }

  /**
   * Swing timing function for animations
   * @param p
   * @return {Number}
   */
  public swing(p: number) {
    return -Math.cos(p * Math.PI) / 2 + 0.5;
  }

  public getContainerX() {
    return this.container.offsetWidth;
  }

  public getContainerY() {
    return this.container.offsetHeight;
  }

  public setContainerY(y: number) {
    return (this.container.style.height = y + 'px');
  }

  public unsetContainerY() {
    this.container.style.removeProperty('height');
  }

  /**
   * Creates the expected html structure
   */
  public setupMarkup() {
    this.container.classList.add('pinch-zoom-container');

    if (this.el.parentNode) {
      this.el.parentNode.insertBefore(this.container, this.el);
    }
    this.container.appendChild(this.el);

    this.container.style.overflow = 'hidden';
    this.container.style.position = 'relative';

    this.el.style.transformOrigin = '0% 0%';

    this.el.style.position = 'absolute';
  }

  public end() {
    this.hasInteraction = false;
    this.sanitize();
    this.update();
  }

  /**
   * Binds all required event listeners
   */
  public bindEvents() {
    this.detectGestures();

    window.addEventListener('resize', this.update.bind(this));
    Array.from(this.el.querySelectorAll('img')).forEach(imgEl => {
      imgEl.addEventListener('load', this.update.bind(this));
    });

    if (this.el.nodeName === 'IMG') {
      this.el.addEventListener('load', this.update.bind(this));
    }
  }

  /**
   * Updates the css values according to the current zoom factor and offset
   */
  public update(event?: Event) {
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

    window.requestAnimationFrame(() => {
      this.updatePlanned = false;

      const zoomFactor = this.getInitialZoomFactor() * this.zoomFactor,
        offsetX = -this.offset.x / zoomFactor,
        offsetY = -this.offset.y / zoomFactor;
      this.el.style.transform = `scale(${zoomFactor}, ${zoomFactor}) translate(${offsetX}px, ${offsetY}px)`;
    });
  }

  /**
   * Enables event handling for gestures
   */
  public enable() {
    this.enabled = true;
  }

  /**
   * Disables event handling for gestures
   */
  public disable() {
    this.enabled = false;
  }

  private detectGestures() {
    let interaction: string | null = null;
    let fingers = 0;
    let lastTouchStart: number = 0;
    let startTouches: Coordinates[] | null = null;
    const setInteraction = (
      newInteraction: string | null,
      event: TouchEvent
    ) => {
      if (interaction !== newInteraction) {
        if (interaction && !newInteraction) {
          switch (interaction) {
            case 'zoom':
              this.handleZoomEnd(event);
              break;
            case 'drag':
              this.handleDragEnd(event);
              break;
          }
        }

        switch (newInteraction) {
          case 'zoom':
            this.handleZoomStart(event);
            break;
          case 'drag':
            this.handleDragStart(event);
            break;
        }
      }
      interaction = newInteraction;
    };
    const updateInteraction = (event: TouchEvent) => {
      if (fingers === 2) {
        setInteraction('zoom', event);
      } else if (fingers === 1 && this.canDrag()) {
        setInteraction('drag', event);
      } else {
        setInteraction(null, event);
      }
    };
    const targetTouches = (touches: TouchList): Coordinates[] => {
      return Array.prototype.map.call(touches, touch => {
        return {
          x: touch.pageX,
          y: touch.pageY,
        };
      }) as Coordinates[];
    };
    const getDistance = (a: Coordinates, b: Coordinates) => {
      const x = a.x - b.x;
      const y = a.y - b.y;
      return Math.sqrt(x * x + y * y);
    };
    const calculateScale = (
      startTouches: Coordinates[],
      endTouches: Coordinates[]
    ) => {
      const startDistance = getDistance(startTouches[0], startTouches[1]);
      const endDistance = getDistance(endTouches[0], endTouches[1]);
      return endDistance / startDistance;
    };
    const cancelEvent = (event: TouchEvent) => {
      event.stopPropagation();
      event.preventDefault();
    };
    const detectDoubleTap = (event: TouchEvent) => {
      const time = Date.now();

      if (fingers > 1) {
        lastTouchStart = 0;
      }

      if (time - lastTouchStart < 300) {
        cancelEvent(event);

        this.handleDoubleTap(event);
        switch (interaction) {
          case 'zoom':
            this.handleZoomEnd(event);
            break;
          case 'drag':
            this.handleDragEnd(event);
            break;
        }
      } else {
        this.isDoubleTap = false;
      }

      if (fingers === 1) {
        lastTouchStart = time;
      }
    };
    let firstMove = true;

    const handleTouchStart = (event: TouchEvent) => {
      if (this.enabled) {
        firstMove = true;
        fingers = event.touches.length;
        detectDoubleTap(event);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (this.enabled && !this.isDoubleTap) {
        if (firstMove) {
          updateInteraction(event);
          if (interaction) {
            cancelEvent(event);
          }
          startTouches = targetTouches(event.touches);
        } else {
          switch (interaction) {
            case 'zoom':
              if (
                startTouches &&
                startTouches.length == 2 &&
                event.touches.length == 2
              ) {
                this.handleZoom(
                  event,
                  calculateScale(startTouches, targetTouches(event.touches))
                );
              }
              break;
            case 'drag':
              this.handleDrag(event);
              break;
          }
          if (interaction) {
            cancelEvent(event);
            this.update();
          }
        }

        firstMove = false;
      }
    };
    const handleTouchEnd = (event: TouchEvent) => {
      if (this.enabled) {
        fingers = event.touches.length;
        updateInteraction(event);
      }
    };

    this.container.addEventListener('touchstart', handleTouchStart.bind(this), {
      passive: false,
    });

    this.container.addEventListener('touchmove', handleTouchMove.bind(this), {
      passive: false,
    });

    this.container.addEventListener('touchend', handleTouchEnd.bind(this));
  }
}

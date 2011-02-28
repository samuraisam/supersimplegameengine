/**
 * animate.js
 *
 * Performs basic animation
 **/

var animations = {
  _meta: {},
  _queuedAnimations: {},
  _queue: [],
  callbacks: {}
}

function initAnimations() { 
  animations._meta = {
    totalTime: 0,
    totalFrames: 0,
    updateTime: 0,
    updateFrames: 0,
    lastCycle: (new Date()).getTime(),
    cycleDelta: 0,
    drawFramerate: true,
    framerateCell: document.getElementById('framerate'),
    animating: true,
    fps: 30
  }
}

function startAnimating() {
  if (!animations._meta.animating) {
    initAnimations()
    animations._meta.animating = true
    animate()
  }
}

function stopAnimating() {
  animations._meta.animating = false;
}

function animate() {
  var a = animations._meta
  var now = (new Date()).getTime()
  a.delta = now - a.lastCycle
  a.lastCycle = now
  a.totalTime += a.delta
  a.totalFrames += 1
  a.updateTime += a.delta
  a.updateFrames += 1
  if (a.drawFramerate && a.updateTime >= 1000) {
    a.framerateCell.innerHTML = (
      'FPS (avg): ' + Math.floor((1000 * a.totalFrames / a.totalTime)) + ' ' + 
      'FPS (cur): ' + Math.floor((1000 * a.updateFrames / a.updateTime)))
    a.updateTime = a.updateFrames = 0
  }
  if (a.animating) {
    runAnimationQueue(now)
    setTimeout(animate, 5)
  }
}

function runAnimationQueue(now) {
  var a, shouldAnimate, _delta;
  for (var i = 0; i < animations._queue.length; i++) {
    a = animations._queuedAnimations[animations._queue[i]]
    if (!a) continue
    shouldAnimate = false
    if (a.framerate) {
      _delta = now - a.lastCycle
      a.lastCycle = now
      if ((_delta + a.delta) > (1.0/a.framerate*1000)) {
        a.delta = _delta
        shouldAnimate = true
      } else {
        a.delta += _delta
      }
    } else {
      shouldAnimate = true
    }
    if (shouldAnimate)
      a.animate()
  }
}

function enqueueAnimation(id, animation) {
  animations._queuedAnimations[id] = animation
  if (!(id in animations._queue))
    animations._queue.push(id)
}

function dequeueAnimation(id) {
  animations._queuedAnimations[id].destroy()
  animations._queuedAnimations[id] = null
  if (id in animations._queue)
    animations._queue.pop(id)
}

function Animation(framerate) {
  this.framerate = framerate
  this.lastCycle = (new Date()).getTime()
  this.delta = 0
}

Animation.prototype.animate = function() {}
Animation.prototype.destroy = function() {}


function ContextClearingAnimation(size, ctx) {
  this.ctx = ctx
  this.size = size
}
ContextClearingAnimation.prototype = new Animation(0)

ContextClearingAnimation.prototype.animate = function() {
  this.ctx.clearRect(0, 0, this.size.width, this.size.height)
}

ContextClearingAnimation.prototype.destroy = ContextClearingAnimation.prototype.animte

function BaseSpriteAnimation(coords, width, ctx, framerate, filename) {
  this.currentIndex = 0
  this.image = new Image()
  this.image.src = filename
  this.coords = coords
  this.width = width
  this.ctx = ctx
  this.framerate = framerate || this.framerate
}
BaseSpriteAnimation.prototype = new Animation(30)

BaseSpriteAnimation.prototype.animate = function() {
  this.ctx.drawImage(this.image, this.currentIndex * this.width, 0,
    this.width, this.image.height, 
    this.coords.x, this.coords.y, 
    this.width, this.image.height);
  this.currentIndex += 1
  if (this.image.width < this.currentIndex * this.width+1)
    this.currentIndex = 0
}

BaseSpriteAnimation.prototype.destroy = function() {
  this.ctx.clearRect(this.coords.x, this.coords.y, this.image.width, this.image.height)
}

FadeInAnimation = function() {
}

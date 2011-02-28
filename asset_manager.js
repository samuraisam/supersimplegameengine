/**
 * An automated asset manager and loader
 *
 * Call `declareAsset' on any object with an `src' and `onload' 
 * attributes to have them automatically loaded upon launch
 */

var _assets = []
var _loadedAssets = 0

function asset(src, asset) {
  for (var i = 0; i < _assets.length; i++)
    if (_assets[i][0] == src)
      return _assets[i][1]
  _assets.push([src, asset])
  return asset
}

function beginLoadingAssets(doneCallback, progressCallback) {
  for (var i = 0; i < _assets.length; i++) {
    _assets[i][1].onload = function() {
      _loadedAssets += 1
      if (progressCallback)
        progressCallback(_assets.length, _assets.length - _loadedAssets)
      if (_assets.length == _loadedAssets)
        doneCallback()
    }
    _assets[i][1].src = _assets[i][0]
  }
}

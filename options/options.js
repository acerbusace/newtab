$(window).ready(function() {
  $(document).ready(function() {
    console.log('dom loaded...');
  });
});

$('#clearImages').click(function() {
  clearImages(function() {
    console.log('images cleared!!!');
  });
});

function clearImages(callback) {
  chrome.storage.local.set({ images: null }, function() {
    if (typeof(callback) == 'function') callback();
  });
}

$('#toogleTODOs').click(function() {
  console.log('hello world!!!: ' + this.checked);
  toogleTODOs(this.checked, function() {
    console.log('cb done success!!!');
    getSettings(function(data) {
      console.log('set:');
      console.log(data);
    });
  });
});

function toogleTODOs(showTODO, callback) {
  getSettings(function(settings) {
    if (!settings) settings = {};
    settings.showTODO = showTODO;
    chrome.storage.local.set({ settings: settings}, function() {
      if (typeof(callback) == 'function') callback();
    });
  });
}

function getSettings(callback) {
  chrome.storage.local.get(function(data) {
    callback(data.settings);
  });
}

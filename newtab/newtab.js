$('window').ready(function() {
  function getImages(callback) {
    chrome.storage.local.get(function(data) {
      callback(data.images);
    });
  }

  function saveImage(image, callback) {
    getImages(function(images) {
      if (!images) images = [];
      images.push(image);

      chrome.storage.local.set({ images: images }, function() {
        callback();
      });
    });
  }

  function setBg(src) {
    if ($('img')[0]) {
      $fadeOutContainer = $('<div>', { id: 'fadeOutContainer' });
      $img = $('<img>', { src: $('img')[0].src, class: 'background', alt: 'background' });
      $fadeOutContainer.append($img);

      $('#fadeInContainer').style = 'display: none';
      $('img')[0].src = src;

      $('body').append($fadeOutContainer);

      $('#fadeOutContainer').fadeOut(function() {
        $('#fadeOutContainer').remove();
      });

      $('#fadeContainerOne').fadeIn();
    } else {
      $fadeContainer = $('<div>', { id: 'fadeInContainer', style: 'display: none' });
      $img = $('<img>', { src: src, class: 'background', alt: 'background' });
      $fadeContainer.append($img);

      $('body').append($fadeContainer);
      $('#fadeInContainer').fadeIn();
    }
  }

  function displayDropZoneText() {
    console.log('no images found');
    console.log('drop your images here...');

    $textProperty = $('<div>', { class: 'center' });
    $dropZoneText = $('<div>', { class: 'font-effect-fire-animation', text: 'drop your images here' });
    $textProperty.append($dropZoneText);
    $('body').append($textProperty);
  }

  function display() {
    getImg(function(img) {
      $('document').ready(function() {
        // setup the dnd listeners
        var $dropZone = $('<div>', { id: 'drop_zone' });
        $dropZone.on('dragover', handleDragOver);
        $dropZone.on('drop', handleFileSelect);
        $('body').append($dropZone);

        if (img) setBg(img);
        else displayDropZoneText();
      });
    });
  }

  function getImg(callback) {
    getImages(function(images) {
      if (!images) return callback();
      return callback(images[Math.floor(Math.random() * images.length)]);
    });
  }

  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // fileList object
    var files = evt.originalEvent.dataTransfer.files; 

    for (var i = 0; i < files.length; ++i) {

      if (files[i].type.match('image/*')) {
        console.log('loaded ' + files[i].name);

        var reader = new FileReader();

        reader.onload = function(evt){
          saveImage(evt.target.result, function() {
            $('.center').remove();
            setBg(evt.target.result);
          });
        }

        reader.readAsDataURL(files[i]);
      }
    }
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // explicitly show this is a copy
    evt.originalEvent.dataTransfer.dropEffect = 'copy'; 
  }

  (function init() {
    // chrome.storage.local.clear();
    display();
  })();
});

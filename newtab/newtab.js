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

  function saveImages(newImages, callback) {
    getImages(function(images) {
      if (!images) images = [];
      saveimgs = images.concat(newImages);
      console.log(saveimgs);

      chrome.storage.local.set({ 'images': images.concat(newImages) }, function() {
        callback();
      });
    });
  }

  function setBg(src) {
    if ($('img')[0]) {
      $('img').fadeOut(function() {
        $('img')[0].src = src;
        $('img').fadeIn();
      });
    } else {
      $img = $('<img>', { src: src, class: 'background', alt: 'background', style: 'display: none' });

      $('body').append($img);
      $('img').fadeIn();
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
      // console.log(images.length);
      return callback(images[Math.floor(Math.random() * images.length)]);
    });
  }

  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // fileList object
    var files = evt.originalEvent.dataTransfer.files; 
    var imagesLoaded = 0;
    var totalImages = files.length;
    var images = [];

    for (var i = 0; i < files.length; ++i) {

      if (files[i].type.match('image/*')) {
        console.log('loaded ' + files[i].name);

        var reader = new FileReader();

        reader.onload = function(evt){
          images.push(evt.target.result);

          if (++imagesLoaded == totalImages) {
            console.log('loaded all images');
            saveImages(images, function() {
              $('.center').remove();
              setBg(evt.target.result);
            });
          }
        }

        reader.readAsDataURL(files[i]);
      } else --totalImages;
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

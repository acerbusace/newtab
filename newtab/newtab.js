$('document').ready(function() {
  console.log('document loaded...');

  function injectBg(src) {
    $img = $('<img>', { src: src, class: 'background', alt: 'background' });
    $('body').append($img);
    // var img = document.createElement('img');
    // img.src = src;
    // img.className = 'background';
    // img.alt = 'background';

    // document.body.appendChild(img);
  }

  function displayImg(img) {
    // var reader = new FileReader();

    // reader.onload = function(evt){
    //   injectBg(evt.target.result);
    // };

    // reader.readAsDataURL(img);

    injectBg(img);
  }

  function displayDropZoneText() {
    console.log('drop your images here');
  }

  function display() {
    // localStorage.clear();
    item = localStorage.getItem('images');
    if (item === null)
      displayDropZoneText();
    else {
      images = JSON.parse(item)['images'];
      displayImg(images[Math.floor(Math.random() * images.length)]);
    }
  }

  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // fileList object
    var files = evt.originalEvent.dataTransfer.files; 
    console.log(files);
    // for (var i = 0; i < files.length; ++i) {
    //   if (files[i].type.match('image.*')) {
    //     console.log(files[i]);
    //     var reader = new FileReader();

    //     reader.onload = function(evt){
    //       images = [];
    //       item = localStorage.getItem('images');
    //       if (item != null) images = JSON.parse(item)['images'];
    //       images.push(evt.target.result);
    //       item = JSON.stringify({'images': images});
    //       localStorage.setItem('images', item);
    //       injectBg(evt.target.result);
    //     };

    //     reader.readAsDataURL(files[i]);
    //   }
    // }

    // display();
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // explicitly show this is a copy
    evt.originalEvent.dataTransfer.dropEffect = 'copy'; 
  }

  // setup the dnd listeners
  var $dropZone = $('<div>', { id: 'drop_zone' });
  $dropZone.on('dragover', handleDragOver);
  $dropZone.on('drop', handleFileSelect);

  $('body').append($dropZone);
  // var dropZone = document.getElementById('drop_zone');
  // dropZone.addEventListener('dragover', handleDragOver, false);
  // dropZone.addEventListener('drop', handleFileSelect, false);

  display();
});

$('window').ready(function() {
  function getImages(callback) {
    chrome.storage.local.get(function(data) {
      callback(data.images);
    });
  }

  function getToDos(callback) {
    chrome.storage.local.get(function(data) {
      callback(data.todos);
    });
  }

  function getData(callback) {
    chrome.storage.local.get(function(data) {
      callback(data);
    });
  }

  function saveImage(image, callback) {
    getImages(function(images) {
      if (!images) images = [];
      images.push(image);
      chrome.storage.local.set({ images: images}, function() {
        if (typeof(callback) == 'function') callback();
      });
    });
  }

  function saveImages(newImages, callback) {
    getImages(function(images) {
      if (!images) images = [];
      chrome.storage.local.set({ images: images.concat(newImages) }, function() {
        if (typeof(callback) == 'function') callback();
      });
    });
  }

  function saveToDo(todo, callback) {
    getToDos(function(todos) {
      if (!todos) todos = [];
      todos.push(todo);
      chrome.storage.local.set({ todos: todos }, function() {
        if (typeof(callback) == 'function') callback();
      });
    });
  }

  function removeToDo(todo, callback) {
    getToDos(function(todos) {
      if (!todos) return;
      todos.splice(todos.indexOf(todo), 1);
      chrome.storage.local.set({ todos: todos }, function() {
        if (typeof(callback) == 'function') callback();
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

  function displayTodo(todo) {
    $span = $('<span>', {class: 'glyphicon glyphicon-remove'});
    $button = $('<button>', {class: 'remove-item btn btn-default btn-xs pull-right'});

    $button.click(function() {
      removeToDo($(this).parent().text());
      $(this).parent().remove();
    });

    $('#todoList').append($('<li>', {text: todo, style: 'color:white; padding-top:1vh; padding-bottom:1vh;'}).append($button.append($span)));
  }

  function displayTodos(todos) {
    for (var i in todos) {
      displayTodo(todos[i]);
    }
  }

  function createInput() {
    $input = $('<input>', {type: 'text', class: 'form-control', id: 'todoInput'});

    $input.keyup(function(evt) {
      if (evt.which == 13) {
        displayTodo($('#todoInput').val());
        saveToDo($('#todoInput').val());

        $('#todoInput').val('');
      }
    });

    $fromGroup = $('<div>', {class: 'form-group'});
    $fromGroup.append($input);
    return $fromGroup; 
  }

  function displayTodoList() {
    $col = $('<div>', {class: 'col-sm-12'});
    $row = $('<div>', {class: 'row'});
    $well = $('<div>', {class: 'well todo'});
    $container = $('<div>', {class: 'container', style: 'width:100%; min-height:50vh; padding-top:15%;'});

    $well.append($('<div>', {class: 'row'}).append($('<div>', {class: 'col-sm-12'}).append($('<h1>', {text: 'To-Do', style: 'color:white;'}).append($('<small>', {text: 'List'})))));

    $well.append($row.append($col.append(createInput())));
    $well.append($('<div>', {class: 'row'}).append($('<div>', {class: 'col-sm-12'}).append($('<ul>', {class: 'list-unstyled ul-list', id: 'todoList'}))));
    $container.append($well);

    $('body').append($('<div>', {class: 'container', style: 'width:100%;'}).append($('<div>', {class: 'row'}).append($('<div>', {class: 'col-sm-6'}).append($container))));
  }

  function displayDropZone() {
    var $dropZone = $('<div>', { id: 'drop_zone' });
    $dropZone.on('dragover', handleDragOver);
    $dropZone.on('drop', handleFileSelect);
    $('body').append($dropZone);
  }

  function display() {
    getData(function(data) {
      $('document').ready(function() {
        // setup the dnd listeners
        displayDropZone();
        if (data.settings && data.settings.showTODO) {
          displayTodoList();
          displayTodos(data.todos);
        }

        var img = getImg(data.images);
        if (img) setBg(img);
        else displayDropZoneText();
      });
    });
  }

  function getImg(images) {
    if (images) 
      return images[Math.floor(Math.random() * images.length)];
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
            });
          }

          setBg(evt.target.result);
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

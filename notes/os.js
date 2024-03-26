class Window {
  constructor(title, width, height, resizable) {
    this.title = title;
    this.HTMLElement = document.createElement('div');
    this.HTMLElement.classList.add('window');
    this.HTMLElement.classList.add(title.toLowerCase().replace(' ','_') + '_window');
    this.HTMLElement.style.zIndex = document.querySelectorAll('.window').length;
    this.HTMLElement.style.width = width + 'px';
    this.HTMLElement.style.height = height + 'px';
    this.HTMLElement.style.minWidth = width + 'px';
    this.HTMLElement.style.minHeight = height + 'px';

    this.titleBar = new TitleBar(title);

    this.HTMLElement.appendChild(this.titleBar.HTMLElement);

    if (resizable) {
      var resizeHandle = document.createElement('img');
      resizeHandle.classList.add('resizeHandle');
      resizeHandle.setAttribute('src','src/resizeHandle.png');

      resizeElement(resizeHandle,this);
      this.HTMLElement.appendChild(resizeHandle);
    }

    document.body.appendChild(this.HTMLElement);
    dragElement(this.HTMLElement);
    this.titleBar.resizeImage();

    this.HTMLElement.onclick = function() {
      var windows = document.querySelectorAll('.window');
      windows.forEach(window => {
        if (window.style.zIndex > this.style.zIndex) {
          window.style.zIndex -= 1;
        }
      });
      this.style.zIndex = windows.length - 1;
    }
  }

  resizeInnerElements(){}
}

class Terminal extends Window {
  constructor() {
    super('Terminal', 600, 400, true);

    this.console = new Console();
    this.HTMLElement.appendChild(this.console.HTMLElement);
    this.console.consoleInput.focus();
    this.resizeInnerElements();
    this.HTMLElement.addEventListener('click', () => {
      this.HTMLElement.getElementsByTagName('input')[0].focus();
    });
  }

  resizeInnerElements() {
    this.console.HTMLElement.style.height = (parseInt(this.HTMLElement.style.height) - this.HTMLElement.children[0].offsetHeight) + 'px';
    this.console.HTMLElement.style.minHeight = (parseInt(this.HTMLElement.style.minHeight) - this.HTMLElement.children[0].offsetHeight) + 'px';
  }
}

class Editor extends Window {
  constructor() {
    super('Editor', 700, 500, true);

    this.codemirror = CodeMirror(this.HTMLElement,{
      lineNumbers:true,
      lineWrapping:true,
      theme:'juejin'
    });
    this.textarea = this.HTMLElement.getElementsByClassName('CodeMirror')[0];
    this.textarea.codemirror = this.codemirror;
    this.compile_button = document.createElement('div');
    this.compile_button.classList.add('compile_button');
    this.compile_button.onclick = this.compile;
    this.HTMLElement.appendChild(this.compile_button);
    this.resizeInnerElements();
  }

  compile(){
    var txt = this.parentNode.getElementsByClassName('CodeMirror')[0].codemirror.getValue();
    txt = txt.replace(/^\s*$/gm, '<br/>');
    var preview = document.getElementsByClassName('preview_window');
    if (preview.length == 0) {
      new Preview();
      preview = document.getElementsByClassName('preview_window');
    }
    for (var i = 0; i < preview.length; i++) {
      preview[i].getElementsByClassName('text')[0].innerHTML = txt;
      renderMathInElement(preview[i], {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '\\begin{equation}', right: '\\end{equation}', display: true},
            {left: '\\begin{equation*}', right: '\\end{equation*}', display: true},
            {left: '$', right: '$', display: false},
        ],
        trust: true,
        throwOnError : false
      });
    }
  }

  resizeInnerElements() {
    this.textarea.style.height = (parseInt(this.HTMLElement.style.height) - this.HTMLElement.children[0].offsetHeight - 50) + 'px';
    this.textarea.style.minHeight = (parseInt(this.HTMLElement.style.minHeight) - this.HTMLElement.children[0].offsetHeight - 50) + 'px';
  }
}

class Preview extends Window {
  constructor() {
    super('Preview', 800, 900, true);

    this.aboutText = document.createElement('p');
    this.aboutText.classList.add('text');
    this.HTMLElement.appendChild(this.aboutText);
    this.resizeInnerElements();
  }

  resizeInnerElements() {
    this.aboutText.style.height = (parseInt(this.HTMLElement.style.height) - this.HTMLElement.children[0].offsetHeight) + 'px';
    this.aboutText.style.minHeight = (parseInt(this.HTMLElement.style.minHeight) - this.HTMLElement.children[0].offsetHeight) + 'px';
  }
}

class Console {
    constructor() {
      this.window = window;
      this.HTMLElement = document.createElement('div');
      this.HTMLElement.classList.add('console');

      this.populateConsole();

      this.HTMLElement.onclick = function() {
        this.getElementsByTagName('input')[0].focus();
      };
    }

    populateConsole() {
      this.HTMLElement.innerHTML = '';
      this.cwd = '';
      var consoleText = document.createElement('p');
      consoleText.innerText = 'HTML [v5.0] & CSS [v3.0]';
      this.HTMLElement.appendChild(consoleText);
      var consoleText = document.createElement('p');
      consoleText.innerText = 'Use "help" for a list of commands.';
      this.HTMLElement.appendChild(consoleText);

      this.consoleInput = document.createElement('input');
      this.consoleInput.classList.add('consoleInput');
      this.consoleInput.value = '>';
      this.consoleInput.setAttribute('maxlength',50);
      this.consoleInput.setAttribute('autofocus',true);
      this.consoleInput.setAttribute('autocomplete','off');
      this.consoleInput.addEventListener('input', () => {
        if (this.consoleInput.value.length == this.cwd.length){
          this.consoleInput.value = this.cwd + '>';
        }
        this.consoleInput.style.width = (this.consoleInput.value.length + 1) + 'ch';
      });
      this.consoleInput.addEventListener('keyup', ({key}) => {
          if (key === 'Enter') {
              this.consoleOutput();
          }
      });
      this.HTMLElement.appendChild(this.consoleInput);
    }

    consoleOutput() {
      var inputText = document.createElement('p');
      inputText.innerText = this.consoleInput.value;
      this.HTMLElement.insertBefore(inputText,this.consoleInput);

      var command = this.consoleInput.value.split('>')[1].split(' ')[0].toLowerCase();
      switch (command) {
        case 'cls':
          this.populateConsole();
          this.consoleInput.focus();
          break;

        case 'help':
          var outputStrings = [
            'CLS : Clears all the contents on the console.',
            'LS : Returns a list containing the names of the entries in the current working directory.',
            'HELP : Prints all available commands and their description.',
            'CD [DIRECTORY] : Navigates to the specified directory (".." to navigate to the parent folder)'
          ];
          outputStrings.forEach(outputString => {
            var outputText = document.createElement('p');
            outputText.innerText = outputString;
            this.HTMLElement.insertBefore(outputText,this.consoleInput);
          });
          break;

        case 'ls':
          if (this.cwd == '') {
            var outputStrings = [
              'GAMES',
              'Terminal.exe'
            ];
          }
          else{
            var outputStrings = [
              'Max_Q.exe',
              'Double_Crossed.exe',
              'Bucks_Bunny.exe',
              'Astro_Flora.exe',
              'Far_Fetched.exe'
            ];
          }
          outputStrings.forEach(outputString => {
            var outputText = document.createElement('p');
            outputText.innerText = outputString;
            this.HTMLElement.insertBefore(outputText,this.consoleInput);
          });
          break;

        case 'cd':
          var outputText = document.createElement('p');
          outputText.innerText = 'No such folder.';
          if (this.consoleInput.value.includes(' ') == false) {
            this.HTMLElement.insertBefore(outputText,this.consoleInput);
            break;
          }
          var argument = this.consoleInput.value.split('>')[1].split(' ')[1].toLowerCase();
          if ((this.cwd == '') && (argument == 'games')) {
            this.cwd = 'games';
          }
          else if ((this.cwd == 'games') && (argument == '..')) {
            this.cwd = '';
          }
          break;

        case 'terminal.exe':
          if (this.cwd != '') {
            var outputText = document.createElement('p');
            outputText.innerText = '\'' + this.consoleInput.value.split('>')[1] + '\' is not recognized as an internal or external command, operable program or batch file.';
            this.HTMLElement.insertBefore(outputText,this.consoleInput);
            break;
          }
          new Terminal();
          break;

        case 'max_q.exe':
          if (this.cwd == '') {
            var outputText = document.createElement('p');
            outputText.innerText = '\'' + this.consoleInput.value.split('>')[1] + '\' is not recognized as an internal or external command, operable program or batch file.';
            this.HTMLElement.insertBefore(outputText,this.consoleInput);
            break;
          }
          window.open('https://handt.itch.io/max-q', '_blank').focus();
          break;

          case 'double_crossed.exe':
            if (this.cwd == '') {
              var outputText = document.createElement('p');
              outputText.innerText = '\'' + this.consoleInput.value.split('>')[1] + '\' is not recognized as an internal or external command, operable program or batch file.';
              this.HTMLElement.insertBefore(outputText,this.consoleInput);
              break;
            }
            window.open('https://handt.itch.io/double-crossed', '_blank').focus();
            break;

          case 'bucks_bunny.exe':
            if (this.cwd == '') {
              var outputText = document.createElement('p');
              outputText.innerText = '\'' + this.consoleInput.value.split('>')[1] + '\' is not recognized as an internal or external command, operable program or batch file.';
              this.HTMLElement.insertBefore(outputText,this.consoleInput);
              break;
            }
            window.open('https://handt.itch.io/bucks-bunny', '_blank').focus();
            break;

          case 'astro_flora.exe':
            if (this.cwd == '') {
              var outputText = document.createElement('p');
              outputText.innerText = '\'' + this.consoleInput.value.split('>')[1] + '\' is not recognized as an internal or external command, operable program or batch file.';
              this.HTMLElement.insertBefore(outputText,this.consoleInput);
              break;
            }
            window.open('https://handt.itch.io/astro-flora', '_blank').focus();
            break;

          case 'far_fetched.exe':
            if (this.cwd == '') {
              var outputText = document.createElement('p');
              outputText.innerText = '\'' + this.consoleInput.value.split('>')[1] + '\' is not recognized as an internal or external command, operable program or batch file.';
              this.HTMLElement.insertBefore(outputText,this.consoleInput);
              break;
            }
            window.open('https://handt.itch.io/far-fetched', '_blank').focus();
            break;

        default:
          var outputText = document.createElement('p');
          outputText.innerText = '\'' + this.consoleInput.value.split('>')[1] + '\' is not recognized as an internal or external command, operable program or batch file.';
          this.HTMLElement.insertBefore(outputText,this.consoleInput);

      }

      this.consoleInput.value = this.cwd + '>';
      this.HTMLElement.scrollTo(0, this.HTMLElement.scrollHeight);
    }
}

class TitleBar {
  constructor(title) {
    this.title = title;
    this.HTMLElement = document.createElement('div');
    this.HTMLElement.classList.add('titleBar');
    this.HTMLElement.classList.add(title);

    var titleP = document.createElement('p');
    titleP.classList.add('titleBarTitle');
    titleP.innerText = title;
    this.HTMLElement.appendChild(titleP);

    var closeButton = new CloseButton();
    this.HTMLElement.appendChild(closeButton.HTMLElement);
  }

  resizeImage() {
    var titleP = this.HTMLElement.children[0];
    this.HTMLElement.style.backgroundSize = (this.HTMLElement.offsetWidth - titleP.offsetWidth - 15 - 10) + 'px 15px';
    this.HTMLElement.style.backgroundPositionX = (titleP.offsetWidth + 5) + 'px';
  }
}

class CloseButton {
  constructor() {
    this.HTMLElement = document.createElement('img');
    this.HTMLElement.classList.add('closeButton');
    this.HTMLElement.setAttribute('src','src/closeButton.png');

    this.HTMLElement.onclick = function() {
      this.parentNode.parentNode.remove();
    };
  }
}

class Icon {
  constructor(title, img, window_create_function) {
    this.title = title;
    this.HTMLElement = document.createElement('div');
    this.HTMLElement.classList.add('icon');
    var image = document.createElement('img');
    image.setAttribute('src',img);
    var titleP = document.createElement('p');
    titleP.innerText = title;
    this.HTMLElement.appendChild(image);
    this.HTMLElement.appendChild(titleP);
    this.HTMLElement.setAttribute('ondblclick',window_create_function);
    this.HTMLElement.onclick = function() {
      event.stopPropagation();
      var icons = document.querySelectorAll('.icon');
      icons.forEach(icon => {
        if (icon.children[1].classList.contains('selected')) {
          icon.children[1].classList.remove('selected');
        }
      });
      this.children[1].classList.add('selected');
    };

    document.getElementById('desktop').appendChild(this.HTMLElement);
  }
}

function dragElement(el) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  el.children[0].onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    var windows = document.querySelectorAll('.window');
    windows.forEach(window => {
      if (window.style.zIndex > el.style.zIndex) {
        window.style.zIndex -= 1;
      }
    });
    el.style.zIndex = windows.length - 1;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    var top = Math.max(Math.min(el.offsetTop - pos2, window.innerHeight - el.offsetHeight), 0);
    var left = Math.max(Math.min(el.offsetLeft - pos1, window.innerWidth - el.offsetWidth), 0);
    el.style.top = top + 'px';
    el.style.left = left + 'px';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function resizeElement(el,window) {
  el.onmousedown = initDrag;

  function initDrag(e) {
    e = e || window.event;
    e.preventDefault();
    element = this.parentNode;

    startX = e.clientX;
    startY = e.clientY;
    startWidth = element.offsetWidth;
    startHeight = element.offsetHeight;
    document.onmouseup = stopDrag;
    document.onmousemove = doDrag;
  }

  function doDrag(e) {
    e = e || window.event;
    e.preventDefault();
    element.style.width = startWidth + e.clientX - startX + 'px';
    element.style.height = startHeight + e.clientY - startY + 'px';
    window.titleBar.resizeImage();
    window.resizeInnerElements();
  }

  function stopDrag() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function createDesktop() {
  var desktop = document.createElement('div');
  desktop.id = 'desktop';
  desktop.style.backgroundImage = 'url(src/bg' +  (Math.floor(Math.random() * 3) + 1) + '.png)';
  desktop.onclick = function() {
    var icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
      if (icon.children[1].classList.contains('selected')) {
        icon.children[1].classList.remove('selected');
      }
    });
  };

  document.body.appendChild(desktop);

  new Icon('Terminal','src/terminal_icon.png', 'new Terminal();');
  new Icon('Preview','src/preview_icon.png', 'new Preview();');
  new Icon('Editor','src/editor_icon.png', 'new Editor();');
}

window.onload = createDesktop;

var system = {
  stopwatch: function(name, start = true) {
    if (name) {
      if (start === true) console.time(name);
      else console.timeEnd(name);
    }
  },
  guid: function() {
    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + S4() + S4());
  },
  clipboard: {
    cut: function() {
      document.execCommand('cut');
    },
    copy: function() {
      document.execCommand('copy');
    },
    paste: function() {
      document.execCommand("paste");
    },
    get: function() {
      navigator.clipboard.readText().then(contents => {
        clipText = contents;
      });
    }
  },
  storage: {
    count: function() {
      return localStorage.length;
    },
    set: function(key, value) {
      if (key && value) {
        if (localStorage.setItem(key, value)) return true;
        else return false;
      } else return false;
    },
    get: function(key) {
      if (key && localStorage.getItem(key)) return localStorage.getItem(key);
      else return false;
    },
    remove: function(key) {
      if (key) {
        if (localStorage.removeItem(key)) return true;
        else return false;
      } else return false;
    },
    purge: function() {
      localStorage.clear();
      main.log("purged local storage", "warn");
    }
  },
  cache: {
    count: function() {
      return sessionStorage.length;
    },
    set: function(key, value) {
      if (key && value) {
        if (sessionStorage.setItem(key, value)) return true;
        else return false;
      } else return false;
    },
    get: function(key) {
      if (key && sessionStorage.getItem(key)) return sessionStorage.getItem(key);
      else return false;
    },
    remove: function(key) {
      if (key) {
        if (sessionStorage.removeItem(key)) return true;
        else return false;
      } else return false;
    },
    purge: function() {
      sessionStorage.clear();
      main.log("purged session storage", "warn");
    }
  },
  cookie: {
    set: function(c_name, value, exdays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + exdays);
      var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString()) + ";path=/";
      document.cookie = c_name + "=" + c_value;
    },
    get: function(c_name) {
      var c_value = document.cookie;
      var c_start = c_value.indexOf(" " + c_name + "=");
      if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
      }
      if (c_start == -1) {
        c_value = null;
      } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
          c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
      }
      return c_value;
    },
    remove: function(name) {
      document.cookie = name + '=; Max-Age=0';
    }
  },
  resource: {
    load: function(url, success, error) {
      var loader = new Process("resource.load");
      if (system.resource.loaded(url) === false) {
        if (network.online() === true) {
          network.request(url, "GET", {},
            function(contents) {
              if (url.includes("js")) {
                const head = document.getElementsByTagName('head')[0];
                const script = document.createElement('script');
                script.setAttribute("type", "text/javascript");
                script.setAttribute("src", url);
                head.appendChild(script);
                loader.log("loaded script '" + url + "'");
                if (success) success(contents);
              } else {
                const head = document.getElementsByTagName('head')[0];
                const stylesheet = document.createElement('link');
                stylesheet.setAttribute("rel", "stylesheet");
                stylesheet.setAttribute("href", url);
                head.appendChild(stylesheet);
                loader.log("loaded stylesheet '" + url + "'");
                if (success) success(contents);
              }
            },
            function(error) {
              loader.log("resource file '" + url + "' does not exist", "error", error);
              if (error) error(error);
            }
          );
        } else {
          loader.log("unable load resource at '" + url + "'", "error");
          if (error) error("network is offline, cannot load resource at '" + url + "'");
        }
      } else loader.log("already loaded '" + url + "'", "warn");
      loader.kill();
    },
    font: function(name) {
      var font = new Process("resource.font");
      if (network.online() === true) {
        var url = "https://fonts.googleapis.com/css2?family=" + name + ":wght@400;500;700&display=swap";
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            let css = xhr.responseText;
            css = css.replace(/}/g, 'font-display: swap; }');
            const head = document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
            $("head").append("<style>html,body,button,select,input,textarea{font-family:" + name + ";}</style>");
            font.log("loaded font '" + name + "'");
          } else if (xhr.status !== 200) font.log("font '" + name + "' does not exist", "error", xhr);
        };
        xhr.send();
      } else font.log("failed to load font '" + name + "'", "error");
      font.kill();
    },
    loaded: function(url) {
      if (url.includes("js")) {
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length; i--;) {
          if (scripts[i].src == url) return true;
        }
      } else {
        var stylesheets = document.getElementsByTagName('link');
        for (var i = stylesheets.length; i--;) {
          if (stylesheets[i].href == url) return true;
        }
      }
      return false;
    }
  },
  wallpaper: {
    set: function(url, temporary = true) {
      $("body").css("background-image", "url(" + url + ")");
      if (temporary === false) {

      }
    },
    color: function(color) {
      $("body").css("background-color", color);
    }
  },
  login: function() {
    system.resource.load("lib/apis/desktop.js");
    $(".login-container").fadeOut();
    setTimeout(function() {
      $(".desktop-container").fadeIn();
    }, 1000);
  },
  logout: function() {
    if (confirm("are you sure?") === true) {
      system.storage.remove("session");
      system.wallpaper.set("res/wallpapers/default.jpg");
      $(".desktop-container").fadeIn();
      setTimeout(function() {
        $(".login-container").fadeOut();
      }, 1000);
    }
  },
  refresh: function() {
    main.log("refreshing in 3 secs...", "info");
    console.timeEnd("uptime");
    setTimeout(function() {
      window.location.reload(true); // clear cache
    }, 3000);
  },
  test: function() {
    $(".tests").fadeIn();
    $("body").css("background", "black");
    $(".login-container,.desktop-container,.boot").fadeOut();
  }
}

class Process {
  constructor(name, app = false) {
    this.id = system.guid();
    this.name = name;
    if (app) this.app = true;
    processes.push(this);
    system.stopwatch(this.name + "-" + this.id);
  }
  kill() {
    let i = processes.indexOf(this);
    processes.splice(i, 1);
    system.stopwatch(this.name + "-" + this.id, false);
    delete this;
    // kill things it might have created
    kill_audio(this);
  }
  log(message, type, object = null) {
    message = "[" + this.name + "]: " + message;
    if (object) {
      if (type === "info") console.info(message, object);
      else if (type === "warn") console.warn(message, object);
      else if (type === "error") console.error(message, object);
      else if (type === "success") console.log("✓ " + message, object);
      else console.log(message, object);
    } else {
      if (type === "info") console.info(message);
      else if (type === "warn") console.warn(message);
      else if (type === "error") console.error(message);
      else if (type === "success") console.log("✓ " + message);
      else console.log(message);
    }
  }
}

function list_processes() {
  var list = "";
  var i = 1;
  processes.forEach(function(item) {
    index = i.toString();
    if (index.length === 1) index = "0" + i;
    list += "[" + index + "] " + item.name + " (" + item.id + ")\n";
    ++i;
  });
  console.info(list);
}

var main = new Process("system");
var system_audio = new Audio(main);

$(function() {
  console.timeEnd("startup");
  document.title = 'ready';
  system.resource.font("Rubik");
  // if remember user
  if (system.storage.get("session")) {
    system.login();
  } else {
    system.wallpaper.set("res/wallpapers/default.jpg");
    $(".login-container").fadeIn();
  }
  $(".boot").fadeOut();
  $("form").on("submit", function(event) {
    event.preventDefault();
  });
  $("*").each(function(index, item) {
    if ($(this).css("cursor") === "pointer") {
      $(this).css("cursor", "url('/res/cursors/pointer.png'), auto");
    }
  });
});
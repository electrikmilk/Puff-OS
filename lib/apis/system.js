var desktop = null;
var log = [];
var system = {
  stopwatch: function(name, start = true) {
    if (name) {
      if (start === true) console.time(name);
      else console.timeEnd(name);
    }
  },
  guid: function(length = 5) {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      var result = characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    result += (S4() + "-" + S4() + "-" + S4());
    return result;
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
      var loader = new Process("resource.load: '" + url + "'");
      if (system.resource.loaded(url) === false) {
        if (network.online() === true) {
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
        } else {
          loader.log("unable load resource at '" + url + "'", "error");
          if (error) error("network is offline, cannot load resource at '" + url + "'");
        }
      } else loader.log("already loaded '" + url + "'", "warn");
      loader.kill();
    },
    font: function(name) {
      var font = new Process("resource.font: '" + name + "'");
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
      var wallpaper = new Process("wallpaper");
      $("body").css("background-image", "url(" + url + ")");
      wallpaper.log("set wallpaper to " + url);
      wallpaper.kill();
      if (temporary === false) {
        system.storage("wallpaper", url);
      }
    },
    color: function(color) {
      $("body").css("background-color", color);
    }
  },
  login: function() {
    system.resource.load("lib/apis/desktop.js");
    desktop = new Process("desktop");
    $(".login-container").fadeOut();
    setTimeout(function() {
      $(".desktop-container").fadeIn();
    }, 1000);
  },
  logout: function() {
    if (confirm("are you sure?") === true) {
      system.storage.remove("session");
      system.wallpaper.set("res/wallpapers/default.jpg");
      desktop.kill();
      $("script").each(function() {
        if ($(this).attr("src") === "lib/apis/desktop.js") {
          $(this).remove();
        }
      });
      $(".desktop-container").fadeOut();
      setTimeout(function() {
        $(".login-container").fadeIn();
        $(".windows-container,.dialog-container").html("");
        processes.forEach((item, i) => {
          if (item.name !== "system") {
            item.kill();
          }
        });
        list_processes();
      }, 1000);
    }
  },
  refresh: function() {
    system.logout();
    main.log("refreshing system in 3 secs...", "warn");
    console.timeEnd("uptime");
    setTimeout(function() {
      window.location.reload(true); // clear cache
    }, 3000);
  },
  exit: function() {
    system.logout();
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setTimeout(function() {
      if (window.opener) {
        window.close();
      }
    }, 1000);
  },
  tooltips: function() {
    $("[tooltip]").each(function() {
      var tooltip = $(this).attr("tooltip");
      $(this).attr("data-toggle", "tooltip");
      $(this).attr("data-original-title", tooltip);
      $('body').tooltip({
        selector: '[data-toggle=tooltip]',
        trigger: 'hover',
        container: 'body'
      });
    });
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
    // if app, remove window and menus
    if (this.app === true) {
      $(".window#" + this.id).remove();
      $(".app-menu#menu-" + this.id).remove();
      if ($(".window[data-title='" + this.name + "']").length === 0) {
        $(".app-item[tooltip='" + this.name + "']").removeClass("opening").removeClass("open").html("");
      }
    }
    // kill things it might have created
    kill_audio(this.id);
    // remove process
    let i = processes.indexOf(this);
    processes.splice(i, 1);
    system.stopwatch(this.name + "-" + this.id, false);
    delete this;
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
    log.push(message);
  }
}

function get_process(val, callback) {
  processes.forEach(function(item) {
    if (item.id === val || item.name === val) {
      callback(item);
    }
  });
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
  document.title = osname;
  $("form").on("submit", function(event) {
    event.preventDefault();
  });
  system.resource.font("Signika");
  // if remember user
  if (system.storage.get("session")) {
    system.login();
  } else {
    system.wallpaper.set("res/wallpapers/default.jpg");
    $(".login-container").fadeIn();
  }
  $(".boot").fadeOut();
  system.login(); // debug
  network.wentOnline(function() {
    // you're back online
    // alert("You're back online!");
  });
  network.wentOffline(function() {
    alert("Connection appears to have gone offline");
  });
});
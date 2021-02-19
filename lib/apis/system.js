var desktop = null;
var demo = false;
var log = [];
var cantkill = ["system", "desktop", "videoAPI", "audioAPI", "memoryMonitor"];

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
        if (window.localStorage.setItem(key, value)) return true;
        else return false;
      } else return false;
    },
    get: function(key) {
      if (key && window.localStorage.getItem(key)) return window.localStorage.getItem(key);
      else return false;
    },
    remove: function(key) {
      if (key) {
        if (window.localStorage.removeItem(key)) return true;
        else return false;
      } else return false;
    },
    purge: function() {
      window.localStorage.clear();
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
    image: function(url, temporary = true) {
      var wallpaper = new Process("wallpaper");
      $("body").css("background-image", "url(" + url + ")");
      wallpaper.log("set wallpaper to " + url);
      wallpaper.kill();
      if (temporary === false) {
        system.storage.set("wallpaper", url);
      }
    },
    color: function(color) {
      $("body").css("background-color", color);
    }
  },
  demo: function(save = false) {
    if (save === true) {
      system.storage.set("demo", true);
    } else {
      demo = true;
      if (!system.storage.get("demo")) {
        apps.dialog({
          title: "For Developers",
          message: "Always start in demo mode?",
          callback: "system.demo(true)",
          ok: "No, thanks",
          cancel: "Yes"
        });
      }
      system.login();
    }
  },
  login: function() {
    get_process("Login", function(process) {
      apps.close(process.id);
    });
    system.resource.load("lib/apis/desktop.js");
    $(".login-container").fadeOut();
    setTimeout(function() {
      desktop = new Process("desktop");
      $(".desktop-container").fadeIn();
    }, 1000);
  },
  logout: function(bypass = false, restart = false) {
    if (bypass === false) {
      apps.dialog({
        title: "Logout",
        message: "Are you sure?",
        ok: "Yes",
        new: false,
        callback: "system.logout(true)"
      });
    } else {
      processes.forEach((process, i) => {
        if (process.app === true) {
          apps.close(process.id);
        }
      });
      var asked_nicely = 0;
      var closeApps = setInterval(function() {
        var wait = false;
        if (asked_nicely > 10) {
          clearInterval(closeApps);
          apps.dialog({
            title: "Logout Failed",
            message: "Apps are refusing to close. Force close them?",
            ok: "No, cancel",
            cancel: "Force",
            cancelcallback: "system.exitDesktop()"
          });
        } else {
          var open = 0;
          processes.forEach((process, i) => {
            if (process.app === true) {
              wait = true;
              ++open;
            }
          });
          if (wait === false) {
            main.log("all apps have been closed", "success");
            system.exitDesktop(restart);
            clearInterval(closeApps);
          } else {
            main.log(open + " apps still open, asking to close...", "warn", processes);
            processes.forEach((process, i) => {
              if (process.app === true) {
                apps.close(process.id);
              }
            });
          }
        }
        ++asked_nicely;
      }, 2000);
    }
  },
  exitDesktop: function(restart = false) {
    $(".desktop-container").fadeOut();
    if (restart === false) {
      system.storage.remove("session");
      desktop.log("goodbye!", "success", processes);
      desktop.kill();
      desktop = null;
      demo = false;
      $("script").each(function() {
        if ($(this).attr("src") === "lib/apis/desktop.js") {
          $(this).remove();
        }
      });
      system.wallpaper.image("res/wallpapers/default.jpg");
      $(".login-container").fadeIn();
    }
    processes.forEach((process, i) => {
      if (!cantkill.includes(process.name)) {
        process.kill();
      }
    });
    $(".windows-container, .dialog-container, .system-menu .menubar-menu ul").html("");
    if (restart === true) {
      system.refresh(restart);
    } else {
      apps.open("Login");
    }
  },
  refresh: function(bypass = false) {
    if (bypass === false) {
      apps.dialog({
        title: "Reload " + osname,
        message: "Are you sure?",
        ok: "Yes",
        new: false,
        callback: "system.logout(true,true)"
      });
    } else {
      if (!system.storage.get("session")) {
        get_process("Login", function(process) {
          apps.close(process.id);
        });
      }
      main.log("refreshing in 3 secs...", "warn");
      main.kill();
      console.timeEnd("uptime");
      $(".login-container").fadeOut();
      setTimeout(function() {
        window.location.reload(true); // clear cache
      }, 3000);
    }
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

var open_apps = [];
var apps = {
  open: function(name, newinstance = false, params) {
    if ($(".window[data-title='" + name + "']").length !== 0 && newinstance === false) {
      apps.show(name);
    } else {
      var newapp = new Process(name, true);
      open_apps.push(newapp);
      if (desktop !== null) {
        if ($(".app-item[tooltip='" + name + "']").length === 0) {
          network.request(
            "lib/server", "POST", {
              action: "apps",
              query: name
            },
            function(response) {
              desktop.log("Added missing app '" + name + "' to toolbar");
              $(".toolbar-container").append(response);
              system.tooltips();
            },
            function(error) {
              desktop.log("Failed to add app '" + name + "' to toolbar", "error", error);
            }
          );
        }
        $(".app-item[tooltip='" + name + "']").addClass("opening").html("<div class='loader'></div>");
      }
      network.request(
        "lib/server", "POST", {
          action: "window_template",
          id: newapp.id,
          name: newapp.name,
          data: params
        },
        function(response) {
          var container = ".windows-container";
          if (!system.storage.get("session") && demo === false) container = ".login-container";
          $(".window").removeClass("ui-selected");
          $(container).append(response);
          $(container).selectable();
          $(".window").draggable({
            handle: ".window-bar",
            containment: "parent"
          });
          $(".window").resizable({
            containment: ".windows-container",
            minHeight: 200,
            minWidth: 500,
            handles: 'nw,ne,sw,se,n,e,s,w',
          });
          $(".window-bar").on("click", function() {
            $(".window").removeClass("ui-selected");
            $(".ui-selectee").removeClass("ui-selectee");
            $(this).parent().addClass("ui-selected");
            $(".app-menu").hide();
            var id = $(this).parent().attr("id");
            $(".app-menu#menu-" + id).show();
          });
          $(".window-content iframe").on("mousedown, mouseup, click", function() {
            $(this).parent().parent().parent().addClass("ui-selected");
          });
          $(".window-close").on("click", function() {
            var id = $(this).parent().parent().parent().attr("id");
            apps.close(id);
          });
          $(".window-min").on("click", function() {
            $(this).parent().parent().parent().addClass("minimized");
          });
        },
        function(error) {
          main.log("Failed to create window for '" + name + "'", "error", error);
        }
      );
      if (desktop !== null) {
        network.request(
          "lib/server", "POST", {
            action: "menu_template",
            id: newapp.id,
            name: newapp.name
          },
          function(response) {
            $(".app-menu").hide();
            $(".app-menus").append(response);
          },
          function(error) {
            desktop.log("Failed to create menu for '" + name + "'", "error", error);
          }
        );
      }
    }
  },
  start: function(id) {
    $(".window#" + id).show();
    get_process(id, function(process) {
      $(".app-item[tooltip='" + process.name + "']").removeClass("opening").addClass("open").html("");
    });
  },
  show: function(name) {
    $(".window").removeClass("ui-selected");
    $(".app-menu").hide();
    $(".window[data-title='" + name + "']").removeClass("minimized").addClass("ui-selected");
    $(".app-menu[data-title='" + name + "']").show();
  },
  showWindow: function(id) {
    $(".window").removeClass("ui-selected");
    $(".app-menu").hide();
    $(".window#" + id).removeClass("minimized").addClass("ui-selected");
    $("#menu-" + id).show();
  },
  refresh: function(id) {
    document.querySelector(".window#" + id + " .window-content iframe").contentWindow.window.location.reload(true);
    get_process(id, function(process) {
      apps.close(id);
      setTimeout(function() {
        apps.open(process.name, true);
      }, 1000);
    });
  },
  close: function(id) { // politely ask the app to wrap up and close
    document.querySelector(".window#" + id + " .window-content iframe").contentWindow.close();
  },
  list: function() {
    network.request("lib/server", "POST", {
        action: "apps"
      },
      function(response) {
        $(".toolbar-container").html(response);
        system.tooltips();
      },
      function(error) {
        desktop.log("unable to load toolbar apps", "error");
      }
    );
  },
  about: function(name) {
    apps.open("About", true, {
      name: name
    });
  },
  audio: function(process) {
    return new Audio(process);
  },
  dialog: function(options) {
    var newinstance = true;
    if (!options) return;
    if (options.new) newinstance = options.new;
    apps.open("Dialog", newinstance, {
      title: options.title,
      message: options.message,
      callback: options.callback,
      cancelcallback: options.cancelcallback,
      ok: options.ok,
      cancel: options.cancel
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

var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {};
var main = new Process("system");
var system_audio = new Audio(main);
var memorymonitor = null;
var memorycheck;
var memory = {};

if (system.storage.get("demo") === true) demo = true;

$(function() {
  console.timeEnd("startup");
  document.title = osname;
  $("form").on("submit", function(event) {
    event.preventDefault();
  });
  system.resource.font("Signika");
  if (system.storage.get("session")) {
    system.login();
  } else {
    system.wallpaper.image("res/wallpapers/default.jpg");
    $(".login-container").fadeIn();
    apps.open("Login");
  }
  $(".boot").fadeOut();
  if (demo === true) system.login(); // debug / demo mode
  network.wentOnline(function() {
    main.log("online", "success");
  });
  network.wentOffline(function() {
    main.log("offline", "warn");
    apps.dialog({
      title: "Warning",
      message: "Connection appears to have gone offline",
      cancel: "false"
    });
  });
  if (performance.memory) {
    memorymonitor = new Process("memoryMonitor");
    memorymonitor.log("supported", "success", performance.memory);
    $(".memory span").html("RAM");
    memorycheck = setInterval(function() {
      systemMemory = performance.memory;
      memory.total = files.formatBytes(systemMemory.totalJSHeapSize);
      memory.used = files.formatBytes(systemMemory.usedJSHeapSize);
      memory.limit = files.formatBytes(systemMemory.jsHeapSizeLimit);
      memory.percent = parseInt(memory.total.split(" ")[0]) - (parseInt(memory.total.split(" ")[0]) - parseInt(memory.used.split(" ")[0]));
      $(".memory progress").attr("max", systemMemory.totalJSHeapSize).val(systemMemory.usedJSHeapSize);
      var percent = Math.round(100 - (((systemMemory.totalJSHeapSize - systemMemory.usedJSHeapSize) / systemMemory.totalJSHeapSize) * 100));
      $(".memory span").html("Memory (" + percent + "%)");
      if (systemMemory.usedJSHeapSize > systemMemory.totalJSHeapSize || systemMemory.usedJSHeapSize > systemMemory.jsHeapSizeLimit) {
        memorymonitor.log("memory limit exceeded!", "warn", systemMemory);
        apps.dialog({
          title: "Memory limit exceeded!",
          message: "Please close any apps not in use.",
          callback: "apps.open('Process Manager')"
        });
      }
    }, 1000);
  } else {
    main.log("memory monitoring not supported", "warn", performance);
    // apps.dialog({
    //   title: "Warning",
    //   message: "Cannot monitor memory as it's not supported by your browser.",
    //   cancel: "false"
    // });
    $(".memory").remove();
  }
});
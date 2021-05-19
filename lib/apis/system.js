var desktop = null;
var demo = false;
var log = [];
var cantkill = ["system", "desktop", "videoAPI", "audioAPI", "memoryd", "watchdogd", "Sound Applet", "Network Applet"];
var unresponsive = [];
var reported = [];

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
  logout: function(bypass = false, restart = false, exit = false) {
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
            system.exitDesktop(restart, exit);
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
  exitDesktop: function(restart = false, exit = false) {
    $(".desktop-container").fadeOut();
    if (restart === false && exit === false) {
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
    } else if (exit === true) {
      setTimeout(function() {
        if (window.opener) {
          window.close();
        }
      }, 1000);
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
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    system.logout(true, false, true);
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
  },
  screenshot: function() {
    // https://meshworld.in/convert-canvas-to-an-image-using-javascript/
    // var highQuality = canvas.toDataURL("image/jpeg", 1.0);
    // var mediumQuality = canvas.toDataURL("image/jpeg", 0.5);
    // var lowQuality = canvas.toDataURL("image/jpeg", 0.1);
    main.log("cheese!");
    $(".screenshot").fadeIn();
    setTimeout(function() {
      $(".screenshot").fadeOut();
    }, 500);
    html2canvas(document.body).then(function(canvas) {
      var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      main.log("screenshot", "info", image);
    });
  }
}

var open_apps = [];
var checkApp;
var apps = {
  windows: function() {
    var count, windows, frames;
    if ($(".windows-container .window")) {
      count = $(".windows-container .window").length;
      windows = $(".windows-container .window");
      frames = $(".windows-container .window iframe");
    } else if ($(".login-container .window")) {
      count = $(".login-container .window").length;
      windows = $(".login-container .window");
      frames = $(".login-container .window iframe");
    }
    return {
      count: count,
      windows: windows,
      frames: frames
    };
  },
  open: function(name, newinstance = false, params) {
    if ($(".window[data-title='" + name + "']").length !== 0 && newinstance === false) {
      apps.show(name);
    } else {
      var newapp = new Process(name, true);
      checkApp = setInterval(function() {
        apps.windows().windows.each(function(i) {
          if (this.id === newapp.id) {
            main.log("Created window for '" + newapp.name + "-" + newapp.id + "'");
            apps.status(newapp.id);
            clearInterval(checkApp);
          } else {
            apps.unresponsive(newapp.id);
            main.log("'" + newapp.name + "-" + newapp.id + "' unresponsive", "warn");
            // watchdog should take it from here...
          }
        });
        if (!open_apps.includes(newapp)) {
          apps.unresponsive(newapp.id);
          main.log("'" + newapp.name + "-" + newapp.id + "' unresponsive", "warn");
          // watchdog should take it from here...
        } else {
          clearInterval(checkApp);
        }
      }, 5000);
      if (desktop !== null) {
        if ($(".app-item[tooltip='" + name + "']").length === 0) {
          network.request(
            "lib/server", "POST", {
              action: "apps",
              query: name
            },
            function(response) {
              desktop.log("Added missing app '" + name + "' to toolbar");
              $(".toolbar").append(response);
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
          $(".window:not(.frontncenter)").draggable({
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
  ready: function(id) {
    get_process(id, function(process) {
      open_apps.push(process);
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
  kill: function(id) {
    get_process(id, function(process) {
      process.kill();
    });
  },
  unresponsive: function(id) {
    // count how many times it's been reported as unresponsive
    get_process(id, function(process) {
      if (!unresponsive[process.id]) {
        unresponsive[process.id] = 1;
      } else {
        unresponsive[process.id] = unresponsive[process.id] + 1;
      }
    });
  },
  tattle: function(process) {
    // uh oh, ur in trouble...
    if (!reported.includes(process)) {
      reported.push(process);
      apps.dialog({
        title: process.name + " is not responding",
        message: process.name + " appears to be unresponsive",
        callback: "apps.kill('" + process.id + "')",
        ok: "Kill",
        cancel: "Wait"
      })
    }
  },
  status: function(id) {
    var frame = document.querySelector(".window#" + id + " iframe");
    if (frame) {
      var iframeDoc = frame.contentDocument || frame.contentWindow.document;
      get_process(id, function(process) {
        if (process.app === true) {
          main.log("'" + process.name + "-" + process.id + "': " + iframeDoc.readyState);
        }
      });
    }
  },
  list: function() {
    network.request("lib/server", "POST", {
        action: "apps"
      },
      function(response) {
        $(".toolbar").html(response);
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
  },
  preview: function(path) {
    apps.open("File", true, {
      path: path
    });
  },
  applet: function(name, data) {
    if (!process_exists(name + " Applet")) {
      let applet = new Process(name + " Applet", false, true);
      if (data.type === "popup") {
        var icon = "icon/128.png";
        if (data.icon) {
          icon = "applet/" + data.icon;
        }
        $(".applets").prepend("<div class='applet popup' id='" + applet.id + "'><span style='background-image:url(/apps/" + name + ".ap/" + icon + ");'></span><div class='popup-menu' style='width:" + data.width + ";height:" + data.height + ";'><iframe src='/lib/php/applet_template?app=" + name + "' frameborder=0></iframe></div></div>");
      } else {
        $(".applets").prepend("<div class='applet' id='" + applet.id + "'><iframe src='/lib/php/applet_template?app=" + name + "' style='width:" + data.width + ";' frameborder=0></iframe></div>");
      }
    }
  },
  manifest: function(name, callback, errorcallback) {
    network.request(
      "/apps/" + name + ".ap/manifest.json",
      "GET", {},
      function(success) {
        callback(success);
      },
      function(error) {
        errorcallback(error);
      }
    );
  }
}

class Process {
  constructor(name, app = false, applet = false, interval) {
    this.id = system.guid();
    this.name = name;
    if (app) this.app = true;
    if (applet) this.applet = true;
    if (interval) this.interval = interval;
    processes.push(this);
    system.stopwatch(this.name + "-" + this.id);
  }
  kill() {
    // if app, remove window and menus from menubar
    if (this.app === true) {
      $(".window#" + this.id).remove();
      $(".app-menu#menu-" + this.id).remove();
      if ($(".window[data-title='" + this.name + "']").length === 0) {
        $(".app-item[tooltip='" + this.name + "']").removeClass("opening").removeClass("open").html("");
      }
    }
    // if applet remove from menubar
    if (this.applet === true) {
      $(".applet#" + this.id).remove();
    }
    // hmm...
    // get_process(this.name + " Applet", function(process) {
    //   process.kill();
    // });
    // kill things it might have created
    kill_audio(this.id);
    // clear intervals it created
    if (this.interval) {
      clearInterval(this.interval);
    }
    // remove process
    let i = processes.indexOf(this);
    processes.splice(i, 1);
    system.stopwatch(this.name + "-" + this.id, false);
    main.log("killed " + this.name + "-" + this.id);
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

function process_exists(val) {
  var exists = false;
  processes.forEach(function(item) {
    if (item.id === val || item.name === val) {
      exists = true;
    }
  });
  return exists;
}

function get_process(val, callback) {
  processes.forEach(function(process) {
    if (process.id === val || process.name === val) {
      callback(process);
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

if (system.storage.get("demo") === "true") demo = true;

$(function() {
  console.timeEnd("startup");
  document.title = osname;
  $("form").on("submit", function(event) {
    event.preventDefault();
  });
  system.resource.font("Signika");
  if (system.storage.get("session")) {
    system.login();
  } else if (demo === true) {
    system.demo();
  } else {
    system.wallpaper.image("res/wallpapers/default.jpg");
    $(".login-container").fadeIn();
    apps.open("Login");
  }
  $(".boot").fadeOut();
  $("body").css("overflow", "hidden");
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
  // monitor memory
  if (performance.memory) {
    memorycheck = setInterval(function() {
      systemMemory = performance.memory;
      if (systemMemory.usedJSHeapSize > systemMemory.totalJSHeapSize || systemMemory.usedJSHeapSize > systemMemory.jsHeapSizeLimit) {
        memorymonitor.log("exceeded memory limit!", "warn", systemMemory);
        apps.dialog({
          title: "Memory limit exceeded!",
          message: "Please close any apps not in use.",
          callback: "apps.open('Process Manager')"
        });
      }
    }, 1000);
    memorymonitor = new Process("memoryd", false, false, memorycheck);
    memorymonitor.log("supported", "success", performance.memory);
  } else {
    memorymonitor.log("memory monitoring not supported", "warn", performance);
    // apps.dialog({
    //   title: "Warning",
    //   message: "Cannot monitor memory as it's not supported by your browser.",
    //   cancel: "false"
    // });
    $(".memory").remove();
  }
  // monitor app responsiveness
  let patrol = setInterval(function() {
    processes.forEach((process, i) => {
      if (unresponsive[process.id] && !reported.includes(process)) {
        // check the number of times this process has been reported as unresponsive
        if (unresponsive[process.id] >= 2) {
          // tell on that app to the user
          apps.tattle(process);
        }
      }
    });
    $(".windows-container .window").each(function(i) {
      var appWindow = $(".window#" + this.id);
      var frame = document.querySelector(".window#" + this.id + " iframe");
      var name = appWindow.attr("data-title");
      var iframeDoc = frame.contentDocument || frame.contentWindow.document;
      if (iframeDoc.readyState == 'complete') {
        frame.contentWindow.onload = function() {
          watchdog.log("app '" + name + "' loaded successfully");
        };
        return;
      } else {
        watchdog.log(name + "-" + this.id + ": " + iframeDoc.readyState);
      }
      setTimeout(function() {
        watchdog.log("'" + name + "-" + this.id + "' is unresponsive", "warn");
        system.unresponsive(this.id);
      }, 100);
    });
  }, 10000);
  let watchdog = new Process("watchdogd", false, false, patrol);
});
// Audio API

var audios = [];
var audio;
var createprocess = setInterval(function() {
  if (system) {
    audio = new Process("audioAPI");
    clearInterval(createprocess);
  }
}, 1000);

class Audio {
  constructor(process, sources = [], autoplay = true, loop = false, muted = false) {
    this.id = system.guid();
    this.sources = sources;
    this.process = process.id;
    audios.push(this);
    const container = document.querySelector(".system-audio");
    const audioelement = document.createElement('audio');
    this.element = audioelement;
    audioelement.setAttribute("id", this.id);
    audioelement.setAttribute("process", process.id);
    if (autoplay === true) audioelement.setAttribute("autoplay", true);
    if (loop === true) audioelement.setAttribute("loop", true);
    if (muted === true) audioelement.setAttribute("muted", true);
    if (this.sources.count === 1) {
      audioelement.setAttribute("src", this.sources[0]);
    } else {
      this.sources.forEach(function(item) {
        const source = document.createElement('source');
        source.setAttribute("src", item);
        source.setAttribute("type", "audio/" + files.pathinfo(item).ext);
        audioelement.appendChild(source);
      });
    }
    audioelement.appendChild(document.createTextNode("Your browser does not support html5 audio"));
    container.appendChild(audioelement);
  }
  set(sources = []) {
    var element = this.element;
    this.sources = sources;
    if (this.sources.count === 1) {
      this.element.src = this.sources[0];
    } else if (this.sources.count !== 0) {
      this.element.innerHTML = "";
      this.sources.forEach(function(item) {
        const source = document.createElement('source');
        source.setAttribute("src", item);
        source.setAttribute("type", "audio/" + files.pathinfo(item).ext);
        element.appendChild(source);
      });
    } else {
      this.element.src = "";
    }
  }
  kill() {
    $("audio#" + this.id).remove();
    let i = audios.indexOf(this);
    audios.splice(i, 1);
    delete this;
  }
}

function get_audio(val, callback) {
  $(".system-audio audio").each(function(index, item) {
    processes.forEach(function(process) {
      if (process.id === $(item).attr("process")) {
        if (process.id === val || process.name === val) {
          callback(item);
        }
      }
    });
  });
}

function kill_audio(id) {
  audios.forEach(function(item) {
    if (item.process === id) {
      item.kill();
    }
  });
}

function list_audio() {
  $(".system-audio audio").each(function(index, item) {
    processes.forEach(function(process) {
      if (process.id === $(item).attr("process")) {
        console.log(process, item);
      }
    });
  });
}
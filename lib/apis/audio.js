var audios = [];

class Audio {
  constructor(process, sources = [], autoplay = true, loop = false, muted = false) {
    this.id = system.guid();
    this.sources = sources;
    this.process = process.id;
    audios.push(this);
    const container = document.querySelector(".system-audio");
    const audio = document.createElement('audio');
    this.element = audio;
    audio.setAttribute("id", this.id);
    audio.setAttribute("process", process.id);
    if (autoplay === true) audio.setAttribute("autoplay", true);
    if (loop === true) audio.setAttribute("loop", true);
    if (muted === true) audio.setAttribute("muted", true);
    if (this.sources.count === 1) {
      audio.setAttribute("src", this.sources[0]);
    } else {
      this.sources.forEach(function(item) {
        const source = document.createElement('source');
        source.setAttribute("src", item);
        source.setAttribute("type", "audio/" + files.pathinfo(item).ext);
        audio.appendChild(source);
      });
    }
    audio.appendChild(document.createTextNode("Your browser does not support html5 audio"));
    container.appendChild(audio);
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

function kill_audio(process) {
  audios.forEach(function(item) {
    if (item.process === process.id) {
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
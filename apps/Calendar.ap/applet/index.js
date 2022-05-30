/* I did not create this code. This javascript is from https://codepen.io/ceruulean/pen/xxbwPWO */
"use strict"
class Calendar{
  constructor(selectCallback, mini, selectMulti){
    this.root = document.createElement("div");
    this.root.className = `calendar-wrapper${mini?" mini":""}`;
    this.mini = mini;
    selectMulti? this.mode = "multiple":this.mode = "single";
    this.currentDates = new Set() //
    this.calendarsRenderedLeft = [];
    this.calendarsRenderedRight = [];
    let today = new Date();
    this.onselect = selectCallback;
    this.renderCalendar(today.getMonth() + 1, today.getFullYear(), null, today.getDate());
    this.transitionTime = getComputedStyle(document.documentElement).getPropertyValue('--transitionTime').replace(/ms/g, "");
  }
  
  mount(eleement){
    eleement.appendChild(this.root);
  }
/*
* month integer is 1 based (1-12)
* From https://stackoverflow.com/questions/222309/calculate-last-day-of-month-in-javascript
*/
static getDaysInMonth(m, y) {
    return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
}
/*
 Returns the day as 0 based integer (0-6, sunday-saturday)
*/
static getFirstDay(m, y){
  return new Date(y, m-1, 1).getDay();
}

static getLastDay(m, y){
  return new Date(y, m, 0).getDay();
}

static prevMonth(month){ if (month > 1) { return (month-1) } return 12};
static nextMonth(month){ if (month < 12){return month+1} return 1};
static prevYear(month, year){if (month > 1) {return year} return year-1};
static nextYear(month, year){if (month < 12){return year} return year+1};

static parseDate(MMDDYYYY){
  let arr = MMDDYYYY.split(/\//g);
  let n = (e) => {return Number.parseInt(e)};
  return {month: n(arr[0]), day: n(arr[1]), year: n(arr[2])}
}

static generateDaysLabels(mini){
  let a;
  let b = "";
  if (mini){a = Calendar.DAY["MINI"]} else {a = Calendar.DAY["FULL"]}
  for (let i = 0; i < 7; i++) {
    b += `<div>${a[i]}</div>`
  }
  return b;
}

  static get DAY(){
    return {
    FULL:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    MINI:["Su","Mo","Tu","We","Th","Fr","Sa"]
    }

    }
  static get MONTH(){
    return {   FULL: [
  "January" ,
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
],
    MINI: [
  "Jan" ,
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",]}
  }

  get monthLabel(){
    return Calendar.MONTH[this.mini? "MINI":"FULL"];
  }
  
  static dayTemplate(num, month, year, blank, classes){
     return `<div class="${blank? "blank " : ""}day ${classes? classes:""}" data-month="${month}" data-year="${year}" data-day="${num}">${num}</div>`;
  }

  previous(month, year){
    return this.renderCalendar(Calendar.prevMonth(month), Calendar.prevYear(month, year), "right");
  }

  next(month, year){
    return this.renderCalendar(Calendar.nextMonth(month), Calendar.nextYear(month, year), "left");
  }

  generateCalendarHTML(month, year, direction, indicateToday) {
    let html = "";
    let daysInMonth = Calendar.getDaysInMonth(month, year);
    if(!direction) {
      direction = "out";
    }

    let firstDay = Calendar.getFirstDay(month, year);
    if (firstDay > 0){ //first day is not a Sunday
      let p = Calendar.getDaysInMonth(Calendar.prevMonth(month), year);
      for (let f = 0; f < firstDay; f++) {
        html = Calendar.dayTemplate(p, Calendar.prevMonth(month), Calendar.prevYear(month, year), true) + html;
        p--;
      }
    };
    for (let i = 1; i <= daysInMonth; i++) {
      if (indicateToday == i)
      {html += Calendar.dayTemplate(i, month, year, false, "today");}
      else
      {html += Calendar.dayTemplate(i, month, year);}
    }
    let lastDay = Calendar.getLastDay(month, year);
    if (lastDay < 6){ //last day is not a Saturday
      let u = 1;
      for (let l = 6; l > lastDay; l--) {
        html += Calendar.dayTemplate(u, Calendar.nextMonth(month), Calendar.nextYear(month, year), true);
        u++;
      }
    };

    return    `<div class="calendar anim-slide-${direction}-in">
        <div class="mainheader">
          <div class="arrow left"></div>
          <div class="display month header">
          ${this.monthLabel[month - 1]} ${year}
          </div>
          <div class="arrow right"></div>
        </div>
      
        <div class="display week header">
        ${Calendar.generateDaysLabels(this.mini)}
        </div>
      
        <div class="days week">
        ${html}
        </div>
      </div>
      `
  }

  selectDate(target){
    if (this.mode == "single") {
    this.clearSelectedDates();
    target.classList.add("active");
    this.currentDates.add(target);
    } else if (this.mode == "multiple") {
      if (this.currentDates.has(target)) {
        target.classList.remove("active");
        this.currentDates.delete(target);
      } else {
        target.classList.add("active");
        this.currentDates.add(target);
      }
    }
    this.onselect(target);
}

  selectDateTransition(month, year, transition, e){
    if (transition == "next") {
      this.next(month, year).then((res)=>{
        this.selectDate(res.querySelector(`[data-month="${Calendar.nextMonth(month)}"][data-day="${e.target.innerHTML}"]`));
      })
    } else if (transition == "prev") {
      this.previous(month, year).then((res)=>{
        this.selectDate(res.querySelector(`[data-month="${Calendar.prevMonth(month)}"][data-day="${e.target.innerHTML}"]`));
      })
    }

  }

clearSelectedDates(){
  this.currentDates.forEach(t => {
    t.classList.remove("active");
  })
  this.currentDates.clear();
}

get selectedDates(){
  let result = "";
    this.currentDates.forEach(d=> {
      result += `${d.dataset.month}/${d.innerHTML}/${d.dataset.year}` + `\n`;
    })

  return result;
}

  renderCalendar(month, year, direction, indicateToday){
    return new Promise((resolve, reject) => {
      let newCalendar;

if (this.calendarsRenderedLeft.length > 0 && direction == "right") {
    newCalendar = this.calendarsRenderedLeft.pop();
    newCalendar.classList.add(`anim-slide-${direction}-in`);
} else if (this.calendarsRenderedRight.length > 0 && direction == "left") {
  newCalendar = this.calendarsRenderedRight.pop();
  newCalendar.classList.add(`anim-slide-${direction}-in`);
} else {
  newCalendar = document.createRange().createContextualFragment(this.generateCalendarHTML(month, year, direction, indicateToday));
  newCalendar.querySelector(".arrow.left").addEventListener("click", ()=> {
    this.previous(month, year);
    });
  newCalendar.querySelector(".arrow.right").addEventListener("click", ()=> {
    this.next(month, year);
    });  
        
    let daysNodes = newCalendar.querySelectorAll(".day:not(.blank)");
    daysNodes.forEach((n) => {n.addEventListener("click", (e)=>this.selectDate(e.target))
    })
    daysNodes = newCalendar.querySelectorAll(`[data-month="${Calendar.prevMonth(month)}"][data-year="${Calendar.prevYear(month, year)}"]`);
    daysNodes.forEach((n) => {n.addEventListener("click", (e)=>this.selectDateTransition(month, year, "prev", e))
    })
    daysNodes = newCalendar.querySelectorAll(`[data-month="${Calendar.nextMonth(month)}"][data-year="${Calendar.nextYear(month, year)}"]`);
    daysNodes.forEach((n) => {n.addEventListener("click", (e)=>this.selectDateTransition(month, year, "next", e))
    })
}

    if (this.root.children.length > 0) {
      this.root.appendChild(newCalendar);
      this.root.children[0].classList.add(`anim-slide-${direction}-out`);
      setTimeout(()=>{
        if (direction == "right") {
          this.calendarsRenderedRight.push(this.root.children[0]);
        } else if (direction == "left") {
          this.calendarsRenderedLeft.push(this.root.children[0]);
        }
        this.root.children[0].className = "calendar";
        this.root.children[0].remove();
        this.root.children[0].className = "calendar";
        resolve(this.root.children[0]);
      }, this.transitionTime)
    } else {
      this.root.appendChild(newCalendar);
      this.root.children[0].className = "calendar";
      resolve(this.root.children[0]);
    }

    })
  }
}

/* end Class definition

******** Start main
*/

let inputDate = document.getElementById("input-date");
//let inputMode = document.getElementById("input-mode");


let init = () => {
  let myCal = new Calendar(
    function(){
      //inputDate.value = this.selectedDates
    }, true);
  myCal.mount(document.getElementById("root"));

  /*inputMode.addEventListener("change", (e)=>{
    if (e.target.checked) {
      myCal.clearSelectedDates();
      inputDate.value = "";
      myCal.mode = "multiple"
    } else {
      myCal.clearSelectedDates();
      inputDate.value = "";
      myCal.mode = "single"
    }

  }) */

}

init();

function close() {
	Window.close();
}
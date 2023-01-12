const BUISNESS_HOURS_OPENED = 9;
const BUISNESS_HOURS_CLOSED = 18;
const PAST = "past";
const PRESENT = "present";
const FUTURE = "future";
let clock = dayjs();
let currentHour = clock.hour();


//this saves the text area value for the time block in local storage
function handleSaveBtn(target) {
  const timeBlockDiv = $(target).parentsUntil("#buisness-hours"); //traversing up to get .time-block div
  const textAreaValue = timeBlockDiv.children(".description").val(); //gets the text area value
  localStorage.setItem(timeBlockDiv.attr("id"), textAreaValue) //this saves it to the local storage
}

//runs the clock
function setClock() {
  setInterval(() => { //run the code every second
    clock = clock.add(1, "second"); // adds 1 second to the clock
    updateClockText(); //renders the clock

    if (clock.hour() !== currentHour) { // if the hour changed then run handleHourChange function
      currentHour = clock.hour(); // if the hour did change then we need to update the current hour globally
      handleHourChange(clock.hour());
    }
  }, 1000);
}

function updateClockText() {
  $("#currentDay").text(clock.format("dddd, MMMM D, YYYY. h:mm:ss a"));
}

function handleHourChange(hour) { // the point of this function is to handle the hour change and alternate the tense css classes 
  $(".time-block").each(function() {
    const timeBlockId = $(this).attr("id"); //grabs the hour id
    const timeBlockHour = timeBlockId.split("-")[1]; //splits the id into an array and gets the hour string
    const previousTimeTense = $(this).attr("class").split(" ").find((className) => [ PAST, PRESENT, FUTURE].includes(className));
    const timeTense = getTimeTense(Number(timeBlockHour), hour); //grabbing the string and turning it into a number
    const hourChanged = !$(this).hasClass(timeTense); //the hour changed if the timeTense is not included in the class
    
    if (hourChanged) {
      $(this).toggleClass(`${previousTimeTense} ${timeTense}`); //if the hour did change it's gonna remove the previousTimeTense value and add the timeTense value into the class
    }
  })
}

//returns the correct time tense 
function getTimeTense(hour, currentHour) {
  if (!currentHour) { 
    currentHour = dayjs().hour()
  }
  
  if (hour < currentHour) {
    return PAST
  } else if (hour === currentHour) {
    return PRESENT
  } else if (hour > currentHour) {
    return FUTURE
  }
}

function createHourBlock(hour, hourFormat) { //this creates the hour blocks by passing in stuff
  const hourID = `hour-${hour}`
  const existingEvent = localStorage.getItem(hourID) || "";
  return (`
    <div id="${hourID}" class="row time-block ${getTimeTense(hour)}">
      <div class="col-2 col-md-1 hour text-center py-3">${hourFormat}</div>
      <textarea class="col-8 col-md-10 description" rows="3">${existingEvent}</textarea>
      <button class="btn saveBtn col-2 col-md-1" aria-label="save">
        <i class="fas fa-save" aria-hidden="true"></i>
      </button>
    </div>
  `)
}

//renders all time blocks from 9am to 5pm
function renderBuisnessHours() {
  for (let i = BUISNESS_HOURS_OPENED; i < BUISNESS_HOURS_CLOSED ; i++) { // looping from 9-18 because those are the buisness hours in military time
    const hourFormat = dayjs().hour(i).format("ha") // dayjs to get the 12-hour format
    $("#buisness-hours").append(createHourBlock(i, hourFormat)) // displays the return value of the createHourBlock function
  }
}

//this waits for the DOM to load, when the DOM is loaded our hardcoded HTML elements are rendered which allows us to manipulate the DOM
$(function () {
  setClock()
  updateClockText()
  renderBuisnessHours()
  $("#buisness-hours").click(function(event) {
    const isSaveBtn = $(event.target).hasClass("saveBtn") || $(event.target).hasClass("fa-save");
    if (isSaveBtn) {
      handleSaveBtn(event.target)
    }
  })
});

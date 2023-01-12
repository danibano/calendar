// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

const BUISNESS_HOURS_OPENED = 9
const BUISNESS_HOURS_CLOSED = 25
const PAST = "past"
const PRESENT = "present"
const FUTURE = "future"
let clock = dayjs()
let currentHour = clock.hour()

function handleSaveBtn(target) {
  const timeBlockDiv = $(target).parentsUntil("#buisness-hours")//traversing up to get .time-block div
  const textAreaValue = timeBlockDiv.children(".description").val()
  localStorage.setItem(timeBlockDiv.attr("id"), textAreaValue)
}


function setClock() {
  setInterval(() => { //run the code every second
    clock = clock.add(1, "second") // adds 1 second to the clock
    updateClockText()

    if (clock.hour() !== currentHour) { // if the hour changed then run handleHourChange function
      currentHour = clock.hour() // if the hour did change then we need to update the current hour globally
      handleHourChange(clock.hour())
    }
  }, 1000)
}

function updateClockText() {
  $("#currentDay").text(clock.format("dddd, MMMM D, YYYY. h:mm:ss a"))
}

function handleHourChange(hour) { // the point of this function is to handle the hour change and alternate the tense css classes 
  $(".time-block").each(function() {
    const timeBlockId = $(this).attr("id") //grabs the hour id
    const timeBlockHour = timeBlockId.split("-")[1] //splits the id into an array and gets the hour string
    const previousTimeTense = $(this).attr("class").split(" ").find((className) => [ PAST, PRESENT, FUTURE].includes(className))
    const timeTense = getTimeTense(Number(timeBlockHour), hour) //grabbing the string and turning it into a number
    const hourChanged = !$(this).hasClass(timeTense) //the hour changed if the timeTense is not included in the class
    
    if (hourChanged) {
      $(this).toggleClass(`${previousTimeTense} ${timeTense}`) //if the hour did change it's gonna remove the previousTimeTense value and add the timeTense value into the class
    }
  })
}


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

function renderBuisnessHours() {
  for (let i = BUISNESS_HOURS_OPENED; i < BUISNESS_HOURS_CLOSED ; i++) { // looping from 9-18 because those are the buisness hours in military time
    const hourFormat = dayjs().hour(i).format("ha") // dayjs to get the 12-hour format
    $("#buisness-hours").append(createHourBlock(i, hourFormat)) // displays the return value of the createHourBlock function
  }
}

$(function () {
  setClock()

  updateClockText()
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
 
  renderBuisnessHours()

  $("#buisness-hours").click(function(event) {
    const isSaveBtn = $(event.target).hasClass("saveBtn") || $(event.target).hasClass("fa-save");
    if (isSaveBtn) {
      handleSaveBtn(event.target)
    }
  })
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?

});

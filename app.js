// Adding dates to the calendar
const dates = document.querySelectorAll(".date");


dates.forEach((date, i) => {
    let dat = new Date();
    dat.setDate(dat.getDate() + (i - 3));
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December' ];
    let daysOfWeek = ['Sun', 'Mon', "Tue", "Wed", "Thu", "Fri", "Sat"];
    date.innerHTML = `
    <p class="week-day"> ${daysOfWeek[dat.getDay()]} <span class="full-date">${dat.getDate()} ${months[dat.getMonth()]} ${dat.getFullYear()}</span></p>
  `;
  if(dat.getDate() == new Date().getDate()){
    date.parentNode.classList.add('today');
    
}
})

//Habits list

//Fetching habits
let habits = [];

fetch('habits.json')
.then(res => res.json())
.then(data => data.forEach(habit => habits.push(habit)))


// Printing habits list
const habitsList = document.querySelector('.habits ul');

function printHabitsList(){
    habitsList.innerHTML = habits.map((habit, i) => {
       return `<li class="habit" data-index=${i}>
       <div class="color list"></div>
       <span class="title">${habit.title}</span>
   <p class="time">${habit.time / 60 >= 1 ? habit.time/60 + " min" : habit.time + ' sec'}</p>
   </li>`
    }).join("")
    
    const habitColor = document.querySelectorAll(".habit .color");
    habitColor.forEach((color, i) => {
        color.style.backgroundColor = `${habits[i].color}`
    });

   
}


window.addEventListener('load', () => {
    printHabitsList();
    showHabitInfo(habits, 2);
});

    
// Selecting habit
habitsList.addEventListener('click', (e) => {
    let currId;
    e.target.dataset.index ? currId = e.target.dataset.index : currId = e.target.parentNode.dataset.index;

   showHabitInfo(habits, currId);

})


//Habit details

//Printing selected habit details 

const habitColor = document.querySelector('.habit-color');
const habitTitle = document.querySelector('.habit-title');
const habitTime = document.querySelector('.habit-time');
const habitDescription= document.querySelector('.habit-description');
const habitSound = document.querySelector('.sound');

const playBtn = document.querySelector('.play-btn');
const playPauseImg = playBtn.querySelector('img');
const outline = document.querySelector('.moving-outline circle');
const timeDisplay = document.querySelector('.time-display');
const habitInfo = document.querySelector(".habit-info");
const habitTimer = document.querySelector('.habit-timer');
const startScreen = document.querySelector('.start');

function showHabitInfo(arr, id){
habitInfo.style.display = "block";
habitTimer.style.display = "flex";
startScreen.style.display = 'none';
    let habit = arr[id];

habitTitle.textContent =`${habit.title}`;
habitTitle.setAttribute('id',`${habit.id}`);
habitTime.textContent =`${habit.time / 60 >= 1 ? habit.time/60 + " min" : habit.time + " sec"}`;
habitTime.setAttribute('data-time', `${habit.time}`)
habitDescription.textContent =`${habit.description}`;
habitColor.setAttribute('data-color', `${habit.color}`)
habitSound.setAttribute("src", `/sounds/${habit.sound}.mp3`);

const outline = document.querySelector('.moving-outline-circle');
outline.setAttribute('stroke', `${habit.color}`);
habitColor.style.backgroundColor = `${habit.color}`


const outlineLength = outline.getTotalLength();
outline.style.strokeDasharray = outlineLength;
outline.style.strokeDashoffset = outlineLength;

let duration = habitTime.dataset.time;
let minutes =  Math.floor(duration / 60);
let seconds = Math.floor(duration % 60);
seconds = seconds < 10 ? '0' + seconds : seconds;
timeDisplay.textContent = `${minutes}:${seconds}`


habitSound.ontimeupdate = () => {
    let currTime = habitSound.currentTime;
    let elapsed = duration - currTime;
    let seconds = Math.floor(elapsed % 60);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    let minutes = Math.floor(elapsed / 60);

//Animating the circle
let progress = outlineLength - (currTime / duration) * outlineLength;
outline.style.strokeDashoffset = progress;
timeDisplay.textContent = `${minutes}:${seconds}`

if(currTime >= duration){
    habitSound.pause();
    habitSound.currentTime = 0;
    playPauseImg.src = './img/play.svg';
    markAsDone();
}
}


}


//Playing/pausing sound
playBtn.addEventListener('click', () => {
    if(habitSound.paused){
     habitSound.play();
     playPauseImg.src = './img/pause.svg';
 }
     else{
         habitSound.pause();
         playPauseImg.src = './img/play.svg';
     }
 });
 

//More options 
const markDoneBtn = document.querySelector('.mark-done-btn');
const deleteBtn = document.querySelector('.delete-btn');
const editBtn = document.querySelector('edit-btn');

//Adding completed habit to the calendar 

markDoneBtn.addEventListener('click', () =>{
    markAsDone();
    })

function markAsDone() {
    let currHabit = habitColor.dataset.color;
    const doneHabits = document.querySelector('.today > .done-habits');
    if(doneHabits.querySelector(`[data-color-calendar="${currHabit}"]`) == null) {
       
        let doneHabit = document.createElement('div');
        doneHabit.className = `done-habit color`;
        doneHabit.setAttribute('data-color-calendar', `${currHabit}`);
        doneHabits.appendChild(doneHabit) 
        const doneHabitLastChild = document.querySelector('.today .done-habit:last-child');
        doneHabitLastChild.style.backgroundColor = currHabit;
   }
  }


  //Deleting habit

deleteBtn.addEventListener('click', () =>{
    deleteHabit();
    })

function deleteHabit() {
    let currHabit = habitTitle.textContent;
    habits= [...habits].filter(habit => habit.title != currHabit);
    startScreen.style.display = 'flex';
    habitInfo.style.display = "none";
    habitTimer.style.display = "none";

    printHabitsList();
}




//Opening 'Add new habit' form

const addNewBtn = document.querySelector('.add-new-btn');
const modalAddNew = document.querySelector('.modal-add-new');
const modalCloseBtn = document.querySelector('.close-modal-btn');

addNewBtn.addEventListener('click', () => {
    const currHabits = document.querySelectorAll('.habit').length;
    currHabits < 6 ? modalAddNew.style.display = "flex" : alert('We recommend to track up to 6 habits');

})

window.addEventListener('click', (e) => {
   if(e.target == modalAddNew){
   modalAddNew.style.display = "none" ;
   }
})

modalCloseBtn.addEventListener('click', () => {
    modalAddNew.style.display = "none";
})


//Creating and adding new habit to habits list

const newHabitForm = document.querySelector('.form-add-new');

newHabitForm.addEventListener('submit', addNewHabit);

function addNewHabit(e) {
    e.preventDefault();
    const title = (this.querySelector('.title-input')).value;
    const color = (this.querySelector('[type="color"]')).value;
    const description = (this.querySelector('[name="habit-description"]')).value;
    const time = (this.querySelector('[name="habit-time"]')).value;
    const sound = document.querySelector('[name="music"]:checked').value;
    
    let habit = {
        id: habits.length,
        title,
        color,
        description, 
        time: time * 60,
        sound: `${sound}`
    }

    habits.push(habit)
    printHabitsList();
    showHabitInfo(habits, habit.id);
    this.reset();
    modalAddNew.style.display = "none";
    
    

}




// Basic info
var info = {
  score: 0,
  level: 0,
  lives: 0,
  time: 0,
  numberOfWeeds: 0,
  timeout: '',
  ranking_list: []
}
// DOM elements
var divs = {
  game_boxes: '',
  live_boxes: '',
  start_btn: '',
  score_div: '',
  level_div: '',
  modal_div: '',
  close_btn: '',
  submit_btn: '',
  input_field: '',
  final_score: '',
  rank_list: ''
}

// On page load
window.onload = function() {
  // Get the game box DOM elements
  divs.game_boxes = document.querySelectorAll('.game-box');
  // Add an event listener to each div
  for(const box of divs.game_boxes) {
    box.addEventListener('click', clicked);
  }
  // Get the live img containers
  divs.live_boxes = document.querySelectorAll('.lv-img');

  // Get the start game button
  divs.start_btn = document.getElementById('start_button');
  // Add an event listener to the button
  divs.start_btn.addEventListener('click', startNewGame);

  // Get the score div
  divs.score_div = document.getElementById('h1-score');
  // Get the Level div
  divs.level_div = document.getElementById('h1-level');

  // Get the modal
  divs.modal_div = document.getElementById('myModal');

  // Get the modal close button
  divs.close_btn = document.getElementsByClassName('close');
  // Add an event listener to the close button
  divs.close_btn[0].addEventListener('click', standby);

  // Get the modal submit button
  divs.submit_btn = document.getElementById('submit-btn');
  // Add an event listener to the button
  divs.submit_btn.addEventListener('click', submitInfo);

  // Get the modal input field
  divs.input_field = document.getElementById('name-input');

  // Get the modal final score element
  divs.final_score = document.getElementById('final-score');

  // Get the ranking list container
  divs.rank_list = document.getElementById('ranking-box');
}

/**
  Function that takes the value from the input field and stores it in to the
  ranking list variable. If the value is null or empty string, an alert is
  triggered and the user is asked to enter a valid name.
*/
function submitInfo() {
  // Input
  var name = divs.input_field.value;
  // Check for empty name
  if(name == '' || name == null) {
    // Alert warning
    alert("Please enter a valid name!");
  }
  else {
    // Create a key-value pair and store it in the array
    var tmp = {key: divs.input_field.value, value: info.score};
    info.ranking_list.push(tmp);
    // Set the input to null
    divs.input_field.value = '';
    // Update the rank list
    populateRankingList();
    // Stop game
    standby();
  }
}

/**
  Function that populates the ranking list container with the top 15 sorted
  records.
*/
function populateRankingList() {
  // Clear the old data in the container
  divs.rank_list.innerHTML = '';
  // Sort the records by value
  info.ranking_list = info.ranking_list.sort(function(a, b){ return b.value - a.value; });
  // Create a paragraph for the top 15 gamers
  if(info.ranking_list.length > 0){
    if(info.ranking_list.length <= 15){
      var tmp = 1;
      for(const rec of info.ranking_list) {
        var node = document.createElement("P");
        var textnode = document.createTextNode(tmp + ". " + rec.key + " - Score: " + rec.value);
        node.appendChild(textnode);
        divs.rank_list.appendChild(node);
        tmp++;
      }
    }
    else {
      for(var i = 0; i < 15; i++) {
        var node = document.createElement("P");
        var textnode = document.createTextNode(i+1 + ". " + info.ranking_list[i].key + ": " + info.ranking_list[i].value );
        node.appendChild(textnode);
        divs.rank_list.appendChild(node);
      }
    }
  }
}

/**
  Funcion that stops and invokes the reset.
*/
function standby() {
  // Stops the wave generation interval
  clearInterval(info.timeout);
  // If the modal is shown, it gets hidden
  if(divs.modal_div.style.display != "none") {
    divs.modal_div.style.display = "none";
  }
  // Resets the lives, score and level
  info.lives = 3;
  info.score = 0;
  info.level = 1;

  // Resets the game boxes
  resetGameBoxes();
  // Updates the graphics
  updateGraphics();
}

/**
  Function that starts a new game.
*/
function startNewGame() {
  // Clears the wave generation timeout
  clearInterval(info.timeout);
  // Hides the modal if displayed
  if(divs.modal_div.style.display != "none") {
    divs.modal_div.style.display = "none";
  }
  // Resets the score, level and lives
  info.score = 0;
  info.level = 1;
  info.lives = 3;
  // Starts the wave
  startWave();
}

/**
  Function that spawns different patterns of weeds based on the set
  difficulty.
*/
function startWave() {
  // Resets the boxes to initial state
  resetGameBoxes();
  // Sets the difficulty
  setDifficulty(info.level);
  // Sapwns the weeds
  updateWeeds(randomizeElements());
  // Updates the graphics
  updateGraphics();
  // Set an interval based on the difficulty
  info.timeout = setTimeout(startWave, info.time);
}

/**
  Funciton that terminates the game and calls the modal.
*/
function gameOver() {
  // Clear the interval
  clearInterval(info.timeout);
  // Display the modal
  divs.modal_div.style.display = "block";
  // Update the final score element
  divs.final_score.innerText = "Your final score is: " + info.score;
}

/**
  Function that is triggered by clicking on a game box. A score is added or
  a life is lost based on the state of the container.
*/
function clicked(e) {
  // If the state is 1 then a score is added
  if(e.target.getAttribute('state') == 1) {
    info.score++;
    // Disable container
    e.target.setAttribute('state', 3);
  }
  // If the state is 2 reduce the lives
  else if(e.target.getAttribute('state') == 2) {
    info.lives--;
    // Disable the container
    e.target.setAttribute('state', 3);
  }
  else {
    //Not clickable
  }
  // Recalculate the level based on the aquired score
  info.level = ((info.score/50) | 0) + 1;
  // If all lives are lost the game finishes
  if(info.lives == 0) {
    updateGraphics();
    setTimeout(gameOver, 100);
  }
  // Update the graphics
  updateGraphics();
}

/**
  Function that sets all game boxes to initial state.
*/
function resetGameBoxes() {
  for(const box of divs.game_boxes) {
    box.setAttribute('state', 0);
  }
}

/**
  Function that updates the graphics based on the state of the containers.
*/
function updateGraphics() {
  // Update the game boxes
  for(const box of divs.game_boxes) {
    if(box.getAttribute('state') == 0) {
      box.style.backgroundImage = "";
      box.style.opacity = "1";
    }
    else if(box.getAttribute('state') == 1) {
      box.style.backgroundImage = "url('./assets/plant_evil.png')";
      box.style.opacity = "1";
    }
    else if(box.getAttribute('state') == 2) {
      box.style.backgroundImage = "url(./assets/plant_good.png)";
      box.style.opacity = "1";
    }
    else {
      box.style.opacity = "0.5";
    }
  }

  // Update lives
  if(info.lives == 0) {
    for(const box of divs.live_boxes) {
      box.src = "./assets/heart_broken.png";
      box.style.opacity = "0.9";
    }
  }
  else if(info.lives == 1) {
    divs.live_boxes[0].src = "./assets/heart_broken.png";
    divs.live_boxes[0].style.opacity = "0.9";
    divs.live_boxes[1].src = "./assets/heart_broken.png";
    divs.live_boxes[1].style.opacity = "0.9";
  }
  else if(info.lives == 2) {
    divs.live_boxes[0].src = "./assets/heart_broken.png";
    divs.live_boxes[0].style.opacity = "0.9";
  }
  else {
    for(const box of divs.live_boxes) {
      box.src = "./assets/heart.png";
      box.style.opacity = "1";
    }
  }

  // Update score and level
  divs.score_div.innerText = info.score;
  divs.level_div.innerText = info.level;
}

/**
  Function that updates the div state based on the
  weed idx.
*/
function updateWeeds(weedIdxs) {
  // Change the state for each weed div
  for(const box of divs.game_boxes) {
    box.setAttribute('state', 2);
  }
  // Set the weed state
  for(var i = 0; i < weedIdxs.length; i++) {
    divs.game_boxes[weedIdxs[i]].setAttribute('state', 1);
  }
}

/**
  Function that sets the difficulty based on the level.
*/
function setDifficulty(level) {
  switch(level) {
    case 1:
      info.time = 2000;
      info.numberOfWeeds = 9;
      break;
    case 2:
      info.time = 1700;
      info.numberOfWeeds = 7;
      break;
    case 3:
      info.time = 1400;
      info.numberOfWeeds = 5;
      break;
    case 4:
      info.time = 1100;
      info.numberOfWeeds = 3;
      break;
    default:
      console.log("default");
      info.time = 700;
      info.numberOfWeeds = 1;
  }
}

/**
  Function that generates an array of random indeces.
*/
function randomizeElements() {
  var weeds = Math.floor(Math.random() * info.numberOfWeeds);
  
  if(weeds == 0) {
    weeds = 1;
  }
  var weedsIdxs = [];

  var tmp = 0;
  for(var i = 0; i < weeds; i++) {
    if(weedsIdxs.length == 0) {
      tmp = Math.floor(Math.random() * 9);
      weedsIdxs.push(tmp);
    } else {
      tmp = Math.floor(Math.random() * 9);

      while(inArray(weedsIdxs, tmp)) {
        tmp = Math.floor(Math.random() * 9);
      }
      weedsIdxs.push(tmp);
    }
  }

  return weedsIdxs;
}

function inArray(array, value) {
  var bool = false;

  for(var i = 0; i < array.length; i++) {
    if(array[i] == value) {
      bool = true;
    }
  }
  return bool;
}

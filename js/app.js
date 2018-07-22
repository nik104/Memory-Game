
var cardTypes=["fa-bolt","fa-birthday-cake","fa-bus","fa-cocktail","fa-bug","fa-football-ball"]; //i will store here all card symbols
var difficulty = ""; // reset difficulty
var rightGuessCounter=0; //count right guesses
var deck = $('.deck');// will point to deck (for convenience)
var stars= $(".stars");// will point to the stars (for convenience)
var scorePanel=$(".score-panel");// will point to score panel (for convenience)
var container=$(".container");
// this will hold the number of pairs set for each difficulty (can be changed but will make the game ugly)
var numberOfPairs={
  easy: 3,
  medium: 4,
  hard: 6
};
var chosenNumberOfPairs=0;// reset the chosen number of pairs for the game
var moves=0 //reset moves left
var openCards=[]// reset open cards list
var star=0 //reset number of stars
var twoWrong=0; //count 2 wrong guess (in order to remove 1 star)
var timer={    // contain time passed from start of game.
  seconds: 0,
  minutes: 0,
  hours: 0
};
var time; // will contain the time passed.
var starsHtml="";


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
*generate card dec given difficulty and cards from the cards bank
*(currently up to 6 pairs maximum) added the card number to diffrintiate between 1st and 2nd card of pair
*/
function generateCards(numberOfCards,cardBank){
  var cardLocation,cardCounter
  cardLocation= $(".deck")
  for(cardCounter=0;cardCounter<numberOfCards;cardCounter++){
      cardLocation.append("<li class=\"card " + cardCounter + " \"><i class=\"fa " + cardBank[cardCounter]+ "\"></i></li>");
    }
}


//creates array of 2 from each symbol from the cardsTypes array
function deckArray(numberOfPairs,cardTypes){
  var cardCounter,cardDeck=[],cardTypePointer=0;
  for(cardCounter=0;cardCounter<numberOfPairs;cardCounter++){
    cardDeck.push(cardTypes[cardTypePointer]);
    cardDeck.push(cardTypes[cardTypePointer]);
    cardTypePointer++;
  }
  return(cardDeck);
}


/*
*in case of wrong guess will hide the 2 shown cards, reset open cards list
*remove 1 move , if no moves left will end the game with lost.
*/
function wrongGuess(){
  openCards[0].removeClass("open show");
  openCards[1].removeClass("open show");
  openCards=[];
  moves++;
  $(".moves").remove();
  scorePanel.append("<div class=\"moves\"> " + String(moves)+ "-Moves</div>");
  if(moves%2==0 && star>1){
      stars.children().first().remove();
      star--;
  };
}

/*
*in case of right guess will match 2 shown cards, reset open cards list
*add 1 to right guess counter , if guess counter is equal to number of pairs in
*game will end game with victory.
*/
function rightGuess(){
  openCards[0].addClass("match");
  openCards[1].addClass("match");
  openCards=[];
  rightGuessCounter++;
  moves++;
  $(".moves").remove();
  scorePanel.append("<div class=\"moves\"> " + String(moves)+ "-Moves</div>");
  if(rightGuessCounter==chosenNumberOfPairs){ //this is victory screen
    modal.style.display = "block";
    stopTimer();
    $(".card").remove();
    timeTaken();
    for(i=0;i<star;i++){
      starsHtml+="<i class=\"fa fa-star\"></i>";
    }
    $(".modal-content .stars").html(starsHtml);
    $(".modal-content").append("<br><br><div class=\"restart\">Restart - <i class=\"fa fa-redo\"></i></div>");
  //  $(".modal-content").append("<span class=\"close\">&times;</span>");
  }
}

/*
*if restart button pushed will reset all variables and set main menu again
*/

function restart(){
  container.find(".restart").bind("click", function (){
    rightGuessCounter=0;
    moves=0
    openCards=[];
    twoWrong=0;
    star=0;
    moves=0;
    starsHtml=""
    stopTimer()
    $(".timer").html("00:00:00");
    timer.seconds=0;
    timer.minutes=0;
    timer.hours=0;
    $(".card").remove();
    $(".moves").remove();
    stars.children().remove();
    $(".menu").remove();
    game();
  });
}

/*
*wait for card picks and check for matches
 */
 function round(){
   deck.find(".card").bind("click", function (){
     if(openCards.length<2 && $(this).is(openCards[0])!= true)
     {
       $(this).addClass("open show");
       openCards.push($(this));
     }
     if(openCards.length==2){
       if(openCards[0].html()==openCards[1].html()){
         rightGuess();
       }
       if(openCards[0].html()!=openCards[1].html()){
         setTimeout(function(){wrongGuess()},1300); //can change the time both cards shown from here
       }
     }
   })

 }

/*
*proparly display the time, maintain 00:00:00 format
*/

function setTimer(){
    if(timer.seconds<59){
      timer.seconds++;
    }
    if(timer.seconds==59){
      timer.seconds=0;
      if(timer.minutes<59){
        timer.minutes++;
      }
      if(timer.minutes==59){
        timer.hours++;
     }
    }
    $(".timer").html("");
    if(timer.minutes==0&&timer.hours==0){
      if(timer.seconds<10){
          $(".timer").html("00:00:0"+timer.seconds);
        }
        else{
          $(".timer").html("00:00:"+timer.seconds);
        }
    }
    if(timer.minutes!=0&&timer.hours==0){
      if(timer.minutes<10){
          $(".timer").html("00:0"+timer.minutes+":"+timer.seconds);
        }
        else{
          $(".timer").html("00:"+timer.minutes+":"+timer.seconds);
        }
    }
    if(timer.minutes!=0&&timer.hours!=0){
      if(timer.hours<10){
          $(".timer").html("0"+timer.hours+":"+timer.minutes+":"+timer.seconds);
        }
        else{
          $(".timer").html(timer.hours+":"+timer.minutes+":"+timer.seconds);
        }
    }
}



//show time in victory screen same format as setTime but it will show it in different place
function timeTaken(){
  if(timer.minutes==0&&timer.hours==0){
    if(timer.seconds<10){
        $(".modal-content").append("time taken - 00:00:0"+timer.seconds+"<br><br>");
      }
      else{
        $(".modal-content").append("time taken - 00:00:"+timer.seconds+"<br><br>");
      }
    }
    if(timer.minutes!=0&&timer.hours==0){
      if(timer.minutes<10){
        $(".modal-content").append("time taken - 00:0"+timer.minutes+":"+timer.seconds+"<br>");
      }
      else{
        $(".modal-content").append("time taken - 00:"+timer.minutes+":"+timer.seconds+"<br><br>");
      }
    }
    if(timer.minutes!=0&&timer.hours!=0){
      if(timer.hours<10){
        $(".modal-content").append("time taken - 0"+timer.hours+":"+timer.minutes+":"+timer.seconds+"<br><br>");
      }
      else{
        $(".modal-content").append("time taken - "+timer.hours+":"+timer.minutes+":"+timer.seconds)+"<br><br>";
      }
    }
}


//show the time every second

function displayTimer() {
    time = setInterval(setTimer, 1000);
}

// stop counting the time when needed.

function stopTimer(){
  clearInterval(time);
}

/*
*create stars and moves depending on difficulty picked
*/
function loseMove(){
  scorePanel.append("<div class=\"moves\">" + moves + " -Moves</div>");
  for(i=0;i<star;i++){
    stars.append("<li><i class=\"fa fa-star\"></i></li>");
  }
}

/*
*create main manu where you can pick difficulty
*/

function menu(){
  $(".deck").append("<div class=\"menu\">");
  $(".menu").append("<div><h1 class=\"difficulty\">Pick difficulty</h1>");
  $(".menu").append("<div class=\"choices\">");
  $(".choices").append("<button class=\"button\">Easy</button>");
  $(".choices").append("<button class=\"button\">Medium</button>");
  $(".choices").append("<button class=\"button\">Hard</button></div></div></div>");
}

/*
*will run the game, first call menu to create the menu , when chosen will generate
*cards depending on the dificulty, will generate moves using loseMove and start
*round
*/


function game(){
  menu();
  $(".button").bind("click",function(){
    difficulty = $(this).text();
    $(".menu").remove();
    if (difficulty=="Easy"){
      shuffledDeck = shuffle(deckArray(numberOfPairs.easy,cardTypes));
      generateCards(numberOfPairs.easy*2,shuffledDeck);
      chosenNumberOfPairs=numberOfPairs.easy;
      star=3;
      displayTimer();
      loseMove();
      round();
    }
    if (difficulty=="Medium"){
      shuffledDeck = shuffle(deckArray(numberOfPairs.medium,cardTypes));
      generateCards(numberOfPairs.medium*2,shuffledDeck);
      chosenNumberOfPairs=numberOfPairs.medium;
      star=4;
      displayTimer();
      loseMove();
      round();
    }
    if (difficulty=="Hard"){
      shuffledDeck = shuffle(deckArray(numberOfPairs.hard,cardTypes));
      generateCards(numberOfPairs.hard*2,shuffledDeck);
      chosenNumberOfPairs=numberOfPairs.hard;
      star=5;
      displayTimer();
      loseMove();
      round();
    }
  });
}

//running the game and the restart option
game();
restart();



//modal based on https://www.w3schools.com

// Get the modal
var modal = document.getElementById('victoryModal');

// Get the button that opens the modal need remove
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the <span> element that closes the modal
var redo = document.getElementsByClassName("restart")[0];

// When the user clicks the button, open the modal need remove
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

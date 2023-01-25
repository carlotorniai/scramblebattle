// Game setup
// TO DO
// make sure it works with restarting by : setting the score to zero, 
// the start again and have a function to reinizialize words
// fix the timer upon strting a raound
// all the freaking visuals need to change

var score = 0;
var wordList = [];
var startTime;
var selectedWord;
var gameDuration = 10000; // 20 seconds in milliseconds
var round = 1;
var intervalId;

fetch("./parole.txt")
  .then(response => response.text())
  .then(data => {
    var words = data.split("\n");
    for(var i = 5; i<=15; i++){
      var filteredWords = words.filter(word => word.length === i);
      var selectedWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
      wordList.push(selectedWord);
      if (wordList.length === 10) {
        break;
      }
    }
    startGame();
  })
  .catch(error => console.log(error));

// Scramble a word
function scramble(word) {
    var scrambledWord = "";
    var letters = word.split("");
    while (letters.length > 0) {
        var randomIndex = Math.floor(Math.random() * letters.length);
        scrambledWord += letters[randomIndex];
        letters.splice(randomIndex, 1);
    }
    return scrambledWord;
}

function startGame() {
    startTime = new Date();
    if (round > 10) {
        message.innerHTML = "Game over ";
        clearInterval(intervalId);

        // var replay = prompt("Do you want to replay? Press 'y' for yes, 'n' for no.");
        // if (replay === 'y') {
        // round = 1;
        // score = 0;
        // startGame();
        // } else {
        // message.innerHTML = "Thank you for playing! Your final score is: " + score;
        // }
        return;
    }

    // update round and word length
    document.getElementById("round").innerHTML = "Round " + round;
    document.getElementById("word-length").innerHTML = "Word Length: " + wordList[round-1].length;
    selectedWord = wordList[round-1];
    console.log(selectedWord)
    var scrambleWord = scramble(selectedWord);
    console.log(scrambleWord)
    // create a timer
    var timer = document.getElementById("timer");
    var remainingTime = gameDuration / 1000;
    intervalId = setInterval(function(){
        remainingTime--;
        timer.innerHTML = remainingTime;
        if(remainingTime === 0){
            message.innerHTML = "Time's up. The correct word was " + selectedWord;
            clearInterval(intervalId);
            round++;
            setTimeout(startGame, 2000);
        }
    }, 1000);

    // Display scramble word to player
    var word = document.getElementById("word");
    word.innerHTML = "";

    var letters = scrambleWord.split('');
    letters.forEach(function(letter){
        var letterElem = document.createElement('span');
        letterElem.innerText = letter;
        letterElem.classList.add('letter');
        word.appendChild(letterElem);
    });

    // clear the message
    document.getElementById("message").innerHTML = "";

    // clear the input 
    document.getElementById("answer").value = "";

    // check the answer
    document.getElementById("submit").removeEventListener("click", checkAnswer);
    document.getElementById("submit").addEventListener("click", checkAnswer);
}
function checkAnswer() {
    var playerInput = document.getElementById("answer").value;
    var message = document.getElementById("message");
    if (playerInput === selectedWord) {
      clearInterval(intervalId);
      var timeTaken = Date.now() - startTime;
      var timeTaken = Date.now() - startTime;
      var remainingTime = gameDuration / 1000 - timeTaken / 1000;
      var roundScore = (Math.round(remainingTime * selectedWord.length));
      score += roundScore;
      console.log(score)
      document.getElementById("score").innerHTML = "Score: " + score;
      message.innerHTML = "Correct! You gained " + roundScore + " points.";
      setTimeout(function(){ 
        round++;
        startGame();
      }, 2000);
    } else {
        message.innerHTML = "Incorrect. The correct word was " + selectedWord;
        clearInterval(intervalId);
        round++;
        setTimeout(startGame, 2000);
    }
  }


  // Suggestions for using a initializeWords function

//   function initializeWords() {
//     wordList = [];
//     fetch("./parole.txt")
//       .then(response => response.text())
//       .then(data => {
//         var words = data.split("\n");
//         for(var i = 5; i<=15; i++){
//           var filteredWords = words.filter(word => word.length === i);
//           var selectedWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
//           wordList.push(selectedWord);
//           if (wordList.length === 10) {
//             break;
//           }
//         }
//       })
//       .catch(error => console.log(error));
//   }
  
//   function startGame() {
//     ...
//     initializeWords();
//     ...
//   }
  
//   if (replay === 'y') {
//     round = 1;
//     score = 0;
//     initializeWords();
//     startGame();
//   } else {
//     message.innerHTML = "Thank you for playing! Your final score is: " + score;
//   }
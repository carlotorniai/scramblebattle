/* Game setup
// TO DO
Major
- Adjust the whole layout to be palyable also on a desktop / avoid the input to be clickable?
- Create the daily leaderboards and cookie for user stats like high score and highest number of owrds / time of completion

Minor
- See how to deal with the static page of recap
- Make sure it works with restarting by : setting the score to zero, 
- Disable typing in the two seconds between rounds (add a better overlay for waiting)


*/
var score = 0;
var words = []
var wordList = [];
var scrambleList = [];
let alternative_scramble;
//let alternativescrambledict;
var alternativescrambledict= {};
var startTime;
var selectedWord;
var scrambledWord;
var gameDuration = 30000; // 30 seconds in milliseconds
var round = 1;
var intervalId;
var rounds = [];
var correctWords=0;

var server = true;

function initializeWords() {
    fetch("./parole.txt")
      .then(response => response.text())
      .then(data => {
        var words = data.split("\n");
        for(var i = 5; i<=10; i++){
          var filteredWords = words.filter(word => word.length === i);
          var selectedWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
          wordList.push(selectedWord);
          if (wordList.length === 5) {
            console.log("End of reading and constructing words")
            break;
          }
        }
      })
      .catch(error => console.log(error));

  }


// Alternative version
let dictionary;

const fetchDictionary = () => {
  return new Promise((resolve, reject) => {
    fetch('alternative_scramble.json')
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

fetchDictionary().then(dict => {
  dictionary = dict;
  console.log("Alternative scramble", dictionary);
  console.log(checkallscramble("domandera", "domandare"));
});

function checkallscramble(answer, correctWord) {
  const lowerAnswer = answer.toLowerCase();
  const lowerCorrectWord = correctWord.toLowerCase();

  if (dictionary[lowerCorrectWord] && dictionary[lowerCorrectWord].includes(lowerAnswer)) {
    console.log(answer + " is the corrected solution for " + correctWord);
    return true;
  } else {
    console.log(answer + " is not a corrected solution for " + correctWord);
    return false;
  }
}

// Keybaord section
 const keyboard = document.querySelector(".keyboard");
 const answerInput = document.querySelector("#answer");
 const audio = new Audio("./sounds/click.mp3");
 
keyboard.addEventListener("click", function(event) {
  if (event.target.classList.contains("key")) {
    const key = event.target.textContent;
    if (key === "Send") {
      // Send the answer
      // Play the sound
      audio.play();
      audio.currentTime = 0;
      checkAnswer();
      // Here I need to trigger 
    } else if (key === "Canc") {
      // Remove the last character from the answer
      answerInput.value = answerInput.value.slice(0, -1);
      // Play the sound
      audio.play();
      audio.currentTime = 0;
    } else {
      // Add the key to the answer
      answerInput.value += key;
      // Play the sound
      audio.play();
      audio.currentTime = 0;
    }
  }
});



Promise.all([
  fetch('selected_words.txt')
    .then(response => response.text())
    .then(data => {
      wordList = data.split(" ");
      wordList = wordList.map(word => word.toUpperCase());
      console.log(wordList);
    }),
  fetch('scrambled_words.txt')
    .then(response => response.text())
    .then(data => {
      scrambleList = data.split(" ");
      scrambleList = scrambleList.map(word => word.toUpperCase());
      console.log("Executed fetch of scramble: " + scrambleList);
    })
]).then(([words, scrambles]) => {
  // do something with words and scrambles
  //console.log("Provo ancora a stamapre il dict" +alternativescrambledict);
  startGame();
}).catch(err => console.log(`Error: ${err}`));

// function to create the summary page
function createSummaryPage() {
  var summary = document.createElement("div");
  
  var title = document.createElement("h1");
  title.innerHTML = "Summary";
  summary.appendChild(title);
  
  var table = document.createElement("table");
  summary.appendChild(table);
  
  var headings = ["Word", "Answer", "Time", "Points"];
  var tr = document.createElement("tr");
  headings.forEach(function(heading) {
  var th = document.createElement("th");
  th.innerHTML = heading;
  tr.appendChild(th);
  });
  table.appendChild(tr);
  
  rounds.forEach(function(round) {
  var tr = document.createElement("tr");
  for (var key in round) {
  var td = document.createElement("td");
  td.innerHTML = round[key];
  tr.appendChild(td);
  }
  table.appendChild(tr);
  });
  
  var wordsElem = document.createElement("p");
  wordsElem.innerHTML = "Correct words: " + correctWords;
  summary.appendChild(wordsElem);
  
  var scoreElem = document.createElement("p");
  scoreElem.innerHTML = "Final Score: " + score;
  summary.appendChild(scoreElem);
  
  document.getElementById("summary").appendChild(summary);
  }


// Here I need to read the answer file 
function startGame() {
    startTime = new Date();
    if (round > 5) {
        // deal with all the info of game over
        message.innerHTML = "Game over ";
        clearInterval(intervalId);
        document.getElementById("timer").value = "Time: ";
        // Create the summary page
        createSummaryPage()
        return;
    }

    // update round and word length
    document.getElementById("round").innerHTML ="Round: "+ round;
    // document.getElementById("word-length").innerHTML = "Word Length: " + wordList[round-1].length;
    selectedWord = wordList[round-1];
    console.log(selectedWord)
    // var scrambleWord = scramble(selectedWord);
    scrambledWord = scrambleList[round-1];
    console.log(scrambledWord)
    // create a timer
    var timer = document.getElementById("timer");
    var remainingTime = gameDuration / 1000;
    intervalId = setInterval(function(){
        remainingTime--;
        timer.innerHTML = "Time: "+remainingTime;
        if(remainingTime === 0){
            message.innerHTML = "Time's up. The correct word was " + selectedWord;
            roundInfo = {
              word: selectedWord,
              correct: false,
              timeTaken: gameDuration,
              points: 0
            }
            rounds.push(roundInfo);
            console.log(rounds)
            clearInterval(intervalId);
            round++;
            setTimeout(startGame, 2000);
        }
    }, 1000);

    // Display scramble word to player
    var word = document.getElementById("word");
    word.innerHTML = "";

    var letters = scrambledWord.split('');
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
 
}


// Check for alternative scrmabled as 

function isWordInList( alternativescrambledict, key, word) {
  
  console.log("Sto cercando "+key+" come soluzione per "+ word+ " denttro il dict "+alternativescrambledict );
  const words = alternativescrambledict[key];
  console.log("ho trovato le seuenti soluzioni:"+words)
  return words.includes(word);
}

function checkAnswer() {
    var roundScore = 0;
    var roundInfo = {};
    var playerInput = document.getElementById("answer").value;
    var message = document.getElementById("message");
    //if (playerInput === selectedWord) {
    if (checkallscramble(playerInput,selectedWord) ) {
      clearInterval(intervalId);
      var timeTaken = Date.now() - startTime;
      var timeTaken = Date.now() - startTime;
      var remainingTime = gameDuration / 1000 - timeTaken / 1000;
      var roundScore = (Math.round(remainingTime * selectedWord.length));
      score += roundScore;
      console.log(score)
      document.getElementById("score").innerHTML = "Score: " + score;
      message.innerHTML = "Correct! You gained " + roundScore + " points.";
      correctWords+=1;
      roundInfo = {
        word: selectedWord,
        correct: true,
        timeTaken: timeTaken,
        points: roundScore
    }
      setTimeout(function(){ 
        round++;
        startGame();
      }, 2000);
    } else {
        message.innerHTML = "Incorrect. The correct word was " + selectedWord;
        roundInfo = {
          word: selectedWord,
          correct: false,
          timeTaken: gameDuration,
          points: 0
        }
        clearInterval(intervalId);
        round++;
        setTimeout(startGame, 2000);
    }
    rounds.push(roundInfo);
    console.log(rounds)
  }


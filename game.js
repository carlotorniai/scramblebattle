/* Game setup
// TO DO
Major
- Adjust the whole layout for the mobile wordle like.
- Deal with words with multiple anagrams
- Create the daily leaderboards and cookie for user stats like high score and highest number of owrds / time of completion

Minor
- See how to deal with the sttic page of recap
- make sure it works with restarting by : setting the score to zero, 
- Disable typing in the two seconds between rounds 


*/
var score = 0;
var wordList = [];
var startTime;
var selectedWord;
var gameDuration = 20000; // 20 seconds in milliseconds
var round = 1;
var intervalId;
var rounds = [];
var correctWords=0;


// Now I have to substitute this with the javascript 
// This code below isnìt needed anymore
async function readSelectedWords() {
  console.log("Reading selected words from file...");
  try {
    const response = await fetch('selected_words.txt');
    const data = await response.text();
    return data.split(" ");
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}

// Keybaord

 // Keybaord section
 const keyboard = document.querySelector(".keyboard");
 const answerInput = document.querySelector("#answer");

 keyboard.addEventListener("click", function(event) {
   if (event.target.classList.contains("key")) {
     const key = event.target.textContent;
     if (key === "Send") {
       // Send the answer
       checkAnswer();
       // Here I need to trigger 
     } else if (key === "Canc") {
       // Remove the last character from the answer
       answerInput.value = answerInput.value.slice(0, -1);
     } else {
       // Add the key to the answer
       answerInput.value += key;
     }
   }
 });
// Fetch the words of the day
// Thrasform with map in UPPER CASE to match input

fetch('selected_words.txt')
  .then(response => response.text())
  .then(data => {
    wordList = data.split(" ");
    wordList = wordList.map(word => word.toUpperCase());
    console.log(wordList);
    startGame();
  })
  .catch(err => console.log(`Error: ${err}`));

console.log(wordList);


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


// End event listener for keyboard // 


// Check ig this one below is needed ???
// add the event listener to the answer 
document.getElementById("answer").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("submit").click();
  }
});

startGame();

function startGame() {
    startTime = new Date();
    if (round > 5) {
        // deal with all the info of game over
        message.innerHTML = "Game over ";
        clearInterval(intervalId);
        document.getElementById("timer").value = "Time: ";
        // Create the summary page
        var summary = document.createElement("div");
        summary.id = "summary";
        document.body.appendChild(summary);
        // Add a title
        var title = document.createElement("h1");
        title.innerHTML = "Summary";
        summary.appendChild(title);
        // Add a table to display the rounds information
        var table = document.createElement("table");
        summary.appendChild(table);
        // Add table headings
        var headings = ["Round", "Word", "Answer", "Time", "Points"];
        var tr = document.createElement("tr");
        headings.forEach(function(heading) {
            var th = document.createElement("th");
            th.innerHTML = heading;
            tr.appendChild(th);
        });
        table.appendChild(tr);
        // Add the information for each round
        rounds.forEach(function(round) {
            var tr = document.createElement("tr");
            for (var key in round) {
                var td = document.createElement("td");
                td.innerHTML = round[key];
                tr.appendChild(td);
            }
            table.appendChild(tr);
        });
        // Here I want to display the number of correct words
        var wordsElem = document.createElement("p");
        wordsElem.innerHTML = "Correct words: " + correctWords;
        summary.appendChild(wordsElem);
        // Display the final score
        var scoreElem = document.createElement("p");
        scoreElem.innerHTML = "Final Score: " + score;
        summary.appendChild(scoreElem);
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
    var roundScore = 0;
    var roundInfo = {};
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
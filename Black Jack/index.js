// DOM
var messageEl = document.getElementById("message-el");
// var sumEl = document.getElementById("sum-el");
var cardEl = document.querySelector("#card-el");
var sumEl = document.querySelector("#sum-el");
var gameBtn = document.querySelector("#game-btn");
var cardBtn = document.querySelector("#card-btn");
var randomNumber = document.querySelector("#random-number");

// For storing and learning purpose
var message = "Do you want to draw a card? 😎"
var btnMessage = "New Game"

// Create the random card sum 
var cardValue = Math.floor(Math.random() * 51) + 40;

// Create 2 random cards at the beginning
var firstCard= Math.floor(Math.random() * 11 + 1);
var secondCard = Math.floor(Math.random() * 11 + 1);
// Create an array to hold cards
let cards = [firstCard, secondCard]

// Create sum for calculation
var sum = 0;

var gameOver = false;
var restart = false;

function startGame() {
    renderGame();
}

// Render the game
function renderGame() {
    if(restart == false){
        messageEl.innerText = message;
        gameBtn.innerText = btnMessage;
        // Create the loop for counting all the cards.
        for(let i = 0; i < cards.length; i++)
        {
            sum += cards[i];
            cardEl.textContent += " " + cards[i] ;
        }
        sumEl.textContent = "Sum: " + sum;
        randomNumber.innerText = "The random card sum is: " + cardValue;
        restart = true;
    }
    else window.location.reload();
}

// Draw a new card
function newCard() {
    if(restart === true && checkWinLose())
    { 
        var newCardValue = Math.floor(Math.random() * 11 + 1);
        sum += newCardValue;
        checkWinLose();
        messageEl.innerText = message;
        cardEl.textContent += " " + newCardValue;
        sumEl.textContent = "Sum: " + sum;
    }
}

// Check win-lose state with every card drew
function checkWinLose() {
    if(sum < cardValue)
    {
        message = "Want to draw another card?"
        return true; 
    }
    else if (sum === cardValue) {
        message = "Congratulations! You've got the blackjack"
    }
    else if (sum > cardValue)
    {
        message = "You're out of the game! 🐔"
    }
    return false; // You lost
}

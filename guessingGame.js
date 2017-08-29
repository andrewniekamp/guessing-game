$(function() {
    function generateWinningNumber() {
        return Math.floor(Math.random() * 100 + 1);
    }

    function shuffle(arr) {
        let elementsToShuffle = arr.length;
        let picked;
        let swapHolder;
        while (elementsToShuffle) {
            picked = Math.floor(Math.random() * elementsToShuffle--);
            swapHolder = arr[elementsToShuffle];
            arr[elementsToShuffle] = arr[picked];
            arr[picked] = swapHolder;
        }
        return arr;
    }

    function Game() {
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
    }

    Game.prototype.difference = function() {
        return Math.abs(this.playersGuess - this.winningNumber);
    }

    Game.prototype.isLower = function() {
        return this.playersGuess < this.winningNumber;
    }

    Game.prototype.playersGuessSubmission = function(guess) {
        if (typeof guess != "number" || 100 < guess || guess < 1) {
            throw "That is an invalid guess."
        } else {
            this.playersGuess = guess;
            return this.checkGuess(guess);
        }
    }

    Game.prototype.checkGuess = function(guess) {
        if (guess == this.winningNumber) {
            return "You Win!";
        } else if (this.pastGuesses.includes(guess)) {
            return "You have already guessed that number.";
        } else {
            this.pastGuesses.push(guess);
            let diff = this.difference();
            if (this.pastGuesses.length == 5) {
                return "You Lose.";
            } else if (diff < 10) {
                return "You're burning up!";
            } else if (diff < 25) {
                return "You're lukewarm.";
            } else if (diff < 50) {
                return "You're a bit chilly.";
            } else {
                return "You're ice cold!";
            }
        }
    }

    Game.prototype.provideHint = function() {
        return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
    }

    function newGame() {
        return new Game();
    }

    function guessEvent() {
        let guess = +$("#player-input").val();
        $("#player-input").val('');
        var output = game.playersGuessSubmission(guess);
        if (output == 'You have already guessed that number.') {
            $('#title').text("You've guessed that. Guess again!");
            comparisonSubtitles();
        } else {
            $('#guesses').find('li').last().remove();
            $('#guesses').find('ul').prepend('<li class="guess">' + guess + '</li>')
            $('#title').text(output);
            if (output == "You Win!" || output == "You Lose.") {
                $('#subtitle').text("Press reset to play again!");
                $('#submit, #hint').prop('disabled', true);
            } else {
                comparisonSubtitles();
            }
        }
    }

    function comparisonSubtitles() {
        if (game.isLower()) {
            $('#subtitle').text('Too low. Guess higher!');
        } else {
            $('#subtitle').text('Too high. Guess lower!');
        }
    }

    let game = newGame();
    let titleDefault = $('#title').text();
    let subtitleDefault = $('#subtitle').text();
    let guessesDefault = $('#guesses').html();

    $("#submit").on('click', function() {
        guessEvent()
    })

    $("#reset").on('click', function() {
        game = new Game();
        $('#title').text(titleDefault);
        $('#subtitle').text(subtitleDefault);
        $('#guesses').html(guessesDefault);
        $('#submit, #hint').prop('disabled', false);
    })

    $("#hint").on('click', function() {
        $('#title').text("Your number is one of these: " + game.provideHint());
    })

    $(document).on('keypress', function(event) {
        // Enter is 13
        if (event.which == 13) {
            guessEvent();
        }
    })
})
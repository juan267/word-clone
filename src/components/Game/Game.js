import React from "react";

import { sample } from "../../utils";
import { WORDS } from "../../data";
import GuessForm from "../GuessForm/GuessForm";
import Guesses from "../Guesses/Guesses";
import { checkGuess } from "../../game-helpers";

// Pick a random word on every pageload.
const answer = sample(WORDS);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

function Game() {
  const [guesses, setGuesses] = React.useState(
    Array.from({ length: 6 }, () => ({
      id: crypto.randomUUID(),
      letters: checkGuess("     ", answer),
    }))
  );

  const [status, setStatus] = React.useState("playing");

  const amountOfGuesses = guesses.filter(
    (guess) => guess.letters[0].letter !== " "
  ).length;

  function submitGuess(e) {
    e.preventDefault();
    const newGuess = e.target.guess.value.toUpperCase();
    const newGuesses = [...guesses];

    newGuesses[newGuesses.findIndex((e) => e.letters[0].letter === " ")] = {
      id: crypto.randomUUID(),
      letters: checkGuess(newGuess, answer),
    };

    if (newGuess === answer) {
      setStatus("won");
    }

    if (amountOfGuesses + 1 >= 6) {
      setStatus("loose");
    }

    setGuesses(newGuesses);
    e.target.reset();
  }

  return (
    <>
      <Guesses guesses={guesses} />
      <GuessForm submitGuess={submitGuess} />
      {status === "won" && (
        <div className="happy banner">
          <p>
            <strong>Congratulations!</strong> Got it in{" "}
            <strong>{amountOfGuesses} guesses</strong>.
          </p>
        </div>
      )}

      {status === "loose" && (
        <div className="sad banner">
          <p>
            Sorry, the correct answer is <strong>{answer}</strong>.
          </p>
        </div>
      )}
    </>
  );
}

export default Game;

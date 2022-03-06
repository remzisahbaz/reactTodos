import React, {useEffect, useState} from "react";
import Badge from "./components/badge";
import CardHeader from "./components/card-header";
import Card from "./components/card";
import CardBody from "./components/card-body";
import Container from "./components/container";
import Move2 from "./move2";
import PlayerMove2 from "./components/player-move2";
import Progress from "./components/Progress";
import progressCss from "./css/progressCss.css";

const COUNTER_BASE_VALUE = 60;
const COUNTER_INCREMENT_PER_LEVEL = 10;
const RANDOM_MAX=100;
const  DEFAULT_LEVEL=2;
const DEFAULT_PROGRESS_WIDTH=60;
function App(props) {



    let initialGameState = {
        level: DEFAULT_LEVEL,
        secretNumber:randomNumber(RANDOM_MAX),
        tries: 0,
        guess: 1,
        moves: [],
        counter: COUNTER_BASE_VALUE,
        lives: DEFAULT_LEVEL
    };
    let initialStatState = {
        wins: 0,
        loses: 0,
        total: 0,
        totalWinMoves: 0,
        avgWinMoves: 0
    };



    const [game, setGame] = useState(initialGameState);
    const [statistics, setStatistics] = useState(initialStatState);


    function getInitialCounter(level) {

        return COUNTER_BASE_VALUE + COUNTER_INCREMENT_PER_LEVEL * (level - DEFAULT_LEVEL);
    }

    function randomNumber(max) {
        return Math.floor(Math.random()*max+1);
    }

    function initGame(game, statistics) {
        if (game.lives === 0) {
            game.level = game.level === DEFAULT_LEVEL ? DEFAULT_LEVEL : game.level - 1;
            game.lives = DEFAULT_LEVEL;
            statistics.loses++;
            statistics.total++;
        } else {
            game.lives--;
        }
        game.tries = 0;
        game.secretNumber=randomNumber(RANDOM_MAX);
        game.moves = [];
        game.counter = getInitialCounter(game.level);
    }

    function persistStateToLocalStorage() {
        localStorage.setItem(
            "mastermind", JSON.stringify(
                {
                    'game': {...game},
                    'statistics': {...statistics}
                }
            )
        );
    }

    useEffect(() => {
        let timerId =
            setInterval(() => {
                let newGame = {...game};
                let newStatistics = {...statistics};
                newGame.counter--;
                if (newGame.counter <= 0) {
                    initGame(newGame, newStatistics);
                }
                setGame(newGame);
                setStatistics(newStatistics);
            }, 1000);
        return () => {
            clearInterval(timerId);
        };
    }, [game]);

    useEffect(() => {
        let localState = JSON.parse(localStorage.getItem("mastermind"));
        if (localState != null) {
            setGame(localState.game);
            setStatistics(localState.statistics);
        } else {
            localStorage.setItem(
                "mastermind", JSON.stringify(
                    {
                        'game': {...game},
                        'statistics': {...statistics}
                    }
                )
            );
        }
        return persistStateToLocalStorage;
    }, []);

    //region create random numbers
    function createDigit(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }



    //endregion

    function handleInputChange(event) {
        let guess = Number(event.target.value);
        setGame({...game, guess});
    }

    function play(event) {

        let newGame = {...game};
        let newStatistics = {...statistics};

        if (newGame.secretNumber === newGame.guess) {
            newGame.level++;
            // TODO: check whether this is the last level
            newGame.secretNumber = randomNumber(RANDOM_MAX);
            newGame.moves = [];
            newGame.tries = 0;
            newGame.counter = getInitialCounter(newGame.level);
        } else {

            let move = createMove(newGame.guess, newGame.secretNumber);
            newGame.moves.push(move);
            newGame.tries++;
        }
        setGame(newGame);
        setStatistics(newStatistics);
    }

    function createMove(guess, secretNumber) {
        let guessAsInteger = Number(guess);
        let secretAsInteger = Number(secretNumber);
        let up="↑ increase";
        let down="↓ decrease";

        if(guessAsInteger<secretAsInteger)
        {
            return new Move2(guess, up);
        }
       else if(guessAsInteger>secretAsInteger)
        {
            return new Move2(guess, down);
        }


    }
    function progressMove(){
        var i = 100;

            if (i == 100) {
                i = 100;
                var elem = document.getElementById("myBar");
                var width = 100;
                var id = setInterval(frame, 1000);
                function frame() {
                    if (width <= 0) {
                        clearInterval(id);
                        i = 100;
                    } else {
                        width--;
                        elem.style.width = width +"%";
                        elem.innerHTML = width  +"%";
                    }
                }
            }

    }


    return (
        <Container>
            <Card>
                <CardHeader title={"Game Console"+game.secretNumber.toString()}/>
                <CardBody>
                    <Badge id="level"
                           label="Game Level"
                           value={game.level}
                           className="alert-success">

                    </Badge>
                    <Badge id="tries"
                           label="Tries"
                           value={game.tries}
                           className="alert-danger"></Badge>

                    <Progress id="myBar"
                           label="Counter"
                           value={game.counter}
                            className="myBar"
                        >


                    </Progress>


                    <Badge id="lives"
                           label="Lives"
                           value={game.lives}
                           className="alert-warning"></Badge>
                    <div className="form-group">
                        <label htmlFor="guess">Guess:</label>
                        <input id="guess"
                               type="text"
                               className="form-control"
                               onChange={handleInputChange}
                               value={game.guess}></input>
                        <button onClick={play}
                                className="btn btn-success">Play
                        </button>
                    </div>
                </CardBody>
            </Card>
            <p></p>
            <Card>
                <CardHeader title="Game Statistics"/>
                <CardBody>
                    <Badge id="total"
                           label="Total"
                           value={statistics.total}
                           className="alert-info"></Badge>
                    <Badge id="wins"
                           label="Wins"
                           value={statistics.wins}
                           className="alert-success"></Badge>
                    <Badge id="loses"
                           label="Loses"
                           value={statistics.loses}
                           className="alert-danger"></Badge>
                </CardBody>
            </Card>
            <p></p>
            <Card>
                <CardHeader title="Moves"/>
                <CardBody>
                    <table className="table table-hover table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Guess</th>
                            <th>Message</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            game.moves.map((move, index) =>
                                <tr key={move.guess + index.toString()}>
                                    <td>{index + 1}</td>
                                    <td>{move.guess}</td>
                                    <td><PlayerMove2 value={move}/></td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </CardBody>

            </Card>



        </Container>
    );
}

export default App;

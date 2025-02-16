import { useState, useEffect, useRef } from 'react';
import './App.css'
import Confetti from 'react-confetti';

function App() {
  const [maze, setMaze] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const mazeRef = useRef();

  useEffect(() => {
    handleRandomizeGrid(10, 10);
    mazeRef.current.focus();
  }, []);
  useEffect(() => {
    const enemySpawnInterval = setInterval(() => {
      const randomCell = getRandomCell();
      setEnemies((prevEnemies) => [...prevEnemies, randomCell]);
      setTimeout(() => {
        setEnemies((prevEnemies) => prevEnemies.filter(enemy => enemy !== randomCell));
      }, 2000);
    }, 1000);

    return () => clearInterval(enemySpawnInterval);
  }, [maze]);

  const handleRandomizeGrid = (height, width) => {
    let grid = Array.from({ length: height }, () => Array(width).fill('block'));

    const isValidCell = (x, y) => {
      return x >= 0 && y >= 0 && x < width && y < height && grid[y][x] === 'block';
    }
    const _directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    const createPath = (x, y) => {
      grid[y][x] = 'path';

      const directions = _directions.sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (isValidCell(nx, ny)) {
          grid[y + dy][x + dx] = 'path';
          createPath(nx, ny);
        }
      }
    }
    createPath(1, 1);

    grid[1][0] = 'start';
    grid[height - 2][width - 1] = 'end';
    setMaze(grid);
    setPlayerPosition({ x: 0, y: 1 });

  }
  const getRandomCell = () => {
    const randomX = Math.floor(Math.random() * maze[0].length);
    const randomY = Math.floor(Math.random() * maze.length);
    if (maze[randomY][randomX] !== 'block' && maze[randomY][randomX] !== 'start' && maze[randomY][randomX] !== 'end') {
      return { x: randomX, y: randomY };
    }
    return getRandomCell();
  };
  const handleKeyDown = (e) => {
    if (gameOver || gameWon) return;
    const { x, y } = playerPosition;
    let newX = x;
    let newY = y;

    if (e.key === 'ArrowUp') {
      newY -= 1;
    }
    if (e.key === 'ArrowDown') {
      newY += 1;
    }
    if (e.key === 'ArrowLeft') {
      newX -= 1;
    }
    if (e.key === 'ArrowRight') {
      newX += 1;
    }
    if (newX >= 0 && newY >= 0 && newX < maze[0].length && newY < maze.length && maze[newY][newX] != 'block') {
      setPlayerPosition({ x: newX, y: newY });
    }

    if (enemies.some(enemy => enemy.x === newX && enemy.y === newY)) {
      setGameOver(true);
    }
    console.log(maze.length - 1, playerPosition.x, playerPosition.y)
    if (newX === maze[0].length - 1 && newY === maze.length - 2) {
      setGameWon(true);
    }
  }
  const resetGame = () => {
    setGameOver(false);
    setGameWon(false);
    setPlayerPosition({ x: 1, y: 0 });
    setEnemies([]);
    handleRandomizeGrid(10, 10);
    mazeRef.current.focus();
  }

  return (
    <div className='container' onKeyDown={handleKeyDown} >
      <h1>Path Finder</h1>
      <div className='tips'>
      <p>Move from the green square to the red to win the game. </p>  <p>  Use ←, →, ↑, ↓ to move left, right , up, down respectively on the grid. Do not come across the purple squares, or you are dead. </p>
      </div>

      {(gameOver || gameWon) && (
        <div className="overlay">
          <div className="message">
            {gameWon && (<Confetti
              width={window.width}
              height={window.heigth}
            />)}
            {gameWon ? 'You Win!' : 'Game Over!'}
            <br />
            <button onClick={resetGame} className="reset-button">
              Play Again!
            </button>
          </div>
        </div>
      )}
      <div ref={mazeRef} className='maze-grid' tabIndex={0} >
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className='row'>
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`cell ${cell} ${playerPosition.x === cellIndex && playerPosition.y === rowIndex
                    ? 'player'
                    : ''
                  } ${enemies.some(enemy => enemy.x === cellIndex && enemy.y === rowIndex) ? 'enemy' : ''}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    
      <button onClick={() => handleRandomizeGrid(10, 10)}>Randomize Grid</button>

    </div>
  )
}

export default App

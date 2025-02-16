import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [maze, setMaze] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 0 });

  useEffect(()=>{
    handleRandomizeGrid(10, 10);
  }, []);

  
  const handleRandomizeGrid = (height, width) => {
    let grid = Array.from({length:height}, () => Array(width).fill('block'));

    const isValidCell = (x, y)=>{
      return x >=0 && y >= 0 && x < width && y < height && grid[y][x] === 'block';
    }
    const _directions = [[1,0], [-1, 0], [0, 1], [0, -1]];

    const createPath = (x, y)=>{
      grid[y][x] = 'path';

      const directions = _directions.sort(()=> Math.random() - 0.5);

      for (let [dx, dy] of directions){
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (isValidCell(nx, ny)){
          grid[y + dy][ x + dx] = 'path';
          createPath(nx, ny);
        }
      }
    }
    createPath(1, 1);
    
    grid[1][0] = 'start';
    grid[height - 2][width - 1] = 'end';
    setMaze(grid);
    setPlayerPosition({ x: 1, y: 1 });

  }

  const handleKeyDown = (e)=>{
    const {x, y} = playerPosition;
    let newX = x;
    let newY = y;

    if(e.key === 'ArrowUp'){
      newY -= 1; 
    }
    if(e.key === 'ArrowDown'){
      newY += 1; 
    }
    if(e.key === 'ArrowLeft'){
      newX -= 1; 
    }
    if(e.key === 'ArrowRight'){
      newX += 1; 
    }
    if (newX >=0 && newY >=0 && newX < maze[0].length && newY < maze.length &&maze[newY][newX]!= 'block'){
      setPlayerPosition({x: newX, y: newY});
    }
  }

  return (
    <div className='container' onKeyDown={handleKeyDown} >
      <button onClick={() => handleRandomizeGrid(10, 10)}>Randomize Grid</button>
      <div className='maze-grid'  tabIndex={0}>
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className='row'>
            {row.map((cell, cellIndex) => (
             <div
             key={cellIndex}
             className={`cell ${cell} ${
               playerPosition.x === cellIndex && playerPosition.y === rowIndex
                 ? 'player'
                 : ''
             }`}
           ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

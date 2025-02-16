import { useState } from 'react';
import './App.css'

function App() {
  const [maze, setMaze] = useState([
    ['block', 'block', 'block', 'path'],
    ['start', 'path', 'path', 'block'],
    ['block', 'path', 'block', 'block'],
    ['path', 'path', 'path', 'block'],
    ['path', 'block', 'block', 'end'],
    ['path', 'path', 'path', 'block']
  ]);
  
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
    setMaze(grid);
    grid[1][0] = 'start';
    grid[height - 2][width - 1] = 'end';

  }

  return (
    <div className='container'>
      <button onClick={() => handleRandomizeGrid(6, 4)}>Randomize Grid</button>
      <div className='maze-grid'>
        {maze.map((row, rowIndex) => (
          <div key={rowIndex} className='row'>
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className={`cell ${cell}`}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

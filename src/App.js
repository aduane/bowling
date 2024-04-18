import { useState } from 'react';

function RunningTotal({score}) {
  return (
    <div className="running-total">
      {score || "\u00A0"}
    </div>
  );
}

function Throw({isCurrentThrow, value}) {
  return (
    <div className={"throw" + (isCurrentThrow ? " current-throw" : "")}>
        {value || "\u00A0"}
    </div>
  );
}

function Frame({frames, frameIndex, isCurrentFrame, currentThrow}) {
  let frameData = frames[frameIndex];

  function calculateScore(frames, latestFrameIndex) {
    if(frames[latestFrameIndex].includes(undefined)) {
      return null;
    }
    let runningTotal = 0;
    for(const idx in frames.slice(0, latestFrameIndex + 1)) {
      if(frames[idx].includes(undefined)) {
        return null;
      } else {
        for(const throw_idx in frames[idx]) {
          let _throw = frames[idx][throw_idx]
          let value_to_add;
          if(_throw == 'X') {
            value_to_add = 10;
          } else if (_throw == '/') {
            //
            // 
            //
            // this is broken when evaluating what to add as the spare bonus
            // (looking ahead)
            //
            //
            //
            let previous_throw = frames[idx][throw_idx - 1];
            if(previous_throw == '-') {
              previous_throw = 0;
            }
            value_to_add = 10 - previous_throw;
            let next_throw = frames[idx + 1][0];
            switch(next_throw) {
              case undefined:
                return null;
              case '-':
                value_to_add += 0;
                break;
              case 'X':
                value_to_add += 10;
                break;
              default:
                value_to_add += next_throw;
                break;
            }
          } else if (_throw == '-') {
            value_to_add = 0;
          } else {
            value_to_add = _throw;
          }
          runningTotal += value_to_add;
        }
      }
    }
    return runningTotal;
  }

  return (
    <div className={"frame" + (isCurrentFrame ? " current-frame" : "")}>
      <Throw value={frameData[0]} isCurrentThrow={(isCurrentFrame && currentThrow == 1)}/>
      <Throw value={frameData[1]} isCurrentThrow={(isCurrentFrame && currentThrow == 2)}/>
      {frameIndex == 9 && <Throw value={frameData[2]} isCurrentThrow={(isCurrentFrame && currentThrow == 3)}/>}
      <RunningTotal score={calculateScore(frames, frameIndex)}/>
    </div>
  );
}

function Game({currentFrame, currentThrow, frames}) {
  return (
    <>
      <Frame frames={frames} frameIndex={0} isCurrentFrame={currentFrame == 1} currentThrow={currentThrow}/>
      <Frame frames={frames} frameIndex={1} isCurrentFrame={currentFrame == 2} currentThrow={currentThrow}/>
      <Frame frames={frames} frameIndex={2} isCurrentFrame={currentFrame == 3} currentThrow={currentThrow}/>
      <Frame frames={frames} frameIndex={3} isCurrentFrame={currentFrame == 4} currentThrow={currentThrow}/>
      <Frame frames={frames} frameIndex={4} isCurrentFrame={currentFrame == 5} currentThrow={currentThrow}/>
      <Frame frames={frames} frameIndex={5} isCurrentFrame={currentFrame == 6} currentThrow={currentThrow}/>
      <Frame frames={frames} frameIndex={6} isCurrentFrame={currentFrame == 7} currentThrow={currentThrow}/>
      <Frame frames={frames} frameIndex={7} isCurrentFrame={currentFrame == 8} currentThrow={currentThrow}/>
      <Frame frames={frames} frameIndex={8} isCurrentFrame={currentFrame == 9} currentThrow={currentThrow}/>
      <Frame frames={frames} frameIndex={9} isCurrentFrame={currentFrame == 10} currentThrow={currentThrow}/>
    </>
  );
}

function DataEntry({currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames}) {
  
  function handleClick(value, currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames) {
    switch (value) {
      case 'CURSOR_LEFT':
        if(currentThrow > 1) {
          setCurrentThrow(currentThrow - 1);
        } else {
          if(currentFrame > 1) {
            setCurrentThrow(2); // Because we don't wrap around, you don't have to worry about moving from 1-1 to 10-3
            setCurrentFrame(currentFrame - 1);
          }
        }
        break;
      case 'CURSOR_RIGHT':
        if(currentFrame == 10 && currentThrow == 2) {
          setCurrentThrow(3);
        } else if(currentThrow == 2) {
          setCurrentFrame(currentFrame + 1);
          setCurrentThrow(1);
        } else if(currentThrow == 1) {
          setCurrentThrow(2);
        }
        break;
      default:
        let frameIndex = currentFrame - 1;
        let throwIndex = currentThrow - 1;
        let replacementFrames = frames.slice();
        replacementFrames[frameIndex][throwIndex] = value;
        setFrames(replacementFrames);
        if(currentFrame == 10 && currentThrow == 2) {
          setCurrentThrow(3);
        } else if(currentThrow == 2) {
          setCurrentFrame(currentFrame + 1);
          setCurrentThrow(1);
        } else if(currentThrow == 1) {
          setCurrentThrow(2);
        }
        break;
    }
  }

  return (
    <div className="keypad-entry">
      <button onClick={() => handleClick('CURSOR_LEFT', currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>👈</button>
      <div className="keypad">
        <div className="keypad-row">
          <button onClick={() => handleClick(1, currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>1</button>
          <button onClick={() => handleClick(2, currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>2</button>
          <button onClick={() => handleClick(3, currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>3</button>
        </div>
        <div className="keypad-row">
          <button onClick={() => handleClick(4, currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>4</button>
          <button onClick={() => handleClick(5, currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>5</button>
          <button onClick={() => handleClick(6, currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>6</button>
        </div>
        <div className="keypad-row">
          <button onClick={() => handleClick(7, currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>7</button>
          <button onClick={() => handleClick(8, currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>8</button>
          <button onClick={() => handleClick(9, currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>9</button>
        </div>
        <div className="keypad-row">
          <button onClick={() => handleClick('/', currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>/</button>
          <button onClick={() => handleClick('-', currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>-</button>
          <button disabled={currentThrow > 1} onClick={() => handleClick('X', currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>X</button>
        </div>
      </div>
      <button onClick={() => handleClick('CURSOR_RIGHT', currentFrame, setCurrentFrame, currentThrow, setCurrentThrow, frames, setFrames)}>👉</button>
    </div>
  )
}

export default function Bowling() {
  // Set up the frames. 9 Frames of 2 Throws + 1 Frame of 3 Throws
  let initialFrames = [
    [undefined, undefined],
    [undefined, undefined],
    [undefined, undefined],
    [undefined, undefined],
    [undefined, undefined],
    [undefined, undefined],
    [undefined, undefined],
    [undefined, undefined],
    [undefined, undefined],
    [undefined, undefined, undefined]
  ]
  const [currentFrame, setCurrentFrame] = useState(1);
  const [currentThrow, setCurrentThrow] = useState(1);
  const [frames, setFrames] = useState(initialFrames);

  return (
    <div className="bowling">
      <div className="game-board">
        <Game currentFrame={currentFrame} currentThrow={currentThrow} frames={frames}/>
      </div>
      <div className="data-entry">
        <DataEntry currentFrame={currentFrame} currentThrow={currentThrow} frames={frames} setCurrentFrame={setCurrentFrame} setCurrentThrow={setCurrentThrow} setFrames={setFrames}/>
      </div>
    </div>
  );
}

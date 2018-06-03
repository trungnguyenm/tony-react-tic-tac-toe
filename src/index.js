import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {

//   // constructor(props){
//   //   super(props); // phai goi ham khoi tao class cha
//   //   this.state = {value: null};
//   // }

//   render() {
//     return (
//       // <button className="square">{this.props.value}</button>
//       // <button className="square" onClick={() => { alert('click') }}>{this.props.value}</button>
//       // <button className="square" onClick={() => this.setState({value: 'X'}) }>{this.state.value}</button>
//       <button className="square" onClick={() => this.props.onClick() }>{this.props.value}</button>
//     );
//   }
// }

function Square(props) { // functional component: kieu component chi co moi mot ham render
  return (
    <button className="square" onClick={ props.onClick }>{props.value}</button>
  );
}

class Board extends React.Component {

  // constructor(props){
  //   super(props);
  //   this.state = { 
  //     squares: Array(9).fill(null),
  //     xIsNext: true // set default X di truoc
  //   }
  // }

  // handleClick(i){
  //   const squares = this.state.squares.slice(); // dung slice() rat quan trong cho time travel
  //   // kiem tra neu co winner hoac o da dc check thi ko xu ly nua
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   // squares[i] = 'X';
  //   squares[i] = this.state.xIsNext ? 'X' : 'O';
  //   // this.setState({squares: squares});
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext
  //   });
  // }

  renderSquare(i) {
    // return <Square value={i}/>; // truyen du lieu thong qua props
    // return <Square value={this.state.squares[i]}/>; 
    // return <Square value={this.state.squares[i]} onClick={()=>{this.handleClick(i)}}/>; 
    return <Square value={this.props.squares[i]} onClick={()=>{this.props.onClick(i)}}/>; 
  }

  render() {
    // const status = 'Next player: X';
    // const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = 'Winnner: ' + winner;
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }

    return (
      <div>
        {/* <div className="status">{status}</div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { // khoi tao trang thai state
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0
    };
  }

  handleClick(i){
    // const squares = this.state.squares.slice(); 
    // const history = this.state.history;
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // lay tu 0 den stepNumber
    const current = history[history.length - 1]; // phan tu cuoi cung
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      // squares: squares,
      history: history.concat([{
        squares: squares
      }]), // them mot state moi
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0, // set la true neu index of move la so chan
    });
  }

  render() {
    const history = this.state.history;
    // const current = history[history.length - 1];
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        // <li>
        // khi tao danh sach elment dynamic nen co them key de xac dinh tinh duy nhat cua element
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    // return (
    //   <div className="game">
    //     <div className="game-board">
    //       <Board />
    //     </div>
    //     <div className="game-info">
    //       <div>{/* status */}</div>
    //       <ol>{/* TODO */}</ol>
    //     </div>
    //   </div>
    // );
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]; // kha la ha
    if (
      squares[a] && 
      squares[a] === squares[b] && 
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// If you have extra time or want to practice your new skills, 
// here are some ideas for improvements you could make, listed in order of increasing difficulty:

// Display the location for each move in the format (col, row) in the move history list.
// Bold the currently selected item in the move list.
// Rewrite Board to use two loops to make the squares instead of hardcoding them.
// Add a toggle button that lets you sort the moves in either ascending or descending order.
// When someone wins, highlight the three squares that caused the win.
// When no one wins, display a message about the result being a draw.
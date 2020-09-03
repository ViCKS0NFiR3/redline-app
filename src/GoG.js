import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import './index.css';
import io from 'socket.io-client';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

const socket = io.connect('http://192.168.254.130:4000')

function Square(props){
  const pieceIcons = {
    "C":"colonel.jpg",
    "S":"spy.jpg",
    5:"5star.jpg",
    "F":"flag.jpg",
    1:"1star.jpg",
    2:"2star.jpg",
    3:"3star.jpg",
    4:"4star.jpg",
    "LC":"ltCol.jpg",
    "M":"major.jpg",
    "P":"private.jpg",
    "1L":"1stLieut.jpg",
    "Cpt":"captain.jpg",
    "2L":"2ndLieut.jpg",
    "Sgt":"sergeant.jpg",
    null:null
  }

if (props.currentTeam == props.player){
  return (
    <Button className="square" onClick={props.onClick} value={props.value} variant="outlined" color="default" size="small">
      <img src={pieceIcons[props.value]}/>
    </Button>
  );
  } else {
    if(props.gameEnded && props.value != null) {
      return (
        <Button className="square" onClick={props.onClick} value={props.value} variant="outlined" color="default" size="small">
          <img src={pieceIcons[props.value]}/>
        </Button>
      );
    } else {
      return (
        <Button className="square" onClick={props.onClick} value={props.value} variant="outlined" color="default" size="small">
          {props.currentTeam}
        </Button>
      );
    }
  }
}
    
class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      squares: [
        ["C",1],
        ["S",1],
        ["S",1],
        [5,1],
        ["F",1],
        [1,1],
        [2,1],
        [3,1],
        [4,1],
        ["LC",1],
        ["M",1],
        ["P",1],
        ["P",1],
        ["P",1],
        ["P",1],
        ["P",1],
        ["P",1],
        ["1L",1],
        ["Cpt",1],
        ["2L",1],
        [null,null],
        ["Sgt",1],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [null,null],
        [4,2],
        [null,null],
        [null,null],
        [null,null],
        ["Sgt",2],
        [null,null],
        [null,null],
        ["Cpt",2],
        ["LC",2],
        ["1L",2],
        ["P",2],
        ["P",2],
        ["P",2],
        ["P",2],
        ["P",2],
        ["P",2],
        ["2L",2],
        ["S",2],
        [5,2],
        [3,2],
        ["M",2],
        ["F",2],
        ["C",2],
        [2,2],
        [1,2],
        ["S",2],
      ],
      initialPhase:[],
      previous: null,
      isPlayerOne: false,
      currentPlayerTurn: 1,
      player: 1,
      temp: null,
      temp_position: null,
      isPrepStage: true,
      gameEnded: false,
      gameWinner: null
    };
  }
   
  componentDidMount() {
    this.setState({initialPhase : this.state.squares});
    socket.on('board', ({ squares }, currentPlayer) => {
      //console.log(currentPlayer);
      this.setState({currentPlayerTurn:currentPlayer});
      this.setState({squares:squares});
      this.checkWinner();
    })
    socket.on('isPlayer1', (value) => {
      if(value == "true" ? value = 1 : value = 2);
      this.setState({player:value});
      //console.log(this.state.player);
    })
    socket.on('gameEnd', (winner) => {
      //console.log(this.state.player);
      this.setState({gameEnded:true});
      this.setState({gameWinner: winner});
      this.setState({currentPlayerTurn:this.state.player});
      this.state.squares.forEach( (item) => (item[1] = this.state.player));
      //console.log(this.state.squares);
    })
  }

  checkWinner() {
    let p1Piece = 0;
    let p2Piece = 0;
    let winner;
    const p1FlagWinningIndex = [63, 64, 65, 66, 67, 68, 69, 70, 71];
    const p2FlagWinningIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.state.squares.forEach((item, index) => {if (item[1] == 1){
      p1Piece++;
    } if (item[1] == 2){
      p2Piece++;
    } if (item[0] == 'F' && item[1] == 1){
        if(p1FlagWinningIndex.includes(index)){
          winner = "Player 1 wins";
          this.setState({gameEnded:true});
          socket.emit('gameEnd', winner);
        }
        console.log(index);
    } if (item[0] == 'F' && item[1] == 2){
      if(p2FlagWinningIndex.includes(index)){
        winner = "Player 2 wins";
        this.setState({gameEnded:true});
        socket.emit('gameEnd', winner);
      }
      console.log(index);
    }
  });
    if (p2Piece == 0 && p1Piece != 0){
      winner = "Player 1 wins";
      this.setState({gameEnded:true});
      socket.emit('gameEnd', winner);
    } if (p1Piece == 0 && p2Piece != 0) {
      winner = "Player 2 wins";
      this.setState({gameEnded:true});
      socket.emit('gameEnd', winner);
    }
  }

  placePiece (i) {
    const squares = this.state.squares.slice();
    console.log(`${this.state.squares[i][1]} == ${this.state.player}`)
    if (this.state.previous == null){
      this.setState({previous: i});
      this.setState({temp: this.state.squares[i]});
      this.setState({temp_position: i});
    } else {
      if(this.state.temp[1] == this.state.squares[i][1] || this.state.squares[i][1] == null){
        squares[this.state.previous] = this.state.squares[i];
        squares[i] = this.state.temp;
        this.setState({previous: null});
        this.setState({temp: null});
      }
    }
    this.setState({squares: squares});
    socket.emit('board', { squares});
  }
  
  arbiter(piece, enemy, i) {
    const checkIfUnderPiece = {  
      "S" : ["C","F",1,2,3,4,5,"LC","M","Cpt","1L","2L","Sgt"],
      "5" : ["C","F",1,2,3,4,"LC","M","Cpt","P","1L","2L","Sgt"],
      "4" : ["C","F",1,2,3,"LC","M","Cpt","P","1L","2L","Sgt"],
      "3" : ["C","F",1,2,"LC","M","Cpt","P","1L","2L","Sgt"],
      "2" : ["C","F",1,"LC","M","Cpt","P","1L","2L","Sgt"],
      "1" : ["C","F",1,"LC","M","Cpt","P","1L","2L","Sgt"],
      "C" : ["LC","M","Cpt","1L","2L","Sgt","P","F"],
      "LC" : ["M","Cpt","1L","2L","Sgt","P","F"],
      "M" : ["Cpt","1L","2L","Sgt","P","F"],
      "Cpt" : ["1L","2L","Sgt","P","F"],
      "1L" : ["2L","Sgt","P","F"],
      "2L" : ["Sgt","P","F"],
      "Sgt" : ["P","F"],
      "P" : ["S","F"],
      "F" : ["F"],
    }
    //console.log(`Piece: ${piece[1]}`);
    //console.log(`Enemy: ${enemy[1]}`);
    let winner = null;
    //console.log("Checking who's the winner");
    if(checkIfUnderPiece[piece[0]].includes(enemy[0])){
      if(enemy[0] == "F"){
        this.setState({gameEnded:true});
        winner = `Player ${piece[1]} wins!`;
        //console.log(`Player ${piece[1]} wins!`);
        socket.emit('gameEnd', winner);
      }
      //console.log("You win");
      return piece;
    } else if (piece[0] == enemy[0]){
      //console.log(`PIECE: ${piece} - ENEMY: ${enemy}`);
      return [null, null];
    } else {
      //console.log("You lose");
      return enemy;
    }
    // CHECK WHAT PIECE WON
  }

  movePiece (i,team){
    const squares = this.state.squares.slice();
    if(!this.state.gameEnded){
      this.setState({squares: squares});
      if(this.state.currentPlayerTurn == this.state.player){
        if (this.state.previous === null && this.state.squares[i][1] == this.state.currentPlayerTurn){  // first click on the piece
          this.setState({previous: i});
          this.setState({temp: this.state.squares[i]});
        } else {      // if there is a selected piece
          let move = i - this.state.previous
          //console.log(`move = ${i} - ${this.state.previous}`);
          //console.log(`move = ${move}`);
          if (move === -9 || move === 9 || move === -1 || move === 1){ // piece can move one unit at a time
            if (this.state.squares[i][0] === null){  // move to destination unit
              squares[this.state.previous] = this.state.squares[i];
              squares[i] = this.state.temp;
              //console.log(`${this.state.temp} ${this.state.squares[i]}`);
              this.setState({previous: null});
              this.setState({temp: null});
              //console.log(this.state.currentPlayerTurn);
            } else {  // collision with enemy piece
              console.log(`Piece: ${this.state.temp[1]} collide: ${this.state.squares[i][1]}`)
              if(this.state.temp[1] != this.state.squares[i][1]){
                let winner = this.arbiter(this.state.temp, this.state.squares[i]);
                squares[i][0] = winner[0];
                squares[i][1] = winner[1];
                //console.log(squares[i])
                squares[this.state.previous][0] = null;
                squares[this.state.previous][1] = null;
                this.setState({previous: null});
                this.setState({temp: null});
                //console.log(this.state.currentPlayerTurn);
              }
            }
            socket.emit('board', { squares});
            //console.log(this.state.squares);
          }
        }
      }
    }
  }

  renderSquare(i, team) {
    const squares = this.state.squares.slice();
    if (this.state.isPrepStage){
      return (<Square 
        value={squares[i][0]}
        currentTeam = {this.state.squares[i][1]}
        player = {this.state.player}
        onClick={() => this.placePiece(i)}
        gameEnded={this.state.gameEnded}/>
      );
    } else {
      return (<Square 
        value={this.state.squares[i][0]}
        currentTeam = {this.state.squares[i][1]}
        player = {this.state.player}
        onClick={() => this.movePiece(i,team)}
        gameEnded={this.state.gameEnded}/>
      );
    }
  }

  prepStageChange(){
    if(this.state.isPrepStage){
      this.setState({
        isPrepStage : !this.state.isPrepStage});
      //console.log(this.state.squares);
    } else {
      // REVERT TO START PHASE
      this.setState({
        squares : this.state.initialPhase,
        currentPlayerTurn: 1,
        temp: null,
        temp_position: null,
        isPrepStage: true,
        gameEnded: false,
        gameWinner: null
      });
    }    
  }

  render() {
    let gamePhase = "";
    if(this.state.isPrepStage ? gamePhase = "Begin Game" : gamePhase = "Reset Game");
    return (
      <React.Fragment>
        <label>{this.state.gameEnded ? this.state.gameWinner : `Player ${this.state.player}` }</label>
        <Button color="primary" id="prepButton" name="prepButton" onClick={() => this.prepStageChange()}>{gamePhase}</Button>
        <label>{this.state.isPrepStage ? "" : `Player ${this.state.currentPlayerTurn}'s Turn`}</label>
        <div className="board-row">
        <Grid container spacing={0} alignContent="center">
          <Grid item xs>{this.renderSquare(0,1)}</Grid>
          <Grid item xs>{this.renderSquare(1,1)}</Grid>
          <Grid item xs>{this.renderSquare(2,1)}</Grid>
          <Grid item xs>{this.renderSquare(3,1)}</Grid>
          <Grid item xs>{this.renderSquare(4,1)}</Grid>
          <Grid item xs>{this.renderSquare(5,1)}</Grid>
          <Grid item xs>{this.renderSquare(6,1)}</Grid>
          <Grid item xs>{this.renderSquare(7,1)}</Grid>
          <Grid item xs>{this.renderSquare(8,1)}</Grid>
        </Grid>
        </div>
        <div className="board-row">
        <Grid container spacing={0}>
          <Grid item xs>{this.renderSquare(9,1)}</Grid>
          <Grid item xs>{this.renderSquare(10,1)}</Grid>
          <Grid item xs>{this.renderSquare(11,1)}</Grid>
          <Grid item xs>{this.renderSquare(12,1)}</Grid>
          <Grid item xs>{this.renderSquare(13,1)}</Grid>
          <Grid item xs>{this.renderSquare(14,1)}</Grid>
          <Grid item xs>{this.renderSquare(15,1)}</Grid>
          <Grid item xs>{this.renderSquare(16,1)}</Grid>
          <Grid item xs>{this.renderSquare(17,1)}</Grid>
        </Grid>
        </div>
        <div className="board-row">
        <Grid container spacing={0}>
          <Grid item xs>{this.renderSquare(18,1)}</Grid>
          <Grid item xs>{this.renderSquare(19,1)}</Grid>
          <Grid item xs>{this.renderSquare(20,1)}</Grid>
          <Grid item xs>{this.renderSquare(21,1)}</Grid>
          <Grid item xs>{this.renderSquare(22,1)}</Grid>
          <Grid item xs>{this.renderSquare(23,1)}</Grid>
          <Grid item xs>{this.renderSquare(24,1)}</Grid>
          <Grid item xs>{this.renderSquare(25,1)}</Grid>
          <Grid item xs>{this.renderSquare(26,1)}</Grid>
        </Grid>
        </div>
        <div className="board-row">
        <Grid container spacing={0}>
          <Grid item xs>{this.renderSquare(27,1)}</Grid>
          <Grid item xs>{this.renderSquare(28,1)}</Grid>
          <Grid item xs>{this.renderSquare(29,1)}</Grid>
          <Grid item xs>{this.renderSquare(30,1)}</Grid>
          <Grid item xs>{this.renderSquare(31,1)}</Grid>
          <Grid item xs>{this.renderSquare(32,1)}</Grid>
          <Grid item xs>{this.renderSquare(33,1)}</Grid>
          <Grid item xs>{this.renderSquare(34,1)}</Grid>
          <Grid item xs>{this.renderSquare(35,1)}</Grid>
        </Grid>
        </div>
        <div className="board-row">
        <Grid container spacing={0}>
        <Grid item xs>{this.renderSquare(36,1)}</Grid>
        <Grid item xs>{this.renderSquare(37,1)}</Grid>
        <Grid item xs>{this.renderSquare(38,1)}</Grid>
        <Grid item xs>{this.renderSquare(39,1)}</Grid>
        <Grid item xs>{this.renderSquare(40,1)}</Grid>
        <Grid item xs>{this.renderSquare(41,1)}</Grid>
        <Grid item xs>{this.renderSquare(42,1)}</Grid>
        <Grid item xs>{this.renderSquare(43,1)}</Grid>
        <Grid item xs>{this.renderSquare(44,1)}</Grid>
        </Grid>
        </div>
        <div className="board-row">
        <Grid container spacing={0}>
          <Grid item xs>{this.renderSquare(45,1)}</Grid>
          <Grid item xs>{this.renderSquare(46,1)}</Grid>
          <Grid item xs>{this.renderSquare(47,1)}</Grid>
          <Grid item xs>{this.renderSquare(48,1)}</Grid>
          <Grid item xs>{this.renderSquare(49,1)}</Grid>
          <Grid item xs>{this.renderSquare(50,1)}</Grid>
          <Grid item xs>{this.renderSquare(51,1)}</Grid>
          <Grid item xs>{this.renderSquare(52,1)}</Grid>
          <Grid item xs>{this.renderSquare(53,1)}</Grid>
        </Grid>
        </div>
        <div className="board-row">
        <Grid container spacing={0}>
          <Grid item xs>{this.renderSquare(54,1)}</Grid>
          <Grid item xs>{this.renderSquare(55,1)}</Grid>
          <Grid item xs>{this.renderSquare(56,1)}</Grid>
          <Grid item xs>{this.renderSquare(57,1)}</Grid>
          <Grid item xs>{this.renderSquare(58,1)}</Grid>
          <Grid item xs>{this.renderSquare(59,1)}</Grid>
          <Grid item xs>{this.renderSquare(60,1)}</Grid>
          <Grid item xs>{this.renderSquare(61,1)}</Grid>
          <Grid item xs>{this.renderSquare(62,1)}</Grid>
        </Grid>
        </div>
        <div className="board-row">
        <Grid container spacing={0}>
          <Grid item xs>{this.renderSquare(63,1)}</Grid>
          <Grid item xs>{this.renderSquare(64,1)}</Grid>
          <Grid item xs>{this.renderSquare(65,1)}</Grid>
          <Grid item xs>{this.renderSquare(66,1)}</Grid>
          <Grid item xs>{this.renderSquare(67,1)}</Grid>
          <Grid item xs>{this.renderSquare(68,1)}</Grid>
          <Grid item xs>{this.renderSquare(69,1)}</Grid>
          <Grid item xs>{this.renderSquare(70,1)}</Grid>
          <Grid item xs>{this.renderSquare(71,1)}</Grid>
        </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board/>
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

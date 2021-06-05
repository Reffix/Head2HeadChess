var _ = require('underscore');
function Game(params) {

  this.status = 'pending';

  this.activePlayer = null;

  this.players = [
    {color: null, name: null, joined: false, inCheck: false, forfeited: false},
    {color: null, name: null, joined: false, inCheck: false, forfeited: false}
  ];

  this.board = {
    a8: 'bR_', b8: 'bN_', c8: 'bB_', d8: 'bQ_', e8: 'bK_', f8: 'bB_', g8: 'bN_', h8: 'bR_',
    a7: 'bP_', b7: 'bP_', c7: 'bP_', d7: 'bP_', e7: 'bP_', f7: 'bP_', g7: 'bP_', h7: 'bP_',
    a6: null,  b6: null,  c6: null,  d6: null,  e6: null,  f6: null,  g6: null,  h6: null,
    a5: null,  b5: null,  c5: null,  d5: null,  e5: null,  f5: null,  g5: null,  h5: null,
    a4: null,  b4: null,  c4: null,  d4: null,  e4: null,  f4: null,  g4: null,  h4: null,
    a3: null,  b3: null,  c3: null,  d3: null,  e3: null,  f3: null,  g3: null,  h3: null,
    a2: 'wP_', b2: 'wP_', c2: 'wP_', d2: 'wP_', e2: 'wP_', f2: 'wP_', g2: 'wP_', h2: 'wP_',
    a1: 'wR_', b1: 'wN_', c1: 'wB_', d1: 'wQ_', e1: 'wK_', f1: 'wB_', g1: 'wN_', h1: 'wR_'
  };

  this.capturedPieces = [];

  this.validMoves = [
    { type: 'move', pieceCode: 'wP', startSquare: 'a2', endSquare: 'a3' },
    { type: 'move', pieceCode: 'wP', startSquare: 'a2', endSquare: 'a4' },
    { type: 'move', pieceCode: 'wP', startSquare: 'b2', endSquare: 'b3' },
    { type: 'move', pieceCode: 'wP', startSquare: 'b2', endSquare: 'b4' },
    { type: 'move', pieceCode: 'wP', startSquare: 'c2', endSquare: 'c3' },
    { type: 'move', pieceCode: 'wP', startSquare: 'c2', endSquare: 'c4' },
    { type: 'move', pieceCode: 'wP', startSquare: 'd2', endSquare: 'd3' },
    { type: 'move', pieceCode: 'wP', startSquare: 'd2', endSquare: 'd4' },
    { type: 'move', pieceCode: 'wP', startSquare: 'e2', endSquare: 'e3' },
    { type: 'move', pieceCode: 'wP', startSquare: 'e2', endSquare: 'e4' },
    { type: 'move', pieceCode: 'wP', startSquare: 'f2', endSquare: 'f3' },
    { type: 'move', pieceCode: 'wP', startSquare: 'f2', endSquare: 'f4' },
    { type: 'move', pieceCode: 'wP', startSquare: 'g2', endSquare: 'g3' },
    { type: 'move', pieceCode: 'wP', startSquare: 'g2', endSquare: 'g4' },
    { type: 'move', pieceCode: 'wP', startSquare: 'h2', endSquare: 'h3' },
    { type: 'move', pieceCode: 'wP', startSquare: 'h2', endSquare: 'h4' },
    { type: 'move', pieceCode: 'wN', startSquare: 'b1', endSquare: 'a3' },
    { type: 'move', pieceCode: 'wN', startSquare: 'b1', endSquare: 'c3' },
    { type: 'move', pieceCode: 'wN', startSquare: 'g1', endSquare: 'f3' },
    { type: 'move', pieceCode: 'wN', startSquare: 'g1', endSquare: 'h3' }
  ];

  this.lastMove = null;

  this.modifiedOn = Date.now();

 
  if (params.playerColor === 'white') {
    this.players[0].color = 'white';
    this.players[1].color = 'black';
  }
  else if (params.playerColor === 'black') {
    this.players[0].color = 'black';
    this.players[1].color = 'white';
  }
}


Game.prototype.addPlayer = function(playerData) {

  var p = _.findWhere(this.players, {color: playerData.playerColor, joined: false});
  if (!p) { return false; }

  p.name = playerData.playerName;
  p.joined = true;

  if (this.players[0].joined && this.players[1].joined && this.status === 'pending') {
    this.activePlayer = _.findWhere(this.players, {color: 'white'});
    this.status = 'ongoing';
  }

  this.modifiedOn = Date.now();

  return true;
};

Game.prototype.removePlayer = function(playerData) {

  var p = _.findWhere(this.players, {color: playerData.playerColor});
  if (!p) { return false; }

  p.joined = false;

  this.modifiedOn = Date.now();

  return true;
};

Game.prototype.move = function(moveString) {

  var validMove = _.findWhere(this.validMoves, parseMoveString(moveString));
  if (!validMove) { return false; }

  var whitePawnPromotion = new RegExp('(w)P..[-x].8p([RNBQ])');
  var blackPawnPromotion = new RegExp('(b)P..[-x].1p([RNBQ])');
  var promotionMatches, promotionPiece = null;

  if (whitePawnPromotion.test(moveString)) {
    promotionMatches = whitePawnPromotion.exec(moveString);
    promotionPiece   = promotionMatches[1]+promotionMatches[2];
  }

  if (blackPawnPromotion.test(moveString)) {
    promotionMatches = blackPawnPromotion.exec(moveString);
    promotionPiece   = promotionMatches[1]+promotionMatches[2];
  }

  switch (validMove.type) {
    case 'move' :
      this.board[validMove.endSquare] = promotionPiece || validMove.pieceCode;
      this.board[validMove.startSquare] = null;
      break;

    case 'capture' :
      this.capturedPieces.push(this.board[validMove.captureSquare]);
      this.board[validMove.captureSquare] = null;

      this.board[validMove.endSquare] = promotionPiece || validMove.pieceCode;
      this.board[validMove.startSquare] = null;
      break;

    case 'castle' :
      if (validMove.pieceCode === 'wK' && validMove.boardSide === 'queen') {
        this.board.c1 = validMove.pieceCode
        this.board.e1 = null;

        this.board.d1 = 'wR'
        this.board.a1 = null;
      }
      if (validMove.pieceCode === 'wK' && validMove.boardSide === 'king') {
        this.board.g1 = validMove.pieceCode
        this.board.e1 = null;

        this.board.f1 = 'wR'
        this.board.h1 = null;
      }
      if (validMove.pieceCode === 'bK' && validMove.boardSide === 'queen') {
        this.board.c8 = validMove.pieceCode
        this.board.e8 = null;

        this.board.d8 = 'bR'
        this.board.a8 = null;
      }
      if (validMove.pieceCode === 'bK' && validMove.boardSide === 'king') {
        this.board.g8 = validMove.pieceCode
        this.board.e8 = null;

        this.board.f8 = 'bR'
        this.board.h8 = null;
      }
      break;

    default : break;
  };

  this.lastMove = validMove;

  var inactivePlayer = _.find(this.players, function(p) {
    return (p === this.activePlayer) ? false : true;
  }, this);

  this.validMoves = getMovesForPlayer(inactivePlayer.color, this.board, this.lastMove);

  _.each(this.players, function(p) {
    p.inCheck = isPlayerInCheck(p.color, this.board);
  }, this);

  if (this.validMoves.length === 0) {
    this.status = (inactivePlayer.inCheck) ? 'checkmate' : 'stalemate' ;
  }

  if (this.status === 'ongoing') { this.activePlayer = inactivePlayer; }

  this.modifiedOn = Date.now();

  return true;
};

Game.prototype.forfeit = function(playerData) {

  var p = _.findWhere(this.players, {color: playerData.playerColor});
  if (!p) { return false; }

  p.forfeited = true;

  this.status = 'forfeit';

  this.modifiedOn = Date.now();

  return true;
};

var getMovesForPlayer = function(playerColor, board, lastMove) {
  var moves = [];
  var piece, square = null;

  for (square in board) {
    piece = board[square];

    if (piece === null) { continue; }
    if (piece[0] !== playerColor[0]) { continue; }

    switch (piece[1]) {
      case 'P': moves.push.apply(moves, getMovesForPawn(piece, square, board, lastMove)); break;
      case 'R': moves.push.apply(moves, getMovesForRook(piece, square, board)); break;
      case 'N': moves.push.apply(moves, getMovesForKnight(piece, square, board)); break;
      case 'B': moves.push.apply(moves, getMovesForBishop(piece, square, board)); break;
      case 'Q': moves.push.apply(moves, getMovesForQueen(piece, square, board)); break;
      case 'K': moves.push.apply(moves, getMovesForKing(piece, square, board)); break;
    }
  }

  return moves;
};


var getMovesForPawn = function(piece, square, board, lastMove, includeUnsafe) {
  var moves = [];

  var moveTransforms, captureTransforms = [];

  if (piece[0] === 'w') {
    moveTransforms    = (piece[2] === '_') ? [{x:+0, y:+1}, {x:+0, y:+2}] : [{x:+0, y:+1}];
    captureTransforms = [{x:+1, y:+1}, {x:-1, y:+1}];
  }

  if (piece[0] === 'b') {
    moveTransforms    = (piece[2] === '_') ? [{x:+0, y:-1}, {x:+0, y:-2}] : [{x:+0, y:-1}];
    captureTransforms = [{x:+1, y:-1}, {x:-1, y:-1}];
  }

  var destination, move, capture = null;

  for (var i=0; i<moveTransforms.length; i++) {

    destination = transformSquare(square, moveTransforms[i]);
    if (!destination) { break; }

    if (board[destination] === null) {
      move = {type: 'move', pieceCode: piece.substring(0,2), startSquare: square, endSquare: destination};
      if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
    }
    else {
      break;
    }
  }

  for (var i=0; i<captureTransforms.length; i++) {

    destination = transformSquare(square, captureTransforms[i]);
    if (!destination) { continue; }

    if (board[destination] === null) {

      if (piece[0] === 'w') {
        epPreReq = {
          type        : 'move',
          pieceCode   : 'bP',
          startSquare : destination[0] + '7',
          endSquare   : destination[0] + square[1]
        };
      }
      if (piece[0] === 'b') {
        epPreReq = {
          type        : 'move',
          pieceCode   : 'wP',
          startSquare : destination[0]+'2',
          endSquare   : destination[0] + square[1]
        };
      }

      if (_.isEqual(lastMove, epPreReq)) {
        capture = {
          type          : 'capture',
          pieceCode     : piece.substring(0,2),
          startSquare   : square,
          endSquare     : destination,
          captureSquare : destination[0]+square[1]
        };
        if (includeUnsafe || isMoveSafe(capture, board)) { moves.push(capture); }
      }
    }
    else if (board[destination][0] !== piece[0]) {
      capture = {
        type          : 'capture',
        pieceCode     : piece.substring(0,2),
        startSquare   : square,
        endSquare     : destination,
        captureSquare : destination
      };
      if (includeUnsafe || isMoveSafe(capture, board)) { moves.push(capture); }
    }
    else {
    }
  }

  return moves;
};

var getMovesForRook = function(piece, square, board, includeUnsafe) {
  var moves = [];

  var transforms = {
    n: [{x:0, y:+1}, {x:0, y:+2}, {x:0, y:+3}, {x:0, y:+4}, {x:0, y:+5}, {x:0, y:+6}, {x:0, y:+7}],
    e: [{x:+1, y:0}, {x:+2, y:0}, {x:+3, y:0}, {x:+4, y:0}, {x:+5, y:0}, {x:+6, y:0}, {x:+7, y:0}],
    s: [{x:0, y:-1}, {x:0, y:-2}, {x:0, y:-3}, {x:0, y:-4}, {x:0, y:-5}, {x:0, y:-6}, {x:0, y:-7}],
    w: [{x:-1, y:0}, {x:-2, y:0}, {x:-3, y:0}, {x:-4, y:0}, {x:-5, y:0}, {x:-6, y:0}, {x:-7, y:0}]
  };

  var destination, move = null;

  for (var group in transforms) {
    for (var i=0; i<transforms[group].length; i++) {

      destination = transformSquare(square, transforms[group][i]);
      if (!destination) { break; }

      if (board[destination] === null) {
        move = {
          type        : 'move',
          pieceCode   : piece.substring(0,2),
          startSquare : square,
          endSquare   : destination
        };
        if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
      }
      else if (board[destination][0] !== piece[0]) {
        move = {
          type          : 'capture',
          pieceCode     : piece.substring(0,2),
          startSquare   : square,
          endSquare     : destination,
          captureSquare : destination
        };
        if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
        break;
      }
      else {
        break;
      }
    }
  }

  return moves;
};

var getMovesForKnight = function(piece, square, board, includeUnsafe) {
  var moves = [];

  var transforms = [
    {x:+1, y:+2},
    {x:+2, y:+1},
    {x:+2, y:-1},
    {x:+1, y:-2},
    {x:-1, y:-2},
    {x:-2, y:-1},
    {x:-2, y:+1},
    {x:-1, y:+2}
  ];

  var destination, move = null;

  for (var i=0; i<transforms.length; i++) {

    destination = transformSquare(square, transforms[i]);
    if (!destination) { continue; }

    if (board[destination] === null) {
      move = {
        type        : 'move',
        pieceCode   : piece.substring(0,2),
        startSquare : square,
        endSquare   : destination
      };
      if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
    }

    else if (board[destination][0] !== piece[0]) {
      move = {
        type          : 'capture',
        pieceCode     : piece.substring(0,2),
        startSquare   : square,
        endSquare     : destination,
        captureSquare : destination
      };
      if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
    }
    else {
      
    }
  }

  return moves;
};

var getMovesForBishop = function(piece, square, board, includeUnsafe) {
  var moves = [];

  var transforms = {
    ne: [{x:+1, y:+1}, {x:+2, y:+2}, {x:+3, y:+3}, {x:+4, y:+4}, {x:+5, y:+5}, {x:+6, y:+6}, {x:+7, y:+7}],
    se: [{x:+1, y:-1}, {x:+2, y:-2}, {x:+3, y:-3}, {x:+4, y:-4}, {x:+5, y:-5}, {x:+6, y:-6}, {x:+7, y:-7}],
    sw: [{x:-1, y:-1}, {x:-2, y:-2}, {x:-3, y:-3}, {x:-4, y:-4}, {x:-5, y:-5}, {x:-6, y:-6}, {x:-7, y:-7}],
    nw: [{x:-1, y:+1}, {x:-2, y:+2}, {x:-3, y:+3}, {x:-4, y:+4}, {x:-5, y:+5}, {x:-6, y:+6}, {x:-7, y:+7}]
  };

  var destination, move = null;

  for (var group in transforms) {
    for (var i=0; i<transforms[group].length; i++) {

      destination = transformSquare(square, transforms[group][i]);
      if (!destination) { break; }

      if (board[destination] === null) {
        move = {
          type        : 'move',
          pieceCode   : piece.substring(0,2),
          startSquare : square,
          endSquare   : destination
        };
        if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
      }
      else if (board[destination][0] !== piece[0]) {
        move = {
          type          : 'capture',
          pieceCode     : piece.substring(0,2),
          startSquare   : square,
          endSquare     : destination,
          captureSquare : destination
        };
        if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
        break;
      }
      else {
        break;
      }
    }
  }

  return moves;
};

var getMovesForQueen = function(piece, square, board, includeUnsafe) {
  var moves = [];

  var transforms = {
    n:  [{x:+0, y:+1}, {x:+0, y:+2}, {x:+0, y:+3}, {x:+0, y:+4}, {x:+0, y:+5}, {x:+0, y:+6}, {x:+0, y:+7}],
    ne: [{x:+1, y:+1}, {x:+2, y:+2}, {x:+3, y:+3}, {x:+4, y:+4}, {x:+5, y:+5}, {x:+6, y:+6}, {x:+7, y:+7}],
    e:  [{x:+1, y:+0}, {x:+2, y:+0}, {x:+3, y:+0}, {x:+4, y:+0}, {x:+5, y:+0}, {x:+6, y:+0}, {x:+7, y:+0}],
    se: [{x:+1, y:-1}, {x:+2, y:-2}, {x:+3, y:-3}, {x:+4, y:-4}, {x:+5, y:-5}, {x:+6, y:-6}, {x:+7, y:-7}],
    s:  [{x:+0, y:-1}, {x:+0, y:-2}, {x:+0, y:-3}, {x:+0, y:-4}, {x:+0, y:-5}, {x:+0, y:-6}, {x:+0, y:-7}],
    sw: [{x:-1, y:-1}, {x:-2, y:-2}, {x:-3, y:-3}, {x:-4, y:-4}, {x:-5, y:-5}, {x:-6, y:-6}, {x:-7, y:-7}],
    w:  [{x:-1, y:+0}, {x:-2, y:+0}, {x:-3, y:+0}, {x:-4, y:+0}, {x:-5, y:+0}, {x:-6, y:+0}, {x:-7, y:+0}],
    nw: [{x:-1, y:+1}, {x:-2, y:+2}, {x:-3, y:+3}, {x:-4, y:+4}, {x:-5, y:+5}, {x:-6, y:+6}, {x:-7, y:+7}]
  };

  var destination, move = null;

  for (var group in transforms) {
    for (var i=0; i<transforms[group].length; i++) {

      destination = transformSquare(square, transforms[group][i]);
      if (!destination) { break; }

      if (board[destination] === null) {
        move = {
          type        : 'move',
          pieceCode   : piece.substring(0,2),
          startSquare : square,
          endSquare   : destination
        };
        if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
      }

      else if (board[destination][0] !== piece[0]) {
        move = {
          type          : 'capture',
          pieceCode     : piece.substring(0,2),
          startSquare   : square,
          endSquare     : destination,
          captureSquare : destination
        };
        if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
        break;
      }
      else {
        break;
      }
    }
  }

  return moves;
};

var getMovesForKing = function(piece, square, board, includeUnsafe) {
  var moves = [];

  var transforms = [
    {x:+0, y:+1},
    {x:+1, y:+1},
    {x:+1, y:+0},
    {x:+1, y:-1},
    {x:+0, y:-1},
    {x:-1, y:-1},
    {x:-1, y:+0},
    {x:-1, y:+1}
  ];

  var destination, move = null;

  for (var i=0; i<transforms.length; i++) {

    destination = transformSquare(square, transforms[i]);
    if (!destination) { continue; }

    if (board[destination] === null) {
      move = {
        type        : 'move',
        pieceCode   : piece.substring(0,2),
        startSquare : square,
        endSquare   : destination
      };
      if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
    }
    else if (board[destination][0] !== piece[0]) {
      move = {
        type          : 'capture',
        pieceCode     : piece.substring(0,2),
        startSquare   : square,
        endSquare     : destination,
        captureSquare : destination
      };
      if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
    }
    else {
    }
  }

  if (piece[0] === 'w') {
    if (board.e1 === 'wK_' && board.h1 === 'wR_' && board.f1 === null && board.g1 === null) {
      move = {
        type: 'castle',
        pieceCode: 'wK',
        boardSide: 'king'
      };
      if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
    }
    if (board.e1 === 'wK_' && board.a1 === 'wR_' && board.b1 === null && board.c1 === null && board.d1 === null) {
      move = {
        type: 'castle',
        pieceCode: 'wK',
        boardSide: 'queen'
      };
      if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
    }
  }

  if (piece[0] === 'b') {
    if (board.e8 === 'bK_' && board.h8 === 'bR_' && board.f8 === null && board.g8 === null) {
      move = {
        type: 'castle',
        pieceCode: 'bK',
        boardSide: 'king'
      };
      if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
    }
    if (board.e8 === 'bK_' && board.a8 === 'bR_' && board.b8 === null && board.c8 === null && board.d8 === null) {
      move = {
        type: 'castle',
        pieceCode: 'bK',
        boardSide: 'queen'
      };
      if (includeUnsafe || isMoveSafe(move, board)) { moves.push(move); }
    }
  }

  return moves;
};

var isPlayerInCheck = function(playerColor, board) {
  var opponentColor = null;
  var kingSquare    = null;
  var moves         = [];

  if (playerColor === 'white') {
    playerColor   = 'w';
    opponentColor = 'b';
  }
  if (playerColor === 'black') {
    playerColor   = 'b';
    opponentColor = 'w';
  }

  for (var sq in board) {
    if (board[sq] && board[sq].substring(0,2) === playerColor+'K') {
      kingSquare = sq;
      break;
    }
  }

  moves = getMovesForPawn(playerColor+'P', kingSquare, board, null, true);
  for (var i=0; i<moves.length; i++) {
    if (moves[i].type === 'capture' && board[moves[i].captureSquare].substring(0,2) === opponentColor+'P') {
      return true;
    }
  }

  moves = getMovesForRook(playerColor+'R', kingSquare, board, true);
  for (var i=0; i<moves.length; i++) {
    if (moves[i].type === 'capture' && board[moves[i].captureSquare].substring(0,2) === opponentColor+'R') {
      return true;
    }
  }

  moves = getMovesForKnight(playerColor+'N', kingSquare, board, true);
  for (var i=0; i<moves.length; i++) {
    if (moves[i].type === 'capture' && board[moves[i].captureSquare].substring(0,2) === opponentColor+'N') {
      return true;
    }
  }

  moves = getMovesForBishop(playerColor+'B', kingSquare, board, true);
  for (var i=0; i<moves.length; i++) {
    if (moves[i].type === 'capture' && board[moves[i].captureSquare].substring(0,2) === opponentColor+'B') {
      return true;
    }
  }

  moves = getMovesForQueen(playerColor+'Q', kingSquare, board, true);
  for (var i=0; i<moves.length; i++) {
    if (moves[i].type === 'capture' && board[moves[i].captureSquare].substring(0,2) === opponentColor+'Q') {
      return true;
    }
  }

  moves = getMovesForKing(playerColor+'K', kingSquare, board, true);
  for (var i=0; i<moves.length; i++) {
    if (moves[i].type === 'capture' && board[moves[i].captureSquare].substring(0,2) === opponentColor+'K') {
      return true;
    }
  }

  return false;
};

var isMoveSafe = function(move, board) {
  var testBoard   = {};
  var playerColor = null;

  if (move.pieceCode[0] === 'w') { playerColor = 'white'; }
  if (move.pieceCode[0] === 'b') { playerColor = 'black'; }

  for (prop in board) { testBoard[prop] = board[prop]; }

  if (move.type === 'move') {
    testBoard[move.endSquare]   = move.pieceCode;
    testBoard[move.startSquare] = null;

    return (isPlayerInCheck(playerColor, testBoard)) ? false : true ;
  }

  if (move.type === 'capture') {
    testBoard[move.captureSquare] = null;
    testBoard[move.endSquare]     = move.pieceCode;
    testBoard[move.startSquare]   = null;

    return (isPlayerInCheck(playerColor, testBoard)) ? false : true ;
  }

  if (move.type === 'castle') {
    var kingSquare, rookSquare = null;
    var kingTravelSquares      = [];
    var castleTestBoard        = {};

    if (playerColor === 'white') {
      kingSquare = 'e1';
      if (move.boardSide === 'king') {
        rookSquare        = 'h1';
        kingTravelSquares = ['f1', 'g1'];
      }
      if (move.boardSide === 'queen') {
        rookSquare        = 'a1';
        kingTravelSquares = ['d1', 'c1'];
      }
    }

    if (playerColor === 'black') {
      kingSquare = 'e8';
      if (move.boardSide === 'king') {
        rookSquare        = 'h8';
        kingTravelSquares = ['f8', 'g8'];
      }
      if (move.boardSide === 'queen') {
        rookSquare        = 'a8';
        kingTravelSquares = ['d8', 'c8'];
      }
    }

    if (isPlayerInCheck(playerColor, testBoard)) { return false; }

    for (var i=0; i<kingTravelSquares.length; i++) {
      castleTestBoard = testBoard;

      castleTestBoard[kingTravelSquares[i]] = move.pieceCode;
      castleTestBoard[kingSquare]           = null;

      if (isPlayerInCheck(playerColor, castleTestBoard)) { return false; }
    }

    testBoard[kingTravelSquares[1]] = move.pieceCode;
    testBoard[kingSquare]           = null;

    testBoard[kingTravelSquares[0]] = playerColor[0]+'R';
    testBoard[rookSquare]           = null;

    return (isPlayerInCheck(playerColor, testBoard)) ? false : true ;
  }

  return false;
};

var transformSquare = function(square, transform) {
  var alpha2num = function(a) {
    switch (a) {
      case 'a': return 1;
      case 'b': return 2;
      case 'c': return 3;
      case 'd': return 4;
      case 'e': return 5;
      case 'f': return 6;
      case 'g': return 7;
      case 'h': return 8;
      default : return 9; 
    }
  };

  var num2alpha = function(n) {
    switch (n) {
       case 1: return 'a';
       case 2: return 'b';
       case 3: return 'c';
       case 4: return 'd';
       case 5: return 'e';
       case 6: return 'f';
       case 7: return 'g';
       case 8: return 'h';
      default: return 'i'; 
    }
  };

  var file = square[0];
  var rank = parseInt(square[1], 10);

  var destFile = alpha2num(file) + transform.x;
  var destRank = rank + transform.y;

  if (destFile < 1 || destFile > 8) { return false; }
  if (destRank < 1 || destRank > 8) { return false; }

  return num2alpha(destFile) + destRank;
};

var parseMoveString = function(moveString) {

  if (moveString === 'wK0-0')   { return {type: 'castle', pieceCode: 'wK', boardSide: 'king'};  }
  if (moveString === 'bK0-0')   { return {type: 'castle', pieceCode: 'bK', boardSide: 'king'};  }
  if (moveString === 'wK0-0-0') { return {type: 'castle', pieceCode: 'wK', boardSide: 'queen'}; }
  if (moveString === 'bK0-0-0') { return {type: 'castle', pieceCode: 'bK', boardSide: 'queen'}; }

  if (moveString[1] === 'P' && moveString[4] === 'x' && moveString.slice(-2) === 'ep') {
    return {
      type          : 'capture',
      pieceCode     : moveString.substring(0, 2),
      startSquare   : moveString.substring(2, 4),
      endSquare     : moveString.substring(5, 7),
      captureSquare : moveString[5] + moveString[3]
    }
  }

  if (moveString[4] === '-') {
    return {
      type        : 'move',
      pieceCode   : moveString.substring(0, 2),
      startSquare : moveString.substring(2, 4),
      endSquare   : moveString.substring(5, 7)
    }
  }
  else if (moveString[4] === 'x') {
    return {
      type          : 'capture',
      pieceCode     : moveString.substring(0, 2),
      startSquare   : moveString.substring(2, 4),
      endSquare     : moveString.substring(5, 7),
      captureSquare : moveString.substring(5, 7)
    }
  } else {
    return null;
  }
};

module.exports = Game;
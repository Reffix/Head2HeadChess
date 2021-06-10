var DB = null;

var validateGame = function (req) {
  if (!req.session.gameID) {
    return null;
  }
  if (!req.session.playerColor) {
    return null;
  }
  if (!req.session.playerName) {
    return null;
  }
  if (!req.params.id) {
    return null;
  }

  if (req.session.gameID !== req.params.id) {
    return null;
  }

  return {
    gameID: req.session.gameID,
    playerColor: req.session.playerColor,
    playerName: req.session.playerName,
  };
};

var validateStartGame = function (req) {
  if (!req.body["player-color"]) {
    return null;
  }

  if (
    req.body["player-color"] !== "white" &&
    req.body["player-color"] !== "black"
  ) {
    return null;
  }

  if (/^\s*$/.test(req.body["player-name"])) {
    req.body["player-name"] = "Player 1";
  }

  return {
    playerColor: req.body["player-color"],
    playerName: req.body["player-name"],
  };
};

var validateJoinGame = function (req) {
  if (!req.body["game-id"]) {
    return null;
  }

  if (/^\s*$/.test(req.body["game-id"])) {
    return null;
  }

  if (/^\s*$/.test(req.body["player-name"])) {
    req.body["player-name"] = "Player 2";
  }

  return {
    gameID: req.body["game-id"],
    playerName: req.body["player-name"],
  };
};

var home = function (req, res) {
  res.render("home");
};

var homepage = function(req, res) {
  res.render("homepage");
}

var login = function(req, res) {
  res.render("login");
}

var register = function(req, res) {
  res.render("register");
}

var game = function (req, res) {
  var validData = validateGame(req);
  if (!validData) {
    res.redirect("/home");
    return;
  }

  res.render("game", validData);
};

var startGame = function (req, res) {
  req.session.regenerate(function (err) {
    if (err) {
      res.redirect("/home");
      return;
    }

    var validData = validateStartGame(req);
    if (!validData) {
      res.redirect("/home");
      return;
    }

    var gameID = DB.add(validData);

    req.session.gameID = gameID;
    req.session.playerColor = validData.playerColor;
    req.session.playerName = validData.playerName;

    res.redirect("/game/" + gameID);
  });
};

var joinGame = function (req, res) {
  req.session.regenerate(function (err) {
    if (err) {
      res.redirect("/home");
      return;
    }

    var validData = validateJoinGame(req);
    if (!validData) {
      res.redirect("/home");
      return;
    }

    var game = DB.find(validData.gameID);
    if (!game) {
      res.redirect("/home");
      return;
    }

    var joinColor = game.players[0].joined
      ? game.players[1].color
      : game.players[0].color;

    req.session.gameID = validData.gameID;
    req.session.playerColor = joinColor;
    req.session.playerName = validData.playerName;

    res.redirect("/game/" + validData.gameID);
  });
};

var invalid = function (req, res) {
  res.redirect("/home");
};

exports.attach = function (app, db) {
  DB = db;

  app.get('/', homepage);
  app.get('/login', login);
  app.get('/register', register);
  app.get('/home', home);
  app.get('/game/:id', game);
  app.post('/start', startGame);
  app.post('/join', joinGame);
  app.all('*', invalid);
};

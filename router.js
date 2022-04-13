const bcrypt = require("bcrypt");

class Router {
  constructor(app, db) {
    this.login(app, db);
    this.logout(app, db);
    this.isLoggedIn(app, db);
    this.findUsername(app, db);
    this.register(app, db);
    this.passwordReset(app, db);
  }

  login(app, db) {
    app.post("/login", (req, res) => {
      let username = req.body.username;
      let password = req.body.password;

      username = username.toLowerCase();

      if (username.length > 12 || password.length > 12) {
        res.json({
          success: false,
          message: "Username or password is incorrect, please try again.",
        });
        return;
      }

      let cols = [username];
      db.query(
        "SELECT * FROM user WHERE username = ? LIMIT 1",
        cols,
        (err, data, fields) => {
          if (err) {
            res.json({
              success: false,
              message: "An error has occured, please try again.",
            });
            return;
          }

          // User found
          if (data && data.length === 1) {
            bcrypt.compare(
              password,
              data[0].password,
              (bcryptErr, verified) => {
                if (verified) {
                  req.session.userID = data[0].id;
                  res.json({
                    success: true,
                    username: data[0].username,
                  });
                  return;
                } else {
                  res.json({
                    success: false,
                    message:
                      "Username or password is incorrect, please try again.",
                  });
                }
              }
            );
          } else {
            res.json({
              success: false,
              message: "Username or password is incorrect, please try again.",
            });
          }
        }
      );
    });
  }

  logout(app, db) {
    app.post("/logout", (req, res) => {
      if (req.session.userID) {
        req.session.destroy();
        res.json({
          success: true,
        });
        return true;
      } else {
        res.json({
          sucess: false,
        });
        return false;
      }
    });
  }

  isLoggedIn(app, db) {
    app.post("/isLoggedIn", (req, res) => {
      if (req.session.userID) {
        let cols = [req.session.userID];
        db.query(
          "SELECT * FROM user WHERE id = ? LIMIT 1",
          cols,
          (err, data, fields) => {
            if (data && data.length === 1) {
              res.json({
                success: true,
                username: data[0].username,
              });
              return true;
            } else {
              res.json({
                sucesss: false,
              });
            }
          }
        );
      } else {
        res.json({
          sucesss: false,
        });
      }
    });
  }

  findUsername(app, db) {
    app.post("/findUsername", (req, res) => {
      let username = req.body.username;

      username = username.toLowerCase();

      if (username.length > 12) {
        res.json({
          success: false,
          message: "Username or password is incorrect, please try again.",
        });
        return;
      }

      let cols = [username];
      db.query(
        "SELECT * FROM user WHERE username = ? LIMIT 1",
        cols,
        (err, data, fields) => {
          if (err) {
            res.json({
              success: false,
              message: "An error has occured, please try again.",
            });
            return;
          }

          // User found
          if (data && data.length === 1) {
            res.json({
              success: true,
              username: data[0].username,
            });
            return;
          } else {
            res.json({
              success: false,
              message: "",
            });
          }
        }
      );
    });
  }

  register(app, db) {
    app.post("/register", (req, res) => {
      let username = req.body.username;
      let password = req.body.password;

      username = username.toLowerCase();

      if (username.length > 12 || password.length > 12) {
        res.json({
          success: false,
          message: "Username or password is incorrect, please try again.",
        });
        return;
      }
      password = bcrypt.hashSync(password, 9);
      let cols = [[username, password]];
      db.query(
        "INSERT INTO user (username, password) VALUES ?",
        [cols],
        (err, data, fields) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              message: "An error has occured, please try again.",
            });
            return;
          } else {
            req.session.userID = data[0].id;
            res.json({
              success: true,
              username: data[0].username,
            });
          }
        }
      );
    });
  }

  passwordReset(app, db) {
    app.post("/passwordReset", (req, res) => {
      let username = req.body.username;
      let password = req.body.password;

      username = username.toLowerCase();

      if (username.length > 12 || password.length > 12) {
        res.json({
          success: false,
          message: "Username or password is incorrect, please try again.",
        });
        return;
      }
      password = bcrypt.hashSync(password, 9);
      let cols = [password, username];
      db.query(
        `UPDATE user SET password = ? WHERE username = ?`,
        cols,
        (err, data, fields) => {
          if (err) {
            console.log(err);
            res.json({
              success: false,
              message: "An error has occured, please try again.",
            });
            return;
          }
          // User found
          if (data && data.length === 1) {
            req.session.userID = data[0].id;
            res.json({
              success: true,
              username: data[0].username,
            });
          } else {
            res.json({
              success: false,
              message: "Username or password is incorrect, please try again.",
            });
          }
        }
      );
    });
  }
}

module.exports = Router;

const express = require("express");
const pgp = require('pg-promise')(/* options */);
const bodyParser = require('body-parser')
const router = express.Router();
const cors = require("cors");
const db = pgp("postgres://andrew:123@0.0.0.0:5432/postgres");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const app = express();
const port = 8000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());
app.use("/", router);

function index(req, res, next) {
    return res.status(200).json({message: "HELLO"});
}

async function getNotes(req, res, next) {
    try {
        const result = await db.many(`SELECT * FROM notes`);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

async function getNote(req, res, next) {
  try {
    const result = await db.one(`SELECT * FROM notes WHERE id=$1`, 3);
    return res.status(200).json(result);
} catch (error) {
    return res.status(500).json({message: error.message});
}
}

// ================= //

const hashPassword = (password) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, 10, (err, hash) => {
      err ? reject(err) : resolve(hash);
    })
  )
}

const createUser = (user) => {
  return database.raw(
    "INSERT INTO users (username, password_digest, token, created_at) VALUES (?, ?, ?, ?) RETURNING id, username, created_at, token",
    [user.username, user.password_digest, user.token, new Date()]
  )
  .then((data) => data.rows[0]);
}

const createToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'));
    })
  })
}

const findUser = (userReq) => {
  return database.raw("SELECT * FROM users WHERE username = ?", [userReq.username])
    .then((data) => data.rows[0]);
}

const checkPassword = (reqPassword, foundUser) => {
  return new Promise((resolve, reject) =>
    bcrypt.compare(reqPassword, foundUser.password_digest, (err, response) => {
        if (err) {
          reject(err);
        }
        else if (response) {
          resolve(response);
        } else {
          reject(new Error('Passwords do not match.'));
        }
    })
  )
}

const updateUserToken = (token, user) => {
  return database.raw("UPDATE users SET token = ? WHERE id = ? RETURNING id, username, token", [token, user.id])
    .then((data) => data.rows[0])
}
//=================//

const signup = (request, response) => {
  const user = request.body
  hashPassword(user.password)
    .then((hashedPassword) => {
      delete user.password
      user.password_digest = hashedPassword;
    })
    .then(() => createToken())
    .then(token => user.token = token)
    .then(() => createUser(user))
    .then(user => {
      delete user.password_digest;
      response.status(201).json({ user });
    })
    .catch((err) => console.error(err));
}

const signin = (request, response) => {
  const userReq = request.body;
  let user;

  findUser(userReq)
    .then(foundUser => {
      user = foundUser
      return checkPassword(userReq.password, foundUser)
    })
    .then((res) => createToken())
    .then(token => updateUserToken(token, user))
    .then(() => {
      delete user.password_digest
      response.status(200).json(user)
    })
    .catch((err) => console.error(err))
}

const findByToken = (token) => {
  return database.raw("SELECT * FROM users WHERE token = ?", [token])
    .then((data) => data.rows[0])
}

const authenticate = (userReq) => {
  findByToken(userReq.token)
    .then((user) => {
      if (user.username == userReq.username) {
        return true
      } else {
        return false
      }
    })
}



// ====== router ======

router.get("/", index);

router.get("/notes", getNotes);
router.get("/notes/:id", getNote);

router.post("/notes")


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


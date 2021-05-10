const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
    Role.find(
        {
            name: { $in: req.body.role }
        },
        (err, role) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            user.role = role._id
            user.save(err => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                res.send({ message: "User was registered successfully!" });
            });
        }
    );
}

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("role", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Wrong Password!",
        });
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authority = user.role.name.toUpperCase();

      
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        role: authority,
        accessToken: token,
      });
    });
};
const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');





//ROTA PARA VIEW DE CRIACAO DE USUARIOS
router.get("/admin/users/create", adminAuth, (req, resp) => {
    resp.render("admin/users/create");
});

//ROTA PARA CRIACAO DE USUARIOS
router.post("/users/create", adminAuth, (req, resp) => {
    var email = req.body.email;
    var password = req.body.password;

    if (email != undefined && password != undefined) {

        User.findOne({ where: { email: email } })
            .then(user => {
                if (user == undefined) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(password, salt);

                    User.create({
                        email: email,
                        password: hash
                    })
                        .then(() => {
                            resp.redirect("/login");
                        })
                        .catch(erro => {
                            resp.redirect("/login");
                        });
                }
                else {
                    resp.redirect("/admin/users/create");
                }
            });

    };
});

//ROTA PARA VIEW DE LOGIN DE USUARIO
router.get("/login", (req, resp) => {
    resp.render("admin/users/login");
});

//ROTA PARA AUTENTICACAO DE USUARIO
router.post("/users/login", (req, resp) => {
    email = req.body.email;
    password = req.body.password;

    User.findOne({ where: { email: email } })
        .then(user => {
            if (user != undefined) {
                var correct = bcrypt.compareSync(password, user.password);

                if (correct) {
                    req.session.user = {
                        id: user.id,
                        email: user.email
                    };

                    resp.redirect("/admin/articles");
                }
                else {
                    resp.redirect("/login");
                }
            }
            else {
                resp.redirect("/login");
            }
        })
});



module.exports = router;
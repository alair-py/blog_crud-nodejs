const express = require('express');
const { default: slugify } = require('slugify');
const router = express.Router();
const slufigy = require('slugify');
const Categorie = require('./Categorie');
const adminAuth = require('../middlewares/adminAuth');






//ROTA DE SALVAMENTO DE DADOS
router.get("/admin/categories/new", adminAuth, (req, resp) => {
    resp.render("admin/categories/new");
});

router.post("/categories/save", adminAuth, (req, resp) => {
    var title = req.body.title;

    if (title != undefined && title != '') {
        Categorie.create({
            title: title,
            slug: slufigy(title)
        })
            .then(() => {
                resp.redirect("/admin/categories");
            });
    }
    else {
        resp.redirect("/admin/categories/new");
    };
});




//ROTA DE LEITURA DE DADOS
router.get("/admin/categories", adminAuth, (req, resp) => {
    Categorie.findAll({ raw: true })
        .then(categories => {
            resp.render("admin/categories/index.ejs", {
                categories: categories
            });
        });
});




//ROTA DE DELEÇÃO DE DADOS
router.post("/categories/delete", adminAuth, (req, resp) => {
    var id = req.body.id;
    //verifica se é undefined
    if (id != undefined) {
        //verifica se não é um número
        if (!isNaN(id)) {
            //caso seja um número, método destroy para deletar baseado no id recuperado
            Categorie.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                resp.redirect("/admin/categories");
            })
        }
        else {
            resp.redirect("/admin/categories");
        }
    }
    else {
        resp.redirect("/admin/categories");
    };
});




//ROTA DE RECUPERACAO E EXIBICAO DE DADOS ANTES DE ATUALIZAR
router.get("/admin/categories/edit/:id", adminAuth, (req, resp) => {
    var id = req.params.id;

    if (isNaN(id)) {
        redirect.render("/admin/categories");
    }

    Categorie.findByPk(id)
        .then(categorie => {
            if (categorie != undefined) {
                resp.render("admin/categories/edit.ejs", {
                    categorie: categorie
                });
            }
            else {
                redirect.render("/admin/categories");
            }
        })
        .catch(erro => {
            redirect.render("/admin/categories");
        });
});

//ROTA DE ATUALIZAR DADOS RECUPERADOS E EXIBIDOS ANTERIORMENTE (CATEGORIAS)
router.post("/categories/update", adminAuth, (req, resp) => {
    var id = req.body.id;
    var title = req.body.title;

    if (isNaN(id)) {
        redirect.render("/admin/categories/edit.ejs");
    }

    if (id != undefined) {
        Categorie.update({ title: title, slug: slugify(title) }, {
            where: {
                id: id
            }
        })
            .then(() => {
                resp.redirect("/admin/categories");
            });
    }
});






module.exports = router;
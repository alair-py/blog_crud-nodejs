const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Article = require('./Article');
const Categorie = require('../categories/Categorie');
const adminAuth = require('../middlewares/adminAuth');


router.get("/admin/articles/new", adminAuth, (req, resp) => {
    Categorie.findAll({ raw: true })
        .then(categories => {
            resp.render("admin/articles/new", {
                categories: categories
            });
        });

});

//ROTA DE SALVAMENTO DE ARTIGOS
router.post("/articles/save", adminAuth, (req, resp) => {
    var categorie = req.body.categorie;
    var title = req.body.title;
    var body = req.body.body;


    if (title != undefined && title != '' && body != undefined && body != '') {
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: categorie
        })
            .then(() => {
                resp.redirect("/admin/articles");
            });
    }
    else {
        resp.redirect("/admin/articles/new");
    }
});


//ROTA DE LEITURA DE ARTIGOS
router.get("/admin/articles", adminAuth, (req, resp) => {
    Article.findAll({
        include: [{ model: Categorie }]
    })
        .then(articles => {
            resp.render("admin/articles/index.ejs", {
                articles: articles
            });
        });
});

//ROTA DE DELEÇÃO DE ARTIGOS
router.post("/articles/delete", adminAuth, (req, resp) => {
    var id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where: { id: id }
            })
                .then(() => {
                    resp.redirect("/admin/articles");
                });
        }
        else {
            resp.redirect("/admin/article");
        }
    }
    else {
        resp.redirect("/admin/article");
    };
});

//ROTA DE RECUPERACAO E EXIBICAO DE ARTIGOS ANTES DE ATUALIZAR
router.get("/admin/articles/edit/:id", adminAuth, (req, resp) => {
    var id = req.params.id;

    if (isNaN(id)) {
        redirect.render("/admin/articles");
    }

    Article.findByPk(id)
        .then(article => {
            if (article != undefined) {
                Categorie.findAll()
                    .then((categories) => {
                        resp.render("admin/articles/edit.ejs", {
                            article: article,
                            categories: categories
                        });
                    });

                /*resp.render("admin/articles/edit.ejs", {
                    article: article
                });
                */
            }
            else {
                redirect.render("/admin/articles");
            }
        })
        .catch(erro => {
            redirect.render("/admin/articles");
        })
});

//ROTA DE ATUALIZAR DADOS RECUPERADOS E EXIBIDOS ANTERIORMENTE (ARTIGOS)
router.post("/articles/update", adminAuth, (req, resp) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var categorie = req.body.categorie;

    if (isNaN(id)) {
        redirect.render("/admin/articles/edit.ejs");
    }

    if (id != undefined) {
        Article.update({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: categorie
        },
            {
                where: {
                    id: id
                }
            })
            .then(() => {
                resp.redirect("/admin/articles");
            });
    }
});

//ROTA DE PAGINACAO DE ARTIGOS
router.get("/articles/page/:num", (req, resp) => {
    var page = req.params.num;
    var offset = 0;

    if (isNaN(page) || page == 1) {
        offset = 0;
    }
    else {
        offset = (parseInt(page) - 1) * 4;
    }


    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    })
        .then(articles => {

            var next;
            if (offset + 4 >= articles.count) {
                next = false;
            }
            else {
                next = true;
            };


            var result = {
                page: parseInt(page),
                next: next,
                articles: articles
            }

            Categorie.findAll()
                .then(categories => {
                    resp.render("admin/articles/page", { result: result, categories: categories })
                });
        });
});




module.exports = router;
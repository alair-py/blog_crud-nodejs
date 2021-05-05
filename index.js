const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const session = require('express-session');

//Importa Router
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const userController = require('./user/UserController');

//Importa Models
const Article = require('./articles/Article');
const Categorie = require('./categories/Categorie');
const User = require('./user/User');


//view engine
app.set('view engine', 'ejs');


//static
app.use(express.static('public'));


//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//sessions
app.use(session({
    secret: "qualquerpalavrasecreta",
    cookie: { maxAge: 300000 }
}));


//conexão com banco
connection
    .authenticate()
    .then(() => {
        console.log("Conexão OK!");
    })
    .catch((error) => {
        console.log(error);
    });


//Usa rota da variável importada
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", userController);




//rota inicial
app.get('/', (req, resp) => {
    Article.findAll({
        include: [{ model: Categorie }],
        order: [['id', 'DESC']],
        limit: 4
    })
        .then(articles => {
            Categorie.findAll()
                .then((categories) => {
                    resp.render("index.ejs", { articles: articles, categories: categories });
                });
        });
});


//rota para gerar links de artigos para lê-los (busca por slug)
app.get("/:slug", (req, resp) => {
    var slug = req.params.slug;

    Article.findOne({
        where: { slug: slug }
    })
        .then(article => {
            if (article != undefined) {
                Categorie.findAll()
                    .then((categories) => {
                        resp.render("article", { article: article, categories: categories });
                    });
            }
            else {
                resp.redirect("/");
            }
        })
        .catch(erro => {
            resp.redirect("/");
        });
});


app.get("/categorie/:slug", (req, resp) => {
    var slug = req.params.slug;

    Categorie.findOne({
        where: { slug: slug },
        include: [{ model: Article }] //Inclui para relacionamento
    })
        .then(category => { //variavel armazena os resultados que atendem a condição de busca (usada para o "articles: category.articles")
            if (category != undefined) { //verifica se resultados retornados são válidos
                Categorie.findAll() //realiza nova busca em TODOS resultados
                    .then(categories => {   //variavel armazena os resultados filtrados (usada para o "categories: categories")
                        resp.render("index", { articles: category.articles, categories: categories });
                    });
            }
            else {
                resp.redirect("/");
            }
        })
        .catch(erro => {
            resp.redirect("/");
        })
});






app.listen(3000, () => {
    console.log("App rodando!");
});
const Sequelize = require('sequelize');
const connection = require('../database/database');
const Categorie = require('../categories/Categorie');



const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});



Categorie.hasMany(Article); //relacionamento 1 - N
Article.belongsTo(Categorie); //relacionamento 1 - 1



//Article.sync({ force: true });



module.exports = Article;
const Sequelize = require('sequelize');
const connection = new Sequelize(
    'blog_crud', 'napalm123', 'napalm1991', {
    host: 'mysql743.umbler.com',
    dialect: 'mysql',
    timezone: '-03:00'
}
);

module.exports = connection;



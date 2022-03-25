const app = require('express')();

app.get('/', (req, res) => res.send('server has been started'));

module.exports = () => {app.listen(1221);}
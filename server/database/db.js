const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password:"Ab815171o",
    //password: "LEgend1_dipro",
    host: "localhost",
    port: 5432,
    database: "shohojog"
});

module.exports = pool;
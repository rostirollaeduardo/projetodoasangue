// Configurando o servidor

const express = require('express');
const server = express();

// Configurar o servidor para apresentar arquivos estáticos

server.use(express.static('public'));

// Habilitar o body do formulário

server.use(express.urlencoded({ extended: true }))

// Configurar a conexão com o banco de dados

const Pool = require('pg').Pool;
const db = new Pool({
  user: 'postgres',
  password: '123456',
  host: 'localhost',
  port: 5433,
  database: 'donation',

});


// Configurando a template engine

const nunjucks = require("nunjucks");

nunjucks.configure("./", {
  express: server,
  noCache: true
});



// configurar a apresentação da página
server.get("/", function(req, res) {
  
  db.query("SELECT * FROM donors", function(err, result) {
    if (err) return res.send("Erro de Database.")

    const donors = result.rows;

    return res.render("index.html", { donors })
  })
  
});

server.post("/", function(req, res) {
  // pega os dados do formulário
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios!")
  }

  

  // Inserindo os valores dentro do banco de dados;

  const query = `
    INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`;

  const values =  [name, email, blood];

  db.query(query, values, function(err) {
    if (err) return res.send("Erro no banco de dados.")

    return res.redirect('/');

  })  

});


// servidor acessando a porta 3000
server.listen(3000, function() {
  console.log("iniciando o servidor")
});


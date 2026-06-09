const express = require('express');
const mysql   = require('mysql');
const { exec } = require('child_process');
const app = express();

// ==========================================
// VULNERABILIDAD 1: Credencial expuesta
// CodeQL detecta: Hardcoded credentials
// ==========================================
const DB_PASSWORD = "admin1234_secreto";

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: DB_PASSWORD,
  database: 'tienda'
});

// ==========================================
// VULNERABILIDAD 2: Inyección SQL
// CodeQL detecta: SQL Injection
// ==========================================
app.get('/usuario', (req, res) => {
  const nombre = req.query.nombre;
  const query = "SELECT * FROM usuarios WHERE nombre = '" + nombre + "'";
  connection.query(query, (err, results) => {
    res.send(results);
  });
});

// ==========================================
// VULNERABILIDAD 3: XSS
// CodeQL detecta: XSS reflected
// ==========================================
app.get('/buscar', (req, res) => {
  const termino = req.query.q;
  res.send('<h1>Resultados para: ' + termino + '</h1>');
});

// ==========================================
// VULNERABILIDAD 4: Inyección de Comandos
// CodeQL detecta: Command Injection
// ==========================================
app.get('/ping', (req, res) => {
  const host = req.query.host;
  exec('ping ' + host, (error, stdout) => {
    res.send(stdout);
  });
});

app.listen(3000);
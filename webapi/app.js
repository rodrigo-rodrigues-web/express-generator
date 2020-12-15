global.db = require('./db');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require('cors')());
//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
router.get('/clientes', async (req, res) => {
    try {
        const results = await global.db.selectClientes();
        res.json(results);
    } catch (error) {
        res.status(500).json({error:error});
    }
});
router.get('/clientes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const cliente = await global.db.selectCliente(id);
        res.json(cliente);
    } catch (error) {
        res.status(500).json(error);
    }
});
// POST /clientes
router.post('/clientes', async(req, res) => {
    const nome = req.body.nome;
    const idade = !req.body.idade ? null: parseInt(req.body.idade);
    const uf = req.body.uf;

    try {
        await global.db.insertCliente({nome, idade, uf});
        res.json({nome, idade, uf});                
    } catch (error) {
        res.status(500).json(error);
    }
});
// PATCH /clientes/{id}
router.patch('/clientes/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    const cliente = {};
    if(req.body.hasOwnProperty("nome")) cliente.nome = req.body.nome;
    if(req.body.hasOwnProperty("idade")) cliente.idade = parseInt(req.body.idade);
    if(req.body.hasOwnProperty("uf")) cliente.uf = req.body.uf ;

    try {
        await global.db.updateCliente(id, cliente);
        res.json({message: 'Cliente atualizado com sucesso!'});
    } catch (error) {
        res.status(500).json(error);
    }

});
//DELETE /clientes/id
router.delete('/clientes/:id', async(req, res) => {
    const id = parseInt(req.params.id);
    try {
        await global.db.deleteCliente(id);
        res.json({message: "Cliente excluido com sucesso!"});
    } catch (error) {
        res.status(500).json(error);
    }
});

app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');
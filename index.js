const express = require("express");
const app = express();
app.use(express.json()); 


var cors = require('cors');
app.use(cors());


app.listen(process.env.PORT || 3000);



const ronaldinho = '{ "name":"Ronaldinho Gaucho", "type":"meio-atacante"}';
const lucio = '{ "name":"Lúcio", "type":"Zagueiro" }';
const tafarel = '{ "name":"Tafarel", "type":"Goleiro"}';
const neymar = '{ "name":"Neymar Jr", "type":"Ponta Esquerda"}';
const kaka = '{ "name":"Kaka", "type":"Meio campo"}';
const daniel  = '{ "name":"Daniel Alves ", "type":"Lateral Direito"}';
const roberto = '{ "name":"roberto carlos", "type":"Lateral Esquerdo"}';
const ronaldo = '{ "name":"Ronaldo Fenomeno", "type":"Centro-Avante"}';
const william  = '{ "name":"William", "type":"Ponta Direita"}';
const paulinho  = '{ "name":"Paulinho", "type":"segundo volante"}';
const dunga  = '{ "name":"Dunga", "type":"primeiro volante"}';



const time = [ JSON.parse(ronaldinho), 
                  JSON.parse(lucio),
                  JSON.parse(tafarel),
                  JSON.parse(neymar),
                  JSON.parse(kaka),
                  JSON.parse(daniel),
                  JSON.parse(roberto),
                  JSON.parse(ronaldo),
                  JSON.parse(william),
                  JSON.parse(paulinho),
                  JSON.parse(dunga)
];


app.get('/',
    function(req, res){
        res.send("Olá esse é o dream team da seleção brasileira, não precisa nem treinar"); 
    }
);


app.get('/time',
    function(req, res){
        res.send(time.filter(Boolean)); 
                                             
    }
);


app.get('/time/:id',
    function(req, res){
        const id = req.params.id - 1;
        const times = time[id];

        if (!times){
            res.send("Jogador não encontrado");
        } else {
            res.send(times);
        }
    }
)

app.post('/time', 
    (req, res) => {
        console.log(req.body.times); 
        const times = req.body.times;
        time.push(times); 
                                 
        res.send("Craque adicionado")
    }
);

app.put('/time/:id',
    (req, res) => {
        const id = req.params.id - 1;
        const times = req.body.times;
        time[id] = times;        
        res.send("Craque atualizado com sucesso.")
    }
)

app.delete('/time/:id', 
    (req, res) => {
        const id = req.params.id - 1;
        delete time[id];

        res.send("Craque lesionado");
    }
);

const express = require("express");
const app = express();
app.use(express.json()); 


var cors = require('cors');
app.use(cors());


app.listen(process.env.PORT || 3000);



const lespaul = '{ "name":"Les Paul", "type":"Gibson"}';
const flyingv = '{ "name":"Flying V", "type":"Gibson" }';
const xplorer = '{ "name":"Explorer", "type":"Gibson"}';
const firebird = '{ "name":"Firebird", "type":"Gibson"}';
const sg = '{ "name":"SG", "type":"Gibson"}';
const stratocaster  = '{ "name":"Stratocaster ", "type":"Fender"}';
const telecaster = '{ "name":"Telecaster", "type":"Fender"}';
const jaguar = '{ "name":"Jaguar", "type":"Fender"}';
const jazzmaster  = '{ "name":"Jazzmaster", "type":"Fender"}';
const gio  = '{ "name":"Gio", "type":"Ibanez"}';
const t635  = '{ "name":"T-635", "type":"Tagima"}';



const heaven = [ JSON.parse(lespaul), 
                  JSON.parse(flyingv),
                  JSON.parse(xplorer),
                  JSON.parse(firebird),
                  JSON.parse(sg),
                  JSON.parse(stratocaster),
                  JSON.parse(telecaster),
                  JSON.parse(jaguar),
                  JSON.parse(jazzmaster),
                  JSON.parse(gio),
                  JSON.parse(t635)
];


app.get('/',
    function(req, res){
        res.send("Você entrou no céu das guitarras, só escolher uma e tocar"); 
    }
);


app.get('/heaven',
    function(req, res){
        res.send(heaven.filter(Boolean)); 
                                             
    }
);


app.get('/heaven/:id',
    function(req, res){
        const id = req.params.id - 1;
        const heavens = heaven[id];

        if (!heavens){
            res.send("Guitarra não encontrada");
        } else {
            res.send(heavens);
        }
    }
)

app.post('/heaven', 
    (req, res) => {
        console.log(req.body.heavens); 
        const heavens = req.body.heavens;
        heaven.push(heavens); 
                                 
        res.send("Guitarra adicionada.")
    }
);

app.put('/heaven/:id',
    (req, res) => {
        const id = req.params.id - 1;
        const heavens = req.body.heavens;
        heaven[id] = heavens;        
        res.send("Guitarra atualizada.")
    }
)

app.delete('/heaven/:id', 
    (req, res) => {
        const id = req.params.id - 1;
        delete heaven[id];

        res.send("Aí não! Guitarra quebrada.");
    }
);

/*
  Daqui para baixo, uso o banco de dados MongoDB
*/

const mongodb = require('mongodb')


const connectionString = "mongodb+srv://admin:uZGahLHXYfBRZD3@cluster0.yjvlh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
};

(async()=>{
    const client = await mongodb.MongoClient.connect(connectionString, options);
    const db = client.db('myFirstDatabase');
    const heaven = db.collection('heaven');
    console.log(await heaven.find({}).toArray());

    app.get('/database',
        async function(req, res){
        // res.send(heavens);
        res.send(await heaven.find({}).toArray());
    }
);

app.get('/database/:id',
    async function(req, res){
        const id = req.params.id;
        const heavens = await heaven.findOne(
            {_id : mongodb.ObjectID(id)}
        );
        console.log(heavens);
        if (!heavens){
            res.send("Guitarra não encontrada");
        } else {
            res.send(heavens);
        }
    }
);

app.post('/database', 
    async (req, res) => {
        console.log(req.body);
        const heavens = req.body;
        
        delete heavens["_id"];

        heaven.insertOne(heavens);        
        res.send("criar uma guitarra.");
    }
);

app.put('/database/:id',
    async (req, res) => {
        const id = req.params.id;
        const heavens = req.body;

        console.log(heavens);

        delete heavens["_id"];

        const num_heaven = await heaven.countDocuments({_id : mongodb.ObjectID(id)});

        if (num_heaven !== 1) {
            res.send('Ocorreu um erro por conta do número de guitarras');
            return;
        }

        await heaven.updateOne(
            {_id : mongodb.ObjectID(id)},
            {$set : heavens}
        );
        
        res.send("Guitarra atualizada com sucesso.")
    }
)

app.delete('/database/:id', 
    async (req, res) => {
        const id = req.params.id;
        
        await heaven.deleteOne({_id : mongodb.ObjectID(id)});

        res.send("Guitarra removida com sucesso");
    }
);
})();

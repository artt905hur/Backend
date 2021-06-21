const express = require("express");
const app = express();
app.use(express.json());

// Permissões
var cors = require('cors');
app.use(cors());

// Porta que eu estou ouvindo
app.listen(process.env.PORT || 3000);

app.get('/', 
    function (req, res){    
        res.send("Hello World");
    }
);

app.get('/hello',
function (req, res){    
    res.send("Hello de Novo");
    }
)

const heavens = [
    "Elziele da Rocha", "Lucas Canova dos Santos", 0 
];

app.get('/heavens',
    function(req, res){
        // res.send(heavens);
        res.send(heavens.filter(Boolean));
    }
);

app.get('/heavens/:id',
    function(req, res){
        const id = req.params.id - 1;
        const heaven = heavens[id];

        if (!heaven){
            res.send("Guitarra não encontrada");
        } else {
            res.send(heaven);
        }
    }
)

app.post('/heavens', 
    (req, res) => {
        console.log(req.body.heaven);
        const heaven = req.body.heaven;
        heavens.push(heaven);
        res.send("criar uma guitarra.")
    }
);

app.put('/heavens/:id',
    (req, res) => {
        const id = req.params.id - 1;
        const heaven = req.body.heaven;
        heavens[id] = heaven;        
        res.send("guitarra atualizada com sucesso.")
    }
)

app.delete('/heavens/:id', 
    (req, res) => {
        const id = req.params.id - 1;
        delete heavens[id];

        res.send("Guitarra removida com sucesso");
    }
);

/*
  Daqui para baixo, uso o banco de dados MongoDB
*/

const mongodb = require('mongodb')


const connectionString = `mongodb+srv://admin:uZGahLHXYfBRZD3@cluster0.fhdc2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
};

(async()=>{
    const client = await mongodb.MongoClient.connect(connectionString, options);
    const db = client.db('myFirstDatabase');
    const heavens = db.collection('heavens');
    console.log(await heavens.find({}).toArray());

    app.get('/database',
        async function(req, res){
        // res.send(heaven);
        res.send(await heavens.find({}).toArray());
    }
);

app.get('/database/:id',
    async function(req, res){
        const id = req.params.id;
        const heaven = await heavens.findOne(
            {_id : mongodb.ObjectID(id)}
        );
        console.log(heaven);
        if (!heaven){
            res.send("Guitarra não encontrada");
        } else {
            res.send(heaven);
        }
    }
);

app.post('/database', 
    async (req, res) => {
        console.log(req.body);
        const heaven = req.body;
        
        delete heaven["_id"];

        heavens.insertOne(heaven);        
        res.send("criar uma guitarra.");
    }
);

app.put('/database/:id',
    async (req, res) => {
        const id = req.params.id;
        const heaven = req.body;

        console.log(heaven);

        delete heaven["_id"];

        const num_heavens = await heavens.countDocuments({_id : mongodb.ObjectID(id)});

        if (num_heavens !== 1) {
            res.send('Ocorreu um erro por conta do número de guitarras');
            return;
        }

        await heavens.updateOne(
            {_id : mongodb.ObjectID(id)},
            {$set : heaven}
        );
        
        res.send("Guitarra atualizada com sucesso.")
    }
)

app.delete('/database/:id', 
    async (req, res) => {
        const id = req.params.id;
        
        await heavens.deleteOne({_id : mongodb.ObjectID(id)});

        res.send("Guitarra removida com sucesso");
    }
);
})();

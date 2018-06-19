var require("http");
var MongoClient = require('mongodb').MongoClient;

var MONGODB_HOST = 'mongodb+srv://equipo01:d4t41ns1tu*@monitoreo-cl5aq.mongodb.net/energia?retryWrites=true'
var MONGODB_PORT = 27017
var DBS_NAME = 'energia'
var COLLECTION_NAME = 'medidas'
var FIELDS = {'estampa tiempo':True,
            'frecuencia':True,
            'voltaje L1':True,
            'voltaje L2':True,
            'voltaje L3':True,
            'voltaje L1-L2': True,
            'voltaje L2-L3': True,
            'voltaje L3-L1': True,
            'corriente L1':True,
            'coriente L2':True,
            'corriente L3':True,
            'corriente total': True,
            'potencia Activa Total':True,
            'potencia reactiva total':True,
            'potencia aparente total': True,
            'factor potencia total':True,
            'energia activa':True,
            'energia inductiva':True,
            'energia capacitiva':True,
            'energia aparente':True,
            '_id': False}

var datos_energia = MongoClient.connect(MONGODB_HOST, function(err,db){
  const collection =  client.db(DBS_NAME).collection(COLLECTION_NAME);
  console.log(collection);
});

var servidor = http.createServer(datos_energia );

servidor.listen(8080);

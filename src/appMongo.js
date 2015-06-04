var express = require('express');
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var mongoose = require('mongoose');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

mongoose.connect('mongodb://db/todoList', function(err) {
  if (err) { throw err; }
});

var ligneArticleSchema = new mongoose.Schema({
  contenu : String,
  date : { type : Date, default : Date.now }
});
var LigneArticleModel = mongoose.model('lignes', ligneArticleSchema);

/* On utilise les sessions */
app.use(session({secret: 'todotopsecret'}))

/* S'il n'y a pas de todolist dans la session,
on en crée une vide sous forme d'array avant la suite */
.use(function(req, res, next){
    next();
})

/* On affiche la todolist et le formulaire */
.get('/todo', function(req, res) {
        LigneArticleModel.find(function (err, matodolist) {
                if (err) return handleError(err);
                res.render('todo.ejs', {todolist: matodolist});
        })
})

/* On ajoute un élément à la todolist */
.post('/todo/ajouter/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        maLigne = new LigneArticleModel();
        maLigne.contenu = req.body.newtodo;
        maLigne.save(function (err) {
          if (err) { throw err; }
          console.log('Ligne ajouté avec succès !');
        });
    }
    res.redirect('/todo');
})

/* Supprime un élément de la todolist */
.get('/todo/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        LigneArticleModel.findByIdAndRemove({_id:req.params.id},function (err, callback) {
                if (err) return handleError(err);
                res.redirect('/todo');
        })
    }
})

/* On redirige vers la todolist si la page demandée n'est pas trouvée */
.use(function(req, res, next){
    res.redirect('/todo');
})

.listen(8080);


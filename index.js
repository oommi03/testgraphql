const express = require('express')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('user.db');
const { buildSchema } = require('graphql')
const graphqlMiddleware = require('express-graphql')
const app = express()
const cors = require('cors')
var data = {}
const schema = buildSchema(`
    type Query {
        user(id: Int,gender:String,first_name:String,last_name:String,email:String,age:String):[Customer]
    }

    type Customer {
        id: Int
        first_name: String
        last_name: String
        email: String
        gender: String
        age: Int
    }
`)
const resolver = {
    user(args){

        var array = []
        if(args.id){
            for (var i in data){
                if(data[i].id == args.id){
                    array.push(data[i])
                }
            }
    
            return array
      
        }else if (args.gender){
            for (var i in data){
                if(data[i].gender == args.gender){
                    array.push(data[i])
                }
            }
    
            return array
        }else if (args.first_name){
            for (var i in data){
                if(data[i].first_name == args.first_name){
                    array.push(data[i])
                }
            }
    
            return array
        }else if (args.last_name){
            for (var i in data){
                if(data[i].last_name == args.last_name){
                    array.push(data[i])
                }
            }
    
            return array
        }else if(args.age){
            let checkstring = args.age.includes('-')
            if(checkstring==true){
                var checkmidnumber = 0
                var checklastnumber = 0
                for(var i in args.age){
                    if(args.age[i]=='-'){
                        checkmidnumber = i
                    }
                   checklastnumber = i
              
                }
                
                var rightnumber = Number(args.age.slice(0,Number(checkmidnumber)))
               var leftnumber = Number(args.age.slice(Number(checkmidnumber)+1,Number(checklastnumber)+1))
                for(var j in data) {
                    if(data[j].age >= rightnumber && data[j].age <= leftnumber){
                       
                        array.push(data[j])
                    }
                }
                return array
            }else {
                for (var i in data){
                    if(data[i].age == Number(args.age)){
                        array.push(data[i])
                    }
                }
        
                return array
            }

           
            
        }else if (args.email){
            for (var i in data){
                if(data[i].email == args.email){
                    array.push(data[i])
                }
            }
    
            return array
        }
    },


}

db.serialize(function() {
    db.all("SELECT * FROM users", function(err,row) {
        data = row
    });

});
db.close()
app.use(  (req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
app.use(graphqlMiddleware({
    schema,
    rootValue:resolver
}))

app.listen(4333)
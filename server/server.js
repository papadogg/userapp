const express    = require('express'),
	    bodyParser = require('body-parser'),
	    path       = require('path'),
	    Sequelize  = require('sequelize'),   
			_          = require('lodash'),
			jwt    = require('jsonwebtoken');

const sequelize = new Sequelize('sqlite://' + path.join(__dirname, 'db.sqlite'), {
  dialect: 'sqlite',
  storage: path.join(__dirname, 'db.sqlite')
});

const User = sequelize.define('users', { 
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
  },
  password: {
    type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
  },
  email: {
    type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		}
  },
	role: {
		type: Sequelize.STRING,
		defaultValue: 'user'
	}
});

sequelize.sync({force: true}) 	
  .then(() => {	
		User.count().then(res=> {
			if(res > 0) {
				return;
			}
			User.create({
				name: "Mark Benson",
				password: "123456",
				email: "markbenson@gmail.com"
			});
			User.create({
				name: "admin",
				password: "admin",
				email: "admin@gmail.com",
				role: "admin"
			});
			for(let i = 1; i < 100; i++) {
			  User.create({
				name: "User" + i,
				password: "123456",
				email: `user${i}@gmail.com`
			});
			}
			
	});  
}).catch(e => {
  console.log("ERROR SYNCING WITH DB", e);
});

const app = express();
const PORT = process.env.PORT || 8081;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/api/users/", authenticate, (req, res) => {
	
	if(JSON.parse(req.decoded.data).role === 'admin') {
		User.findAll().then(users => {
			
			res.json(users);
		}).catch(e => {
			res.status(400).json(e);
		});
	} else {
		res.status(403).json("Access denied");
	}
});

app.get("/api/users/:id", (req, res) => {
User.findById(req.params.id).then(user=> {
		res.json(user);
	}).catch(e => {
		res.status(400).json(e);
	});
});

app.post("/api/users/", (req, res) => {
	const user = _.pick(req.body, ['name', 'password', 'email']);	
	User.create(user)		
	.then(user => {
		res.json(user);
	}).catch(e => {
		res.status(400).json(e);
	});
});

app.put("/api/users/:id", (req, res ) => {
	const updatedUser = _.pick(req.body, ['name', 'password', 'email']);	
	User.findById(req.params.id).then(user=> {
		if (user.role === "admin") {
			return res.status(403).end();
		} else {
			user.update(updatedUser).then(user=> {
				res.json(user);
			});
		}
	}).catch(e => {
		res.status(400).json(e);
	});
});
app.delete("/api/users/:id", (req, res ) => {
	User.findById(req.params.id).then(user=> {
		if (user.role === "admin") {
			return res.status(403).end();
		} else {
			user.destroy().then(user=> {
				res.json(user);
			});
		}
	}).catch(e => {
		res.status(400).json(e);
	});
});

app.get('/api/user', authenticate, (req, res) => {
		const user = _.pick(JSON.parse(req.decoded.data), ['name', 'email', 'role']);
		res.json(user);
});

app.post("/api/login", (req, res)=>{
	
	const body = _.pick(req.body, ['password', 'email']);
	if(typeof body.email !== 'string' || typeof body.password !== 'string') {
		return res.status(400).send();
	}
	User.findOne({
		where: {
			email: body.email.toLowerCase()
		}
	}).then(user=>{
		if(!user || user.password !== body.password) {
			return res.status(401).send();		}
		const token = jwt.sign({data: JSON.stringify(user)}, 'secret', {
          expiresIn: '24h' 
        });
        res.json({
          token: token,
          user
        });
	}).catch(e=>{
		console.log(e);
		res.status(500).send();
	});
});

app.post("/api/signup", (req, res)=>{
	const user = _.pick(req.body, ['name', 'password', 'email']);
	user.email = user.email.toLowerCase();
	User.create(user)		
	.then(user => {
			const token = jwt.sign({data: JSON.stringify(user)}, 'secret', {
          expiresIn: '24h' 
        });
        res.json({
          token: token,
          user
        });
	}).catch(e => {
		res.status(400).json(e);
	});
});

function authenticate (req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'secret', (err, decoded) => {      
      if (err) {
        return res.status(401);    
      } else {
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    return res.status(403).send({ 
      success: false, 
      message: 'No token provided.' 
    });
  }
}

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, ()=> console.log("server is running on" + PORT));


  
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const session = require("express-session");
const Kelas = require('./api/admin/kelas/router');
const Spp = require('./api/admin/spp/router');
const Petugas = require('./api/admin/petugas/router');
const Siswa = require('./api/admin/siswa/router');
const Pembayaran = require('./api/admin/pembayaran/router');
const Login = require('./api/login/router');
const Admin = require('./api/admin/router');
const mainPetugas = require('./api/petugas/router')
const mainSiswa = require('./api/siswa/router')
class Server{
    constructor(){
        this.port = process.env.APP_PORT;
        this.host = process.env.DB_HOST;
        this.app = express();
    }

    appConfig(){
        this.app.use(express.static(__dirname + "/views"));
        this.app.set("view engine", "ejs");
        this.app.use(express.json())
        this.app.use(bodyParser.urlencoded({extended:false}))
        this.app.use(bodyParser.json())
        this.app.use(
            session({
              secret: "secret",
              resave: true,
              saveUninitialized: true
            })
          );
    }
    adminRoutes(){
        new Admin(this.app).adminConfig();
        new Kelas(this.app).kelasConfig();
        new Spp(this.app).sppConfig();
        new Petugas(this.app).petugasConfig();
        new Siswa(this.app).siswaConfig();
        new Pembayaran(this.app).pembayaranConfig();
    }
    petugasRoutes(){
        new mainPetugas(this.app).petugasConfig();
    }
    siswaRoutes(){
        new mainSiswa(this.app).siswaConfig();
    }
    loginRoutes(){
        new Login(this.app).loginConfig();
    }
    appExecute(){

        this.appConfig();
        this.adminRoutes();
        this.petugasRoutes();
        this.siswaRoutes();
        this.loginRoutes();

        this.app.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });
    }
}
const app = new Server();
app.appExecute();

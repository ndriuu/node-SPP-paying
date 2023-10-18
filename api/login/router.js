'use strict';

const helper = require('./helper');
const bcrypt = require('bcryptjs');
const alert = require('alert')
const { check, validationResult } = require('express-validator')


class Login{

    constructor(app) {
        this.app = app;
    }

    appRouter(){
        const data_error = {}
        this.app.get("/login", (request, response) => {
            data_error.status=0;
            data_error.message=undefined;
            response.render("page/login/login",{error : data_error})
        });
        this.app.get("/login/siswa", (request, response) => {
            data_error.status=0;
            data_error.message=undefined;
            response.render("page/login/loginSiswa",{error : data_error})        
        });



        // this.app.get("/table", (request, response) => response.render("page/admin/datatables"));

        this.app.post('/auth/petugas', async(request, response)=>{ 
            const loginResponse = {};
            const body = request.body
            const data = {
            username : body.username,
            password : body.password
            }
            if(data.username === '' || data.password === ''){
                loginResponse.error = true;
                loginResponse.message = `Form cant be empty`
                response.status(412).json(loginResponse);
            }else{
                await helper.loginPetugas(data,(result)=>{
                    if(result[0] === undefined ){
                        loginResponse.error = true;
                        loginResponse.message = `Username or password invalid`;
                        alert("Username or password invalid");
                        data_error.status = 1;
                        data_error.message ="Username or password invalid";
                        response.render("page/login/login",{error : data_error})
                    }else{
                        const valid = bcrypt.compareSync(data.password,result[0].password)
                        if (result === null || result === 0) {
                            loginResponse.error = true;
                            loginResponse.message = `Login unsuccessful,try after some time.`;
                            response.status(417).json(loginResponse);
                        }else if (result[0] === undefined || valid === false) {
                            loginResponse.error = true;
                            loginResponse.message = `Username or password invalid`;
                            alert("Username or password invalid");
                            data_error.status = 1;
                            data_error.message ="Username or password invalid";
                            response.render("page/login/login",{error : data_error})
                        }else{
                            if(result[0].level === 'admin'){
                                request.session.loggedin = true;
                                request.session.username = result[0].nama_petugas;
                                request.session.level = result[0].level;
                                request.session.id_petugas = result[0].id_petugas;
                                loginResponse.error = false;
                                loginResponse.user =  result[0].nama_petugas;
                                loginResponse.message = `Login successful.`;
                                response.status(200).redirect('/admin');

                            }else if(result[0].level === 'petugas'){
                                request.session.loggedin = true;
                                request.session.username = result[0].nama_petugas;
                                request.session.level = result[0].level;
                                request.session.id_petugas = result[0].id_petugas;
                                loginResponse.error = false;
                                loginResponse.user = result;
                                loginResponse.message = `Login successful.`;
                                response.status(200).redirect('/petugas');
                            }
                        }
                    }
                })
            }
        })
        this.app.post('/auth/siswa', async(request, response)=>{ 
            const loginResponse = {};
            const body = request.body
            const data = {
            username : body.username,
            password : body.password
            }
            if(data.username === '' || data.password === ''){
                loginResponse.error = true;
                loginResponse.message = `Form cant be empty`
                response.status(412).json(loginResponse);
            }else{
                await helper.loginSiswa(data,(result)=>{
                    if(result[0] === undefined ){
                        loginResponse.error = true;
                        loginResponse.message = `Username or password invalid`;
                        data_error.status = 1;
                        data_error.message ="Username or password invalid";
                        response.render("page/login/loginSiswa",{error : data_error}) 
                    }else{
                        const valid = bcrypt.compareSync(data.password,result[0].password)
                        if (result === null || result === 0) {
                            loginResponse.error = true;
                            loginResponse.message = `Login unsuccessful,try after some time.`;
                            response.status(417).json(loginResponse);
                        }else if (result[0] === undefined || valid === false) {
                            loginResponse.error = true;
                            loginResponse.message = `Username or password invalid`;
                            data_error.status = 1;
                            data_error.message ="Username or password invalid";
                            response.render("page/login/loginSiswa",{error : data_error})
                        }else{
                            request.session.loggedin = true;
                            request.session.username = result[0].nama;
                            request.session.nisn = result[0].nisn;
                            loginResponse.error = false;
                            loginResponse.user = result[0].username;
                            loginResponse.message = `Login successful.`;
                            response.status(200).redirect('/siswa');
                        }
                    }
                })
            }
        })
        this.app.get("/logout", (request, response) => {
            request.session.destroy(err => {
              if (err) throw err;
              response.redirect("/login");
            });
        });
        this.app.get("/logout/siswa", (request, response) => {
            request.session.destroy(err => {
              if (err) throw err;
              response.redirect("/login/siswa");
            });
        });
    }
    loginConfig(){
		this.appRouter();
	}

}

module.exports = Login;
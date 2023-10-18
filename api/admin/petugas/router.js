'use strict';

const helper = require('./helper');
const bcrypt = require('bcryptjs');
const alert = require('alert')
class Petugas{

    constructor(app) {
        this.app = app;
    }

    appRouter(){
        this.app.post('/admin/petugas', async (request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const registrationResponse = {};
                const body = request.body
                body.password = bcrypt.hashSync(body.password,bcrypt.genSaltSync(10));
                const data = {
                username : body.username,
                password : body.password,
                nama_petugas : body.nama_petugas,
                level : "petugas"
                }
                if(data.username === '' || data.password === ''
                    || data.nama_petugas === '' || data.level === ''){
                    registrationResponse.error = true;
                    registrationResponse.message = `Form cant be empty`
                    response.status(412).json(registrationResponse);
                }else{
                    await helper.registerPetugas(data,(result)=>{
                        if (result === null || result.affectedRows === 0) {
                            registrationResponse.error = true;
                            registrationResponse.message = `Petugas registration unsuccessful,try after some time.`;
                            response.status(417).json(registrationResponse);
                        } else {
                            registrationResponse.error = false;
                            registrationResponse.petugas = result;
                            registrationResponse.message = `Petugas registration successful.`;
                            response.status(200).redirect('/admin/petugas');
                        }
                    })
                }
            } else {
              alert("Silahkan masuk dulu!");
              response.redirect("/login");
            }
        })
        this.app.get('/admin/petugas', async(request,response)=>{
            const getResponse = {};
            if (request.session.loggedin && request.session.level === "admin") {
                await helper.getPetugas((result)=>{
                    if(result === null || result === undefined){
                        getResponse.error = true;
                        getResponse.message = `Unsuccessful to get data`;
                        response.status(417).json(getResponse);
                    }else{
                        getResponse.error = false;
                        getResponse.data = result;
                        // response.status(200).json(getResponse);
                        delete result[0]
                        const data = { data : result, petugas : request.session.username, id_petugas : request.session.id_petugas}
                        response.render("page/admin/petugas", data)
                    }
                })
              } else {
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
              }
        })
        this.app.get('/admin/petugasEdit/:id_petugas', async(request,response)=>{
            const getResponse = {};
            const data = request.params.id_petugas;
            if (request.session.loggedin && request.session.level === "admin") {
                await helper.getPetugasById(data,(result)=>{
                    if(result === null || result === undefined){
                        getResponse.error = true;
                        getResponse.message = `Unsuccessful to get data`;
                        response.status(417).json(getResponse);
                    }else{
                        getResponse.error = false;
                        getResponse.data = result;
                        // response.status(200).json(getResponse);
                        // delete result[0]
                        const data = { data : result, petugas : request.session.username, id_petugas : request.session.id_petugas}
                        response.render("page/admin/editpetugas", data)
                    }
                })
              } else {
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
              }
        })
        // this.app.get('/admin/petugasEdit/:id_petugas', (request,response)=>{
        //     const getResponse = {};
        //     const data = request.params.id_petugas;
            
        //     helper.getPetugasById(data,(result)=>{
        //         if(result === null){
        //             getResponse.error = true;
        //             getResponse.message = `Unsuccessful to get data`;
        //             response.status(417).json(getResponse);
        //         }
        //         else if(result[0] === undefined){
        //             getResponse.error = true;
        //             getResponse.message = `Data not found`;
        //             response.status(404).json(getResponse);
        //         }else{
        //             getResponse.error = false;
        //             getResponse.data = result;
        //             const data = { data : result}
        //             response.status(200).render("page/admin/petugas", data)                }
        //     })
        // })

        this.app.post('/admin/petugasUp/:id_petugas', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const updateResponse = {};
                const body = request.body;
                const id_petugas = request.params.id_petugas;
                body.password = bcrypt.hashSync(body.password,bcrypt.genSaltSync(10));
                const data = {
                    username : body.username,
                    password : body.password,
                    nama_petugas : body.nama_petugas,
                    level :"petugas"
                }
                await helper.updatePetugas(data,id_petugas,(result)=>{
                    if(result === null){
                        updateResponse.error = true;
                        updateResponse.message = `Unsuccessful to update data`
                        response.status(417).json(updateResponse);
                    }else if(result.affectedRows === 0){
                        updateResponse.error = true;
                        updateResponse.message = `Data not found`;
                        response.status(404).json(updateResponse);
                    }else if(result.changedRows === 0){
                        updateResponse.error = true;
                        updateResponse.message = `No data has been changed`;
                        response.status(404).json(updateResponse);
                    }else{
                        updateResponse.error = false;
                        updateResponse.message = `Successful to update data`;
                        response.status(200).redirect('/admin/petugas');
                    }
                })
            } else {
              alert("Silahkan masuk dulu!");
              response.redirect("/login");
            }
        })

        this.app.get('/admin/petugasD/:id_petugas', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const deleteRespone = {};
                const id_petugas = request.params.id_petugas;
                await helper.deletePetugas(id_petugas,(result)=>{
                    if(result === null){
                        deleteRespone.error = true;
                        deleteRespone.message = `Unsuccessful to delete data`;
                        response.status(417).json(deleteRespone);
                    }else if(result.affectedRows === 0){
                        deleteRespone.error = true;
                        deleteRespone.message = `Data not found`;
                        response.status(404).json(deleteRespone);
                    }else{
                        deleteRespone.error = false;
                        deleteRespone.message = `Successful to delete data`;
                        response.status(200).redirect('/admin/petugas')
                    }
                })  
            } else {
              alert("Silahkan masuk dulu!");
              response.redirect("/login");
            }
        })
    }
    petugasConfig(){
		this.appRouter();
	}

}

module.exports = Petugas;
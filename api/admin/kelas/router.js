'use strict';

const helper = require('./helper');
const alert = require('alert')


class Kelas{

    constructor(app) {
        this.app = app;
    }

    appRouter(){
        this.app.post('/admin/kelas', async (request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const registrationResponse = {};
                const body = request.body
                const data = {
                nama_kelas : body.nama_kelas,
                kompetensi_keahlian : body.kompetensi_keahlian
                }
    
                if(data.nama_kelas === '' || data.kompetensi_keahlian === ''){
                    registrationResponse.error = true;
                    registrationResponse.message = `Form cant be empty`
                    response.status(412).json(registrationResponse);
                }else{
                    await helper.registerKelas(data,(result)=>{
                        if (result === null || result.affectedRows === 0) {
                            registrationResponse.error = true;
                            registrationResponse.message = `Kelas registration unsuccessful,try after some time.`;
                            response.status(417).json(registrationResponse);
                        } else {
                            registrationResponse.error = false;
                            registrationResponse.kelas = result;
                            registrationResponse.message = `Kelas registration successful.`;
                            response.status(200).redirect('/admin/kelas');
                        }
                    })
                }
            }else{
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
            }
        })
        this.app.get('/admin/kelas', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const getResponse = {};
                await helper.getKelas((result)=>{
                    if(result === null || result === undefined){
                        getResponse.error = true;
                        getResponse.message = `Unsuccessful to get data`;
                        response.status(417).json(getResponse);
                    }else{
                        getResponse.error = false;
                        getResponse.data = result;
                        const data = { data : result, petugas : request.session.username, id_petugas : request.session.id_petugas}
                        response.render("page/admin/kelas", data)
                    }
                })
            }else{
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
            }
        })
        this.app.get('/admin/kelasEdit/:id_kelas', async (request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const getResponse = {};
                const data = request.params.id_kelas;
                
                await helper.getKelasById(data,(result)=>{
                    if(result === null){
                        getResponse.error = true;
                        getResponse.message = `Unsuccessful to get data`;
                        response.status(417).json(getResponse);
                    }
                    else if(result[0] === undefined){
                        getResponse.error = true;
                        getResponse.message = `Data not found`;
                        response.status(404).json(getResponse);
                    }else{
                        getResponse.error = false;
                        getResponse.data = result;
                        const data = { data : result, petugas : request.session.username, id_petugas : request.session.id_petugas}
                        response.render("page/admin/editkelas", data)
                    }
                })
            }else{
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
            }
        })

        this.app.post('/admin/kelasUp/:id_kelas', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const updateResponse = {};
                const body = request.body;
                const id_kelas = request.params.id_kelas;
                const data = {
                    nama_kelas : body.nama_kelas,
                    kompetensi_keahlian : body.kompetensi_keahlian
                }
                await helper.updateKelas(data,id_kelas,(result)=>{
                    if(result === null){
                        updateResponse.error = true;
                        updateResponse.message = `Unsuccessful to update data`
                        response.status(417).json(updateResponse);
                    }else if(result.affectedRows === 0){
                        updateResponse.error = true;
                        updateResponse.message = `Data not found`;
                        response.status(404).json(updateResponse);
                    }else{
                        updateResponse.error = false;
                        updateResponse.message = `Successful to update data`;
                        response.status(200).redirect('/admin/kelas');
                    }
                })
            }else{
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
            }
        })

        this.app.get('/admin/kelasD/:id_kelas', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const deleteRespone = {};
                const id_kelas = request.params.id_kelas;
                await helper.deleteKelas(id_kelas,(result)=>{
                    console.log(result);
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
                        response.status(200).redirect('/admin/kelas');
                    }
                })
            }else{
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
            }
        })
    }
    kelasConfig(){
		this.appRouter();
	}

}

module.exports = Kelas;
'use strict';

const helper = require('./helper')
const alert = require('alert')


class Spp{
    constructor(app){
        this.app = app
    }
    appRouter(){
        this.app.post('/admin/spp', async(request, response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const registrationResponse = {};
                const body = request.body
                const data = {
                    tahun : body.tahun,
                    nominal : body.nominal,
                    tabungan : body.tabungan
                }
                if(data.tahun === '' || data.nominal === ''){
                    registrationResponse.error = true;
                    registrationResponse.message = `Form cant be empty`
                    response.status(412).json(registrationResponse);
                }else{
                    await helper.registerSpp(data,(result)=>{
                        if (result === null || result.affectedRows === 0) {
                            registrationResponse.error = true;
                            registrationResponse.message = `Spp registration unsuccessful,try after some time.`;
                            response.status(417).json(registrationResponse);
                        } else {
                            registrationResponse.error = false;
                            registrationResponse.spp = result;
                            registrationResponse.message = `Spp registration successful.`;
                            response.status(200).redirect('/admin/spp');
                        }
                    })
                }
            }else{
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
            }
        })
        this.app.get('/admin/spp', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const getResponse = {};
                await helper.getSpp((result)=>{
                    if(result === null || result === undefined){
                        getResponse.error = true;
                        getResponse.message = `Unsuccessful to get data`;
                        response.status(417).json(getResponse);
                    }else{
                        getResponse.error = false;
                        getResponse.data = result;
                        const data = { data : result, petugas : request.session.username, id_petugas : request.session.id_petugas}
                        response.render("page/admin/spp", data)                
                    }
                })
            }else{
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
            }
        })

        this.app.get('/admin/sppEdit/:id_spp', async (request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
            const data = request.params.id_spp            
            await helper.getSppById(data,(result)=>{
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
                    response.render("page/admin/editspp", data)
                }
            })
            }else{
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
            }
            const getResponse = {};
            const data = request.params.id_spp;
        })

        this.app.post('/admin/sppUp/:id_spp', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const updateResponse = {};
                const body = request.body;
                const id_spp = request.params.id_spp;
                const data = {
                    tahun : body.tahun,
                    nominal : body.nominal,
                    tabungan : body.tabungan
                }
                await helper.updateSpp(data,id_spp,(result)=>{
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
                        response.status(200).redirect('/admin/spp');                }
                })
            }else{
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
            }
        })
        this.app.get('/admin/sppD/:id_spp', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const deleteRespone = {};
                const id_spp = request.params.id_spp;
                await helper.deleteSpp(id_spp,(result)=>{
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
                        response.status(200).redirect('/admin/spp');
                    }
                })
            }else{
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
            }
        })
    }
    sppConfig(){
        this.appRouter();
    }
}
module.exports = Spp;
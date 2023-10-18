'use strict';

const helper = require('./helper');
const bcrypt = require('bcryptjs');
const alert = require('alert')
class mainPetugas{

    constructor(app) {
        this.app = app;
    }

    appRouter(){
        this.app.post('/petugas/pembayaran', async (request,response)=>{
            if (request.session.loggedin && request.session.level === "petugas") {
                const registrationResponse = {};
                const body = request.body;
                const data1 = body.nisn
                const date = new Date();
                const month = new Date().getMonth()+1;
                const year = new Date().getFullYear();
                helper.getSiswaById(data1,(result1)=>{
                    
                    if(result1 === null){
                        getResponse.error = true;
                        getResponse.message = `Unsuccessful to get data`;
                        response.status(417).json(getResponse);
                    }
                    else if(result1[0] === undefined){
                        getResponse.error = true;
                        getResponse.message = `Data not found`;
                        response.status(404).json(getResponse);
                    }else{
                        const data = {
                            id_petugas : request.session.id_petugas,
                            nisn : body.nisn,
                            tgl_bayar : date,
                            bulan_dibayar : month,
                            tahun_dibayar : year,
                            id_spp : result1[0].id_spp,
                            jumlah_bayar : body.jumlah_bayar,
                            status : 1
                            }
                            // Belum sempurna
                            if(data.id_petugas === '' || data.nisn === ''){
                                registrationResponse.error = true;
                                registrationResponse.message = `Form cant be empty`
                                response.status(412).json(registrationResponse);
                            }else{
                                helper.registerPembayaran(data,(result2)=>{
                                    if (result2 === null || result2 === 0) {
                                        registrationResponse.error = true;
                                        registrationResponse.message = `Pembayaran registration unsuccessful,try after some time.`;
                                        response.status(417).json(registrationResponse);
                                    } else {
                                        const data_spp = {
                                            tahun : year,
                                            nominal : result1[0].nominal-data.jumlah_bayar
                                        }
                                        if(data_spp.nominal < 0){
                                            data_spp.tabungan = data_spp.nominal/-1
                                            data_spp.nominal = 0;
                                            

                                        }
                                        helper.updateSpp(data_spp,result1[0].id_spp,(result)=>{
                                            const updateResponse={}
                                            if(result === null){
                                                updateResponse.error = true;
                                                updateResponse.message = `Unsuccessful to update data`
                                                response.status(417).json(updateResponse);
                                            }else if(result=== 0){
                                                updateResponse.error = true;
                                                updateResponse.message = `No data has been changed`;
                                                response.status(404).json(updateResponse);
                                            }else{
                                                updateResponse.error = false;
                                                updateResponse.message = `Successful to update data`;
                                                response.status(200).redirect('/petugas');
                                            }
                                        })
                                        // registrationResponse.error = false;
                                        // registrationResponse.pembayaran = result;
                                        // registrationResponse.message = `Pembayaran registration successful.`;
                                        // response.status(200).redirect('/petugas');
                                    }
                                })
                            }
                    }
                })
            } else {
              alert("Silahkan masuk dulu!");
              response.redirect("/login");
            }
        })
        this.app.post('/petugas', async (request,response)=>{
            if (request.session.loggedin && request.session.level === "petugas") {
                const registrationResponse = {};
                const body = request.body
                body.password = bcrypt.hashSync(body.password,bcrypt.genSaltSync(10));
                const data = {
                username : body.username,
                password : body.password,
                nama_petugas : body.nama_petugas,
                level : body.level
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
        this.app.get('/petugas', async(request,response)=>{
            const getResponse = {};
            if (request.session.loggedin && request.session.level === "petugas") {
                await helper.getPembayaran((result)=>{
                    if(result === null || result === undefined){
                        getResponse.error = true;
                        getResponse.message = `Unsuccessful to get data`;
                        response.status(417).json(getResponse);
                    }else{
                        getResponse.error = false;
                        getResponse.data = result;
                        // response.status(200).json(getResponse);

                        const data = { data : result, petugas : request.session.username}
                        response.render("page/petugas/home", data)
                    }
                })
            } else {
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
            }
        })
        this.app.get('/petugas/:id_petugas', async (request,response)=>{
            if (request.session.loggedin && request.session.level === "petugas") {
                const getResponse = {};
                const data = request.params.id_petugas;
                await helper.getPetugasById(data,(result)=>{
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
                        response.status(200).json(getResponse)
                    }
                })
            } else {
              alert("Silahkan masuk dulu!");
              response.redirect("/login");
            }
        })

        this.app.post('/petugasE', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "petugas") {
                const updateResponse = {};
                const body = request.body;
                const id_petugas = body.id_petugas;
                body.password = bcrypt.hashSync(body.password,bcrypt.genSaltSync(10));
                const data = {
                    username : body.username,
                    password : body.password,
                    nama_petugas : body.nama_petugas,
                    level : body.level
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
                        response.status(200).redirect('/petugas');
                    }
                })
            } else {
              alert("Silahkan masuk dulu!");
              response.redirect("/login");
            }
        })

        this.app.get('/petugasD/:id_petugas', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "petugas") {
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

module.exports = mainPetugas
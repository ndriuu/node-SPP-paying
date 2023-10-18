'use strict';

const helper = require('./helper');
const alert = require('alert')


class Pembayaran{

    constructor(app) {
        this.app = app;
    }

    appRouter(){
        this.app.post('/admin/pembayaran', async (request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const registrationResponse = {};
                const body = request.body;
                const data1 = body.nisn
                const date = new Date();
                const month = new Date().getMonth()+1;
                const year = new Date().getFullYear();
                helper.getSiswaById(data1,(result1)=>{
                    console.log(result1);
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
                            id_petugas : body.id_petugas,
                            nisn : body.nisn,
                            tgl_bayar : date,
                            bulan_dibayar : month,
                            tahun_dibayar : year,
                            id_spp : result1[0].id_spp,
                            jumlah_bayar : body.jumlah_bayar,
                            status : 1
                            }
                            console.log(data.id_petugas);
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
                                                response.status(200).redirect('/admin/pembayaran');                                            }
                                        })
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
        // this.app.post('/admin/pembayaran', async (request,response)=>{
        //     if (request.session.loggedin && request.session.level === "admin") {
        //         const registrationResponse = {};
        //         const body = request.body;
        //         const date = new Date();
        //         const month = new Date().getMonth()+1;
        //         const year = new Date().getFullYear();
        //         const data = {
        //         id_petugas : body.id_petugas,
        //         nisn : body.nisn,
        //         tgl_bayar : date,
        //         bulan_dibayar : month,
        //         tahun_dibayar : year,
        //         id_spp : body.id_spp,
        //         jumlah_bayar : body.jumlah_bayar,
        //         status : body.status
        //         }
        //         // Belum sempurna
        //         if(data.id_petugas === '' || data.nisn === ''){
        //             registrationResponse.error = true;
        //             registrationResponse.message = `Form cant be empty`
        //             response.status(412).json(registrationResponse);
        //         }else{
        //             await helper.registerPembayaran(data,(result)=>{
        //                 if (result === null || result.affectedRows === 0) {
        //                     registrationResponse.error = true;
        //                     registrationResponse.message = `Pembayaran registration unsuccessful,try after some time.`;
        //                     response.status(417).json(registrationResponse);
        //                 } else {
        //                     registrationResponse.error = false;
        //                     registrationResponse.pembayaran = result;
        //                     registrationResponse.message = `Pembayaran registration successful.`;
        //                     response.status(200).redirect('/admin/pembayaran');
        //                 }
        //             })
        //         }       
        //     } else {
        //       alert("Silahkan masuk dulu!");
        //       response.redirect("/login");
        //     }
        // })
        this.app.get('/admin/pembayaran', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const getResponse = {};
                await helper.getPembayaran((result)=>{
                    if(result === null || result === undefined){
                        getResponse.error = true;
                        getResponse.message = `Unsuccessful to get data`;
                        response.status(417).json(getResponse);
                    }else{
                        getResponse.error = false;
                        getResponse.data = result;
                        const data = { data : result, petugas : request.session.username, id_petugas : request.session.id_petugas}
                        response.render("page/admin/pembayaran", data)
                    }
                })
            } else {
              alert("Silahkan masuk dulu!");
              response.redirect("/login");
            }
        })
        this.app.get('/admin/pembayaranEdit/:id_pembayaran', async (request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const getResponse = {};
                const data = request.params.id_pembayaran;
                await helper.getPembayaranById(data,(result)=>{
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
                        response.render("page/admin/editpembayaran", data)                }
                })
            } else {
              alert("Silahkan masuk dulu!");
              response.redirect("/login");
            }
        })
        this.app.post('/admin/pembayaranUp/:id_pembayaran', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const updateResponse = {};
                const body = request.body;
                // const date = new Date();
                const id_pembayaran = request.params.id_pembayaran;
                const data = {
                    id_petugas : body.id_petugas,
                    nisn : body.nisn,
                    tgl_bayar : body.tgl_bayar,
                    bulan_dibayar : body.bulan_dibayar,
                    tahun_dibayar : body.tahun_dibayar,
                    id_spp : body.id_spp,
                    jumlah_bayar : body.jumlah_bayar,
                    status : 1
                }
                await helper.updatePembayaran(data,id_pembayaran,(result)=>{
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
                        response.status(200).redirect('/admin/pembayaran');
                    }
                })
            } else {
              alert("Silahkan masuk dulu!");
              response.redirect("/login");
            }
        })

        this.app.get('/admin/pembayaranD/:id_pembayaran', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const deleteRespone = {};
                const id_pembayaran = request.params.id_pembayaran;
                await helper.deletePembayaran(id_pembayaran,(result)=>{
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
                        response.status(200).redirect('/admin/pembayaran');
                    }
                })
            } else {
              alert("Silahkan masuk dulu!");
              response.redirect("/login");
            }
        })
    }
    pembayaranConfig(){
		this.appRouter();
	}

}

module.exports = Pembayaran;
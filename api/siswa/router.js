'use strict';

const helper = require('./helper');
const bcrypt = require('bcryptjs');
const alert = require('alert')



class mainSiswa{

    constructor(app) {
        this.app = app;
    }

    appRouter(){
        this.app.get('/siswa', async (request,response)=>{
            if (request.session.loggedin) {
                const getResponse = {};
                const data = request.session.nisn;
                // console.log(data);
                helper.getSiswaById(data,(result)=>{
                    // console.log(result);
                    if(result === null){
                        getResponse.error = true;
                        getResponse.message = `Unsuccessful to get data`;
                        response.status(417).json(getResponse);
                    }
                    else if(result === undefined){
                        getResponse.error = true;
                        getResponse.message = `Data not found`;
                        response.status(404).json(getResponse);
                    }else{
                        helper.getPembayaran(data,(result1)=>{
                            if(result1 === null || result1 === undefined){
                                getResponse.error = true;
                                getResponse.message = `Unsuccessful to get data`;
                                // result[0].nama = "";
                                const data = { data : result }
                                // console.log(result1);
                                response.render("page/siswa/index", data)
                            }else{
                                getResponse.error = false;
                                getResponse.data = result1;
                                const data = { data : result, data1:result1 }
                                // console.log(data);
                                response.render("page/siswa/index", data)
                            }
                        })
                    }
                })
              } else {
                alert("Silahkan masuk dulu!");
                response.redirect("/login/siswa");
              }
        })

        // this.app.post('/siswa/pembayaran', async (request,response)=>{
        //     const registrationResponse = {};
        //     const body = request.body;
        //     const date = new Date();
        //     const month = new Date().getMonth()+1;
        //     const year = new Date().getFullYear();
        //     // nisn -> diambil dari session
        //     const data = {
        //     id_petugas : 0,
        //     nisn : 0,
        //     tgl_bayar : date,
        //     bulan_dibayar : month,
        //     tahun_dibayar : year,
        //     id_spp : body.id_spp,
        //     jumlah_bayar : body.jumlah_bayar,
        //     status : 0
        //     }
        //     // Belum sempurna
        //     if(data.id_petugas === '' || data.nisn === ''){
        //         registrationResponse.error = true;
        //         registrationResponse.message = `Form cant be empty`
        //         response.status(412).json(registrationResponse);
        //     }else{
        //         await helper.registerPembayaran(data,(result)=>{
        //             if (result === null || result.affectedRows === 0) {
        //                 registrationResponse.error = true;
        //                 registrationResponse.message = `Pembayaran registration unsuccessful,try after some time.`;
        //                 response.status(417).json(registrationResponse);
        //             } else {
        //                 registrationResponse.error = false;
        //                 registrationResponse.pembayaran = result;
        //                 registrationResponse.message = `Pembayaran registration successful.`;
        //                 response.status(200).json(registrationResponse);
        //             }
        //         })
        //     }
        // })

    }
    siswaConfig(){
		this.appRouter();
	}

}

module.exports = mainSiswa;
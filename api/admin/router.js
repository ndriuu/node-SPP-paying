'use strict';

const helper = require('./helper')
const alert = require('alert')
const bcrypt = require('bcryptjs');
const pdf = require('html-pdf');
const path = require('path');
let ejs = require("ejs");


class Admin{
    constructor(app){
        this.app = app
    }

    appRouter(){
 
        this.app.get('/admin', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                await helper.getAdminPembayaran((result)=>{
                    const data = { data : result, petugas : request.session.username, id_petugas : request.session.id_petugas}
                    response.render("page/admin/home", data)
                })
              } else {
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
              }
        })
        this.app.get('/admin/adminEdit/:id_petugas', async(request,response)=>{
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
                        response.render("page/admin/editadmin", data)
                    }
                })
              } else {
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
              }
        })
        this.app.post('/admin/adminUp/:id_petugas', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                const updateResponse = {};
                const body = request.body;
                const id_petugas = request.params.id_petugas;
                body.password = bcrypt.hashSync(body.password,bcrypt.genSaltSync(10));
                const data = {
                    username : body.username,
                    password : body.password,
                    nama_petugas : body.nama_petugas,
                    level :"admin"
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
                        response.status(200).redirect('/admin');
                    }
                })
            } else {
              alert("Silahkan masuk dulu!");
              response.redirect("/login");
            }
        })
        this.app.get('/admin/report', async(request,response)=>{
            if (request.session.loggedin && request.session.level === "admin") {
                await helper.getAdminPembayaran((result)=>{
                    const data = { data : result, petugas : request.session.username, id_petugas : request.session.id_petugas}
                    // response.render("page/admin/home", data)
                    ejs.renderFile(path.join(__dirname, '../../views/page/admin/', "report1.ejs"), data, (err, data1) => {
                        if (err) {
                              response.send(err);
                        } else {
                            let options = {
                                "height": "11.25in",
                                "width": "8.5in",
                                "header": {
                                    "height": "20mm"
                                },
                                "footer": {
                                    "height": "20mm",
                                },
                            };
                            pdf.create(data1,options).toFile("report.pdf", function (err, data) {
                                if (err) {
                                    response.send(err);
                                } else {
                                    response.status(200).redirect('/admin');
                                }
                            });
                        }
                    });
                })
              } else {
                alert("Silahkan masuk dulu!");
                response.redirect("/login");
              }
            
        })
        this.app.get('/table', async(request,response)=>{
            await helper.getAdminPembayaran((result)=>{
                const data = { data : result, petugas : request.session.username, id_petugas : request.session.id_petugas}
                response.render("page/admin/report1", data)
            })        
        })
    }
    
    adminConfig(){
        this.appRouter();
    }
}
module.exports = Admin;
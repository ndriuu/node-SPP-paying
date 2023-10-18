'user strict';

const db = require('../../config/db');

class Helper{

    constructor(){
        this.db = db
    }
    getAdminPembayaran(callBack){
        try{
            this.db.query(`SELECT * FROM pembayaran
            INNER JOIN siswa ON pembayaran.nisn=siswa.nisn
            INNER JOIN petugas ON pembayaran.id_petugas=petugas.id_petugas`
            , (error,res)=>{
                return callBack(res);
            })
        }catch (error) {
            console.error(error);
            return callBack(null);
        }
    }
    getPetugasById(data,callBack){
        try{
            this.db.query(`SELECT * FROM petugas WHERE id_petugas = ?`,[data],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
    updatePetugas(data,id_petugas,callBack){
        try{
            this.db.query(`UPDATE petugas SET ? WHERE id_petugas =?`,[data,id_petugas],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }

}

module.exports = new Helper();
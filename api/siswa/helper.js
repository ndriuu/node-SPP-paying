'user strict';

const db = require('../../config/db');

class Helper{

    constructor(){
        this.db = db
    }
    getSiswaById(data,callBack){
        try{
            this.db.query(`SELECT * FROM siswa 
            left JOIN spp ON siswa.id_spp = spp.id_spp
            left JOIN kelas ON siswa.id_kelas = kelas.id_kelas
            WHERE nisn = ?`,[data],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
    getPembayaran(data,callBack){
        try{
            // console.log(data);
            this.db.query(`SELECT * FROM pembayaran 
            left JOIN petugas ON pembayaran.id_petugas = petugas.id_petugas
            left JOIN siswa ON pembayaran.nisn = siswa.nisn
            WHERE pembayaran.nisn = ?`,[data],(error,res)=>{
                return callBack(res);
            })
        }catch (error) {
            console.error(error);
            return callBack(null);
        }
    }
}

module.exports = new Helper();
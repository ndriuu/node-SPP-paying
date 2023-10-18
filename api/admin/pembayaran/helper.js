'user strict';

const db = require('../../../config/db');

class Helper{

    constructor(){
        this.db = db
    }

    registerPembayaran(data, callBack){
		try {
			this.db.query(`INSERT INTO pembayaran set ?`,[data],(error,res)=>{
                return callBack(res);
            });
		} catch (error) {
			console.error(error);
			return null;
		}
    }
    updateSpp(data,id_spp,callBack){
        try{
            this.db.query(`UPDATE spp SET ? WHERE id_spp =?`,[data,id_spp],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
    getSiswaById(data,callBack){
        try{
            this.db.query(`SELECT * FROM siswa 
            left JOIN spp ON siswa.id_spp = spp.id_spp
            WHERE nisn = ?`,[data],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
    
    getPembayaran(callBack){
        try{
            this.db.query(`SELECT * FROM pembayaran
            left JOIN siswa ON pembayaran.nisn = siswa.nisn
            left JOIN petugas ON pembayaran.id_petugas = petugas.id_petugas
            `, (error,res)=>{
                return callBack(res);
            })
        }catch (error) {
            console.error(error);
            return callBack(null);
        }
    }
    getPembayaranById(data,callBack){
        try{
            this.db.query(`SELECT * FROM pembayaran WHERE id_pembayaran = ?`,[data],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
    updatePembayaran(data,id_pembayaran,callBack){
        try{
            this.db.query(`UPDATE pembayaran SET ? WHERE id_pembayaran =?`,[data,id_pembayaran],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
    deletePembayaran(id_pembayaran,callBack){
        try{
            this.db.query(`DELETE FROM pembayaran WHERE  id_pembayaran=?`,[id_pembayaran],(error,res)=>{
                return callBack(res)
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }

}

module.exports = new Helper();
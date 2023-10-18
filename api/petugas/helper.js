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
            WHERE nisn = ?`,[data],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
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
    registerPetugas(data, callBack){
		try {
			this.db.query(`INSERT INTO petugas set ?`,[data],(error,res)=>{
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
    getPetugas(callBack){
        try{
            this.db.query(`SELECT * FROM petugas`, (error,res)=>{
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
    deletePetugas(id_petugas,callBack){
        try{
            this.db.query(`DELETE FROM petugas WHERE id_petugas=?`,[id_petugas],(error,res)=>{
                return callBack(res)
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }

}

module.exports = new Helper();
'user strict';

const db = require('../../../config/db');

class Helper{

    constructor(){
        this.db = db
    }

    registerSiswa(data, callBack){
		try {
			this.db.query(`INSERT INTO siswa set ?`,[data],(error,res)=>{
                return callBack(res);
            });
		} catch (error) {
			console.error(error);
			return null;
		}
    }
    
    getSiswa(callBack){
        try{
            this.db.query(`SELECT * FROM siswa
            left JOIN kelas ON siswa.id_kelas = kelas.id_kelas
            left JOIN spp ON siswa.id_spp = spp.id_spp
            `, (error,res)=>{
                return callBack(res);
            })
        }catch (error) {
            console.error(error);
            return callBack(null);
        }
    }
    getSiswaById(data,callBack){
        try{
            this.db.query(`SELECT * FROM siswa WHERE nisn = ?`,[data],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
    updateSiswa(data,nisn,callBack){
        try{
            this.db.query(`UPDATE siswa SET ? WHERE nisn =?`,[data,nisn],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
    deleteSiswa(nisn,callBack){
        try{
            this.db.query(`DELETE FROM siswa WHERE  nisn=?`,[nisn],(error,res)=>{
                return callBack(res)
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }

}

module.exports = new Helper();
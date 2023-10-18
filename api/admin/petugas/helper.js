'user strict';

const db = require('../../../config/db');

class Helper{

    constructor(){
        this.db = db
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
    
    getPetugas(callBack){
        try{
            const data = "petugas"
            this.db.query(`SELECT * FROM petugas where level = ?`,[data] ,(error,res)=>{
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
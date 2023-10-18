'user strict';

const db = require('../../../config/db');

class Helper{

    constructor(){
        this.db = db
    }

    registerKelas(data, callBack){
		try {
			this.db.query(`INSERT INTO kelas set ?`,[data],(error,res)=>{
                return callBack(res);
            });
		} catch (error) {
			console.error(error);
			return null;
		}
    }
    
    getKelas(callBack){
        try{
            this.db.query(`SELECT * FROM kelas`, (error,res)=>{
                return callBack(res);
            })
        }catch (error) {
            console.error(error);
            return callBack(null);
        }
    }
    getKelasById(data,callBack){
        try{
            this.db.query(`SELECT * FROM kelas WHERE id_kelas = ?`,[data],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
    updateKelas(data,id_kelas,callBack){
        try{
            this.db.query(`UPDATE kelas SET ? WHERE id_kelas =?`,[data,id_kelas],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
    deleteKelas(id_kelas,callBack){
        try{
            this.db.query(`DELETE FROM kelas WHERE  id_kelas=?`,[id_kelas],(error,res)=>{
                return callBack(res)
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }

}

module.exports = new Helper();
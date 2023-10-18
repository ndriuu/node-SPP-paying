'user strict';

const db = require('../../../config/db');

class Helper{
    constructor(){
        this.db = db
    }

    registerSpp(data, callBack){
		try {
			this.db.query(`INSERT INTO spp set ?`,[data],(error,res)=>{
                return callBack(res);
            });
		} catch (error) {
			console.error(error);
			return null;
		}
    }
    getSpp(callBack){
        try{
            this.db.query(`SELECT * FROM spp`, (error,res)=>{
                return callBack(res);
            })
        }catch (error) {
            console.error(error);
            return callBack(null);
        }
    }
    getSppById(data,callBack){
        try{
            this.db.query(`SELECT * FROM spp WHERE id_spp = ?`,[data],(error,res)=>{
                return callBack(res);
            })
        }catch(error){
            console.log(error);
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
    deleteSpp(id_spp,callBack){
        try{
            this.db.query(`DELETE FROM spp WHERE  id_spp=?`,[id_spp],(error,res)=>{
                return callBack(res)
            })
        }catch(error){
            console.log(error);
            return null;
        }
    }
}
module.exports = new Helper();
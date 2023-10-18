'user strict';

const db = require('../../config/db');

class Helper{

    constructor(){
        this.db = db
    }
    loginPetugas(data,callBack){
        try {
			this.db.query(`SELECT * FROM petugas where username=?`,[data.username],(error,result)=>{
                return callBack(result);
            });
		} catch (error) {
			console.error(error);
			return null;
		}
    }
    loginSiswa(data,callBack){
        try {
			this.db.query(`SELECT * FROM siswa where username=?`,[data.username],(error,result)=>{
                return callBack(result);
            });
		} catch (error) {
			console.error(error);
			return null;
		}
    }

}

module.exports = new Helper();
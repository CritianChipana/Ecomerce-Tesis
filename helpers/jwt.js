const jwt = require("jsonwebtoken");
const comprobarJWT=(token='')=>{
    try {
        const {uid}=jwt.verify(token,process.env.SECRETKEY);
        return [true,uid];
    } catch (error) {
        return [false,null];
    }
}
module.exports={
    comprobarJWT
}
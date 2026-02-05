

import type {Request,Response,NextFunction} from "express"
import { CountLogs,GetUserData,CountMontiors } from "../utils/Home.js"
import type { RequestUser } from "../@types/CustomRequest.js"







export async function GetHome(req : Request , res : Response, next : NextFunction) {
    try{
        let reqU = req as RequestUser
        let id = reqU?.user?._id  || null
        let userData  = null;
        if (id) {
            userData = await GetUserData(id)
        }       
        let promises  = [
            CountLogs(),
            CountMontiors()
        ]
        let result = await Promise.all(promises)
        console.log(userData)
        res.status(200).json({websiteData:result,userData})
    }catch(err) {
        next(err)
    }
}




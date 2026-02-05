


import {AppError} from "./ErrorHandling.js"
import {User} from "../models/User.js"
import type {IUserDocument} from "../models/User.js"







export async function CheckIsUser( user :any ) : Promise<IUserDocument>
{
    if (!user)
    {
        throw new AppError(401,"You must log in first")
    }
    let checkUser : IUserDocument | null = await User.findById(user._id)
    if (!checkUser) throw new AppError(404,"You account not found")
    return checkUser
}
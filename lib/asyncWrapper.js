const asyncWrapper=(fun)=>{
    return async(req,res,next)=>{
        try {
            return fun(req,res,next)
        } catch (error) {
            next(error.message)
        }
    }
}
export default asyncWrapper
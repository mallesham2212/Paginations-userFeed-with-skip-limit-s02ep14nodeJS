const adminAuth =(req,res,next)=>{
    const user="xyz";
	const isCorrect=user==="xyz";
	if(isCorrect){
		next();
	}
	else{
		res.status(401).send("unAuthorised admin");
	}
}

const userAuth =(req,res,next)=>{
    const user="xyz";
	const isCorrect=user==="xyz";
	if(isCorrect){
       
		next();
	}
	else{
		res.status(401).send("unAuthorised admin");
	}
}

module.exports= {adminAuth,userAuth}
const express=require("express");
const cookieParser=require("cookie-parser");
const ExpressError=require("./utils/ExpressError.util");
const authRouter=require("./routes/auth.route");
const projectRouter=require("./routes/project.route");
const taskRouter = require("./routes/task.route");

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health",(req,res)=>{
    res.status(200).json({ status: "OK" });
})

app.use("/auth",authRouter);
app.use("/projects",projectRouter);
app.use("/projects/:projectId/tasks",taskRouter);

app.use((req,res,next)=>{
    next(new ExpressError("Page not found",404));
})

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=statusCode===500?"Internal Server Error":err.message;
    res.status(statusCode).json({error:message});
})



module.exports=app;
import express from "express"
import bodyParser from "body-parser"
import getDate from "./date.js";

const app = express();

const listItem = ["Buy Food", "Cook Food", "Eat Food"]
const workItems = [];

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))

app.get("/",(req,res)=>{

  let day = getDate();
  
  res.render("list", {listTitle: day, newListItems: listItem});
})


app.post("/", (request,response)=>{

  let item = request.body.newItem;
console.log(request.body)
  if (request.body.list === "Work"){
    workItems.push(item)
    response.redirect("/work")
  }else{
    listItem.push(item)
    response.redirect("/")
  }
  
  
})

app.get("/work",(req,res)=>{
    res.render("list", {listTitle: "Work List", newListItems: workItems});
})




app.listen(3000,()=>{
  console.log("server started listening on port 3000")
})
import express from "express";
import bodyParser from "body-parser"
import mongoose from "mongoose";
import e from "express";

const app = express();

// const listItem = ["Buy Food", "Cook Food", "Eat Food"]
// const workItems = [];

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({name: String});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({name: "Buy Food"});
const item2 = new Item({name: "Cook Food"});
const item3 = new Item({name: "Eat Food"});

const defaultItems = [item1, item2, item3];




app.get("/",(req,res)=>{

  Item.find({},(err, result)=>{
    if(result.length === 0 ){
      Item.insertMany(defaultItems,(err)=>{
        if(err){
          console.log(err);
        }else{
          console.log("Documents inserted successfully")
        }
  });
  res.redirect("/")
    }else{
      res.render("list", {listTitle: "Today", newListItems: result});
    }
  })
  
  
  
});


app.post("/", (request,response)=>{

  const itemName = request.body.newItem;

  const newItem = new Item({name:itemName});

  newItem.save()

  response.redirect("/");
  
});

app.post("/delete",(req,res)=>{
    const checkItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkItemId, (err)=>{
      if(err){
        console.log(err)
      }else{
        console.log("Item deleted Sucessfully")
      }
    })

    res.redirect("/")
});

app.get("/work",(req,res)=>{
    res.render("list", {listTitle: "Work List", newListItems: workItems});
})




app.listen(3000,()=>{
  console.log("server started listening on port 3000")
})
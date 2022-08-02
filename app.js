import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";

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

const listSchema = {
  name: String,
  items : [itemsSchema]
};

const List = mongoose.model("List", listSchema);


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

app.get("/:customListName", (req,res)=>{
     const customListName = _.capitalize(req.params.customListName)
    List.findOne({name: customListName}, (err,foundList)=>{
      if(!err){
        if(!foundList){
          //Create a new list
          const list = new List({
            name: customListName,
            items: defaultItems
           });
      
           list.save();
           res.redirect(`/${customListName}`)
        }else{
          //Show an existing list
          res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        }
      }
    })
    
});


app.post("/", (request,response)=>{

  const itemName = request.body.newItem;
  const listName = request.body.list;

  const newItem = new Item({name:itemName});

  if(listName === "Today"){
    newItem.save()

    response.redirect("/");
  }else{
    List.findOne({name: listName}, (err,foundList)=>{
      foundList.items.push(newItem);
      foundList.save();
      response.redirect(`/${listName}`)
    })
  }

  
  
});

app.post("/delete",(req,res)=>{
    const checkItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
      Item.findByIdAndRemove(checkItemId, (err)=>{
        if(err){
          console.log(err);
        }else{
          console.log("Item deleted Sucessfully")
        }
      });
  
      res.redirect("/");
    }else{
        List.findOneAndUpdate({name: listName},{ $pull: {items: {_id: checkItemId}}},(err,foundList)=>{
          if(!err){
            res.redirect(`/${listName}`)
          }
        })
    }

    
});






app.listen(3000,()=>{
  console.log("server started listening on port 3000")
})
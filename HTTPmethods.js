//http methods
//GET , POST , PUT , PATCH , DELETE , OPTIONS

//POST-> USED TO SEND DATA TO SERVER

//libraries : express , mongoose , bodyParser
const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')

//Initialize the app
const app = express();
const PORT=3001;

//middleware for parsing json data and url-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

const MONGO_URI="mongodb+srv://rikitakathuria50:kJxOgvUDprRRToyc@rikita.xb56c.mongodb.net/?retryWrites=true&w=majority&appName=rikita"

//connect to mongo db
mongoose.connect(MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=> console.log("database connected successfully"))
.catch((err)=> console.log("Error connecting to mongodb",err.message))

//Value for form
const internshipSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phone:{type:Number,required:true},
    qualification:{type:String,required:true}
})

//Creating a model
const Internship=mongoose.model('PersonalInfo',internshipSchema);

//Creating of form
//we can do this with postman too
 app.get('/',(req,res)=>{
    res.send(`
<h2>Contact Us</h2>
<form action="/apply" method="post">
  <!-- Name Input -->
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" placeholder="Enter your name" required>
  <br><br>

  <!-- Email Input -->
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" placeholder="Enter your email" required>
  <br><br>

  <!-- Phone Input -->
  <label for="phone">Phone No:</label>
  <input type="number" id="phone" name="phone" placeholder="Enter your phone number" required>
  <br><br>

  <!-- Qualification Input -->
  <label for="qualification">Qualification:</label>
  <input type="text" id="qualification" name="qualification" placeholder="Enter your qualification" required>
  <br><br>

  <button type="submit">Submit</button>
</form>`)
 })

//Post route for handling data submission

app.post('/apply',async(req,res)=>{
    //extraction of form data
    const {name,email,phone,qualification}=req.body;

    //Checking for if any entry is missing
    if(!name || !email || !phone || !qualification)
    {
        return res.status(400).send("All Fields are required");
    }
    try
    {
        //creation of internship document
        const newApplication=new Internship({name,email,phone,qualification});

        //save the document in db 
        await newApplication.save();
        res.send(`
            <h1>HI, Your Application is submitted successfully</h1>
            <p>Thankyou</p>
            `)
    }
    catch(err){
         console.error("Error in saving data",err.message)
    }
})

//start the server
app.listen(PORT,()=>{
    console.log("Server is running localhost");
})

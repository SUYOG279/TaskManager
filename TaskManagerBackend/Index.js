const express =  require('express');
const adminRelatedRoutes = require('./routes/admin');
const empsRelatedRoutes = require('./routes/emps');
const customerRelatedRoutes = require('./routes/customer');
const mysql = require('mysql');
// console.log(express);

const app = express();

// app.use((request, response, next)=>
// {
//     response.write("1111111111");
//     next();
// })


// app.use((request, response, next)=>
// {
//     response.write("222222222");
//     //response.end();
//     next();
// })

app.use((request, response, next)=>{
    response.setHeader('Access-Control-Allow-Origin',"*");
    response.setHeader('Access-Control-Allow-Headers',"*");
    response.setHeader('Access-Control-Allow-Methods', "*")
    next();
})

app.use(express.json()); //This line is acting as a
                         //middleware. It sets request.body
                         //as json data received from body
                         //which is originally stream.


app.use('/admin',adminRelatedRoutes)
app.use('/emps',empsRelatedRoutes)
app.use('/customer',customerRelatedRoutes)
app.get('/somepage.html',(request,response)=>{
   
    var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'manager',
    database : 'punedac'
    });  

    connection.query("select * from Emp", (error, result)=>{
        if(error==null)
        {
            var rows = ``;
            result.map((record)=>{
                var currentRow = `<tr>
                                <td>${record.ENo}</td> 
                                <td>${record.EName}</td> 
                                <td>${record.EAddress}</td> 
                               </tr>`;
                rows= rows + currentRow;
            });
            var pageContent = `<html>
                                <head>
                                    <title>Demo</title>
                                </head>
                                <body>
                                    <table border="1">
                                        ${rows}
                                    </table>
                                </body>
                            </html>`;

            console.log(pageContent);
            response.setHeader("Content-Type","text/html");
            response.write(pageContent);
        } 
        else
        {
            console.log(error);
            response.setHeader("Content-Type","application/json");
            response.write(error)
        }
        response.end();
    })
    
})

app.listen(9999,()=>{console.log("Server Started at 9999")})
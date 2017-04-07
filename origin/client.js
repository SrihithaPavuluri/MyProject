var searchTerm ="iphone";
var myData;
var myProductData;
var bestbuyURL;
var goToURL = [];
var myImageURL= [];
var counter=0;
var username = "";
var password ="";

var myVar = setInterval(function(){ updateTable() }, 1000);

$(document).ready(function(){

    fetch();
    $("#div2").removeClass("hidden");
    
    $("#btn1").click(function(){
    searchTerm = $("#textfield1").val();
    console.log(searchTerm);
    fetch();
    });

});

function fetch()
{
    console.log("In Fetch");
    bestbuyURL="https://api.bestbuy.com/v1/products(search="+searchTerm+")?format=json&show=sku,name,salePrice&apiKey=X6Ez6RSEUvpyHg8z6uCbWSUk";
    console.log(bestbuyURL);
         
    $.getJSON( bestbuyURL, function( data ) {
          myData = data;
          myFunction(myData);
        
        });
}

   
   
function myFunction(myData) {
console.log("In myFunction");
     var out = "";
      var i=0;
      out+="<table class='table  myClass'><tr><th>sku</th><th>Item</th><th>Price</th><th>Favourite</th></tr>";
  for(i = 0; i < myData.products.length;i++) 
    {
      mySku=myData.products[i].sku; 
      getImageandLink(mySku);
  out+="<tr id='trid"+i+"'><td>"+myData.products[i].sku + "</td><td id='tdid"+i+"'>"+myData.products[i].name+ "</td><td>" + myData.products[i].salePrice + "</td><td><button class='btn btn-default' id='favBtn"+i+"' onClick='updateButton("+i+")'>Add to cart</button></td></tr>";
     
     }
    out+="</table>";
    document.getElementById("div5").innerHTML = out;
    
}

// function myFunction(myData) {
// console.log("In myFunction");
//      var out = "";
//       var i=0;
//       out+="<div class='container'>";
//   for(i = 0; i < myData.products.length;i++) 
//     {
//       mySku=myData.products[i].sku; 
//       getImageandLink(mySku);
//   out+="<div class='col-md-6 myClass'>"+myData.products[i].sku + "<br><div id='tdid"+i+"'>"+myData.products[i].name+ "</div><br>" + myData.products[i].salePrice + "<br><button class='btn btn-default' id='favBtn"+i+"' onClick='updateButton("+i+")'>Add to cart</button></div>";
//      }
//     out+="</div>";
//     document.getElementById("div5").innerHTML = out;
    
// }
function updateButton(itemId){
    var btn = "#favBtn"+itemId;
   
    if($(btn).html() == 'Add to cart'){
     
      console.log("Im here");
        if(username !="" & password !="")
        {
                    console.log("Im inside");
                     $.ajax({
                      method: "POST",
                      url: "http://localhost:3000/addToCart",
                      data: {mySku: myData.products[itemId].sku, productName: myData.products[itemId].name , salePrice: myData.products[itemId].salePrice }
                    })
                      .done(function( msg ) {
                      document.getElementById("div3").innerHTML=msg;
    
                              });
  
                  $(btn).html("Added to cart");

        } 
        else
        {
          alert("Please Sign In");
    console.log("Please Sign In");
        }
    }
    
   }

function getImageandLink(mySku)
{
  console.log("In getImage");
  var productURL = "https://api.bestbuy.com/v1/products/"+mySku+".json?apiKey=X6Ez6RSEUvpyHg8z6uCbWSUk";

    $.getJSON( productURL, function( productData ) { 
    myProductData = productData;
    myImageURL[counter]= myProductData.image;
    goToURL[counter]=myProductData.url;
        counter = counter + 1;
    });     
}

function updateTable()
{
  console.log("In update Table");
  if(counter == myImageURL.length)
    {
      for(var j=0;j< myImageURL.length;j++)
        {
          document.getElementById("tdid"+j).innerHTML="<img width=50px height=50px src='" + myImageURL[j] + "'>"+"<a href='"+ goToURL[j]+ "' target='_blank'>"+myData.products[j].name+"</a>";
        }
    }
  counter=0;
}
  var arr = [];
  var myName;
  
function getCart()
  {
    $("#div2").addClass("hidden");
    $.getJSON( "getData", function( data ) {
      var out="<table class='table table-bordered myClass'><th>Serial no.</th><th>Sku</th><th>ProductName</th><th>Price</th><th>Delete</th>";
      for (var i=0;i<data.Data.length;i++)
        {
          out+="<tr><td>"+(i+1)+"</td><td>"+data.Data[i].pid + "</td><td>" + data.Data[i].pname + "</td><td>"+ data.Data[i].price+"</td><td>" + "<button class='btn btn-default' id='button"+i+"' onClick='deleteData("+i+")'>Delete</button> </td></tr>";
          arr[i] = data.Data[i].pid;
        }
          out+="</table>";
                  
      document.getElementById("div5").innerHTML=out;
     });
  }

function deleteData(myIndex)
  {
    var x= arr[myIndex];
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/",
      data: { deleteId: x }
    })
  .done(function( msg ) {
    document.getElementById("div3").innerHTML = msg;
    getCart();
    });
  }
     
  function createAccount()
  {
    username = $("#username").val();
    password = $("#password").val();
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/Register",
      data: { uname: username, pwd: password }
      })
      .done(function( msg ) {
        document.getElementById("div3").innerHTML=msg;
      });
  }

      
function accessAccount()
  {
    username = $("#username").val();
    password = $("#password").val();
    if(username !="" & password !="")
      {
        $.ajax({
          method: "POST",
          url: "http://localhost:3000/SignedIn",
          data: { uname: username, pwd: password }
        })
  .done(function( msg ) 
    {
      document.getElementById("div3").innerHTML=msg;
      if(msg == "Login Successful")
        {
          $("#div2").removeClass("hidden");
          $("#div4").removeClass("hidden");
          fetch();
        }
      });
    }
    else
    alert("Please Sign in");
}

  
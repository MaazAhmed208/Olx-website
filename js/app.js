
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDxEc2Nm0qd0Y6qfygYiQzsEot0F4-GEbQ",
    authDomain: "olzpakistan.firebaseapp.com",
    databaseURL: "https://olzpakistan.firebaseio.com",
    projectId: "olzpakistan",
    storageBucket: "olzpakistan.appspot.com",
    messagingSenderId: "951448485096"
  };
  firebase.initializeApp(config);




//..............Sign Up..........
function signUp (){
    var name = document.getElementById('name1').value;
    var email = document.getElementById('email1').value;
    var password = document.getElementById('password1').value;
    var Cpassword = document.getElementById('Cpassword1').value;
    var phone = document.getElementById('phone1').value;

    console.log(name,email,password,Cpassword,phone);

    if(name !== '' && email!=='' && password!=='' && Cpassword!=='' && phone!=="" && password === Cpassword){

        console.log(name,email,password,Cpassword,phone);
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((sucess)=>{
            let userUid = firebase.auth().currentUser.uid;
            let userObj={
                name :name,
                email : email,
                password : password,
                uid : userUid
              }
              firebase.database().ref('users/' + userUid + '/Data').set(userObj)
            
            
            swal({
                icon: 'success',
                title: 'Successfully signed up',
              });
              
              
        })
        .catch(function(error) {
            swal({
                icon: 'error',
                title: 'Error',
                text: `${error.message}`
              });
            
        });

    }
    else{

        swal({
            icon: 'error',
            title: 'Error',
            text: "Please enter the right information"
          });
        
    }




}



//..............Signin............
function signIn(){

    
    var email = document.getElementById('email').value;
    var password  = document.getElementById('password').value;
   
    if(email !=="" && password !==""){

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(result){
            console.log(result.user.uid);
            firebase.database().ref('users/'+result.user.uid+'/Data').once('value',(data)=>{
                var userData = data.val();
                // console.log(userData);
                 localStorage.setItem('UserAuth',JSON.stringify(userData));
            }).then(()=>{
                var locals = JSON.parse(localStorage.getItem('UserAuth'));
                if(locals.user !=="null"){
                    document.getElementById("name").innerHTML = locals.name;
                    document.getElementById("logoutbtn").style.display = "block";
                    document.getElementById("sellBtn").style.display = "block";
                    document.getElementById("loginbtn").style.display = "block";
                    document.getElementById("loginbtn").style.display = "none";
                    document.getElementById('save1').style.display = "block";
                }
            })
            
           
            swal({
                icon: 'success',
                title: 'Successfully signed up',
              })
              
        })
        .catch(function(error) {
           
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            swal({
                icon: 'error',
                title: 'Error',
                text: `${error.message}`
              });
             
            
          });
    }
    else{
        swal({
            icon: 'error',
            title: 'Error',
            text: "Please enter the right information"
          });
    }


}

var locals = JSON.parse(localStorage.getItem('UserAuth'));

console.log(locals.user)
if(locals.user !=="null"){
    document.getElementById("name").innerHTML = locals.name;
    document.getElementById("logoutbtn").style.display = "block";
    // document.getElementById('save1').style.display = "block";
    document.getElementById("sellBtn").style.display = "block";
    document.getElementById("loginbtn").style.display = "none";
    // document.getElementById("msg").style.display = "block";
}
else if(locals.name === "null"){
    document.getElementById("name").innerHTML = "";
    document.getElementById("logoutbtn").style.display = "none";
    document.getElementById('save1').style.display = "none";
    document.getElementById("sellBtn").style.display = "none";
    document.getElementById("loginbtn").style.display = "block";
    document.getElementById("msg").style.display = "none";
}
else{
    document.getElementById('save1').style.display = "none";
    document.getElementById("msg").style.display = "none";
}


var k=1;
function categories(){
    if(k===1){
        document.getElementById("categoriesList").style.display = "block";

        k=k+1;
    }
    else if(k===2){
        document.getElementById("categoriesList").style.display = "none";
        
        k=k-1;
    }
}


//...............logout()..............

function logout(){
    localStorage.setItem('UserAuth',JSON.stringify({user:"null"}));
    window.location = './index.html'
}

//................Sell..............

function sell(){
    window.location = './AddProduct.html';
}


//...............product Page .........

function upLoadAd(){
    var productName = document.getElementById("producrName").value;
    var Discription = document.getElementById("Discription").value;
    var ProductModel = document.getElementById("ProductModel").value;
    var Address = document.getElementById("Address").value;
    var City = document.getElementById("City").value;
    var Price = document.getElementById('Price').value;
    var Phone = document.getElementById('Phone').value;
    var uplodFile = document.getElementById('uplodFile').files[0];
    var Category = document.getElementById('Category').value
    

 firebase.storage().ref('product/'+uplodFile.name).put(uplodFile)
 .then(()=>{
    firebase.storage().ref('product/'+uplodFile.name).getDownloadURL()
    .then((a)=>{
        

        let ad ={
            productName : productName,
            Discription : Discription,
            ProductModel : ProductModel,
            Address : Address,
            City : City,
            Price: Price,
            Category: Category,
            imageURL:a,
            Phone: Phone,
            Seller: locals.uid
        }
       
        firebase.database().ref('Ad').child(Category).push(ad)
        .then(async(success)=>{
          
            await firebase.database().ref('Ad').child(Category).child(success.key)
            .once('value',item =>{
                let userData = item.val();
                userData.randomKey = success.key;
                firebase.database().ref('Ad').child(Category).child(success.key).set(userData)
            })
            .then(()=>{
                swal({
                    icon: 'success',
                    title: 'Ad posted',
                  }).then(()=>{
                      window.location = './index.html'
                  })

            })
        })
        .catch((error)=>{
            swal({
                icon: 'error',
                title: 'Error',
                
                text: `${error.message}`
              })
              

        })
    })
    .catch((error)=>{
        swal({
            icon: 'error',
            title: 'Error',
            text: `${error.message}`
          })

    })
 })



   
}


function renderProducts(){
    document.getElementById('myUL').innerHTML = "";
    firebase.database().ref('Ad').on('value',(data)=>{
        var userData = data.val();
        // console.log(userData);
        
        for (var key in userData){
            // console.log(key)
            for (var key1 in userData[key]){
                // console.log(userData[key1])
                for (var key2 in userData[key][key1]){
                    
                    var div21 = document.createElement("div");
                    div21.setAttribute('class','advert_title');
                    var a21 = document.createElement("a");
                    a21.setAttribute('herf','#');
                    var a21Text = document.createTextNode(userData[key][key1].productName);
                    a21.appendChild(a21Text);
                    div21.appendChild(a21);
                    
                    var div22 = document.createElement("div");
                    div22.setAttribute('class','advert_text');
                    var div22Text = document.createTextNode("Rs "+userData[key][key1].Price);
                    div22.appendChild(div22Text);
                    var div23 = document.createElement('div');
                    div23.setAttribute('class','advert_content');
                    div23.appendChild(div21);
                    div23.appendChild(div22);
                    
                    
                    var div24 = document.createElement('div');
                    div24.setAttribute('class','ml-auto');
                    
                    var div25 = document.createElement('div');
                    div25.setAttribute('class','advert_image');
                    var img25 = document.createElement('img');
                    img25.setAttribute('alt','Not Found');
                    img25.setAttribute('src',userData[key][key1].imageURL);
                    div25.appendChild(img25);
                    div24.appendChild(div25);
                    var div26 = document.createElement('div');
                    div26.setAttribute('class','advert d-flex flex-row align-items-center justify-content-start');
                    div26.setAttribute('id',userData[key][key1].randomKey);
                    div26.setAttribute('onclick','delay1(this.id)');
                    div26.appendChild(div23);
                    div26.appendChild(div24);
                    var div27 =document.createElement("div");
                    div27.setAttribute('class','col-lg-4 advert_col');
                    div27.setAttribute('id',userData[key][key1].randomKey)
                    div27.style.overflow = "hidden"
                    div27.appendChild(div26);
                   
                }
                document.getElementById("render").appendChild(div27);
                
                document.getElementById('myUL').innerHTML += "<li><a>"+userData[key][key1].productName+"</a></li>";
            }
        }
        
        
        
       
    
       
    })  
}


//................individual Product.............

function individualProduct(){
    var click = JSON.parse(localStorage.getItem('click'));
    firebase.database().ref('Ad').on('value',(data)=>{
        var userData = data.val();
        // console.log(userData);
        
        for (var key in userData){
            // console.log(key)
            for (var key1 in userData[key]){
                // console.log(userData[key1])
                // console.log(click,key1)
                if(key1===click){
                  firebase.database().ref('Ad/'+key+'/'+key1).once('value',(addata)=>{
                    var adData = addata.val();
                    

                    var  div1 = document.createElement("div");
                    div1.setAttribute('class','col-lg-2 order-lg-1 order-2')

                    var div2 =document.createElement('div');
                    div2.setAttribute('class','col-lg-5 order-lg-2 order-1');
                    var div3 = document.createElement('div');
                    div3.setAttribute('class','image_selected');
                    var img1 = document.createElement("img");
                    img1.setAttribute('alt','Not Found');
                    img1.setAttribute('src',adData.imageURL);
                    div3.appendChild(img1);
                    div2.appendChild(div3);

                    var div4 = document.createElement("div");
                    div4.setAttribute('class','col-lg-5 order-3');
                    var div5 =document.createElement("div");
                    div5.setAttribute('class','product_description');

                    var div6 = document.createElement("div");
                    div6.setAttribute('class','product_category');
                    var div6Text = document.createTextNode(adData.City);
                    div6.appendChild(div6Text);
                    var div7 = document.createElement("div");
                    div7.setAttribute('class','product_name');
                    var div7Text = document.createTextNode(adData.productName);
                    div7.appendChild(div7Text);
                    div5.appendChild(div6);
                    div5.appendChild(div7);

                    var div8 = document.createElement("div");
                    div8.setAttribute('class','product_text');
                    var p1 = document.createElement("p");
                    var p1Text = document.createTextNode(adData.Discription)
                    p1.appendChild(p1Text);
                    div8.appendChild(p1);
                    div5.appendChild(div8);

                    var div9 = document.createElement("div");
                    div9.setAttribute('class','order_info d-flex flex-row');
                    var form1 = document.createElement("form");
                    var div10 = document.createElement("div");
                    div10.setAttribute('class','product_price');
                    var div10Text = document.createTextNode("Rs "+adData.Price);
                    div10.appendChild(div10Text);
                    form1.appendChild(div10);
                    
                    var divnum1 = document.createElement('div');
                    divnum1.setAttribute('class','container');
                    var div11 = document.createElement('div');
                    div11.setAttribute('class','button_container');
                    var btn1 = document.createElement('button');
                    btn1.setAttribute('class','button cart_button');
                    btn1.setAttribute('type','button');
                    btn1.setAttribute('id','save')
                    btn1.setAttribute('onClick','sProduct()');
                    var btn1Text = document.createTextNode("Save");
                    btn1.appendChild(btn1Text);

                    var divnum = document.createElement('div');
                    
                    var div111 = document.createElement('div');
                    div111.setAttribute('class','button_container');
                    var btn2 = document.createElement('button');
                    btn2.setAttribute('class','button cart_button');
                    btn2.setAttribute('id','css');
                    var btn2Text = document.createTextNode("View Phone No");
                    document.getElementById("phone1").innerHTML=adData.Phone;
                    btn2.setAttribute('type','button');
                    btn2.setAttribute('data-toggle','modal');
                    btn2.setAttribute('data-target','#myModal4');
                    
                    btn2.appendChild(btn2Text);
                    divnum1.appendChild(btn1);
                    div11.appendChild(divnum1);
                    divnum.append(btn2);
                    div11.appendChild(divnum);
                    form1.appendChild(div11);

                    div9.appendChild(form1);
                    div5.appendChild(div9);
                    div4.appendChild(div5);



                    document.getElementById('r2').appendChild(div1);
                    document.getElementById('r2').appendChild(div2);
                    document.getElementById('r2').appendChild(div4);




                  })
                } 
                for (var key2 in userData[key][key1]){
                    // console.log(key1)
                }
            }
        }        
    })    

}

function  delay1(a){
    console.log(a);
    var click = a;
    localStorage.setItem('click',JSON.stringify(click))

        window.location = './product.html';

    
}
function myFunction() {
    // Declare variables
    document.getElementById('myUL').style.display ="block";
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  function myFunction2(){
    document.getElementById('myUL').style.display ="none";
  }



//..................Saved Products........

function sProduct(){

   firebase.database().ref('/Ad').once('value',(adata)=>{
    var Adid = JSON.parse(localStorage.getItem('click'));
    var adata = adata.val();
    for(var ky in adata){
        for(var ky1 in adata[ky]){
            if(ky1 === Adid){
               var adObj= adata[ky][ky1];
               var key= firebase.database().ref('/users/'+locals.uid+'/SaveAds').push().key;
               adObj.uperkey = key;
               firebase.database().ref('/users/'+locals.uid+'/SaveAds/'+key).set(adObj);
               document.getElementById('save').style.display = "none";
            }
        }
    }
   })
}
function  delay2(){
        window.location = './saveProducts.html';
}

function renderSaveProducts(){
    
    document.getElementById('myUL').innerHTML = "";
    firebase.database().ref('/users/'+locals.uid+'/SaveAds').once('value',(addata)=>{
        var addata = addata.val();
        console.log(addata);
        for(var key in addata){
            var div21 = document.createElement("div");
            div21.setAttribute('class','advert_title');
            var a21 = document.createElement("a");
            a21.setAttribute('herf','#');
            var a21Text = document.createTextNode(addata[key].productName);
            a21.appendChild(a21Text);
            div21.appendChild(a21);
            
            var div22 = document.createElement("div");
            div22.setAttribute('class','advert_text');
            var div22Text = document.createTextNode("Rs "+addata[key].Price);
            div22.appendChild(div22Text);
            var div23 = document.createElement('div');
            div23.setAttribute('class','advert_content');
            div23.appendChild(div21);
            div23.appendChild(div22);
            
            
            var div24 = document.createElement('div');
            div24.setAttribute('class','ml-auto');
            
            var div25 = document.createElement('div');
            div25.setAttribute('class','advert_image');
            var img25 = document.createElement('img');
            img25.setAttribute('alt','Not Found');
            img25.setAttribute('src',addata[key].imageURL);
            div25.appendChild(img25);
            div24.appendChild(div25);
            var div26 = document.createElement('div');
            div26.setAttribute('class','advert d-flex flex-row align-items-center justify-content-start');
            div26.setAttribute('id',addata[key].randomKey);
            div26.setAttribute('onclick','delay1(this.id)');
            div26.appendChild(div23);
            div26.appendChild(div24);
            var div27 =document.createElement("div");
            div27.setAttribute('class','col-lg-4 advert_col');
            div27.setAttribute('id',addata[key].randomKey)
            div27.style.overflow = "hidden"
            div27.appendChild(div26);

            document.getElementById("render").appendChild(div27);

            document.getElementById('myUL').innerHTML += "<li><a>"+addata[key].productName+"</a></li>"


        }
    })
}

function gotoCgat(){
    window.location='./chat.html';
}

function chat(){
   
    firebase.database().ref('users/'+locals.uid+'/chat').on('value',(Chatdata)=>{
        var Chatdata= Chatdata.val();
        // console.log(Chatdata)
        for(var key in Chatdata){
             document.getElementById('showText').innerHTML="";
    document.getElementById("showChatName").innerHTML="";
            for(var key1 in Chatdata[key]){
                // console.log(key)
                firebase.database().ref('users/'+key+'/Data').once('value',(reciverData)=>{
                    var reciverData = reciverData.val();
                    // console.log(reciverData);
                    
                    var div1 = document.createElement('div');
                    div1.setAttribute('class','alert alert-info');
                    var strong1 = document.createElement('strong');
                    var strong1Text = document.createTextNode(reciverData.name); 
                    strong1.appendChild(strong1Text);
                    div1.appendChild(strong1);
                    document.getElementById("showChatName").appendChild(div1);
                    console.log(key);
                });
                        
                
                
                console.log(Chatdata[key][key1].message)
                
                if(locals.uid === Chatdata[key][key1].sender){

                    var div11 = document.createElement('div');
                    div11.setAttribute('class','alert alert-info col-sm-7 right');
                    var div11Text = document.createTextNode(Chatdata[key][key1].message);
                    div11.appendChild(div11Text);
                    document.getElementById('showText').appendChild(div11);
                }
                else{
                    var div11 = document.createElement('div');
                    div11.setAttribute('class','alert alert-info col-sm-7 left');
                    var div11Text = document.createTextNode(Chatdata[key][key1].message);
                    div11.appendChild(div11Text);
                    document.getElementById('showText').appendChild(div11);
                }
                        }            
        }
    })


}

function send(){
    
    // var div1 = document.createElement('div');
    // div1.setAttribute('class','alert alert-info');
    // var strong1 = document.createElement('strong');
    // var strong1Text = document.createTextNode() 

    var adid = JSON.parse(localStorage.getItem('click'));
 
    firebase.database().ref('/Ad').on('value',(addata2)=>{
        var addata2 = addata2.val();
        for( var key in addata2){
            for(var key1 in addata2[key]){
                
                if(key1===adid){
                    var text = document.getElementById('text').value;
                    // console.log(text);
                    // console.log(addata2[key][key1]);
                    var mkey= firebase.database().ref('/users/'+locals.uid+'/chat').push().key;
                    let obj ={
                        messageKey : mkey,
                        message : text,
                        sender : locals.uid,
                        reciver : addata2[key][key1].Seller,
                    }
                    console.log(addata2[key][key1].Seller)
                    firebase.database().ref('/users/'+locals.uid+'/chat/'+addata2[key][key1].Seller+'/'+mkey).set(obj);
                    firebase.database().ref('/users/'+addata2[key][key1].Seller+'/chat/'+locals.uid+'/'+mkey).set(obj);
                    // console.log(obj);
                    

                }
            }
        }

    })
}

function move(){
    window.location = './chat.html' ;
}

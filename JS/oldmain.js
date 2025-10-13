// CRUDS
// 1- Create 

// var productName = document.getElementById("productName");
// console.log(productName)

// our aim is to get the values the user entered to define the product
// so creating variables that hold these values
// First: get the input of html so it will be of type object by JS
var productName = document.getElementById("productName"); 
var productPrice = document.getElementById("productPrice"); 
var productCategory = document.getElementById("productCategory"); 
var productImage = document.getElementById("productImage"); 
var productDescription = document.getElementById("productDescription"); 
var searchedItem = document.getElementById("searchedItem"); 
var productsNumber = document.getElementById("productsNumber");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var updatedIndex;
var productList = [];

// Function to check if there is any data aka products in localStorage so that be displayed 

if (localStorage.getItem("productsArray") != null){
    // condition is true means that it does have product/s
    productList = JSON.parse(localStorage.getItem('productsArray'))
    displayProduct(productList)
}

// Now we can access the property value (attribute of html that user entered through the form)
// The productName object is accesssd fine
// console.log(productName) 
// Accessing the value the user entered is not valid yet
// and there is a problem with the network (the problem with network is something else than notadding onclick)
// console.log(productName.value)

// lets add on click function to the button of add product in html

/*
function addProduct () {
    console.log(productName.value)
    console.log(productPrice.value)
    console.log(productCategory.value)
    console.log(productimg.value)
    console.log(productDescription.value)
}
*/

// Function this way still needs too many enhancements 
// we need to make the product's attributtes actually related to each other 
// or how else we know these values descripe the same product
/*
function addProduct () {
    var product = {
        name         : productName.value,
        price        : productPrice.value,
        category     : productCategory.value,
        productImage : productimg.value,
        description  : productDescription.value
    }
    now we can log the product object as a unit 
    console.log(product);
}
*/
// this function right now does create a product but only one
// we need a list a number of products not just product being overridden with new inputs each time
// so initializing an empty array outside the function 
// why not inside it ? 
// because inside it won't make a differnce with each new object created it will push it to the array 
// but when creating a new one it will be overridden as the product itself 
// (object is overriden but i saved it to the array so no worries)
// array only holdes values so it will carry each object not mixed with any other
// the productlist array in real world is returned from backend but same concepts the array has objects
// why array ? to be looped on

function addProduct () {
    var product = {
        name         : productName.value,
        price        : productPrice.value,
        category     : productCategory.value,
        image        : `imgs/${productImage.files.length > 0 ? productImage.files[0].name : "white-image.jpg"}`,
        description  : productDescription.value
    }
    productList.push(product);
    // saving my data to local storage too 
    // sending it as strings so using JSON.Stringify
    localStorage.setItem("productsArray", JSON.stringify(productList))
    // adding a function at the top of the script to check if there is any Item in the localStorage
    console.log(productList);
    clearInputsValue ();
    displayProduct(productList);
}

// now there is a potential enhancement
// after adding a product, to add another one 
// you have to delete alll values you have entered yourself
// so this derives us to make a function that clears the input values after adding


// Other Important Enhancement that if the user didnot add an image 
// this will cause a huge error
// so one of the ways is to handle it using an if condition
// while creating the object and when updating it
// using ternary operator

function clearInputsValue () {
    productName.value        = ""
    productPrice.value       = ""
    productCategory.value    = ""
    productImage.value         = ""
    productDescription.value = ""
}

// 2- Read / Display / Retrieve 

function displayProduct (array){
    var productsCount = array.length;
    productsNumber.innerHTML = productsCount;
    var displayedItem = "";
    for (var i = 0; i<productsCount ; i++) {
        displayedItem += `<div class="col-md-4 pt-1">
                        <div class="card">
                            <img class="card-img-top" src="${array[i].image}" alt="${array[i].name}">
                            
                            <span class="badge bg-primary position-absolute top-0 end-0 m-2">
                                ${array[i].category}
                            </span>
                            <div class="card-body">
                                <h5 class="card-title">${array[i].name}</h5>
                                <p class="card-text">${array[i].description}</p>
                                <div class="d-flex align-items-center justify-content-between">
                                    <h4 class="text-primary mb-0">${array[i].price} EGP</h4>
                                    <div class="product-operations d-flex">
                                        <!-- i inside the template literal is replaced with the current index number at the time of looping. -->
                                        <!-- so it changes as an HTML -->
                                        <!-- When you click the button The browser executes the function with the index number generated earlier -->
                                        <button id="deleteProduct" onclick="deleteProduct(${i})" class="btn btn-outline-danger rounded-end-0">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                        <button id="updateProduct" onclick="getProductToBeUpdated(${i})" class="btn btn-outline-warning rounded-start-0">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    // console.log(productList[i].productImage) always keeping the url to the first image entered as of index 0
    }
    // till now everything is fine else that the card is not shown in the html
    // we must define where this card should belong
    // so the cards parent is the row so give it an id 
    document.getElementById("rowData").innerHTML = displayedItem;
}
// after making display dynamic go back and send productList as an argument when calling display

// We need to make enhancements to the way our store works
// we need to store our data only for now using the local storage 
// as we dont have a database yet
// so moving back to our display function to see how can we deal with the array of objects that holds our data

// after considring the localStorage now we need to enhance the displayProduct function
// to make it dynamic accepts any array not only the producList one
// as we will benefit from this later

// 4- Delete 

// To make the delete work we need to know the index of the element we wwant to delete from the array
// we know that we loop on the elements in displayProduct 
// so we can use the variable i to be sent as an argument to our delete function if clicked the delete btn

function deleteProduct(index) {
    // console.log(index)
    // delete it from productList array
    productList.splice( index , 1)
    // display the new array
    displayProduct(productList)
    // update the localStorage too with new productList array that we removed product from it
    localStorage.setItem("productsArray", JSON.stringify(productList) )
}

// 5- Search

function searchProduct() {
    var toBeSearched = searchedItem.value;
    var searchProductsArray = [];
    var productsCount = productList.length;
    for (var i = 0; i < productsCount ; i++){
        if ( productList[i].name.toLowerCase().includes(toBeSearched.toLowerCase()) == true) {
            searchProductsArray.push(productList[i]);
        }
    }
    displayProduct(searchProductsArray)
    // That is why it is important to make display function dynamic to display any array
}

// 3- Update

function getProductToBeUpdated(index) {
    updatedIndex = index;
    productName.value        = productList[index].name;
    productPrice.value       = productList[index].price;
    productCategory.value    = productList[index].category;
    productDescription.value = productList[index].description;
    // console.log(productList[index].productImage);
    // productimg.value         = productList[index].productImage;

    addBtn.classList.add("d-none")
    updateBtn.classList.remove("d-none")
}

function updateProduct() {
    productList[updatedIndex].name = productName.value;
    productList[updatedIndex].price = productPrice.value;
    productList[updatedIndex].category = productCategory.value ;
    productList[updatedIndex].description = productDescription.value;
    productList[updatedIndex].image = `imgs/${productImage.files[0].name}`;
    displayProduct(productList)
    localStorage.setItem("productsArray", JSON.stringify(productList))
    clearInputsValue()
    addBtn.classList.remove("d-none")
    updateBtn.classList.add("d-none")
}
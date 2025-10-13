var productName = document.getElementById("productName"); 
var productPrice = document.getElementById("productPrice"); 
var productCategory = document.getElementById("productCategory"); 
var productImage = document.getElementById("productImage"); 
var preview = document.getElementById("preview");
var currentTempURL = null;
var productDescription = document.getElementById("productDescription"); 
var searchedItem = document.getElementById("searchedItem"); 
var productsNumber = document.getElementById("productsNumber");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var updatedIndex;
var updatedId;
var productList = [];

if (localStorage.getItem("productsArray") != null){
    productList = JSON.parse(localStorage.getItem('productsArray'))
    displayProduct(productList)
}

function addProduct () {
    if (checkAllValidation ()) {
        var product = {
            //          Cryptography   Universally Unique Identifier
            id           : crypto.randomUUID(),
            name         : productName.value,
            price        : productPrice.value,
            category     : productCategory.value,
            image        : `imgs/${productImage.files.length > 0 ? productImage.files[0].name : "white-image.jpg"}`,
            description  : productDescription.value
        }
        productList.push(product);
        localStorage.setItem("productsArray", JSON.stringify(productList))
        // console.log(productList);
        clearInputsValue ();
        displayProduct(productList);
    }
}

function clearInputsValue () {
    productName.value        = ""
    productPrice.value       = ""
    productCategory.value    = ""
    productImage.value       = ""
    productDescription.value = ""
    preview.src              = ""
    preview.classList.add("d-none")
    productName.classList.remove("is-valid")
    productCategory.classList.remove("is-valid")
    productDescription.classList.remove("is-valid")
    productPrice.classList.remove("is-valid")
    productImage.classList.remove("is-valid")
}


function displayProduct (array){
    var productsCount = array.length;
    productsNumber.innerHTML = productsCount;
    var displayedItem = "";
    for (var i = 0; i<productsCount ; i++) {
        var realIndex = productList.indexOf(array[i]);
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
                                        <button id="deleteProduct" onclick="deleteProduct(${realIndex})" class="btn btn-outline-danger rounded-end-0">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                        <button id="updateProduct" onclick="getProductToBeUpdated(${realIndex})" class="btn btn-outline-warning rounded-start-0">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    // console.log(productList[i].productImage) always keeping the url to the first image entered as of index 0
    }
    document.getElementById("rowData").innerHTML = displayedItem;
}

function previewImage() {
    if (currentTempURL) {
        URL.revokeObjectURL(currentTempURL);
        currentTempURL = null;
    }

    if (productImage.files.length > 0) {
        currentTempURL = URL.createObjectURL(productImage.files[0]);
        preview.src = currentTempURL;
        preview.classList.remove("d-none")
    } else {
        preview.src = "";
        preview.classList.add("d-none")
    }
}

function deleteProduct(index) {
    productList.splice( index , 1)
    displayProduct(productList)
    localStorage.setItem("productsArray", JSON.stringify(productList) )
}

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
}

function getProductToBeUpdated(index) {
    updatedId = productList[index].id;
    updatedIndex = index;
    productName.value        = productList[index].name;
    productPrice.value       = productList[index].price;
    productCategory.value    = productList[index].category;
    productDescription.value = productList[index].description;
    preview.src              = productList[index].image;
    preview.classList.remove("d-none")
    addBtn.classList.add("d-none")
    updateBtn.classList.remove("d-none")
}

function updateProduct() {
    var index = productList.findIndex(p => p.id === updatedId);
    if (index === -1 ) {
        clearInputsValue();
        addBtn.classList.remove("d-none");
        updateBtn.classList.add("d-none");
        return;
    }
    productList[index].name = productName.value;
    productList[index].price = productPrice.value;
    productList[index].category = productCategory.value ;
    productList[index].description = productDescription.value;
    var imagePath = productList[index].image;
    if (productImage.files.length > 0) {
        imagePath = `imgs/${productImage.files[0].name}`;
    }
    productList[index].image = imagePath;
    preview.src = "";
    // productList[updatedIndex].image = `imgs/${productImage.files.length > 0 ? productImage.files[0].name : "white-image.jpg"}`;
    displayProduct(productList)
    localStorage.setItem("productsArray", JSON.stringify(productList))
    clearInputsValue()
    addBtn.classList.remove("d-none")
    updateBtn.classList.add("d-none")
    preview.classList.add("d-none")
}

//  after saving the id supposed to be edited at the getProductToBeUpdated then while updating we check 
// if the id still existes and if not we clear values and if it exists we edit according 
// to the index matching the productId index whatever it was changed or not as it is the same product cause of the unique update


// Validation

function validateInput (input, msg) {
    var regex = {
        productName        : /^[a-zA-Z0-9\s\-_]{3,}\s*$/ ,
        productPrice       : /^\d{4,8}$/,
        productCategory    : /^(TV|Mobile|Laptop)\s*$/i,
        productImage       : /(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.webp)$/i,
        productDescription : /^[\w]+(\s+[\w]+)*\s*$/m,
    };
    var errorMsg = document.getElementById(msg) ;
    if (regex[input.id].test(input.value)== true) {
        input.classList.add("is-valid")
        input.classList.remove("is-invalid")
        errorMsg.classList.add("d-none")
        return true
    } 
    else {
        input.classList.remove("is-valid")
        input.classList.add("is-invalid")
        errorMsg.classList.remove("d-none")
        return false
    }
}

function checkAllValidation (){
    if (validateInput(productName, "nameMsg") &&
        validateInput(productPrice , "priceMsg") &&
        validateInput(productCategory, "categoryMsg") &&
        validateInput(productImage, "imageMsg") &&
        validateInput(productDescription, "descriptionMsg")){
                return true;
    } 
    else {
        return false
    }
}


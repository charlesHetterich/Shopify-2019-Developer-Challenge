//test data
var inventory = [
    { title: 'apple', price: 1.99, inventory_count: 33 },
    { title: 'computer', price: 999.99, inventory_count: 10 },
    { title: 'banana', price: 0.99, inventory_count: 10 },
    { title: 'bag of coffee beans', price: 7.99, inventory_count: 1 },
    { title: 'paper towel roll', price: 0.99, inventory_count: 22 },
    { title: 'paper towel roll 6-pack', price: 4.99, inventory_count: 22 },
    { title: 'paper plates', price: 0.99, inventory_count: 37 },
    { title: 'shopify position', price: 0.00, inventory_count: 1 },
    { title: 'space ship', price: 999999.00, inventory_count: 0 },
];
var cart = {
    cartContents: []
}

//getProduct : [ProductType] String Bool -> ProductType
//gives products with matching title from given list of products
//only gives in stock items if flag set
var getProduct = function(productList, title, onlyInStock = false) {
    return productList.filter(product => (product.title == title) && (!onlyInStock || product.inventory_count > 0))[0];
}

//getProductFromInventory : String Bool -> ProductType
//gives the product with matching title
//only gives in stock items if flag set
var getProductFromInventory = function(title, onlyInStock = false) {
    return getProduct(inventory, title, onlyInStock);
}

//getProductsFromInventory : String -> [ProductType]
//gives list of products containing given string
//if given string empty/null, gives list of all products
//only gives in stock items if flag set
var getProductsFromInventory = function(title, onlyInStock = false) {
    if (title) {
        return inventory.filter(product => product.title.includes(title) && (!onlyInStock || product.inventory_count > 0));
    }
    else {
        return inventory.filter(product => !onlyInStock || product.inventory_count > 0);
    }
}

//updateProductCount : String Int -> ProductType
//sets inventory_count of product with given name & returns product
var updateProductCount = function(title, count) {
    inventory.map(product => {
        if (product.title == title) {
            product.inventory_count = count;
            return product;
        }
    });
    return inventory.filter(product => product.title == title)[0];
}

//getTotal : () -> Int
//return the total cost of all items in our cart
var getTotal = function() {
    var total = 0.0;
    var content = cart.cartContents;
    for(var i = 0; i < content.length; i++) {
        total += content[i].price * content[i].inventory_count;
    }
    return total;
}

//addToCart : String -> MessageType
//if product with given title exists & in stock
//add one to our cart & return a message
var addToCart = function(title) {
    var inventoryProduct = getProductFromInventory(title);
    var cartProduct = getProduct(cart.cartContents, title);

    //possible return messages
    var m_DNE = { message: "Could not find, " + title + ", in our inventory." }
    var m_outOfStock = { message: "We have no more, " + title + ", in our inventory." }
    var m_confirmation = { message: "One, " + title + ", Was added to your cart." }

    //product with given title does not exist or is out of stock
    if (!inventoryProduct) {
        return m_DNE;
    }

    //product already exists in cart
    if (cartProduct) {
        //no more in stock to give to customer
        if (inventoryProduct.inventory_count <= cartProduct.inventory_count) {
            return m_outOfStock;
        }
        cartProduct.inventory_count += 1;
        return m_confirmation;
    } else {
        //no more in stock to give to customer
        if (inventoryProduct.inventory_count <= 0) {
            return m_outOfStock;
        }
        var newProduct = {
            title: title, 
            price: inventoryProduct.price, 
            inventory_count: 1
        }
        cart.cartContents.push(newProduct);
        return m_confirmation;
    }
}

var removeFromCart = function(title) {

}

//getReciept : () -> RecieptType
//return a reciept with a deep copy of our cart & the total price
var getReciept = function() {
    //do deep copy of cart
    var r_cart = { cartContents: [] }
    var content = cart.cartContents;
    for (var i = 0; i < content.length; i++) {
        var newProduct = {
            title: content[i].title, 
            price: content[i].price,  
            inventory_count: content[i].inventory_count,
        }
        r_cart.cartContents.push(newProduct);
    }

    var reciept = {
        cart: r_cart,
        total: getTotal()
    }
    return reciept;
}

//checkOut : () -> RecieptType
//remove products in cart from inventory, empty cart, and return a reciept
var checkOut = function() {
    var reciept = getReciept();
    var content = cart.cartContents;

    //remove products from inventory
    for (var i = 0; i < content.length; i++) {
        var product = getProductFromInventory(content[i].title);
        product.inventory_count -= content[i].inventory_count;
    }

    //empty cart & return reciept
    cart.cartContents = [];
    return reciept;
}

module.exports = {
    product: getProductFromInventory,
    products: getProductsFromInventory,
    updateProductCount: updateProductCount,
    addToCart: addToCart,
    reciept: getReciept,
    checkOut: checkOut
}
# Shopify 2019 Developer Challenge
My submission for Shopify's 2019 Developer Challenge. This is an API for an online market place where you can browse products, create a cart, add products to the cart, and checkout & get a reciept.  
This was made using Node.js, Express, & GraphQL.

## Running the API
To run the api, first install Node.js if you do not have it installed already. Open a terminal from inside the challenge folder and enter the command
```
node server.js
```
Then open your internet browser and go to the url **http://localhost:4000/graphql**.

## GraphQL Types
### MessageType
The Message Type is used for sending a simple message
```
{
  message : String
}
```
We use the Message Type when attempting to add a product to the cart to give information about the success of adding a product to the cart.

### ProductType
The Product Type is used to store all of our product data
```
{
  title           : String
  price           : Float
  inventory_count : Int
}
```
We see the Product Type used in our database of inventory and in our shopping cart as well.

### ShoppingCartType
The ShoppingCart Type is used to keep track of a user's shopping cart
```
{
  cartContents : [ProductType]
}
```
An instance of the ShoppingCart Type is used through out a user's shopping experience. It is used to keep track of what has been added to the cart & to make the final purchase when a user checks out.

### RecieptType
The Reciept Type is used to give information about the cart
```
{
  cart  : ShoppingCartType
  total : Float
}
```
A Reciept can be used to check the contents of a shopping cart and also is returned when a user checks out.

## GraphQL Queries
### product
Returns a **ProductType**
#### Arguements
```
title : String
```
Returns the product with a title matching the given string.
###### Example Query
```
{
  product(title: "apple") {
    title
    price
    inventory_count
  }
}
```

### products
Returns a **[ProductType]**
#### Arguements
```
title : String
```
Returns a list of products with titles containing the given string. If the string is empty or null, returns all products in inventory.
###### Example Query
```
{
  products(title: "paper") {
    title
    price
    inventory_count
  }
}
```

### updateProductCount
Returns a **ProductType**
#### Arguements
```
title : String
count : Int
```
Finds a product with a title matching the given string and sets it's inventory_count to given count. Then returns the given product after being updated
###### Example Query
```
{
  updateProductCount(title: "computer", count: 3) {
    title
    price
    inventory_count
  }
}
```

### browse
Returns a **[ProductType]**
#### Arguements
```
title : String
```
Returns a list of products with titles containing the given string. If the string is empty or null, returns all products in inventory. Products that are not in stock are filtered out of this search. This is what users will use to search for products.
###### Example Query
```
{
  browse(title: "paper towel roll") {
    title
    price
    inventory_count
  }
}
```

### addToCart
Returns a **MessageType**
#### Arguements
```
title : String
```
Attempts to add a product wih title matching the given string to the users shopping cart, and returns a message to inform the user about what happened.

There are three messages that can be returned:  
If a product with the given title does not exist...
```
Could not find, <title>, in our inventory.
```
If the product is out of stock or the user has the same amount/more of the product in their cart than is in inventory...
```
We have no more, <title>, in our inventory.
```
If the product was successfully added to the users shopping cart...
```
One, <title>, Was added to your cart.
```
###### Example Query
```
{
  addToCart(title: "bag of oranges") {
    message
  }
}
```

### reciept
Returns a **RecieptType**
Returns a reciept based on the current shopping cart.
###### Example Query
```
{
  reciept {
    cart {
      cartContents {
        title
        price
        inventory_count
      }
    }
    total
  }
}
```

### checkOut
Returns a **RecieptType**
Removes proper amount of each product in the shopping cart from inventory, clears the shopping cart, and returns a reciept containing what was purchased and a total price.
###### Example Query
```
{
  checkOut {
    cart {
      cartContents {
        title
        price
        inventory_count
      }
    }
    total
  }
}
```

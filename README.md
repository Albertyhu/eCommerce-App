# eCommerce-App
This branch updates the number of Shopping Cart items in the drawer by passing context and using Redux store. 
However, a new problem emerges where going from Home screen to the Product screen no longer works. 
I was wondering if it the problem started after adding code that handles passing context. 

Update 12/26/21 7:03 pm: So, I seem be close to finding out what the issue is. After I added the context and redux code onto the product page, going from Home screen to Product screen no longer works. 

Update 12/27/21 5 pm. I found out that Redux store was the problem. After I undid the code that connects the product screen to redux store, the navigation was working again. 

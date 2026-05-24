#LOOKBOOK SECTION

Technical Assessment to build a native Shopify Lookbook feature. Built on the Horizon theme, using metaobjects for content modelling and using the Storefront API for runtime product data retrival. Support for the store Australia (AUD) and Japan (JPY) markets.


## ASSUMPTIONS/DESCIONS

- Assumed theme was built using the default Horizon Theme
- Used Sidekick to generate 10 fashion products for the AU and JP markets.
- If a product appears in multiple lookbooks we return the first available lookbook from reverse lookup.
- Non PDP Lookbook requires a lookbook to be assigned. If lookbook is selected nothing shows.
- Used light styling to make section presentable.
- For simplicity and demonstrating functionality - CSS was added to the liquid template and JS (lookbook.js) to the /assets folder.
- Storefront API Token was created via Headless App instead of via Custom App in Dev Dashboard.




## ARCHITECTURE

Assumed three fields for simplicity and demonstration of data retrival from metaobject and graphQL. 

- title (Single Line Text)
- description (Rich Text)
- product_handles (Single Line Text - List)

Two section templates one limited for use template Product and other disabled on products.


###PDP
By default, lookbook section uses product's handle to perform a reverse lookup for a lookbook metaobject containing current product exists. If it exists it performs a storefront API request via graphQL to retrieve all products from the lookbook entry.

Option to manually override section with specific lookbook. 


### Non PDP

If no lookbook is selected nothing shows.





## DEMONSTRATION

Non PDP Lookbook section set up on Home page template to reference "Spring's Suprise Newest Look" etaobject entry.




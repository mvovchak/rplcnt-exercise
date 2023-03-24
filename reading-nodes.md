##### First, I will describe the current requirements of the task and how I understood them
##### Second, I will do a quick walk through of the original code and highlight the existing implementation issues. 
##### Third, I will provide my approach to the solution
##### Lastly, I will show the unit tests as proof that the code works as well as run a simple console implementation

Please feel free to interrupt me during the presentation if you have any questions.

1. The existing requirements are: 
    Inventory that holds items
    Item's quality and sellIn decrease by 1 every day and by 2 after the sellIn date
    Some exceptions are - Cheese (increase in quality). Ramen (no change in quality)

  New Requirements:
    - Add organic products to inventory with daily quality decrease is 2 
    - Remove ANY of the items if they are 5 days past sell-In

2. 
### Code walk through:
    ### The items in store inventory have two main properties:
        - sellIn value, number of days the store has to sell it
        - quality value

    ### Constraints:
        - Quality is between 0 and 25 inclusive
        - (New) After sellIn value is past due 5 days (-5) the product is removed

    ### There are currently 3 types of items:
        - Standard - daily decrease in quality by 1; after past sellin decrease by 2
        - Cheddar cheese - daily increase in quality until it reaches 25, no expiration date
        - Ramen - no change in quality, no expiry (non-perishable)
        - (New) Organic products - decrease in quality by 2, then by 4 after sellIn date has passed

### Current implementation issues
    #### Style
        - inconsistent code style
    #### Readability
        - left out comments, unused attributes, etc
    #### Growing Code Complexity and lack of flexibility
        - updateQuality()
        - Growing Complexity: complex if statements grow with each new requirement
        - Magic Numbers
        - Left out commented code without a proper label
        - Lack of proper unit test coverage (only the best case scenario tested)
    #### Lack of unit tests
        - only basic scenario


3. What I want to do with this:

- Provide a flexible architecture for adding new product requirements; avoid complexity growth of updateQuality()
- Improve overall readability and fix code style
- Implement new Organic products  and product removal requirements
- Add unit tests, for all possible cases

### Steps to refactor:
    - Categorize Product, expand product attributes, ultimately remove complexity

- Improve existing Item/Product representation
    Add additional fields for better product representation, such as capturing historical data:
        ID
        initialQuality,
        sellInDate (date the product should be sold)
        onShelfDate (basically current date the product is on the shelf, using it for the sake of the exercise, actual current dates would be used in real-life)

    Categorize product:
        qualityChangePerDay: integer representing how quality change per day, can be pos/neg
        qualityChangePerDayAfterSellInDate: same, but after the sellInDate has passed
        maxShelfLifeDaysPastSellIn: how many days before the product expires once past sellIn

    
    This will work for most cases, however, if there is one product whose rules do not fit in any of existing categories, a new category will need to be created specifically for this one product. Therefore extending ProductCategory properties to product will make this more flexible

### Things to improve:
- 'Item' name too generic - for lack of better name I chose Product
- 'sellIn' value is unclear and in real-life scenario dates would be used and sellIn days value calculated
- By removing expired products we might be loosing important historical data, therefore my suggestion is to flag it as expired. Possibly add a method to remove expired products in bulk ( in case the customer needs it)
- Simplify existing if conditions, remove name comparisons since names might change in future, add unique IDs instead
- Commented out code, but evaluate possible onSale flags on products if certain conditions are met

===


For onSale - product can have offers array such as:
    offers: Offer[] [{
        name: 'Summer Promotion'}
        startDate: Date!
        endDate: Date!
        sellInLessThen: Number!
    }] 


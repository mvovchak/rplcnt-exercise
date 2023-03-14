

Constraints:
    - Once the sellIn date has passed, Quality degrades twice as fast
    - The Quality of an item is never negative
    - The Quality of an item is never more than 25
    - "Cheddar Cheese" actually increases in Quality the older it gets
    - "Instant Ramen", never has to be sold or decreases in Quality

New requirements:
    - "Organic" items degrade in Quality twice as fast as normal items
    - Once ANY item is 5 days past its sellIn date we can no longer sell it and it should be removed from our system


Assumptions:
- Cheddar does not expire since it increases in quality with age
- ANY item means not only organic, so it is a new global requirement

- Removing product may cause accidents and loss, flag it as removed and maybe set a removedAt timestamp
- sellIn seems strange - it can still be represented on the UI as a numeric value, but an expiryDate may work better
- Make product extendible by adding additional attributes, eg. Category
- Make logic more descriptive and less verbose
- Define product constraints, make them testable
## questions to be asked
- In a property management system, what are the main features that you would like to
have specifically for tracking of income and expenses do i relate them to each property or to the whole system and do i relate them to the renter ow just owners?

## steps to be taken
- create a custom modal for creating in simple modal (like city modal , state modal,...ect) add also the state and button in the modal
- in our MUIForm we need to add a condition to check if there is a custom modal or not
- we will create a route that will handle all the create request for the custom modal either city or state or any other custom modal all will have this route
- the request for the fast-create route will be handled by passing id this id represent the custom modal id either it city or state or any other custom modal
- we will make an array of available create functions for each and will we get the requested modal using this id and we will call the create function for this modal
// event
// {
//   "typeName": "Query" | "Mutation", /* Filled dynamically based on @function usage location */
//   "fieldName": "createPaymentMethod", /* Filled dynamically based on @function usage location */
//   "arguments": { amount  /* GraphQL field arguments via $ctx.arguments */ },
//   "identity": { /* AppSync identity object via $ctx.identity */ },
//   "source": { /* The object returned by the parent resolver. E.G. if resolving field 'Post.comments', the source is the Post object. */ },
//   "request": { /* AppSync request object. Contains things like headers. */ },
//   "prev": { /* If using the built-in pipeline resolver support, this contains the object returned by the previous function. */ },
// }

//This file is the result of typing amplify add function onto the console
//We created a Lambda function called CreatePaymentIntent. Hence the file name.

const stripe = require("stripe")("sk_test_Ing9sbNLG4dWPkVL3pp1voFQ")

exports.handler = async (event) => {
    const {typeName, arguments} = event;
    if(typeName !== 'Mutation'){
        throw new Error('Request is not a mutation!');
    }
    if(!arguments?.amount){
        throw new Error('Amount argument is required');
    }

    //this creates the PaymentIntent, which is what Stripe uses to track the customer's payment lifecycle
    //it helps to track any failed payments and helps to avoid charging the customer twice.
    const paymentIntent = await stripe.paymentIntents.create({
        amount: arguments.amount,
        currency: 'usd',
    });

    //the client secret is returned to complete the payment
    return {
        clientSecret: paymentIntent.client_secret,
    }
}

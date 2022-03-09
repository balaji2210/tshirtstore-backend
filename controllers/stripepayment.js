
const stripe=require('stripe')("sk_test_51Iwi7tSBzzaYG1vgk7hz3kPtMTuqmFKLSvGd7K5t698byzxCQF5KOS3Ge3zOTZelHDi8R4sjQxWOShAZ8FCrQoNr00g4OLSrna")
const uuid=require('uuid')



exports.makepayment=(req,res)=>{
    const {products,token}=req.body
    console.log("PRODUCTS: ",products);

    let amount=0;
    products.map(p=>{
        amount=amount+p.price;
    })
    const idempotencyKey=uuid()

    return stripe.customsers.create({
        email:token.email,
        source:token.id
    }).then(customer=>{
        stripe.charges.create({
            amount:amount,
            currency:'usd',
            customer:customer.id,
            receipt_email:token.email,
            description:"A test Account",
            shipping:{
                name:token.card.name,
                address:{
                    line1:token.card.address_line1,
                    line2:token.card.address_line2,
                    city:token.card.address_city,
                    country:token.card.address_country,
                    postal_code:token.card.address_zip
                }
            }
        },{idempotencyKey})
        .then(result=>res.status(200).json(result))
        .catch(err=>console.log(err))
    })

}
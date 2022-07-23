const { request, response } = require("express");


const getPayment = (req = request, res= response) => {
    res.json({
        success: true,
        msg: 'payment'
    })
}

const createPayment = async(req = request, res= response) => {
    try {
        // const { email,products } = req.body;
        // const url= "https://api.mercadopago.com/checkout/preferences";
        // const body = {
        //     payer_email: "TESTZGNIRHHD",
        //     items: [
        //         {
        //             title: "Test item",
        //             description: "Test item description",
        //             picture_url: "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
        //             category_id: "others",
        //             quantity: 1,
        //             unit_price: 1.00
        //         }
        //     ],
        //     back_urls: {
        //         success: "localhost:3000",
        //         failure: "localhost:3000",
        //         pending: "localhost:3000"
        //     },
        // }
        // const options = {
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        //     }
        // }
        // const response = await axios.post(url, body, {
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        //     }
        // });
        // const data = await response.data;
        // console.log(data);
        
        // const subscription = await this.subscriptionService.createSubscription();
  
        return res.json({
            success: true,
            msg: 'payment created',
        });
      } catch (error) {
        console.log(error);
  
        return res
          .status(500)
          .json({ error: true, msg: "Failed to create subscription" });
      }
}

module.exports = {
    getPayment,
    createPayment
}
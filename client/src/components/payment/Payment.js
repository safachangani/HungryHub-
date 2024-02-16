import React, { useEffect, useState } from 'react'
import './payment.css'
import paypalImage from '../../images/paypal.png';
import razorPayImage from '../../images/razorpay.svg'
import cashOnDelivery from '../../images/cod.png'
import card from '../../images/card.png'
import { PaymentScheme } from '../../validation/formValidation';
import { get, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from '../../axios';
import OrderSuccess from '../../components/order-success/OrderSuccess'
function Payment(props) {
    console.log(props.totalPrice);
    const totalPrice=props.totalPrice
    const [orderSuccess,setOrderSuccess] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(PaymentScheme)
    })
    const selectPayment = (data) => {
       const token = localStorage.getItem('token')
        console.log(data);
        axios.post('/users/create-order',{data,totalPrice},{
          headers:{
            Authorization: `Bearer ${token}`
          }
        }).then((response)=>{
            console.log(response.data.status);
            if (response.data.status==='placed') {
                setTimeout(()=>{

                    setOrderSuccess(true)
                },700)
            }
            else{
                console.log(response.data.razorpay);
                if (response.data.razorpay) {
                    razorpayment(response.data.razorpay)
                }
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    useEffect(()=>{
        console.log(orderSuccess);
        console.log(window);

    },[orderSuccess])
   const razorpayment =async (order)=>{
   const response = await axios.get('/users/getrzpKeyId')
   console.log(response.data.keyId);
   const keyId = response.data.keyId
    var options = {
        "key": keyId, // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "HungryHub", //your business name
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id":order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
           
            verifyPayment(response,order)
        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            "name": "safa c", //your customer's name
            "email": "safa81@gmail.com", 
            "contact": "79072232"  //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }

    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
   
        rzp1.open();
    
    
}

 const verifyPayment=(response,order)=>{
    const token = localStorage.getItem('token')
    axios.post('/users/verifyRazorPayment',{response,order},
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    ).then((response)=>{
        console.log(response.data.status);
        setTimeout(()=>{
            setOrderSuccess(true)
        },700)
    })
 }
    return (
        <div>
            <div className="payment">
                <h3>Payment</h3>
            </div>
            <div className="payment-info">

                <div className="payment-method">
                    <h3>Choose Payment Method</h3>
                    <div className="order-payment">
                        <form action="" onSubmit={handleSubmit(selectPayment)}>
                            <div className="methods">
                                <ul>
                                    <li>
                                        <input type="radio" name="test" id="cb1" value='paypal' {...register('test', { required: true })} />
                                        <label htmlFor="cb1" id='paypal'><img src={paypalImage} alt="paypal" />
                                        </label>
                                        <span>Paypal</span>
                                    </li>
                                    <li>
                                        <input type="radio" name="test" id="cb2" value='razorpay' {...register('test', { required: true })} />
                                        <label htmlFor="cb2"><img src={razorPayImage} alt='razorpay' /></label>
                                        <span>Razorpay</span>

                                    </li>
                                    <li>
                                        <input type="radio" name="test" id="cb4" value='cards' {...register('test', { required: true })} />
                                        <label htmlFor="cb4"><img src={card} id='card' alt='card' /></label>
                                        <span>Credit & Debit cards</span>

                                    </li>
                                    <li><input type="radio" name="test" id="cb3" value='cod' {...register('test', { required: true })} />
                                        <label htmlFor="cb3"><img src={cashOnDelivery} alt='cash on delivery'/></label>
                                        <span>cash on delivery</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="order-summary">
                                <p>{errors.test?.message}</p>
                                <button type='submit'>Order : Rs {totalPrice}</button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
          {orderSuccess &&  <OrderSuccess/>}
        </div>
    )
}

export default Payment

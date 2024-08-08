import React, { useEffect, useState } from 'react';
import './payment.css';
import paypalImage from '../../images/paypal.png';
import razorPayImage from '../../images/razorpay.svg';
import cashOnDelivery from '../../images/cod.png';
import card from '../../images/card.png';
import { PaymentScheme } from '../../validation/formValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../axios';
import OrderSuccess from '../../components/order-success/OrderSuccess';

function Payment(props) {
    const totalPrice = props.totalPrice;
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(PaymentScheme)
    });

    const selectPayment = (data) => {
        const token = localStorage.getItem('token');
        axios.post('/users/create-order', { data, totalPrice }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.data.status === 'placed') {
                const placedOrderId = response.data.orderId;
                setOrderId(placedOrderId);
                // Order is placed, now clear the cart
                axios.post('/users/clear-cart', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(() => {
                    setTimeout(() => {
                        setOrderSuccess(true);
                    }, 700);
                }).catch((error) => {
                    console.error("Error clearing cart:", error);
                });
            } else if (response.data.razorpay) {
                axios.post('/users/clear-cart', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(() => {
                    setTimeout(() => {
                        setOrderSuccess(true);
                    }, 700);
                }).catch((error) => {
                    console.error("Error clearing cart:", error);
                });
                setOrderId(response.data.orderId);
                razorpayment(response.data.razorpay);
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        console.log(orderSuccess);
    }, [orderSuccess]);

    const razorpayment = async (order) => {
        const response = await axios.get('/users/getrzpKeyId');
        const keyId = response.data.keyId;
        var options = {
            "key": keyId,
            "amount": order.amount,
            "currency": "INR",
            "name": "HungryHub",
            "description": "Test Transaction",
            "image": "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600",
            "order_id": order.id,
            "handler": function (response) {
                verifyPayment(response, order);
            },
            "prefill": {
                "name": "safa c",
                "email": "safa81@gmail.com",
                "contact": "79072232"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });

        rzp1.open();
    };

    const verifyPayment = (response, order) => {
        const token = localStorage.getItem('token');
        axios.post('/users/verifyRazorPayment', { response, order },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then(() => {
            setTimeout(() => {
                setOrderSuccess(true);
            }, 700);
        });
    };

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
                                        <input type="radio" name="test" id="cb2" value='razorpay' {...register('test', { required: true })} />
                                        <label htmlFor="cb2"><img src={razorPayImage} alt='razorpay' /></label>
                                        <span>Razorpay</span>
                                    </li>
                                  
                                    <li><input type="radio" name="test" id="cb3" value='cod' {...register('test', { required: true })} />
                                        <label htmlFor="cb3"><img src={cashOnDelivery} alt='cash on delivery' /></label>
                                        <span>cash on delivery</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="order-summary">
                                <p>{errors.test?.message}</p>
                                <button type='submit' disabled={totalPrice === 0}>Order : Rs {totalPrice}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {orderSuccess && <OrderSuccess orderId={orderId} />}
        </div>
    )
}

export default Payment;

package com.cloud.share.serviceImpl;


import com.cloud.share.dto.PaymentDto;
import com.cloud.share.dto.PaymentVerificationDto;
import com.cloud.share.entity.PaymentTransaction;
import com.cloud.share.entity.User;
import com.cloud.share.repository.PaymentTransactionRepo;
import com.cloud.share.service.UserService;
import com.cloud.share.util.CommonUtil;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.aspectj.bridge.IMessage;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.time.LocalDateTime;

@Service
public class PaymentService {

    @Autowired
    private UserService userService;

    @Autowired
    private UserCreditsService userCreditsService;

    @Autowired
    private PaymentTransactionRepo paymentTransactionRepo;

    @Value("{razor.key.id}")
        private String razorpayKeyId;

    @Value("{razor.key.secret}")
        private String razorpayKeySecret;


    public PaymentDto createOrder(PaymentDto paymentDto){
            try{
                User loggedInUser = CommonUtil.getLoggedInUser();
               String username = loggedInUser.getEmail();

                RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", paymentDto.getAmount());
                orderRequest.put("currency", paymentDto.getCurrency());
                orderRequest.put("receipt","order_"+System.currentTimeMillis());


               Order order = razorpayClient.orders.create(orderRequest);

               String orderId = order.get("id");


               // create pending transaction record
                PaymentTransaction paymentTransaction =PaymentTransaction.builder()
                        .username(username)
                        .orderId(orderId)
                        .planId(paymentDto.getPlanId())
                        .currency(paymentDto.getCurrency())
                        .status("PENDING")
                        .transactionDate(LocalDateTime.now())
                        .name(CommonUtil.getLoggedInUser().getName())
                        .build();

                paymentTransactionRepo.save(paymentTransaction);


                return PaymentDto.builder()
                        .orderId(orderId)
                        .success(true)
                        .message("order Created Successfully")
                        .build();

            } catch (Exception e) {
                return PaymentDto.builder()
                        .success(false)
                        .message("Error :"+e.getMessage())
                        .build();
            }
    }


    public PaymentDto verifyPayment(PaymentVerificationDto request){

        try{
            String username = CommonUtil.getLoggedInUser().getEmail();

          String data =  request.getRazorpay_order_id()+"|"+request.getRazorpay_payment_id();

         String generatedSignature = generateHmacSha256Signature(data,razorpayKeySecret);
         if(!generatedSignature.equals(request.getRazorpay_signature())){
            updateTransactionStatus(request.getRazorpay_order_id(),"FAILED",request.getRazorpay_payment_id(),null);
            return PaymentDto.builder()
                    .success(false)
                    .message("Payment verification failed")
                    .build();
         }

         // Add Credit based on plan
            int creditToAdd =0;
         String plan ="BASIC";

         switch (request.getPlanId()){
             case "premium":
                 creditToAdd =500;
                 plan = "PREMIUM";
                 break;
             case "ultimate":
                 creditToAdd =1000;
                 plan = "ULTIMATE";
                 break;
         }

         // add credit
         if(creditToAdd>0){
             userCreditsService.addCredits(username,creditToAdd,plan);
             updateTransactionStatus(request.getRazorpay_order_id(),"SUCCESS",request.getRazorpay_payment_id(),creditToAdd);
             return PaymentDto.builder()
                     .success(true)
                     .message("Payment Verified successfully")
                     .credits(userCreditsService.getUserCredit().getCredits())
                     .build();
         }else{
             updateTransactionStatus(request.getRazorpay_order_id(),"FAILED",request.getRazorpay_payment_id(),null);
             return  PaymentDto.builder()
                     .success(false)
                     .message("Invalid Plan selected")
                     .build();
         }

        } catch (Exception e) {
            try{
                updateTransactionStatus(request.getRazorpay_order_id(),"ERROR",request.getRazorpay_payment_id(),null);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
            return PaymentDto.builder()
                    .success(false)
                    .message("Error :"+e.getMessage())
                    .build();
        }

    }

    private void updateTransactionStatus(String razorpayOrderId, String status, String razorpayPaymentId, Integer creditsTOAdd) {
        paymentTransactionRepo.findAll().stream()
                .filter(t -> t.getOrderId()!=null && t.getOrderId().equals(razorpayOrderId))
                .findFirst().map(transaction ->{
                    transaction.setStatus(status);
                    transaction.setPaymentId(razorpayPaymentId);
                    if(creditsTOAdd != null){
                        transaction.setCreditAdded(creditsTOAdd);
                    }
                    return paymentTransactionRepo.save(transaction);
                }).orElse(null);
    }


    private String generateHmacSha256Signature(String data, String secret)
            throws Exception {
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes("UTF-8"), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(secretKey);

        byte[] hmacBytes = mac.doFinal(data.getBytes("UTF-8"));

        // Razorpay expects hex-encoded string, not Base64
        StringBuilder sb = new StringBuilder();
        for (byte b : hmacBytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }


}

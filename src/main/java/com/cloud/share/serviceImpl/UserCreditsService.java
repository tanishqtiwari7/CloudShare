package com.cloud.share.serviceImpl;

import com.cloud.share.entity.UserCredit;
import com.cloud.share.repository.UserCreditRepo;
import com.cloud.share.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserCreditsService {

    @Autowired
    private UserCreditRepo userCreditRepo;

    public UserCredit createInitialCredit(String email) {
        UserCredit credit = UserCredit.builder()
                .plan("BASIC")
                .credits(5)
                .username(email)
                .build();

        return userCreditRepo.save(credit);
    }


    public UserCredit getUserCredit(String email) {
      return userCreditRepo.findByUsername(email).orElseGet(()-> createInitialCredit(email));
    }


    public UserCredit getUserCredit() {
        String email = CommonUtil.getLoggedInUser().getEmail();
        return getUserCredit(email);
    }

    public Boolean hasEnoughCredits(int requiredCredits) {
        UserCredit credit = getUserCredit();
        return credit.getCredits() >= requiredCredits;
    }


    public UserCredit consumeCredits() {
        UserCredit userCredit = getUserCredit();

        if (userCredit.getCredits()<=0){
            return null;
        }

        userCredit.setCredits(userCredit.getCredits()-1);
      return   userCreditRepo.save(userCredit);
    }



    //add more credit if plan change
    public UserCredit addCredits(String email, int creditsToAdd,String plan) {
        UserCredit userCredit = userCreditRepo.findByUsername(email).orElseGet(() -> createInitialCredit(email));

        userCredit.setCredits(userCredit.getCredits()+creditsToAdd);
        userCredit.setPlan(plan);

        return userCreditRepo.save(userCredit);


    }

}



# 🚨 CRITICAL: Paystack Business Upgrade Required

## ⚠️ Current Issue

Your withdrawal system is showing this error:

```
"You cannot initiate third party payouts as a starter business"
```

**This means:** Your Paystack account is a "Starter Business" and needs to be upgraded to a "Registered Business" to enable withdrawals/transfers.

---

## 🔴 Why This Is Required

Paystack has different business tiers:

| Tier | Can Accept Payments | Can Send Transfers |
|------|-------------------|-------------------|
| **Starter Business** | ✅ Yes | ❌ No |
| **Registered Business** | ✅ Yes | ✅ Yes |

**For withdrawals to work, you MUST upgrade to Registered Business.**

---

## 📋 How to Upgrade Your Paystack Account

### Step 1: Login to Paystack Dashboard
Visit: https://dashboard.paystack.com/

### Step 2: Navigate to Settings
Go to: **Settings** → **Business Profile**

### Step 3: Complete Business Information

You'll need to provide:

#### Required Documents:
- ✅ **Business Registration Certificate** (CAC Certificate)
- ✅ **Tax Identification Number (TIN)**
- ✅ **Valid ID** (Driver's License, International Passport, or National ID)
- ✅ **Proof of Address** (Utility bill, bank statement)
- ✅ **Bank Account Details** (for settlements)

#### Business Information:
- Business Name (as registered)
- Business Address
- Business Type (e.g., Limited Liability Company)
- RC Number (Registration Number)
- Industry/Sector
- Website (if available)

### Step 4: Submit for Verification

1. Upload all required documents
2. Fill in all business details
3. Submit for review
4. Wait for Paystack approval (usually 1-3 business days)

### Step 5: Verification Complete

Once approved:
- ✅ You'll receive email confirmation
- ✅ Transfer API will be enabled
- ✅ Withdrawals will work

---

## 🏢 If You Don't Have a Registered Business

### Option 1: Register Your Business

**In Nigeria:**
1. Visit CAC website: https://www.cac.gov.ng/
2. Register as:
   - Business Name (Sole Proprietorship)
   - Limited Liability Company (LLC)
   - Incorporated Trustees (NGO)
3. Get your RC Number and Certificate
4. Use these to upgrade Paystack

**Cost:** ₦10,000 - ₦50,000 depending on business type

**Time:** 1-7 days

### Option 2: Use Personal Account (Limited)

Some payment providers allow personal accounts for transfers, but Paystack requires business registration for compliance.

**Alternative:** Consider using Flutterwave or other providers that support personal accounts.

---

## 🔄 Temporary Workaround (Not Recommended)

While waiting for business verification, you can:

### Manual Withdrawals:
1. Users request withdrawal via support
2. Admin manually transfers via bank
3. Record transaction in system

**Implementation:**
- Disable automatic withdrawals
- Add "Request Withdrawal" button
- Admin processes manually
- Update balance after confirmation

**Pros:**
- Works immediately
- No business verification needed

**Cons:**
- Manual work required
- Slower for users
- Not scalable

---

## 📝 Documents Checklist

Before starting upgrade process, gather:

- [ ] **CAC Certificate** (Business Registration)
- [ ] **TIN Certificate** (Tax ID)
- [ ] **Valid Government ID**
  - [ ] Driver's License, OR
  - [ ] International Passport, OR
  - [ ] National ID Card
- [ ] **Proof of Address** (less than 3 months old)
  - [ ] Utility Bill, OR
  - [ ] Bank Statement
- [ ] **Bank Account Details**
  - [ ] Account Number
  - [ ] Bank Name
  - [ ] Account Name (must match business name)
- [ ] **Business Information**
  - [ ] RC Number
  - [ ] Business Address
  - [ ] Business Phone
  - [ ] Business Email

---

## ⏱️ Timeline

| Step | Duration |
|------|----------|
| Gather documents | 1-7 days |
| Submit to Paystack | 1 hour |
| Paystack review | 1-3 business days |
| Approval & activation | Immediate |
| **Total** | **2-10 days** |

---

## 💰 Costs

### Business Registration (if needed):
- Business Name: ₦10,000 - ₦15,000
- Limited Company: ₦30,000 - ₦50,000
- Includes: CAC fees, legal fees, TIN registration

### Paystack Upgrade:
- **FREE** - No additional cost from Paystack

### Total:
- If already registered: ₦0
- If need to register: ₦10,000 - ₦50,000

---

## 🆘 Common Issues

### "My documents were rejected"

**Reasons:**
- Documents not clear/readable
- Information doesn't match
- Documents expired
- Wrong document type

**Solution:**
- Ensure high-quality scans
- Verify all information matches
- Use recent documents (< 3 months for proof of address)
- Contact Paystack support for specific requirements

### "Verification is taking too long"

**Normal:** 1-3 business days
**If longer:** Contact Paystack support

**Contact:**
- Email: support@paystack.com
- Phone: +234 1 888 3888
- Live Chat: Available on dashboard

### "I don't have all documents"

**Priority Order:**
1. CAC Certificate (Most Important)
2. TIN Certificate
3. Valid ID
4. Proof of Address
5. Bank Details

Start with what you have and work on getting the rest.

---

## 🔧 What to Do Right Now

### Immediate Actions:

1. **Disable Withdrawals Temporarily**
   - Update frontend to show "Coming Soon" message
   - Or show "Withdrawal under maintenance"

2. **Notify Users**
   - Add banner: "Withdrawal feature will be available soon"
   - Set expectations

3. **Start Upgrade Process**
   - Gather documents
   - Submit to Paystack
   - Follow up daily

4. **Alternative Solution**
   - Implement manual withdrawal requests
   - Process via admin panel
   - Temporary until automated system is ready

---

## 📧 Email Template for Paystack Support

If you need help:

```
Subject: Business Upgrade for Transfer API Access

Dear Paystack Support,

I am trying to enable the Transfer API for my business to process 
withdrawals for my users. I received the error "You cannot initiate 
third party payouts as a starter business."

I would like to upgrade my account to a Registered Business.

Business Details:
- Business Name: [Your Business Name]
- Email: [Your Email]
- Phone: [Your Phone]

I have the following documents ready:
- [List your available documents]

Could you please guide me through the upgrade process?

Thank you,
[Your Name]
```

---

## 🎯 Next Steps

### Short Term (Today):
1. ✅ Disable automatic withdrawals
2. ✅ Add maintenance message
3. ✅ Gather required documents

### Medium Term (This Week):
1. ✅ Submit documents to Paystack
2. ✅ Follow up on verification
3. ✅ Implement manual withdrawal process

### Long Term (After Approval):
1. ✅ Enable automatic withdrawals
2. ✅ Test thoroughly
3. ✅ Notify users
4. ✅ Monitor transactions

---

## 📞 Support Contacts

### Paystack Support:
- **Email:** support@paystack.com
- **Phone:** +234 1 888 3888
- **Dashboard:** https://dashboard.paystack.com/
- **Documentation:** https://paystack.com/docs/transfers/
- **Status:** https://status.paystack.com/

### CAC (Business Registration):
- **Website:** https://www.cac.gov.ng/
- **Email:** info@cac.gov.ng
- **Phone:** +234 1 904 2250

---

## ✅ Verification Checklist

Track your progress:

- [ ] Gathered all required documents
- [ ] Logged into Paystack Dashboard
- [ ] Navigated to Business Profile
- [ ] Uploaded CAC Certificate
- [ ] Uploaded TIN Certificate
- [ ] Uploaded Valid ID
- [ ] Uploaded Proof of Address
- [ ] Filled business information
- [ ] Added bank account details
- [ ] Submitted for review
- [ ] Received confirmation email
- [ ] Followed up with Paystack
- [ ] Verification approved
- [ ] Transfer API enabled
- [ ] Tested withdrawal functionality
- [ ] Enabled for users

---

## 🎉 After Approval

Once your business is verified:

1. **Test Withdrawals:**
   ```bash
   # Test with small amount first
   Amount: ₦100
   ```

2. **Enable for Users:**
   - Remove maintenance message
   - Announce feature availability
   - Monitor closely

3. **Monitor:**
   - Check Paystack dashboard daily
   - Review all transfers
   - Ensure sufficient balance

---

**Status:** 🔴 URGENT - Business Upgrade Required  
**Priority:** HIGH  
**Estimated Time:** 2-10 days  
**Cost:** ₦0 - ₦50,000 (depending on business registration status)

---

**⚠️ IMPORTANT:** Withdrawals will NOT work until your Paystack account is upgraded to Registered Business!

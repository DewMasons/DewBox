# Contribution System Quick Reference

## Current Users (All registered Dec 12, 2025)

All current users have the same cycle since they were all registered on December 12th:

- **ICA Period:** Day 12 to Day 21 of each month
- **PIGGY Period:** Day 22 to Day 11 of each month

### Today (December 12th)
✅ All users are currently in their **ICA period**

## How to Check Your Contribution Period

### API Endpoint
```
GET /contributions/info
Authorization: Bearer <token>
```

### Response
```json
{
  "status": "success",
  "data": {
    "type": "ICA",
    "mode": "auto",
    "dayOfMonth": 12,
    "registrationDay": 12,
    "icaPeriod": "Day 12 to Day 21",
    "piggyPeriod": "Day 22 to Day 11",
    "description": "Investment Cooperative Account - Yearly commitment with interest"
  }
}
```

## Contribution Types

### ICA (Investment Cooperative Account)
- **Duration:** 10 days (registration day to registration day + 9)
- **Behavior:** Money is transferred to admin wallet
- **Purpose:** Yearly investment with interest
- **Tracking:** Updates `ica_balance` in subscribers table

### PIGGY (Piggy Savings)
- **Duration:** ~20 days (remaining days of the cycle)
- **Behavior:** Money stays in user's wallet
- **Purpose:** Monthly savings
- **Tracking:** Updates `piggy_balance` in subscribers table

## Override Mode

Users can set `contribution_mode` to `all_ica` to always contribute to ICA regardless of the date:

```
PATCH /contributions/settings
{
  "mode": "all_ica"
}
```

## Testing Different Registration Dates

To test how different registration dates affect cycles:
```bash
node scripts/test_contribution_cycle.js
```

## Manual Date Updates

If you need to manually update a user's registration date:
```sql
UPDATE user SET createdAt = '2025-12-05 10:00:00' WHERE mobile = '2349116896136';
UPDATE subscribers SET createdAt = '2025-12-05 10:00:00' WHERE userId = '<user_id>';
```

Then restart the server or the user's next contribution will use the new cycle.

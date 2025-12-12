# Contribution Cycle Update - Registration-Based Monthly Cycle

## What Changed

The Piggy contribution system now starts the monthly cycle from each user's **registration date** instead of the beginning of the calendar month.

## How It Works

### Old System (Calendar-Based)
- ICA Period: Days 2-11 of every month
- PIGGY Period: Days 12-31 (and day 1) of every month
- Same for all users regardless of when they registered

### New System (Registration-Based)
- **ICA Period:** Registration day to (registration day + 9)
- **PIGGY Period:** (Registration day + 10) to (registration day - 1)
- Each user has their own personal monthly cycle

## Examples

### User registered on December 5th:
- ICA Period: Day 5 to Day 14 of each month
- PIGGY Period: Day 15 to Day 4 of each month

### User registered on December 12th (today):
- ICA Period: Day 12 to Day 21 of each month
- PIGGY Period: Day 22 to Day 11 of each month

### User registered on December 25th:
- ICA Period: Day 25 to Day 3 of each month (wraps around)
- PIGGY Period: Day 4 to Day 24 of each month

## Database Changes

Added `createdAt` column to both `user` and `subscribers` tables:
- Type: TIMESTAMP
- Default: CURRENT_TIMESTAMP
- Automatically set on registration

## API Changes

### GET `/contributions/info`
Now returns additional information:
```json
{
  "status": "success",
  "data": {
    "type": "ICA" or "PIGGY",
    "mode": "auto" or "all_ica",
    "dayOfMonth": 12,
    "registrationDay": 12,
    "icaPeriod": "Day 12 to Day 21",
    "piggyPeriod": "Day 22 to Day 11",
    "description": "..."
  }
}
```

## Benefits

1. **Fair for all users:** Everyone gets the same 10-day ICA period and ~20-day PIGGY period
2. **No rush at month start:** Users can register anytime without missing contribution windows
3. **Predictable cycles:** Users know their personal contribution schedule
4. **Better cash flow:** Contributions are distributed throughout the month

## Testing

Run the test script to see how different registration dates affect contribution cycles:
```bash
node scripts/test_contribution_cycle.js
```

## Date: December 12, 2025

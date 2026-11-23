# 🧪 Sample Test Cases & Verification Suite

This document outlines standard test cases and demo snippets to evaluate all capabilities of the **AI Code Review Assistant**.

---

## Test Case 1: Buggy & Insecure Authentication Handler

### Target Snippet (JavaScript)
```javascript
// Sample: Insecure User Authentication Handler
function authenticateUser(req, res) {
  var user_name = req.body.username;
  var user_pass = req.body.password;
  var unused_token = "debug_secret_key_123456";

  if (user_name == "admin" && user_pass == "admin123") {
    // CRITICAL: Hardcoded credentials & loose equality
    return res.status(200).json({ status: "success", role: "admin" });
  } else {
    res.status(401);
  }
}
```

### Expected Analysis Output:
1. **Stage 1 Static Linter**:
   - `no-var`: Line 2 (`var user_name`), Line 3 (`var user_pass`), Line 4 (`var unused_token`).
   - `no-unused-vars`: `unused_token` declared but never read.
   - `eqeqeq`: Loose equality `==` detected on Line 6.
   - `security/no-hardcoded-credentials`: Line 7 detected password literal `admin123`.
2. **Stage 2 AI Code Intelligence**:
   - Identifies risk of unhandled response when authentication fails (missing `res.send()` or `return`).
   - Suggests using bcrypt hash comparison rather than plaintext comparison.
   - Refactors code to modern async handler with standard error handling.
3. **Complexity & Quality Score**:
   - Quality Score: ~64/100
   - Cyclomatic Complexity: $M = 3$ (Decision points: `&&`, `if-else`).

---

## Test Case 2: Deeply Nested Algorithmic Complexity

### Target Snippet (JavaScript)
```javascript
function processOrders(orders, discounts, taxRate, userTier) {
  let finalPrice = 0;
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].status === 'ACTIVE') {
      for (let j = 0; j < discounts.length; j++) {
        if (discounts[j].tier === userTier) {
          if (orders[i].amount > 100) {
            finalPrice += orders[i].amount * (1 - discounts[j].rate);
          } else {
            finalPrice += orders[i].amount;
          }
        }
      }
    }
  }
  return finalPrice * (1 + taxRate);
}
```

### Expected Analysis Output:
1. **Complexity Analyzer**:
   - Cyclomatic Complexity: $M \ge 6$ (High / Moderate Complexity warning).
   - Code Smell: **Deep Nesting** (Depth 4 loops & branches).
   - Code Smell: **High Cognitive Load** (Requires refactoring into subroutines).
2. **AI Refactoring Recommendation**:
   - Split into `calculateDiscountedPrice()` helper.
   - Use array methods (`.reduce()`, `.filter()`).

---

## Test Case 3: Python Complex Analytics Engine

### Target Snippet (Python)
```python
def process_data(items=[], config={}):
    try:
        results = [x * 2 for x in items if x > 0]
        return results
    except:
        pass
```

### Expected Analysis Output:
1. **Static Analysis**:
   - Warning: Mutable default argument (`items=[]`, `config={}`).
   - Warning: Bare `except:` clause hides system interrupts and critical errors.
2. **AI Recommendation**:
   - Change default parameters to `items=None` and initialize inside function.
   - Catch specific exceptions (`except Exception as e:`).

---

## Test Case 4: Auto-Documentation Generation

### Target Snippet
```javascript
class PaymentGateway {
  chargeCustomer(customerId, amountInCents, currency = 'USD') {
    return { transactionId: 'txn_999', status: 'PAID' };
  }
}
```

### Expected Auto-Documentation Output:
- **JSDoc Generated**:
  ```javascript
  /**
   * Class representing PaymentGateway
   */
  class PaymentGateway {
    /**
     * Charges a customer the given amount in specified currency.
     * @param {string} customerId - The unique ID of the customer.
     * @param {number} amountInCents - Total charge in smallest currency unit.
     * @param {string} [currency='USD'] - ISO 4217 currency code.
     * @returns {Object} Transaction outcome details.
     */
    chargeCustomer(customerId, amountInCents, currency = 'USD') { ... }
  }
  ```

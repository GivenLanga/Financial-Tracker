# Why is "total income" always R0 in the chatbot?

## Possible Issues

1. **Redux Store Not Populated**

   - The chatbot uses `useSelector(state => state.transactions.items)` to get all transactions.
   - If the transactions slice is empty or not synced with your backend, the sum will be 0.

2. **Transactions Not Loaded on Chatbot Mount**

   - If you only fetch transactions on certain pages (e.g., Dashboard), but not globally, the chatbot will see an empty array.
   - Solution: Ensure transactions are fetched and available in Redux before the chatbot is used.

3. **Incorrect Transaction Types**

   - The code sums `t.type === "income"`. If your transaction objects use a different property or value (e.g., `"Income"` instead of `"income"`), the filter will fail.
   - Solution: Check your transaction data in Redux DevTools or console log it.

4. **Async Data Loading**

   - If transactions are loaded asynchronously, the chatbot may answer before the data is available.
   - Solution: Wait for transactions to load before allowing questions, or show a loading state.

5. **Data Source Mismatch**
   - If you use localStorage or another source for transactions elsewhere, but the chatbot only uses Redux, the data may be out of sync.

## How to Debug

- Add a `console.log(transactions)` in your `FinancialAI` component to see if the data is present and correct.
- Check the shape of each transaction: does it have `type: "income"` and a numeric `amount`?
- Make sure your Redux store is populated before the chatbot is used.

## Example Debugging Code

```jsx
const transactions = useSelector((state) => state.transactions.items || []);
console.log("Chatbot transactions:", transactions);
```

If you see an empty array or no "income" transactions, that's the root cause.

---

**Summary:**  
The chatbot can only answer correctly if the Redux store contains the actual transaction data with correct types.  
Make sure your app loads all transactions into Redux before using the chatbot.

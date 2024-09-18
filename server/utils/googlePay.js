// utils/mockPayment.js
const mockProcessPayment = async (paymentData, amount) => {
  // Simulate a successful payment response
  return {
    success: true,
    transactionId: "mock-transaction-id",
  };
};

module.exports = mockProcessPayment;

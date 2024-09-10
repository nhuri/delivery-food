const processGooglePayPayment = async (paymentData, totalAmount) => {
  // Mocking a successful payment for testing purposes
  return {
    success: true,
    transactionId: "mockTransaction12345",
  };
};

module.exports = {
  processGooglePayPayment,
};

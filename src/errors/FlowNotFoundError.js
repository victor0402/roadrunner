class FlowNotFoundError extends Error {
  constructor(data) {
    const message = `Flow not found. Data: ${JSON.stringify(data)}`;
    super(message)
  }
};

export default  FlowNotFoundError;
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const jsonDumpSafe = (object, activeKey) => {
  try {
    return JSON.stringify(object, getCircularReplacer(), 2)
  } catch (error) {
    console.error("Error serializing JSON:", error);
    console.log(object)
  }

  return null;
}

export default jsonDumpSafe;
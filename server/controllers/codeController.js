exports.runCode = async (req, res) => {
  const { code } = req.body;

  let output = [];

  const originalLog = console.log;

  console.log = (...args) => {
    output.push(args.join(" "));
  };

  try {
    const result = eval(code);

    console.log = originalLog;

    if (result !== undefined) {
      output.push(String(result));
    }

    res.json({
      success: true,
      output: output.join("\n"),
    });
  } catch (err) {
    console.log = originalLog;

    res.status(400).json({
      success: false,
      output: err.message,
    });
  }
};
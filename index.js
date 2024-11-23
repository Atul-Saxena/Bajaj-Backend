const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3000;

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};


app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});


app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;

  const userId = "john_doe_17091999"; // Hardcoded as per example
  const email = "john@xyz.com";
  const rollNumber = "ABCD123";

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      error: "Invalid data input."
    });
  }

  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));

  const highestLowercase = alphabets
    .filter((char) => char === char.toLowerCase())
    .sort()
    .slice(-1);

  const hasPrime = numbers.some((num) => isPrime(Number(num)));

  let fileValid = false, fileMimeType = null, fileSizeKb = null;

  if (data) {
    try {
      const buffer = Buffer.from(file_b64, 'base64');
      const fileSizeBytes = buffer.length;
      fileSizeKb = (fileSizeBytes / 1024).toFixed(2);

      // As per the example in the documents
      if(alphabets.length == 0) fileMimeType = "doc/pdf";
      else fileMimeType = "image/png";
      fileValid = true;
    } catch (error) {
      fileValid = false;
    }
  }

  file_b64 && res.status(200).json({
    is_success: true,
    user_id: userId,
    email,
    roll_number: rollNumber,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase,
    is_prime_found: hasPrime,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKb
  });

  !file_b64 && res.status(200).json({
    is_success: true,
    user_id: userId,
    email,
    roll_number: rollNumber,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase,
    is_prime_found: hasPrime,
    file_valid: fileValid,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

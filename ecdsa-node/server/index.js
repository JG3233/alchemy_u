const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes} = require("ethereum-cryptography/utils")

app.use(cors());
app.use(express.json());

const balances = {
  "03f82403241aec23c125779fdf9074b358735c276f30fe36c23c2664d49ee33d23": 100, // 0x508569ab6ad0170cb79e8f40d4bcb618fc46ce10e868d3b2911bc1b895990884
  "0235b114a8e604452c51147e119ae052164fd3da8e3ddd3fec7f79610fc9c74560": 50, // b7ac99526dd123884b2fa98d474bb23e39f52e154423bfe318d5229b83223b67
  "03871f71f06c3f05e1f3e1f2ef210048967e30ae356cc9210178e13b199da1ae3a": 75, // ab4994b6af7551776783de22059d1674756180496cc2a44e8491d46d4c3ecd2f
};

app.get("/balance/:privkey", (req, res) => {
  const { privkey } = req.params;
  const address = toHex(secp256k1.getPublicKey(privkey));
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  const address = toHex(secp256k1.getPublicKey(sender));

  setInitialBalance(address);
  setInitialBalance(recipient);

  if (balances[address] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[address] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[address] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

async function Ip(){
  const ip = await fetch('https://api.ipify.org?format=json');
  const data = await ip.json();
  return data.ip;
}

module.exports = Ip
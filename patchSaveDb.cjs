const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /async function saveDb\(\) \{[\s\S]*?\}\n/s;
const saveDbPatch = `async function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(storedData, null, 2), "utf-8");
  } catch (err) {}
  try {
    for (const b of storedData.bookings) {
      await Booking.findOneAndUpdate({ id: b.id }, { $set: b }, { upsert: true });
    }
  } catch(e) {}
}
`;

code = code.replace(regex, saveDbPatch);
fs.writeFileSync('server.ts', code);

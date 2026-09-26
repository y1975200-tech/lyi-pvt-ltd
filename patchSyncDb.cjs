const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /async function syncFromFirestore\(\) \{[\s\S]*?\}\n/s;
const patch = `async function syncFromFirestore() {
  try {
    const settings = await import('./serverModels.js').then(m => m.Settings.findOne());
    if (settings) {
      storedData.settings = settings.toObject();
    }
    const bookings = await import('./serverModels.js').then(m => m.Booking.find());
    if (bookings && bookings.length > 0) {
      storedData.bookings = bookings.map(b => b.toObject());
    }
  } catch (err) {}
}
`;

code = code.replace(regex, patch);
fs.writeFileSync('server.ts', code);

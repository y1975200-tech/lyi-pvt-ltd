import mongoose from 'mongoose';
import fs from 'fs';
import { Settings, Page, Service, Portfolio, ClientLogo, Industry, Testimonial, CaseStudy, Booking } from './serverModels.ts';

const DB_URI = process.env.MONGODB_URI || "mongodb+srv://usb:usb123@cluster0.bujenyg.mongodb.net/LYIPVTLTD?retryWrites=true&w=majority";

async function migrate() {
  await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB for migration");

  const data = JSON.parse(fs.readFileSync('./site-data.json', 'utf-8'));

  // Migrate Settings
  if (data.settings) {
    let s = await Settings.findOne();
    if (!s) {
      s = new Settings(data.settings);
      await s.save();
      console.log("Migrated Settings");
    }
  }

  // Migrate Pages
  if (data.cmsPages) {
    for (const [slug, pageData] of Object.entries(data.cmsPages)) {
      let p = await Page.findOne({ slug });
      if (!p) {
        p = new Page(pageData as any);
        await p.save();
        console.log(`Migrated Page: ${slug}`);
      }
    }
  }

  // Migrate Services
  if (data.services) {
    for (const srv of data.services) {
      let s = await Service.findOne({ slug: srv.slug || srv.id });
      if (!s) {
        s = new Service(srv);
        await s.save();
        console.log(`Migrated Service: ${s.title}`);
      }
    }
  }

  // Migrate Portfolio
  if (data.portfolio) {
    for (const port of data.portfolio) {
      let p = await Portfolio.findOne({ title: port.title });
      if (!p) {
        p = new Portfolio(port);
        await p.save();
        console.log(`Migrated Portfolio: ${p.title}`);
      }
    }
  }

  // Migrate Logos
  if (data.logos) {
    for (const logo of data.logos) {
      let l = await ClientLogo.findOne({ name: logo.name });
      if (!l) {
        l = new ClientLogo(logo);
        await l.save();
        console.log(`Migrated Logo: ${l.name}`);
      }
    }
  }

  // Migrate Bookings
  if (data.bookings) {
    for (const bk of data.bookings) {
      let b = await Booking.findOne({ id: bk.id });
      if (!b) {
        b = new Booking(bk);
        await b.save();
        console.log(`Migrated Booking: ${b.reference}`);
      }
    }
  }

  console.log("Migration Complete!");
  process.exit(0);
}

migrate();

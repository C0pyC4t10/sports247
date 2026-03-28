const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

async function generateSampleTemplate() {
    const width = 1080;
    const height = 1350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // ১. ব্যাকগ্রাউন্ড কালার দেওয়া (ধরি আপনার ব্র‍্যান্ডের কালার নেভি ব্লু বা কালো)
    ctx.fillStyle = '#111111'; // আপনি চাইলে আপনার ব্র‍্যান্ডের কালার কোড এখানে দিতে পারেন
    ctx.fillRect(0, 0, width, height);

    // ২. নিচের দিকে একটি স্ট্রিপ বা লোগোর জায়গা রাখা (স্যাম্পল হিসেবে)
    ctx.fillStyle = '#FFD700'; // গোল্ডেন কালার
    ctx.fillRect(0, height - 100, width, 100);

    // ৩. সেভ করার লোকেশন ঠিক করা
    const publicFolder = path.join(__dirname, 'public');
    const outputPath = path.join(publicFolder, 'template.png');

    // যদি public ফোল্ডার না থাকে, তাহলে তৈরি করে নিই
    if (!fs.existsSync(publicFolder)){
        fs.mkdirSync(publicFolder);
    }

    // ৪. ফাইল সেভ করা
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    console.log(`টেম্পলেট সফলভাবে তৈরি হয়েছে এবং এখানে সেভ হয়েছে: ${outputPath}`);
}

generateSampleTemplate();
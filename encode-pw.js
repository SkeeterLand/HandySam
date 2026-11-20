const password = process.argv[2];
if (!password) {
    console.log('Usage: node encode-pw.js <your-password>');
    process.exit(1);
}
console.log(encodeURIComponent(password));

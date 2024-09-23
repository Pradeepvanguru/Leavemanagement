const { SMTPServer } = require('smtp-server');
const simpleParser = require('mailparser').simpleParser;

const server = new SMTPServer({
  authOptional: true, // Set to true if you don't want authentication
  onData(stream, session, callback) {
    simpleParser(stream, (err, parsed) => {
      if (err) return callback(err);
      console.log(`Email received from ${parsed.from.text}:`);
      console.log(`Subject: ${parsed.subject}`);
      console.log(`Body: ${parsed.text}`);
      callback(null);
    });
  },
});

server.listen(587, () => {
  console.log('SMTP server is listening on port 587');
});

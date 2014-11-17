var assert      = require('assert');
var VaultClient = require('../src').VaultClient;
var RippleTxt   = require('../src').RippleTxt;
var AuthInfo    = require('../src').AuthInfo;
var Blob        = require('../src').Blob;
var sjcl        = ripple.sjcl;
var UInt256     = ripple.UInt256;
var nock        = require('nock');
var online      = process.argv.indexOf('--online') !== -1 ? true : false; 

var exampleData = {
  id: '547ef68397a0c216816ee690ba5bc091fd86b14174a3d5bf08c82b3f16ff4cce',
  crypt: '5d6dd146d0e41c77c731fc46a92746ef7915bcba259688efedb91b923cad9eaf',
  unlock: '30234de31f18fcb13d26d9d77c5c78dcf9ffa3643bb14c281e7ca56e06101d19',
  username: 'exampleUser',
  new_username : 'exampleUser-rename',
  password: 'pass word',
  domain: 'integration.rippletrade.com',
  masterkey : 'ssize4HrSYZShMWBtK6BhALGEk8VH',
  email_token : '77825040-9096-4695-9cbc-76720f6a8649',
  activateLink : 'https://staging.ripple.com/client/#/register/activate/',
  device_id : "ac1b6f6dbca98190eb9687ba06f0e066",
  identity_id : "17fddb71-a5c2-44ce-8b50-4b381339d4f2",
  blob: { 
    url: 'http://54.191.36.127:5993',
    id: '547ef68397a0c216816ee690ba5bc091fd86b14174a3d5bf08c82b3f16ff4cce',
    key: '5d6dd146d0e41c77c731fc46a92746ef7915bcba259688efedb91b923cad9eaf',
    data: { 
      auth_secret: 'd0aa918e693080a6a8d0ddc7f4dcf4bc0eecc3c3e3235f16a98661ee9c2e7a58',
      account_id: 'raVUps4RghLYkVBcpMaRbVKRTTzhesPXd',
      email: 'example@example.com',
      contacts: [ ],
      created: '2014-05-20T23:39:52.538Z',
      apps: [ ],
      lastSeenTxDate: 1401925490000,
      identityVault: { },
      revision: 2199,
      encrypted_secret: 'ACIdSmpv1Ikwhao5kdrcXASz3f9kDg/9oNfqKH6dyUvP0ZNW2Xt/mwYnRwKMUdAhrHLCGI49'
    }
  }
};

var rippleTxtRes = '[authinfo_url]\r\nhttp://54.191.36.127:5993/v1/authinfo\r\n' +
    '[accounts]\r\nraVUps4RghLYkVBcpMaRbVKRTTzhesPXd\r\n' +
    '[currencies]\r\nUSD\r\n';

var authInfoRes = {
  "body" : {
    "version" : 3,
    "blobvault" : "http://54.191.36.127:5993",
    "pakdf" : { 
      "modulus" : "ee419352d1693a785244282c22c5c74cdf2f5d40cb4bf5eee7cd3d37365082300c26bb68b58cfa04983eb95c2a8082a4e3e4eba333c546333e9cea3acd1fd50b24f8ce05d5cc6c896600570b315da4b70353748ed1ec5158ea3806fe208c2bb45f2b8731f89c13f009efd9dd23c9abb589df9ad270c3e7f2a111577b1679372054a3bf6ba9c43dcf49c37af0dc01f4b4f5de33986b7733564e26086d4e11a83ebd7a2a38a5fdca1cf1d39b1da8021c79be713428acdd796963501db8dae43af4159fd8e24575c87cc5a954c77a7fcbea7d8f99907a1d134d2c9577d216d4625363cb0b3a262c8cb9017e93c2b72025402f84499c343d5265ec2fc1a4d1c5cd59",
      "alpha" : "a4600a7e949f4a79cbf43996ea8d6e2523473bd54ad5841493cfdaddf1066e488d613bea61ee7220457b1bac25f659b63fedcd1c6df5e02841e2a1f067f4e4840b9436552d8f1875ec5b345c8cdd2e22a0f79f67ab94ba6a4432e6f0774ef34f2fd49d761695ac1a1fb4627c0f5933ea200d7f66e141ae7e79918f899b993f78e9ac49919a9f8f03dfeea6648b398e55364df1af13d8101650cedecb8473e46c4ad375b41b7142bed022fa85b30253e1221a9bd39a1eedfd06856aa47b6be18fcda735315ad7c06582c862d79c60e0dc4cc33e787d365f2788974c670340ae1941daa9110b327d68949e301fc08aa7639faf4dd558620f5d62bb9cea9ef3f1aa",
      "url" : "https://integration.auth.ripple.com/api/sign",
      "exponent" : "010001",
      "host" : "integration.auth.ripple.com"
    },
    "exists" : true,
    "username" : "exampleUser",
    "address" : "raVUps4RghLYkVBcpMaRbVKRTTzhesPXd",
    "emailVerified" : true,
    "reserved" : false,
    "profile_verified" : false,
    "identity_verified" : false
  }
}

var authInfoNewUsernameRes = {
  body : {
    version: 3,
    blobvault: 'http://54.191.36.127:5993',
    pakdf: {
      modulus: 'c7f1bc1dfb1be82d244aef01228c1409c1988943ca9e21431f1669b4aa3864c9f37f3d51b2b4ba1ab9e80f59d267fda1521e88b05117993175e004543c6e3611242f24432ce8efa3b81f0ff660b4f91c5d52f2511a6f38181a7bf9abeef72db056508bbb4eeb5f65f161dd2d5b439655d2ae7081fcc62fdcb281520911d96700c85cdaf12e7d1f15b55ade867240722425198d4ce39019550c4c8a921fc231d3e94297688c2d77cd68ee8fdeda38b7f9a274701fef23b4eaa6c1a9c15b2d77f37634930386fc20ec291be95aed9956801e1c76601b09c413ad915ff03bfdc0b6b233686ae59e8caf11750b509ab4e57ee09202239baee3d6e392d1640185e1cd',
      alpha: '7283d19e784f48a96062271a5fa6e2c3addf14e6ezf78a4bb61364856d580f13552008d7b9e3b60ebd9555e9f6c7778ec69f976757d206134e54d61ba9d588a7e37a77cf48060522478352d76db000366ef669a1b1ca93c5e3e05bc344afa1e8ccb15d3343da94180dccf590c2c32408c3f3f176c8885e95d988f1565ee9b80c12f72503ab49917792f907bbb9037487b0afed967fefc9ab090164597fcd391c43fab33029b38e66ff4af96cbf6d90a01b891f856ddd3d94e9c9b307fe01e1353a8c30edd5a94a0ebba5fe7161569000ad3b0d3568872d52b6fbdfce987a687e4b346ea702e8986b03b6b1b85536c813e46052a31ed64ec490d3ba38029544aa',
      url: 'https://integration.auth.ripple.com/api/sign',
      exponent: '010001',
      host: 'integration.auth.ripple.com'
    },
    exists: false,
    username: exampleData.new_username,
    emailVerified: false,
    reserved: false
  }
};

var signRes = {
  "result" : "success",
  "signres" : "302d41d4e314327d8ab7c10b344c28a3f26c223497eac0fad2698dbc3bca3b4acd941f5c06363db5ac35d91c9671aedd33d211b9d37532aac17f3ab795a0ac51e65df9e41306be5b0c92e9efa41d73848195afec7897aa25481f117079f2c13fd1817ea438445cb320f24e435832bde1af60fd47e08bf00d435e88f27f205d856234825cb9cb5af4053a92a54426de1ce6c5e8bdacb9af6482ccf2edb83f44bbd9d1c240ceb23cf9f5413dc13810ed17e8488b4ef192420ccc29e5ac7964b411fd8543c1ec6c5b61adb4ab842c4b1a6bacad7c9433564204f1a15cd6e4ddb512972ad005eec435fcfca3296d74c2c53f3bc1da18f537834d09e16506c91f1a79",
  "modulus" : "ee419352d1693a785244282c22c5c74cdf2f5d40cb4bf5eee7cd3d37365082300c26bb68b58cfa04983eb95c2a8082a4e3e4eba333c546333e9cea3acd1fd50b24f8ce05d5cc6c896600570b315da4b70353748ed1ec5158ea3806fe208c2bb45f2b8731f89c13f009efd9dd23c9abb589df9ad270c3e7f2a111577b1679372054a3bf6ba9c43dcf49c37af0dc01f4b4f5de33986b7733564e26086d4e11a83ebd7a2a38a5fdca1cf1d39b1da8021c79be713428acdd796963501db8dae43af4159fd8e24575c87cc5a954c77a7fcbea7d8f99907a1d134d2c9577d216d4625363cb0b3a262c8cb9017e93c2b72025402f84499c343d5265ec2fc1a4d1c5cd59",
  "alpha" : "a4600a7e949f4a79cbf43996ea8d6e2523473bd54ad5841493cfdaddf1066e488d613bea61ee7220457b1bac25f659b63fedcd1c6df5e02841e2a1f067f4e4840b9436552d8f1875ec5b345c8cdd2e22a0f79f67ab94ba6a4432e6f0774ef34f2fd49d761695ac1a1fb4627c0f5933ea200d7f66e141ae7e79918f899b993f78e9ac49919a9f8f03dfeea6648b398e55364df1af13d8101650cedecb8473e46c4ad375b41b7142bed022fa85b30253e1221a9bd39a1eedfd06856aa47b6be18fcda735315ad7c06582c862d79c60e0dc4cc33e787d365f2788974c670340ae1941daa9110b327d68949e301fc08aa7639faf4dd558620f5d62bb9cea9ef3f1aa",
  "exponent" : "010001"
};

var blobRes = {
  "result":"success",
  "encrypted_secret":"ACIdSmpv1Ikwhao5kdrcXASz3f9kDg/9oNfqKH6dyUvP0ZNW2Xt/mwYnRwKMUdAhrHLCGI49",
  "blob": "AIl1G2VKIuK1yFq/rk5TVuURG9oTwQ6RCDukDX7lENpUJCTDo8dETYY0iAyQlLOxK/NKEI5MEeZnEcJXiB/V7Fdf9Kb+n4SXdKboGO8mbRxHc+JzAcjXqXADeOZcJl7csXDKMaduLPQAKjXoz0oa6+YCqkiznybo7eNUZS1jXLHjv8jr73oAk+xMqm/sDaqYOvgyZO8JbSKuo/RHdzXpEdYpbCoEApr94MpqrU0SnqI5P2gcJweqoI2Hbs7wrI9shYK82rAiUKVxVuOQ1BHW+vLcMPQkV20g5Kq0eYTDhdXOJ/TX4fhqy8ibmD+KoFOTm8ycqWoyua+6ROPKW9DYmsX/4Xnuo8h+muKQg/DCEENM8dOUPJcarHtbQpXc6sLOuvzQnbDkc+B9NNTl/uGm4krCcl4zzv8JRn9Bq70b0Fm4NIMjocLLVltGUWlCdytA9fl4sGabqHFjbNH8QcdYE16YTpI+dcqxW4eE3xcu4DXeXYhJnXflI17DZV4vgAR0geucoyh6co5XF01KcSgPpgrhOSB3JFyIVPXElkYi6fZ7bgvLYJQoc5uqht+cheCj8NgRwauX4gnZTE6pKbWrkjQl2l1ng4WAMd5Bs1foDgHnYsn9olI2uy/Lcc5Hga/4ioHCDzUVOibvKDp79lPwm2jDFc0jC7NL33EBD0uRaQw9lP9ZdTwZ6oWqJCHI2ri48X6VFr5kmVh7Rfd+Z0+Kvklw6Vz3dmUHHM1DuFLvunMQUwQYGeMD/k6AbTS6PXGj+jFZGrEYWbKWkJCo+EoSZdBmyLpLPkcMVs1iNt1iu3aAbpeBrVmrw2EVAlPIOD2eT8onaDsfGnkLiRviOU3XPRclpgyfOZPTiV73qwa5DIGm9BTHVkG0zRPPftDpi8SDRen5JMbKVawjcacvwIMcWkEoje9fv1/lyn1XZBoDv+Bh+BnKDCWl694I3tiqO/I2dE2icCm37O/iev4VY8aOh6Ls5UWF9lqWpaMjBg+wXOx9s0QUDYL6i+b9/CMUxqrSXzrpTFKqmpG/kQGzYMRgSM9TJTWnjR1TS9pRmRNnc/Ks3FXOb8j/tdLqWYUCRqLSoumXnjw1OdThojzGCykAI04z/nYWMgY43qGBjyOeZkMsfb+1/zNGx7XOVx+utg9EtUhbEh1SUFX2lWnGIwLUrn8k+kFZ98/0z+zQLfxpwpTB+krBp1JUmPDEQEXAQvQlkqtx29i2/r4NS3ONOMwyXUjggkY/RXkxVOseWFhetjQz",
  "revision":2579,
  "email":"example@example.com",
  "quota":-2779,
  "patches":[],
  "identity_id":"0f63e623-bbce-4e01-8910-8381d0cc3117",
  "missing_fields":{"country":"missing","region":"missing"}
};


var recoverRes = {
  body: { 
    encrypted_secret: 'AAd69B9En2OF4O4LsjD+pFNeJHEGIuLh2hbla58zGvN7qU/16bDfy0QlFj8/Gu++AdFwH5U6',
    revision: 2403,
    blob_id: 'ef203d3e76552c0592384f909e6f61f1d1f02f61f07643ce015d8b0c9710dd2f',
    blob: 'AFfW9vuHJ2J5UMnEl4WrVIT9z2d+PPVNNHkqzN64b3pKDQcRPFp8vVEqL9B+YVs/KHhFVFNxxCNyVXwO/yGg4BAslYl8Ioo11IODmOltJmb94oKR/JVyfaY4bDWaOzAoa5N/c9LHpmd0L+9igK1o260MK5OZW4BQ6EG7I+8cYi5uM2CLguiddySu2yTEnyHW47zspWP33y2deh6p5mHtLdii/tmlm7b2rKpzrRVuLN/J09jqilhMxlCEr4X065YZLlQapJ45UWvpifejEw/6Qgl1WngZxwifHa504aR/QYhb1XCNeYbkjQ1MmkTmTef47Al4r/Irzoe//pDbAFA70XXkBUVUMAXWiOxU5V6gHO4yhXbTFEn7922JZlY7PIjo2Q+BxLkozMzuh8MZdoeadqffZX1fOuyTRWfPlqi7vIYgnUyTmThKe2EZv1LsB5ZUaX3KSArKDv1xPTKS0nexGNZoFckwEfVr6B2PGbMx8LPLYEEEmd95kh8NAKN1wkOPuBehLAtbMtcnLpTsotY6diqWdW4V9BSst0KDMTxZVfeesWD7/7ga9hzNvAWO1MN3aAvDCiQVufb44i4Qfu6fLS7+nxtcDCN2PqPHcANcW0cUhUNB50ajzNwRXN8B92CiY0zkS61CzWeooHOslGp0Acau1CJy8iHGyjzbPS4ui8F2h2TbDUuInOoMqiRjXFvRTxA=',
    encrypted_blobdecrypt_key: 'AA9vUokfQ1WXEOArl2DUwY3cxgXGKj9uNEqrJQzUu0hqXIWRu1V+6l1qqxXKPnm9BNscMpm0BMSbxUz++lfV50c1B4akvrzIBH+MUUgNyyPcHR7JBgjEYt0=',
    patches: [],
    result: 'success' 
    }
  }
 
var getProfileRes = {
  "result":"success",
  "addresses":[],
  "attributes":[{
    "attribute_id":"4034e477-ffc9-48c4-bcbc-058293f081d8",
    "identity_id":"17fddb71-a5c2-44ce-8b50-4b381339d4f2",
    "name":"email",
    "type":"default",
    "domain":null,
    "value":"example@example.com",
    "visibility":"public",
    "updated":null
    }
  ]
};

var blob = new Blob();
  blob.url       = exampleData.blob.url;
  blob.id        = exampleData.blob.id;
  blob.device_id = exampleData.device_id;
  blob.key       = exampleData.blob.key;
  blob.identity_id = exampleData.blob.identity_id;
  blob.data      = exampleData.blob.data;
  blob.revision  = exampleData.blob.data.revision;
  
//must be set for self signed certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
while(!sjcl.random.isReady()) {
  sjcl.random.addEntropy(require('crypto').randomBytes(128).toString('base64')); //add entropy to seed the generator
}

var mockRippleTxt;
var mockRippleTxt2;
var mockAuthSign;
var mockRegister;
var mockBlob;
var mockRename;
var mockUpdate;
var mockRecover;
var mockVerify;
var mockEmail;
var mockProfile;
var mockDelete;

if (!online) {
  mockRippleTxt = nock('https://integration.rippletrade.com')
    .get('/ripple.txt')
    .reply(200, rippleTxtRes, {
      'Content-Type': 'text/plain'
    }); 

  mockRippleTxt2 = nock('http://54.191.36.127:5993' + exampleData.domain)
    .get('/ripple.txt')
    .reply(200, rippleTxtRes, {
      'Content-Type': 'text/plain'
    }); 

  mockAuthSign = nock('https://integration.auth.ripple.com')
    .persist()
    .post('/api/sign')
    .reply(200, signRes, {
      'Content-Type': 'text/plain'
    });   

  mockRegister = nock('http://54.191.36.127:5993');
  mockRegister.filteringPath(/(v1\/user\?signature(.+))/g, 'register/')
    .post('/register/')
    .reply(200, { result: 'error', message: 'User already exists' }, {
      'Content-Type': 'application/json'
    });   

  mockDelete = nock('http://54.191.36.127:5993');
  mockDelete.filteringPath(/(v1\/user\/(.+))/g, 'delete/')
    .delete('/delete/')
    .reply(200, { result: 'success' }, {
      'Content-Type': 'application/json'
    });  

  mockBlob = nock('http://54.191.36.127:5993');
  mockBlob.get('/v1/authinfo?domain=' + exampleData.domain + '&username=' + exampleData.username.toLowerCase())
    .reply(200, JSON.stringify(authInfoRes.body), {
      'Content-Type': 'application/json'
    });   

  mockBlob.get('/v1/authinfo?domain=' + exampleData.domain + '&username=' + exampleData.new_username.toLowerCase())
    .reply(200, JSON.stringify(authInfoNewUsernameRes.body), {
      'Content-Type': 'application/json'
    });   

  mockBlob.filteringPath(/(blob\/.+)/g, 'blob/')
    .persist()
    .get('/v1/blob/')
    .reply(200, JSON.stringify(blobRes), {
      'Content-Type': 'application/json'
    });    

  mockRename = nock('http://54.191.36.127:5993/v1/user/');
  mockRename.filteringPath(/((.+)\/rename(.+))/g, 'rename/')
    .post('rename/')
    .reply(200, {result:'success',message:'rename'}, {
      'Content-Type': 'application/json'
    });  

  mockUpdate = nock('http://54.191.36.127:5993/v1/user/');
  mockUpdate.filteringPath(/((.+)\/updatekeys(.+))/g, 'update/')
    .post('update/')
    .reply(200, {result:'success',message:'updateKeys'}, {
      'Content-Type': 'application/json'
    });  

  mockRecover = nock('http://54.191.36.127:5993/')
  mockRecover.filteringPath(/((.+)user\/recov\/(.+))/g, 'recov/')
    .get('recov/')
    .reply(200, recoverRes.body, {
      'Content-Type': 'application/json'
    });  

  mockVerify = nock('http://54.191.36.127:5993/v1/user/');
  mockVerify.filteringPath(/((.+)\/verify(.+))/g, 'verify/')
    .get('verify/')
    .reply(200, {result:'error', message:'invalid token'}, {
      'Content-Type': 'application/json'
    });                     

  mockEmail = nock('http://54.191.36.127:5993/v1/user');
  mockEmail.filteringPath(/((.+)\/email(.+))/g, 'email/')
    .post('email/')
    .reply(200, {result:'success'}, {
      'Content-Type': 'application/json'
    });  
}

describe('Ripple Txt', function () {
  it('should get the content of a ripple.txt file from a given domain', function(done) {
    RippleTxt.get(exampleData.domain, function(err, resp) {
      assert.ifError(err);
      assert.strictEqual(typeof resp, 'object');
      done();
    });
  });
  
  it('should get currencies from a ripple.txt file for a given domain', function(done) {
    RippleTxt.getCurrencies(exampleData.domain, function(err, currencies) {
      assert.ifError(err);
      assert(Array.isArray(currencies));
      done();
    });
  });
  
  it('should get the domain from a given url', function() {
    var domain = RippleTxt.extractDomain("http://www.example.com");
    assert.strictEqual(typeof domain, 'string');
  });  
});

describe('AuthInfo', function() {  
  it('should get auth info', function(done) {
    AuthInfo.get(exampleData.domain, exampleData.username, function(err, resp) {
      assert.ifError(err);
      Object.keys(authInfoRes.body).forEach(function(prop) {
        assert(resp.hasOwnProperty(prop));
      });
      done();
    });
  });
});


describe('VaultClient', function () {
  var client = new VaultClient(exampleData.domain);

  describe('#initialization', function() {
    it('should be initialized with a domain', function() {
      var client = new VaultClient({ domain: exampleData.domain });
      assert.strictEqual(client.domain, exampleData.domain);
    });

    it('should default to ripple.com without a domain', function () {
      var client = new VaultClient();
      assert.strictEqual(client.domain, 'ripple.com');
    });
  });

  describe('#exists', function() {
    it('should determine if a username exists on the domain', function(done) {
      this.timeout(10000);
      client.exists(exampleData.username, function(err, resp) {
        assert.ifError(err);
        assert.strictEqual(typeof resp, 'boolean');
        done();
      });
    });
  });

  describe('#login', function() {
    it('with username and password should retrive the blob, crypt key, and id', function(done) {
      this.timeout(10000);
      client.login(exampleData.username, exampleData.password, exampleData.device_id, function(err, resp) {
        if (online) {
          assert.ifError(err);
          assert.strictEqual(typeof resp, 'object');
          assert.strictEqual(typeof resp.username, 'string');
          assert.strictEqual(typeof resp.verified, 'boolean');
          assert.strictEqual(typeof resp.emailVerified, 'boolean');
          assert.strictEqual(typeof resp.profileVerified, 'boolean');
          assert.strictEqual(typeof resp.identityVerified, 'boolean');
          checkBlob(resp.blob);
        } else {
          assert(err instanceof Error);
          assert.strictEqual(resp, void(0));
        }
        done();
      });
    });
  });

  describe('#relogin', function() {
    it('should retrieve the decrypted blob with blob vault url, id, and crypt key', function(done) {
      this.timeout(10000);
      client.relogin(exampleData.blob.url, exampleData.id, exampleData.crypt, exampleData.device_id, function(err, resp) {
        assert.ifError(err);
        assert.strictEqual(typeof resp, 'object');
        checkBlob(resp.blob);
        done();
      });
    });
  });

  describe('#unlock', function() {
    it('should access the wallet secret using encryption secret, username and password', function (done) {
      this.timeout(10000);
      client.unlock(exampleData.username, exampleData.password, blobRes.encrypted_secret, function(err, resp) {
        if (online) {
          assert.ifError(err);
          assert.strictEqual(typeof resp.keys, 'object');
          assert.strictEqual(resp.keys.unlock, exampleData.unlock);
          assert.strictEqual(resp.secret, exampleData.masterkey);
        } else {
          assert.strictEqual(err.toString(), 'CORRUPT: ccm: tag doesn\'t match');
          assert.strictEqual(resp, void(0));
        }
        done();
      });
    });
  });

  describe('#loginAndUnlock', function () {
    it('should get the decrypted blob and decrypted secret given name and password', function (done) {
      this.timeout(10000);
      client.loginAndUnlock(exampleData.username, exampleData.password, exampleData.device_id, function(err, resp) {
        if (online) {
          assert.ifError(err);
          assert.strictEqual(typeof resp, 'object');
          assert(resp.blob instanceof Blob);
          assert.strictEqual(typeof resp.blob.id, 'string');
          assert(UInt256.from_json(resp.blob.id).is_valid());
          assert.strictEqual(typeof resp.blob.key, 'string');
          assert(UInt256.from_json(resp.blob.key).is_valid());
          assert.strictEqual(typeof resp.unlock, 'string');
          assert(UInt256.from_json(resp.unlock).is_valid());
          assert.strictEqual(typeof resp.secret, 'string');
          assert.strictEqual(typeof resp.username, 'string');
          assert.strictEqual(typeof resp.verified, 'boolean');
        } else {
          assert(err instanceof Error);
          assert.strictEqual(resp, void(0));
        }
        done();
      });
    });
  });

  describe('#register', function () {
    it('should create a new blob', function (done) {
      this.timeout(10000);
      var options = {
        username     : exampleData.username,
        password     : exampleData.password,
        email        : exampleData.blob.data.email,
        activateLink : exampleData.activateLink,
        domain       : exampleData.domain
      }
      
      client.register(options, function(err, resp) {
        //fails, user already exists
        assert(err instanceof Error);
        assert.strictEqual(err.toString(), 'Error: User already exists');
        assert.strictEqual(resp, void(0));
        done();
      });
    });
  });


  describe('#deleteBlob', function () {
    it('should remove an existing blob', function (done) {
      this.timeout(10000);
      
      var options = {
        url         : exampleData.blob.url,
        blob_id     : online ? "zzzz" : exampleData.blob.id,
        account_id  : exampleData.blob.data.account_id,
        masterkey   : exampleData.masterkey
      }
      
      client.deleteBlob(options, function(err, resp) {
        assert.ifError(err);  
        assert.strictEqual(typeof resp, 'object');
        assert.strictEqual(typeof resp.result,  'string');          
        done();
      });
    });
  });  
});




describe('Blob', function () {
  var client;
  var resp;

  client = new VaultClient({ domain: exampleData.domain });

  before(function(done) {
    if (online) {
      this.timeout(10000);
  
      client.login(exampleData.username, exampleData.password, exampleData.device_id, function(err, res) {
        resp = res;
        blob = res.blob;
        done();
      });
    } else { 
       
      mockBlob.filteringPath(/(blob\/.+)/g, 'blob/')
        .persist()
        .post('/v1/blob/')
        .reply(200, {result:'success'}, {
          'Content-Type': 'application/json'
        });        
 
      done();
    }
  });

  describe('#rename', function () {
    it('should change the username of a blob', function (done) {
      this.timeout(20000);

      var options = {
        username     : exampleData.username,
        new_username : exampleData.new_username,
        password     : exampleData.password,
        masterkey    : exampleData.masterkey,
        blob         : blob
      }
      
       
      client.rename(options, function(err, resp) {
        assert.ifError(err);
        assert.strictEqual(typeof resp, 'object');
        assert.strictEqual(typeof resp.result,  'string');
        assert.strictEqual(typeof resp.message, 'string');
        
        if (online) {  
          options.username     = exampleData.new_username;
          options.new_username = exampleData.username;
          
          //change it back
          client.rename(options, function(err,resp){
            assert.ifError(err);
            assert.strictEqual(typeof resp, 'object');
            assert.strictEqual(typeof resp.result,  'string');
            assert.strictEqual(typeof resp.message, 'string');
            done();
          });
          
        } else {
          done();
        }
      });
    });
  });  
   
  describe('#changePassword', function () {
    it('should change the password and keys of a blob', function (done) {
      this.timeout(10000);

      var options = {
        username     : exampleData.username,
        password     : exampleData.password,
        masterkey    : exampleData.masterkey,
        blob         : blob
      }
        
      client.changePassword(options, function(err, resp) {
        assert.ifError(err);
        assert.strictEqual(typeof resp, 'object');
        assert.strictEqual(typeof resp.result,  'string');
        assert.strictEqual(typeof resp.message, 'string');    
        done();
      });
    });
  });  
  
  describe('#recoverBlob', function () {
    it('should recover the blob given a username and secret', function (done) {
      this.timeout(10000);

      var options = {
        url       : exampleData.blob.url,  
        username  : exampleData.username,
        masterkey : exampleData.masterkey,
      }
        
      client.recoverBlob(options, function(err, blob) {
        assert.ifError(err);
        assert(blob instanceof Blob);   
        done();
      });
    });
  }); 
 
  describe('#verifyEmail', function () {
    it('should verify an email given a username and token', function (done) {
      this.timeout(10000);

      client.verify(exampleData.username, exampleData.email_token, function(err, resp) {
        //result will be error, because of invalid token
        assert(err instanceof Error);
        assert.strictEqual(resp, void(0));
        done();
      });
    });
  }); 
  
  describe('#resendVerifcationEmail', function () {
    it('should resend a verification given options', function (done) {
      this.timeout(10000);

      var options = {
        url          : exampleData.blob.url,
        id           : exampleData.blob.id,
        username     : exampleData.username,
        account_id   : exampleData.blob.data.account_id,
        email        : exampleData.blob.data.email,
        activateLink : exampleData.activateLink,
        masterkey    : exampleData.masterkey
      }
      client.resendEmail(options, function(err, resp) {
        assert.ifError(err);  
        assert.strictEqual(typeof resp, 'object');
        assert.strictEqual(typeof resp.result,  'string');
        done();
      });
    });
  });   
  
  it('#set', function(done) {
    this.timeout(10000)
    blob.extend('/testObject', {
      foo: [],
    }, function(err, resp) {

      assert.ifError(err);
      assert.strictEqual(resp.result, 'success');
      done();
    });
  });

  it('#extend', function(done) {
    this.timeout(10000)
    blob.extend('/testObject', {
      foobar: 'baz',
    }, function(err, resp){
      assert.ifError(err);
      assert.strictEqual(resp.result, 'success');
      done();
    });
  });

  it('#unset', function(done) {
    this.timeout(10000)
    blob.unset('/testObject', function(err, resp){
      assert.ifError(err);
      assert.strictEqual(resp.result, 'success');
      done();
    });
  });

  it('#unshift', function(done) {
    this.timeout(10000)
    blob.unshift('/testArray', {
      name: 'bob',
      address: '1234'
    }, function(err, resp){
      assert.ifError(err);
      assert.strictEqual(resp.result, 'success');
      done();
    });
  });

  it('#filter', function(done) {
    this.timeout(10000)

    blob.filter('/testArray', 'name', 'bob', 'extend', '', {description:'Alice'}, function(err, resp){
      assert.ifError(err);
      assert.strictEqual(resp.result, 'success');
      done();
    });
  });

  it('#consolidate', function(done) {
    this.timeout(10000)
    blob.unset('/testArray', function(err, resp){
      assert.ifError(err);
      assert.strictEqual(resp.result, 'success');
      blob.consolidate(function(err, resp){
        assert.ifError(err);
        assert.strictEqual(resp.result, 'success');
        done();
      });
    });
  });  

  describe('identity', function() {
    it('#identity_set', function (done) {
      this.timeout(10000);

      blob.identity.set('address', exampleData.unlock, {city:"San Francisco", region:"CA"}, function (err, resp) {
        assert.ifError(err);
        assert.strictEqual(resp.result, 'success');
        done();          
      });
    });  

    it('#identity_get', function () {
      var property = blob.identity.get('address', exampleData.unlock);
      assert.ifError(property.error);   
      assert.strictEqual(typeof property.encrypted, 'boolean');     
      assert.notEqual(typeof property.value, 'undefined');  
    });      

    it('#identity_getAll', function () {
      var obj = blob.identity.getAll(exampleData.unlock);  
      assert.strictEqual(typeof obj, 'object');       
    }); 

    it('#identity_getFullAddress', function () {
      var address = blob.identity.getFullAddress(exampleData.unlock);  
      assert.strictEqual(typeof address, 'string');       
    });      

    it('#identity_unset', function (done) {
      this.timeout(10000);

      blob.identity.unset('name', exampleData.unlock, function (err, resp) {
        assert.ifError(err);
        assert.strictEqual(resp.result, 'success');
        done();          
      });
    });      
  });

  describe('identityVault', function() {
    it('#identity - Get Attestation', function (done) {
      var options = {
        url         : blob.url,
        auth_secret : blob.data.auth_secret,
        blob_id     : blob.id,
      };
      
      options.type = 'identity';
      
      nock('http://54.191.36.127:5993')
        .filteringPath(/(v1\/attestation\/identity(.+))/g, '')
        .post('/')
        .reply(200, {
          result: 'success', 
          status: 'verified', 
          attestation: 'eyJ6IjoieiJ9.eyJ6IjoieiJ9.sig', 
          blinded:'eyJ6IjoieiJ9.eyJ6IjoieiJ9.sig'
        },  {'Content-Type': 'application/json'}); 
      
      client.getAttestation(options, function(err, resp) {
        assert.ifError(err);
        assert.strictEqual(resp.result, 'success');
        assert.strictEqual(typeof resp.attestation, 'string'); 
        assert.strictEqual(typeof resp.blinded, 'string'); 
        assert.deepEqual(resp.decoded, {"header":{"z":"z"},"payload":{"z":"z"},"signature":"sig"})
        done();
      });
    });
    
    it('#identity - Update Attestation', function (done) {

      var options = {
        url         : blob.url,
        auth_secret : blob.data.auth_secret,
        blob_id     : blob.id,
      };
      
      options.type = 'identity';
      
      nock('http://54.191.36.127:5993')
        .filteringPath(/(v1\/attestation\/identity\/update(.+))/g, '')
        .post('/')
        .reply(200, {
          result: 'success', 
          status: 'verified', 
          attestation: 'eyJ6IjoieiJ9.eyJ6IjoieiJ9.sig', 
          blinded:'eyJ6IjoieiJ9.eyJ6IjoieiJ9.sig'
        },  {'Content-Type': 'application/json'});       
      
      client.updateAttestation(options, function(err, resp) {
        assert.ifError(err);
        assert.strictEqual(resp.result, 'success');
        assert.strictEqual(typeof resp.attestation, 'string'); 
        assert.strictEqual(typeof resp.blinded, 'string'); 
        assert.deepEqual(resp.decoded, {"header":{"z":"z"},"payload":{"z":"z"},"signature":"sig"})
        done();
      });
    }); 
        
    it('#identity - Get Attestation Summary', function (done) {

      var options = {
        url         : blob.url,
        auth_secret : blob.data.auth_secret,
        blob_id     : blob.id,
      };
      
      nock('http://54.191.36.127:5993')
        .filteringPath(/(v1\/attestation\/summary(.+))/g, '')
        .get('/')
        .reply(200, {
          result: 'success', 
          attestation: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjY2ZGI3MzgxIn0%3D.eyJwcm9maWxlX3ZlcmlmaWVkIjpmYWxzZSwiaWRlbnRpdHlfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2lkLnJpcHBsZS5jb20iLCJzdWIiOiIwNDMzNTA0ZS0yYTRmLTQ1NjktODQwMi1lYWI2YTU0YTgzYjUiLCJleHAiOjE0MTI4MTc2NjksImlhdCI6MTQxMjgxNTgwOX0%3D.Jt14Y2TsM7fKqGWn0j16cPldlYqRr7%2F2dptBsdZuZhRGRTREO4TSpZZhBaU95WL3M9eXIfaoSs8f2pTOa%2BBGAYHZSZK4%2FLqeWdDH8zz8Bx9YFqGije1KmHQR%2FeoWSp1GTEfcq5Oho4nSHozHhGNN8IrDkl8woMvWb%2FE1938Y5Zl2vyv7wjlNUF4ND33XWzJkvQjzIK15uYfaB%2FUIsNW32udfHAdkigesdMDNm%2BRGBqHMDZeAMdVxzrDzE3m8oWKDMJXbcaLmk75COfJrLWYiZCHd7VcReyPEZegwEucetZJ9uDnoBcvw0%2B6hIRmjTN6Gy1eeBoJaiDYsWuOwInbIlw%3D%3D', 
        },  {'Content-Type': 'application/json'});       
      
      client.getAttestationSummary(options, function(err, resp) {
        assert.ifError(err);
        assert.strictEqual(resp.result, 'success');
        assert.strictEqual(typeof resp.attestation, 'string'); 
        assert.strictEqual(typeof resp.decoded.header, 'object'); 
        assert.strictEqual(typeof resp.decoded.payload, 'object'); 
        assert.strictEqual(typeof resp.decoded.signature, 'string'); 
        done();
      });
    });            
  });
    
  //only do these offline
  if (!online) {
  
    describe('2FA', function() {

    it('#2FA_set2FA', function (done) {
      blob.set2FA({masterkey:exampleData.masterkey}, function(err, resp){
        assert.ifError(err);  
        assert.strictEqual(typeof resp, 'object');
        assert.strictEqual(typeof resp.result,  'string');
        done();    
      });  
    }); 
    
    it('#2FA_get2FA', function (done) {
      blob.get2FA(function(err, resp) {
        assert.ifError(err);  
        assert.strictEqual(typeof resp, 'object');
        assert.strictEqual(typeof resp.result,  'string');
        done();
      });
    }); 
    
      it('#2FA_requestToken', function (done) {
        client.requestToken(exampleData.blob.url, exampleData.blob.id, function(err, resp){
          assert.ifError(err);  
          assert.strictEqual(typeof resp, 'object');
          assert.strictEqual(typeof resp.result,  'string');
          done();
        });
      });       

      it('#2FA_verifyToken', function (done) {
        var options = {
          url         : exampleData.blob.url,
          id          : exampleData.blob.id,
          device_id   : client.generateDeviceID(),
          token       : "5555",
          remember_me : true
         }

        client.verifyToken(options, function(err, resp){
          assert.ifError(err);  
          assert.strictEqual(typeof resp, 'object');
          assert.strictEqual(typeof resp.result,  'string');
          done();          
        });
      });     
    });
  }
  
  if (!online) {
    after(function () {
      nock.restore();
    });
  }
});


function checkBlob (blob) {
  assert(blob instanceof Blob);
  assert.strictEqual(typeof blob.id, 'string');
  assert(UInt256.from_json(blob.id).is_valid());
  assert.strictEqual(typeof blob.key, 'string');
  assert(UInt256.from_json(blob.key).is_valid());
  assert.strictEqual(typeof blob.data, 'object');
  assert.strictEqual(typeof blob.revision, 'number');
  assert.strictEqual(typeof blob.encrypted_secret, 'string');
  assert.strictEqual(typeof blob.identity_id, 'string');
}
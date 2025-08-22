const bcrypt = require('bcryptjs');

describe('bcryptjs hash/compare', () => {
  test('hash/compare works with valid password', async () => {
    const password = 'secret123';
    const hash = await bcrypt.hash(password, 10);
    
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(10);
    
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  test('compare returns false for wrong password', async () => {
    const password = 'secret123';
    const wrongPassword = 'wrong123';
    const hash = await bcrypt.hash(password, 10);
    
    const isValid = await bcrypt.compare(wrongPassword, hash);
    expect(isValid).toBe(false);
  });

  test('hash generates different results for same password', async () => {
    const password = 'secret123';
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(password, 10);
    
    expect(hash1).not.toBe(hash2);
  });
});

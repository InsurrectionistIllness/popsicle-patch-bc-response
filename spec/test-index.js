var tape    = require('tape'),
    patcher = require('../index');


tape.test('lowercasing should work', assert => {
    assert.equal(
    patcher.toLowerCase('FOO'),
    'foo'
);

assert.equal(
    patcher.toLowerCase('FOO bar'),
    'foo bar'
);

assert.equal(
    patcher.toLowerCase('foo \n Bar'),
    'foo \n bar'
);

assert.end();
});

tape.test('flags should be found', assert => {
    assert.equal(
    patcher.flagPresent('--foo--', 'foo'),
    true
);

assert.equal(
    patcher.flagPresent('--foo bar--', 'foo bar'),
    true
);
assert.equal(
    patcher.flagPresent('--fo o--', 'foo'),
    false
);

assert.equal(
    patcher.flagPresent('--foo  bar--', 'foo bar'),
    false
);

assert.end();
});

tape.test('arrays of flags should map to arrays of booleans', assert => {
    assert.deepEqual(
    patcher.mapFlagPresence(['foo', 'bar'], '--foo bar--'),
    [true, true]
);

assert.deepEqual(
    patcher.mapFlagPresence(['- foo', 'baz'], '--foo bar--'),
    [false, false]
);

assert.deepEqual(
    patcher.mapFlagPresence(['o ', '---'], '--foo bar--'),
    [true, false]
);

assert.end();
});

tape.test('checkFlags should return the correct boolean', assert => {
    assert.deepEqual(
    patcher.checkFlags(['foo', 'bar'], '--foo bar--'),
    true,
    'multiple matches'
);

assert.deepEqual(
    patcher.checkFlags(['- foo', 'ar-'], '--foo bar--'),
    true,
    'one match'
);

assert.deepEqual(
    patcher.checkFlags(['- foo', 'baz'], '--foo bar--'),
    false,
    'no matches'
);

assert.end();
});

tape.test('`checkLoginResponse` should recognise the real "red flags"', assert => {
    assert.deepEqual(
    patcher.checkLoginResponse({body: '--foo bar--'}),
    false,
    'auth probably succeeded'
);

assert.deepEqual(
    patcher.checkLoginResponse({body: '--foo Unauthorised bar--'}),
    true,
    'auth probably failed (a)'
);

assert.deepEqual(
    patcher.checkLoginResponse({body: '--foo Unauthorized bar--'}),
    true,
    'auth probably failed (b)'
);

assert.deepEqual(
    patcher.checkLoginResponse({body: '--foo Please log in to continue bar--'}),
    true,
    'auth probably failed (c)'
);

assert.deepEqual(
    patcher.checkLoginResponse({body: '--foo you could not be logged in bar--'}),
    true,
    'auth probably failed (d)'
);

assert.deepEqual(
    patcher.checkLoginResponse({body: '--foo secure zone access denied bar--'}),
    true,
    'auth probably failed (e)'
);

assert.end();
});
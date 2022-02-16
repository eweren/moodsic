import { sleep } from './utils';

test('Sleep should work', async () => {
  const startDate = new Date().valueOf();
  await sleep(100);
  const endDate = new Date().valueOf();
  expect(endDate - startDate).toBeGreaterThanOrEqual(100);
});

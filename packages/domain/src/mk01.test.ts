import { test } from 'node:test';
import assert from 'node:assert';
import { calculateOnTimePublishRate, ContentItem } from './mk01';

test('MK01 calculateOnTimePublishRate', () => {
  assert.strictEqual(calculateOnTimePublishRate([]), 0);

  const now = new Date();
  const past = new Date(now.getTime() - 100000);
  const future = new Date(now.getTime() + 100000);

  const items: ContentItem[] = [
    { scheduled_at: future, published_at: now, status: 'PUBLISHED' }, // On time
    { scheduled_at: past, published_at: now, status: 'PUBLISHED' }, // Late
    { scheduled_at: future, status: 'SCHEDULED' }, // Not published yet
    { scheduled_at: future, status: 'DRAFT' } // Ignored
  ];

  // Required: 3 (2 published, 1 scheduled)
  // On time: 1
  // Rate = 1 / 3 * 100 = 33.333%
  assert.strictEqual(Math.round(calculateOnTimePublishRate(items)), 33);
});

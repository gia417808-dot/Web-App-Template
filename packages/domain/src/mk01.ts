export interface ContentItem {
  scheduled_at: Date;
  published_at?: Date | null;
  status: string;
}

export function calculateOnTimePublishRate(contents: ContentItem[]): number {
  if (contents.length === 0) return 0;
  
  const requiredToPublish = contents.filter(c => c.status === 'PUBLISHED' || c.status === 'SCHEDULED');
  if (requiredToPublish.length === 0) return 0;

  const onTimePublished = requiredToPublish.filter(c => {
    if (c.status !== 'PUBLISHED' || !c.published_at) return false;
    // Check if published on or before scheduled date (allowing some tolerance, say 1 hour, but exact for simplicity)
    return c.published_at.getTime() <= c.scheduled_at.getTime();
  });

  return (onTimePublished.length / requiredToPublish.length) * 100;
}

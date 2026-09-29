import crypto from 'node:crypto';

export function getTenantId(req: any): string | null {
  return req.headers['x-tenant-id'] || null;
}

export function tenantMiddleware(req: any, res: any, next: any) {
  const tenantId = getTenantId(req);
  if (!tenantId) {
    return res.status(401).json({ error: 'Missing x-tenant-id header' });
  }
  req.tenantId = tenantId;
  next();
}

export function generateAuditLog(action: string, entityId: string, diff: any) {
  return {
    id: crypto.randomUUID(),
    action,
    entityId,
    diff,
    timestamp: new Date().toISOString()
  };
}

export function createIdempotencyKey(): string {
  return crypto.randomUUID();
}

export function getTenantId(req: any) {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) throw new Error('Missing tenant id');
  return tenantId;
}

export const tenantMiddleware = (req: any, res: any, next: any) => {
  const tenantId = req.headers['x-tenant-id'];
  if (tenantId) {
    req.tenantId = tenantId;
  }
  next();
};
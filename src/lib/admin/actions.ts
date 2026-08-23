export const ADMIN_RESOURCES = [
  'users',
  'companies',
  'jobs',
  'applications',
  'reports',
  'tickets',
] as const;

export type AdminResource = (typeof ADMIN_RESOURCES)[number];

type AdminActionDefinition = {
  action: string;
  values: readonly (string | boolean)[];
};

const ACTIONS: Record<AdminResource, readonly AdminActionDefinition[]> = {
  users: [{ action: 'set-suspended', values: [true, false] }],
  companies: [{ action: 'set-verified', values: [true, false] }],
  jobs: [{ action: 'set-status', values: ['draft', 'active', 'closed', 'archived'] }],
  applications: [
    {
      action: 'set-status',
      values: ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted', 'withdrawn'],
    },
  ],
  reports: [
    { action: 'set-status', values: ['pending', 'reviewing', 'resolved', 'dismissed'] },
  ],
  tickets: [
    {
      action: 'set-status',
      values: ['open', 'in_progress', 'waiting_customer', 'waiting_internal', 'resolved', 'closed'],
    },
  ],
};

export type ValidAdminAction = {
  resource: AdminResource;
  id: string;
  action: string;
  value: string | boolean;
};

export function parseAdminAction(input: unknown):
  | { ok: true; value: ValidAdminAction }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'A JSON action payload is required.' };
  }

  const candidate = input as Record<string, unknown>;
  const resource = candidate.resource;
  const id = candidate.id;
  const action = candidate.action;
  const value = candidate.value;

  if (typeof resource !== 'string' || !ADMIN_RESOURCES.includes(resource as AdminResource)) {
    return { ok: false, error: 'Unsupported admin resource.' };
  }

  if (
    typeof id !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
  ) {
    return { ok: false, error: 'A valid resource ID is required.' };
  }

  if (typeof action !== 'string') {
    return { ok: false, error: 'A valid admin action is required.' };
  }

  const definition = ACTIONS[resource as AdminResource].find((item) => item.action === action);
  if (!definition || !definition.values.some((allowedValue) => allowedValue === value)) {
    return { ok: false, error: 'That action or value is not allowed.' };
  }

  return {
    ok: true,
    value: {
      resource: resource as AdminResource,
      id,
      action,
      value: value as string | boolean,
    },
  };
}

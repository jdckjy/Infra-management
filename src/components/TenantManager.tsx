
import React from 'react';
import { Tenant } from '../types';

interface TenantManagerProps {
  tenants: Tenant[];
  onTenantsUpdate: (tenants: Tenant[]) => void;
}

const TenantManager: React.FC<TenantManagerProps> = ({ tenants, onTenantsUpdate }) => {
  return (
    <div>
      <h2>Tenant Roster</h2>
      {/* Render tenants and manage them */}
    </div>
  );
};

export default TenantManager;

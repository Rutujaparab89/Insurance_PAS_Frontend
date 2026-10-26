
export interface DashboardMenuItem {
  label: string;
  path?: string;
}

export interface DashboardMenuGroup {
  label: string;
  icon: string;
  path?: string;
  children?: DashboardMenuItem[];
}

export const ADMIN_MENU: DashboardMenuGroup[] = [
  {
    label: 'Dashboard',
    icon: 'bi-speedometer2',
    path: '/admin/dashboard'
  },
  {
    label: 'Customer',
    icon: 'bi-people',
    children: [
      { label: 'Customer List', path: '/admin/customers' },
      { label: 'KYC Verification' }
    ]
  },
  {
    label: 'Agent',
    icon: 'bi-person-badge',
    children: [
      { label: 'Agent List' },
      { label: 'Commission Management' },
      { label: 'Agent Performance' }
    ]
  },
  {
    label: 'Products',
    icon: 'bi-box-seam',
    children: [
      { label: 'Product List' },
      { label: 'Product Benefits' }
    ]
  },
  {
    label: 'Quotes',
    icon: 'bi-file-earmark-text',
    children: [
      { label: 'Quote List' }
    ]
  },
  {
    label: 'Policies',
    icon: 'bi-shield-check',
    children: [
      { label: 'Policy List' },
      { label: 'Approve Policy' },
      { label: 'Cancel Policy' },
      { label: 'Renew Policy' }
    ]
  },
  {
    label: 'Premiums',
    icon: 'bi-cash-stack',
    children: [
      { label: 'Premium Schedule' },
      { label: 'Due Premium' },
      { label: 'Paid Premium' }
    ]
  },
  {
    label: 'Payments',
    icon: 'bi-credit-card',
    children: [
      { label: 'Payment History' }
    ]
  },
  {
    label: 'Claims',
    icon: 'bi-clipboard-check',
    children: [
      { label: 'Claim List' },
      { label: 'Approve/Reject Claim' },
      { label: 'Claim Settlement' }
    ]
  },
  {
    label: 'Documents',
    icon: 'bi-folder',
    children: [
      { label: 'Customer Document' },
      { label: 'Policy Document' },
      { label: 'Claim Document' }
    ]
  },
  {
    label: 'Reports',
    icon: 'bi-bar-chart',
    children: [
      { label: 'Policy Reports' },
      { label: 'Claim Reports' },
      { label: 'Renew Reports' },
      { label: 'Premium Reports' },
      { label: 'Agent Reports' }
    ]
  }
];

export const AGENT_MENU: DashboardMenuGroup[] = [
  {
    label: 'Dashboard',
    icon: 'bi-speedometer2',
    path: '/agent/dashboard'
  },
  {
    label: 'Customer',
    icon: 'bi-people',
    children: [
      { label: 'Customer List', path: '/agent/customers' }
    ]
  },
  {
    label: 'Quotes',
    icon: 'bi-file-earmark-text',
    children: [
      { label: 'Quote List' }
    ]
  },
  {
    label: 'Policies',
    icon: 'bi-shield-check',
    children: [
      { label: 'Policy List' },
      { label: 'Policy Renewal' }
    ]
  },
  {
    label: 'Premiums',
    icon: 'bi-cash-stack',
    children: [
      { label: 'Due Premium' },
      { label: 'Paid Premium' },
      { label: 'Premium History' }
    ]
  },
  {
    label: 'Claims',
    icon: 'bi-clipboard-check',
    children: [
      { label: 'Raise Claim Customer' },
      { label: 'Claim History' },
      { label: 'Claim Status' }
    ]
  },
  {
    label: 'Documents',
    icon: 'bi-folder',
    children: [
      { label: 'Upload KYC' },
      { label: 'Upload Claim Document' }
    ]
  },
  {
    label: 'Commission',
    icon: 'bi-wallet2',
    children: [
      { label: 'Commission History' },
      { label: 'Earning Summary' }
    ]
  },
  {
    label: 'Profile',
    icon: 'bi-person-circle'
  }
];

export const CUSTOMER_MENU: DashboardMenuGroup[] = [
  {
    label: 'Dashboard',
    icon: 'bi-speedometer2',
    path: '/customer/dashboard'
  },
  {
    label: 'My Profile',
    icon: 'bi-person-circle',
    children: [
      { label: 'Personal Details' },
      { label: 'Address Details' },
      { label: 'Nominee Details' },
      { label: 'KYC Document' }
    ]
  },
  {
    label: 'Insurance Products',
    icon: 'bi-shield-check',
    children: [
      { label: 'Health Insurance' },
      { label: 'Life Insurance' },
      { label: 'Vehicle Insurance' }
    ]
  },
  {
    label: 'Quotes',
    icon: 'bi-file-earmark-text',
    children: [
      { label: 'My Quotes' }
    ]
  },
  {
    label: 'My Policies',
    icon: 'bi-shield-check',
    children: [
      { label: 'Active Policies' },
      { label: 'Policy Details' },
      { label: 'Expired Policies' },
      { label: 'Download Policy' }
    ]
  },
  {
    label: 'Premiums',
    icon: 'bi-cash-stack',
    children: [
      { label: 'Paid Premium' },
      { label: 'Payment History' }
    ]
  },
  {
    label: 'Claims',
    icon: 'bi-clipboard-check',
    children: [
      { label: 'Raise Claim' },
      { label: 'Claim Status' },
      { label: 'Claim History' }
    ]
  },
  {
    label: 'Documents',
    icon: 'bi-folder',
    children: [
      { label: 'Upload Document' }
    ]
  },
  {
    label: 'Support',
    icon: 'bi-headset',
    children: [
      { label: 'Raise Request' },
      { label: 'Contact Agent' }
    ]
  }
];

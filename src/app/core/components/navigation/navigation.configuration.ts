import { NavGroups, NavItemIconType } from '~/shared/models/navigation.model';

export const getNavigationConfig: () => NavGroups = () => {
  return [
    {
      items: [
        {
          display: 'VAT Recovery',
          icon: {
            path: 'recovery',
            type: NavItemIconType.Sprite,
          },
          url: '/vat-recovery',
          isAuthorized: true,
          children: [
            {
              display: 'Your Invoices',
              // roleName: 'invoices',
              url: '/invoices',
              isAuthorized: true,
            },
            {
              display: 'Your Reclaims',
              // roleName: 'reclaims',
              url: '/reclaims',
              isAuthorized: true,
            },
            {
              display: 'Compliance Assurance',
              roleName: 'ComplianceAssurance',
              url: '/compliance-assurance',
              isAuthorized: false,
            },
            {
              display: 'Optimize Recovery',
              // roleName: 'invoices',
              url: '/optimize-recovery',
              isAuthorized: true,
            },
            {
              display: 'Your Vendors',
              // roleName: 'invoices',
              url: '/your-vendors',
              isAuthorized: true,
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          display: 'Tax Tailor',
          icon: {
            path: 'tax_tailor',
            type: NavItemIconType.Sprite,
          },
          url: '/tailored',
          roleName: 'dvr',
          isAuthorized: false,
          isExact: true,
          children: [
            {
              display: 'Cases',
              roleName: 'dvr',
              url: '/tailored/cases',
              isAuthorized: false,
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          display: 'NMI',
          icon: {
            path: 'nmi',
            type: NavItemIconType.Sprite,
          },
          url: '/nmi/generator/list',
          roleName: 'nmi',
          isAuthorized: false,
        },
      ],
    },
    {
      items: [
        {
          display: 'Vendor Direct',
          url: '/vendor_direct',
          roleName: 'vendorDirect',
          isAuthorized: false,
        },
      ],
    },
    {
      items: [
        {
          display: 'Compliance Trainer',
          url: '/compliance_trainer',
          roleName: 'complianceTrainer',
          isAuthorized: false,
        },
      ],
    },
    {
      items: [
        {
          display: 'Benefit in Kind',
          url: '/bik',
          // TODO: Add role and change isAuthorized - to false
          roleName: 'bik',
          isAuthorized: true,
          isExact: true,
          children: [
            {
              display: 'Analyzed Expenses',
              roleName: 'bik',
              url: '/bik/analyzed-expenses',
              isAuthorized: true,
            },
            {
              display: 'Analysis Rules',
              roleName: 'bik',
              url: '/bik/analysis-rules',
              isAuthorized: true,
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          display: 'Corporate Income Tax',
          url: '/corporate_income_tax',
          roleName: 'corporateIncomeTax',
          isAuthorized: false,
        },
      ],
    },
    {
      items: [
        {
          display: 'Account Setup',
          icon: {
            path: 'settings',
            type: NavItemIconType.Inbuilt,
          },
          url: '/account-setup',
          // roleName: 'accountSetup',
          isAuthorized: true,
          children: [
            {
              display: 'Entities Management',
              icon: {
                path: 'entities-management',
                type: NavItemIconType.Inbuilt,
              },
              url: '/entities-management',
              // roleName: 'EntitiesManagement',
              isAuthorized: true,
            },
            {
              display: 'Admin Settings',
              icon: {
                path: 'admin-settings',
                type: NavItemIconType.Inbuilt,
              },
              url: '/admin-settings',
              roleName: 'AdminSettings',
              isAuthorized: false,
            },
          ]
        },
      ],
    },
  ];
};
